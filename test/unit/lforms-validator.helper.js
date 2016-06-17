/**
 * Created by akanduru on 2/24/16.
 */
module.exports = {
  item: {
    "comment": "*********** header ************************",
    "question": "Section",
    "questionCode": "headerC",
    "dataType": "CNE",
    "header": false,
    "answers": "boolean",
    "codingInstructions": "If you choose yes, this question is used as section header",
    "skipLogic": {
      "conditions": [
        {
          "source": "dummySourceC",
          "trigger": {
            "code": "false"
          }
        }
      ],
      "action": "show"
    },
    "value": {
      "text": "No",
      "code": "false"
    }
  },

  skipLogic: {
    "conditions": [
      {
        "source": "dummySourceC",
        "trigger": {
          "code": "false"
        }
      }
    ],
    "action": "show"
  },

  /***form-builder form ***/
  formBuilderForm: {
    "type": "LOINC",
    "code": "formC",
    "name": "Define Question ",

    "templateOptions": {
      "obxTableColumns": [
        {
          "name": "Name",
          "formatting": {
            "width": "50%",
            "minWidth": "4em"
          }
        },
        {
          "name": "",
          "formatting": {
            "width": "5em",
            "minWidth": "5em"
          }
        },
        {
          "name": "Value",
          "formatting": {
            "width": "50%",
            "minWidth": "4em"
          }
        }
      ],
      "obrHeader": false,
      "hideHeader": true
    },

    "items": [
      {
        "comment": "*********** question ************************",
        "questionCode": "questionC",
        "question": "Text",
        "dataType": "ST",
        "header": false,
        "codingInstructions": "Enter wording for question."
      },
      {
        "questionCode": "typeC",
        "question": "Coding System",
        "dataType": "CNE",
        "answers": "codingSystemC",
        "header": false,
        "codingInstructions": "Select \"LOINC\" to use LOINC codes, or create your own coding system by selecting \"Custom.\"",
        "value": {
          "text": "LOINC",
          "code": "LOINC"
        }
      },
      {
        "comment": "*********** questionCode ************************",
        "questionCode": "questionCodeC",
        "question": "Code",
        "dataType": "ST",
        "header": false,
        "codingInstructions": "Enter a code that matches the coding system you selected; or, create your own unique code."
      },
      {
        "comment": "*********** localQuestionCode ************************",
        "questionCode": "localQuestionCodeC",
        "question": "Local code",
        "dataType": "ST",
        "header": false,
        "codingInstructions": "Enter a unique code for the question you are creating. Exmples are 1. or A1."
      },
      {
        "comment": "*********** codingInstructions ************************",
        "questionCode": "codingInstructionsC",
        "question": "Question help",
        "dataType": "ST",
        "header": false,
        "codingInstructions": "Enter any explanatory text needed to help the user answer the question, such as \"Select all that apply\". Instructions will appear before the question."
      },
      {
        "comment": "*********** questionCardinality ************************",
        "questionCode": "questionCardinalityC",
        "question": "Question cardinality",
        "header": true,
        "codingInstructions": "Enter the minimum and maximum number of times the question can be repeated in the format MIN:MAX. MIN must always be greater than 0.  Use \"*\" for infinite. Example 1:*",
        "items": [
          {
            "questionCode": "minC",
            "question": "Minimum",
            "dataType": "ST",
            "header": false,
            "codingInstructions": "Enter the minimum number of times the question can be asked. The value must always be > 0.",
            "restrictions": [
              {
                "name": "pattern",
                "value": "/^[0-9]+|\\*$/"
              }
            ],
            "value": "1"
          },
          {
            "questionCode": "maxC",
            "question": "Maximum",
            "dataType": "ST",
            "header": false,
            "codingInstructions": "Enter the maximum number of times the question can be asked.  Use \"*\" for infinite.",
            "restrictions": [
              {
                "name": "pattern",
                "value": "/^[0-9]+|\\*$/"
              }
            ],
            "value": "1"
          }
        ]
      },
      {
        "comment": "*********** header ************************",
        "question": "Section",
        "questionCode": "headerC",
        "dataType": "CNE",
        "header": false,
        "answers": "boolean",
        "codingInstructions": "If you choose yes, this question is used as section header",
        "skipLogic": {
          "conditions": [
            {
              "source": "dummySourceC",
              "trigger": {
                "code": "false"
              }
            }
          ],
          "action": "show"
        },
        "value": {
          "text": "No",
          "code": "false"
        }
      },
      {
        "questionCode": "editableC",
        "question": "Editable",
        "dataType": "CNE",
        "header": false,
        "answerCardinality": {
          "min": "0",
          "max": "1"
        },
        "answers": "editable",
        "codingInstructions": "Select one of the options to determine whether user data that is entered for this question can be edited.",
        "skipLogic": {
          "conditions": [
            {
              "source": "headerC",
              "trigger": {
                "code": "false"
              }
            }
          ],
          "action": "show"
        },
        "value": {
          "text": "Editable",
          "code": "1"
        }
      },
      {
        "comment": "*********** Data type ************************",
        "question": "Type",
        "questionCode": "dataTypeC",
        "dataType": "CNE",
        "header": false,
        "answers": "dataTypeC",
        "codingInstructions": "Enter the data type of the answer. Valid data types are:",
        "value": {
          "text": "Text",
          "code": "ST"
        },
        "skipLogic": {
          "conditions": [
            {
              "source": "headerC",
              "trigger": {
                "code": "false"
              }
            }
          ],
          "action": "show"
        }
      },
      {
        "questionCode": "answersC",
        "question": "Answer item",
        "header": true,
        "codingInstructions": "If using the data type CWE or CNE, enter the answer list here using the format LABEL:CODE:TEXT:FORMAT:OTHER.",
        "questionCardinality": {
          "min": "1",
          "max": "*"
        },
        "skipLogic": {
          "logic": "ANY",
          "conditions": [
            {
              "source": "dataTypeC",
              "trigger": {
                "code": "CNE"
              }
            },
            {
              "source": "dataTypeC",
              "trigger": {
                "code": "CWE"
              }
            }
          ],
          "action": "show"
        },
        "items": [
          {
            "questionCode": "textC",
            "question": "Answer text",
            "dataType": "ST",
            "codingInstructions": "Enter the text of the answer here.",
            "header": false
          },
          {
            "questionCode": "codeC",
            "question": "Answer code",
            "dataType": "ST",
            "codingInstructions": "If desired, enter a default answer code using LOINC or your own coding system.",
            "header": false
          },
          {
            "questionCode": "labelC",
            "question": "Answer label",
            "dataType": "ST",
            "codingInstructions": "Enter a label such as \"A\" or \"1\" or \"T\"  if you wish to assign a label to each answer.",
            "header": false
          },
          {
            "questionCode": "scoreC",
            "question": "Score",
            "dataType": "INT",
            "codingInstructions": "If desired, enter a number to assign a numerical value to this answer for scoring purposes.",
            "header": false
          },
          {
            "questionCode": "otherC",
            "question": "Other",
            "dataType": "ST",
            "codingInstructions": "Enter the text of an additional question to ask should the user select \"Other\" from the provided answer list. For example, \"Please specify:\"",
            "header": false
          }
        ]
      },
      {
        "questionCode": "answerCardinalityC",
        "question": "Answer cardinality",
        "header": true,
        "codingInstructions": "Enter the minimum and maximum number of answers required using the format MIN:MAX. If the answer is optional, use 0 for MIN.  Example 0:*",
        "skipLogic": {
          "logic": "ANY",
          "conditions": [
            {
              "source": "dataTypeC",
              "trigger": {
                "code": "CNE"
              }
            },
            {
              "source": "dataTypeC",
              "trigger": {
                "code": "CWE"
              }
            }
          ],
          "action": "show"
        },
        "items": [
          {
            "questionCode": "minC",
            "question": "Minimum",
            "dataType": "ST",
            "header": false,
            "restrictions": [
              {
                "name": "pattern",
                "value": "/^[0-9]+|\\*$/"
              }
            ],
            "codingInstructions": "Enter the minimum number of times the answer must be given.  The value must always be > 0.",
            "value": "0"
          },
          {
            "questionCode": "maxC",
            "question": "Maximum",
            "dataType": "ST",
            "header": false,
            "restrictions": [
              {
                "name": "pattern",
                "value": "/^[0-9]+|\\*$/"
              }
            ],
            "codingInstructions": "Enter the maximum number of answers that can be given. Use \"*\" for infinite.",
            "value": "1"
          }
        ]
      },
      {
        "comment": "*********** Default answer ************************",
        "questionCode": "defaultAnswerC",
        "question": "Default answer",
        "dataType": "ST",
        "codingInstructions": "If desired, enter a default answer for the question. If you are using the answer LABEL or CODE fields, enter the default LABEL or CODE.",
        "header": false,
        "skipLogic": {
          "conditions": [
            {
              "source": "headerC",
              "trigger": {
                "code": "false"
              }
            }
          ],
          "action": "show"
        },
        "answerCardinality": {
          "min": "0",
          "max": "1"
        }
      },
      {
        "comment": "*********** Externally defined Answer list ************************",
        "questionCode": "externallyDefinedC",
        "question": "URL for Externally defined Answer list",
        "dataType": "URL",
        "header": false,
        "codingInstructions": "If using an externally defined list of answers to the question, enter it here.",
        "skipLogic": {
          "logic": "ANY",
          "conditions": [
            {
              "source": "dataTypeC",
              "trigger": {
                "code": "CWE"
              }
            },
            {
              "source": "dataTypeC",
              "trigger": {
                "code": "CNE"
              }
            }
          ],
          "action": "show"
        },
        "answerCardinality": {
          "min": "0",
          "max": "1"
        }
      },
      {
        "questionCode": "unitsC",
        "question": "Units",
        "dataType": "CWE",
        "header": false,
        "answerCardinality": {
          "min": "0",
          "max": "*"
        },
        "codingInstructions": "If using an externally defined list of answers to the question, enter the url here.",
        "skipLogic": {
          "logic": "ANY",
          "conditions": [
            {
              "source": "dataTypeC",
              "trigger": {
                "code": "INT"
              }
            },
            {
              "source": "dataTypeC",
              "trigger": {
                "code": "REAL"
              }
            },
            {
              "source": "dataTypeC",
              "trigger": {
                "code": "RTO"
              }
            }
          ],
          "action": "show"
        },
        "answers": "ucumUnits"
      },
      {
        "comment": "*********** formula ************************",
        "questionCode": "formulaC",
        "question": "Formula",
        "dataType": "CNE",
        "header": false,
        "answers": "formulaC",
        "codingInstructions": "Select one of the formulas from the list.",
        "skipLogic": {
          "conditions": [
            {
              "source": "headerC",
              "trigger": {
                "code": "false"
              }
            }
          ],
          "action": "show"
        },
        "answerCardinality": {
          "min": "0",
          "max": "1"
        }
      }
    ]
  }

};