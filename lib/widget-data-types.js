/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * ****************** IMPORTANT **** IMPORTANT ******************************************
 * Make sure the ducktype is defined before it is used in other definitions.
 *
 * The order of definition matters!
 * **************************************************************************************
 */
var Ducktype = require('ducktype');

/**
 The following are essentially basic types. They redefined to assign a name
 so that the name is used to enumerate constrained list of values for these fields.

 Caveat:
 The nullable option is used to force the ducktype to read the name option as work-around.
 Without nullable/optional in the options, if the content is a basic type, it
 doesn't read the optional name. Apparently a bug??
 */
exports.FormTemplate = Ducktype(String, {name: 'FormTemplate', nullable: true});
exports.DataType = Ducktype(String, {name: 'DataType', nullable: true});
exports.FormType = Ducktype(String, {name: 'FormType', nullable: true});
exports.Editable = Ducktype(String, {name: 'Editable', nullable: true});
exports.FormulaName = Ducktype(String, {name: 'FormulaName', nullable: true});
exports.RestrictionName = Ducktype(String, {name: 'RestrictionName', nullable: true});
exports.MaxExclusive = Ducktype(Number, {name: 'MaxExclusive', nullable: true});
exports.MaxInclusive = Ducktype(Number, {name: 'maxInclusive', nullable: true});
exports.MinExclusive = Ducktype(Number, {name: 'minExclusive', nullable: true});
exports.MinInclusive = Ducktype(Number, {name: 'minInclusive', nullable: true});

// Type definition is to identify the fields. Other restrictions are imposed 
// in parser handler in lforms-validator.js
exports.Range = Ducktype({
  maxExclusive: Ducktype(exports.MaxExclusive, {optional: true}),
  maxInclusive: Ducktype(exports.MaxInclusive, {optional: true}),
  minExclusive: Ducktype(exports.MinExclusive, {optional: true}),
  minInclusive: Ducktype(exports.MinInclusive, {optional: true})
},{name: 'Range'});

exports.Unit = Ducktype({
  name: String,
  absoluteRange: Ducktype(exports.Range, {optional: true}),
  default: Ducktype(Boolean, {optional: true}),
  normalRange: Ducktype(exports.Range, {optional: true})
}, {name: 'Unit'});

exports.Cardinality = Ducktype({
  // TODO. 
  // As per Ye, the type is changed from int to string recently,
  // but we don't have the data yet. For time being, using integer types.
  // Change to String type when the data is available.
  //   
  min: Ducktype(String, Number, {optional: true}),
  max: Ducktype(String, Number, {optional: true})
  // max: Ducktype(Number, {optional: true}),
  // min: Ducktype(Number, {optional: true})
}, {name: 'Cardinality'});

exports.Answer = Ducktype({
  text: String,
  code: String,
  label: Ducktype(String, {optional: true, nullable: true}),
  score: Ducktype(Number, {optional: true, nullable: true}),
  other: Ducktype(String, {optional: true, nullable: true})
},{name: 'Answer'});

exports.DefaultAnswer = Ducktype(exports.Answer, String, {name: 'DefaultAnswer'});

exports.Formula = Ducktype({
  name: exports.FormulaName,
  value: Ducktype([String], {optional: true})
}, {name: 'Formula'});

exports.Formatting = Ducktype({
    direction: Ducktype(String, {optional: true}),
    maxWidth: Ducktype(String, {optional: true}),
    minWidth: Ducktype(String, {optional: true}),
    width: Ducktype(String, {optional: true})
  },{name:'Formatting'});

exports.ObxTableColumns = Ducktype({
  name: String,
  formatting: Ducktype(exports.Formatting, {optional: true, nullable: true})
}, {name: 'ObxTableColumns'});

exports.TemplateOptions = Ducktype({
  obrHeader: Ducktype(Boolean, {optional: true}),
  hideHeader: Ducktype(Boolean, {optional: true}),
  obxTableColumns: Ducktype([exports.ObxTableColumns], {optional: true, nullable: true})
}, {name: 'TemplateOptions'});

exports.Restriction = Ducktype({
  name: exports.RestrictionName,
  value: Ducktype(Number, String)
}, {name: 'Restriction', optional: true, nullable: true});

exports.Trigger = Ducktype({
    code: Ducktype(String, {optional: true}),
    value: Ducktype(exports.TriggerValue, {optional: true, nullable: true})
  }, {name: 'Trigger'});
  
exports.TriggerValue = Ducktype(Number, exports.Range, {name: 'TriggerValue'});

exports.Condition = Ducktype({
  source: String,
  trigger: exports.Trigger
}, {name: 'Condition'});


exports.SkipLogic = Ducktype({
  action: String,
  logic: Ducktype(String, {optional: true, nullable: true}),
  conditions: Ducktype([exports.Condition])

  //targets: [String],
  //trigger: exports.Trigger
},{name: 'SkipLogic'});

exports.Item = Ducktype({
  // Include all fields in item except 'items'. Ducktype does not support
  // recursive definition. The nested items validation is handled at
  // parser level

  // Mandatory
  questionCode: String,
  question: String,
  // Optional, i.e if present null is not allowed
  header: Ducktype(Boolean, {optional: true}),
  // Optional or nullable
  _initValue: Ducktype(exports.DefaultAnswer, {optional: true, nullable: true}),
  answerCardinality: Ducktype(exports.Cardinality, {optional: true, nullable: true}),  
  answers: Ducktype([exports.Answer], String,{optional: true, nullable: true}),
  calculationMethod: Ducktype(String, {optional: true, nullable: true}),
  codingInstructions: Ducktype(String, {optional: true, nullable: true}),
  comment: Ducktype(String, {optional: true, nullable: true}),
  copyrightNotice: Ducktype(String, {optional: true, nullable: true}),
  dataType: Ducktype(exports.DataType, {optional: true, nullable: true}),
  defaultAnswer: Ducktype(exports.Answer, {optional: true, nullable: true}),
  editable: Ducktype(String, {optional: true, nullable: true}),  
  externallyDefined: Ducktype(String, {optional:true, nullable: true}),
  formatting: Ducktype(exports.Formatting, {optional: true, nullable: true}),
  formula: Ducktype(exports.Formula, {optional: true, nullable: true}),
  localQuestionCode: Ducktype(String, {optional: true, nullable: true}),
  parentQuestionCode: Ducktype(String,{optional: true, nullable: true}),
  questionCardinality: Ducktype(exports.Cardinality,{optional: true, nullable: true}),
  restrictions: Ducktype([exports.Restriction],{optional: true, nullable: true}),
  skipLogic: Ducktype(exports.SkipLogic, {optional: true, nullable: true}),
  units: Ducktype([exports.Unit],{optional: true, nullable: true})

},{name: 'Item'});

exports.Form = Ducktype({
  code: Ducktype(String,{optional: true}),
  name: String,
  template: Ducktype(exports.FormTemplate, {optional: true, nullable: true}),
  type: Ducktype(exports.FormType, {optional: true}),
  templateOptions: Ducktype(exports.TemplateOptions, {optional: true, nullable: true}),
  items: [exports.Item]
},{name: 'Form'});

