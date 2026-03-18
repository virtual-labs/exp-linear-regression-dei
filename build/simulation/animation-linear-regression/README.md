# Bridge Animation Prototype

This folder contains a standalone HTML/CSS/JS animation to address reviewer feedback:

"Needs improvement to link the process of previous and successive experiments to understand the differences clearly."

## What it shows
- Previous experiment: Linear Regression (continuous output)
- Current experiment: Logistic Regression (probability + thresholded class)
- Dataset-grounded interactions using representative values from both experiment simulations

## Interaction highlights
- Linear sample selector with actual vs predicted selling price and residual view
- Logistic feature selector (`Platelets`, `WBC`, `Hematocrit`) with sigmoid behavior
- Live threshold slider to observe class conversion and confusion-metric changes
- Probe animation showing same input interpreted by both models

## Files
- `index.html` - UI layout and controls
- `style.css` - Styling for cards, controls, panels
- `script.js` - Interactive animation logic and live readouts

## How to run
Open `index.html` in a browser.

## Integration note
After approval, this module can be embedded as an overlay in:
- `experiment/simulation/index.html`
- `experiment/simulation/js/main.js`
- `experiment/simulation/css/main.css`
