# GitHub Actions Examples

A small, runnable collection of GitHub Actions experiments. The repository shows
how to pass values between steps, jobs, and reusable workflows; inspect GitHub
contexts; handle failures; use manual inputs; and retry commands.

> [!NOTE]
> This is a learning and reference repository, not a production CI pipeline.
> Several workflows fail or skip steps on purpose so their behavior is visible in
> the Actions log.

## What is included

| Workflow | Trigger | Demonstrates |
| --- | --- | --- |
| `Caller1` / `Caller2` | Manual | Calling a reusable workflow, passing job outputs into it, and returning an output to a follow-up job |
| `Reusable` | Called by another workflow | Typed workflow inputs and workflow/job/step outputs |
| `Conditional step` | Manual | Running a final step after an earlier failure, controlled by a boolean input |
| `Contexts` / `Print branch` | Manual | Reading branch and ref values from the `github` context |
| `Check if file exists` | Manual | Checking for files and writing values to `GITHUB_ENV` |
| `Notify if certain step failed` | Manual | Combining failure state and environment flags in an `if` expression |
| `Pass variables between steps` | Push to `pass-variables-between-steps` | Sharing status through `GITHUB_ENV` and using fallback expressions |
| `Print inputs` | Manual | String, boolean, and choice inputs from `workflow_dispatch` |
| `Print secrets` | Manual | Referencing repository secrets and variables; intended only as a masking experiment |
| `Run commands with errors` | Manual | Allowing an individual shell command to fail with `|| true` |
| `Contexts` (`runOnReview.yml`) | Manual or PR marked ready for review | Reacting to the `ready_for_review` pull-request event |
| `Skip step based on input` | Manual | Conditionally running a step from a dispatch input |
| `Skip tests` | Manual | Combining workflow inputs and job-level environment variables |
| `Skip tests if failure` | Every 5 minutes or manual | Running a notification-style step only after failure |
| `Run two scripts` | Manual | Retrying a command and stopping an `&&` command chain after failure |

The workflow definitions live in [`.github/workflows`](.github/workflows).

## Reusable workflow data flow

`callReusable1.yml` and `callReusable2.yml` use the same three-stage pattern:

```text
preparations job
  creates FROM_CALLER_TO_REUSABLE
             |
             v
reusable.yml
  runs the requested npm command
  creates FROM_REUSABLE_TO_CALLER
             |
             v
post job
  reads the returned value and runs the post test
```

This demonstrates the distinction between:

- `$GITHUB_ENV`, which makes a value available to later steps in the same job.
- `$GITHUB_OUTPUT`, which exposes a step output that can be promoted to a job or
  reusable-workflow output.
- `env`, which maps context values and workflow inputs into a process environment.

## Requirements

- Node.js 14 or newer
- npm
- A GitHub repository with Actions enabled to run the workflow examples

## Run locally

Install the dependencies:

```bash
npm install
```

Run all Mocha examples:

```bash
npm run all
```

Run selected examples:

```bash
npm run printBranch
npm run postTests
npx mocha --grep @reusable1
npx mocha --grep @reusable2
```

The tests read the same environment variables that the workflows provide. For
example, on a POSIX-compatible shell:

```bash
HEAD_REF=feature/example \
BASE_REF=main \
REF=refs/heads/feature/example \
REF_NAME=feature/example \
npm run printBranch
```

## Run on GitHub

Most examples use `workflow_dispatch`, so they can be started from the repository's
**Actions** tab:

1. Open **Actions**.
2. Select a workflow from the left sidebar.
3. Select **Run workflow**.
4. Choose the branch and provide any requested inputs.

You can also use the GitHub CLI. For example:

```bash
gh workflow run printInputs.yml \
  -f input1=example \
  -f input2=true \
  -f input3=choice1

gh workflow run callReusable1.yml
```

## Repository layout

```text
.
|-- .github/workflows/       # GitHub Actions examples
|-- configs/config.js        # dotenv-backed configuration helper
|-- data/users.js            # Sample test data and lookup helpers
|-- scripts/
|   |-- failingScript.js     # Always exits with an error
|   `-- successfulScript.js  # Always succeeds
|-- test/                    # Mocha examples used by the workflows
|-- package.json             # Dependencies and runnable commands
`-- README.md
```

## Expected failures and caveats

- `Conditional step` deliberately exits with code `127`. Its final step can still
  run, but the job remains failed.
- `Run two scripts` retries `failingScript.js` three times. Because the commands
  use `&&`, `successfulScript.js` is not reached and the job fails.
- `Pass variables between steps` deliberately fails in its second step.
- `Run commands with errors` succeeds because the invalid command is followed by
  `|| true`.
- `Skip tests if failure` is scheduled every five minutes. Its step named
  `Failing step` currently succeeds, so the failure-only step is skipped.
- Scripts that specify `--reporter reporter.js` expect a custom reporter file,
  which is not currently included in the repository.
- `printSecrets.yml` is only a masking demonstration. Do not print, transform, or
  expose secrets in real workflows. GitHub masking should not be treated as a
  substitute for keeping secret values out of logs.

## Configuration used by the examples

The reusable workflow accepts these inputs:

| Input | Purpose |
| --- | --- |
| `command` | npm command executed by the reusable workflow |
| `someInput` | Example value exposed to the process environment |
| `FROM_CALLER_TO_REUSABLE` | Value produced by the caller's preparation job |

It returns `FROM_REUSABLE_TO_CALLER`, which the caller makes available to the
`postTests` command.

`configs/config.js` also supports a local `someInput` environment variable through
`dotenv`. If you create local environment files, keep them out of version control
and never commit credentials.
