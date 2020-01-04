import os

import pandas as pd
import numpy as np
import json

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from scipy import stats

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///housing_db.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Housing_data = Base.classes.housing



@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

# runs the flask app to get the data for the bubble  

@app.route("/bubble/<year>/<x>/<y>")
def scatter(year, x , y):
    """Returns the data needed for the bubble."""
    print('This is the data for the bubble plot.')
    # Use Pandas to perform the sql query
    results = pd.read_sql(f"SELECT geo_id, county, county_state, state, year, population, {x}, {y} FROM housing WHERE year = '{year}' AND {x} IS NOT NULL and {y} IS NOT NULL", db.session.bind)

    # print(results)
    # Return a list of the column names (sample names)
    results = results.to_json(orient='records')
    jsonresults = json.loads(results)
    return jsonify(jsonresults)


@app.route("/<county>")
def county2(county):
    """Return a list of sample names."""
    # Use Pandas to perform the sql querylscc
    results = pd.read_sql(f"select geo_id,county from housing where year = 2017 and geo_id = '{county}'", db.session.bind)
    # print(results)
    # Return a list of the column names (sample names)
    json1 = results.to_json(orient='records')
    jsonfiles = json.loads(json1)
    return jsonify(jsonfiles)


    
@app.route("/timeseries/<county>")
def county3(county):
    """Return a list of sample names."""
    # Use Pandas to perform the sql querylscc
    results = pd.read_sql(f"select * from housing where geo_id = '{county}' order by year", db.session.bind)
    # print(results)
    # Return a list of the column names (sample names)
    json1 = results.to_json(orient='records')
    jsonfiles = json.loads(json1)
    return jsonify(jsonfiles)


@app.route("/summarycard/<county>/<year>")
def county4(county, year):
    """Return a list of sample names."""
    # Use Pandas to perform the sql querylscc
    results = pd.read_sql(f"select * from housing where year = '{year}'", db.session.bind)
    results["owner_percent"] = results["owner_occupied_units"] / results["total_housing_units"]
    results["occupied_percent"] = results["total_housing_units_occupied"] / results["total_housing_units"]
    results["value_to_income"] = results["median_home_value"] / results["median_income"]
    results["percentile_median_home_value"] = [stats.percentileofscore(results["median_home_value"], a) for a in results["median_home_value"]]
    results["percentile_median_income"] = [stats.percentileofscore(results["median_income"], a) for a in results["median_income"]]
    results["percentile_median_rent"] = [stats.percentileofscore(results["median_rent"], a) for a in results["median_rent"]]
    results["percentile_median_rooms"] = [stats.percentileofscore(results["median_rooms"], a) for a in results["median_rooms"]]
    results["percentile_population"] = [stats.percentileofscore(results["population"], a) for a in results["population"]]
    results["percentile_owner_percent"] = [stats.percentileofscore(results["owner_percent"], a) for a in results["owner_percent"]]
    results["percentile_occupied_percent"] = [stats.percentileofscore(results["occupied_percent"], a) for a in results["occupied_percent"]]
    results["percentile_total_housing_units"] = [stats.percentileofscore(results["total_housing_units"], a) for a in results["total_housing_units"]]
    results["percentile_valueincome"] = [stats.percentileofscore(results["value_to_income"], a) for a in results["value_to_income"]]   
    results = results.loc[results['geo_id'] == county]
    # print(results)
    # Return a list of the column names (sample names)
    json1 = results.to_json(orient='records')
    jsonfiles = json.loads(json1)
    return jsonify(jsonfiles)

@app.route("/map/<variable>/<year>")
def map_route(variable, year):
    """Return a list of sample names."""
    # Use Pandas to perform the sql query
    results = pd.read_sql(f"select geo_id, {variable}, year, state, county from housing where year = {year}", db.session.bind)
    if results[f'{variable}'].dtypes == 'int64':
        results[f'{variable}'] = results[f'{variable}'].astype(float)
    results = results.set_index("geo_id")
    json1 = results.to_json(orient='index')
    min1 = results[f'{variable}'].min()
    max1 = results[f'{variable}'].max()
    jsonfiles = json.loads(json1)
    jsonfiles['min_max'] = {'min' : min1, "max" : max1}
    return jsonfiles

if __name__ == "__main__":
    app.run()
