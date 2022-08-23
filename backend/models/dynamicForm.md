### Example Dynamic Form
```js
const exampleForm = {
  "_id": "62fa97cec4276a09b69ee1ed",
  "name": "Form1",
  "formType": "client",
  "createdBy": ":userAccount_9",
  "formStructure": [
    {
      "stepName": "step1",
      "fields": [
        {
          "type": "characteristic",
          "id": "14",
          "name": "First Name",
          "description": "First name of a person",
          "implementation": {
            "_id": "13",
            "fieldType": {
              "_id": "89",
              "label": "Text Field",
              "type": "TextField"
            },
            "label": "First Name",
            "valueDataType": "xsd:string"
          }
        },
        {
          "type": "characteristic",
          "id": "15",
          "name": "Last Name",
          "description": "Last name of a person",
          "implementation": {
            "_id": "14",
            "fieldType": {
              "_id": "89",
              "label": "Text Field",
              "type": "TextField"
            },
            "label": "Last Name",
            "valueDataType": "xsd:string"
          }
        },
        {
          "type": "characteristic",
          "id": "16",
          "name": "Gender",
          "description": "Gender of a person",
          "implementation": {
            "_id": "15",
            "fieldType": {
              "_id": "96",
              "label": "Single Select",
              "type": "SingleSelectField"
            },
            "label": "Gender",
            "optionsFromClass": "cp:CL-Gender",
            "valueDataType": "owl:NamedIndividual"
          }
        },
        {
          "type": "characteristic",
          "id": "17",
          "name": "multi",
          "description": "multi",
          "implementation": {
            "_id": "16",
            "fieldType": {
              "_id": "95",
              "label": "Multiple Select",
              "type": "MultiSelectField"
            },
            "label": "multi",
            "multipleValues": true,
            "optionsFromClass": "cp:CL-Gender",
            "valueDataType": "owl:NamedIndividual"
          }
        },
        {
          "type": "characteristic",
          "id": "18",
          "name": "Address",
          "description": "address",
          "implementation": {
            "_id": "17",
            "fieldType": {
              "_id": "99",
              "label": "Address Field",
              "type": "AddressField"
            },
            "label": "Address",
            "multipleValues": false,
            "valueDataType": "owl:NamedIndividual"
          }
        }
      ]
    }
  ],
  "modifiedAt": "2022-08-17T18:33:18.281Z"
}
```