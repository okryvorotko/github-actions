describe('Print branch', function () {
	it('@printBranch should print branch', async function () {
		const testsBranchName = process.env.TESTS_BRANCH;
		const testsBranchOnPrName = process.env.TESTS_BRANCH_ON_PR;

		console.log(getBranch({ branch: testsBranchName, branchOnPr: testsBranchOnPrName}));
	});

	function getBranch({ branch, branchOnPr }) {
		if (branch.includes('merge')) return branchOnPr;
		else return branch;
	}
});
