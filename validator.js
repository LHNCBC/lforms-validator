
/**
 * Created by akanduru on 2/24/16.
 */
// global namespace
var LForms = LForms || {};
if (typeof require !== 'undefined' && require.main !== module) {
  // Node compatible
  module.exports = LForms;
  var tv4 = require('tv4');

  /**
   * In nodejs environment, read the json file from local file system.
   *
   * @param uri - json source
   * @param callback - Call back function for the caller with json as a single argument.
   *   Will be called when it is successfully read the json.
   */
  var readJson = function (uri, callback) {
    try {
      if(!uri.startsWith('./')) {
        uri = './'+uri;
      }
      var json = require(uri);
      callback(json);
    }
    catch (exp) {
      // Mostly ignored, but log to console.
      console.log(exp);
    }
    
  };
}
else {
  // Browser specific
  /**
   * Utility to read json from the server. This is browser version.
   * @param uri - Json source
   * @param callback - Call back function for the caller with json as a single argument.
   *   Will be called when it is successfully read the json.
   */
  var readJson = function(uri, callback) {
    "use strict";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        var json = JSON.parse(xhttp.responseText);
        callback(json);
      }
    };
    xhttp.open("GET", uri, true);
    xhttp.send();
  };
}


(function () {
  "use strict";
  var schemaUri = './lforms-form-schema.json';

  /**
   * A wrapper class over tv4 validator, using lforms-form-schema file.
   *
   * @constructor
   */
  LForms.Validator = function() {
    var self = this;
    self.validator = tv4;

    readJson(schemaUri, function (schema) {
      self.validator.addSchema(schemaUri, schema); // uri should be equal to schema.id
      self.validator.getMissingUris().forEach(function (missingUri) {
        readJson(missingUri, function (missingSchema) {
          self.validator.addSchema(missingUri, missingSchema); // uri should be equal to schema.id
        });
      });
    });
  };


  /**
   * Access underlying json schema validator (tv4).
   *
   * @returns {Object} - tv4 object.
   */
  LForms.Validator.prototype.getValidatorObj = function () {
    return this.validator;
  };


  /**
   * Indicates if the input is valid or not. No details about why it is not valid.
   * Use validateResult if interested in details of failure.
   *
   * @param json - input object to validate
   * @param schemaPart - Part of schema to validate.
   * @return {boolean} - Valid or not.
   */
  LForms.Validator.prototype.validate = function(json, schemaPart) {
    return this.validator.validate(json, schemaPart);
  };

  
  /**
   * Gives more details about why the validation failed.
   *
   * @param json - input object to validate
   * @param schemaPart - Part of schema to validate.
   * @returns {Object} - Object with details on result of validation.
   */
  LForms.Validator.prototype.validateResult = function(json, schemaPart) {
    return this.validator.validateResult(json, schemaPart);
  };


  /**
   * Form level validation. 
   * 
   * @param form - Form object to validate.
   * @returns {Object} - Object with details on result of validation.
   */
  LForms.Validator.prototype.validateForm = function(form) {
    return this.validator.validateResult(form, this.validator.getSchema(schemaUri));
  };

  /**
   * Synchronous retrieval of json object from a json file.
   * @param filename
   */


}).call(this);


