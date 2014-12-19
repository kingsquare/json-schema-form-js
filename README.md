Generate plain HTML forms based on JSON schema descriptions
 
Example use
 
```

var generator = require('kingsquare-schema-form');
var jsonSchema = { "my": "schema" };
document.write(generator.render(jsonSchema));

```