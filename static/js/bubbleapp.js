//*******************************************************************************************
//  CONTROL FOR WHAT IS SELECTED
//  starts at these values, as user changes selections they will update
//*******************************************************************************************

selectedYear = 2017;
selected_xAxis = "median_home_value";
selected_yAxis = "median_income";
stateView = "all"
selectedState = "Illinois"


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
}

//*******************************************************************************************
//  BUILD BUBBLE CHARTS FUNCTION
//  for initial load and which state view is desired
//*******************************************************************************************

// Build bubble chart when page loads
buildBubble(selectedYear, selected_xAxis, selected_yAxis)

// Directs updated bubblechart to the appropriate function (all, highlight, isolate versions)
function whichBubbleBuilder(){
  if (stateView == "all") {
    buildBubble(selectedYear, selected_xAxis, selected_yAxis);
  }
  else if (stateView == "isolate") {
    buildBubbleStateIsolate(selectedYear, selected_xAxis, selected_yAxis);
  }
  else if (stateView == "highlight") {
    buildBubbleStateHighlight(selectedYear, selected_xAxis, selected_yAxis);
  }
}

//*******************************************************************************************
//  ALL STATES BUBBLE CHART
//  for initial load and changes from user
//*******************************************************************************************

// Builds the bubble chart
function buildBubble(year, x, y) {
  d3.json(`/bubble/${year}/${x}/${y}`).then((data) => {

    // arrays for plotting
    x_axis_list = [];
    y_axis_list = [];
    county_labels_list = [];
    pop_size_list = [];
    county_st_list = [];

    // populate arrays
    data.forEach(d => {
      x_axis_list.push(d[x]);
      y_axis_list.push(d[y]);
      county_labels_list.push(d["county"] + ", " + d["state"]);
      pop_size_list.push(d["population"] * .0003);
      county_st_list.push(d["county_state"]);
    });

    // convert axis titles to friendly name
    var x_axis_title = friendlyName(selected_xAxis);
    var y_axis_title = friendlyName(selected_yAxis);
    var bubble_title = selectedYear + " " + x_axis_title + " vs. " + y_axis_title;

    // Build a Bubble Chart
    var bubbleLayout = {
      hovermode: "closest",
      automargin: true,
      height: 630,
      width: 945,
      title: {
        text: bubble_title,
        font: {
          family: 'arial black',
          size: 18
          }
        },
      xaxis: { title: x_axis_title },
      yaxis: { title: y_axis_title }
    };
    
    var bubbleData = [
      {
        x: x_axis_list,
        y: y_axis_list,
        text: county_labels_list,
        mode: "markers",
        marker: {
          size: pop_size_list,
          sizemode: 'area'
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });

  selectedYear = year
  selected_xAxis = x
  selected_yAxis = y
  console.log(`current selected year is ${selectedYear}`)
  console.log(`current selected x is ${x}`)
  console.log(`current selected y is ${y}`)
}

//*******************************************************************************************
//  HIGHLIGHT STATES BUBBLE CHART
//  shows selected state highlighted in orange compared to all other states
//*******************************************************************************************

// Builds the bubble chart
function buildBubbleStateHighlight(year, x, y) {
  d3.json(`/bubble/${year}/${x}/${y}`).then((data) => {

    // arrays for plotting non selected states
    x_axis_list = [];
    y_axis_list = [];
    county_labels_list = [];
    pop_size_list = [];
    county_st_list = [];

    // arrays for plotting selected states
    x_axis_list_state = [];
    y_axis_list_state = [];
    county_labels_list_state = [];
    pop_size_list_state = [];
    county_st_list_state = [];

    // populate arrays
    data.forEach(d => {
      if (d["state"] != selectedState){
          x_axis_list.push(d[x]);
          y_axis_list.push(d[y]);
          county_labels_list.push(d["county"] + ", " + d["state"]);
          pop_size_list.push(d["population"] * .0003);
          county_st_list.push(d["county_state"]);
        }
      else if (d["state"] == selectedState){
        x_axis_list_state.push(d[x]);
        y_axis_list_state.push(d[y]);
        county_labels_list_state.push(d["county"] + ", " + d["state"]);
        pop_size_list_state.push(d["population"] * .0003);
        county_st_list_state.push(d["county_state"]);
      }
    });

    // convert axis titles to friendly name
    var x_axis_title = friendlyName(selected_xAxis);
    var y_axis_title = friendlyName(selected_yAxis);
    var bubble_title = selectedYear + " " + x_axis_title + " vs. " + y_axis_title;

    // Build a Bubble Chart
    var bubbleLayout = {
      hovermode: "closest",
      automargin: true,
      height: 630,
      width: 945,
      title: {
        text: bubble_title,
        font: {
          family: 'arial black',
          size: 18
          }
        },
      xaxis: { title: x_axis_title },
      yaxis: { title: y_axis_title }
    };
    
    var bubbleData = [
      {
        x: x_axis_list,
        y: y_axis_list,
        text: county_labels_list,
        mode: "markers",
        marker: {
          size: pop_size_list,
          sizemode: 'area',
          color: "#7f7f7f"
          },
        name: "Other States"
      },
      {
        x: x_axis_list_state,
        y: y_axis_list_state,
        text: county_labels_list_state,
        mode: "markers",
        marker: {
          size: pop_size_list_state,
          sizemode: 'area',
          color: "#ff7f0e"
          },
        name: selectedState
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });

  selectedYear = year
  selected_xAxis = x
  selected_yAxis = y
  console.log(`current selected year is ${selectedYear}`)
  console.log(`current selected x is ${x}`)
  console.log(`current selected y is ${y}`)
}

//*******************************************************************************************
//  ISOLATE STATES BUBBLE CHART
//  shows ONLY the selected state 
//*******************************************************************************************

// Builds the bubble chart
function buildBubbleStateIsolate(year, x, y) {
  d3.json(`/bubble/${year}/${x}/${y}`).then((data) => {

    // arrays for plotting non selected states
    x_axis_list = [];
    y_axis_list = [];
    county_labels_list = [];
    pop_size_list = [];
    county_st_list = [];

    // arrays for plotting selected states
    x_axis_list_state = [];
    y_axis_list_state = [];
    county_labels_list_state = [];
    pop_size_list_state = [];
    county_st_list_state = [];

    // populate arrays
    data.forEach(d => {
      if (d["state"] != selectedState){
          x_axis_list.push(d[x]);
          y_axis_list.push(d[y]);
          county_labels_list.push(d["county"] + ", " + d["state"]);
          pop_size_list.push(d["population"] * .0003);
          county_st_list.push(d["county_state"]);
        }
      else if (d["state"] == selectedState){
        x_axis_list_state.push(d[x]);
        y_axis_list_state.push(d[y]);
        county_labels_list_state.push(d["county"] + ", " + d["state"]);
        pop_size_list_state.push(d["population"] * .0003);
        county_st_list_state.push(d["county_state"]);
      }
    });

    // convert axis titles to friendly name
    var x_axis_title = friendlyName(selected_xAxis);
    var y_axis_title = friendlyName(selected_yAxis);
    var bubble_title = selectedYear + " " + x_axis_title + " vs. " + y_axis_title;

    // Build a Bubble Chart
    var bubbleLayout = {
      hovermode: "closest",
      automargin: true,
      height: 630,
      width: 945,
      title: {
        text: bubble_title,
        font: {
          family: 'arial black',
          size: 18
          }
        },
      xaxis: { title: x_axis_title },
      yaxis: { title: y_axis_title }
    };
    
    var bubbleData = [
      {
        x: x_axis_list_state,
        y: y_axis_list_state,
        text: county_labels_list_state,
        mode: "markers",
        marker: {
          size: pop_size_list_state,
          sizemode: 'area',
          color: "#ff7f0e"
          },
        name: selectedState
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });

  selectedYear = year
  selected_xAxis = x
  selected_yAxis = y
  console.log(`current selected year is ${selectedYear}`)
  console.log(`current selected x is ${x}`)
  console.log(`current selected y is ${y}`)
}


//*******************************************************************************************
//  RESPONDS TO X AXIS, YAXIS, AND YEAR DROPDOWN FOR BUBBLE CHART
//  rebuilds charts based on dropdowns
//*******************************************************************************************
function newXBubble(new_x){
  selected_xAxis = new_x
  console.log(`${selected_xAxis} is the new x axis selection`);
  whichBubbleBuilder()
}

function newYBubble(new_y){
  selected_yAxis = new_y
  console.log(`${selected_yAxis} is the new y axis selection`);
  whichBubbleBuilder()
}

function newYearBubble(new_year){
  selectedYear = new_year
  console.log(`${selectedYear} is the new year selection`);
  whichBubbleBuilder()
}



//***********************************************************************************************
//  HANDLES REQUESTS FOR STATES
//  changes the state view status and rebuilds the chart for all, isolate, or highlighted states
//***********************************************************************************************

function stateIsolate(){
  stateView = "isolate"
  selectedState = d3.select("#stateSelector").property("value");
  console.log(`State changed to ${selectedState}`);
  console.log(`The current selected state is ${stateView}`);
  whichBubbleBuilder()
}

function stateHighlight(){
  stateView = "highlight"
  selectedState = d3.select("#stateSelector").property("value");
  console.log(`State changed to ${selectedState}`);
  console.log(`State status changed to ${stateView}`);
  whichBubbleBuilder()
}

function stateAll(){
  stateView = "all"
  console.log(`State status changed to ${stateView}`);
  whichBubbleBuilder()
}