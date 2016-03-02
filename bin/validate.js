/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var url = require('url');
var http = require('http');
var fs = require('fs');
var LFormsValidator = require('./../lib/lforms-validator');
var jsonpath = require('JSONPath');


/*
 * 
 * @returns {undefined}
 */
function processInput() {
  var jpath = null;
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

  var ind = process.argv.indexOf('-p');
  if (ind >= 0) {
    jpath = process.argv.splice(ind, 2)[1];
  }

  while (process.argv.length >= 3 && process.argv[2] !== '-') {
    inputfiles.push(process.argv[2]);
    process.argv.splice(2, 1);
  }
  
  if(inputfiles.length === 0) {
    process.stdin.setEncoding('utf-8');
    inputstream = process.stdin;
  }

  if(jpath !== null) {
    // Extract jason path elements, create a readable stream
    // out of them and pass it to validation.
    var json =  readJson(input);
    var res = jsonpath.eval(json, jpath);
    var s = new require('stream').Readable();
    s._read = function() {};
    s.push(JSON.stringify(res));
    s.push(null);
    s.resume();
    inputstream = s;
  }
  
  // Input can be a http(s) url, or input stream
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

/*
 * 
 */
function readJson(input) {
  return JSON.parse(getContent(input));
}

/*
 * 
 */
function getContent(input) {
  var content = null;
  
  if(!(typeof(input) === 'string')) {
    content = fs.readFileSync(input.fd);
  }
  else { 
    var u = url.parse(input);
    if (u !== null) {
      if (u.protocol === null ||
              u.protocol === 'file') {
        content = fs.readFileSync(u.pathname, {encoding: 'utf-8'});
      }
      else {
        http.get(input, function(res) {
          if (res.statusCode === 200) {
            res.on('data', function(chunk) {
              content =+ chunk;
            });
          }
        }).on('error', function(error) {
            throw new Error(error.toString());
        });
      }
    }
  }
  return content;
}

function usage() {
  console.log('Usage: ' + process.argv[0] + ' ' + process.argv[1] + ' <input file/url>');
}
/*
 * Main entry point
 */
processInput();


