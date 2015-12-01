var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var isEmptyObject = require('is-empty-object');

var app = express();

var COMMENTS_FILE = path.join(__dirname, "comments.json");
app.set("port", (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/api/comments", function(req, res){
  fs.readFile(COMMENTS_FILE, function(err, data){
    if(err) {
      console.error(err);
      process.exit(1);
    }

    //test
    // http://stackoverflow.com/questions/10058814/get-data-from-fs-readfile
    // It returns the raw buffer.
    //console.log(data);

    res.setHeader("Cache-Control", "no-cache");
    res.json(JSON.parse(data));
  }); 
});

// This exposes the json data
app.post("/api/comments", function(req, res){
  fs.readFile(COMMENTS_FILE, function(err, data){
    if(err) {
      console.log(err);
      process.exit(1);
    }

    var comments = JSON.parse(data);
    //console.log(comments);

    //http://stackoverflow.com/questions/4994201/is-object-empty
    var the_author = "default_author";
    var the_text = "default_text";
    var my_author = req.body.author;
    var my_text = req.body.text;

    if(my_author !== undefined) {
     the_author = my_author; 
    }

    if(my_text !== undefined) {
     the_text = my_text;
    }
    
    var newComment = {
      id: Date.now(),
      author: the_author,
      text: the_text,  
    }

    comments.push(newComment);

    // JSON.stringify(comments, null, 4)
    // comments store as JSON object string, so string, 4 spaces.
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err){
      if(err) {
        console.log(err);
        process.exit(1);
      }

      res.setHeader('Cache-Control', 'no-cache');
      res.json(comments);
    });

  });

});

app.listen(app.get('port'), function(){
  console.log('running');
});
