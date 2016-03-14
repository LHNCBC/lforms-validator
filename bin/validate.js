/*
A command line application to use lforms-validator to input files/directories/urls etc.
 */
var url = require('url');
var http = require('http');
var fs = require('fs');
var LFormsValidator = require('./../lib/lforms-validator');


/**
 * Program entry. Processes command line inputs and run validation.
 *
 * @returns {undefined}
 */
function processInput() {
  var inputfiles = [];
  var inputstream = null;
  if ((process.argv.indexOf('--help') >= 0) ||
      (process.argv.indexOf('-h') >= 0) ||
      (process.argv.length <= 2)) {
    usage();  
    return;
  }
    
  var validationOptions = {
    verbose: false,
    outStream: process.stdout,
    isInputString: false
  };

  var ind = process.argv.indexOf('-v');
  if (ind >= 0) {
    process.argv.splice(ind, 1);
    validationOptions.verbose = true;
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
    var u = url.parse(inputfiles[0]);
    if (u && (u.protocol === 'http:' || u.protocol === 'https:')) {
      validationOptions.source = inputfiles[0];
      validation.validate(inputfiles[0], validationOptions);
      var validation = new LFormsValidator(inputfiles[0], validationOptions);
      runValidation(validation);
      return;
    }
    else if (fs.statSync(inputfiles[0]).isDirectory() === true) {
      // list out all files in the directory
      var dir = inputfiles[0];
      inputfiles = fs.readdirSync(dir);
      inputfiles = inputfiles.map(function (e) {
        return dir + '/' + e;
      });
    }
    // Command line filelist or list from directory.
    inputfiles.forEach(function (f) {
      validationOptions.source = f;
      var validation = new LFormsValidator(fs.createReadStream(f), validationOptions);
      runValidation(validation);
    });
  }
  else {
    if(inputstream) {
      // From input stream
      var validation = new LFormsValidator(inputstream, validationOptions);
      runValidation(validation);
    }
    else {
      usage();
    }
  }
};


/**
 * Run validation on each object. Each invocation creates and sets up a domain to
 * facilitate simultaneous running of multiple validations.
 *
 * multiple validations
 *
 * @param {Object} validationObj - LFormsValidator object with its input and options set.
 */
function runValidation(validationObj) {
  var d = require('domain').create();
  d.on('error', function(err){
    if(validationObj.verbose) {
      console.log(err.stack);
    }
    console.log(err.message);
  });

  d.add(validationObj);
  validationObj.validate();
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


