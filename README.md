Strongly Opinionated Tools to work with plain and simple HTML forms based on JSON schema descriptions.
 
* Generate HTML forms based on the schema
* Have simple 1-way databinding to make changes in the form reflect in a simple Backbone Model
* Show errors in your form easilly, based on validation results.

Requirements:
* JQuery
* Backbone
* JJV

Generate Forms
==============
 
Example use
 
```

var jsonSchemaForm = require('json-schema-form-js');
var jsonSchema = {
	"title": "User",
	"properties": [
		{
			"title": "gender",
			"description": "",
			"type": "string",
			"label": "Geslacht",
			"enum": [
				"M",
				"F",
				""
			],
			"enumTitles": [
				"Man",
				"Vrouw",
				""
			]
		},
		{
			"title": "firstName",
			"description": "",
			"type": "string",
			"label": "Voornaam"
		}
	]
}

document.write(jsonSchemaForm.render(jsonSchema));

```

List of supported "non-standard" JSON schema properties:


```
{
	"label": "" // Overloaded label in form in favor of property title
	"enumTitles": ['a', 'b', 'c'] // Titles for enum values
	"inputType" // type of input, e.g. html5 email-type
}

```

Simple Databinding
==================

Optional, there is a 1-way, simple data binding to work with the generated form for Backbone models. Usage in Views:

```
var jsonSchemaForm = require('json-schema-form-js');

return Backbone.View.extend({
	events: {
		'change :input': 'updateModel',
	},

	updateModel: function (e) {
		jsonSchemaForm.assignValueByInput(this.model, $(e.currentTarget));
	}
});

```

Reflect validation results in HTML
==================================

Errors in user data can be validated using e.g. [jjv](https://github.com/acornejo/jjv) . Any errors may be highlighted
in the form using jsonSchemaForm with some jquery magic. (don't forget to style ``` .error ``` via CSS)
  
```
var jsonSchemaForm = require('json-schema-form-js');
$('form').find(':input').each(function () {
	jsonSchemaForm.toggleErrorClass($(this).prop('name'), errors.validation);
});

```