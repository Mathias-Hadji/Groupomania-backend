const passwordValidator = require('password-validator');
 
// Create a schema
const schema = new passwordValidator();


// Add properties to it
schema
.is().max(255)


module.exports = schema;
