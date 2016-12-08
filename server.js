var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
var mongoose = require('mongoose');
var port = 8000;
var db = 'mongodb://localhost/posttest';

// SET UP ---------------------------------------
// for parsing the POST body
app.use(bodyParser.urlencoded({extended: true}));
// set the static directory
app.use(express.static(__dirname + '/static'));
// set the views directory
app.set('views', __dirname + '/views');
// set EJS as the templating engine
app.set('view engine','ejs');

// DATABASE & MODELS ---------------------------
mongoose.connect(db, function(){
   console.log('mongoose connected');
});
// models are pull from another file
var models = require('./static/js/db')(mongoose);


// ROUTES --------------------------------------

// GET "/"
// Root - show all
app.get('/:id', function (req, res){
   console.log('Show all items.');

    models.Post.findOne({_id: req.params.id})
     .populate('comment')
     .exec(function(err, post) {
        console.log('it executed',post);
          res.render('index', {posts: {post}, moment:moment});
            });


   //  models.Post.find({}, function(err, data) {
   //    if(err){
   //       console.log('error: ',err);
   //       res.render('index', {title: 'you have errors!', errors: err})
   //    }else{
   //       res.render('index',{posts:data, moment: moment});
   //    }
   // })

});

app.get('/posts/:id', function (req, res){
   // console.log('Show all items.');

    models.Post.findOne({_id: req.params.id})
     .populate('comments')
     .exec(function(err, post) {
        console.log('it executed');
          res.render('index', {posts: {post}});
            });


   //  models.Post.findOne({_id: req.params.id}, function(err, data) {
   //    if(err){
   //       console.log('error: ',err);
   //       res.render('index', {title: 'you have errors!', errors: err})
   //    }else{
   //       res.render('index',{posts:{data}, moment: moment});
   //    }
   // })

});

/* POST
   "/"
   Create a new item based on form submission.
*/
app.post('/', function (req, res){
   console.log('Create post: action. Post: ',req.body.content);
   var post = new models.Post({
      name: req.body.name,
      content: req.body.content
   });
   post.save(function(err){
      if(err){
         console.log('error',err);
         res.render('index', {title: 'you have errors!', errors: post.errors})
      }else{
         res.redirect('/');
      }
   })
});

// BEGIN listening for requests -----------------
var server = app.listen(port,function(){
   console.log('Listening on port %d',port);
});
