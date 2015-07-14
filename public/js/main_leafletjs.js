$(function() {


  // now generate some random data
  var points = [];
  var max = 0;
  var width = 200;
  var height = 200;
  var len = 2;

  while (len--) {
    var val = Math.floor(Math.random()*100);
    // now also with custom radius
    var radius = Math.floor(Math.random()*70);

    max = Math.max(max, val);
    var point = {
      lat: ((Math.floor(Math.random()*height))/(height/180)-90)/-1,
      lng: Math.floor(Math.random()*width)/(width/360)-180,
      value: Math.random(100)
    };

    points.push(point);
    
  }

  console.debug(points);
  // heatmap data format
  var testData = { 
    max: max, 
    data: points 
  };

        var baseLayer = L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
            maxZoom: 18
          }
        );

        var cfg = {
          // radius should be small ONLY if scaleRadius is true (or small radius is intended)
          "radius": 4,
          "maxOpacity": .8, 
          // scales the radius based on map zoom
          "scaleRadius": true, 
          // if set to false the heatmap uses the global maximum for colorization
          // if activated: uses the data maximum within the current map boundaries 
          //   (there will always be a red spot with useLocalExtremas true)
          "useLocalExtrema": true,
          // which field name in your data represents the latitude - default "lat"
          latField: 'lat',
          // which field name in your data represents the longitude - default "lng"
          lngField: 'lng',
          // which field name in your data represents the data value - default "value"
          valueField: 'count'
        };


        var heatmapLayer = new HeatmapOverlay(cfg);

        var map = new L.Map('map-container', {
          center: new L.LatLng(25.6586, -80.3568),
          zoom: 4,
          layers: [baseLayer, heatmapLayer]
        });

        heatmapLayer.setData(testData);
})

