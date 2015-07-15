var pg = require('pg');
var fs = require('fs');
var conString = "postgres://realinsights:realinsights@localhost/realinsights_development";
var ws = fs.createWriteStream('listings.json');
var collection = [];
var count = 0;

pg.connect(conString, function(err, client, done) {
  if (err) {
    return console.error('error fetching client from pool', err);
  }
  var total = 0;

  var query = client.query("SELECT DISTINCT lat,lon,city,local_price FROM listings");
  query.on('row', function(row) {
    var listing = {
      "lat": parseFloat(row.lat),
      "lng": parseFloat(row.lon),
      "city": row.city,
      "value": row.local_price || 100 //avoids a NaN error for leaflet
    };

    count++;
    console.log('New row ' + count + ' fetched...');
    collection.push(listing);
  });

  query.on('end', function(result) {
    console.log('saving...');
    ws.write(JSON.stringify(collection));
    ws.close();
    process.exit();
  });
});
