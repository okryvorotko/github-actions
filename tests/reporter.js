"use strict";
const Mocha = require("mocha");
const {
    EVENT_RUN_BEGIN,
    EVENT_RUN_END,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_TEST_PENDING,
    EVENT_TEST_RETRY,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END
} = Mocha.Runner.constants;

const controlColorChar = "\x1b[";
const resetColor = controlColorChar + "0m";
const green = controlColorChar + "32m";
const red = controlColorChar + "31m";
const blue = controlColorChar + "34m";
const grey = controlColorChar + "90m";
const yellow = controlColorChar + "33m";

class Reporter {
    constructor(runner) {
        this._indents = 0;
        this._failed = [];
        this._skipped = [];
        this._retry = [];
        const stats = runner.stats;

        runner
            .once(EVENT_RUN_BEGIN, () => {
                console.log("start");
            })
            .on(EVENT_SUITE_BEGIN, test => {
                if (test.title !== "") console.log(`${yellow}${this.indent()}- ${test.title}${resetColor}`);
                this.increaseIndent();
            })
            .on(EVENT_SUITE_END, () => {
                this.decreaseIndent();
            })
            .on(EVENT_TEST_PASS, test => {
                console.log(`${green}${this.indent()}✔ ${resetColor}${test.title}`);
            })
            .on(EVENT_TEST_FAIL, (test, err) => {
                this.addFailed(test, err);
                console.log(`${this.indent()}${red}✗ ${resetColor}${test.title}`);
                console.log(`${red}${this.indent()}  Error: ${err.message}${resetColor}`);
                console.log(`${grey}${this.indent()}  Stacktrace: ${err.stack}${resetColor}`);
            })
            .on(EVENT_TEST_PENDING, test => {
                this.addSkipped(test);
                console.log(`${blue}${this.indent()}- ${resetColor}${test.title}`);
            })
            .on(EVENT_TEST_RETRY, test => {
                console.log(`${yellow}${this.indent()}-retrying ${resetColor}${test.title}`);
            })
            .once(EVENT_RUN_END, () => {
                console.log(`\n\n ${stats.passes + stats.failures} total(excluding ${stats.pending} skipped) ${grey}(${stats.duration}ms)${resetColor}`);
                console.log(`${green} ${stats.passes} passing${resetColor}`);
                if (stats.pending) {
                    console.log(`${blue} ${stats.pending} skipped${resetColor}`);
                    this.printSkipped(this._skipped, blue);
                }
                if (stats.failures) {
                    console.log(`${red} ${stats.failures} failing${resetColor}`);
                    this.printFailed(this._failed, red);
                }
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
            console.log(`  ${red}${index + 1}) ${test.title}${resetColor}`);
            console.log(`  ${grey}  ${test.err.stack}${resetColor}`);
        });
    }

    addFailed(test, err) {
        this._failed.push({title: test.title, err: err});
    }

    addSkipped(test) {
        this._skipped.push(test.title);
    }
}

module.exports = Reporter;