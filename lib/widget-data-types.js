/**
 * This file contains all the data type definitions using ducktype.
 *
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
exports.FormTemplate = Ducktype(String, {name: 'FormTemplate', optional: true, nullable: true});
exports.DataType = Ducktype(String, {name: 'DataType', optional: true, nullable: true});
exports.FormType = Ducktype(String, {name: 'FormType', optional: true, nullable: true});
exports.Editable = Ducktype(String, {name: 'Editable', optional: true, nullable: true});
exports.FormulaName = Ducktype(String, {name: 'FormulaName', optional: true, nullable: true});
exports.RestrictionName = Ducktype(String, {name: 'RestrictionName', optional: true, nullable: true});
exports.MaxExclusive = Ducktype(Number, {name: 'MaxExclusive', optional: true, nullable: true});
exports.MaxInclusive = Ducktype(Number, {name: 'maxInclusive', optional: true, nullable: true});
exports.MinExclusive = Ducktype(Number, {name: 'minExclusive', optional: true, nullable: true});
exports.MinInclusive = Ducktype(Number, {name: 'minInclusive', optional: true, nullable: true});

// Type definition is to identify the fields. Other restrictions are imposed 
// in parser handler in lforms-validator.js
exports.Range = Ducktype({
  maxExclusive: exports.MaxExclusive,
  maxInclusive: exports.MaxInclusive,
  minExclusive: exports.MinExclusive,
  minInclusive: exports.MinInclusive
},{name: 'Range', optional: true, nullable: true});

exports.Unit = Ducktype({
  name: String,
  absoluteRange: exports.Range,
  default: Ducktype(Boolean, {optional: true}),
  normalRange: exports.Range
}, {name: 'Unit', optional: true, nullable: true});

exports.Cardinality = Ducktype({
  // TODO. 
  // As per Ye, the type is changed from int to string recently,
  // but we don't have the data yet. For time being, using integer types.
  // Change to String type when the data is available.
  //   
  min: Ducktype(String, Number, {optional: true}),
  max: Ducktype(String, Number, {optional: true})
}, {name: 'Cardinality', optional: true, nullable: true});

exports.Answer = Ducktype({
  text: String,
  code: String,
  label: Ducktype(String, {optional: true, nullable: true}),
  score: Ducktype(Number, {optional: true, nullable: true}),
  other: Ducktype(String, {optional: true, nullable: true})
},{name: 'Answer', optional: true, nullable: true});

exports.DefaultAnswer = Ducktype(exports.Answer, String, {name: 'DefaultAnswer', optional: true, nullable: true});

exports.Formula = Ducktype({
  name: exports.FormulaName,
  value: Ducktype([String], {optional: true})
}, {name: 'Formula', optional: true, nullable: true});

exports.Formatting = Ducktype({
    layout: Ducktype(String, {optional: true}),
    direction: Ducktype(String, {optional: true}),
    maxWidth: Ducktype(String, {optional: true}),
    minWidth: Ducktype(String, {optional: true}),
    width: Ducktype(String, {optional: true})
  },{name:'Formatting', optional: true, nullable: true});

exports.ObxTableColumn = Ducktype({
  name: String,
  formatting: exports.Formatting
}, {name: 'ObxTableColumn', optional: true, nullable: true});

exports.TemplateOptions = Ducktype({
  obrHeader: Ducktype(Boolean, {optional: true}),
  hideHeader: Ducktype(Boolean, {optional: true}),
  obxTableColumns: Ducktype([exports.ObxTableColumn], {optional: true, nullable: true})
}, {name: 'TemplateOptions', optional: true, nullable: true});

exports.Restriction = Ducktype({
  name: exports.RestrictionName,
  value: Ducktype(Number, String)
}, {name: 'Restriction', optional: true, nullable: true});

exports.TriggerValue = Ducktype(Number, exports.Range, {name: 'TriggerValue'});

exports.Trigger = Ducktype({
    code: Ducktype(String, {optional: true}),
    value: Ducktype(exports.TriggerValue, {optional: true, nullable: true})
  }, {name: 'Trigger', optional: true, nullable: true});
  

exports.Condition = Ducktype({
  source: String,
  trigger: exports.Trigger
}, {name: 'Condition', optional: true, nullable: true});


exports.SkipLogic = Ducktype({
  action: String,
  logic: Ducktype(String, {optional: true, nullable: true}),
  conditions: Ducktype([exports.Condition])

  //targets: [String],
  //trigger: exports.Trigger
},{name: 'SkipLogic', optional: true, nullable: true});

exports.Item = Ducktype({
  // Include all fields in item except 'items'. Ducktype does not support
  // recursive definition. The nested items validation is handled at
  // parser level

  // Mandatory
  questionCode: String,
  question: String,
  // Optional, i.e if present null is not allowed
  header: Ducktype(Boolean, {optional: true, nullable: true}),
  _initValue: exports.DefaultAnswer,
  answerCardinality: exports.Cardinality,
  answers: Ducktype([exports.Answer], String,{optional: true, nullable: true}),
  calculationMethod: Ducktype(String, {optional: true, nullable: true}),
  codingInstructions: Ducktype(String, {optional: true, nullable: true}),
  comment: Ducktype(String, {optional: true, nullable: true}),
  copyrightNotice: Ducktype(String, {optional: true, nullable: true}),
  dataType: Ducktype(exports.DataType),
  defaultAnswer: exports.DefaultAnswer,
  editable: Ducktype(String, {optional: true, nullable: true}),  
  externallyDefined: Ducktype(String, {optional:true, nullable: true}),
  formatting: exports.Formatting,
  formula: exports.Formula,
  localQuestionCode: Ducktype(String, {optional: true, nullable: true}),
  parentQuestionCode: Ducktype(String,{optional: true, nullable: true}),
  questionCardinality: exports.Cardinality,
  restrictions: Ducktype([exports.Restriction],{optional: true, nullable: true}),
  skipLogic: exports.SkipLogic,
  units: Ducktype([exports.Unit],{optional: true, nullable: true})

},{name: 'Item', optional: true, nullable: true});

exports.Form = Ducktype({
  code: Ducktype(String,{optional: true, nullable: true}),
  name: String,
  template: exports.FormTemplate,
  type: exports.FormType,
  templateOptions: exports.TemplateOptions,
  items: [exports.Item]
},{name: 'Form'});

