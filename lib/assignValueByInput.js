'use strict';
var _ = require('underscore');
var $ = require('jquery');

module.exports = function (model, $input, modelPath) {
	var path = $input.prop('name').replace(/^[\[\]]+|[\[\]]+$/g, '').split(/[\[\]]+/g);
	if (path[0] === 'root') {
		path.shift();
	}
	if (modelPath && modelPath.length) {
		path = path.slice(modelPath.length);
	}
	var currentNibble = model;

	//typecasting / coercion is done via datatype data attributes, if available
	var value = ($input.is('[type="checkbox"]') ? $input.is(':checked') : $input.val());

	//strip whitespace and stuff
	if (_.isString(value)) {
		value = value.trim();
	}

	var parentWithDataTypeHint = $input.parents('[data-datatype]');
	if (parentWithDataTypeHint.length) {
		switch (parentWithDataTypeHint.data('datatype')) {
			case 'number':
				if (_.isString(value)) {
					value = parseFloat(value.replace(/[^\d\.-]/g, ''));
				}
				break;
			default: // @todo implement more? (bool, string and number are covered)
		}
	}

	$.each(path, function (key, nibble) {
		if ((path.length-1) === key) {
			if (currentNibble.set) {
				currentNibble.set(nibble, value);
			} else {
				//support for e.g. left- and right ribbons
				currentNibble[nibble] = value;
			}
			//model.trigger('change');
			return;
		}
		// at gives support for '0' in collections, e.g. item
		currentNibble = currentNibble[currentNibble.at ? 'at' : 'get'](nibble);
	});
};