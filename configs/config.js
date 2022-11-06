require('dotenv').config();
const someInput = process.env.someInput;

function config() {
	return {
		someInput
	}
}

module.exports = config();