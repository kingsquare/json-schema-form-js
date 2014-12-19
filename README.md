Generate plain HTML forms based on JSON schema descriptions
 
Example use
 
```

var generator = require('kingsquare-schema-form');
var jsonSchema = { "my": "schema" };
document.write(generator.render(jsonSchema));

```

Supported "non-standard" JSON schema properties

```
{
	"label": "" // Overloaded label in form in favor of property title
	"enumTitles": ['a', 'b', 'c'] // Titles for enum values
	"inputType" // type of input, e.g. html5 email-type
}

```