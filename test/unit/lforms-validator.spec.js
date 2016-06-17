/**
 * Created by akanduru on 9/16/15.
 */
'use strict';
var types = require('../../lib/widget-data-types');
var helper = require('./lforms-validator.helper');
var valueList = require('../../lib/type-lists');
var validator = require('tv4');
 var formSchema = require('../../lforms-form-schema.json');
var itemSchema = require('../../lforms-item-schema.json');


describe('Should validate', function() {
  validator.addSchema('lforms-form-schema.json', formSchema);
  validator.addSchema('lforms-item-schema.json', itemSchema);
  
  var formJsonString = JSON.stringify(helper.formBuilderForm);
  

  it('formatting', function() {
    expect(function() {
      validator.validateDucktype(types.Formatting, helper.formBuilderForm.templateOptions.obxTableColumns[0].formatting, '');
    }).not.toThrow();
  });


  it('obxTableColumns', function() {
    expect(function() {
      validator.validateDucktype(types.ObxTableColumn, helper.formBuilderForm.templateOptions.obxTableColumns[0], '');
    }).not.toThrow();
  });

  fit('templateOptions', function() {
    expect(validator.validate(helper.formBuilderForm.templateOptions, formSchema.definitions.templateOptions)).toBeTruthy();
  });

  fit('skipLogic', function() {
    var skipLogic = helper.skipLogic;
    expect(validator.validate(skipLogic, itemSchema.definitions.skipLogic)).toBeTruthy();
    // Test for an invalid field
    skipLogic['XXX'] = 'aaaaaaa';
    expect(validator.validate(skipLogic, itemSchema.definitions.skipLogic)).toBeFalsy();
  });

  fit('Item', function() {
    var item = helper.item;
    expect(validator.validate(item, itemSchema)).toBeTruthy();
    // Test for an invalid field
    item['XXX'] = 'aaaaaaaaaa';
    expect(validator.validate(item, itemSchema)).toBeFalsy();
  });

  fit('Form', function() {
    var form = helper.formBuilderForm;
    expect(validator.validate(form, formSchema)).toBeTruthy();
    form['XXX'] = 'aaaaaaaaa';
    expect(validator.validate(form, formSchema)).toBeFalsy();
  });
});