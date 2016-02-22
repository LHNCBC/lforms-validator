/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Ducktype = require('ducktype');

exports.DataType = Ducktype(String, {optional: true, nullable: true});

// Type definition is to identify the fields. Other restrictions are imposed 
// in range handler in lforms-validator.js
exports.Range = Ducktype({
  maxExclusive: Ducktype(Number, {optional: true}),
  maxInclusive: Ducktype(Number, {optional: true}),
  minExclusive: Ducktype(Number, {optional: true}),
  minInclusive: Ducktype(Number, {optional: true})
},{name: 'Range', optional: true, nullable: true});

exports.Unit = Ducktype({
  name: String,
  absoluteRange: Ducktype(exports.Range, {optional: true}),
  default: Ducktype(Boolean, {optional: true}),
  normalRange: Ducktype(exports.Range, {optional: true})
}, {name: 'Unit', optional: true, nullable: true});

exports.Cardinality = Ducktype({
  // TODO. 
  // As per Ye, the type is changed from int to string recently,
  // but we don't have the data yet. For time being, using integer types.
  // Change to String type when the data is available.
  //   
  min: Ducktype(String, {optional: true}),
  max: Ducktype(String, {optional: true})
  // max: Ducktype(Number, {optional: true}),
  // min: Ducktype(Number, {optional: true})
}, {name: 'Cardinality', optional: true, nullable: true});

exports.Answer = Ducktype({
  text: String,
  code: String,
  label: Ducktype(String, {optional: true, nullable: true}),
  score: Ducktype(Number, {optional: true, nullable: true}),
  other: Ducktype(String, {optional: true, nullable: true})
},{name: 'Answer', optional: true, nullable: true});

exports.Formula = Ducktype({
  name: String,
  value: Ducktype([String], {optional: true})
}, {name: 'Formula', nullable: true});

exports.Formatting = Ducktype({
    direction: Ducktype(String, {optional: true}),
    maxWidth: Ducktype(String, {optional: true}),
    minWidth: Ducktype(String, {optional: true}),
    width: Ducktype(String, {optional: true})
  },{name:'Formatting', optional: true, nullable: true});

exports.Restriction = Ducktype({
  name: String,
  value: Ducktype(Number, RegExp)
}, {name: 'Restriction', optional: true, nullable: true});

exports.Trigger = Ducktype({
    code: Ducktype(String, {optional: true}),
    value: Ducktype(Ducktype(Number, exports.Range), {optional: true})
  }, {name: 'Trigger', optional: true, nullable: true});
  
exports.TriggerValue = Ducktype(
        Number, exports.Range, {name: 'TriggerValue'});


exports.SkipLogic = Ducktype({
  action: String,
  targets: [String],
  trigger: exports.Trigger
},{name: 'SkipLogic', optional: true, nullable: true});

exports.Item = Ducktype({
  // Mndatory
  questionCode: String,
  question: String,
  // Optional, i.e if present null is not allowed
  header: Ducktype(Boolean, {optional: true}),
  // Optional or nullable 
  answerCardinality: Ducktype(exports.Cardinality, {optional: true, nullable: true}),  
  answers: Ducktype([exports.Answer],{optional: true, nullable: true}),
  calculationMethod: Ducktype(String, {optional: true, nullable: true}),
  codingInstructions: Ducktype(String, {optional: true, nullable: true}),
  copyrightNotice: Ducktype(String, {optional: true, nullable: true}),
  // dataType has restricted set of strings. The restriction is imposed
  // in validate_form.js
  dataType: Ducktype(exports.DataType, {optional: true, nullable: true}),
  defaultAnswer: Ducktype(exports.Answer, {optional: true, nullable: true}),
  editable: Ducktype(String, {optional: true, nullable: true}),  
  externallyDefined: Ducktype(String, {optional:true, nullable: true}),
  formatting: Ducktype(exports.Formatting, {optional: true, nullable: true}),
  formula: Ducktype(exports.Formula, {optional: true, nullable: true}),
  // Nested items is removed, thank god!
  // Ducktype also doesn't support nested validation!!
  // items: Ducktype([exports.Item], {optional: true, nullable: true}),
  localQuestionCode: Ducktype(String, {optional: true, nullable: true}),
  parentQuestionCode: Ducktype(String,{optional: true, nullable: true}),
  questionCardinality: Ducktype(exports.Cardinality,{optional: true, nullable: true}),
  restrictions: Ducktype([exports.Restriction],{optional: true, nullable: true}),
  skipLogic: Ducktype([exports.SkipLogic], {optional: true, nullable: true}),
  units: Ducktype([exports.Unit],{optional: true, nullable: true})
},{name: 'Item', optional: true, nullable: true});

exports.Form = Ducktype({
  code: Ducktype(String,{optional: true}),
  items: [exports.Item],
  name: String,
  type: Ducktype(String, {optional: true})
},{name: 'Form'});

