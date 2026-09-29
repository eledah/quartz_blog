#!/usr/bin/env bash
# Sync the Quartz core + npm packages from jackyzha0/quartz into this fork.
#
# Policy (driven by .github/workflows/sync-upstream.yaml):
#   * a real 3-way merge against upstream/v5, so the fork's history stays linked to
#     upstream and the next sync only has to look at genuinely new commits
#   * conflicting hunks are resolved in favour of this fork (`-X ours`) and reported in
#     the PR body — the branch always builds, and nothing local is dropped silently
#   * PROTECTED paths (content, personal config, first-party plugins) are restored to
#     this branch's HEAD after the merge, whatever upstream did to them
#
# Env knobs:
#   UPSTREAM_REF    default upstream/v5
#   BASE_BRANCH     default v5                (the branch that is synced)
#   SYNC_BRANCH     default chore/upstream-sync
#   SYNC_BODY_FILE  default: the file PR body is written to
#   NO_PUSH=1       stop after committing (local testing)
#   DRY_RUN=1       merge and report, then abort without committing
set -euo pipefail

UPSTREAM_REF="${UPSTREAM_REF:-upstream/v5}"
BASE_BRANCH="${BASE_BRANCH:-v5}"
SYNC_BRANCH="${SYNC_BRANCH:-chore/upstream-sync}"
# "git rev-parse --git-path" keeps this correct inside linked worktrees, where .git is a file.
BODY_FILE="${SYNC_BODY_FILE:-$(git rev-parse --git-path sync-upstream-body.md)}"
NO_PUSH="${NO_PUSH:-0}"
DRY_RUN="${DRY_RUN:-0}"

# Never changed by a sync, whatever upstream does to these paths.
PROTECTED=(
  content
  quartz.config.yaml
  quartz.lock.json
  plugins
  MIGRATION.md
  MIGRATION-NOTES.md
  .github/workflows/deploy.yml
)

log() { printf '%s\n' "$*"; }
out() { if [ -n "${GITHUB_OUTPUT:-}" ]; then printf '%s\n' "$1" >> "$GITHUB_OUTPUT"; fi; }

git rev-parse --verify --quiet "${UPSTREAM_REF}^{commit}" >/dev/null ||
  { log "::error::${UPSTREAM_REF} not found — fetch the upstream remote first"; exit 1; }
git rev-parse --verify --quiet "${BASE_BRANCH}^{commit}" >/dev/null ||
  { log "::error::${BASE_BRANCH} not found"; exit 1; }
# Pin to a commit: works whether the branch, origin/<branch> or a detached HEAD is checked out.
BASE_SHA=$(git rev-parse --verify "${BASE_BRANCH}^{commit}")

out "changed=false"

if git merge-base --is-ancestor "$UPSTREAM_REF" "$BASE_SHA"; then
  log "up to date: every commit on ${UPSTREAM_REF} is already in ${BASE_BRANCH}"
  printf 'Nothing to sync: no new commits on `%s`.\n' "$UPSTREAM_REF" > "$BODY_FILE"
  exit 0
fi

AHEAD=$(git rev-list --count "${BASE_BRANCH}..${UPSTREAM_REF}")
UP_SHORT=$(git rev-parse --short "$UPSTREAM_REF")
log "upstream is ${AHEAD} commit(s) ahead of ${BASE_BRANCH} (last upstream commit ${UP_SHORT})"

git checkout -B "$SYNC_BRANCH" "$BASE_SHA" >/dev/null

# --- merge ---------------------------------------------------------------
CONFLICTS=""
if ! git merge --no-commit --no-ff "$UPSTREAM_REF" >/dev/null 2>&1; then
  CONFLICTS=$(git diff --name-only --diff-filter=U | sort)
  log "conflicting hunks — retrying with local side preferred:"
  log "$CONFLICTS"
  git merge --abort
  if ! git merge --no-commit --no-ff -X ours "$UPSTREAM_REF" >/dev/null 2>&1; then
    git merge --abort 2>/dev/null || true
    log "::error::upstream still conflicts after -X ours; resolve locally (git fetch upstream && git merge upstream/v5)"
    out "conflicts=$(git diff --name-only --diff-filter=U | tr '\n' ' ')"
    exit 1
  fi
fi

# --- protected paths -----------------------------------------------------
KEEP=()
for p in "${PROTECTED[@]}"; do
  git cat-file -e "HEAD:${p}" >/dev/null 2>&1 && KEEP+=("$p")
done
if [ "${#KEEP[@]}" -gt 0 ]; then
  git restore --source=HEAD --staged --worktree -- "${KEEP[@]}"
  log "restored protected paths from ${BASE_BRANCH}: ${KEEP[*]}"
fi

if git diff --cached --quiet HEAD; then
  log "upstream's only changes were in protected paths — nothing to sync"
  printf 'Upstream moved (%s commit(s)) but every change was inside a protected path, so there is nothing to bring over.\n' "$AHEAD" > "$BODY_FILE"
  git merge --abort 2>/dev/null || git reset --hard HEAD
  exit 0
fi

# --- report --------------------------------------------------------------
SYNC_DATE=$(date -u +%Y-%m-%d)
{
  printf 'Automated weekly sync of the Quartz core and npm packages from `jackyzha0/quartz`.\n\n'
  printf '**Upstream:** `%s` @ `%s` — %s new commit(s)\n\n' "$UPSTREAM_REF" "$UP_SHORT" "$AHEAD"
  printf '<details><summary>Upstream commits included</summary>\n\n```\n'
  git log --oneline --no-decorate "${BASE_BRANCH}..${UPSTREAM_REF}"
  printf '```\n\n</details>\n\n'
  printf '<details><summary>Changed by this sync (%s file(s))</summary>\n\n```\n' "$(git diff --cached --name-only HEAD | wc -l | tr -d ' ')"
  git diff --cached --shortstat HEAD
  git diff --cached --name-status HEAD
  printf '```\n\n</details>\n\n'
  if [ -n "$CONFLICTS" ]; then
    printf '### ⚠️ Review these — upstream and the fork both touched them\n\n'
    printf 'The conflicting hunks kept the fork'"'"'s version (`-X ours`); the rest of each file came from upstream.\n\n'
    printf '```\n%s\n```\n\n' "$CONFLICTS"
  else
    printf '### ✅ No conflicts — upstream and the fork did not touch the same lines\n\n'
  fi
  printf '### Untouched on purpose\n\n'
  printf '```\n%s\n```\n\n' "${PROTECTED[*]}"
} > "$BODY_FILE"

# --- commit (merge commit: keeps history linked to upstream) -------------
if [ "$DRY_RUN" = "1" ]; then
  log "DRY_RUN=1 — leaving the merge staged, nothing committed"
  git merge --abort 2>/dev/null || git reset --hard HEAD
  out "changed=true"
  exit 0
fi

if [ -n "${GITHUB_ACTIONS:-}" ]; then
  export GIT_AUTHOR_NAME="github-actions[bot]"
  export GIT_AUTHOR_EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
  export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
  export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"
fi

CONFLICT_N=$(printf '%s' "$CONFLICTS" | grep -c . || true)
git commit -q --no-verify \
  -m "chore(upstream): sync Quartz v5 core from upstream (${UP_SHORT})" \
  -m "${AHEAD} upstream commit(s) merged; ${CONFLICT_N} file(s) kept on the fork's side. content/, quartz.config.yaml and plugins/ untouched."
SYNC_SHA=$(git rev-parse --short HEAD)
log "committed ${SYNC_SHA} on ${SYNC_BRANCH}"

if [ "$NO_PUSH" != "1" ]; then
  # The sync branch is machine-owned and is rebuilt from scratch on every run.
  git push --force origin "HEAD:refs/heads/${SYNC_BRANCH}"
  log "pushed ${SYNC_BRANCH}"
fi

out "changed=true"
out "ahead=${AHEAD}"
out "upstream_short=${UP_SHORT}"
out "sync_sha=${SYNC_SHA}"
out "sync_date=${SYNC_DATE}"
out "conflict_count=${CONFLICT_N}"
