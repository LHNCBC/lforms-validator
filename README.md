This package includes JSON Schema files which define the structure of an [LForms data object](https://github.com/lhncbc/lforms/blob/master/form_definition.md).
It has a small javascript library to validate the structure programmatically. 

The schema definitions use [JSON Schema](http://json-schema.org) version 4 standard. 

For general information about LForms project, please visit https://lhncbc.nlm.nih.gov/project/lforms.
For more technical details, please visit http://lhncbc.github.io/lforms.

## Installation 
This package installs using the [bower](http://bower.io) package manager.

    bower install lforms-validator 

## Usage

```JavaScript
...
var validator = new LForms.Validator();
var validationResults = validator.validateForm(potentialLForm);
if(validationResults.valid === true) {
  console.log('It is a valid LForms data object!');
}
...
```

In the above code snippet, validateForm() tests if 'potentialLForm' is a valid [LForms](https://lhncbc.nlm.nih.gov/project/lforms) data object.
It returns an object with any potential errors. This package uses [tv4](https://github.com/geraintluff/tv4) 
json schema validation library underneath. See the tv4 documentation for details on the content of validationResults. 

## License
See [LICENSE.md](LICENSE.md).