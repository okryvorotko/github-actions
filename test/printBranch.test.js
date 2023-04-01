describe('Print branch', function () {
	it('@printBranch should print branch', async function () {
		const testsBranchName = process.env.TESTS_BRANCH;
		console.log(testsBranchName);
	});
});
