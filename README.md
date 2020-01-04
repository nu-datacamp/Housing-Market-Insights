
### <a href="http://housing-markets.herokuapp.com/" target="_blank">Click here to view the Heroku app</a>


# ETL Project Technical Report

The goal of this project was to explore housing market trends across all counties in the U.S. Through a web-based app, users would be able to evaluate relationships between different housing and economic factors over time and across different areas of the country.

### Extraction

Housing, income and population datasets were downloaded from the U.S. Census website. Files were downloaded individually for every year from 2010 to 2017. Home sales information was extracted from Zillow.

### Transformation

For each dataset (home sales, housing, income, and population), all years were combined into a single file - either manually in Excel or via [Python scripts](https://github.com/nu-datacamp/Housing-Market-Insights/blob/master/Population%20Data/combine%20population%20csv.ipynb). The year values were put into separate columns in the combined files.

Next, the datasets were trimmed to only include the attributes relevant to the web-based app. In examining the data, discrepancies were noted in the labels across years and work was done in Excel to consolidate the data. 

After the separate datasets were cleaned, all files were consolidated into a single source file.

### Load

Using a [Python script](https://github.com/nu-datacamp/Housing-Market-Insights/blob/master/csv-to-sqlite.ipynb), the combined CSV file was converted to a SQLITE database: "housing_db." The table included a row per county per year from 2010-2017. [DB Browser](https://sqlitebrowser.org/) was utilized for additional cleaning and reviewing the table.

### Web App
With the SQLITE database, a Flask Python script was utilized as the basis for the web app. The Leaflet Javascript library was used for dynamic map overlays based on a variety of housing and economic factors, while Lodash was used to improve the responsiveness of the on-screen filters. Plotly was used for dot charts, bubble charts, and a time graph. Click events were utilized to tie together the different charts based on selected counties and variables.

### Resources
* https://www.census.gov/topics/housing/data.html
* https://leafletjs.com/
* https://lodash.com
* https://plot.ly/javascript/
* https://www.zillow.com/
* https://sqlitebrowser.org/
