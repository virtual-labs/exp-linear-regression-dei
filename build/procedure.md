## Part 1: Simple Linear Regression

The objective of this experiment is to implement Simple Linear Regression on Salary Dataset to regress Salaries with corresponding Years of Experience.

**Step 1:** Load 'Salary_dataset.csv'

**Step 2:** Define Years of Experience as X and Salary as Y.

**Step 3:** Split the dataset into training and testing sets.

**Step 4:** Train the Linear Regression model.

**Step 5:** Evaluate performance using MAE, MSE, RMSE, and R².

**Step 6:** Plot the:
- Scatter plot of actual data
- Regression line
- Residual distribution

---

## Part 2: Multiple Linear Regression

The objective of this experiment is to implement Multiple Linear Regression on Car Dataset using categorical features – Fuel types (Petrol, Diesel or CNG), Seller types (Dealer or Individual) and Transmission (Manual or Automatic) – to regress on Selling Price of cars.

**Step 1:** Import required libraries: pandas, numpy, matplotlib, seaborn, and sklearn.

**Step 2:** Load the dataset 'car data.csv'

**Step 3:** Perform exploratory data analysis using:
- head(), tail(), info(), describe()
- Check missing values using isnull().sum()

**Step 4:** Encode categorical variables:
- Fuel_Type: Petrol = 0, Diesel = 1, CNG = 2
- Seller_Type: Dealer = 0, Individual = 1
- Transmission: Manual = 0, Automatic = 1

**Step 5:** Define features X by removing Car_Name and Selling_Price.

**Step 6:** Define target variable Y as Selling_Price.

**Step 7:** Split the dataset into training and testing sets.

**Step 8:** Train the Linear Regression model.

**Step 9:** Evaluate the model using MAE, MSE, RMSE, and R².

**Step 10:** Plot residuals vs predicted values.