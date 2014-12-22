var render = require('./lib/render.js');

module.exports = {
	render: render.renderForm,
	renderChunk: render.renderChunk,
	assignValueByInput: require('./lib/assignValueByInput.js')
};