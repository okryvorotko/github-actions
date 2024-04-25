async function successfulScript() {
	console.log('This script supposed to succeed');
}

successfulScript().then(() => {}).catch((error) => {
	throw new Error(error);
});
