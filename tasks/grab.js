// https://gdata.youtube.com/feeds/api/videos?q=movie%20official%20trailer&v=2&alt=jsonc&max-results=50&start-index=100


var http = require('http'), db = require('./../db');

// http://gdata.youtube.com/feeds/api/videos?author=sonypictures&v=2&alt=json

function grabYT(query,from,callback) {
  if (!from) { from = ""; } else { from = "&start-index="+from; }

  http.get("http://gdata.youtube.com/feeds/api/videos?q="+query.replace(' ','%20')+"&v=2&alt=jsonc&category=Trailers&max-results=50"+from, function(res) {
    var buf = ""
    res.on('data', function (chunk) {
      buf += chunk;
    });
    res.on('end', function() {
      callback(buf);
      buf = "";
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

}


function grabAndSaveToDb(from) {

  grabYT('movie official trailer',from,function(data) {
    var result = JSON.parse(data);

    console.log(result.data,{
      startIndex: result.data.startIndex
    });

    result.data.items.forEach(function(ytMovie) {
      //console.log(ytMovie);
      db.Movie.findOne({ "yt.id": ytMovie.id },{}, function(err,row) {
        if (!row) {
          console.log("adding trailer: "+ytMovie.title);
          var movie = new db.Movie({ yt: ytMovie });
          movie.save(function(error) {
            if (error) {
              console.log('error adding movie');
            }
          });
        }
      });
    });

    grabAndSaveToDb(result.data.startIndex+50);

  });

}

grabAndSaveToDb(1000);



