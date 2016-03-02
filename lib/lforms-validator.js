
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var types = require('./widget-data-types');
var oboe = require('oboe');
var lodash = require('lodash');
var Ducktype = require('ducktype');
var events = require('events');
var valueList = require('./type-lists');

var counter = 0;


/**
 * Constructor definition with input stream and options. Createa stream from the
 *
 * @param {Object|String} input - A readable input stream object or a url string.
 * @param {Object} options - Validator options
 * @constructor
 */
function LFormsValidator(input, options) {
  events.EventEmitter.call(this);
  this.id = ++counter;
  this.input = input;
  this.source = '';
  this.isInputString = false;
  this.verbose = false;
  this.outputStream = process.stdout;
  
  if(options) {
    this.source = options.source || '';
    this.isInputString = options.isInputString || false;
    this.verbose = options.verbose || false;
    this.outputStream = options.outputStream || process.stdout;
  }
}

// Make this event emitter
require('util').inherits(LFormsValidator, events.EventEmitter);

// Add class methods.
lodash.extend(LFormsValidator.prototype,  {

  /**
   * Initiate parsing the input. Uses oboe parser
   *
   */
  validate: function () {
    var id = this.id;
    var readStream = this.input;
    if (this.isInputString) {
      // Input is a json string. Create a readable stream.
      var s = new require('stream').Readable();
      s._read = function () {
      };
      s.push(this.input);
      s.push(null);

      readStream = s;
    }
    this.invalid = false;
    var outputStream = this.outputStream;
    var source = this.source;
    var verbose = this.verbose;
    var isInputString = this.isInputString;
    var self = this;
    var parser = oboe(readStream)
      .node({
        'obxTableColumns.*': self.validateObxTableColumns.bind(self),
        'templateOptions': self.validateTemplateOptions.bind(self),
        'answerCardinality': self.validateCardinality.bind(self),
        'answers.*': self.validateAnswer.bind(self),
        'dataType': self.validateDataType.bind(self),
        'defaultAnswer': self.validateAnswer.bind(self),
        'editable': self.validateEditable.bind(self),
        'formatting': self.validateFormatting.bind(self),
        'formula': self.validateFormula.bind(self),
        'items.*': self.validateItem.bind(self),
        'questionCardinality': self.validateCardinality.bind(self),
        'skipLogic': self.validateSkipLogic.bind(self),
        'restrictions.*': self.validateRestriction.bind(self),
        'trigger': self.validateTrigger.bind(self),
        'trigger.value': self.validateTriggerValue.bind(self),
        'units.*': self.validateUnit.bind(self),
        '!': self.validateForm.bind(self)
      })
      .done(function (json) {
        if (verbose) {
          outputStream.write(JSON.stringify(json, null, '  ') + '\n');
        }
        if(!self.invalid) {
          outputStream.write(source + ': Form validated' + '\n');
        }
        self.emit('done', json);
      })
      .fail(function (errorReport) {
        if (errorReport.statusCode) {
          parser.abort();
          outputStream.write('Status: ' + errorReport.statusCode + '\n');
        }
        if (errorReport.body) {
          parser.abort();
          outputStream.write('body: ', errorReport.body + '\n');
        }
        if (errorReport.jsonBody) {
          parser.abort();
          outputStream.write('jsonBody: ', errorReport.jsonBody + '\n');
        }
        self.invalid = true;
        self.emit('error', errorReport.thrown);
      });
  },


  /*
   * Validate any ducktype.Throws exception if validity fails.
   *
   * @param {Object} ducktype
   * @param {param} param - Instance object
   * @param {type} path - Ancestral path
   */
  validateDucktype: function (ducktype, param, path) {
    if(param && typeof param === 'object') {
      var extra = lodash.difference(Object.keys(param), valueList[ducktype.name]);
      if(extra.length > 0) {
        throw new Error('Failed validation at '+this.source+' [' + path + ']: Unsupported fields [' + extra + '] in '+ducktype.name);
      }
    }
    else if(param && typeof param === 'string') {
      this._checkValueConstraints(valueList[ducktype.name], param, ducktype.name, path);
    }

    if (!ducktype.test(param)) {
      throw new Error('Failed validation at '+this.source+' [' + path + ']: ' + JSON.stringify(param) + ' is not ' + ducktype.name);
    }
  },


  /**
   * Validate datatype.
   *
   * @param param
   * @param path
   */
  validateDataType: function (param, path) {
    this.validateDucktype(types.DataType, param, path);
  },

  /**
   * Validate editable
   *
   * @param param - Editable instance
   * @param path - Ancestral path
   */
  validateEditable: function (param, path) {
    if(param) {
      this.validateDucktype(types.Editable, param, path);
    }
  },
   
  /**
   * Validate form - Highest level ducktype.
   *
   * param.type and param.template are checked against constrained list.
   *
   * @param {Object} param - Form instance
   * @param {Array} path - Ancestral path
   */
  validateForm: function (param, path) {
    this.validateDucktype(types.Form, param, path);
    if(param.type) {
      this._checkValueConstraints(valueList.FormType, param.type, 'type', path);
    }
    if(param.template) {
      this._checkValueConstraints(valueList.FormTemplate, param.template, 'template', path);
    }
  },
  
  /**
   * Validate formula, first ducktype and then constrained values for formula name.
   *
   * @param {Object} param - Formula instance
   * @param {Array} path - Ancestral path
   */
  validateFormula: function (param, path) {
    this.validateDucktype(types.Formula, param, path);
  },


  /**
   * Validate restriction type.
   *
   * Validates ducktype, constrained values for name, and regex|number
   * for value.
   *
   * @param {Object} param - restriction instance
   * @param {Array} path - Ancestral path
   */
  validateRestriction: function (param, path) {
    this.validateDucktype(types.Restriction, param, path);
    if(param) {
      var valid = false;
      if(param.name === 'pattern') {
        valid = Ducktype.regexp.test(new RegExp(param.value));
      }
      else {
        valid = Ducktype.number.test(param.value);
      }

      if(!valid) {
        throw new Error('Invalid ' + param.name + ' at ' + this.source + ' [' + path + ']: ' + param.value);
      }
    }
  },


  /**
   * Validate skip logic trigger value type
   *
   * @param {Object|Number} param - Trigger value instance
   * @param {Array} path - Ancestral path
   */
  validateTriggerValue: function (param, path) {
    if (param instanceof Object) {
      this.validateDucktype(types.Range, param, path);
      // Impose restriction on min;max and inclsive:exclusive
      if ((param.minExclusive === defined && param.minInclusve === defined) ||
        (param.maxExclusive === defined && param.maxInclusve === defined)) {
        throw new Error('Invalid range values at '+this.source+' [' + path + ']: ' + param + '\n');
      }
    }
    else if(typeof (param) !== 'number') {
      throw new Error('Invalid trigger value at '+this.source+' [' + path + ']: ' + param + '\n');
    }
  },

  /**
   * Validate item
   *
   * @param {Object} param - item instance
   * @param {Array} path - Ancestral path
   */
  validateItem: function (param, path) {
    this.validateDucktype(types.Item, param, path);
  },


  /**
   * Validate formatting
   *
   * @param {Object} param - Formatting instance
   * @param {Object} path - Ancestral path
   */
  validateFormatting: function (param, path) {
    this.validateDucktype(types.Formatting, param, path);
  },


  /**
   * Validate skip logic type
   *
   * @param {Object} param - skip logic instance
   * @param {Array} path - Ancestral path
   */
  validateSkipLogic: function (param, path) {
    this.validateDucktype(types.SkipLogic, param, path);
  },


  /**
   * Validate trigger
   *
   * @param {Object} param - Trigger instance
   * @param {Array} path - Ancestral path
   */
  validateTrigger: function (param, path) {
    this.validateDucktype(types.Trigger, param, path);
  },



  /**
   * Validate template options
   *
   * @param {Object} param - TemplateOptions instance
   * @param {Array} path - Ancestral path
   */
  validateTemplateOptions: function (param, path) {
    this.validateDucktype(types.TemplateOptions, param, path);
  },

  /**
   * Validate ObxTableColumns
   *
   * @param {Object} param - ObxTableColumns instance
   * @param {Array} path - Ancestral path
   */
  validateObxTableColumns: function (param, path) {
    this.validateDucktype(types.ObxTableColumns, param, path);
  },

  /**
   * Validate answer
   *
   * @param {Object} param - Answer instance
   * @param {Array} path - Ancestral path
   */
  validateAnswer: function (param, path) {
    this.validateDucktype(types.Answer, param, path);
  },

  /**
   * Validate cardinality
   *
   * @param {Object} param - Cardinality instance
   * @param {Array} path - Ancestral path
   */
  validateCardinality: function (param, path) {
    this.validateDucktype(types.Cardinality, param, path);
  },

  /**
   * Validate unit type
   *
   * @param {Object} param - unit instance
   * @param {Array} path - Ancestral path
   */
  validateUnit: function (param, path) {
    this.validateDucktype(types.Unit, param, path);
  },
  

  /*
   * Check the validity of loinc code for checksum digit. Uses a variation of
   * Luhn algorithm used by Regenstrief Institute.
   *
   * @param {String} code - Loinc code
   * @returns {Boolean}
   */
  validateLoincCode: function(code) {
    var ret = false;

    if(typeof code !== 'string') {
      return ret;
    }

    var r = /^(LP|LA|X)?\d+-\d$/i;

    code = code.trim();
    if(r.test(code)) {
      var parts = code.split('-');
      ret = (parts[1] === String(_luhnCheckDigit(parts[0])));
    }
    
    return ret;
  },
  

  /*
   *Throws exception if the value is not in the constrained list.
   *
   * @param {Array} constraintList - List of valid strings
   * @param {String} inputValue - input string to check
   * @param {String} name - Name of the ducktype (for error reporting)
   * @param {String} path - Path of the element (for error reporting)
   */
  _checkValueConstraints: function (constraintList, inputValue, name, path) {
    if(!constraintList) {
      // No list implies no constraints. Deemed valid.
      return;
    }
    if (constraintList.indexOf(inputValue) === -1) {
      throw new Error('Invalid ' + name + ' at ' + this.source + ' [' + path + ']: ' + inputValue + '\n' +
        'Valid types are ' + constraintList);
    }
  }
});

module.exports = LFormsValidator;




/**
 * Calculate check digit. A variation of Luhn algorithm used by Regenstrief Institute.
 *
 * Copied from 
 * https://wiki.openmrs.org/display/docs/Check+Digit+Algorithm
 * 
 * @param {type} number
 * @returns {Number|Boolean}
 */
function _luhnCheckDigit(number) {
  var validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVYWXZ_";
  number = number.toUpperCase().trim();
  var sum = 0;
  for (var i = 0; i < number.length; i++) {
    var ch = number.charAt(number.length - i - 1);
    if (validChars.indexOf(ch) < 0) {
      alert("Invalid character(s) found!");
      return false;
    }
    var digit = ch.charCodeAt(0) - 48;
    var weight;
    if (i % 2 === 0) {
      weight = (2 * digit) - parseInt(digit / 5) * 9;
    }
    else {
      weight = digit;
    }
    sum += weight;
  }
  sum = Math.abs(sum) + 10;
  var digit = (10 - (sum % 10)) % 10;
  return digit;
}


