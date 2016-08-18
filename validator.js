
/**
 * Created by akanduru on 2/24/16.
 */
// global namespace
var LForms = LForms || {};
if (typeof require !== 'undefined' && require.main !== module) { // i.e. if it was required
  module.exports = LForms;
  var tv4 = require('tv4');
  var readJson = function (uri, callback) {
    try {
      if(!uri.startsWith('./')) {
        uri = './'+uri;
      }
      var json = require(uri);
      callback(json);
    }
    catch (exp) {
      console.log(exp);
    }
    
  };
}
else {
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

  LForms.Validator.prototype.getValidatorObj = function () {
    return this.validator;
  };
  
  LForms.Validator.prototype.validate = function(json, schemaPart) {
    return this.validator.validate(json, schemaPart);
  };

  LForms.Validator.prototype.validateResult = function(json, schemaPart) {
    return this.validator.validateResult(json, schemaPart);
  };

  LForms.Validator.prototype.validateForm = function(form) {
    return this.validator.validateResult(form, this.validator.getSchema(schemaUri));
  };

  /**
   * Synchronous retrieval of json object from a json file.
   * @param filename
   */


}).call(this);


