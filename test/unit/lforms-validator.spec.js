/**
 * Created by akanduru on 9/16/15.
 */
'use strict';

if (typeof require !== 'undefined' && require.main !== module) { // i.e. if it was required
  var helper = require('./../helpers/lforms-validator.helper.js');
  var LForms = require('../../validator');
}

var formSchemaUrl = './lforms-form-schema.json';
var itemSchemaUrl = 'lforms-item-schema.json';

var matchers = {
  /**
   * Matcher to validate validator's result object
   * and display custom message on failure.
   *
   * @returns {{compare: compare}}
   */
  toBeValid: function () {

    return {
      /**
       * Jasmine's call back function to customize the comparison expected and actual values. 
       * 
       * @param actual - Actual value passed to expect()
       * @param expected - Expected value, usually passed to matcher, as our matcher is 
       * with out parameters.
       * @returns {Object} - The keys are pass and message. 
       *   pass: A boolean flag to indicate if the test passed or not.
       *   message: A string to display when the expectation fails. Set the 
       *     message for both values of pass to cover negative expectation.
       */
      compare: function (actual, expected) {
        var result = {};

        result.pass = actual.valid;
        if(result.pass) {
          result.message = "Expected not to be valid";
        }
        else {
          delete actual.stack;
          result.message = "Expected to be valid: "+JSON.stringify(actual, null, 2);
        }

        return result;
      }
    };
  }
};



describe('Should validate', function() {
  var validator = null;
  var formSchema, itemSchema = null;
  
  beforeAll(function (done) {
    // Add custom matchers. 
    jasmine.addMatchers(matchers);
    
    validator = new LForms.Validator();
    setTimeout(function () {
      var tv4 = validator.getValidatorObj();
      formSchema = tv4.getSchema(formSchemaUrl);
      itemSchema = tv4.getSchema(itemSchemaUrl);
      done();
    }, 1000);
  });
  
  it('displayControl', function() {
    expect(validator.validate(helper.templateOptions.obxTableColumns[0].displayControl, formSchema.definitions.obxTableColumn.properties.displayControl)).toBeTruthy();
  });


  it('obxTableColumns', function() {
    expect(validator.validate(helper.templateOptions.obxTableColumns[0], formSchema.definitions.obxTableColumn)).toBeTruthy();
  });

  it('templateOptions', function() {
    expect(validator.validate(helper.templateOptions, formSchema.definitions.templateOptions)).toBeTruthy();
  });

  it('skipLogic', function() {
    var skipLogic = helper.skipLogic;
    expect(validator.validate(skipLogic, itemSchema.definitions.skipLogic)).toBeTruthy();
    // Test for an invalid field
    skipLogic['XXX'] = 'aaaaaaa';
    expect(validator.validate(skipLogic, itemSchema.definitions.skipLogic)).toBeFalsy();
  });

  it('Item', function() {
    var item = helper.item;
    expect(validator.validateResult(item, itemSchema)).toBeValid();
    // Test for an invalid field
    item['XXX'] = 'aaaaaaaaaa';
    expect(validator.validateResult(item, itemSchema)).not.toBeValid();
  });

  it('Form', function() {
    expect(validator.validateForm(helper.glasgow)).toBeValid();
  });
});
