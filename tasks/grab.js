// https://gdata.youtube.com/feeds/api/videos?q=movie%20official%20trailer&v=2&alt=jsonc&max-results=50&start-index=100


var http = require('http'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    dbSchema = require('./../db');


mongoURI = 'mongodb://nodejitsu_nko3-dumplings:ohkkhs8l2imtcf4paphpnrmv7o@ds039257.mongolab.com:39257/nodejitsu_nko3-dumplings_nodejitsudb3493680560';

var db = mongoose.createConnection(mongoURI);

var GameDB    = db.model('games',   dbSchema.gameSchema);
var PlayerDB  = db.model('players', dbSchema.playerSchema);
var MovieDB   = db.model('movies',  dbSchema.movieSchema);


// http://gdata.youtube.com/feeds/api/videos?author=sonypictures&v=2&alt=json

function grabYT(query,from,callback) {
  if (!from) { from = ""; } else { from = "&start-index="+from; }

  http.get("http://gdata.youtube.com/feeds/api/videos?q="+query.replace(' ','%20')+"&v=2&alt=jsonc&category=Trailers&max-results=50&hl=EN"+from, function(res) {
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

bannedUploaders = ["sonypictureshomegsa","sonypicshomeentjapan","sonypicturesfr","sonypictureslatam","sonypicturesit",
"sonypicturesbrasil","paramountmoviesko"];


bannedText = ["- Official Theatrical Trailer","- Trailer","(16x9)","- Offical Trailer","Official","(HD)",
  "Official Teaser Trailer",/\(d+\)/,
  "Official Greenband Trailer",
  " HD ","Teaser Trailer","Trailer  - In Theaters July 23","Teaser Trailer",
  "- Official Trailer (HD)","Trailer  In Theaters 1-22-10","(1970)","(2000)","(2003)","(2004)","(1966)","(2006)","(2010)","(2005)","(1995)",
  "TV Spot","Trailer HD","(New )", "- ","- In Theaters 4-9-2010!","(New )",
  "Greenband","Trailer","  ", "  ","#2","# 2","# 1","#1","# 3"
]


console.log(bannedText);


numbers = 0;

function grabAndSaveToDb(query,from,to) {

  grabYT(query,from,function(data) {
    var result = JSON.parse(data);

    console.log({
      startIndex: result.data.startIndex
    });

    result.data.items.forEach(function(ytMovie) {


      if (_.indexOf(bannedUploaders,ytMovie.uploader) > -1) {
        console.log(ytMovie.uploader);
      } else {

        //console.log(ytMovie);
        MovieDB.findOne({ "yt.id": ytMovie.id },{}, function(err,row) {
          if (!row) {

            var name = ytMovie.title;

            bannedText.forEach(function(text) {
              name = name.replace(text,'').trim();
            });


            numbers += 1;
            console.log("adding trailer: ",numbers,'"',name,'"',ytMovie.uploader);
            var movie = new MovieDB({ name: name, yt: ytMovie });
            
            movie.save(function(error) {
              if (error) {
                console.log('error adding movie');
              }
            });
          }
        });

      }

    });
    
    if ( (from+50) < to ) {
      grabAndSaveToDb(query,result.data.startIndex+50,to);
    }

  });

}


// SONY U SUCK!
//grabAndSaveToDb('sonypictures',0,100);

MovieDB.remove({}).exec();

grabAndSaveToDb('paramountmovies',0,300);
grabAndSaveToDb('FoxMovies',0,50);
grabAndSaveToDb('WarnerBrosPictures',0,50);



