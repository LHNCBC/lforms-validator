/*
A command line application to use lforms-validator to input files/directories/urls etc.
 */
var url = require('url');
var http = require('http');
var https = require('https');
var fs = require('fs');
var Q = require('q');
var readFile = Q.denodeify(fs.readFile);
var httpGet = Q.denodeify(http.get);
var httpsGet = Q.denodeify(https.get);

var validator = require('tv4');
var schema = null;
var verbose = false;
var argv = null;

/**
 * Program entry. Processes command line inputs and run validation.
 *
 * @returns {undefined}
 */
function processInput() {
  "use strict";
  argv = require('minimist')(process.argv.slice(2));
  if (argv.h || argv.help || argv._.length < 2) {
    usage();  
    return;
  }

  schema = getJsonObjectSync(argv._[0]);
  validator.addSchema(schema.id, schema);
  validator.getMissingUris().forEach((uri) => {
    var missedSchema = getJsonObjectSync(uri);
    validator.addSchema(uri, missedSchema); // uri should be equal to schema.id
  });

  var promise = null;
  for (var i = 1; i < argv._.length; i++) {
    if(promise == null) {
      promise = runValidation(argv._[i]).fail(logError);
    }
    else {
      promise = promise.then(() => {
        return runValidation(argv._[i]).fail(logError);
      });
    }
  }

  if(promise) {
    promise.done();
  }
}


/**
 * Run validation on each object. Each invocation creates and sets up a domain to
 * facilitate simultaneous running of multiple validations.
 *
 * @param {String|Object} dataSource - If string type it is data source url, otherwise input stream object.
 */
function runValidation(dataSource) {
  return getJsonObject(dataSource).then((json) => {
    "use strict";
    var deffered = Q.defer();
    var ret = validator.validateResult(json, schema);
    if(ret.valid) {
      console.log(dataSource+': valid');
      deffered.resolve(ret);
    }
    else {
      ret.error.message = dataSource+": "+ret.error.message;
      deffered.reject(ret.error);
    }
    return deffered.promise;
  });
}

/**  Asynchronous retrieval of json object from a json file 
 * @param filename - json file name
 * 
 * @return {Object} - Promise to retrieve json object.
*/
function getJsonObject(filename) {
  var isUrl = url.parse(filename);
  if(isUrl.protocol === 'http' || isUrl.protocol === 'https') {
    return getHttpContent(filename).then((content) => {
      "use strict";
      return JSON.parse(content);
    });
  }
  else {
    return readFile(filename, 'utf8').then((content) => {
      return JSON.parse(content);
    });
  }
}


/**
 * Synchronous retrieval of json object from a json file.
 * @param filename
 */
function getJsonObjectSync(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
}


/**
 * a utility to get content from a url source with GET method.
 * @param {string} aUrl - http(s) url  
 * @returns {Object} - A promise to resolve on successful content retrieval.
 */
function getHttpContent(aUrl) {
  var deferred = Q.defer();
  var isUrl = url.parse(aUrl);
  var conn = null;
  if(isUrl.protocol === 'https') {
    conn = httpsGet;
  }
  else if(isUrl.protocol === 'http') {
    var conn = httpGet;
  }
  else {
    deferred.reject(new Error("Invalid input source"));
  }

  conn(aUrl).then((resp) => {
    "use strict";
    if(resp.statusCode !== 200) {
      deferred.reject(new Error(aUrl+' returned http response code = '+ resp.statusCode));
    }

    var data = null;
    resp.on('data', (chunk) => {
      data =+ chunk;
    });

    resp.on('end', () => {
      deferred.resolve(data);
    });

    resp.on('error', (e) => {
      deferred.reject(e);
    });
  });
  return deferred.promise;
}

/**
 * Log error to console
 * @param {Object} err - Error object. 
 */
function logError(err) {
  if(argv.v) {
    console.log(err.stack);
  }

  console.log(err.message+'; code: '+err.code+'; dataPath: '+err.dataPath+'; schemaPath: '+err.schemaPath);
}
/**
 * Usage clause
 */
function usage() {
  console.log('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' [options...] <schema file/url> <input file/url>');
  console.log('Options:');
  console.log('  -h/--help\tThis help message');
  console.log('  -v\t\tVerbose output');
  console.log('');
  console.log('\<schema file/url\>\tSpecify location of schema file/url to validate the json.');
  console.log('\<input file/url\>\tSpecify location of lforms json resource. The valid inputs are');
  console.log('                \tan http(s) url, file path, or directory path');
}


/**
 * Main entry point
 */
processInput();


