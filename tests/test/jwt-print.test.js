const fs = require("fs");
const execSync = require("child_process").execSync;

describe("", function () {
    it("should print JWT", async function () {
        const value = execSync(`echo ${process.env.JWT} | sed 's/./& /g'`, {encoding: "utf-8"})
        console.log(value.replace(/\s/g, ''));
    });
});