# Mapping Earthquake Data

## Description
The 

## Methods
1.  D3 V4 is used to query the URL for the earthquake data and tectonic plate boundaries.  The results are returned as geoJSON objects.
2.  Leaflet is used to map the earthquakes and tectonic plate boundaries.
    -  Tile layers are supplied by ESRI.  If you are using a tile provider that requires an API key, such as mapbox, the code can be modified to 
supply the api key in one of three ways:
        a.  Supply the API key in the `config.js` file and uncomment the line loading this file in `index.html`.
        b.  Uncomment the line in `logic.js` that gives the API key.
        c.  Uncomment the line in `logic.js` that prompts the user for an API key through a dialog.
    - Earthquakes are represented by circles with size proportional to the magnitude of the earthquake and color also 
    - Tectonic plates are represented as lines.
    - A legend is supplied.
3.  A map control can toggle between tile layers.  
4.  An additional map control toggles the earthquake data and plate data on or off.  If the earthquake data is toggled off, the legend is removed from the map.



