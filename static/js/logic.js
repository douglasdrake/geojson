// Douglas Drake 


/* If using other tile providers, uncomment this section to either
supply your API_KEY within the script or via a menu.  A third option is to supply an API_KEY
in a config.js file that is loaded as a script in our index.html file.

var API_KEY = "YOUR API KEY HERE";

API_KEY = window.prompt("Enter your mapbox API Key", "");
*/

// Store our API endpoint inside QueryUrls
var earthquakeQueryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// The following geoJSON gives layers of plate boundaries, geometry "LineString"
var plateQueryUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// The following geoJSON also produces a similar map
// It gives layers of type Plate, geometry "Polygon" - this would allow for selecting/mouseover on plates 
// var plateQueryURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// RedYellowGreen color scale generated on ColorBrewer
// http://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=
// ['#d73027','#fc8d59','#fee08b','#d9ef8b','#91cf60','#1a9850']
function getColor(d) {

  let color = '';
  if (d < 1) {
    color = '#1a9850';
  } else if (d < 2) {
    color = '#91cf60';
  } else if (d < 3) {
    color = '#d9ef8b';
  } else if (d < 4) {
    color = '#fee08b';
  } else if (d < 5) {
    color = '#fc8d59';
  } else { // magnitude 5+
    color = '#d73027';
  }
  return color
}

function getRadius(d) {
  // remember the radius in L.circle is in the unit of meters
  return 15000 * d;
  // The radius in L.circleMarker is in pixels - 
  // return 3*d;
}


// Perform a GET request to the query URL
d3.json(earthquakeQueryUrl, function (earthquakeData) {
  // Once we get a response, 
  // perform a second json query to get the plates 
  d3.json(plateQueryUrl, function (plateData) {
    // send the data.features object to the createFeatures function
    console.log(plateData);
    createFeatures(earthquakeData.features, plateData.features);
  });
});

function createFeatures(earthquakeData, plateData) {

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the pointToLayer function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {

      // magnitude determines the color
      var color = getColor(feature.properties.mag);

      // Add circles to map
      return L.circle(latlng, {
        weight: 1,
        opacity: 0.75,
        fillOpacity: 0.75,
        color: color,
        fillColor: color,
        // Adjust radius
        radius: getRadius(feature.properties.mag)
      }).bindPopup("<h4> Magnitude: " + feature.properties.mag + "<br>Location:  " + feature.properties.place +
        "</h4><hr><p>" + new Date(feature.properties.time) + "</p>");
    } // end pointToLayer

  });

  var plates = L.geoJSON(plateData, {
    style: function (feature) {
      return {
        color: "orange",
        weight: 1
      };
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes, plates);
}

function createMap(earthquakes, plates) {

  var outdoorsMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
    maxZoom: 18
  });

  var satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  });

  var grayscaleMap =  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 18
  });

  // Define streetmap and darkmap layers
  /* Using mapbox:  calls for tile layers requiring API_KEYs
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
  */

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satelliteMap,
    "Gray Scale": grayscaleMap,
    "Outdoors": outdoorsMap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    'Earthquakes': earthquakes,
    'Plate boundaries': plates
  };

  // Create our map, giving it the satellite and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [satelliteMap, earthquakes, plates]
  });

  var legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    var magnitudes = [0, 1, 2, 3, 4, 5];
    var labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];

    // loop through our magnitude intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(magnitudes[i]) + '"></i> ' + labels[i] + '<br>';
    }
    return div;
  }; // end legend.onAdd

  legend.addTo(myMap);

  // The following
  // https://gis.stackexchange.com/questions/68941/how-to-add-remove-legend-with-leaflet-layers-control
  // Add an event listener that adds/removes the legends if the earthquakes layer is added/removed.

  myMap.on('overlayremove', function (eventLayer) {
    if (eventLayer.name === 'Earthquakes') {
      this.removeControl(legend);
    }
  });

  myMap.on('overlayadd', function (eventLayer) {
    // Turn on the legend...
    if (eventLayer.name === 'Earthquakes') {
      legend.addTo(this);
    }
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}