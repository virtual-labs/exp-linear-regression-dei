<style>
.formula-block {
   text-align: center;
   margin: 18px 0;
}

.formula-text {
   display: inline-block;
   font-family: "Cambria Math", "Times New Roman", "Georgia", serif;
   font-size: 1.15em;
   line-height: 1.4;
}

.figure-block {
   text-align: center;
   margin: 18px 0;
}

.figure-block img {
   max-height: 340px;
   width: auto;
}

.figure-caption {
   color: #64748b;
   font-size: 0.92rem;
   margin-top: 8px;
   font-style: italic;
}
</style>

Linear Regression is one of the most fundamental and widely used algorithms in Machine Learning and Statistical Modelling. It belongs to supervised learning, where the model is trained using labelled data containing input variables (features) and the corresponding output variable (target).

The goal of Linear Regression is to identify and quantify relationships between variables so that future outcomes can be predicted. The method assumes that the relationship between dependent and independent variables can be approximated by a linear equation.

Examples include house price prediction from area and rooms, sales prediction from advertisement spend, and student performance prediction from study hours. Once the model learns from historical data, it predicts continuous numerical values for unseen inputs.

### 1. Simple Linear Regression

Simple Linear Regression models one independent variable X and one dependent variable Y using a best-fit straight line.

<div class="formula-block">
   <span class="formula-text">
      <i>Y</i> = <i>&beta;</i><sub>0</sub> + <i>&beta;</i><sub>1</sub><i>X</i> + <i>&epsilon;</i>
   </span>
</div>

This line gives the predicted value of Y for each value of X.

<div class="figure-block">
<img src="images/fig1_lr.png" alt="Linear regression showing slope, intercept, and prediction error">
<p class="figure-caption">Figure 1: Linear regression showing slope, intercept, and prediction error.</p>
</div>

In Figure 1, the line <i>y</i> = <i>&beta;</i><sub>0</sub> + <i>&beta;</i><sub>1</sub><i>x</i> is the regression line. Here, <i>&beta;</i><sub>0</sub> is the intercept (predicted <i>Y</i> when <i>X</i> = 0) and <i>&beta;</i><sub>1</sub> is the slope (change in <i>Y</i> for one-unit change in <i>X</i>). The vertical distance between an observed point and the predicted point on the line is the residual (error) <i>&epsilon;</i><sub>i</sub>.

### 2. Multiple Linear Regression

Multiple Linear Regression extends simple regression to two or more independent variables.

<div class="formula-block">
   <span class="formula-text">
      <i>Y</i> = <i>&beta;</i><sub>0</sub> + <i>&beta;</i><sub>1</sub><i>X</i><sub>1</sub> + <i>&beta;</i><sub>2</sub><i>X</i><sub>2</sub> + ... + <i>&beta;</i><sub>n</sub><i>X</i><sub>n</sub> + <i>&epsilon;</i>
   </span>
</div>

Each coefficient measures the contribution of one feature while keeping others constant.

Where:
- Y: Dependent variable (target)
- X1, X2, ..., Xn: Independent variables (features)
- &beta;<sub>0</sub>: Intercept
- &beta;<sub>1</sub>, &beta;<sub>2</sub>, ..., &beta;<sub>n</sub>: Regression coefficients
- &epsilon;: Error term (residual)

<div class="figure-block">
<img src="images/fig2_lr.png" alt="Multiple linear regression showing regression plane and residual">
<p class="figure-caption">Figure 2: Multiple linear regression showing the regression plane and residual error.</p>
</div>

In this case, the model fits a plane (for two features) rather than a line. The vertical distance from each observed point to the plane is the residual. The objective is to reduce these residuals to improve prediction accuracy.

### 3. Method of Least Squares

Model parameters are estimated by minimizing prediction error using the Least Squares Method.

The error measure is Residual Sum of Squares (RSS):

<div class="formula-block">
   <span class="formula-text">
      <i>RSS</i> = &sum;<sub><i>i</i>=1</sub><sup><i>n</i></sup> (<i>Y</i><sub>i</sub> - <i>y&#770;</i><sub>i</sub>)<sup>2</sup>
   </span>
</div>

Where:
- Y<sub>i</sub>: actual value
- y&#770;<sub>i</sub>: predicted value

By minimizing RSS, Linear Regression finds the best-fitting line or plane.

<div class="figure-block">
<img src="images/fig3_lr.png" alt="Residuals as vertical distances between observed points and regression line">
<p class="figure-caption">Figure 3: Residuals as vertical distances between observed points and the regression line.</p>
</div>

Smaller squared residual sum indicates a better fit to data.

### 4. Interpretation of Regression Coefficients

- **Intercept (&beta;<sub>0</sub>):** Predicted value when all independent variables are zero.
- **Slope in Simple Regression (&beta;<sub>1</sub>):** Change in target for one-unit increase in feature.
- **Coefficients in Multiple Regression (&beta;<sub>1</sub>, &beta;<sub>2</sub>, ...):** Strength and direction of influence of each feature.

If <i>&beta;</i><sub>1</sub> = 2, then for one-unit increase in <i>X</i>, predicted <i>Y</i> increases by 2 units (all else constant).

### 5. Algorithm

1. Let X be input features and Y be output values.
2. Assume linear model:
   <div class="formula-block">
      <span class="formula-text">
         <i>y</i> = <i>&beta;</i><sub>0</sub> + <i>&beta;</i><sub>1</sub><i>x</i><sub>1</sub> + <i>&beta;</i><sub>2</sub><i>x</i><sub>2</sub> + ... + <i>&beta;</i><sub>n</sub><i>x</i><sub>n</sub>
      </span>
   </div>
3. Compute residual for each data point:
   <div class="formula-block">
      <span class="formula-text">
         <i>e</i><sub>i</sub> = <i>y</i><sub>i</sub> - <i>y&#770;</i><sub>i</sub>
      </span>
   </div>
4. Compute total error with SSE:
   <div class="formula-block">
      <span class="formula-text">
         <i>SSE</i> = &sum;<sub><i>i</i>=1</sub><sup><i>n</i></sup> (<i>y</i><sub>i</sub> - <i>y&#770;</i><sub>i</sub>)<sup>2</sup>
      </span>
   </div>
5. Find coefficients minimizing SSE (Normal Equation):
   <div class="formula-block">
      <span class="formula-text">
         <i>&beta;</i> = (<i>X</i><sup>T</sup><i>X</i>)<sup>-1</sup><i>X</i><sup>T</sup><i>y</i>
      </span>
   </div>
6. Predict new outputs using learned coefficients.

### 6. Assumptions of Linear Regression

- **Linearity:** Relationship between independent and dependent variables is linear.
- **Independence:** Observations are independent.
- **Homoscedasticity:** Residual variance remains constant across feature values.
- **Normality:** Residuals are approximately normally distributed.

### 7. Applications of Linear Regression

- Sales forecasting
- Price prediction
- Risk assessment
- Demand estimation
- Economic trend analysis
- Healthcare data analysis

Linear Regression is commonly used as a baseline model due to its simplicity and interpretability.

### 8. Merits of Linear Regression

- **Simplicity and interpretability:** Easy to implement and explain.
- **Clear coefficient meaning:** Coefficients give direction and magnitude of feature effects.
- **Effective on linear data:** Works well when assumptions are reasonably satisfied.

### 9. Demerits of Linear Regression

- **Linearity restriction:** Cannot model non-linear relationships without transformations.
- **Outlier sensitivity:** Squared-error objective gives large weight to outliers.
- **Multicollinearity issues:** Highly correlated predictors make coefficient estimates unstable in multiple regression.

