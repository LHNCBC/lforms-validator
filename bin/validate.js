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


/**
 * Program entry. Processes command line inputs and run validation.
 *
 * @returns {undefined}
 */
function processInput() {
  "use strict";
  var schemaPromise = null;
  var inputfiles = [];
  var inputstream = null;
  if ((process.argv.indexOf('--help') >= 0) ||
      (process.argv.indexOf('-h') >= 0) ||
      (process.argv.length <= 2)) {
    usage();  
    return;
  }
    
  var ind = process.argv.indexOf('-v');
  if (ind >= 0) {
    process.argv.splice(ind, 1);
    verbose = true;
  }

  var ind = process.argv.indexOf('-s');
  if(ind < 0) {
    ind = process.argv.indexOf('--schema');
  }
  if (ind >= 0) {
    process.argv.splice(ind, 1);
    schema = getJsonObjectSync(process.argv[ind]);
    validator.addSchema(schema.id, schema);
    validator.getMissingUris().forEach((uri) => {
      var missedSchema = getJsonObjectSync(uri);
      validator.addSchema(uri, missedSchema); // uri should be equal to schema.id
    });
    process.argv.splice(ind, 1);
  }

  while (process.argv.length >= 3 && process.argv[2] !== '-') {
    inputfiles.push(process.argv[2]);
    process.argv.splice(2, 1);
  }
  
  if(inputfiles.length === 0) {
    usage();
  }

  var promise = null;
  for (let file of inputfiles) {
    if(promise == null) {
      promise = runValidation(file).fail(logError);
    }
    else {
      promise = promise.then(() => {
        return runValidation(file).fail(logError);
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
    var differed = Q.defer();
    var ret = validator.validateResult(json, schema);
    if(ret.valid) {
      console.log(dataSource+': valid');
      differed.resolve(ret);
    }
    else {
      ret.error.message = dataSource+": "+ret.error.message;
      differed.reject(ret.error);
    }
    return differed.promise;
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
  if(verbose) {
    console.log(err.stack);
  }

  console.log(err.message+'; code: '+err.code+'; dataPath: '+err.dataPath+'; schemaPath: '+err.schemaPath);
}
/**
 * Usage clause
 */
function usage() {
  console.log('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' [options...] <input file/url>');
  console.log('Options:');
  console.log('  -h/--help\tThis help message');
  console.log('  -v\t\tVerbose output');
  console.log('');
  console.log('\<input file/url\>\tSpecify location of lforms json resource. The valid inputs are');
  console.log('                \tan http(s) url, file path, or directory path');
  console.log('                \tYou may also use \'-\' to read from standard input.');
}


/**
 * Main entry point
 */
processInput();


