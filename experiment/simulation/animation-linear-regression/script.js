const $ = (id) => document.getElementById(id);

const modeRadios = document.querySelectorAll('input[name="appMode"]');
const modeSelectorMenu = $('modeSelectorMenu');
const modeDatasetEl = $('modeDataset');
const modeInteractiveEl = $('modeInteractive');
const backMenuBtn = document.getElementById('backMenuBtn'); // Note: You'll need to make sure this button is selected or added if it exists in Dataset mode too

// DOM Elements - Dataset Analysis
const datasetSelect = $('datasetSelect');
const linearCanvas = $('linearCanvas');
const linearCtx = linearCanvas.getContext('2d');
const linearFormulaEl = $('linearFormula');
const featureSelectBox = $('featureSelectBox');
const linearFeatureSelect = $('linearFeatureSelect');
const linearSampleSelect = $('linearSampleSelect');
const datasetMSEEl = $('datasetMSE');
const stepsSalary = $('stepsSalary');
const stepsCar = $('stepsCar');
const sampleSelectLabel = $('sampleSelectLabel');
const testSplitSlider = $('testSplitSlider');
const testSplitValue = $('testSplitValue');

// DOM Elements - Interactive Generator
const interactiveCanvas = $('interactiveCanvas');
const interactiveCtx = interactiveCanvas.getContext('2d');
const interactiveMSE = $('interactiveMSE');
const interactiveRMSE = $('interactiveRMSE');
const interactiveTestMSE = $('interactiveTestMSE');
const interactiveTestRMSE = $('interactiveTestRMSE');
const interactiveR2 = $('interactiveR2');
const interactiveTestR2 = $('interactiveTestR2');
const interactiveTotalPts = $('interactiveTotalPts');
const interactiveTrainPts = $('interactiveTrainPts');
const interactiveTestPts = $('interactiveTestPts');
const interactiveTrainRatio = $('interactiveTrainRatio');
const interactiveTestRatio = $('interactiveTestRatio');
const splitRadios = document.querySelectorAll('input[name="pointSplitMode"]');
const linWSlider = $('linW');
const linBSlider = $('linB');
const linWValue = $('linWValue');
const linBValue = $('linBValue');
const resetLinearBtn = $('resetLinearBtn');
const resetInteractiveBtn = $('resetInteractiveBtn');
const trainBtn = $('trainBtn');

// Data
let salaryRecords = [];
let carRecords = [];

// State
const state = {
  appMode: 'menu', // 'menu' | 'dataset' | 'interactive'
  dataset: 'salary', // 'salary' | 'car'
  carFeature: 'Present_Price',
  linear: { w: 1, b: 0 },
  interactivePoints: [],
  interactiveViewport: { x: [-100, 100], y: [-100, 100] },
  hoveredPoint: null,
  pointSplitMode: 'train', // 'train' | 'test' | 'hide' | null (null = pan mode)
  rafId: null,
  dataLoaded: false,
  previousLine: null,
  pointsModifiedSinceFit: false,
  isPanning: false,
  panStartPx: null,
  panStartVr: null,
  // Dataset Analysis additions
  datasetSplit: { train: [], test: [] },
  datasetHoveredPoint: null,
  datasetMetrics: {
    correlation: 0,
    train: { r2: 0, mse: 0, rmse: 0 },
    test: { r2: 0, mse: 0, rmse: 0 }
  },
  testSplitPercentage: 20, // Default 20% test data
  datasetViewport: null, // null means auto-fit, otherwise { x: [min, max], y: [min, max] }
  // Dataset Pan State
  datasetIsPanning: false,
  datasetPanStartPx: null,
  datasetPanStartVr: null,
  datasetPanEnabled: false
};

// Utils
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const std = (arr) => {
  if (arr.length <= 1) return 1;
  const m = mean(arr);
  const v = arr.reduce((acc, x) => acc + (x - m) ** 2, 0) / arr.length;
  return Math.sqrt(v) || 1;
};
const fmtTick = (v) => {
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString('en-US');
  if (Math.abs(v) >= 100) return v.toFixed(1).replace(/\.0$/, '');
  return v.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
};

// Seeded Random Number Generator (Linear Congruential Generator)
function seededRandom(seed) {
  let state = seed;
  return function() {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

// Fisher-Yates Shuffle with Seed
function shuffleWithSeed(array, seed) {
  const arr = [...array];
  const rng = seededRandom(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Train/Test Split Function
function splitTrainTest(records, testPercentage = 20, seed = 42) {
  if (!records || records.length === 0) {
    return { train: [], test: [] };
  }
  
  const shuffled = shuffleWithSeed(records, seed);
  const testSize = Math.floor(shuffled.length * (testPercentage / 100));
  const trainSize = shuffled.length - testSize;
  
  const train = shuffled.slice(0, trainSize).map(r => ({ ...r, split: 'train' }));
  const test = shuffled.slice(trainSize).map(r => ({ ...r, split: 'test' }));
  
  return { train, test };
}

// Pearson Correlation Coefficient
function calculateCorrelation(xValues, yValues) {
  if (!xValues || !yValues || xValues.length !== yValues.length || xValues.length < 2) {
    return 0;
  }
  
  const n = xValues.length;
  const xMean = mean(xValues);
  const yMean = mean(yValues);
  
  let numerator = 0;
  let xVariance = 0;
  let yVariance = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean;
    const yDiff = yValues[i] - yMean;
    numerator += xDiff * yDiff;
    xVariance += xDiff * xDiff;
    yVariance += yDiff * yDiff;
  }
  
  const denominator = Math.sqrt(xVariance * yVariance);
  if (denominator === 0) {
    return 0;
  }
  
  return numerator / denominator;
}

// CSV Parser
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      let v = values[i] ? values[i].trim() : '';
      obj[h] = isNaN(v) || v === '' ? v : Number(v);
    });
    return obj;
  });
}

// Categorical Encoding Function
function encodeCategoricalFeatures(record) {
  // Encode Fuel_Type: Petrol=0, Diesel=1, CNG=2
  if (record.Fuel_Type === 'Petrol') {
    record.Fuel_Type_Encoded = 0;
  } else if (record.Fuel_Type === 'Diesel') {
    record.Fuel_Type_Encoded = 1;
  } else if (record.Fuel_Type === 'CNG') {
    record.Fuel_Type_Encoded = 2;
  } else {
    record.Fuel_Type_Encoded = 0; // default to Petrol
  }

  // Encode Seller_Type: Dealer=0, Individual=1
  if (record.Seller_Type === 'Dealer') {
    record.Seller_Type_Encoded = 0;
  } else if (record.Seller_Type === 'Individual') {
    record.Seller_Type_Encoded = 1;
  } else {
    record.Seller_Type_Encoded = 0; // default to Dealer
  }

  // Encode Transmission: Manual=0, Automatic=1
  if (record.Transmission === 'Manual') {
    record.Transmission_Encoded = 0;
  } else if (record.Transmission === 'Automatic') {
    record.Transmission_Encoded = 1;
  } else {
    record.Transmission_Encoded = 0; // default to Manual
  }

  return record;
}

// Load Data
async function loadDatasets() {
  try {
    const slrRes = await fetch('Salary_Data.csv');
    const slrText = await slrRes.text();
    salaryRecords = parseCSV(slrText).map((r, i) => ({ index: i + 1, ...r }));

    const carRes = await fetch('car_data.csv');
    const carText = await carRes.text();
    carRecords = parseCSV(carText)
      .map((r, i) => ({ index: i + 1, ...r }))
      .filter(r => r.Selling_Price !== undefined && r.Present_Price !== undefined)
      .map(r => encodeCategoricalFeatures(r)); // Apply categorical encoding

    state.dataLoaded = true;
    updateDatasetUI();
  } catch (e) {
    console.error("Error loading CSVs:", e);
  }
}

// Dataset Logic
function getActiveRecords() {
  return state.dataset === 'salary' ? salaryRecords : carRecords;
}

function getActiveXFeature() {
  return state.dataset === 'salary' ? 'YearsExperience' : state.carFeature;
}

function getActiveYFeature() {
  return state.dataset === 'salary' ? 'Salary' : 'Selling_Price';
}

function getXValues() {
  const feature = getActiveXFeature();
  return getActiveRecords().map(r => r[feature]);
}

function getYValues() {
  const feature = getActiveYFeature();
  return getActiveRecords().map(r => r[feature]);
}

function computeDatasetOLS() {
  const xs = getXValues();
  const ys = getYValues();
  if (!xs.length) return null;

  const xBar = mean(xs);
  const yBar = mean(ys);

  let num = 0, den = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - xBar) * (ys[i] - yBar);
    den += (xs[i] - xBar) ** 2;
  }

  const w = den === 0 ? 0 : num / den;
  const b = yBar - w * xBar;

  return { w, b };
}

function getLinearRanges() {
  // If viewport is set (zoomed), use it
  if (state.datasetViewport) {
    return state.datasetViewport;
  }
  
  // Otherwise, auto-fit to data
  const xs = getXValues();
  const ys = getYValues();
  if (!xs.length) return { x: [0, 1], y: [0, 1] };

  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);

  const yLow = Math.min(...ys);
  const yHigh = Math.max(...ys);
  const yPad = Math.max(0.1, (yHigh - yLow) * 0.15);
  const xPad = Math.max(0.1, (xMax - xMin) * 0.15);

  return {
    x: [xMin - xPad, xMax + xPad],
    y: [yLow - yPad, yHigh + yPad]
  };
}

function updateDatasetUI() {
  if (!state.dataLoaded) return;

  const records = getActiveRecords();
  const xFeature = getActiveXFeature();
  const yFeature = getActiveYFeature();

  // Update UI based on dataset
  if (state.dataset === 'salary') {
    featureSelectBox.classList.add('hidden');
  } else {
    featureSelectBox.classList.remove('hidden');
  }

  // Split data into train/test
  const split = splitTrainTest(records, state.testSplitPercentage, 42);
  state.datasetSplit = split;

  // Get all X and Y values for correlation
  const allXValues = records.map(r => r[xFeature]).filter(v => !isNaN(v) && v !== null && v !== undefined);
  const allYValues = records.map(r => r[yFeature]).filter(v => !isNaN(v) && v !== null && v !== undefined);

  // Calculate correlation
  state.datasetMetrics.correlation = calculateCorrelation(allXValues, allYValues);
  const correlationEl = document.getElementById('datasetCorrelation');
  if (correlationEl) {
    correlationEl.textContent = state.datasetMetrics.correlation.toFixed(3);
  }

  // Calculate OLS using only training data
  const trainXValues = split.train.map(r => r[xFeature]);
  const trainYValues = split.train.map(r => r[yFeature]);
  
  const xBar = mean(trainXValues);
  const yBar = mean(trainYValues);
  
  let num = 0, den = 0;
  for (let i = 0; i < trainXValues.length; i++) {
    num += (trainXValues[i] - xBar) * (trainYValues[i] - yBar);
    den += (trainXValues[i] - xBar) ** 2;
  }
  
  const w = den === 0 ? 0 : num / den;
  const b = yBar - w * xBar;

  // Update formula display
  linearFormulaEl.innerHTML = `<div style="font-weight: bold; margin-bottom: 4px; color: #6a1b9a;">Linear Regression Equation:</div><div>y = ${w.toFixed(3)} * x + ${b.toFixed(3)}</div>`;

  // Calculate metrics for train set
  let trainSSE = 0, trainSST = 0;
  for (const r of split.train) {
    const pred = w * r[xFeature] + b;
    trainSSE += (r[yFeature] - pred) ** 2;
    trainSST += (r[yFeature] - yBar) ** 2;
  }
  const trainMSE = trainSSE / split.train.length;
  const trainRMSE = Math.sqrt(trainMSE);
  const trainR2 = trainSST === 0 ? 0 : 1 - (trainSSE / trainSST);

  state.datasetMetrics.train = { r2: trainR2, mse: trainMSE, rmse: trainRMSE };

  // Calculate metrics for test set
  const testYBar = mean(split.test.map(r => r[yFeature]));
  let testSSE = 0, testSST = 0;
  for (const r of split.test) {
    const pred = w * r[xFeature] + b;
    testSSE += (r[yFeature] - pred) ** 2;
    testSST += (r[yFeature] - testYBar) ** 2;
  }
  const testMSE = testSSE / split.test.length;
  const testRMSE = Math.sqrt(testMSE);
  const testR2 = testSST === 0 ? 0 : 1 - (testSSE / testSST);

  state.datasetMetrics.test = { r2: testR2, mse: testMSE, rmse: testRMSE };

  // Update metrics display
  const trainR2El = document.getElementById('datasetTrainR2');
  const trainMSEEl = document.getElementById('datasetTrainMSE');
  const trainRMSEEl = document.getElementById('datasetTrainRMSE');
  const testR2El = document.getElementById('datasetTestR2');
  const testMSEEl = document.getElementById('datasetTestMSE');
  const testRMSEEl = document.getElementById('datasetTestRMSE');

  if (trainR2El) trainR2El.textContent = trainR2.toFixed(4);
  if (trainMSEEl) trainMSEEl.textContent = trainMSE.toFixed(2);
  if (trainRMSEEl) trainRMSEEl.textContent = trainRMSE.toFixed(2);
  if (testR2El) testR2El.textContent = testR2.toFixed(4);
  if (testMSEEl) testMSEEl.textContent = testMSE.toFixed(2);
  if (testRMSEEl) testRMSEEl.textContent = testRMSE.toFixed(2);

  // Update data split counts
  const trainCountEl = document.getElementById('datasetTrainCount');
  const testCountEl = document.getElementById('datasetTestCount');
  const trainPercentageEl = document.getElementById('trainPercentage');
  const testPercentageEl = document.getElementById('testPercentage');
  
  if (trainCountEl) trainCountEl.textContent = split.train.length;
  if (testCountEl) testCountEl.textContent = split.test.length;
  if (trainPercentageEl) trainPercentageEl.textContent = 100 - state.testSplitPercentage;
  if (testPercentageEl) testPercentageEl.textContent = state.testSplitPercentage;
}

function drawAxes(ctx, canvas, xRange, yRange, labels) {
  const dpr = window.devicePixelRatio || 1;
  const pw = canvas.width / dpr;
  const ph = canvas.height / dpr;
  const m = { top: 70, right: 150, bottom: 90, left: 120 };
  const iw = pw - m.left - m.right;
  const ih = ph - m.top - m.bottom;

  ctx.clearRect(0, 0, pw, ph);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, pw, ph);

  ctx.strokeStyle = '#f0eef5';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 6; i++) {
    const x = m.left + (i / 6) * iw;
    ctx.moveTo(x, m.top); ctx.lineTo(x, ph - m.bottom);
  }
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= 6; i++) {
    const y = m.top + (i / 6) * ih;
    ctx.moveTo(m.left, y); ctx.lineTo(pw - m.right, y);
  }
  ctx.stroke();

  // Highlight Axes (X=0, Y=0) if they are in range
  const xAxisY = yRange[0] <= 0 && yRange[1] >= 0;
  const yAxisX = xRange[0] <= 0 && xRange[1] >= 0;

  // Draw complete boundary box
  ctx.strokeStyle = '#4a3f5a';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(m.left, ph - m.bottom); ctx.lineTo(pw - m.right, ph - m.bottom); // Bottom
  ctx.moveTo(m.left, ph - m.bottom); ctx.lineTo(m.left, m.top); // Left
  ctx.moveTo(pw - m.right, ph - m.bottom); ctx.lineTo(pw - m.right, m.top); // Right
  ctx.moveTo(m.left, m.top); ctx.lineTo(pw - m.right, m.top); // Top
  ctx.stroke();

  if (xAxisY || yAxisX) {
    ctx.strokeStyle = 'rgba(74, 63, 90, 0.4)'; // slightly thicker cross lines for math axes
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (xAxisY) {
      const yZero = ph - m.bottom - ((0 - yRange[0]) / (yRange[1] - yRange[0])) * ih;
      ctx.moveTo(m.left, yZero); ctx.lineTo(pw - m.right, yZero);
    }
    if (yAxisX) {
      const xZero = m.left + ((0 - xRange[0]) / (xRange[1] - xRange[0])) * iw;
      ctx.moveTo(xZero, m.top); ctx.lineTo(xZero, ph - m.bottom);
    }
    ctx.stroke();
  }

  // Draw axis labels (X, Y, X', Y')
  ctx.fillStyle = '#2d2438';
  ctx.font = '14px serif';
  ctx.fontStyle = 'italic';
  
  // X label at right end of X-axis
  if (xAxisY) {
    const yZero = ph - m.bottom - ((0 - yRange[0]) / (yRange[1] - yRange[0])) * ih;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels.x, pw - m.right + 10, yZero);
    // X' label at left end of X-axis
    ctx.textAlign = 'right';
    ctx.fillText(labels.x + "'", m.left - 10, yZero);
  } else {
    // Fallback to bottom - position below the tick labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(labels.x, (m.left + pw - m.right) / 2, ph - m.bottom + 35);
  }
  
  // Y label at top end of Y-axis
  if (yAxisX) {
    const xZero = m.left + ((0 - xRange[0]) / (xRange[1] - xRange[0])) * iw;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(labels.y, xZero, m.top - 10);
    // Y' label at bottom end of Y-axis
    ctx.textBaseline = 'top';
    ctx.fillText(labels.y + "'", xZero, ph - m.bottom + 25);
  } else {
    // Fallback to left - position to the left of tick labels
    ctx.save();
    ctx.translate(20, (m.top + ph - m.bottom) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels.y, 0, 0);
    ctx.restore();
  }

  ctx.fillStyle = '#655778';
  ctx.font = '11px "Times New Roman"';
  
  // Calculate Y position for X-axis labels (at Y=0 if in range, otherwise at bottom)
  let xLabelY;
  if (xAxisY) {
    const yZero = ph - m.bottom - ((0 - yRange[0]) / (yRange[1] - yRange[0])) * ih;
    xLabelY = yZero + 15; // Below the X=0 axis
  } else {
    xLabelY = ph - m.bottom + 5; // Below bottom edge if Y=0 not in range
  }
  
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let i = 0; i <= 10; i++) {
    const xv = xRange[0] + (i / 10) * (xRange[1] - xRange[0]);
    const x = m.left + (i / 10) * iw;
    ctx.fillText(fmtTick(xv), x, xLabelY);
  }

  // Calculate X position for Y-axis labels (at X=0 if in range, otherwise at left)
  let yLabelX;
  let yLabelAlign;
  if (yAxisX) {
    const xZero = m.left + ((0 - xRange[0]) / (xRange[1] - xRange[0])) * iw;
    yLabelX = xZero - 8; // Left of the Y=0 axis
    yLabelAlign = 'right';
  } else {
    yLabelX = m.left - 8; // Left of left edge if X=0 not in range
    yLabelAlign = 'right';
  }
  
  ctx.textAlign = yLabelAlign;
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 10; i++) {
    const yv = yRange[0] + (i / 10) * (yRange[1] - yRange[0]);
    const y = ph - m.bottom - (i / 10) * ih;
    ctx.fillText(fmtTick(yv), yLabelX, y);
  }

  return {
    m,
    toPx: (x, y) => ({
      x: m.left + ((x - xRange[0]) / (xRange[1] - xRange[0])) * iw,
      y: ph - m.bottom - ((y - yRange[0]) / (yRange[1] - yRange[0])) * ih
    }),
    fromPx: (px, py) => ({
      x: xRange[0] + ((px - m.left) / iw) * (xRange[1] - xRange[0]),
      y: yRange[0] + ((ph - m.bottom - py) / ih) * (yRange[1] - yRange[0])
    }),
    pw,
    ph
  };
}

function drawLinearGraph() {
  if (!state.dataLoaded) return;
  const ranges = getLinearRanges();
  const xFeature = getActiveXFeature();
  const yFeature = getActiveYFeature();

  const axis = drawAxes(linearCtx, linearCanvas, ranges.x, ranges.y, { x: xFeature, y: yFeature });

  // Get regression coefficients from train data
  const trainXValues = state.datasetSplit.train.map(r => r[xFeature]);
  const trainYValues = state.datasetSplit.train.map(r => r[yFeature]);
  
  const xBar = mean(trainXValues);
  const yBar = mean(trainYValues);
  
  let num = 0, den = 0;
  for (let i = 0; i < trainXValues.length; i++) {
    num += (trainXValues[i] - xBar) * (trainYValues[i] - yBar);
    den += (trainXValues[i] - xBar) ** 2;
  }
  
  const w = den === 0 ? 0 : num / den;
  const b = yBar - w * xBar;

  // Clip points to plot area
  linearCtx.save();
  linearCtx.beginPath();
  linearCtx.rect(axis.m.left, axis.m.top, axis.pw - axis.m.left - axis.m.right, axis.ph - axis.m.top - axis.m.bottom);
  linearCtx.clip();

  // Draw train points (pink circles)
  for (const r of state.datasetSplit.train) {
    const p = axis.toPx(r[xFeature], r[yFeature]);
    linearCtx.fillStyle = '#d81b60';
    linearCtx.beginPath();
    linearCtx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    linearCtx.fill();
    linearCtx.strokeStyle = '#fff';
    linearCtx.lineWidth = 1.5;
    linearCtx.stroke();
  }

  // Draw test points (amber squares)
  for (const r of state.datasetSplit.test) {
    const p = axis.toPx(r[xFeature], r[yFeature]);
    linearCtx.fillStyle = '#ffa000';
    linearCtx.fillRect(p.x - 5, p.y - 5, 10, 10);
    linearCtx.strokeStyle = '#fff';
    linearCtx.lineWidth = 1.5;
    linearCtx.strokeRect(p.x - 5, p.y - 5, 10, 10);
  }
  
  linearCtx.restore();

  // Draw regression line
  linearCtx.save();
  linearCtx.beginPath();
  linearCtx.rect(axis.m.left, axis.m.top, axis.pw - axis.m.left - axis.m.right, axis.ph - axis.m.top - axis.m.bottom);
  linearCtx.clip();

  linearCtx.strokeStyle = '#7b1fa2';
  linearCtx.lineWidth = 2.6;
  linearCtx.beginPath();
  const p1 = axis.toPx(ranges.x[0], w * ranges.x[0] + b);
  const p2 = axis.toPx(ranges.x[1], w * ranges.x[1] + b);
  linearCtx.moveTo(p1.x, p1.y);
  linearCtx.lineTo(p2.x, p2.y);
  linearCtx.stroke();
  linearCtx.restore();

  // Draw hover tooltip if point is hovered
  if (state.datasetHoveredPoint) {
    const hp = state.datasetHoveredPoint;
    const px = axis.toPx(hp[xFeature], hp[yFeature]);
    const predY = w * hp[xFeature] + b;
    const residual = hp[yFeature] - predY;

    // Residual Line
    linearCtx.strokeStyle = 'rgba(230, 50, 50, 0.7)';
    linearCtx.setLineDash([4, 4]);
    linearCtx.lineWidth = 1.5;
    linearCtx.beginPath();
    linearCtx.moveTo(px.x, px.y);
    const predPx = axis.toPx(hp[xFeature], predY);
    linearCtx.lineTo(predPx.x, predPx.y);
    linearCtx.stroke();

    // Tooltip Box
    linearCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    linearCtx.strokeStyle = '#263238';
    linearCtx.setLineDash([]);
    linearCtx.lineWidth = 1;

    const tw = 180;
    const th = 100;
    const tx = px.x + 12;
    const ty = px.y - th / 2;

    linearCtx.shadowColor = 'rgba(0,0,0,0.15)';
    linearCtx.shadowBlur = 6;
    linearCtx.shadowOffsetX = 2;
    linearCtx.shadowOffsetY = 2;
    linearCtx.fillRect(tx, ty, tw, th);

    linearCtx.shadowColor = 'transparent';
    linearCtx.strokeRect(tx, ty, tw, th);

    // Text Content
    linearCtx.fillStyle = '#263238';
    linearCtx.font = 'bold 11px Consolas';
    linearCtx.textAlign = 'left';
    linearCtx.fillText(`Type: ${hp.split.toUpperCase()}`, tx + 8, ty + 18);
    linearCtx.font = '11px Consolas';
    linearCtx.fillText(`X: ${hp[xFeature].toFixed(1)}`, tx + 8, ty + 36);
    linearCtx.fillText(`Y (actual): ${hp[yFeature].toFixed(2)}`, tx + 8, ty + 54);
    linearCtx.fillText(`Y (pred): ${predY.toFixed(2)}`, tx + 8, ty + 72);
    linearCtx.fillText(`Residual: ${residual.toFixed(2)}`, tx + 8, ty + 90);
  }
}

// Interactive Generator Logic
function generateInitialPoints() {
  state.interactivePoints = [];
  for (let i = 0; i < 10; i++) {
    state.interactivePoints.push({
      x: -80 + Math.random() * 160,
      y: -80 + Math.random() * 160,
      split: Math.random() < 0.8 ? 'train' : 'test',
      hidden: false
    });
  }
  state.pointsModifiedSinceFit = true;
}

function computeInteractiveOLS() {
  const pts = state.interactivePoints.filter(p => p.split === 'train' && !p.hidden);
  if (pts.length < 2) return null;

  const xs = pts.map(p => p.x);
  const ys = pts.map(p => p.y);
  const xBar = mean(xs);
  const yBar = mean(ys);

  let num = 0, den = 0;
  for (let i = 0; i < pts.length; i++) {
    num += (xs[i] - xBar) * (ys[i] - yBar);
    den += (xs[i] - xBar) ** 2;
  }

  const m = den === 0 ? 0 : num / den;
  const c = yBar - m * xBar;

  let sse = 0;
  for (let i = 0; i < pts.length; i++) {
    sse += (ys[i] - (m * xs[i] + c)) ** 2;
  }
  return { m, c, mse: sse / pts.length };
}

function drawInteractiveGraph() {
  const vr = state.interactiveViewport;
  const axis = drawAxes(interactiveCtx, interactiveCanvas, vr.x, vr.y, { x: 'X', y: 'Y' });
  const activePts = state.interactivePoints.filter(p => !p.hidden);
  const hiddenPts = state.interactivePoints.filter(p => p.hidden);

  // Clip points to plot area
  interactiveCtx.save();
  interactiveCtx.beginPath();
  interactiveCtx.rect(axis.m.left, axis.m.top, axis.pw - axis.m.left - axis.m.right, axis.ph - axis.m.top - axis.m.bottom);
  interactiveCtx.clip();
  
  // Draw faint hidden points
  for (const p of hiddenPts) {
    const px = axis.toPx(p.x, p.y);
    interactiveCtx.fillStyle = p.split === 'train' ? 'rgba(216, 27, 96, 0.2)' : 'rgba(255, 160, 0, 0.2)';
    interactiveCtx.beginPath();
    interactiveCtx.arc(px.x, px.y, p.split === 'train' ? 6 : 5, 0, Math.PI * 2);
    if (p.split === 'test') { interactiveCtx.rect(px.x - 4, px.y - 4, 8, 8); }
    interactiveCtx.fill();
    interactiveCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    interactiveCtx.lineWidth = 1.5;
    interactiveCtx.stroke();
  }

  for (const p of activePts) {
    const px = axis.toPx(p.x, p.y);
    interactiveCtx.fillStyle = p.split === 'train' ? '#d81b60' : '#ffa000'; // pink for train, amber for test
    interactiveCtx.beginPath();
    interactiveCtx.arc(px.x, px.y, p.split === 'train' ? 6 : 5, 0, Math.PI * 2); // test points slightly smaller or different shape conceptually
    if (p.split === 'test') { interactiveCtx.rect(px.x - 4, px.y - 4, 8, 8); } // make test points squarish
    interactiveCtx.fill();
    interactiveCtx.strokeStyle = '#fff';
    interactiveCtx.lineWidth = 1.5;
    interactiveCtx.stroke();
  }
  interactiveCtx.restore();

  interactiveCtx.save();
  interactiveCtx.beginPath();
  interactiveCtx.rect(axis.m.left, axis.m.top, axis.pw - axis.m.left - axis.m.right, axis.ph - axis.m.top - axis.m.bottom);
  interactiveCtx.clip();

  // Draw current manual line
  interactiveCtx.strokeStyle = '#4a148c';
  interactiveCtx.lineWidth = 2.6;
  interactiveCtx.beginPath();
  const mp1 = axis.toPx(vr.x[0], state.linear.w * vr.x[0] + state.linear.b);
  const mp2 = axis.toPx(vr.x[1], state.linear.w * vr.x[1] + state.linear.b);
  interactiveCtx.moveTo(mp1.x, mp1.y);
  interactiveCtx.lineTo(mp2.x, mp2.y);
  interactiveCtx.stroke();

  interactiveCtx.restore();

  // Draw Hover Tooltip
  if (state.hoveredPoint && !state.hoveredPoint.hidden) {
    interactiveCtx.save();
    const hp = state.hoveredPoint;
    const px = axis.toPx(hp.x, hp.y);
    const predY = state.linear.w * hp.x + state.linear.b;
    const residual = hp.y - predY;

    // Residual Line
    interactiveCtx.strokeStyle = 'rgba(230, 50, 50, 0.7)';
    interactiveCtx.setLineDash([4, 4]);
    interactiveCtx.lineWidth = 1.5;
    interactiveCtx.beginPath();
    interactiveCtx.moveTo(px.x, px.y);
    const predPx = axis.toPx(hp.x, predY);
    interactiveCtx.lineTo(predPx.x, predPx.y);
    interactiveCtx.stroke();

    // Tooltip Box
    interactiveCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    interactiveCtx.strokeStyle = '#263238';
    interactiveCtx.setLineDash([]);
    interactiveCtx.lineWidth = 1;

    // Position tooltip offset slightly
    const tw = 180;
    const th = 75;
    const tx = px.x + 12;
    const ty = px.y - th / 2;

    // Draw Box with Shadow
    interactiveCtx.shadowColor = 'rgba(0,0,0,0.15)';
    interactiveCtx.shadowBlur = 6;
    interactiveCtx.shadowOffsetX = 2;
    interactiveCtx.shadowOffsetY = 2;
    interactiveCtx.fillRect(tx, ty, tw, th);

    interactiveCtx.shadowColor = 'transparent';
    interactiveCtx.strokeRect(tx, ty, tw, th);

    // Text Content
    interactiveCtx.fillStyle = '#263238';
    interactiveCtx.font = 'bold 11px Consolas';
    interactiveCtx.textAlign = 'left';
    interactiveCtx.fillText(`Type: ${hp.split.toUpperCase()}`, tx + 8, ty + 18);
    interactiveCtx.font = '11px Consolas';
    interactiveCtx.fillText(`Point: (${hp.x.toFixed(1)}, ${hp.y.toFixed(1)})`, tx + 8, ty + 38);
    interactiveCtx.fillText(`Resid: ${residual.toFixed(2)}`, tx + 8, ty + 58);

    interactiveCtx.restore();
  }

  // UI Updates Data Points
  const trainPts = activePts.filter(p => p.split === 'train');
  const testPts = activePts.filter(p => p.split === 'test');

  interactiveTotalPts.textContent = activePts.length;
  interactiveTrainPts.textContent = trainPts.length;
  interactiveTestPts.textContent = testPts.length;
  if (activePts.length > 0) {
    interactiveTrainRatio.textContent = Math.round((trainPts.length / activePts.length) * 100);
    interactiveTestRatio.textContent = Math.round((testPts.length / activePts.length) * 100);
  } else {
    interactiveTrainRatio.textContent = '0';
    interactiveTestRatio.textContent = '0';
  }

  // Train Metrics
  if (trainPts.length > 0) {
    let sse = 0;
    let sst = 0;
    const ys = trainPts.map(p => p.y);
    const yBar = mean(ys);

    for (const p of trainPts) {
      const pred = state.linear.w * p.x + state.linear.b;
      sse += (p.y - pred) ** 2;
      sst += (p.y - yBar) ** 2;
    }

    const mse = sse / trainPts.length;
    interactiveMSE.textContent = mse.toFixed(2);
    interactiveRMSE.textContent = Math.sqrt(mse).toFixed(2);
    interactiveR2.textContent = sst === 0 ? '-' : (1 - (sse / sst)).toFixed(4);
  } else {
    interactiveMSE.textContent = '-';
    interactiveRMSE.textContent = '-';
    interactiveR2.textContent = '-';
  }

  // Test Metrics
  if (testPts.length > 0) {
    let testSse = 0;
    let testSst = 0;
    const testYs = testPts.map(p => p.y);
    const testYBar = mean(testYs);

    for (const p of testPts) {
      const pred = state.linear.w * p.x + state.linear.b;
      testSse += (p.y - pred) ** 2;
      testSst += (p.y - testYBar) ** 2;
    }
    const testMse = testSse / testPts.length;
    interactiveTestMSE.textContent = testMse.toFixed(2);
    interactiveTestRMSE.textContent = Math.sqrt(testMse).toFixed(2);
    interactiveTestR2.textContent = testSst === 0 ? '-' : (1 - (testSse / testSst)).toFixed(4);
  } else {
    interactiveTestMSE.textContent = '-';
    interactiveTestRMSE.textContent = '-';
    interactiveTestR2.textContent = '-';
  }
}

// Render Loop
function render() {
  if (state.appMode === 'menu') {
    // wait for choice
  } else if (state.appMode === 'dataset') {
    drawLinearGraph();
  } else {
    drawInteractiveGraph();
  }

  if (state.rafId) cancelAnimationFrame(state.rafId);
  state.rafId = requestAnimationFrame(render);
}

// Events
function resizeCanvases() {
  const dpr = window.devicePixelRatio || 1;
  [linearCanvas, interactiveCanvas].forEach(c => {
    const rect = c.getBoundingClientRect();
    if (rect.width === 0) return;

    // Make sure internal logical resolution matches physical layout resolution 1:1
    c.width = Math.floor(rect.width * dpr);
    c.height = Math.floor(rect.height * dpr);
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  });
}

window.addEventListener('resize', resizeCanvases);

function updateAppMode() {
  if (state.appMode === 'menu') {
    modeSelectorMenu.classList.remove('hidden');
    modeDatasetEl.classList.add('hidden');
    modeInteractiveEl.classList.add('hidden');
  } else if (state.appMode === 'dataset') {
    modeSelectorMenu.classList.add('hidden');
    modeDatasetEl.classList.remove('hidden');
    modeInteractiveEl.classList.add('hidden');
    updateDatasetUI();
  } else {
    modeSelectorMenu.classList.add('hidden');
    modeDatasetEl.classList.add('hidden');
    modeInteractiveEl.classList.remove('hidden');
  }
  setTimeout(resizeCanvases, 0);
}

modeRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    // Just update selection, don't change mode yet
  });
});

// Start Simulator button handler
const startSimulatorBtn = document.getElementById('startSimulatorBtn');
if (startSimulatorBtn) {
  startSimulatorBtn.addEventListener('click', () => {
    const selectedMode = document.querySelector('input[name="appMode"]:checked');
    if (selectedMode) {
      state.appMode = selectedMode.value;
      updateAppMode();
    }
  });
}

datasetSelect.addEventListener('change', (e) => {
  state.dataset = e.target.value;
  state.datasetViewport = null; // Reset zoom when dataset changes
  updateDatasetUI();
});

linearFeatureSelect.addEventListener('change', (e) => {
  state.carFeature = e.target.value;
  state.datasetViewport = null; // Reset zoom when feature changes
  updateDatasetUI();
});

// Test split slider handler
if (testSplitSlider && testSplitValue) {
  testSplitSlider.addEventListener('input', (e) => {
    state.testSplitPercentage = Number(e.target.value);
    testSplitValue.textContent = state.testSplitPercentage + '%';
    state.datasetViewport = null; // Reset zoom when split changes
    updateDatasetUI();
  });
}

// Dataset Pan Toggle setup
const datasetPanToggle = document.getElementById('datasetPanToggle');
if (datasetPanToggle) {
  datasetPanToggle.addEventListener('change', (e) => {
    state.datasetPanEnabled = e.target.checked;
    if (state.datasetPanEnabled) {
      linearCanvas.style.cursor = 'grab';
    } else {
      linearCanvas.style.cursor = 'default';
      state.datasetIsPanning = false; // Cancel any active pan
    }
  });
}

// Dataset canvas mousedown for panning
linearCanvas.addEventListener('mousedown', (e) => {
  if (state.appMode !== 'dataset' || !state.dataLoaded || !state.datasetPanEnabled) return;
  
  const rect = linearCanvas.getBoundingClientRect();
  const ranges = getLinearRanges();
  const axis = drawAxes(linearCtx, linearCanvas, ranges.x, ranges.y, { x: getActiveXFeature(), y: getActiveYFeature() });
  
  const clickPx = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  const isInPlotArea = clickPx.x >= axis.m.left 
                    && clickPx.x <= axis.pw - axis.m.right
                    && clickPx.y >= axis.m.top
                    && clickPx.y <= axis.ph - axis.m.bottom;
                    
  if (isInPlotArea) {
    state.datasetIsPanning = true;
    state.datasetPanStartPx = { x: clickPx.x, y: clickPx.y };
    state.datasetPanStartVr = { x: [...ranges.x], y: [...ranges.y] };
    document.body.style.cursor = 'grabbing';
  }
});

// Added mouseup to stop dataset panning
window.addEventListener('mouseup', () => {
  if (state.datasetIsPanning) {
    state.datasetIsPanning = false;
    document.body.style.cursor = 'default';
    if (state.datasetPanEnabled) {
      linearCanvas.style.cursor = 'grab';
    }
  }
});

// Dataset canvas hover/pan handlers
linearCanvas.addEventListener('mousemove', (e) => {
  if (state.appMode !== 'dataset' || !state.dataLoaded) return;
  
  const rect = linearCanvas.getBoundingClientRect();
  const ranges = getLinearRanges();
  const xFeature = getActiveXFeature();
  const yFeature = getActiveYFeature();
  const axis = drawAxes(linearCtx, linearCanvas, ranges.x, ranges.y, { x: xFeature, y: yFeature });
  const mousePx = { x: e.clientX - rect.left, y: e.clientY - rect.top };

  // Handle panning
  if (state.datasetIsPanning && state.datasetPanStartPx) {
    const dxPx = mousePx.x - state.datasetPanStartPx.x;
    const dyPx = mousePx.y - state.datasetPanStartPx.y;
    
    // Convert px delta to data scale
    const spanX = state.datasetPanStartVr.x[1] - state.datasetPanStartVr.x[0];
    const spanY = state.datasetPanStartVr.y[1] - state.datasetPanStartVr.y[0];
    
    // Note: dy is inverted because y-axis goes up but pixels go down
    const dxData = (dxPx / (axis.pw - axis.m.left - axis.m.right)) * spanX;
    const dyData = -(dyPx / (axis.ph - axis.m.top - axis.m.bottom)) * spanY;
    
    state.datasetViewport = {
      x: [state.datasetPanStartVr.x[0] - dxData, state.datasetPanStartVr.x[1] - dxData],
      y: [state.datasetPanStartVr.y[0] - dyData, state.datasetPanStartVr.y[1] - dyData]
    };
    return; // Don't highlight points while panning
  }

  // Only check for hovers if we are NOT in pan mode (or just update cursor)
  if (state.datasetPanEnabled) {
    linearCanvas.style.cursor = state.datasetIsPanning ? 'grabbing' : 'grab';
    if (state.datasetHoveredPoint) state.datasetHoveredPoint = null; // Clear hover when pan mode is strictly on
    return;
  } else {
    linearCanvas.style.cursor = 'default';
  }

  let found = null;
  const allPoints = [...state.datasetSplit.train, ...state.datasetSplit.test];
  
  for (const pt of allPoints) {
    const ptPx = axis.toPx(pt[xFeature], pt[yFeature]);
    const dist = Math.hypot(ptPx.x - mousePx.x, ptPx.y - mousePx.y);
    if (dist < 10) {
      found = pt;
      break;
    }
  }

  if (state.datasetHoveredPoint !== found) {
    state.datasetHoveredPoint = found;
  }
});

linearCanvas.addEventListener('mouseout', () => {
  state.datasetHoveredPoint = null;
});

// Dataset canvas wheel event for zoom
linearCanvas.addEventListener('wheel', (e) => {
  if (state.appMode !== 'dataset') return;
  e.preventDefault();

  const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85; // zoom out or in
  
  // Get current ranges (either viewport or auto-fit)
  const currentRanges = getLinearRanges();
  
  const rect = linearCanvas.getBoundingClientRect();
  const mousePx = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  
  const xFeature = getActiveXFeature();
  const yFeature = getActiveYFeature();
  const axis = drawAxes(linearCtx, linearCanvas, currentRanges.x, currentRanges.y, { x: xFeature, y: yFeature });
  
  // Find data coordinate under cursor before zoom
  const mouseDataXBox = axis.fromPx(mousePx.x, mousePx.y);

  // Calculate new spans
  let numXSpan = (currentRanges.x[1] - currentRanges.x[0]) * zoomFactor;
  let numYSpan = (currentRanges.y[1] - currentRanges.y[0]) * zoomFactor;

  // Get data bounds for clamping
  const xs = getXValues();
  const ys = getYValues();
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  
  const dataXSpan = xMax - xMin;
  const dataYSpan = yMax - yMin;

  // Apply clamping - minimum 10% of data span, maximum 500 units or 10x data span
  numXSpan = clamp(numXSpan, Math.max(dataXSpan * 0.1, 1), Math.max(dataXSpan * 10, 500));
  numYSpan = clamp(numYSpan, Math.max(dataYSpan * 0.1, 1), Math.max(dataYSpan * 10, 500));

  // Determine relative position of cursor in current span (0 to 1)
  const xRatio = (mouseDataXBox.x - currentRanges.x[0]) / (currentRanges.x[1] - currentRanges.x[0]);
  const yRatio = (mouseDataXBox.y - currentRanges.y[0]) / (currentRanges.y[1] - currentRanges.y[0]);

  // Set new view maintaining the cursor position
  state.datasetViewport = {
    x: [mouseDataXBox.x - xRatio * numXSpan, mouseDataXBox.x + (1 - xRatio) * numXSpan],
    y: [mouseDataXBox.y - yRatio * numYSpan, mouseDataXBox.y + (1 - yRatio) * numYSpan]
  };
}, { passive: false });

linWSlider.addEventListener('input', (e) => {
  state.linear.w = Number(e.target.value);
  linWValue.textContent = state.linear.w.toFixed(2);
  state.pointsModifiedSinceFit = true;
});
linBSlider.addEventListener('input', (e) => {
  state.linear.b = Number(e.target.value);
  linBValue.textContent = state.linear.b.toFixed(2);
  state.pointsModifiedSinceFit = true;
});

if (trainBtn) {
  trainBtn.addEventListener('click', () => {
    if (!state.previousLine || state.pointsModifiedSinceFit) {
      state.previousLine = { w: state.linear.w, b: state.linear.b };
    }
    const ols = computeInteractiveOLS();
    if (ols) {
      state.linear.w = ols.m;
      state.linear.b = ols.c;
      linWSlider.value = state.linear.w;
      linBSlider.value = state.linear.b;
      linWValue.textContent = state.linear.w.toFixed(2);
      linBValue.textContent = state.linear.b.toFixed(2);
      state.pointsModifiedSinceFit = false;
    }
  });
}

resetLinearBtn.addEventListener('click', () => {
  if (state.previousLine && !state.pointsModifiedSinceFit) {
    state.linear = { w: state.previousLine.w, b: state.previousLine.b };
  } else {
    state.linear = { w: 1, b: 0 };
  }
  linWSlider.value = state.linear.w;
  linBSlider.value = state.linear.b;
  linWValue.textContent = state.linear.w.toFixed(2);
  linBValue.textContent = state.linear.b.toFixed(2);
  state.previousLine = null;
  state.pointsModifiedSinceFit = false;
});

resetInteractiveBtn.addEventListener('click', () => {
  generateInitialPoints();
});

splitRadios.forEach(radio => {
  // To allow un-selecting, we listen to click rather than just change
  radio.addEventListener('click', (e) => {
    if (state.pointSplitMode === e.target.value) {
      // If clicking the already selected radio, uncheck it
      e.target.checked = false;
      state.pointSplitMode = null; // null represents panning mode
    } else {
      state.pointSplitMode = e.target.value;
    }
  });
});

interactiveCanvas.addEventListener('mousedown', (e) => {
  const rect = interactiveCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const vr = state.interactiveViewport;
  const axis = drawAxes(interactiveCtx, interactiveCanvas, vr.x, vr.y, { x: 'X', y: 'Y' });
  
  // Check if click is within plot area (not in margins)
  const clickPx = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  const isInPlotArea = clickPx.x >= axis.m.left 
                    && clickPx.x <= axis.pw - axis.m.right
                    && clickPx.y >= axis.m.top
                    && clickPx.y <= axis.ph - axis.m.bottom;
  
  if (!isInPlotArea) return;

  // If no mode is selected, we are panning
  if (state.pointSplitMode === null) {
    state.isPanning = true;
    state.panStartPx = { x: clickPx.x, y: clickPx.y };
    state.panStartVr = { x: [...vr.x], y: [...vr.y] };
    document.body.style.cursor = 'grabbing';
    return;
  }

  if (state.pointSplitMode === 'hide') {
    let found = null;
    let minDist = 15;
    for (let i = 0; i < state.interactivePoints.length; i++) {
      const pt = state.interactivePoints[i];
      if (pt.hidden) continue;
      const ptPx = axis.toPx(pt.x, pt.y);
      const dist = Math.hypot(ptPx.x - clickPx.x, ptPx.y - clickPx.y);
      if (dist < minDist) {
        minDist = dist;
        found = pt;
      }
    }
    if (found) {
      found.hidden = true;
      state.pointsModifiedSinceFit = true;
    }
    return;
  }
  
  const p = axis.fromPx(clickPx.x, clickPx.y);
  // Allow adding points if they fall within viewport bounds
  if (p.x >= vr.x[0] && p.x <= vr.x[1] && p.y >= vr.y[0] && p.y <= vr.y[1]) {
    state.interactivePoints.push({ x: p.x, y: p.y, split: state.pointSplitMode, hidden: false });
    state.pointsModifiedSinceFit = true;
  }
});

// Added mouseup to stop panning
window.addEventListener('mouseup', () => {
  if (state.isPanning) {
    state.isPanning = false;
    document.body.style.cursor = 'default';
  }
});

interactiveCanvas.addEventListener('dblclick', (e) => {
  if (state.appMode !== 'interactive') return;
  const rect = interactiveCanvas.getBoundingClientRect();
  const vr = state.interactiveViewport;
  const axis = drawAxes(interactiveCtx, interactiveCanvas, vr.x, vr.y, { x: 'X', y: 'Y' });
  const clickPx = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  
  let found = null;
  let minDist = 20;
  for (let i = 0; i < state.interactivePoints.length; i++) {
    const pt = state.interactivePoints[i];
    if (!pt.hidden) continue;
    const ptPx = axis.toPx(pt.x, pt.y);
    const dist = Math.hypot(ptPx.x - clickPx.x, ptPx.y - clickPx.y);
    if (dist < minDist) {
      minDist = dist;
      found = pt;
    }
  }
  if (found) {
    found.hidden = false;
    state.pointsModifiedSinceFit = true;
  }
});

interactiveCanvas.addEventListener('mousemove', (e) => {
  const rect = interactiveCanvas.getBoundingClientRect();
  const vr = state.interactiveViewport;
  const axis = drawAxes(interactiveCtx, interactiveCanvas, vr.x, vr.y, { x: 'X', y: 'Y' });
  const mousePx = { x: e.clientX - rect.left, y: e.clientY - rect.top };

  // Handle panning
  if (state.isPanning && state.panStartPx) {
    const dxPx = mousePx.x - state.panStartPx.x;
    const dyPx = mousePx.y - state.panStartPx.y;
    
    // Convert px delta to data scale
    const spanX = state.panStartVr.x[1] - state.panStartVr.x[0];
    const spanY = state.panStartVr.y[1] - state.panStartVr.y[0];
    
    // Note: dy is inverted because y-axis goes up but pixels go down
    const dxData = (dxPx / (axis.pw - axis.m.left - axis.m.right)) * spanX;
    const dyData = -(dyPx / (axis.ph - axis.m.top - axis.m.bottom)) * spanY;
    
    state.interactiveViewport.x = [state.panStartVr.x[0] - dxData, state.panStartVr.x[1] - dxData];
    state.interactiveViewport.y = [state.panStartVr.y[0] - dyData, state.panStartVr.y[1] - dyData];
    
    return; // Don't do hover calculations while panning
  }

  // Set appropriate cursor based on mode
  if (state.pointSplitMode === null) {
    interactiveCanvas.style.cursor = 'grab';
  } else {
    interactiveCanvas.style.cursor = 'crosshair';
  }

  let found = null;
  for (const pt of state.interactivePoints) {
    if (pt.hidden) continue;
    const ptPx = axis.toPx(pt.x, pt.y);
    const dist = Math.hypot(ptPx.x - mousePx.x, ptPx.y - mousePx.y);
    if (dist < 10) { // Hover hit radius
      found = pt;
      break;
    }
  }

  if (state.hoveredPoint !== found) {
    state.hoveredPoint = found;
  }
});

interactiveCanvas.addEventListener('mouseout', () => {
  state.hoveredPoint = null;
});

interactiveCanvas.addEventListener('wheel', (e) => {
  if (state.appMode !== 'interactive') return;
  e.preventDefault();

  const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85; // zoom out or in
  const vr = state.interactiveViewport;

  const rect = interactiveCanvas.getBoundingClientRect();
  const mousePx = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  
  const axis = drawAxes(interactiveCtx, interactiveCanvas, vr.x, vr.y, { x: 'X', y: 'Y' });
  
  // Find data coordinate under cursor before zoom
  const mouseDataXBox = axis.fromPx(mousePx.x, mousePx.y);

  // Calculate new spans
  let numXSpan = (vr.x[1] - vr.x[0]) * zoomFactor;
  let numYSpan = (vr.y[1] - vr.y[0]) * zoomFactor;

  // Apply clamping so it doesn't zoom too far in or too far out
  numXSpan = clamp(numXSpan, 10, 500);
  numYSpan = clamp(numYSpan, 10, 500);

  // Determine relative position of cursor in current span (0 to 1)
  const xRatio = (mouseDataXBox.x - vr.x[0]) / (vr.x[1] - vr.x[0]);
  const yRatio = (mouseDataXBox.y - vr.y[0]) / (vr.y[1] - vr.y[0]);

  // Set new view maintaining the cursor position
  state.interactiveViewport.x = [mouseDataXBox.x - xRatio * numXSpan, mouseDataXBox.x + (1 - xRatio) * numXSpan];
  state.interactiveViewport.y = [mouseDataXBox.y - yRatio * numYSpan, mouseDataXBox.y + (1 - yRatio) * numYSpan];
}, { passive: false });


// Initialization
generateInitialPoints();
loadDatasets();
updateAppMode();
setTimeout(() => {
  resizeCanvases();
  render();
}, 100);
