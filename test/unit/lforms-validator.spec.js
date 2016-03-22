/**
 * Created by akanduru on 9/16/15.
 */
'use strict';
var types = require('../../lib/widget-data-types');
var LFormsValidator = require('../../lib/lforms-validator');
var helper = require('./lforms-validator.helper');
var valueList = require('../../lib/type-lists');


describe('Should validate', function() {
  var validator = new LFormsValidator();
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


  it('templateOptions', function() {
    expect(function() {
      validator.validateDucktype(types.TemplateOptions, helper.formBuilderForm.templateOptions, '');
    }).not.toThrow();
  });


  it('dataType', function() {
    expect(function() {validator.validateDataType('CNE', '');}).not.toThrow();
    expect(function() {validator.validateDataType('XXX', ['YYY']);})
      .toThrow(new Error('Invalid DataType at  [YYY]: XXX\nValid types are ' + valueList[types.DataType.name]));
  });


  it('skipLogic', function() {
    var skipLogic = helper.skipLogic;
    expect(function() {validator.validateSkipLogic(skipLogic, '');}).not.toThrow();
    // Test for an invalid field
    skipLogic['XXX'] = 'aaaaaaa';
    expect(function() {validator.validateSkipLogic(skipLogic, ['YYY']);})
      .toThrow(new Error('Failed validation at  [YYY]: Unsupported fields [XXX] in '+types.SkipLogic.name));
  });


  it('Item', function() {
    var item = helper.item;
    expect(function() {validator.validateItem(item, '');}).not.toThrow();
    // Test for an invalid field
    item['XXX'] = 'aaaaaaaaaa';
    expect(function() {validator.validateItem(item, ['YYY']);})
      .toThrow(new Error('Failed validation at  [YYY]: Unsupported fields [XXX] in '+types.Item.name));
  });

  it('Form', function() {
    var form = helper.formBuilderForm;
    expect(function() {validator.validateForm(form, '');}).not.toThrow();
    form['XXX'] = 'aaaaaaaaa';
    expect(function() {validator.validateForm(form, ['YYY']);})
      .toThrow(new Error('Failed validation at  [YYY]: Unsupported fields [XXX] in '+types.Form.name));
  });

  describe('Form from file', function() {
    var localValidator, success = false;


    beforeEach(function(done) {
      success = false;
      localValidator = new LFormsValidator(formJsonString, {isInputString: true});
      localValidator.on('done', function() {
        success = true;
        done();
      });
      localValidator.on('error', function(err) {
        success = false;
        done(err);
      });
      localValidator.validate();
    });


    it('should emit done', function() {
      expect(success).toBeTruthy();
    });
  });




});