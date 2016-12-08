var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var db = 'mongodb://localhost/msgtest';

mongoose.connect(db,function(){
   console.log('mongoose connected');
});



/* ********** VALIDATIONS ********** */
var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Name should contain alpha-numeric characters only'
  })
];
/* ********** /END VALIDATIONS ********** */

var ItemSchema = new mongoose.Schema({
 name: String,
 quote: String
}, { timestamps: true });



// var Schema = new mongoose.Schema({
//   name: {
//      type: String,
//      required: true,
//      validate: nameValidator
//   }
// }, { timestamps:true });



module.exports = mongoose.model('item',ItemSchema);
