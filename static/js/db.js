



module.exports = function(mongoose) {

   var validate = require('mongoose-validator');
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
    // declare seat covers here too
    var models = {
      Item: mongoose.model('item', ItemSchema)
    };
    return models;

}
