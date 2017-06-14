/**
 * Created by akanduru on 2/24/16.
 */
var helper = {
  item: {
    "comment": "*********** header ************************",
    "question": "Section",
    "questionCode": "headerC",
    "questionCodeSystem": "LOINC",
    "answerCodeSystem": "LOINC",
    "dataType": "CNE",
    "header": false,
    "answers": null,
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

  templateOptions: {
    "obxTableColumns": [
      {
        "name": "Name",
        "displayControl": {
          "colCSS": [{
            "width": "50%",
            "minWidth": "4em"
          }]
        }
      },
      {
        "name": "",
        "displayControl": {
          "colCSS": [{
            "width": "5em",
            "minWidth": "5em"
          }]
        }
      },
      {
        "name": "Value",
        "displayControl": {
          "colCSS": [{
            "width": "50%",
            "minWidth": "4em"
          }]
        }
      }
    ],
    "obrHeader": false,
    "hideHeader": true
  },

  // A full fledged form
  glasgow: {
    "type": "LOINC",
    "code": "35088-4B",
    "name": "Glasgow coma scale (with score rules)",
    "dataType": null,
    "template":"table",
    "header": true,
    "units": null,
    "codingInstructions": "The Glasgow Coma Scale is a neurological scale for assessing a person's level of consciousness, both for initial as well as continuing assessment. A patient is assessed against the criteria of the scale, and the resulting points give the Glasgow Coma Score (or GCS).",
    "copyrightNotice": null,
    "items": [
      {"questionCode": "9267-6", "localQuestionCode": null, "dataType": "CNE", "header": false, "units": null, "codingInstructions": null, "copyrightNotice": null, "questionCardinality": null, "answerCardinality": null, "question": "GCS eye", "answers": [
        {"label": "1", "code": "LA6553-7", "text": "No eye opening", "score": 1, "other": null},
        {"label": "2", "code": "LA6554-5", "text": "Eye opening to pain", "score": 2, "other": null},
        {"label": "3", "code": "LA6555-2", "text": "Eye opening to verbal command", "score": 3, "other": null},
        {"label": "4", "code": "LA6556-0", "text": "Eyes open spontaneously", "score": 4, "other": null}
      ], "skipLogic": null, "restrictions": null, "editable": null, "defaultAnswer": null, "calculationMethod": null, "items": null},
      {"questionCode": "9268-4", "localQuestionCode": null, "dataType": "CNE", "header": false, "units": null, "codingInstructions": null, "copyrightNotice": null, "questionCardinality": null, "answerCardinality": null, "question": "GCS motor", "answers": [
        {"label": "1", "code": "LA6562-8", "text": "No motor response", "score": 1, "other": null},
        {"label": "2", "code": "LA6563-6", "text": "Extension to pain", "score": 2, "other": null},
        {"label": "3", "code": "LA6564-4", "text": "Flexion to pain", "score": 3, "other": null},
        {"label": "4", "code": "LA6565-1", "text": "Withdrawl from pain", "score": 4, "other": null},
        {"label": "5", "code": "LA6566-9", "text": "Localizing pain", "score": 5, "other": null},
        {"label": "6", "code": "LA6567-7", "text": "Obeys commands", "score": 6, "other": null}
      ], "skipLogic": null, "restrictions": null, "editable": null, "defaultAnswer": null, "calculationMethod": null, "items": null},
      {"questionCode": "9270-0", "localQuestionCode": null, "dataType": "CNE", "header": false, "units": null, "codingInstructions": null, "copyrightNotice": null, "questionCardinality": null, "answerCardinality": null, "question": "GCS verbal", "answers": [
        {"label": "1", "code": "LA6557-8", "text": "No verbal response (>2 yrs); no vocal response (<=2 yrs)", "score": 1, "other": null},
        {"label": "2", "code": "LA6558-6", "text": "Incomprehensible sounds", "score": 2, "other": null},
        {"label": "3", "code": "LA6559-4", "text": "Inappropriate words", "score": 3, "other": null},
        {"label": "4", "code": "LA6560-2", "text": "Confused", "score": 4, "other": null},
        {"label": "5", "code": "LA6561-0", "text": "Oriented", "score": 5, "other": null}
      ], "skipLogic": null, "restrictions": null, "editable": null, "defaultAnswer": null, "calculationMethod": null, "items": null},
      {"questionCode": "9269-2", "localQuestionCode": null, "dataType": null, "header": false, "units": [
        {"name": "{score}", "default": false, "normalRange": null, "absoluteRange": null}
      ], "codingInstructions": null, "copyrightNotice": null, "questionCardinality": null, "answerCardinality": null, "question": "GCS total", "answers": null, "skipLogic": null, "restrictions": null, "editable": null, "defaultAnswer": null, "calculationMethod": {"name": "TOTALSCORE", "value":[]}, "items": null}
    ]
  }
};

if (typeof require !== 'undefined' && require.main !== module) { // i.e. if it was required
  module.exports = helper;
}

