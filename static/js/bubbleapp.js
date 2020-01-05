//*******************************************************************************************
//  CONTROL FOR WHAT IS SELECTED
//  starts at these values, as user changes selections they will update
//*******************************************************************************************

var selectedYear = 2017;
var selected_xAxis = "median_income";
var selected_yAxis = "median_home_value";
var stateView = "all";
var selectedState = "Illinois";
var selectedCounty = "Cook County_Illinois";
var selectedGeo = "0500000US17031";

// value to enable year time series view of bubble chart
var loopThroughYear = false



//*******************************************************************************************
//  COUNTY_STATE CONVERTER
//  Converts from format "Cook County, Illinois" to "Cook County_Illinois" as an example
//*******************************************************************************************
function stateCountyConvert(i){
  county_state = i.replace(", ", "_");
  return county_state
}


// sleep function for running the play through time view of the bubble chart
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

//*******************************************************************************************
//  BUILDS BUBBLE CHART
//  controls for showing all states, highlighting a state, or isolating a state
//*******************************************************************************************

// Build bubble chart when page loads
buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis);

// Builds the bubble chart
function buildBubbleChart(year, x, y) {
  d3.json(`/bubble/${year}/${x}/${y}`).then((data) => {

    // arrays for plotting non selected states
    x_axis_list = [];
    y_axis_list = [];
    county_labels_list = [];
    pop_size_list = [];
    county_st_list = [];
    geo_id_list = [];
    bubble_colors = [];

    // arrays for plotting selected states
    x_axis_list_state = [];
    y_axis_list_state = [];
    county_labels_list_state = [];
    pop_size_list_state = [];
    county_st_list_state = [];
    geo_id_list_state = [];
    bubble_colors_state = [];

    // populate arrays differently, controlling for if the user is looking at all states, highlighting a state, or isolating a state
    data.forEach(d => {
      if (stateView == "all"){
        x_axis_list.push(d[x]);
        y_axis_list.push(d[y]);
        county_labels_list.push(d["county"] + ", " + d["state"]);
        pop_size_list.push(d["population"] * .0003);
        county_st_list.push(d["county_state"]);
        geo_id_list.push(d['geo_id']);
        
        // pushes highlighted color if selected county_state
          if (d["geo_id"] == selectedGeo){
            bubble_colors.push("#cb8763")
          }
          else {
            bubble_colors.push("#1f77b4")
          }   
      }

      else if ((d["state"] != selectedState) && (stateView == "highlight")){
          x_axis_list.push(d[x]);
          y_axis_list.push(d[y]);
          county_labels_list.push(d["county"] + ", " + d["state"]);
          pop_size_list.push(d["population"] * .0003);
          county_st_list.push(d["county_state"]);
          geo_id_list.push(d['geo_id']);

          // pushes highlighted color if selected county_state
          if (d["geo_id"] == selectedGeo){
            bubble_colors.push("#cb8763")
          }
          else {
            bubble_colors.push("#7f7f7f")
          }   
      }

      else if (d["state"] == selectedState){
        x_axis_list_state.push(d[x]);
        y_axis_list_state.push(d[y]);
        county_labels_list_state.push(d["county"] + ", " + d["state"]);
        pop_size_list_state.push(d["population"] * .0003);
        county_st_list_state.push(d["county_state"]);
        geo_id_list_state.push(d['geo_id']);

          // pushes highlighted color if selected county_state
          if (d["geo_id"] == selectedGeo){
            bubble_colors_state.push("#cb8763")
          }
          else {
            bubble_colors_state.push("#63a3cb")
          }   
      }

    });

    // convert axis titles to friendly name
    var x_axis_title = friendlyName(selected_xAxis);
    var y_axis_title = friendlyName(selected_yAxis);
    var bubble_title = selectedYear + " " + x_axis_title + " vs. " + y_axis_title;

    // creates varations of display for state all, highlight, and isolate views
    if (stateView == "all"){
      var name = "All States";
    }
    else {
      var name = "Other States";
    }

    // set axis ranges to constant value if running the loop through year view
    if (loopThroughYear === false){
      max_x_axis = (Math.max(... x_axis_list)) * 1.10;
      max_y_axis = (Math.max(... y_axis_list)) * 1.10;
      min_x_axis = (Math.min(... x_axis_list)) * .9;
      min_y_axis = (Math.min(... y_axis_list)) * .9;
    };

    // Build a Bubble Chart
    var myBubblePlot = document.getElementById('bubble'),
    bubbleLayout = {
      plot_bgcolor:"white",
      hovermode: "closest",
      //automargin: true,
      height: 450,
      // width: 825,
      showlegend: true,
      legend: {
        //bgcolor: "#f2f2f2",
        bordercolor: '#999999',
        borderwidth: 0.5,
        "orientation": "h",
        x: 0.05,
        y: 0.9, // -0.3//.
        // x: 0.0,
        // y: 1.3, // -0.3//.
        bgcolor: 'rgba(0,0,0,0)'
      },
      margin: {
        l: 60,
        r: 10,
        b: 50,
        t: 50,
        pad: 10
      },
      title: {
        y:0.95,
        text: bubble_title,
        font: {
          //family: 'arial black',
          size: 16
          }
        },
      xaxis: { 
        title: x_axis_title,
        zeroline: false,
        range: [min_x_axis, max_x_axis],
        color:'#2685b5',
      },
      yaxis: { 
        title: y_axis_title,
        zeroline: false,
        range: [min_y_axis, max_y_axis],
        color:'#62ac42',
      },
    };
    
    bubbleData = [
      {
        x: x_axis_list,
        y: y_axis_list,
        text: county_labels_list,
        hovertemplate: '<b>%{text}</b> <br>' + friendlyName(x) + ': %{x} <br>' + friendlyName(y) + ': %{y}',
        mode: "markers",
        marker: {
          size: pop_size_list,
          sizemode: 'area',
          color: bubble_colors,
          },
        name: name
      },
      {
        x: x_axis_list_state,
        y: y_axis_list_state,
        text: county_labels_list_state,
        hovertemplate: '<b>%{text}</b> <br>' + friendlyName(x) + ': %{x} <br>' + friendlyName(y) + ': %{y}',
        mode: "markers",
        marker: {
          size: pop_size_list_state,
          sizemode: 'area',
          color: bubble_colors_state,
          },
        name: selectedState
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true}).then  // then handles the year over year view
    if (loopThroughYear === true && selectedYear < 2017){
      selectedYear = selectedYear + 1;
      sleep(300);
      buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis);
    }
    else if (loopThroughYear === true && selectedYear === 2017){
      sleep(300);
      buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis);
      loopThroughYear = false
    }

    myBubblePlot.on('plotly_click', function(data){
      clickedCounty = data.points[0].text;
      selectedCounty = stateCountyConvert(clickedCounty);
      console.log(`${selectedCounty} is the select county`); 

      // grabs the value of the specific state clicked
      clickedState = selectedCounty.split("_")
      clickedState = clickedState[1]
      console.log(clickedState)

      if ((clickedState == selectedState) && (stateView != "all")){
        selectedGeo = (geo_id_list_state[data.points[0].pointIndex])
        }
      else if ((clickedState != selectedState) && (stateView != "all")){
        selectedGeo = (geo_id_list[data.points[0].pointIndex])
        }
      else if (stateView == "all"){
        selectedGeo = (geo_id_list[data.points[0].pointIndex])
        }

      console.log(`${selectedGeo} is the select geoID`); 
      
      // update the county card and time series by calling functions with the new geo
      newCountyTimeSeries(selectedGeo);  //updates time series
      county_select(selectedGeo);  // updates card
      mapHighlight(mapLayersDict[selectedGeo]);  // updates map
      buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis);  // reruns bubble chart
  });
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
  buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis);
}

function newYBubble(new_y){
  selected_yAxis = new_y
  console.log(`${selected_yAxis} is the new y axis selection`);
  buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis);
  MapApiCall(selected_yAxis, selectedYear)
}

function newYearBubble(new_year){
  selectedYear = new_year
  console.log(`${selectedYear} is the new year selection`);
  buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis);
  MapApiCall(selected_yAxis, selectedYear); 
  county_select(selectedGeo);  // updates card

}


//***********************************************************************************************
//  HANDLES REQUESTS FOR STATES
//  changes the state view status and rebuilds the chart for all, isolate, or highlighted states
//***********************************************************************************************
document.getElementById('stateSelector').onkeydown = function(event) {
  if (event.keyCode === 13) {
      event.preventDefault();
  stateHighlight()
  }
}

function stateIsolate(){
  stateView = "isolate"
  userEnteredState = d3.select("#stateSelector").property("value");
  selectedState = _.startCase(userEnteredState);
  // console.log(`The user entered ${userEnteredState}`);
  // console.log(`State changed to ${selectedState}`);
  buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis);
}

function stateHighlight(){
  stateView = "highlight"
  userEnteredState = d3.select("#stateSelector").property("value");
  selectedState = _.startCase(userEnteredState);
  // console.log(`The user entered ${userEnteredState}`);
  // console.log(`State changed to ${selectedState}`);
  buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis);
}

function stateAll(){
  stateView = "all"
  buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis) ;
}



//***********************************************************************************************
//  BUBBLE CHART OVER TIME FUNCTION
//  runs bubble chart for each year available
//**********************************************************************************************

function bubbleOverTime(){
  selectedYear = 2010;
  loopThroughYear = true;
  buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis);
  };

