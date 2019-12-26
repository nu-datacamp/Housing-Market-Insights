//*******************************************************************************************
//  CONTROL FOR WHAT IS SELECTED
//  starts at these values, as user changes selections they will update
//*******************************************************************************************

selected_county = "0500000US17031"
// selected_var1 = "median_home_value";
// selected_var2 = "median_income";
// selected_var3 = "population"

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
}

//*******************************************************************************************
//  BUILD TIME SERIES CHARTS FUNCTION
//  for initial load and which state view is desired
//*******************************************************************************************

buildTable(selected_county);

// set up ChartBuilder function
function TableBuilder(){
    buildTable(selected_county);
};


function buildTable(county) {

  selected_county = county
//   selected_var1 = var1
//   selected_var2 = var2
//   selected_var3 = var3
//   console.log(`current selected county is ${county}`)
//   console.log(`current selected variable 1 is ${var1}`)
//   console.log(`current selected variable 2 is ${var2}`)
//   console.log(`current selected variable 3 is ${var3}`)

  d3.json(`/${county}`).then((data) => {
    //const median_income = data.median_income;
    //const year = data.year;
    //const median_home_value = data.median_home_value;
    //const pop = data.population;
    // Build a Bubble Chart

    

    // var data = [trace1, trace2, trace3];
    console.log(data)
    console.log(data.median_home_value)
    var values = [
        ['Median Home Value', 'Median Income', 'Population', "Total Housing Units", "Median Rent", "Another Variable"],
        ['placeholder1', 'placeholder2', 'placeholder3','placeholder4','placeholder5', "placeholder6"]]
  
    var data = [{
    type: 'table',
    header: {
        values: [["<b>Some Text</b>"], 
                    ["<b>Year or some other text</b>"]],
        align: ["left", "center"],
        line: {width: 1, color: 'black'},
        fill: {color: 'gray'},
        font: {family: "Arial", size: 18, color: "white"}
    },
    cells: {
        values: values,
        align: ["left", "center"],
        height:25,
        line: {color: "black", width: 1},
        //fill: {color: ['black', 'white']},
        font: {family: "Arial", size: 12, color: ["#506784"]}
    }

    }]

var layout = {
    title: "Some Table Name",
    margin: {
        // l:0,
        // r:0,
        // b:0,
        // t:0,
        // pad:0,
        l: 10,
        r: 10,
        b: 50,
        t: 50,
        pad: 1
      },
    }  
  
  Plotly.plot('summary-card', data, layout);
  });
  
  
}

// //*******************************************************************************************
// //  RESPONDS TO DROPDOWN MENUSELECTIONFOR TIMESERIES CHART
// //  rebuilds charts based on dropdowns
// //*******************************************************************************************
// function NewVar1(new_var1){
//   selected_var1 = new_var1
//   console.log(`${selected_var1} is the new variable 1 selection`);
//   // buildCharts(selected_county, selected_var1, selected_var2, selected_var3);
//   ChartBuilder()
// }

// function NewVar2(new_var2){
//   selected_var2 = new_var2
//   console.log(`${selected_var2} is the new variable 2 selection`);
//   // buildCharts(selected_county, selected_var1, selected_var2, selected_var3);
//   ChartBuilder()
// }

// function NewVar3(new_var3){
//   selected_var3 = new_var3
//   console.log(`${selected_var3} is the new variable 3 selection`);
//   //buildCharts(selected_county, selected_var1, selected_var2, selected_var3);
//   ChartBuilder()
// }


