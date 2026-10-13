# Mastering GitHub Actions

A hands-on laboratory for learning GitHub Actions, from basic jobs to automated tests, containers, image publishing, and GitHub Releases.

The examples are independent exercises. Some simulate operations or deliberately demonstrate unsafe behavior; they are not production-ready pipelines. Branch protection, environments, and secrets are configured in GitHub and are not fully represented by the repository files.

## Quick start

1. Open the repository's **Actions** tab.
2. Select the workflow you want to explore.
3. If it defines `workflow_dispatch`, click **Run workflow** and complete its inputs.
4. Review the jobs, logs, **Summary** page, and **Artifacts** section.

Workflows with `workflow_call` are called by other workflows. `release-demo.yml` runs when a `v*` tag is pushed; it does not have a manual run button.

## Example index

### Structure, events, and execution control

| File | What it demonstrates |
|---|---|
| [01-building-blocks.yml](.github/workflows/01-building-blocks.yml) | Jobs, steps, and commands; push, PR, and manual triggers |
| [02-workflow-events.yaml](.github/workflows/02-workflow-events.yaml) | The event that triggered the run |
| [07-expressions.yaml](.github/workflows/07-expressions.yaml) | Contexts, expressions, and steps controlled by the `debug` input |
| [10-execution-flow.yml](.github/workflows/10-execution-flow.yml) | Job dependencies and simulated deployment |
| [14-execution-control.yml](.github/workflows/14-execution-control.yml) | `continue-on-error`, `outcome`, `conclusion`, cleanup, and timeouts |
| [15-job-control.yml](.github/workflows/15-job-control.yml) | `needs`, failure handling, and job results |
| [concurrency-demo.yml](.github/workflows/concurrency-demo.yml) | Grouping runs by resource and canceling an earlier run |

### Builds, artifacts, and caching

| File | What it demonstrates |
|---|---|
| [node-demo-ci.yml](.github/workflows/node-demo-ci.yml) | Dependency installation, Node.js tests and build, and transferring build output between jobs |
| [react-build.yml](.github/workflows/react-build.yml) | React build, artifact upload, and simulated deployment |
| [13-caching.yml](.github/workflows/13-caching.yml) | npm caching and a React build |
| [artifacts-demo.yml](.github/workflows/artifacts-demo.yml) | The initial report generation and transfer example |
| [artifacts-demo2.yml](.github/workflows/artifacts-demo2.yml) | Uploading and downloading the `raport-test` artifact |
| [list-artifacts.yml](.github/workflows/list-artifacts.yml) | Listing repository artifacts, including artifact IDs and run IDs |
| [read-artifact.yml](.github/workflows/read-artifact.yml) | Downloading `raport-test` from a run specified by `source_run_id` |
| [cache-demo.yml](.github/workflows/cache-demo.yml) | Cache keys, `restore-keys`, and `cache-hit` |

Use `artifacts-demo2.yml` for the report transfer exercise. The Node/React build workflows require the application directories and dependency files specified in their YAML files.

### Environments, permissions, and security

| File | What it demonstrates |
|---|---|
| [environments-demo.yml](.github/workflows/environments-demo.yml) | Staging → production, environment variables, and environment secrets |
| [permissions-demo.yml](.github/workflows/permissions-demo.yml) | `issues: write`; actually creates a practice issue |
| [input-demo.yml](.github/workflows/input-demo.yml) | Unsafe script interpolation compared with passing input through `env` |
| [lint-workflows.yml](.github/workflows/lint-workflows.yml) | Workflow validation with actionlint |
| [CODEOWNERS](.github/CODEOWNERS) | Ownership of workflow files and CODEOWNERS itself |

`input-demo.yml` deliberately includes an unsafe step. Do not reuse that step as a pattern for handling untrusted inputs.

### Reusable workflows and composite actions

| File | What it demonstrates |
|---|---|
| [call-greeting.yml](.github/workflows/call-greeting.yml) | Calling a reusable workflow with an input, a secret, and an output |
| [reusable-greeting.yml](.github/workflows/reusable-greeting.yml) | The `workflow_call` interface: inputs, secrets, and outputs |
| [call-hello.yml](.github/workflows/call-hello.yml) | Calling the same reusable workflow twice |
| [reusable-hello.yml](.github/workflows/reusable-hello.yml) | Generating and returning a greeting |
| [composite-demo.yml](.github/workflows/composite-demo.yml) | Calling a local action and reading its output |
| [greeting/action.yml](.github/actions/greeting/action.yml) | A composite action with inputs, an output, and an explicitly supplied token |

### Containers, reports, tests, and releases

| File | What it demonstrates |
|---|---|
| [services-demo.yml](.github/workflows/services-demo.yml) | A client in the job container and a PostgreSQL server in a service container |
| [Dockerfile](.github/images/ci-tools/Dockerfile) | An image containing Python 3.12, Git, and curl |
| [publish-image.yml](.github/workflows/publish-image.yml) | Building and publishing to GHCR with `packages: write` |
| [use-ci-image.yml](.github/workflows/use-ci-image.yml) | Reusing `ghcr.io/donaldcarol/ci-tools:1.0` |
| [summary-demo.yml](.github/workflows/summary-demo.yml) | A Markdown report based on a step's outcome |
| [tests-demo.yml](.github/workflows/tests-demo.yml) | Python tests, logs, an artifact, and a summary, including when tests fail |
| [release-demo.yml](.github/workflows/release-demo.yml) | Running tests before publishing a release, only on success |
| [calculator.py](calculator.py), [test_calculator.py](test_calculator.py) | An addition function and its `unittest` tests |

## Key concepts

### Workflows, jobs, and steps

- **Workflow**: a YAML file in `.github/workflows` defining triggers and jobs.
- **Job**: a group of steps executed on a runner. Jobs can run in parallel when they have no dependencies.
- **Step**: a `run` command or an action called with `uses`.
- **`needs`**: refers to jobs, not steps. Their order in YAML does not determine execution order.
- **`id`**: identifies a step for references such as `steps.generate.outputs.message`.

By default, a job with `needs` requires its dependencies to succeed. A failed or skipped job can cause dependent jobs to be skipped; explicit conditions can change this behavior.

### Inputs, outputs, and secrets

| Expression | Meaning |
|---|---|
| `inputs.person` | A supplied input value |
| `steps.greeting.outputs.message` | Output from a step in the same job |
| `needs.call-greeting.outputs.message` | Output from a job listed in `needs` |
| `secrets.DEMO_TOKEN` | A secret available to the run under the applicable access rules |
| `vars.APP_URL` | A configuration variable |

A reusable workflow exposes values through **step output → job output → workflow output**.

A composite action groups **steps**, while a reusable workflow can define **jobs**. A local call such as `uses: ./.github/actions/greeting` points to a directory: GitHub automatically looks for `action.yml` or `action.yaml` inside it. Checkout must run before calling the local action.

In the composite example, the secret is supplied explicitly:

```yaml
with:
  person: Donald
  demo-token: ${{ secrets.DEMO_TOKEN }}
```

A secret is not automatically passed to the action just because it exists in the repository. Pull requests from forks do not normally receive repository secrets.

### Artifacts, cache, summaries, registries, and releases

| Mechanism | Purpose |
|---|---|
| **Artifact** | Stores files produced by a run for download or transfer to another job |
| **Cache** | Speeds up runs by reusing dependencies or other files |
| **Job summary** | Displays Markdown written to the file identified by `$GITHUB_STEP_SUMMARY` |
| **Container registry** | Stores Docker images, for example GHCR or ACR |
| **GitHub Release** | Publishes a version associated with a tag, with notes and optional files |

A cache does not replace an artifact. A saved cache cannot be overwritten for the same key, scope, and cache version; changing the key allows a new entry. `cache-hit: true` indicates an exact match, not just restoration through a fallback key.

The summary is not a shared file across workflows. To reuse a report in another run, save it separately and upload it as an artifact.

### Containers in GitHub Actions

| Configuration | Where the client runs | Service connection |
|---|---|---|
| `services` only | Directly on the runner | `localhost` and a published port |
| `container` + `services` | In the job container | The service name, such as `postgres:5432` |

The mapping `5433:5432` means **port 5433 on the runner → port 5432 in the container**. `localhost` refers to the environment where the process runs: the runner or the job container.

The runner hosts the containers. Service containers belong to a single job and are removed when it ends. Each run creates new containers; their files and data are not automatically retained.

`postgres:17` uses Docker Hub by default. `ghcr.io/donaldcarol/ci-tools:1.0` specifies GHCR. Image tags can be moved; a digest identifies the exact image content.

## Exercise setup

### Secrets and environments

- **Repository secret `DEMO_TOKEN`**: required by `call-greeting.yml` and `composite-demo.yml`. Use a dummy value for the lab.
- **Environments `staging` and `production`**: each needs the `APP_URL` variable and `DEPLOY_TOKEN` secret.
- Configure environment approvals and branch restrictions in **Settings → Environments**.
- `GITHUB_TOKEN` is supplied automatically. Image publishing and release creation use this token with the permissions declared in the workflow.

Do not store real secret values in the repository, artifacts, caches, or reports.

### Token permissions

| Permission | Lab example |
|---|---|
| `contents: read` | Checking out the code |
| `contents: write` | Creating a release and attaching a file |
| `issues: write` | Creating an issue |
| `actions: read` | Listing and downloading artifacts from other runs |
| `packages: write` | Publishing the image to GHCR |

`permissions: {}` grants no additional configurable token permissions. Grant write permissions only to jobs that need them.

### The CI image

The [image publishing workflow](.github/workflows/publish-image.yml) builds the Dockerfile and publishes:

```text
ghcr.io/donaldcarol/ci-tools:1.0
```

The image must be available before running the examples that use it. It is public in this lab. When working in a fork, adjust the image name to your own account and configure access if the image is private.

Running the publishing workflow again can update the `1.0` tag. For reproducible versions, use distinct tags and/or digests.

## Tests and reports

From the repository root, with Python installed:

```powershell
python -m unittest -v test_calculator
```

The [Python test workflow](.github/workflows/tests-demo.yml) produces:

- the full test log;
- a summary containing the test step's outcome;
- the `raport-teste` artifact containing `tests.txt`, retained for 7 days.

The reporting steps use `if: always()` so they run even after tests fail. Successful reporting does not cancel the job's failure.

The failure exercise temporarily replaces `return a + b` with `return a - b` without changing the tests. Restore addition after checking the results.

## Tags and releases

The flow in `release-demo.yml` is:

```text
Push tag v* → tests → publish-release
               ↓ failure
        publishing is skipped
```

1. Save your changes, commit, and push the branch you are working on.
2. Create a new tag on the current commit.
3. Push the tag to trigger the workflow.

```powershell
# Example: choose a new, unused version.
git tag -a v1.0.4 -m "Practice release"
git push origin v1.0.4
```

If the tests pass, the workflow creates a release and attaches `version.txt`. GitHub also automatically provides ZIP and TAR.GZ archives of the source code at the tag.

If tests fail, the tag remains in GitHub, but `publish-release` is skipped and no release is created. A later commit on `main` does not move the tag. Rerunning a workflow uses the same code version; create a new version to test corrected code.

A release does not merge code or deploy it. This example does not handle creating a release again for a tag that already has one.

## Git: working locally

```powershell
git status
git switch main
git pull --ff-only origin main
git switch -c update-documentation

# After editing:
git diff
git add README.md
git commit -m "Update documentation"
git push -u origin update-documentation
```

Then open a PR targeting `main`, review the changes and workflow results, and merge it. Subsequent pushes to the same branch update the open PR; you do not need a new PR for every commit.

After merging:

```powershell
git switch main
git pull --ff-only origin main
```

During the lab, we also worked directly on `main` to simplify the exercises after adjusting the repository rules. In a team project, branches, PRs, and required checks control how changes are integrated.

## Security lessons

- Give `GITHUB_TOKEN` the minimum required permissions.
- Pass inputs to scripts through `env` and quote variables; avoid interpolating untrusted data directly into shell code.
- Pin external actions to full commit SHAs when you need to control the exact code executed. Older examples also contain tag references.
- Do not execute untrusted PR code in the privileged context of `pull_request_target`.
- A digest establishes content identity/integrity; it does not guarantee that the content is safe.
- Do not treat caches or artifacts from untrusted sources as trusted executable code in a privileged job.
- Self-hosted runners may retain changes, processes, and network access between runs; isolation matters.
- CODEOWNERS identifies responsible reviewers. Mandatory approval must be configured separately through branch rules.

We also covered matrices, `include`/`exclude`, `fail-fast`, `max-parallel`, dynamic matrices, and cache poisoning risks. Not every lesson has a dedicated workflow in the current repository.

## Next practical project

Integrate GitHub Actions with Azure, including Azure Landing Zone elements:

- infrastructure as code using Bicep or Terraform;
- OIDC authentication without a long-lived login secret;
- resource groups, naming conventions, and tags;
- governance through Azure Policy and access control through RBAC;
- a VNet and subnets;
- monitoring through Log Analytics;
- validation, a preview of proposed changes, and approval before deployment.

These are objectives for the next project, not resources already implemented in this repository.
