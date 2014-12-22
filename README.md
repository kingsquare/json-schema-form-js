Generate plain and simple HTML forms based on JSON schema descriptions
 
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

Optional, there is a 1-way, simple data binding to work with the generated form for Backbone models. Usage in Views:

```

return Backbone.View.extend({
	events: {
		'change :input': 'updateModel',
	},

	updateModel: function (e) {
		jsonSchemaForm.assignValueByInput(this.model, $(e.currentTarget));
	}
});

```