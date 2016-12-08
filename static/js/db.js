var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var db = 'mongodb://localhost/quotes';

mongoose.connect(db,function(){
   console.log('mongoose connected');
});



/* ********** VALIDATIONS ********** */
var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [4, 50],
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

var ItemSchema = new mongoose.Schema({
  name: {
     type: String,
     required: true,
     validate: nameValidator
  },
  quote: {
     type: String,
     required: true,
     validate: postValidator
  }
}, { timestamps:true });



module.exports = mongoose.model('item',ItemSchema);
