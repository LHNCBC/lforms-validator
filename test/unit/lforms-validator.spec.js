/**
 * Created by akanduru on 9/16/15.
 */
'use strict';
var helper = require('./lforms-validator.helper');
var validator = require('tv4');
 var formSchema = require('../../lforms-form-schema.json');
var itemSchema = require('../../lforms-item-schema.json');

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
  validator.addSchema('lforms-form-schema.json', formSchema);
  validator.addSchema('lforms-item-schema.json', itemSchema);
  
  beforeEach(function () {
    // Add custom matchers. They are torn down after every it(). 
    jasmine.addMatchers(matchers);
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
    // Use custom matcher.
    //expect(validator.validateResult(helper.formBuilderForm, formSchema)).toBeValid();
    expect(validator.validateResult(helper.glasgow, formSchema)).toBeValid();
  });
});
