import os

import pandas as pd
import numpy as np
import json

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

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


if __name__ == "__main__":
    app.run()
