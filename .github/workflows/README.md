# Workflows

## CI Workflow (`ci.yml`)

### What it does

Runs two parallel validation jobs on every push and pull request — neither job deploys anything:

- **typecheck** — runs `tsc --noEmit` to ensure the entire codebase compiles with zero TypeScript errors.
- **lint** — runs ESLint over `src/` (`.ts` and `.tsx` files) with `--max-warnings 0`, so even warnings are treated as failures.

Both jobs must pass for the workflow to be considered successful.

### When it runs

| Event | Condition |
|---|---|
| `push` | Any branch |
| `pull_request` | Targeting `main` |

### Status badge

Add this to the top of your root `README.md`:

```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name. The badge turns green when the latest run on the default branch passes, and red when it fails.

### What to do if it fails

1. Click the failing workflow run in the **Actions** tab on GitHub.
2. Open the failing job (`typecheck` or `lint`) and expand the failed step to read the output.

**TypeScript failure** — the step output lists each error with a file path and line number. Fix the type errors locally, confirm `npx tsc --noEmit` exits cleanly, then push again.

**ESLint failure** — the step output lists every rule violation and warning. Fix them locally, confirm `npx eslint src --ext .ts,.tsx --max-warnings 0` exits with code 0, then push again. If a specific rule is intentionally violated, add an inline `// eslint-disable-next-line <rule>` comment with a short explanation, or update `.eslintrc` if the rule should be disabled project-wide.

---

## Deploy Workflow (`deploy.yml`)

### What it does

Runs three sequential jobs that gate each other — a failure at any stage stops the pipeline:

1. **ci** — re-runs type check and lint (same checks as `ci.yml`) to ensure nothing broken reaches production.
2. **build** — runs `npm run build` (Vite production build) and uploads the `dist/` folder as a GitHub Actions artifact named `dist-files`. This artifact is available for 90 days and can be downloaded from the workflow run page.
3. **deploy** — installs Vercel CLI, pulls the Vercel project environment, builds with Vercel's build system, then deploys the prebuilt output to production. The live URL is echoed at the end of the step log.

### When it runs

| Event | Condition |
|---|---|
| `push` | `main` branch only |

It does **not** run on pull requests or any other branch.

### Required secrets

Three secrets must be set in **GitHub → Settings → Secrets and variables → Actions** before this workflow can deploy:

| Secret | Where to find it |
|---|---|
| `VERCEL_TOKEN` | Vercel dashboard → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel project → Settings → General → Team ID (or your personal account ID) |
| `VERCEL_PROJECT_ID` | Vercel project → Settings → General → Project ID |

### Environment protection rules

The `deploy` job runs under the **production** GitHub environment. Environments let you add protection rules in **GitHub → Settings → Environments → production**:

- **Required reviewers** — one or more teammates must approve before the deploy step runs. Use this to add a manual gate on every production push.
- **Wait timer** — adds a delay (e.g. 10 minutes) between the build passing and the deploy starting, giving you time to cancel if something looks wrong.
- **Deployment branches** — restricts which branches can deploy to this environment (already enforced by the `on: push: branches: [main]` trigger, but this is a second layer).

If no rules are configured the deploy runs immediately after `build` passes.

### How to check deployment status

1. Open the **Actions** tab on GitHub and select the **Deploy — build and ship to Vercel** workflow.
2. Click the run triggered by your push to `main`.
3. The three jobs (`ci → build → deploy`) are shown left to right. A green tick means that job passed; a red X means it failed and stopped the chain.
4. Inside the `deploy` job, expand the **Deploy prebuilt to Vercel** step — the last line echoes the live production URL.
5. The environment URL also appears at the top of the workflow run summary page under **Deployments**.

### What to do if it fails

**ci fails** — same as the CI workflow: fix the type error or lint warning locally and push again.

**build fails** — run `npm run build:check` locally to reproduce the error. Common causes: a missing import, a type error that only surfaces during bundling, or a dependency that isn't installed. Fix and push.

**deploy fails** — check that all three secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) are set and have not expired. If the token is valid, expand the failing Vercel CLI step for the error message — most failures are misconfigured project IDs or a Vercel API outage.
