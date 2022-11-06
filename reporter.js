"use strict";
const Mocha = require("mocha");
const config = require("./configs/config")

const {
    EVENT_RUN_BEGIN,
    EVENT_RUN_END,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_TEST_PENDING,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END
} = Mocha.Runner.constants;

const controlColorChar = "\x1b[";
const resetColor = controlColorChar + "0m";
const green = controlColorChar + "32m";
const red = controlColorChar + "31m";
const blue = controlColorChar + "34m";
const grey = controlColorChar + "90m";
const yellow = controlColorChar + "93m";

class Reporter {
    constructor(runner) {
        this._indents = 0;
        this._failed = [];
        this._skipped = [];
        const stats = runner.stats;

        runner
            .once(EVENT_RUN_BEGIN, async () => {
                console.log(`config: ${JSON.stringify(config, null, 2)}`);
            })
            .on(EVENT_SUITE_BEGIN, test => {
                if (normalizeTitle(test.title) !== "") console.log(`${yellow}${this.indent()}- ${normalizeTitle(test.title)}${resetColor}`);
                this.increaseIndent();
            })
            .on(EVENT_SUITE_END, () => {
                this.decreaseIndent();
            })
            .on(EVENT_TEST_PASS, async test => {
                console.log(`${green}${this.indent()}✔ ${resetColor}${normalizeTitle(test.title)}`);
                const caseTitle = normalizeTitle(test.title); // Weird behavior here. If I don't add title variable this.test object will disappear from this on the next line
                if (!test.stepsAdded) {
                }
            })
            .on(EVENT_TEST_FAIL, async (test, err) => {
                this.addFailed(test, err);
                console.log(`${this.indent()}${red}✗ ${resetColor}${normalizeTitle(test.title)}`);
                console.log(`${red}${this.indent()} Stacktrace: ${err.stack}${resetColor}`);

                // If test is not updated with TestRail properties and steps - mark the whole test case as failed with comment
                if (!test.stepsAdded) {
                    // Weird behavior here. If I don't add title and error to variables this.test object will disappear from this on the next line
                    const caseTitle = normalizeTitle(test.title);
                    const caseErr = test.err.stack;

                }
                // For tests with steps fail is caught on step execution
            })
            .on(EVENT_TEST_PENDING, async test => {
                this.addSkipped(test);
                console.log(`${blue}${this.indent()}- ${resetColor}${normalizeTitle(test.title)}`);
            })
            .once(EVENT_RUN_END, async () => {
                console.log(`\n\n ${stats.passes + stats.failures} total ${grey}(${stats.duration}ms)${resetColor}`);
                console.log(`${green} ${stats.passes} passing${resetColor}`);
                if (stats.pending) {
                    console.log(`${blue} ${stats.pending} skipped${resetColor}`);
                    this.printSkipped(this._skipped, blue);
                }
                if (stats.failures) {
                    console.log(`${red} ${stats.failures} failing${resetColor}`);
                    this.printFailed(this._failed, red);
                }

                await closeTestRun();
                console.log("Tests execution completed.");
            });
    }

    indent() {
        return Array(this._indents).join("  ");
    }

    increaseIndent() {
        this._indents++;
    }

    decreaseIndent() {
        this._indents--;
    }

    printSkipped(tests) {
        tests.forEach(test => {
            console.log(`  ${blue}- ${test}${resetColor}`);
        });
    }

    printFailed(tests) {
        tests.forEach((test, index) => {
            console.log(`  ${red}${index + 1}) ${normalizeTitle(test.title)}${resetColor}`);
            console.log(`  ${grey}  ${test.err.stack}${resetColor}`);
        });
    }

    addFailed(test, err) {
        this._failed.push({title: normalizeTitle(test.title), err: err});
    }

    addSkipped(test) {
        this._skipped.push(normalizeTitle(test.title));
    }
}

function normalizeTitle(title) {
    return title.replace(/@(.*?)(?=\s|$)/g, "").replace(/^\s+|\s+$/g, "");
}

module.exports = Reporter;