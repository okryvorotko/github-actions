describe('Print branch', function () {
	it('@printBranch should print branch', async function () {
		const headref = process.env.HEAD_REF;
		const baseref = process.env.BASE_REF;
		const ref = process.env.REF;
		const refname = process.env.REF_NAME;
		console.log(`headref: ${headref}`);
		console.log(`baseref: ${baseref}`);
		console.log(`ref: ${ref}`);
		console.log(`refname: ${refname}`);
	});
});
