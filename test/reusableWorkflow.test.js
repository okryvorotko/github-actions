it('@reusable1 reusable workflow', async function () {
	console.log(`Shared variable: ${process.env.FROM_CALLER_TO_REUSABLE}`);
});

it('@reusable2 reusable2 workflow', async function () {
	console.log(`Shared variable: ${process.env.FROM_CALLER_TO_REUSABLE}`);
});
