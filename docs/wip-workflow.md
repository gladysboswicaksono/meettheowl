# WIP workflow

Use Git branches, not `.gitignore`, to separate unfinished source from production.

## Daily work

```powershell
git switch codex/own-what-ai-builds-wip
npm run dev:course
```

Local URLs:

- React project page: `http://localhost:5173/OwnWhatAIBuilds`
- Standalone course: `http://localhost:5173/OwnWhatAIBuilds/courses/edit-existing-file/index.html`

`npm run dev:course` starts the local server and opens the standalone course
directly. Use `npm run dev` when you want the full portfolio instead.

Commit and optionally push this branch for backup:

```powershell
git status
git add <the files you changed>
git diff --cached
git commit -m "Describe the WIP change"
git push -u origin codex/own-what-ai-builds-wip
```

Pushing this branch does not change `main`. Only merge it when the complete
project is ready for production.

Do not use `git add .` when unrelated local files are present. Check
`git status` before committing and before pushing.

## Production work

Switch only with a clean working tree:

```powershell
git status
git switch main
git pull
```

Never merge the WIP branch into `main` until the project is ready. Before any
push, confirm the current branch:

```powershell
git branch --show-current
```

## Optional separate folder

After the WIP branch has at least one commit, keep production and WIP open at
the same time with a Git worktree:

```powershell
git switch main
git worktree add E:\Portfolio\own-what-ai-builds codex/own-what-ai-builds-wip
```

Then use `E:\Portfolio\site` for `main` and
`E:\Portfolio\own-what-ai-builds` for WIP.
