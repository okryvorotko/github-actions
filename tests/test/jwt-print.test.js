const fs = require('fs');

describe("", function () {
    it("should print JWT", async function () {
        fs.writeFileSync("valueInFile", process.env.JWT);
        console.log(fs.readFileSync('valueInFile', "utf-8"));
    });
});