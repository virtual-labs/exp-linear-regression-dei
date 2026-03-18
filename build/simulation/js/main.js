/* Main Logic for Experiment Simulation */

/* 
 * Steps Data Configuration 
 */
const MULTI_VAR_STEPS = [
  {
    id: 'import_libraries',
    title: 'Importing Libraries',
    blocks: [
      {
        code: `# Importing Libraries
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
print("Libraries Imported")`,
        output: `<div class="output-success">Libraries Imported</div>`
      }
    ]
  },
  {
    id: 'reading_data',
    title: 'Loading Dataset',
    blocks: [
      {
        code: `# Read and store the Car dataset
data = pd.read_csv('car_data.csv')
print("Dataset reading complete")`,
        output: `<div class="output-text">Dataset reading complete</div>`
      }
    ]
  },
  {
    id: 'data_analysis',
    title: 'Data Analysis',
    blocks: [
      {
        code: `<div class="output-success"># Display specific selected rows from the dataset using their index positions</div>
rows_to_show = [31, 144, 42, 114, 89]
data.loc[rows_to_show]
`,
        output: `<table class="data-table">
  <thead>
    <tr>
      <th></th>
      <th>Car_Name</th>
      <th>Year</th>
      <th>Selling_Price</th>
      <th>Present_Price</th>
      <th>Kms_Driven</th>
      <th>Fuel_Type</th>
      <th>Seller_Type</th>
      <th>Transmission</th>
      <th>Owner</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>31</td><td>ritz</td><td>2011</td><td>2.35</td><td>4.89</td><td>54200</td><td>Petrol</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>144</td><td>Bajaj Pulsar NS 200</td><td>2014</td><td>0.60</td><td>0.99</td><td>25000</td><td>Petrol</td><td>Individual</td><td>Manual</td><td>0</td></tr>
    <tr><td>42</td><td>sx4</td><td>2008</td><td>1.95</td><td>7.15</td><td>58000</td><td>Petrol</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>114</td><td>Royal Enfield Classic 350</td><td>2015</td><td>1.15</td><td>1.47</td><td>17000</td><td>Petrol</td><td>Individual</td><td>Manual</td><td>0</td></tr>
    <tr><td>89</td><td>etios g</td><td>2014</td><td>4.75</td><td>6.76</td><td>40000</td><td>Petrol</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
  </tbody>
</table>
`,
      },
      {
        code: `<div class="output-success"># Display the first 5 rows of the dataset</div>
data.head()`,
        output: `<table class="data-table">
  <thead>
    <tr>
      <th></th>
      <th>Car_Name</th>
      <th>Year</th>
      <th>Selling_Price</th>
      <th>Present_Price</th>
      <th>Kms_Driven</th>
      <th>Fuel_Type</th>
      <th>Seller_Type</th>
      <th>Transmission</th>
      <th>Owner</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>ritz</td><td>2014</td><td>3.35</td><td>5.59</td><td>27000</td><td>Petrol</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>1</td><td>sx4</td><td>2013</td><td>4.75</td><td>9.54</td><td>43000</td><td>Diesel</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>2</td><td>ciaz</td><td>2017</td><td>7.25</td><td>9.85</td><td>6900</td><td>Petrol</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>3</td><td>wagon r</td><td>2011</td><td>2.85</td><td>4.15</td><td>5200</td><td>Petrol</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>4</td><td>swift</td><td>2014</td><td>4.60</td><td>6.87</td><td>42450</td><td>Diesel</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
  </tbody>
</table>
`,
      },
      {
        code: `<div class="output-success"># Display the last 5 rows of the dataset</div>
data.tail()`,
        output: `<table class="data-table">
  <thead>
    <tr>
      <th></th>
      <th>Car_Name</th>
      <th>Year</th>
      <th>Selling_Price</th>
      <th>Present_Price</th>
      <th>Kms_Driven</th>
      <th>Fuel_Type</th>
      <th>Seller_Type</th>
      <th>Transmission</th>
      <th>Owner</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>296</td><td>city</td><td>2016</td><td>9.50</td><td>11.6</td><td>33988</td><td>Diesel</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>297</td><td>brio</td><td>2015</td><td>4.00</td><td>5.9</td><td>60000</td><td>Petrol</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>298</td><td>city</td><td>2009</td><td>3.35</td><td>11.0</td><td>87934</td><td>Petrol</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>299</td><td>city</td><td>2017</td><td>11.50</td><td>12.5</td><td>9000</td><td>Diesel</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>300</td><td>brio</td><td>2016</td><td>5.30</td><td>5.9</td><td>5464</td><td>Petrol</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
  </tbody>
</table>
`,
      },
      {
        code: `<div class="output-success"># Show statistical summary of numerical columns</div>
data.describe()`,
        output: `<table class="data-table stats-table">
  <thead>
    <tr>
      <th></th>
      <th>Year</th>
      <th>Selling_Price</th>
      <th>Present_Price</th>
      <th>Kms_Driven</th>
      <th>Owner</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>count</strong></td><td>301.000000</td><td>301.000000</td><td>301.000000</td><td>301.000000</td><td>301.000000</td></tr>
    <tr><td><strong>mean</strong></td><td>2013.627907</td><td>4.661296</td><td>7.628472</td><td>36947.205980</td><td>0.043189</td></tr>
    <tr><td><strong>std</strong></td><td>2.891554</td><td>5.082812</td><td>8.644115</td><td>38886.883882</td><td>0.247915</td></tr>
    <tr><td><strong>min</strong></td><td>2003.000000</td><td>0.100000</td><td>0.320000</td><td>500.000000</td><td>0.000000</td></tr>
    <tr><td><strong>25%</strong></td><td>2012.000000</td><td>0.900000</td><td>1.200000</td><td>15000.000000</td><td>0.000000</td></tr>
    <tr><td><strong>50%</strong></td><td>2014.000000</td><td>3.600000</td><td>6.400000</td><td>32000.000000</td><td>0.000000</td></tr>
    <tr><td><strong>75%</strong></td><td>2016.000000</td><td>6.000000</td><td>9.900000</td><td>48767.000000</td><td>0.000000</td></tr>
    <tr><td><strong>max</strong></td><td>2018.000000</td><td>35.000000</td><td>92.600000</td><td>500000.000000</td><td>3.000000</td></tr>
  </tbody>
</table>
`,
      },
      {
        code: `<div class="output-success"># Display dataset structure and data types</div>
data.info()`,
        output: `<div class="output-text">&lt;class 'pandas.core.frame.DataFrame'&gt;</div>
<div class="output-text">RangeIndex: 301 entries, 0 to 300</div>
<div class="output-text">Data columns (total 9 columns):</div>
<table class="data-table" style="width: auto;">
  <thead>
    <tr>
      <th>#</th>
      <th>Column</th>
      <th>Non-Null Count</th>
      <th>Dtype</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>Car_Name</td><td>301 non-null</td><td>object</td></tr>
    <tr><td>1</td><td>Year</td><td>301 non-null</td><td>int64</td></tr>
    <tr><td>2</td><td>Selling_Price</td><td>301 non-null</td><td>float64</td></tr>
    <tr><td>3</td><td>Present_Price</td><td>301 non-null</td><td>float64</td></tr>
    <tr><td>4</td><td>Kms_Driven</td><td>301 non-null</td><td>int64</td></tr>
    <tr><td>5</td><td>Fuel_Type</td><td>301 non-null</td><td>object</td></tr>
    <tr><td>6</td><td>Seller_Type</td><td>301 non-null</td><td>object</td></tr>
    <tr><td>7</td><td>Transmission</td><td>301 non-null</td><td>object</td></tr>
    <tr><td>8</td><td>Owner</td><td>301 non-null</td><td>int64</td></tr>
  </tbody>
</table>
<div class="output-text" style="margin-top:5px;">dtypes: float64(2), int64(3), object(4)</div>
<div class="output-text">memory usage: 21.3+ KB</div>`
      },
      {
        code: `<div class="output-success"># Check the number of missing values in each column</div>
data.isnull().sum()`,
        output: `<table class="data-table" style="width: auto;">
  <thead>
    <tr>
      <th>Column</th>
      <th>0</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Car_Name</td><td>0</td></tr>
    <tr><td>Year</td><td>0</td></tr>
    <tr><td>Selling_Price</td><td>0</td></tr>
    <tr><td>Present_Price</td><td>0</td></tr>
    <tr><td>Kms_Driven</td><td>0</td></tr>
    <tr><td>Fuel_Type</td><td>0</td></tr>
    <tr><td>Seller_Type</td><td>0</td></tr>
    <tr><td>Transmission</td><td>0</td></tr>
    <tr><td>Owner</td><td>0</td></tr>
  </tbody>
</table>
<div class="output-text" style="font-size:0.8rem; margin-top:5px;">dtype: int64</div>`
      },
      {
        code: `<div class="output-success"># Show the number of rows and columns in the dataset</div>
data.shape`,
        output: `<div class="output-text">(301, 9)</div>`
      },
      {
        code: `<div class="output-success"># Count occurrences of each Fuel_Type in the dataset</div>
data['Fuel_Type'].value_counts()`,
        output: `<table class="data-table" style="width: auto;">
  <thead>
    <tr><th>Fuel_Type</th><th>count</th></tr>
  </thead>
  <tbody>
    <tr><td>Petrol</td><td>239</td></tr>
    <tr><td>Diesel</td><td>60</td></tr>
    <tr><td>CNG</td><td>2</td></tr>
  </tbody>
</table>
<div class="output-text" style="font-size:0.8rem; margin-top:5px;">dtype: int64</div>`
      },
      {
        code: `<div class="output-success"># Count occurrences of each Seller_Type in the dataset</div>
data['Seller_Type'].value_counts()`,
        output: `<table class="data-table" style="width: auto;">
  <thead>
    <tr><th>Seller_Type</th><th>count</th></tr>
  </thead>
  <tbody>
    <tr><td>Dealer</td><td>195</td></tr>
    <tr><td>Individual</td><td>106</td></tr>
  </tbody>
</table>
<div class="output-text" style="font-size:0.8rem; margin-top:5px;">dtype: int64</div>`
      },
      {
        code: `<div class="output-success"># Count occurrences of each Transmission type in the dataset</div>
data['Transmission'].value_counts()`,
        output: `<table class="data-table" style="width: auto;">
  <thead>
    <tr><th>Transmission</th><th>count</th></tr>
  </thead>
  <tbody>
    <tr><td>Manual</td><td>261</td></tr>
    <tr><td>Automatic</td><td>40</td></tr>
  </tbody>
</table>
<div class="output-text" style="font-size:0.8rem; margin-top:5px;">dtype: int64</div>`
      },
    ]
  },
  {
    id: 'data_preprocessing',
    title: 'Data Preprocessing',
    blocks: [
      {
        code: `<div class="output-success"># Encode Fuel_Type column by mapping categorical values to numerical (Petrol:0, Diesel:1, CNG:2)</div>
data = data.replace({'Fuel_Type':{'Petrol':0, 'Diesel':1, 'CNG':2}})
data`,
        output: `<div class="output-text"><strong>Dataset after Fuel_Type Encoding:</strong></div>

<table class="data-table">
  <thead>
    <tr>
      <th></th>
      <th>Car_Name</th>
      <th>Year</th>
      <th>Selling_Price</th>
      <th>Present_Price</th>
      <th>Kms_Driven</th>
      <th>Fuel_Type</th>
      <th>Seller_Type</th>
      <th>Transmission</th>
      <th>Owner</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>ritz</td><td>2014</td><td>3.35</td><td>5.59</td><td>27000</td><td>0</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>1</td><td>sx4</td><td>2013</td><td>4.75</td><td>9.54</td><td>43000</td><td>1</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>2</td><td>ciaz</td><td>2017</td><td>7.25</td><td>9.85</td><td>6900</td><td>0</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>3</td><td>wagon r</td><td>2011</td><td>2.85</td><td>4.15</td><td>5200</td><td>0</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>4</td><td>swift</td><td>2014</td><td>4.60</td><td>6.87</td><td>42450</td><td>1</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>
    <tr><td>296</td><td>city</td><td>2016</td><td>9.50</td><td>11.60</td><td>33988</td><td>1</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>297</td><td>brio</td><td>2015</td><td>4.00</td><td>5.90</td><td>60000</td><td>0</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>298</td><td>city</td><td>2009</td><td>3.35</td><td>11.00</td><td>87934</td><td>0</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>299</td><td>city</td><td>2017</td><td>11.50</td><td>12.50</td><td>9000</td><td>1</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
    <tr><td>300</td><td>brio</td><td>2016</td><td>5.30</td><td>5.90</td><td>5464</td><td>0</td><td>Dealer</td><td>Manual</td><td>0</td></tr>
  </tbody>
</table>
<div class="output-text" style="margin-top:5px;">301 rows × 9 columns</div>`,
      },
      {
        code: `<div class="output-success"># Encode Seller_Type column by mapping categorical values to numerical (Dealer:0, Individual:1)</div>
data = data.replace({'Seller_Type':{'Dealer':0, 'Individual':1}})
data`,
        output: `<div class="output-text"><strong>Dataset after Seller_Type Encoding:</strong></div>

<table class="data-table">
  <thead>
    <tr>
      <th></th>
      <th>Car_Name</th>
      <th>Year</th>
      <th>Selling_Price</th>
      <th>Present_Price</th>
      <th>Kms_Driven</th>
      <th>Fuel_Type</th>
      <th>Seller_Type</th>
      <th>Transmission</th>
      <th>Owner</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>ritz</td><td>2014</td><td>3.35</td><td>5.59</td><td>27000</td><td>0</td><td>0</td><td>Manual</td><td>0</td></tr>
    <tr><td>1</td><td>sx4</td><td>2013</td><td>4.75</td><td>9.54</td><td>43000</td><td>1</td><td>0</td><td>Manual</td><td>0</td></tr>
    <tr><td>2</td><td>ciaz</td><td>2017</td><td>7.25</td><td>9.85</td><td>6900</td><td>0</td><td>0</td><td>Manual</td><td>0</td></tr>
    <tr><td>3</td><td>wagon r</td><td>2011</td><td>2.85</td><td>4.15</td><td>5200</td><td>0</td><td>0</td><td>Manual</td><td>0</td></tr>
    <tr><td>4</td><td>swift</td><td>2014</td><td>4.60</td><td>6.87</td><td>42450</td><td>1</td><td>0</td><td>Manual</td><td>0</td></tr>
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>
    <tr><td>296</td><td>city</td><td>2016</td><td>9.50</td><td>11.60</td><td>33988</td><td>1</td><td>0</td><td>Manual</td><td>0</td></tr>
    <tr><td>297</td><td>brio</td><td>2015</td><td>4.00</td><td>5.90</td><td>60000</td><td>0</td><td>0</td><td>Manual</td><td>0</td></tr>
    <tr><td>298</td><td>city</td><td>2009</td><td>3.35</td><td>11.00</td><td>87934</td><td>0</td><td>0</td><td>Manual</td><td>0</td></tr>
    <tr><td>299</td><td>city</td><td>2017</td><td>11.50</td><td>12.50</td><td>9000</td><td>1</td><td>0</td><td>Manual</td><td>0</td></tr>
    <tr><td>300</td><td>brio</td><td>2016</td><td>5.30</td><td>5.90</td><td>5464</td><td>0</td><td>0</td><td>Manual</td><td>0</td></tr>
  </tbody>
</table>
<div class="output-text" style="margin-top:5px;">301 rows × 9 columns</div>`,
      },
      {
        code: `<div class="output-success"># Encode Transmission column by mapping categorical values to numerical (Manual:0, Automatic:1)</div>
data = data.replace({'Transmission':{'Manual':0, 'Automatic':1}})
data`,
        output: `<div class="output-text"><strong>Dataset after Transmission Encoding:</strong></div>

<table class="data-table">
  <thead>
    <tr>
      <th></th>
      <th>Car_Name</th>
      <th>Year</th>
      <th>Selling_Price</th>
      <th>Present_Price</th>
      <th>Kms_Driven</th>
      <th>Fuel_Type</th>
      <th>Seller_Type</th>
      <th>Transmission</th>
      <th>Owner</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>ritz</td><td>2014</td><td>3.35</td><td>5.59</td><td>27000</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>1</td><td>sx4</td><td>2013</td><td>4.75</td><td>9.54</td><td>43000</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>2</td><td>ciaz</td><td>2017</td><td>7.25</td><td>9.85</td><td>6900</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>3</td><td>wagon r</td><td>2011</td><td>2.85</td><td>4.15</td><td>5200</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>4</td><td>swift</td><td>2014</td><td>4.60</td><td>6.87</td><td>42450</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>
    <tr><td>296</td><td>city</td><td>2016</td><td>9.50</td><td>11.60</td><td>33988</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>297</td><td>brio</td><td>2015</td><td>4.00</td><td>5.90</td><td>60000</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>298</td><td>city</td><td>2009</td><td>3.35</td><td>11.00</td><td>87934</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>299</td><td>city</td><td>2017</td><td>11.50</td><td>12.50</td><td>9000</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>300</td><td>brio</td><td>2016</td><td>5.30</td><td>5.90</td><td>5464</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
  </tbody>
</table>
<div class="output-text" style="margin-top:5px;">301 rows × 9 columns</div>`,
      },
    ]
  },

  {
    id: 'model_training',
    title: 'Model Training',
    blocks: [
      {
        code: `<div class="output-success"># Create feature matrix X by dropping Car_Name and Selling_Price columns</div>
X = data.drop(['Car_Name','Selling_Price'], axis=1)
print("Feature matrix X created by dropping 'Car_Name' and 'Selling_Price' columns.")`,
        output: `<div class="output-success">Feature matrix X created by dropping 'Car_Name' and 'Selling_Price' columns.</div>`
      },
      {
        code: `<div class="output-success"># Create target vector Y containing the Selling_Price column</div>
Y = data['Selling_Price']
print("Target vector Y created from 'Selling_Price' column.")`,
        output: `<div class="output-success">Target vector Y created from 'Selling_Price' column.</div>`
      },
      {
        code: `<div class="output-success"># Display the first 5 rows of the feature matrix X</div>
X.head()`,
        output: `<div class="output-text"><strong>Feature Matrix (X) Preview:</strong></div>
<table class="data-table">
  <thead>
    <tr>
      <th></th>
      <th>Year</th>
      <th>Present_Price</th>
      <th>Kms_Driven</th>
      <th>Fuel_Type</th>
      <th>Seller_Type</th>
      <th>Transmission</th>
      <th>Owner</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>2014</td><td>5.59</td><td>27000</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>1</td><td>2013</td><td>9.54</td><td>43000</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>2</td><td>2017</td><td>9.85</td><td>6900</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>3</td><td>2011</td><td>4.15</td><td>5200</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>4</td><td>2014</td><td>6.87</td><td>42450</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
  </tbody>
</table>`
      },
      {
        code: `<div class="output-success"># Display the first 5 values of the target vector Y</div>
Y.head()`,
        output: `<div class="output-text"><strong>Target Vector (Y) Preview:</strong></div>
<table class="data-table" style="max-width: 200px;">
  <thead>
    <tr><th></th><th>Selling_Price</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>3.35</td></tr>
    <tr><td>1</td><td>4.75</td></tr>
    <tr><td>2</td><td>7.25</td></tr>
    <tr><td>3</td><td>2.85</td></tr>
    <tr><td>4</td><td>4.60</td></tr>
  </tbody>
</table>
<div class="output-text" style="font-size:0.8rem; margin-top:5px;">dtype: float64</div>`
      },
      {
        code: `<div class="output-success"># Split the dataset into training and testing sets, then train a Linear Regression model</div>
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size = 0.15, random_state = 123)
model = LinearRegression()
model.fit(X_train, Y_train)
print("Model Trained Successfully")`,
        output: `<div class="output-text" style="font-family: monospace; padding: 10px;">
  <div style="color: #0077b6; margin-bottom: 10px;">Model Trained Successfully</div>
  <img src="./images/train.png" style="max-width: 100%; border: 1px solid #ddd; border-radius: 8px;" alt="Training Visualization">
</div>`
      }
    ]
  },
  {
    id: 'model_evaluation',
    title: 'Model Evaluation',
    blocks: [
      {
        code: `<div class="output-success"># Generate predictions for training and testing datasets using the trained model</div>
Y_train_pred = model.predict(X_train)
Y_test_pred = model.predict(X_test)
print("Predictions generated for both Train and Test sets.")`,
        output: `<div class="output-success">Predictions generated for both Train and Test sets.</div>`
      },
      {
        code: `<div class="output-success"># Evaluate model performance on training data using MAE, MSE, RMSE, and R2 score</div>
mae = mean_absolute_error(Y_train, Y_train_pred)
mse = mean_squared_error(Y_train, Y_train_pred)
rmse = np.sqrt(mse)
r2 = r2_score(Y_train, Y_train_pred)

print("Mean Absolute Error (MAE):", mae)
print("Mean Squared Error (MSE):", mse)
print("Root MSE (RMSE):", rmse)
print("R² Score:", r2)`,
        output: `<div class="output-text" style="font-family: monospace; white-space: pre-wrap;">Mean Absolute Error (MAE): 1.1605491562123338
Mean Squared Error (MSE): 3.015625977191586
Root MSE (RMSE): 1.7365557800403608
R² Score: 0.8869753499147778</div>`
      },
      {
        code: `<div class="output-success"># Evaluate model performance on testing data using MAE, MSE, RMSE, and R2 score</div>
mae = mean_absolute_error(Y_test, Y_test_pred)
mse = mean_squared_error(Y_test, Y_test_pred)
rmse = np.sqrt(mse)
r2 = r2_score(Y_test, Y_test_pred)

print("Mean Absolute Error (MAE):", mae)
print("Mean Squared Error (MSE):", mse)
print("Root MSE (RMSE):", rmse)
print("R² Score:", r2)`,
        output: `<div class="output-text" style="font-family: monospace; white-space: pre-wrap;">Mean Absolute Error (MAE): 1.3160017493663516
Mean Squared Error (MSE): 3.8164774430610064
Root MSE (RMSE): 1.953580672684903
R² Score: 0.8114116982277362</div>`
      },
      {
        code: `<div class="output-success"># Retrieve the learned coefficients and intercept of the linear regression model</div>
print("Coefficients:", model.coef_)
print("Intercept:", model.intercept_)`,
        output: `<div class="output-text" style="font-family: monospace; white-space: pre-wrap;">Coefficients: [ 3.92825483e-01  4.39836584e-01 -5.25747442e-06  1.38880051e+00 -1.25197058e+00  1.44799328e+00 -7.41998907e-01]
Intercept: -789.4879877881141</div>`
      },
      {
        code: `<div class="output-success"># Plot residuals against predicted values on training data to analyze error patterns</div>
residuals = Y_train - Y_train_pred
plt.scatter(Y_train_pred, residuals)
plt.axhline(0, color='red', linestyle='--', linewidth=2)
plt.xlabel("Predicted Price")
plt.ylabel("Residual (Actual - Predicted)")
plt.title("Residual vs Predicted Plot on Train Set")
plt.show()`,
        output: `<div style="text-align:left; padding:0px;">
    <h4 style="margin:0 0 10px 0;">Residual vs Predicted Plot on Train Set</h4>
    <div style="display:flex; justify-content:flex-start; align-items:flex-start; padding-top:10px;">
        <img src="./images/rvp_train.png" style="max-width:100%; max-height:400px; border: 1px solid #ddd; border-top: 5px solid #F57C2A; border-radius: 4px;" alt="Residual vs Predicted (Train)">
    </div>
</div>`
      },
      {
        code: `<div class="output-success"># Plot residuals against predicted values on testing data to assess model generalization</div>
residuals = Y_test - Y_test_pred
plt.scatter(Y_test_pred, residuals)
plt.axhline(0, color='red', linestyle='--', linewidth=2)
plt.xlabel("Predicted Price")
plt.ylabel("Residual (Actual - Predicted)")
plt.title("Residual vs Predicted Plot on Test Set")
plt.show()`,
        output: `<div style="text-align:left; padding:0px;">
    <h4 style="margin:0 0 10px 0;">Residual vs Predicted Plot on Test Set</h4>
    <div style="display:flex; justify-content:flex-start; align-items:flex-start; padding-top:10px;">
        <img src="./images/rvp_test.png" style="max-width:100%; max-height:400px; border: 1px solid #ddd; border-top: 5px solid #F57C2A; border-radius: 4px;" alt="Residual vs Predicted (Test)">
    </div>
</div>`
      },
      {
        code: `<div class="output-success"># Choose one random test sample from the dataset to compare the actual and predicted selling prices.</div>
test_samples = data.sample(n=5, random_state=42)
display(test_samples)
print("Interactive Prediction Table Loaded")`,
        output: `<div class="output-success">Interactive Prediction Table Loaded</div>
<div id="randomPredContainer" style="font-family:sans-serif; padding:10px;">
    <div style="margin-bottom:10px; font-weight:normal; color:#333; font-size: 1.1rem; background: #fff; padding: 5px 15px; border: 1px solid #ddd; border-top: 5px solid #F57C2A; border-radius: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); width: fit-content;">Choose one random test sample.</div>
    <div style="overflow-x:auto; margin-bottom:15px; border-radius: 15px; border: 1px solid #999; background: #ccc;">
        <table class="data-table" style="cursor:pointer; width:100%; border-collapse: collapse; margin: 15px;">
            <thead>
                <tr style="background: white;">
                    <th style="border: 1px solid #333; padding: 8px;"></th>
                    <th style="border: 1px solid #333; padding: 8px;">Car_Name</th>
                    <th style="border: 1px solid #333; padding: 8px;">Year</th>
                    <th style="border: 1px solid #333; padding: 8px;">Selling_Price</th>
                    <th style="border: 1px solid #333; padding: 8px;">Present_Price</th>
                    <th style="border: 1px solid #333; padding: 8px;">Kms_Driven</th>
                    <th style="border: 1px solid #333; padding: 8px;">Fuel_Type</th>
                    <th style="border: 1px solid #333; padding: 8px;">Seller_Type</th>
                    <th style="border: 1px solid #333; padding: 8px;">Transmission</th>
                    <th style="border: 1px solid #333; padding: 8px;">Owner</th>
                </tr>
            </thead>
            <tbody id="randomPredTableBody" style="background: white;">
               <!-- Rows injected by JS -->
            </tbody>
        </table>
    </div>
    
    <div id="randomPredResult" style="padding:20px; display:none; border-radius: 15px; border: 1.5px solid #2d485a; background: #a8d9d8; color: #000; font-family: courier, monospace; font-size: 1.3rem; line-height: 1.6;">
        <!-- Result injected here -->
    </div>
</div>`
      }
    ]

  }

];

const SINGLE_VAR_STEPS = [
  {
    id: 'import_libraries',
    title: 'Importing Libraries',
    blocks: [
      {
        code: `# Importing Libraries
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
print("Libraries Imported");`,
        output: `<div class="output-success">Libraries Imported</div>`
      }
    ]
  },
  {
    id: 'reading_data',
    title: 'Loading Dataset',
    blocks: [
      {
        code: `# Read and store the salary dataset
data = pd.read_csv('Salary_dataset.csv')
print("Dataset reading complete")`,
        output: `<div class="output-text">Dataset reading complete</div>`
      }
    ]
  },
  {
    id: 'data_analysis',
    title: 'Data Analysis',
    blocks: [
      {
        code: `<div class="output-success"># Display the first 5 rows of the dataset</div>
data.head()`,
        output: `<table class="data-table">
  <thead>
    <tr>
      <th>index</th>
      <th>YearsExperience</th>
      <th>Salary</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>1.2</td><td>39344</td></tr>
    <tr><td>1</td><td>1.4</td><td>46206</td></tr>
    <tr><td>2</td><td>1.6</td><td>37732</td></tr>
    <tr><td>3</td><td>2.1</td><td>43526</td></tr>
    <tr><td>4</td><td>2.3</td><td>39892</td></tr>
  </tbody>
</table>`
      },
      {
        code: `<div class="output-success"># Display the last 5 rows of the dataset</div>
data.tail()`,
        output: `<table class="data-table">
  <thead>
    <tr>
      <th>index</th>
      <th>YearsExperience</th>
      <th>Salary</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>25</td><td>9.1</td><td>105583</td></tr>
    <tr><td>26</td><td>9.6</td><td>116970</td></tr>
    <tr><td>27</td><td>9.7</td><td>112636</td></tr>
    <tr><td>28</td><td>10.4</td><td>122392</td></tr>
    <tr><td>29</td><td>10.6</td><td>121873</td></tr>
  </tbody>
</table>`
      },
      {
        code: `<div class="output-success"># Summary statistics for numerical columns</div>
data.describe()`,
        output: `<table class="data-table stats-table">
  <thead>
    <tr>
      <th></th>
      <th>YearsExperience</th>
      <th>Salary</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>count</strong></td><td>30.000000</td><td>30.000000</td></tr>
    <tr><td><strong>mean</strong></td><td>5.413333</td><td>76004.000000</td></tr>
    <tr><td><strong>std</strong></td><td>2.837888</td><td>27414.429785</td></tr>
    <tr><td><strong>min</strong></td><td>1.200000</td><td>37732.000000</td></tr>
    <tr><td><strong>25%</strong></td><td>3.300000</td><td>56721.750000</td></tr>
    <tr><td><strong>50%</strong></td><td>4.800000</td><td>65238.000000</td></tr>
    <tr><td><strong>75%</strong></td><td>7.800000</td><td>100545.750000</td></tr>
    <tr><td><strong>max</strong></td><td>10.600000</td><td>122392.000000</td></tr>
  </tbody>
</table>`
      },
      {
        code: `<div class="output-success"># Concise summary of a DataFrame</div>
data.info()`,
        output: `<div class="output-text" style="font-family: monospace; white-space: pre-wrap;">&lt;class 'pandas.core.frame.DataFrame'&gt;
RangeIndex: 30 entries, 0 to 29
Data columns (total 2 columns):
 #   Column           Non-Null Count  Dtype  
---  ------           --------------  -----  
 0   YearsExperience  30 non-null     float64
 1   Salary           30 non-null     int64  
dtypes: float64(1), int64(1)
memory usage: 612.0 bytes</div>`
      },
      {
        code: `<div class="output-success"># Detect missing values</div>
data.isnull().sum()`,
        output: `<div class="output-text" style="font-family: monospace; white-space: pre-wrap;">YearsExperience    0
Salary             0
dtype: int64</div>`
      },
      {
        code: `<div class="output-success"># Return a tuple representing the dimensionality of the DataFrame</div>
data.shape`,
        output: `<div class="output-text" style="font-family: monospace; white-space: pre-wrap;">(30, 2)</div>`
      }
    ]
  },
  {
    id: 'data_preprocessing',
    title: 'Data Preprocessing',
    blocks: [
      {
        code: `<div class="output-success"># Convert YearsExperience to the nearest lower integer by removing decimal values</div>
data['YearsExperience'] = np.floor(data['YearsExperience']).astype(int)
data`,
        output: `<div class="output-text"><strong>Dataset after Preprocessing:</strong></div>
<table class="data-table">
  <thead>
    <tr>
      <th>index</th>
      <th>YearsExperience</th>
      <th>Salary</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>1</td><td>39344</td></tr>
    <tr><td>1</td><td>1</td><td>46206</td></tr>
    <tr><td>2</td><td>1</td><td>37732</td></tr>
    <tr><td>3</td><td>2</td><td>43526</td></tr>
    <tr><td>4</td><td>2</td><td>39892</td></tr>
    <tr><td>5</td><td>3</td><td>56643</td></tr>
    <tr><td>6</td><td>3</td><td>60151</td></tr>
    <tr><td>7</td><td>3</td><td>54446</td></tr>
    <tr><td>8</td><td>3</td><td>64446</td></tr>
    <tr><td>9</td><td>3</td><td>57190</td></tr>
    <tr><td>10</td><td>4</td><td>63219</td></tr>
    <tr><td>11</td><td>4</td><td>55795</td></tr>
    <tr><td>12</td><td>4</td><td>56958</td></tr>
    <tr><td>13</td><td>4</td><td>57082</td></tr>
    <tr><td>14</td><td>4</td><td>61112</td></tr>
    <tr><td>15</td><td>5</td><td>67939</td></tr>
    <tr><td>16</td><td>5</td><td>66030</td></tr>
    <tr><td>17</td><td>5</td><td>83089</td></tr>
    <tr><td>18</td><td>6</td><td>81364</td></tr>
    <tr><td>19</td><td>6</td><td>93941</td></tr>
    <tr><td>20</td><td>6</td><td>91739</td></tr>
    <tr><td>21</td><td>7</td><td>98274</td></tr>
    <tr><td>22</td><td>8</td><td>101303</td></tr>
    <tr><td>23</td><td>8</td><td>113813</td></tr>
    <tr><td>24</td><td>8</td><td>109432</td></tr>
    <tr><td>25</td><td>9</td><td>105583</td></tr>
    <tr><td>26</td><td>9</td><td>116970</td></tr>
    <tr><td>27</td><td>9</td><td>112636</td></tr>
    <tr><td>28</td><td>10</td><td>122392</td></tr>
    <tr><td>29</td><td>10</td><td>121873</td></tr>
  </tbody>
</table>`
      }
    ]
  },
  {
    id: 'model_training',
    title: 'Model Training',
    blocks: [
      {
        code: `<div class="output-success"># Create feature matrix X and target vector Y</div>
X = data.drop(['Salary'], axis=1)
print("Feature matrix X created.")`,
        output: `<div class="output-success">Feature matrix X created.</div>`
      },
      {
        code: `<div class="output-success"># Display the first 5 rows of the feature matrix X</div>
X.head()`,
        output: `<table class="data-table">
  <thead>
    <tr>
      <th></th>
      <th>YearsExperience</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>1</td></tr>
    <tr><td>1</td><td>1</td></tr>
    <tr><td>2</td><td>1</td></tr>
    <tr><td>3</td><td>2</td></tr>
    <tr><td>4</td><td>2</td></tr>
  </tbody>
</table>`
      },
      {
        code: `<div class="output-success"># Create target vector Y</div>
Y = data['Salary']
print("Target vector Y created.")`,
        output: `<div class="output-success">Target vector Y created.</div>`
      },
      {
        code: `<div class="output-success"># Display the first 5 rows of the target vector Y</div>
Y.head()`,
        output: `<div class="output-text" style="font-family: monospace; white-space: pre-wrap;">0    39344
1    46206
2    37732
3    43526
4    39892
Name: Salary, dtype: int64</div>`
      },
      {
        code: `<div class="output-success"># Split the dataset into training and testing sets</div>
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size = 0.15, random_state = 123)
model = LinearRegression()
model.fit(X_train, Y_train)
print("Model Trained")`,
        output: `<div class="output-text" style="font-family: monospace; padding: 10px;">
  <div style="color: #0077b6; margin-bottom: 10px;">Model Trained</div>
  <img src="./images/train.png" style="max-width: 100%; border: 1px solid #ddd; border-radius: 8px;" alt="Training Visualization">
</div>`
      }
    ]
  },
  {
    id: 'model_evaluation',
    title: 'Model Evaluation',
    blocks: [
      {
        code: `<div class="output-success"># Generate predictions for training and testing datasets using the trained model</div>
Y_train_pred = model.predict(X_train)
Y_test_pred = model.predict(X_test)
print("Predictions generated for both Train and Test sets.")`,
        output: `<div class="output-success">Predictions generated for both Train and Test sets.</div>`
      },
      {
        code: `<div class="output-success"># Evaluate model performance on training data using MAE, MSE, RMSE, and R2 score</div>
mae = mean_absolute_error(Y_train, Y_train_pred)
mse = mean_squared_error(Y_train, Y_train_pred)
rmse = np.sqrt(mse)
r2 = r2_score(Y_train, Y_train_pred)

print("Mean Absolute Error (MAE):", mae)
print("Mean Squared Error (MSE):", mse)
print("Root MSE (RMSE):", rmse)
print("R2 Score:", r2)`,
        output: `<div class="output-text" style="font-family: monospace; white-space: pre-wrap;">Mean Absolute Error (MAE): 5457.139011764704
Mean Squared Error (MSE): 39230345.16254117
Root MSE (RMSE): 6263.413219845963
R2 Score: 0.9422825046716273</div>`
      },
      {
        code: `<div class="output-success"># Evaluate model performance on testing data using MAE, MSE, RMSE, and R2 score</div>
mae = mean_absolute_error(Y_test, Y_test_pred)
mse = mean_squared_error(Y_test, Y_test_pred)
rmse = np.sqrt(mse)
r2 = r2_score(Y_test, Y_test_pred)

print("Mean Absolute Error (MAE):", mae)
print("Mean Squared Error (MSE):", mse)
print("Root MSE (RMSE):", rmse)
print("R2 Score:", r2)`,
        output: `<div class="output-text" style="font-family: monospace; white-space: pre-wrap;">Mean Absolute Error (MAE): 3245.035764705882
Mean Squared Error (MSE): 20356724.219709344
Root MSE (RMSE): 4511.842663447978
R2 Score: 0.9774778470484203</div>`
      },
      {
        code: `<div class="output-success"># Retrieve the learned coefficient (slope) of the linear regression model</div>
model.coef_`,
        output: `<div class="output-text" style="font-family: monospace;">array([9704.95294118])</div>`
      },
      {
        code: `<div class="output-success"># Retrieve the intercept (bias term) of the linear regression model</div>
model.intercept_`,
        output: `<div class="output-text" style="font-family: monospace;">np.float64(26104.915294117643)</div>`
      },
      {
        code: `<div class="output-success"># Plot actual training data points and the fitted linear regression line for visualization</div>
plt.scatter(X_train, Y_train, label='Actual Salary Data')
plt.plot(X_train, Y_train_pred, color='red', label='Fitted Regression Line')
plt.xlabel('Years of Experience'); plt.ylabel('Salary')
plt.title('Linear Regression Fit')
plt.legend(); plt.show()`,
        output: `<div style="text-align:left; padding:0px;">
    <h4 style="margin:0 0 10px 0;">Linear Regression Fit (Training Data)</h4>
    <div style="display:flex; justify-content:flex-start; align-items:flex-start; padding-top:10px;">
        <img src="./images/lr_fit.png" style="max-width:100%; max-height:400px; border: 1px solid #ddd; border-top: 5px solid #F57C2A; border-radius: 4px;" alt="Linear Regression Fit">
    </div>
</div>`
      },
      {
        code: `<div class="output-success"># Plot actual testing data points and the fitted linear regression line to evaluate model performance</div>
plt.scatter(X_test, Y_test, label='Actual Salary Data')
plt.plot(X_test, Y_test_pred, color='red', label='Fitted Regression Line')
plt.xlabel('Years of Experience'); plt.ylabel('Salary')
plt.title('Linear Regression Fit')
plt.legend(); plt.show()`,
        output: `<div style="text-align:left; padding:0px;">
    <h4 style="margin:0 0 10px 0;">Linear Regression Fit (Testing Data)</h4>
    <div style="display:flex; justify-content:flex-start; align-items:flex-start; padding-top:10px;">
        <img src="./images/lr_fit_test.png" style="max-width:100%; max-height:400px; border: 1px solid #ddd; border-top: 5px solid #F57C2A; border-radius: 4px;" alt="Linear Regression Fit">
    </div>
</div>`
      },
      {
        code: `<div class="output-success"># Plot residuals against predicted values on train data to check error patterns and model assumptions</div>
residuals = Y_train - Y_train_pred
plt.scatter(Y_train_pred, residuals); plt.axhline(y=0, color='red', linestyle='--')
plt.xlabel("Predicted Salary")
plt.ylabel("Error (Residual)")
plt.title("Predicted vs Residuals on Train Set"); plt.show()`,
        output: `<div style="text-align:left; padding:0px;">
    <h4 style="margin:0 0 10px 0;">Predicted vs Residuals (Train Set)</h4>
    <div style="display:flex; justify-content:flex-start; align-items:flex-start; padding-top:10px;">
        <img src="./images/pvr_train.png" style="max-width:100%; max-height:400px; border: 1px solid #ddd; border-top: 5px solid #F57C2A; border-radius: 4px;" alt="PVR Train Set">
    </div>
</div>`
      },
      {
        code: `<div class="output-success"># Plot residuals versus predicted values on test data to assess model generalization and error distribution</div>
residuals = Y_test - Y_test_pred
plt.scatter(Y_test_pred, residuals)
plt.axhline(y=0, color='red', linestyle='--') # reference line for zero error
plt.xlabel("Predicted Salary")
plt.ylabel("Error (Residual)")
plt.title("Predicted vs Residuals on Test Set")
plt.show()`,
        output: `<div style="text-align:left; padding:0px;">
    <h4 style="margin:0 0 10px 0;">Predicted vs Residuals (Test Set)</h4>
    <div style="display:flex; justify-content:flex-start; align-items:flex-start; padding-top:10px;">
        <img src="./images/pvr_test.png" style="max-width:100%; max-height:400px; border: 1px solid #ddd; border-top: 5px solid #F57C2A; border-radius: 4px;" alt="PVR Test Set">
    </div>
</div>`
      },
      {
        code: `<div class="output-success"># Predict test values, compare actual vs predicted results, and display the top 5 most accurate predictions</div>
Y_test_pred = model.predict(X_test)

comparison_df = pd.DataFrame({
    "Actual Salary": Y_test,
    "Predicted Salary": np.round(Y_test_pred, 2),
    "Error": np.round(Y_test - Y_test_pred, 2),
    "Absolute Error": np.round(abs(Y_test - Y_test_pred), 2)
})

best_predictions = comparison_df.sort_values(by="Absolute Error").head(5)
print(best_predictions)`,
        output: `<div class="output-text"><strong>Best Predictions:</strong></div>
<table class="data-table">
  <thead>
    <tr>
      <th></th>
      <th>Actual Selling Price</th>
      <th>Predicted Selling Price</th>
      <th>Error</th>
      <th>Absolute Error</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>7</td><td>54446</td><td>55219.77</td><td>-773.77</td><td>773.77</td></tr>
    <tr><td>29</td><td>121873</td><td>123154.44</td><td>-1281.44</td><td>1281.44</td></tr>
    <tr><td>5</td><td>56643</td><td>55219.77</td><td>1423.23</td><td>1423.23</td></tr>
    <tr><td>26</td><td>116970</td><td>113449.49</td><td>3520.51</td><td>3520.51</td></tr>
    <tr><td>8</td><td>64446</td><td>55219.77</td><td>9226.23</td><td>9226.23</td></tr>
  </tbody>
</table>`
      }
    ]
  }

];

let stepsData = [];

// State Management
let hasCompletedOnce = sessionStorage.getItem('lr_completed') === 'true';

let STATE = {
  stepIndex: 0,
  subStepIndex: 0,
  stepsStatus: []
};

// Initial status (will be set after selection)
function resetState() {
  STATE.stepIndex = 0;
  STATE.subStepIndex = 0;
  STATE.stepsStatus = stepsData.map(() => ({ unlocked: false, completed: false, partial: false }));
  if (STATE.stepsStatus.length > 0) {
    STATE.stepsStatus[0].unlocked = true;
  }
}

// DOM Elements
const stepsContainer = document.getElementById('stepsContainer');
const codeDisplay = document.getElementById('codeDisplay');
const outputDisplay = document.getElementById('outputDisplay');
const outputContent = document.getElementById('outputDisplay'); // Wrapper reuse
const bottomPane = document.querySelector('.bottom-pane');
const runBtn = document.getElementById('runBtn');

// Initialize UI
function init() {
  const singleBtn = document.getElementById('singleVarBtn');
  const multiBtn = document.getElementById('multiVarBtn');
  const selectionScreen = document.getElementById('selectionScreen');
  const mainContainer = document.getElementById('mainContainer');

  if (singleBtn && multiBtn) {
    singleBtn.onclick = () => startSimulation('single');
    multiBtn.onclick = () => startSimulation('multi');
  }

  function startSimulation(mode) {
    if (mode === 'single') {
      stepsData = SINGLE_VAR_STEPS;
    } else {
      stepsData = MULTI_VAR_STEPS;
    }

    selectionScreen.classList.add('hidden');
    mainContainer.classList.remove('hidden');

    resetState();
    renderSidebar();
    loadStep(0);
  }

  // Handle Download Listener
  const downloadBtn = document.querySelector('.download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadPDF);
  }
}

// Render Sidebar with Color Logic
function renderSidebar() {
  stepsContainer.innerHTML = '';

  stepsData.forEach((step, index) => {
    const status = STATE.stepsStatus[index];
    const btn = document.createElement('button');
    btn.classList.add('step-btn');
    btn.innerText = step.title;

    // Label Logic
    let label = `${index + 1}. ${step.title} `;
    if (status.completed) label = `✓ ${step.title} `;
    btn.innerText = label;

    // Styling & Interaction Logic
    if (status.unlocked) {
      if (status.completed) {
        btn.classList.add('completed');
      } else if (status.partial) {
        btn.classList.add('in-progress');
      } else {
        // Default unlocked state (Blue via CSS)
      }

      btn.disabled = false;
      btn.style.cursor = 'pointer';

      // Mark current active
      if (index === STATE.stepIndex) {
        btn.classList.add('active');
      }

      // Allow click to load/revisit
      btn.onclick = () => {
        loadStep(index);
      };
    } else {
      // Locked -> Grey
      btn.classList.add('disabled');
      btn.innerText = label;
      btn.disabled = true;
      btn.onclick = (e) => e.preventDefault();
    }

    stepsContainer.appendChild(btn);
  });

  // Loading Spinner (Hidden by default)
  const loader = document.createElement('div');
  loader.className = 'loading-spinner';
  loader.innerText = 'Loading...';
  loader.style.width = '100%';
  loader.style.textAlign = 'center';
  loader.style.marginTop = '20px';
  loader.style.display = 'none';
  stepsContainer.appendChild(loader);

  // Add Restart Button at the end
  const restartBtn = document.createElement('button');
  restartBtn.classList.add('step-btn');
  restartBtn.innerText = "Restart Experiment";
  restartBtn.style.backgroundColor = "#333";
  restartBtn.style.textAlign = 'center';
  restartBtn.style.marginTop = "auto";
  restartBtn.style.color = "white";
  restartBtn.onclick = restartExperiment;
  stepsContainer.appendChild(restartBtn);

  // Add Download Button below Restart
  const downloadBtn = document.createElement('button');
  downloadBtn.classList.add('step-btn');
  downloadBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; vertical-align: middle;">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    Download Experiment
  `;
  downloadBtn.style.textAlign = 'center';
  downloadBtn.style.marginTop = "10px";
  
  // Check if all steps are completed (or were completed before a restart)
  const allCompleted = checkAllStepsCompleted() || hasCompletedOnce;
  if (allCompleted) {
    downloadBtn.style.backgroundColor = "#F57C2A";
    downloadBtn.style.color = "white";
    downloadBtn.style.opacity = "1";
    downloadBtn.style.cursor = "pointer";
    downloadBtn.disabled = false;
    downloadBtn.onclick = downloadPDF;
  } else {
    downloadBtn.style.backgroundColor = "#f5f5f5";
    downloadBtn.style.color = "#9e9e9e";
    downloadBtn.style.opacity = "1";
    downloadBtn.style.cursor = "default";
    downloadBtn.style.border = "1px solid #e0e0e0";
    downloadBtn.disabled = false;
    downloadBtn.title = "Need to run the Experiment to download the pdf.";
    downloadBtn.onclick = function () {
      alert("Need to run the Experiment to download the pdf.");
    };
  }
  stepsContainer.appendChild(downloadBtn);
}

// Function to check if all steps are completed
function checkAllStepsCompleted() {
  return STATE.stepsStatus.every(status => status.completed);
}


function loadStep(index) {
  STATE.stepIndex = index;
  STATE.subStepIndex = 0; // Fix: Always reset sub-step when loading a main step
  renderSidebar();
  updateUI();
}

function updateUI() {
  const step = stepsData[STATE.stepIndex];
  if (STATE.subStepIndex >= step.blocks.length) STATE.subStepIndex = 0;

  const block = step.blocks[STATE.subStepIndex];

  // Extract and Update Comment Header
  const commentMatch = block.code.match(/#\s*([^<\n\r]*)/); // Extract comment until tag or newline
  const codeHeaderBar = document.getElementById('codeHeaderBar');
  if (commentMatch) {
    codeHeaderBar.innerText = "# " + commentMatch[1].trim();
    codeHeaderBar.style.display = 'block';
  } else {
    codeHeaderBar.style.display = 'none';
  }

  // Update Code (Remove all HTML tags and then extract code)
  const codeWithoutTags = block.code.replace(/<[^>]*>/g, '');
  const codeWithoutComment = codeWithoutTags.replace(/#\s*.*/, '').trim();
  codeDisplay.innerHTML = highlightCode(codeWithoutComment);

  // Reset Output
  bottomPane.classList.remove('active-output');
  // Reset any inline styles added by completion message
  bottomPane.style.display = '';
  bottomPane.style.flexDirection = '';
  bottomPane.style.justifyContent = '';
  bottomPane.style.alignItems = '';

  outputContent.innerHTML = '<div class="placeholder-text">Click the Run button to execute...</div>';

  // Reset Button State (Simple & Safe)
  runBtn.style.display = 'flex'; // Fix: Ensure button is visible after restart
  runBtn.classList.remove('completed');
  runBtn.style.backgroundColor = '#F57C2A'; // Orange (#F57C2A)
  runBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
  runBtn.disabled = false;

  // ALWAYS reset onclick to standard runStep
  runBtn.onclick = runStep;
}

function runStep() {
  const step = stepsData[STATE.stepIndex];
  const block = step.blocks[STATE.subStepIndex];

  // 1. Loading State
  outputContent.innerHTML = '<div class="loading-spinner">Running code...</div>';
  runBtn.disabled = true;

  // 2. Simulated Delay (2 seconds)
  setTimeout(() => {
    // 3. Show Output
    outputContent.innerHTML = block.output;
    bottomPane.classList.add('active-output');

    // 4. Update Button State to Checkmark (Success)
    runBtn.classList.add('completed');
    runBtn.style.backgroundColor = '#A6CE63'; // Green (#A6CE63)
    runBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    // Mark partial progress
    STATE.stepsStatus[STATE.stepIndex].partial = true;
    renderSidebar();

    // Check if this is the Random Prediction block
    if (document.getElementById('randomPredTableBody')) {
      window.generateRandomPrediction && window.generateRandomPrediction();
    }

    // 5. Handle Next Logic
    const hasNextBlock = STATE.subStepIndex < step.blocks.length - 1;

    if (hasNextBlock) {
      // Wait 1s then change button to "Next"
      setTimeout(() => {
        runBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
        runBtn.style.backgroundColor = '#5FA8E4'; // Orange
        runBtn.disabled = false;

        // Switch handler to Next
        runBtn.onclick = nextSubStep;
      }, 500);

    } else {
      // Step Fully Completed
      STATE.stepsStatus[STATE.stepIndex].completed = true;
      renderSidebar(); // Update Current Step to Green Immediately

      // Unlock next step logic
      if (STATE.stepIndex < stepsData.length - 1) {
        STATE.stepsStatus[STATE.stepIndex + 1].unlocked = true;
        renderSidebar(); // Update Next Step to Red Immediately

        // Manual Next Step Arrow Button
        setTimeout(() => {
          // Change button to Blue Arrow for Next Step
          runBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
          runBtn.style.backgroundColor = '#5FA8E4'; // Blue (#5FA8E4)
          runBtn.disabled = false;

          // Logic to go to next MAIN step
          runBtn.onclick = function () {
            loadStep(STATE.stepIndex + 1);
          };
        }, 500);
      } else {
        // End of Experiment - Show "Next" (Finish) Button
        renderSidebar();
        setTimeout(() => {
          runBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
          runBtn.style.backgroundColor = '#72b2f7ff'; // Orange
          runBtn.disabled = false;
          runBtn.onclick = showCompletionMessage;
        }, 500);
      }
    }

  }, 500);
}

function nextSubStep() {
  STATE.subStepIndex++;
  updateUI(); // This will reset button to Red/Run for the new block
}

function restartExperiment() {
  resetState();
  loadStep(0);
}

function highlightCode(code) {
  // Only highlight keywords that are not inside strings
  // Split by strings first, then apply highlighting only to non-string parts
  let result = '';
  let inString = false;
  let stringChar = '';
  let i = 0;
  let currentPart = '';
  
  while (i < code.length) {
    const char = code[i];
    
    if (!inString && (char === '"' || char === "'")) {
      // Apply highlighting to current part before string
      result += currentPart
        .replace(/\bimport /g, '<span class="kw">import </span>')
        .replace(/\bdef /g, '<span class="kw">def </span>')
        .replace(/\breturn /g, '<span class="kw">return </span>')
        .replace(/\bprint\b/g, '<span class="func">print</span>');
      currentPart = '';
      inString = true;
      stringChar = char;
      result += char;
    } else if (inString && char === stringChar) {
      result += char;
      inString = false;
      stringChar = '';
    } else if (inString) {
      result += char;
    } else {
      currentPart += char;
    }
    i++;
  }
  
  // Apply highlighting to remaining part
  result += currentPart
    .replace(/\bimport /g, '<span class="kw">import </span>')
    .replace(/\bdef /g, '<span class="kw">def </span>')
    .replace(/\breturn /g, '<span class="kw">return </span>')
    .replace(/\bprint\b/g, '<span class="func">print</span>');
  
  return result;
}

// Global scope for HTML callbacks
window.updateSigmoidPlot = function () {
  const featureSelect = document.getElementById('featureSelect');
  if (!featureSelect) return; // Guard

  const feature = featureSelect.value;
  const container = document.getElementById('sigmoidPlot');

  // Use static image matching the feature name
  // Default to Age if feature is just "Feature" or empty, but here we read value
  // Ensure the image fits comfortably without massive white borders
  container.innerHTML = `<img src="./images/${feature}.png" alt="Sigmoid of ${feature}" style="max-height:300px; border:none; display:block;">`;
};

// Global scope for Random Prediction Table
window.generateRandomPrediction = function () {
  const tbody = document.getElementById('randomPredTableBody');
  if (!tbody) return;

  // Car samples matching user feedback
  const samples = [
    { index: 31, name: 'ritz', year: 2011, actual: 2.35, present: 4.89, kms: 54200, fuel: 'Petrol', seller: 'Dealer', trans: 'Manual', owner: 0, pred: 2.35, error: 0.00 },
    { index: 144, name: 'Bajaj Pulsar NS 200', year: 2014, actual: 0.60, present: 0.99, kms: 25000, fuel: 'Petrol', seller: 'Individual', trans: 'Manual', owner: 0, pred: 0.71, error: -0.11 },
    { index: 42, name: 'sx4', year: 2008, actual: 1.95, present: 7.15, kms: 58000, fuel: 'Petrol', seller: 'Dealer', trans: 'Manual', owner: 0, pred: 2.15, error: -0.20 },
    { index: 114, name: 'Royal Enfield Classic 350', year: 2015, actual: 1.15, present: 1.47, kms: 17000, fuel: 'Petrol', seller: 'Individual', trans: 'Manual', owner: 0, pred: 1.36, error: -0.21 },
    { index: 89, name: 'etios g', year: 2014, actual: 4.75, present: 6.76, kms: 40000, fuel: 'Petrol', seller: 'Dealer', trans: 'Manual', owner: 0, pred: 4.43, error: 0.32 }
  ];

  tbody.innerHTML = '';
  samples.forEach(s => {
    const tr = document.createElement('tr');
    tr.style.background = 'white';
    tr.style.cursor = 'pointer';
    tr.onclick = () => window.showPredictionResult(s, tr);

    tr.innerHTML = `
      <td style="border: 1px solid #333; padding: 8px; font-weight: bold; text-align: center;">${s.index}</td>
      <td style="border: 1px solid #333; padding: 8px;">${s.name}</td>
      <td style="border: 1px solid #333; padding: 8px; text-align: center;">${s.year}</td>
      <td style="border: 1px solid #333; padding: 8px; text-align: center;">${s.actual.toFixed(2)}</td>
      <td style="border: 1px solid #333; padding: 8px; text-align: center;">${s.present.toFixed(2)}</td>
      <td style="border: 1px solid #333; padding: 8px; text-align: center;">${s.kms}</td>
      <td style="border: 1px solid #333; padding: 8px; text-align: center;">${s.fuel}</td>
      <td style="border: 1px solid #333; padding: 8px; text-align: center;">${s.seller}</td>
      <td style="border: 1px solid #333; padding: 8px; text-align: center;">${s.trans}</td>
      <td style="border: 1px solid #333; padding: 8px; text-align: center;">${s.owner}</td>
    `;
    tbody.appendChild(tr);
  });
};

window.showPredictionResult = function (s, tr) {
  const resDiv = document.getElementById('randomPredResult');
  if (!resDiv) return;

  // highlight row
  const rows = document.querySelectorAll('#randomPredTableBody tr');
  rows.forEach(r => r.style.backgroundColor = 'white');
  tr.style.backgroundColor = '#a5d6a7'; // Green highlight like in screenshot

  resDiv.style.display = 'block';
  resDiv.innerHTML = `
    <div style="font-size: 1.4rem; margin-bottom: 10px; font-family: sans-serif;">Predicted Selling Price and Error</div>
    <div>Actual Price: ${s.actual.toFixed(2)}</div>
    <div>Predicted Price: ${s.pred.toFixed(2)}</div>
    <div>Error: ${s.error.toFixed(2)}</div>
  `;
};

// Global scope for Confusion Matrix Animation (Simplified for Image)
window.animateConfusionMatrix = function () {
  // No animation needed for static image, but keeping function to prevent errors if called
};

// Completion Message
function showCompletionMessage() {
  hasCompletedOnce = true;
  sessionStorage.setItem('lr_completed', 'true');
  outputContent.innerHTML = ''; // Clear output content
  bottomPane.classList.add('active-output');
  bottomPane.style.display = 'flex';
  bottomPane.style.flexDirection = 'column';
  bottomPane.style.justifyContent = 'center';
  bottomPane.style.alignItems = 'center';

  const modeName = stepsData === SINGLE_VAR_STEPS ? "Single Variable" : "Multi-Variable";
  const msgHTML = `
    <style>
      @keyframes clap {
        0%, 100% { transform: rotate(-15deg) scale(1); }
        50% { transform: rotate(15deg) scale(1.1); }
      }
      .clapping-hands {
        display: inline-block;
        font-size: 2.5rem;
        animation: clap 0.5s ease-in-out infinite;
        margin: 0 5px;
      }
    </style>
    <div style="text-align: center; animation: fadeIn 1s ease;">
      <div style="margin-bottom: 20px;">
        <span class="clapping-hands">👏</span>
        <span class="clapping-hands" style="animation-delay: 0.15s;">👏</span>
        <span class="clapping-hands" style="animation-delay: 0.3s;">👏</span>
      </div>
      <h1 style="color: #2a9d8f; font-size: 2.5rem; margin-bottom: 20px;">Congratulations!</h1>
      <p style="font-size: 1.2rem; color: #333; max-width: 600px; margin: 0 auto;">You have successfully completed Linear Regression experiment. You now understand how Linear Regression models are used to predict continuous values and evaluate their effectiveness.</p>
      <button onclick="openLinearRegressionAnimation()" style="
        margin-top: 24px;
        background: #1e293b;
        color: white;
        border: none;
        padding: 16px 32px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        transition: all 0.2s;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      " onmouseover="this.style.background='#334155'; this.style.transform='translateY(-2px)'"
         onmouseout="this.style.background='#1e293b'; this.style.transform='translateY(0)'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Enter Interactive Animation
      </button>
      <button onclick="restartExperiment()" style="margin-top: 30px; padding: 15px 30px; background-color: #f7a072; color: white; border: none; border-radius: 10px; font-size: 1.2rem; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Restart Experiment</button>
    </div>
  `;
  outputContent.innerHTML = msgHTML;
  // Hide run button or make it inactive
  runBtn.style.display = 'none';
}

function openLinearRegressionAnimation() {
  window.open('./animation-linear-regression/index.html', '_blank');
}

// PDF Download Logic
function downloadPDF() {
    // Redirect to the PDF file for download
    window.open('assets/EXP-2.pdf', '_blank');
}


init();
