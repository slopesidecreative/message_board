var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
var port = 8000;

// for parsing the POST body
app.use(bodyParser.urlencoded({extended: true}));
// set the static directory
app.use(express.static(__dirname + '/static'));
// set the views directory
app.set('views', __dirname + '/views');
// set EJS as the templating engine
app.set('view engine','ejs');

// MODELS ---------------------------------------
// our connection to the User model via Mongoose
var Item = require('./static/js/db.js');

// ROUTES --------------------------------------

// "/"
// Root - show all
app.get('/', function (req, res){
   console.log('Show all items.');
   Item.find({}, function(err, data) {
      if(err){
         console.log('error: ',err);
         res.redirect('/404',{errors:err});
      }else{
         res.render('index',{items:data, moment: moment});
      }
   })
});




/* POST
   /items
   Create a new item based on form submission.
*/
app.post('/items', function (req, res){
   console.log('Create item: action. Quote: ',req.body.quote);
   var item = new Item({
      name: req.body.name,
      quote: req.body.quote
   });
   item.save(function(err){
      if(err){
         console.log('error',err);
         res.redirect('/404',{errors:err});
      }
      res.redirect('/items');
   })

});
/*
   GET /items
   Show all items.
*/
app.get('/items', function (req, res){
   console.log('Show all items.');
   Item.find({}, function(err, data) {
      if(err){
         console.log('error: ',err);
         res.redirect('/404',{errors:err});
      }else{
         res.render('index',{items:data, moment: moment});
      }
   })
});

// "/404"
// Error
app.get('/404', function (err){
   console.log('ERROR ',err);
   res.render('404',{errors:err});
});

// BEGIN listening for requests -----------------
var server = app.listen(port,function(){
   console.log('Listening on port %d',port);
});
