async function failScript() {
	throw new Error('This script supposed to fail');
}

failScript().then(() => {}).catch((error) => {
	throw new Error(error);
});
