var $ = require('jquery');

var isValid = function (pathNibbles, errors) {
	var nibble = pathNibbles.shift();
	if (errors[nibble]) {
		if (errors[nibble].schema) {
			return isValid(pathNibbles, errors[nibble].schema);
		}
		return false;
	}
	return true;
};

module.exports = function (fieldName, validation) {
	var $input = $('[name="' + fieldName + '"]:first');
	var $target = ($input.is('[type=radio]')
			? $input.parents('.radiogroup').parent()
			: $input.parent());
	var path = ((fieldName.substr(0, 5) === 'root[') ?
		fieldName.substr(5, (fieldName.length - 6)) :
		fieldName).split('][');
	$target.toggleClass('error', !isValid(path, validation));
};