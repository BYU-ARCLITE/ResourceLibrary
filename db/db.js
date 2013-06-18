
/*
 * Specify which DB we are going to use
 */
var activeDatabase = "couchdb";

module.exports = require("./" + activeDatabase);