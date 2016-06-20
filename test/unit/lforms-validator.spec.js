/**
 * Created by akanduru on 9/16/15.
 */
'use strict';
var helper = require('./lforms-validator.helper');
var validator = require('tv4');
 var formSchema = require('../../lforms-form-schema.json');
var itemSchema = require('../../lforms-item-schema.json');


describe('Should validate', function() {
  validator.addSchema('lforms-form-schema.json', formSchema);
  validator.addSchema('lforms-item-schema.json', itemSchema);
  
  var formJsonString = JSON.stringify(helper.formBuilderForm);
  

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
    expect(validator.validate(item, itemSchema)).toBeTruthy();
    // Test for an invalid field
    item['XXX'] = 'aaaaaaaaaa';
    expect(validator.validate(item, itemSchema)).toBeFalsy();
  });

  it('Form', function() {
    var form = helper.formBuilderForm;
    expect(validator.validate(form, formSchema)).toBeTruthy();
    form['XXX'] = 'aaaaaaaaa';
    expect(validator.validate(form, formSchema)).toBeFalsy();
  });
});