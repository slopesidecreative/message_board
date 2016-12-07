var mongoose = require('mongoose');
var validate = require('mongoose-validator');




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




var Schema = new mongoose.Schema({
  name: {type: String, required: true, validate: nameValidator}
});
