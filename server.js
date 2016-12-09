var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var port = 8000;
var db = 'mongodb://localhost/posttest3';

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


/* ********** VALIDATIONS ********** */
   var nameValidator = [
     validate({
       validator: 'isLength',
       arguments: [2, 50],
       message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
     }),
     validate({
       validator: 'isAlphanumeric',
       passIfEmpty: true,
       message: 'Name should contain alpha-numeric characters only'
     })
   ];

   var postValidator = [
     validate({
       validator: 'isLength',
       arguments: [4, 500],
       message: 'Post should be between {ARGS[0]} and {ARGS[1]} characters'
     })
   ];
/* ********** /END VALIDATIONS ********** */

/* ********** MODELS ********** */
  var Schema = mongoose.Schema;

   var PostSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true,
        validate: nameValidator
     },
     content: {
        type: String,
        required: true,
        validate: postValidator
     },
     comments: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Comment'
      }]
     }, { timestamps:true });

   var CommentSchema = new mongoose.Schema({
      _post: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Post'
      },
     name: {
        type: String,
        required: true,
        validate: nameValidator
     },
     content: {
        type: String,
        required: true,
        validate: postValidator
     }
  }, {timestamps:true });

mongoose.model('Post', PostSchema);
mongoose.model('Comment', CommentSchema);
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
/* ********** /END MODELS ********** */

// ROUTES --------------------------------------

// GET "/"
// Root - show all
app.get('/', function (req, res){
   console.log('Show all items.');
    Post.find({})
     .populate('comments')
     .exec(function(err, data) {
        console.log('it executed',data);
          res.render('index', {posts: data, moment:moment});
            });
});

/* POST "/"
   Create a new POST based on form submission.
*/
app.post('/', function (req, res){
   console.log('Create POST: action. Post: ',req.body.content);
   var post = new Post({
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
/* POST "/posts/:id/comments"
   Create a new COMMENT based on form submission.
*/
app.post('/posts/:id/comments', function (req, res){
   console.log('Create COMMENT ',req.body);
   Post.findOne({_id: req.params.id}, function(err, post){
     var comment = new Comment({
        _post: req.params.id,
        name: req.body.name,
        content: req.body.content
     });

     comment.save(function(err){
        if(err){
           console.log('error',err);
           res.render('index', {title: 'you have errors!', errors: err})
        }else{
           post.comments.push(comment);
           post.save(function(err){
             if(err){
                res.render('index', {title: 'you have errors!', errors: post.errors})
             }else{
                res.redirect('/');
             }
          })
        }
      });
   })
})

// Extra route for development
app.get('/:id', function (req, res){
   console.log('Show a post by ID.');
    Post.findOne({_id: req.params.id})
     .populate('comments')
     .exec(function(err, post) {
          res.render('index', {posts: {post}, moment:moment});
            });
});
// Extra route for development
app.get('/posts/:id', function (req, res){
   console.log('Show a post by ID');
    Post.findOne({_id: req.params.id})
     .populate('comments')
     .exec(function(err, post) {
          res.render('index', {posts: {post}});
            });
});

// BEGIN listening for requests -----------------
var server = app.listen(port,function(){
   console.log('Listening on port %d',port);
});
