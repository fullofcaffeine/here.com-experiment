var pg = require('pg');
var fs = require('fs');

//var conString = "postgres://realinsights:realinsights@localhost/realinsights_development";
var conString = "postgres://realinsights:realinsights@localhost/ri_scraper_development";

pg.connect(conString, function(err, client, done) {
  if (err) {
    return console.error('error fetching client from pool', err);
  }

  function exportToJson(filename, callback, city) {
    var ws = fs.createWriteStream(filename);
    var collection = [];
    var count = 0;
    var total;
    var query;

    if (city) {
      query = client.query('SELECT DISTINCT lat,lon,city,local_price FROM listings WHERE city = $1', [city]);
    } else {
      query = client.query("SELECT DISTINCT lat,lon,city,local_price FROM listings");
    }

    query.on('row', function(row) {
      listing = callback(row);
      count++;
      console.log('New row ' + count + ' fetched...');
      collection.push(listing);
    });

    query.on('end', function(result) {
      console.log('saving ' + filename + '...');
      ws.write(JSON.stringify(collection));
      ws.close();
    });
  }

  //All listings, for use with a value-based heatmap
  exportToJson('world_value.json', function(row) {
    var listing = {
      "lat": parseFloat(row.lat),
      "lng": parseFloat(row.lon),
      "city": row.city,
      "value": row.local_price || 10 //avoids a NaN error for leaflet
    };
    return listing;
  });

  //All listings, for use with a point density-based heatmap
  exportToJson('world_density.json', function(row) {
    var listing = {
      "lat": parseFloat(row.lat),
      "lng": parseFloat(row.lon),
      "city": row.city
    };
    return listing;
  });

  //All listings from Medellin, for use with a value-based heatmap
  exportToJson('medellin_value.json', function(row) {
    var listing = {
      "lat": parseFloat(row.lat),
      "lng": parseFloat(row.lon),
      "city": row.city,
      "value": row.local_price || 10 //avoids a NaN error for leaflet
    };
    return listing;
  }, 'Medellin');

  //All listings from Medellin, for use with a density-based heatmap
  exportToJson('medellin_density.json', function(row) {
    var listing = {
      "lat": parseFloat(row.lat),
      "lng": parseFloat(row.lon),
      "city": row.city,
    };
    return listing;
  }, 'Medellin');
});
