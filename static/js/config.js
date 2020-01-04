// API key
const API_KEY = "pk.eyJ1IjoiZGFtdWRqZTkxIiwiYSI6ImNrM3Rld3hlcDAyNm8zbXFsdnJ3M2F5MGMifQ.WVZKs3Ya5luN4GvVc4Z2jA"

//*******************************************************************************************
//  FRIENDLY NAME CONVERTER
//  Converts database SQL column names to friendly syntax for users
//*******************************************************************************************

function friendlyName(i){
    if (i == "total_housing_units") {
      return "Total Housing Units";
    }
    else if (i == "total_housing_units_occupied") {
      return  "Total Housing Units (Occupied)";
    }
    else if (i == "median_rooms") {
      return  "Median Rooms";
    }
    else if (i == "owner_occupied_units") {
      return  "Owner Occupied Units";
    }
    else if (i == "renter_occupied_units") {
      return  "Renter Occupied Units";
    }
    else if (i == "median_home_value") {
      return  "Median Home Value";
    }
    else if (i == "median_home_sales_zillow") {
      return  "Median Home Sales Price";
    }
    else if (i == "median_rent") {
      return  "Median Rent";
    }
    else if (i == "monthly_cost_with_mortgage") {
      return  "Monthly Cost - With Mortgage";
    }
    else if (i == "monthly_cost_no_mortgage") {
      return  "Monthly Cost - No Mortgage";
    }
    else if (i == "median_income") {
      return  "Median Income";
    }
    else if (i == "population") {
      return  "Population";
    }
  };



/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}
