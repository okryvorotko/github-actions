const fs = require('fs');

describe("", function () {
    it("should print JWT", async function () {
        fs.writeFileSync("JWT", process.env.JWT);
        console.log(fs.readFileSync('JWT', "utf-8"));
    });
});