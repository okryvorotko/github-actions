const execSync = require("child_process").execSync;

describe("Pass/fail/skip tests @include", function () {
    it("should pass", async function () {
    });

    let flag = 1;
    it("should retry and pass @todo", async function () {
        this.retries(5);
        try {
            if (flag !== 3) throw Error("First try error");
        } catch (e) {
            flag++;
            throw Error(e);
        }
    });

    it("should fail test", async function () {
        throw Error("Error message");
    });

    it("should fail another test", async function () {
        throw Error("Error message 2");
    });

    it("should write to file", async function () {
        const fs = require('fs');
        fs.writeFileSync("testrail_run_url", "https://trackerdetect.testrail.io/index.php?/runs/view/1074");
    });

    it.skip("should skip test", async function () {
        throw Error("Should be skipped");
    });

    it.skip("should skip another test", async function () {
        throw Error("Should be skipped");
    });
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}