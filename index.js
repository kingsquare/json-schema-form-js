var renderEnum = function (propConfig, path, value) {
	var chunk = [];
	path = path || [];
	var id = path.join('-');
	var name = 'root[' + path.join('][') + ']';
	if ((value === undefined) && (propConfig['default'] !== undefined)) {
		value = propConfig['default'];
	}
	var enumTitles = ((propConfig.options && propConfig.options.enum_titles) ?
		propConfig.options.enum_titles : {});

	switch(propConfig.inputType) {
		case 'radio':
			chunk.push('<div class="radiogroup">');
			propConfig['enum'].forEach(function (key, radioValue) {
				var radioId = id + '-' + radioValue;
				chunk.push('<div>');
				chunk.push('<input type="radio" name="' + name + '" value="' + radioValue +
				'" id="' + radioId + '"' + ((radioValue === value) ? ' checked="checked"' : '' ) +
				'><label for="' + radioId + ''+ '">' + (enumTitles[key] || radioValue) +
				'</label>');
				chunk.push('</div>');
			});
			chunk.push('</div>');
			break;

		default:
			chunk.push('<select name="' + name + '" id="' + id + '" class="radiogroup">');
			propConfig['enum'].forEach(function (optionValue, key) {
				chunk.push('<option value="' + optionValue +'"' +
				((optionValue === value) ? ' selected' : '' ) +
				'>' + (enumTitles[key] || optionValue) + '</option>');
			});
			chunk.push('</select>');
	}

	return chunk.join('');
};

var renderChunk = function (path, propConfig, value) {
	console.log(path);
	var propName = path.pop();
	var id = (path.length ? path.join('-') + '-' : '') + propName;
	var chunk = ['<div class="' + propName +'" data-datatype="' + propConfig.type + '">'];
	var subPath = path.slice(0);
	var name = 'root' + (path.length ? '[' + path.join('][')+ ']' : '') + '[' + propName + ']';
	var enumTitles = (propConfig.options && propConfig.options.enum_titles ?  propConfig.options.enum_titles : {});
	subPath.push(propName);

	if ((value === undefined) && (propConfig['default'] !== undefined)) {
		value = propConfig['default'];
	}
	var valueAsString = value || '';

	switch (propConfig.type) {
		case undefined: //complex type
		case 'object':
			chunk.push('<div class="fieldset">');
			if (propConfig.title) {
				chunk.push('<div class="legend">' + propConfig.title + '</div>');
			}

			chunk.push(renderForm(propConfig, subPath, value));
			chunk.push('</div>');
			break;

		case 'number':
		case 'integer':
			//check for "explicit empty"
			if (propConfig.title !== '') {
				chunk.push('<label for="' + id + '">' + (propConfig.title ? propConfig.title : propName)  +
				'</label>');
			}
			chunk.push((propConfig['enum'] === undefined) ?
				'<input type="' + (propConfig.inputType || 'number') + '" name="' + name + '" id="' + id +
				'" value="' + valueAsString+ '">' : renderEnum(propConfig, subPath, value)
			);
			break;

		case 'boolean':
			chunk.push('<input type="checkbox" name="' + name + '" id="' + id + '" value="1"' +
			(value ? ' checked="checked"' : '' ) + ' />');
			chunk.push('<label for="' + id + '">' + propConfig.title + '</label>');
			break;

		case 'array':
			if (propConfig.items.type === 'string') {
				if (propConfig.title) {
					chunk.push('<label for="' + id + '">' + propConfig.title + '</label>');
				}

				if (propConfig.format === 'select') {
					chunk.push('<select name="' + name + '" id="' + id +
					'" class="radiogroup" multiple="multiple">');
					propConfig.items.enum.forEach(function (key, optionValue) {
						chunk.push('<option value="' + optionValue +'"' +
						(_.contains(value, optionValue) ? ' selected' : '' ) +
						'>' + (enumTitles[key] || optionValue) + '</option>');
					});
					chunk.push('</select>');
				} else {
					chunk.push('<div class="checkboxgroup">');
					propConfig.items.enum.forEach(function (key, radioValue) {
						var radioId = id + '-' + radioValue;
						var value = value || [];
						chunk.push('<div>');
						chunk.push('<input type="checkbox" name="' + name + '[]" value="' + radioValue +
						'" id="' + radioId + '"' + ((value.indexOf(radioValue) >= 0) ? ' checked="checked"' : '' ) +
						'><label for="' + radioId + '' + '">' + (enumTitles[key] || radioValue) +
						'</label>');
						chunk.push('</div>');
					});
					chunk.push('</div>');
				}
			} else {
				chunk.push('<div class="fieldset">');
				if (propConfig.title) {
					chunk.push('<div class="legend">' + propConfig.title + '</div>');
				}

				value = value || {};
				for (var prop in value) {
					// important check that this is objects own property
					// not from prototype prop inherited
					if (value.hasOwnProperty(prop)) {
						var itemSubPath = subPath.slice(0);
						itemSubPath.push(key);
						chunk.push('<div class="item"><div class="counter">' + (key + 1) + '</div>');
						chunk.push(renderForm(propConfig.items, itemSubPath, subData));
						chunk.push('</div>');
					}
				}
				chunk.push('</div>');
			}
			break;

		case 'string':
			var isEnum = (propConfig['enum'] !== undefined);
			if (propConfig.title) {
				chunk.push('<label for="' + id + '">' + propConfig.title +
				(propConfig.minLength ? ' *' : '') + '</label>');
			}

			if (isEnum) {
				chunk.push(renderEnum(propConfig, subPath, value));
			} else {
				chunk.push((propConfig.options && propConfig.options.renderHint &&
					propConfig.options.renderHint === 'textarea') ?
					'<textarea type="text" name="' + name + '" id="' + id + '">' + valueAsString + '</textarea>' :
					'<input type="' + (propConfig.inputType || propConfig.format || 'text') + '" name="' +
					name + '" id="' + id + '" value="' + valueAsString + '" ' + (propConfig.description ?
					' placeholder="' +  propConfig.description + '"' : '') + '>'
				);
			}
			break;

		default:
			chunk.push('<label for="' + id + '">' + propConfig.title + '</label>');
			chunk.push('<input type="' + (propConfig.inputType || propConfig.format || 'text') +
			'" name="' + name + '" id="' + id + '" value="' + valueAsString + '">');
	}

	chunk.push('</div>');
	return chunk.join('');
};

/**
 *
 * @param {object} schema
 * @param {array} path
 * @param {object} data
 * @returns string
 */
var renderForm = function (schema, path, data) {
	var chunks = [];
	path = path || [];
	data = data || {};


	if (schema.properties === undefined) {
		if (schema.allOf) {
			$.each(schema.allOf, function (key, subSchema) {
				chunks.push(renderForm(subSchema, path, data));
			});
			return chunks.join('');
		}
		return chunks.join('');
	}

	Object.keys(schema.properties).forEach(function (propKey) {
		var propConfig = schema.properties[propKey];
		var propName = propConfig.title;
		path.slice(0);
		path.push(propName);
		chunks.push(renderChunk(path, propConfig, data[propName]));
	});
	return chunks.join('');
};

module.exports = {
	render: renderForm,
	renderChunk: renderChunk
};