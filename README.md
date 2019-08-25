# Mapping Earthquake Data

## Description
The United States Geological Survey provides [earthquake data](https://earthquake.usgs.gov/earthquakes/) through API endpoints.
The API endpoint can be modified using the [search tool](https://earthquake.usgs.gov/earthquakes/search/) to adjust the data returned.
For example, [https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2019-07-26%2000:00:00&endtime=2019-08-25%2023:59:59&maxlatitude=73.786&minlatitude=-62.005&maxlongitude=-18.281&minlongitude=-172.969&minmagnitude=4.5&orderby=time](https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2019-07-26%2000:00:00&endtime=2019-08-25%2023:59:59&maxlatitude=73.786&minlatitude=-62.005&maxlongitude=-18.281&minlongitude=-172.969&minmagnitude=4.5&orderby=time) returns all magnitude 4.5 and above events occuring in the 30 day period of July 26, 2019 to August 25, 2019 in a specific rectangular region.

## Methods
1.  D3 V4 is used to query the URL for the earthquake data and tectonic plate boundaries.  The results are returned as geoJSON objects.
2.  Leaflet is used to map the earthquakes and tectonic plate boundaries.
    -  Tile layers are supplied by ESRI.  If you are using a tile provider that requires an API key, such as mapbox, the code can be modified to 
supply the api key in one of three ways:
        *  Supply the API key in the `config.js` file and uncomment the line loading this file in `index.html`.
        *  Uncomment the line in `logic.js` that gives the API key.
        *  Uncomment the line in `logic.js` that prompts the user for an API key through a dialog.
    - Earthquakes are represented by circles with size proportional to the magnitude of the earthquake.   A color scale for the magnitude
    is also applied to the circle.  An informative pop-up is applied to each circle.  
    - Tectonic plates are represented as lines.
    - A legend is supplied for the color scale.
3.  A map control can toggle between tile layers.  
4.  An additional map control toggles the earthquake data and plate data on or off.  If the earthquake data is toggled off, the legend is removed from the map.


