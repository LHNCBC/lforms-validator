/*
A command line application to use lforms-validator to input files/directories/urls etc.
 */
var url = require('url');
var http = require('http');
var fs = require('fs');
var Q = require('q');
var readFile = Q.denodeify(fs.readFile);

var validator = require('tv4');
validator.addSchema('validator');
var formSchema = null;
var itemSchema = null;
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
    schemaPromise = getJsonObject(process.argv[ind]).then((json) => {
      formSchema = json;
      validator.addSchema(formSchema.id, formSchema);
      validator.getMissingUris().forEach((uri) => {
        getJsonObject(uri).then((schema) => {
          validator.addSchema(uri, schema); // uri should be equal to schema.id
        });
      });
    });
    process.argv.splice(ind, 1);
  }

  while (process.argv.length >= 3 && process.argv[2] !== '-') {
    inputfiles.push(process.argv[2]);
    process.argv.splice(2, 1);
  }
  
  if(inputfiles.length === 0) {
    process.stdin.setEncoding('utf-8');
    inputstream = process.stdin;
  }

  // Input can be a http(s) url, file(s), directory or input stream
  if (inputfiles && inputfiles.length > 0) {
    // Handle url
    var u = url.parse(inputfiles[0]);
    if (u && (u.protocol === 'http:' || u.protocol === 'https:')) {
      runValidation(inputfiles[0]).fail(logError).done();
    }
    else {
      // Handle files or directory
      if (fs.statSync(inputfiles[0]).isDirectory() === true) {
        // list out all files in the directory
        var dir = inputfiles[0];
        inputfiles = fs.readdirSync(dir);
        inputfiles = inputfiles.map(function (e) {
          return dir + '/' + e;
        });
      }
      // Command line filelist or list from directory.
      var p = runValidation(inputfiles[0]).fail(logError);
      
      for (let i = 1; i < inputfiles.length; i++) {
        p = p.then(() => {
          return runValidation(inputfiles[i]).fail(logError);
        });
      }
      p.done();
    }
  }
  else {
    if(inputstream) {
      // From input stream
      runValidation(inputfiles[i]).fail(logError).done();
    }
    else {
      usage();
    }
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


function getJsonObject(filename) {
  return readFile(filename, 'utf8').then((content) => {
    return JSON.parse(content);
  });
}

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


