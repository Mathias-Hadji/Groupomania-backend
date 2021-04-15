const passwordValidator = require('password-validator');
 
// Create a schema
const schema = new passwordValidator();


// Add properties to it
schema
.has(['^[a-zA-Z éèêëàâîïôöûü-]+$'])


module.exports = schema;
