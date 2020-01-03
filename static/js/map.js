// console.log('geo json import!!!!', geoJson);
var mapApiData;
var mapVariable = 'median_home_value';
var mapYear = '2017';
var mapMin;
var mapMax;
var mapInterval;
mapLayersDict = {};
var mapDefaultStyle;
var mapHighlightStyle = {
  color : '#774947',
  weight : 1.8,
};
var mapSelectedCounty;
var myMap;
var mapSelectedCountyName;
var mapSelectedCountyState;

function mapHighlight (layer) {
  // Check if something's highlighted, if so unset highlight
  // Set highlight style on layer and store to variable
  if (mapSelectedCounty) {
    mapUnHighlight(mapSelectedCounty);
  };
  mapDefaultStyle = {
    fillColor : layer.options.fillColor,
    color : layer.options.color,
    weight: .75
  };
  layer.setStyle(mapHighlightStyle);
  layer.bringToFront();
  myMap.fitBounds(layer.getBounds());
  mapSelectedCounty = layer;
  mapSelectedCountyName = mapApiData[`${layer.feature.properties.GEO_ID}`]['county'];
  mapSelectedCountyState = mapApiData[`${layer.feature.properties.GEO_ID}`]['state'];
  mapNameLegend(mapSelectedCountyName, mapSelectedCountyState, myMap)
};

function mapUnHighlight (layer) {
  // Set default style and clear variable
  layer.setStyle(mapDefaultStyle);
  layer.bringToBack();
  mapSelectedCounty = null;
};

var legend2 = L.control({position: 'bottomleft'});

function mapNameLegend(mapSelectedCountyName, mapSelectedCountyState, myMap) {
  legend2.onAdd = function(myMap) {
    var div2 = L.DomUtil.create('div', 'info legend');
    div2.innerHTML = `<h5>${mapSelectedCountyName}</h5><h5>${mapSelectedCountyState}</h5>`
    return div2;
  }
  legend2.addTo(myMap);
}
// var MmCall = d3.json(`/map/${mapVariable}/${mapYear}/min_max`).then(data => {
//   mapMin = data.min;
//   mapMax = data.max;
//   mapInterval = (mapMax - mapMin) / 5;
// });

function MapApiCall(mapVariable, mapYear) {
  document.getElementById('leafletmap').innerHTML = "<div id='map'></div>";
  d3.json(`/map/${mapVariable}/${mapYear}`).then(ApiData => { 
  mapApiData = ApiData;
  mapMin = ApiData['min_max']['min'];
  mapMax = ApiData['min_max']['max'];
  mapInterval = (mapMax - mapMin) / 5;

  // Define streetmap and darkmap layers
  var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 7,
  minZoom: 4,
  id: "mapbox.light",
  accessToken: API_KEY
  });

  function mapColor(var_val) {
    if (var_val < (mapMin + mapInterval)) {
      return '#a7c6ae'
    }
    else if(var_val < (mapMin + (2 * mapInterval))) {
      return '#83af8b'
    }
    else if(var_val < (mapMin + (3 * mapInterval))) {
      return '#47774d'
    }
    else if(var_val < (mapMin + (4 * mapInterval))) {
      return '#3c5940'
    }
    else {
      return '#2d3f2f'
    }
  };

  // function mapPopup (Geo_id) {
  //   var mapLabelVariable = `${Geo_id[mapVariable]}`;
  //   var mapPopLabel = `${friendlyName(mapVariable)}`;
  //   // console.log(mapLabelVariable);
  //   // console.log(mapPopLabel);
  //   return `<h5>${Geo_id['county']}</h5>
  //   <p>${mapPopLabel} : ${mapLabelVariable}</p>
  //   <p>Year : ${Geo_id['year']}`
  // }

  function onEachFeature (feature, layer) {
    // console.log(feature.properties.GEO_ID);
    var mapFeatureID = `${feature.properties.GEO_ID}`;
    var mapFeaureVariable = `${mapVariable}`;
    if (ApiData[mapFeatureID]) {
      // console.log(mapApiData[`${feature.properties.GEO_ID}`][`${mapVariable}`]); 
      mapSelectedCountyName = ApiData[mapFeatureID]['county'];
      mapSelectedCountyState = ApiData[mapFeatureID]['state'];
      layer.setStyle({
        fillColor : mapColor(ApiData[mapFeatureID][mapFeaureVariable]),
        color : mapColor(ApiData[mapFeatureID][mapFeaureVariable]),
        weight : .75,
        fillOpacity : 0.65
      });
      // layer.bindPopup(mapPopup((mapApiData[mapFeatureID])));
      layer.on('click', function() {
        county_select(mapFeatureID);
        mapHighlight(layer);
        newCountyTimeSeries(mapFeatureID);
        selectedGeo = mapFeatureID;
        buildBubbleChart(selectedYear, selected_xAxis, selected_yAxis);
        // console.log(layer)
      });
      mapLayersDict[mapFeatureID] = layer;
    }
    else {
      layer.setStyle({
        stroke : false,
        fill : false
      })
    }
  };

  counties = L.geoJSON(geoJson, {
    onEachFeature: onEachFeature
  });



  // Create our map, giving it the streetmap and earthquakes layers to display on load
  myMap = L.map("map", {
    center: [39.833333, -98.583333],
    zoom: 4,
    layers: [counties, streets]
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light": streets
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Counties": counties
  };

  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  
  var legend1 = L.control({position: 'bottomright'});

  legend1.onAdd = function(myMap) {

    var div1 = L.DomUtil.create('div', 'info legend'),
      grades = [Math.round(mapMin),Math.round(mapMin + mapInterval),Math.round(mapMin + (2 * mapInterval)),Math.round(mapMin + (3 * mapInterval)),Math.round(mapMin + (4 * mapInterval))],
      labels = [Number(Math.round(mapMin)).toLocaleString(),Number(Math.round(mapMin + mapInterval)).toLocaleString(),Number(Math.round(mapMin + 2*mapInterval)).toLocaleString(),Number(Math.round(mapMin + 3*mapInterval)).toLocaleString(),Number(Math.round(mapMin + 4*mapInterval)).toLocaleString()];
    
    div1.innerHTML += `<h4>${friendlyName(mapVariable)}</h4><h5>${mapYear}</h5>`  
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div1.innerHTML +=
        '<i style="background:' + mapColor(grades[i]+0.5) + '"></i> ' +
        labels[i] + (labels[i + 1] ? '&ndash;' + labels[i + 1] + '<br>' : '+');
    }
    return div1;
  };
  legend1.addTo(myMap);

  mapHighlight(mapLayersDict[selectedGeo])
  });
};

MapApiCall(mapVariable, mapYear);

