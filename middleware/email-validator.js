const passwordValidator = require('password-validator');
 
// Create a schema
const schema = new passwordValidator();


// Add properties to it
schema
.has(['^[a-zA-Z0-9._-]+[@]{1}[a-zA-Z]+[.]{1}[a-zA-Z]{2,3}$'])


module.exports = schema;
