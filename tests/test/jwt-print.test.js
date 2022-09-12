const fs = require("fs");
const execSync = require("child_process").execSync;

describe("", function () {
    it("should print JWT", async function () {
        fs.writeFileSync("valueInFile", process.env.JWT);

        console.log(execSync("cat valueInFile", {encoding: "utf-8"}));
    });
});