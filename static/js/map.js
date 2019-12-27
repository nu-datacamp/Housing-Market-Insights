// console.log('geo json import!!!!', geoJson);
var mapApiData;
var mapVariable = 'median_rent';
var mapYear = '2015';
var mapMin;
var mapMax;
var mapInterval;

// var MmCall = d3.json(`/map/${mapVariable}/${mapYear}/min_max`).then(data => {
//   mapMin = data.min;
//   mapMax = data.max;
//   mapInterval = (mapMax - mapMin) / 5;
// });

function MapApiCall() {
  d3.json(`/map/${mapVariable}/${mapYear}`).then(mapApiData => { 
  mapMin = mapApiData['min_max']['min'];
  mapMax = mapApiData['min_max']['max'];
  mapInterval = (mapMax - mapMin) / 5;

  // Define streetmap and darkmap layers
  var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
  });

  function friendlyName(i) {
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

  function mapPopup (Geo_id) {
    var mapLabelVariable = `${Geo_id[mapVariable]}`;
    var mapPopLabel = `${friendlyName(mapVariable)}`;
    // console.log(mapLabelVariable);
    // console.log(mapPopLabel);
    return `<h5>${Geo_id['county']}</h5>
    <p>${mapPopLabel} : ${mapLabelVariable}</p>
    <p>Year : ${Geo_id['year']}`
  }

  function onEachFeature (feature, layer) {
    // console.log(feature.properties.GEO_ID);
    var mapFeatureID = `${feature.properties.GEO_ID}`;
    var mapFeaureVariable = `${mapVariable}`;
    if (mapApiData[mapFeatureID]) {
      // console.log(mapApiData[`${feature.properties.GEO_ID}`][`${mapVariable}`]);    
      layer.setStyle({
        fillColor : mapColor(mapApiData[mapFeatureID][mapFeaureVariable]),
        color : mapColor(mapApiData[mapFeatureID][mapFeaureVariable]),
        weight : 1,
        fillOpacity : 0.65
      });
      layer.bindPopup(mapPopup((mapApiData[mapFeatureID])))
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
  var myMap = L.map("map", {
    center: [
      44.967243, -103.771556
    ],
    zoom: 3,
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
  })
}

MapApiCall();