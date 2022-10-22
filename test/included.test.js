const execSync = require("child_process").execSync;
const users = require("../data/users");
const {getSignupUser} = require("../data/users");

describe("Pass/fail/skip tests @include", function () {
    it("should pass", async function () {
        console.log(`'${normalizeTitle("  @dsfdsds sdfdsfdsf sdfdsfds @sdfsdf @@    ")}'`);
    });

    function normalizeTitle(title) {
        return title.replace(/@(.*?)(?=\s|$)/g, "").replace(/^\s+|\s+$/g, "");
    }

    let flag = 1;
    it("should retry and pass", async function () {
        this.retries(5);
        try {
            if (flag !== 3) throw Error("First try error");
        } catch (e) {
            flag++;
            throw Error(e);
        }
    });

    it("Generate random int", async function () {
        function randomInteger(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
        }

        console.log(randomInteger(10, 100));
    });

    it("Function arguments", async function () {
        function printNumbers(...numbers) {
            numbers.forEach(number => {
                console.log(`Number: ${number}`);
            });
        }

        printNumbers(1, 2, 3, 4, 5);
    });

    it("@todo Print object name", async function () {
        const analyst = getSignupUser("analyst");
        const admin = users.allUsers.admin;
        const viewer = users.getNameOfTheObject(users.allUsers.viewer)
        console.log(`users.nameOf: ${ users.nameOf(() => analyst) }`);
        console.log(`users.nameOf: ${ users.nameOf(() => admin) }`);
        console.log(`users.getNameOfTheObject: ${ viewer }`);
    });

    it("should fail test", async function () {
        let grepValues = "@todo|@connectors".split("|");
        let array = [];
        if (grepValues) {
            for (const grepValue of grepValues) {
                if ("@todo @connectors".includes(grepValue)) {
                    array.push("value");
                    break;
                }
            }
        }

        console.log(JSON.stringify(array));

        throw Error("Error message");
    });

    it("should fail another test", async function () {
        throw Error("Error message 2");
    });

    it("should write to file", async function () {
        const fs = require("fs");
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