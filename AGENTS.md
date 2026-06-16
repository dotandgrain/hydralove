# AGENTS.md

## Purpose

This file defines how Codex should work in this project.

Main goals:

* Reduce unnecessary token usage.
* Avoid reading irrelevant files.
* Keep edits small and safe.
* Use a practical app / web development workflow.
* Explain important decisions clearly but concisely.

---

## Project Context

This project is an app / web project.

Codex should assume the user is still learning development, so explanations should be practical and direct.

When making changes:

* Prefer simple, maintainable solutions.
* Avoid over-engineering.
* Avoid adding unnecessary dependencies.
* Keep UI, logic, and data structure easy to understand.
* Prioritize working implementation over complex architecture.

---

## Token Discipline

Use the smallest sufficient context.

Before reading files:

1. Search first.
2. Identify the smallest relevant files.
3. Read only the required sections.
4. Avoid re-reading files unless they changed.

Do not read the whole repository unless explicitly required.

Avoid opening large files unless directly necessary, including:

* `package-lock.json`
* `pnpm-lock.yaml`
* `yarn.lock`
* `node_modules`
* `.next`
* `dist`
* `build`
* coverage reports
* generated files
* long logs
* binary files

If a file is large, inspect only the relevant range.

Preferred commands:

```bash
rg "keyword"
find . -maxdepth 3 -type f
sed -n '1,160p' path/to/file
```

Avoid:

```bash
cat large-file
ls -R
find . -type f
```

---

## Command Output Rules

Never dump large terminal output into context.

For commands with unknown or potentially large output, cap the output:

```bash
COMMAND 2>&1 | head -c 4000
```

For build logs, test errors, or runtime errors, prefer the latest relevant output:

```bash
COMMAND 2>&1 | tail -c 4000
```

For search results, limit the result count when possible.

Examples:

```bash
rg "useState" app components --max-count 20
rg "error" . --glob '!node_modules' --glob '!.next' --max-count 20
```

If output is still too large, summarize the relevant part instead of pasting everything.

---

## Workflow

Before editing code:

1. Understand the task.
2. Locate the smallest relevant files.
3. Explain the intended change briefly.
4. Make the smallest safe edit.
5. Run the most relevant check.
6. Summarize what changed.

Do not make broad refactors unless the user explicitly requests them.

Do not change unrelated files.

Do not rename files, restructure folders, or replace libraries unless necessary.

---

## Coding Style

Use straightforward code.

Prefer:

* readable names
* small components
* simple functions
* explicit logic
* minimal dependencies

Avoid:

* clever abstractions
* premature optimization
* unnecessary state management
* large rewrites
* hidden side effects

For React / Next.js projects:

* Prefer functional components.
* Keep components small.
* Keep styling close to the component unless the project already uses a different pattern.
* Reuse existing UI patterns before creating new ones.
* Check whether the project uses App Router or Pages Router before editing routing files.

For TypeScript:

* Avoid `any` unless there is a clear reason.
* Prefer simple interfaces or types.
* Do not introduce complex generic types unless necessary.
* Fix type errors directly instead of suppressing them.

---

## UI / Design Rules

When improving UI:

* Preserve the original product purpose.
* Improve spacing, hierarchy, contrast, and readability.
* Keep mobile layout usable first.
* Avoid excessive animation.
* Avoid generic AI-looking gradients unless requested.
* Prefer clean, practical, modern interface design.
* Keep visual changes consistent across the app.

For iOS-style web apps:

* Respect safe area spacing.
* Use clear touch targets.
* Keep bottom navigation easy to reach.
* Avoid desktop-first layouts.
* Make Home Screen / PWA usage feel app-like.

---

## Testing and Verification

After changes, run the smallest relevant verification command.

Prefer, when available:

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

If unsure which command exists, inspect `package.json` first:

```bash
sed -n '1,220p' package.json
```

When running checks, cap output:

```bash
npm run build 2>&1 | tail -c 4000
npm run typecheck 2>&1 | tail -c 4000
npm run lint 2>&1 | tail -c 4000
```

If a command fails:

1. Identify the real error.
2. Ignore unrelated noisy output.
3. Fix the smallest cause.
4. Re-run the relevant check.

Do not keep retrying the same failing command without changing anything.

---

## Git Rules

Do not commit unless the user explicitly asks.

Before making many edits, check the current state:

```bash
git status --short
```

Do not overwrite user changes.

If there are unexpected modified files, stop and ask before touching them.

Do not run destructive commands unless explicitly requested.

Avoid:

```bash
git reset --hard
git clean -fd
rm -rf
```

---

## Dependency Rules

Do not install new packages unless necessary.

Before adding a dependency:

1. Check whether the project already has a similar package.
2. Explain why the dependency is needed.
3. Prefer native platform features when reasonable.

Avoid adding large UI libraries for small UI changes.

Avoid adding state management libraries unless the app clearly needs them.

---

## File Reading Strategy

Use this order:

1. `package.json`
2. relevant route / page file
3. relevant component file
4. relevant style file
5. relevant config file

Do not inspect unrelated folders.

For Next.js, check likely folders:

```bash
app
pages
components
src
styles
public
```

For Vite / React, check likely folders:

```bash
src
components
pages
styles
public
```

---

## Response Style

When reporting back to the user:

* Start with the result.
* Use concise bullet points.
* Mention changed files.
* Mention verification result.
* Mention unresolved risks clearly.
* Do not include long code dumps unless requested.

Use this format:

```md
Done.

Changed:
- `file/path`: what changed

Checked:
- `npm run build`: passed / failed

Notes:
- Any important limitation or next step
```

If the task cannot be completed, explain exactly why and what information is missing.

---

## Safety

Do not touch secrets or credentials.

Do not print `.env` contents.

Do not expose API keys.

Do not modify authentication, payment, database, or deployment settings unless the user explicitly requests it.

If a requested change may break production, explain the risk before making the change.

---

## Default Instruction

When in doubt:

* Search before reading.
* Read less.
* Edit less.
* Verify with the smallest relevant command.
* Keep explanations short.
* Avoid unnecessary token usage.
