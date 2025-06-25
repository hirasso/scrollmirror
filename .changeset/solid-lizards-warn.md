---
"scrollmirror": patch
---

Trigger tests when @changesets creates it's version PRs. Apparently, `secrets.GITHUB_TOKEN` doesn't trigger other workflows. Instead, we need a custom PAT that needs to be present in the repository secrets (Actions) on GitHub.
