const passwordValidator = require('password-validator');
 
// Create a schema
const schema = new passwordValidator();
 
// Add properties to it
schema
.has(["^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"])
module.exports = schema;
