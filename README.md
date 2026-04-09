<div align="center">

# AI Release Notes

### _Stop writing release notes. Start shipping them._

**Ship beautiful release notes in 30 seconds.**

AI-powered. Multi-format. Auto migration guides. 4 tone modes. 9 languages. Works with any stack.

[![GitHub Actions](https://img.shields.io/badge/GitHub-Action-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![npm version](https://img.shields.io/badge/npm-1.0.0-CB3847?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/ai-release-notes)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/Tests-148%20passing-brightgreen?style=for-the-badge)]()
[![OpenAI Compatible](https://img.shields.io/badge/AI-OpenAI%20Compatible-412991?style=for-the-badge&logo=openai&logoColor=white)]()

<br />

[Features](#-features) &bull; [Quick Start](#-quick-start-30-seconds) &bull; [Examples](#-output-examples) &bull; [Configuration](#-configuration) &bull; [Architecture](#-architecture) &bull; [Contributing](#-contributing)

<br /><br />

</div>

---

## Imagine This

Your team just shipped v2.1.0. Three features, two bug fixes, one breaking change. Your PM wants release notes. Your Twitter needs an announcement. Slack needs a heads-up. Discord needs the changelog. And there's a migration guide to write.

Normally that's 2 hours of copy-paste hell. With AI Release Notes, it's 30 seconds.

**One command. Six formats. Zero effort.**

```
 npx ai-release-notes --from=v2.0.0 --to=v2.1.0 --tone=professional --language=en

  API  v2.1.0  Generated in 4.2s
  MD   release-notes.md .............. 2.1 KB
  HTML release-notes.html ............ 4.8 KB
  Slack 12 blocks, 3 actions ........ ready
  Discord 4 embeds, 3 colors ........ ready
  Twitter 7-tweet thread ............. ready
  Migration 1 guide, before/after ... ready

  Done. Ship it.
```

---

### What You Get

**Professional Markdown** -- the release notes that land on your GitHub Releases page:

```
+------------------------------------------------------------------+
|  Release v2.1.0                                                   |
|  January 15, 2025                                                 |
+------------------------------------------------------------------+
|                                                                    |
|  We are pleased to announce v2.1.0, featuring significant         |
|  improvements to security and performance across the platform.    |
|                                                                    |
|  Summary: 3 features | 2 bug fixes | 1 breaking change           |
|                                                                    |
+==================================================================+
|  BREAKING CHANGES                                                  |
+==================================================================+
|                                                                    |
|  Removed deprecated /api/v1/users endpoint                        |
|  Scope: api | Severity: major                                     |
|  Migration: Use /api/v2/users instead                             |
|  PR #40 by @sarah                                                  |
|                                                                    |
|  Before:  fetch('/api/v1/users')                                  |
|  After:   fetch('/api/v2/users')                                  |
|                                                                    |
+==================================================================+
|  NEW FEATURES                                                      |
+==================================================================+
|                                                                    |
|  + User avatar upload API ................. [api] #42 @alice       |
|  + Dark mode toggle ........................ [ui]  #43 @bob       |
|  + Pagination on list endpoints ......... [api] #44 @charlie      |
|                                                                    |
+==================================================================+
|  PERFORMANCE                                                       |
+==================================================================+
|                                                                    |
|  * API response time -40% (340ms -> 204ms) .............. #47     |
|  * Bundle size -23% (1.2MB -> 924KB) ................... #48      |
|                                                                    |
+==================================================================+
|  BUG FIXES                                                         |
+==================================================================+
|                                                                    |
|  * Login timeout on slow connections ......... [auth] #45 @dave    |
|  * Memory leak in event listeners ........... [core] #46 @eve      |
|                                                                    |
+==================================================================+
|  CONTRIBUTORS                                                      |
+==================================================================+
|                                                                    |
|  @alice (3)  @bob (2)  @charlie (1)  @dave (1)  @eve (1)         |
|  @sarah (2)                                                        |
|                                                                    |
|  Full Changelog: v2.0.0...v2.1.0                                  |
+------------------------------------------------------------------+
```

**Casual Slack notification** -- what your team sees in #releases:

```
+------------------------------------------------------------------+
|  #releases                                                         |
+------------------------------------------------------------------+
|                                                                    |
|  :rocket: v2.1.0 just dropped!                                    |
|  Hey team! 3 new features, 2 bug squashes, and heads up --        |
|  1 breaking change.                                                |
|                                                                    |
|  :warning: Heads up!                                               |
|  /api/v1/users is gone -> use /api/v2/users instead              |
|                                                                    |
|  :star: What's New:                                                |
|  * Avatar uploads! Your users can finally upload profile pics.    |
|    About time, right? #42                                          |
|  * Dark mode! Because everyone asked for it. #43                  |
|  * Pagination! Every list endpoint now has proper pagination. #44 |
|                                                                    |
|  :bug: Bug Squashes:                                               |
|  * Login no longer times out on slow connections #45              |
|  * Killed a sneaky memory leak (~2MB/hr). Oops. #46              |
|                                                                    |
|  :clap: Shoutout: @alice @bob (first PR!) @charlie (first PR!)   |
|                                                                    |
|  [View Full Release Notes]  [View Changelog]                      |
+------------------------------------------------------------------+
```

**Humorous Discord announcement** -- for community-driven projects:

```
+------------------------------------------------------------------+
|  #announcements                                      Discord      |
+------------------------------------------------------------------+
|                                                                    |
|  :drum: v2.1.0 has landed!                                        |
|                                                                    |
|  Plot twist: we removed /api/v1/users.                            |
|  Don't panic. /api/v2/users has been there all along.             |
|  Like that friend who was always there but you ignored.           |
|                                                                    |
|  Things That Are New and Shiny:                                    |
|  + Avatars! Because you're all beautiful. #42                     |
|  + Dark mode. Yes. Finally. You're welcome. #43                   |
|  + Pagination. Because nobody needs 10,000 results at once. #44   |
|                                                                    |
|  Bugs We Sent to Bug Heaven:                                       |
|  * That login timeout? Gone. Rest in peace. #45                   |
|  * Memory leak plugged. No more leaky pipes. #46                  |
|                                                                    |
|  Things Nobody Sees But Everyone Needs:                            |
|  * API responses are 40% faster. 340ms -> 204ms. Zoom zoom. #47  |
|  * Bundle is 23% smaller. We went on a diet. #48                  |
|                                                                    |
|  Contributors: @alice @bob :star: @charlie :star: @dave @eve     |
|                                                                    |
|  [Changelog]  [npm install pkg@2.1.0]                             |
+------------------------------------------------------------------+
```

**Twitter/X thread** -- for major releases:

```
+------------------------------------------------------------------+
|  @yourproject                                                      |
+------------------------------------------------------------------+
| 1/7 v2.1.0 is HERE.                                               |
|                                                                    |
|  3 features. 2 bug fixes. 40% faster APIs.                       |
|  The biggest update since our launch.                             |
|                                                                    |
|  Here's everything (and one breaking change): >>>                 |
+------------------------------------------------------------------+
| 2/7 :rocket: New in v2.1.0:                                       |
|                                                                    |
|  * Avatar uploads (JPEG, PNG, WebP up to 5MB) #42                |
|  * Dark mode (system-aware, respects OS preference) #43           |
|  * Pagination on ALL list endpoints (50/page default) #44         |
+------------------------------------------------------------------+
| 3/7 :zap: Performance:                                             |
|                                                                    |
|  API response time: 340ms -> 204ms (-40%)                        |
|  Bundle size: 1.2MB -> 924KB (-23%)                              |
|                                                                    |
|  That's not a typo. Your app just got faster.                     |
+------------------------------------------------------------------+
| 4/7 :rotating_light: BREAKING CHANGE:                              |
|                                                                    |
|  /api/v1/users is GONE.                                            |
|  Use /api/v2/users instead.                                        |
|  Migration guide in the full release notes.                        |
+------------------------------------------------------------------+
| 5/7 Contributors this release:                                     |
|                                                                    |
|  @alice (3 commits)                                                |
|  @bob (2 commits) - FIRST TIME CONTRIBUTOR!                       |
|  @charlie (1 commit) - FIRST TIME!                                 |
|  @dave @eve @sarah                                                 |
+------------------------------------------------------------------+
| 6/7 Full changelog:                                                |
|  github.com/USERNAME/app/compare/v2.0.0...v2.1.0                  |
|                                                                    |
|  #ReleaseNotes #OpenSource #Changelog #BreakingChange             |
+------------------------------------------------------------------+
| 7/7 That's v2.1.0!                                                 |
|                                                                    |
|  npm install your-package@2.1.0                                    |
|                                                                    |
|  Star us on GitHub if this saved you time!                         |
+------------------------------------------------------------------+
```

**Auto-generated migration guide** -- with real before/after code:

```
+------------------------------------------------------------------+
|  Migration Guide: v2.0.0 -> v2.1.0                                |
+------------------------------------------------------------------+
|                                                                    |
|  This guide covers 1 breaking change.                             |
|  Estimated migration time: 5 minutes.                             |
|                                                                    |
+==================================================================+
|  1. Removed deprecated /api/v1/users endpoint                     |
+==================================================================+
|                                                                    |
|  Scope: api  |  Severity: major  |  PR: #40  |  Author: @sarah    |
|                                                                    |
|  BEFORE (v2.0.0):                                                  |
|  +---------------------------------------------------+            |
|  | // Old usage - will now return 404                 |            |
|  | const response = await fetch('/api/v1/users', {   |            |
|  |   headers: { 'Authorization': `Bearer ${token}` } |            |
|  | });                                                |            |
|  | const users = await response.json();               |            |
|  +---------------------------------------------------+            |
|                                                                    |
|  AFTER (v2.1.0):                                                   |
|  +---------------------------------------------------+            |
|  | // Updated to v2 API - pagination included        |            |
|  | const response = await fetch('/api/v2/users', {   |            |
|  |   headers: { 'Authorization': `Bearer ${token}` } |            |
|  | });                                                |            |
|  | const { data: users, meta } = await response.json()|           |
|  | // meta.pagination has total pages, current page   |            |
|  +---------------------------------------------------+            |
|                                                                    |
|  Steps:                                                            |
|  1. Replace all /api/v1/users calls with /api/v2/users            |
|  2. Handle new { data, meta } response wrapper                    |
|  3. Update client SDK calls (SDK v3.0+ required)                  |
|  4. Remove v1-specific query params (?all=true no longer works)   |
|                                                                    |
|  Timeline:                                                         |
|  - v2.1.0 (now): v1 returns 404 with migration header            |
|  - v2.2.0: v1 removed from routing entirely                       |
|  - v3.0.0: No backward compatibility                              |
|                                                                    |
+------------------------------------------------------------------+
```

**Multi-language output** -- ship globally, in 9 languages:

```
+------------------------------------------------------------------+
|  Espanol (es)                                                      |
+------------------------------------------------------------------+
|                                                                    |
|  Notas de la version v2.1.0                                        |
|                                                                    |
|  Nos complace anunciar la version 2.1.0, que incluye              |
|  mejoras significativas de seguridad y rendimiento.               |
|                                                                    |
|  Resumen: 3 nuevas funciones | 2 correcciones | 1 cambio radical |
|                                                                    |
|  :rotating_light: Cambios radicales                                |
|  Se elimino el endpoint /api/v1/users                              |
|  Migracion: Use /api/v2/users                                      |
|                                                                    |
|  Nuevas funciones                                                  |
|  + Carga de avatar de usuario ............. [api] #42             |
|  + Alternar modo oscuro .................. [ui]  #43             |
|  + Paginacion en endpoints de lista ..... [api] #44               |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
|  Japanese (ja)                                                     |
+------------------------------------------------------------------+
|                                                                    |
|  v2.1.0                                                           |
|                                                                    |
|  セキュリティとパフォーマンスの大幅な改善が含まれています。          |
|                                                                    |
|  概要: 3つの新機能 | 2つのバグ修正 | 1つの破壊的変更               |
|                                                                    |
|  :rotating_light: 破壊的変更                                       |
|  /api/v1/usersエンドポイントを削除しました                          |
|  マイグレーション: /api/v2/usersをご使用ください                    |
|                                                                    |
|  新機能                                                            |
|  + ユーザーアバターアップロードAPI .......... [api] #42            |
|  + ダークモード切り替え ...................... [ui]  #43           |
|  + リストエンドポイントのページネーション ... [api] #44            |
+------------------------------------------------------------------+
```

---

## The Problem with Release Notes

Release notes are the **first thing users see** after an update. Yet most teams treat them like an afterthought.

You just shipped a feature your team spent weeks building. Your release notes?

```
* fix typo
* update deps
* add feature
* more fixes
```

Your users see a wall of commits and **close the tab**.

| Tool | The Problem | Users' Reaction |
|:------|:------------|:----------------|
| **GitHub Auto-Generated** | Raw commit list copy-pasted. No context. No structure. Just SHA hashes and merge titles. | "What does this even mean?" |
| **Manual Writing** | Staring at a blank screen for 2 hours. Takes forever. Always behind schedule. | "Why are these always late?" |
| **semantic-release** | Robot-speak changelog with zero personality. Technically correct, humanly incomprehensible. | Developers skip reading them |
| **Keep a Changelog** | Great format template -- still blank. YOU still write every single word yourself. | Good luck maintaining it |
| **standard-version** | Dumps conventional commits into a file. Not release notes. Not shareable. Not social. | Technically correct, useless |
| **Release Drafter** | Only groups PRs by label. No AI understanding. No multi-format. No migration guides. | Better than nothing, barely |

**Every tool either generates garbage or makes you do all the work.**

### The Solution

```
+-----------------------------------------------------------------+
|                                                                  |
|  git push  -->  AI analyzes commits  -->  Beautiful release notes |
|       |              |                          |                 |
|       |         30 seconds                6 formats              |
|       v              v                          v                 |
|    tag v2.1.0    OpenAI / local           MD / HTML / Slack      |
|                  148 tests proven         Discord / Twitter       |
|                                              / Migration         |
+-----------------------------------------------------------------+
```

AI Release Notes reads your git history, **understands what changed and why**, and generates beautiful, contextual release notes -- in any format, with any tone, with migration guides for breaking changes -- automatically.

No templates to fill. No blank pages. No copy-pasting commit messages.

---

## Features

| Category | Feature | Details |
|:---------|:--------|:--------|
| :brain: **AI Engine** | OpenAI-compatible engine | Works with OpenAI, Azure, Ollama, LM Studio, any compatible API |
| :brain: **AI Engine** | Works without AI key | Falls back to intelligent template-based generation -- still beautiful |
| :brain: **AI Engine** | Contextual understanding | Doesn't copy commit messages -- understands what changed and why |
| :gear: **Formats** | Markdown | Full GitHub/GitLab release notes with tables, collapsibles, formatting |
| :gear: **Formats** | HTML | Email-ready with inline CSS, responsive, color-coded sections |
| :gear: **Formats** | Slack Block Kit | Interactive blocks with action buttons and rich formatting |
| :gear: **Formats** | Discord Rich Embeds | Color-coded embeds with field layout and contributor badges |
| :gear: **Formats** | Twitter/X Thread | 7-tweet threads optimized for engagement and virality |
| :gear: **Formats** | Compact Mode | Minimal format for changelogs, feeds, and SMS |
| :theater: **Tone** | Professional | Enterprise-ready, formal language, structured sections |
| :theater: **Tone** | Casual | Friendly, approachable, personality-first |
| :theater: **Tone** | Humorous | Fun, engaging, community-friendly, meme-aware |
| :theater: **Tone** | Technical | Precise, detailed, developer-focused with code references |
| :rotating_light: **Breaking** | 5 detection methods | `!` suffix, BREAKING CHANGE footer, `breaking:` prefix, API keywords, code analysis |
| :rotating_light: **Breaking** | Auto migration guides | Before/after code, step-by-step instructions, deprecation timeline |
| :rotating_light: **Breaking** | Severity classification | major / minor / patch severity per breaking change |
| :globe_with_meridians: **i18n** | 9 languages | EN, ES, FR, DE, JA, ZH, KO, PT, RU |
| :globe_with_meridians: **i18n** | Automatic detection | Detects repository language settings automatically |
| :rocket: **CI/CD** | GitHub Action | One-step workflow integration with 20+ config options |
| :rocket: **CI/CD** | CLI (npx) | Zero-install, run from anywhere, pipe output anywhere |
| :rocket: **CI/CD** | Node.js library | Full programmatic API for custom integrations |
| :rocket: **CI/CD** | Webhook delivery | Auto-post to Slack, Discord, Twitter after generation |
| :bar_chart: **Analysis** | Semver-aware | Calculates version bumps from commit types automatically |
| :bar_chart: **Analysis** | Conventional commits | Full support: feat, fix, docs, refactor, perf, test, chore, ci, build, style, revert |
| :bar_chart: **Analysis** | Diff statistics | Lines added/removed, files changed, contributor breakdown |
| :bar_chart: **Analysis** | Auto versioning | Calculate next version from commit history |
| :bar_chart: **Analysis** | Screenshot detection | Auto-finds and includes screenshots from PR bodies |
| :bar_chart: **Analysis** | Custom categories | Define your own commit grouping rules with JSON patterns |
| :white_check_mark: **Quality** | 148 tests | Comprehensive test suite covering all features and edge cases |
| :white_check_mark: **Quality** | Zero config | Works out of the box with sensible defaults |
| :white_check_mark: **Quality** | Dry run mode | Preview notes without creating a release |

---

## Comparison

How does AI Release Notes stack up against every popular alternative?

| Feature | AI Release Notes | semantic-release | standard-version | GitHub Auto-Gen | Release Drafter | Keep a Changelog |
|:--------|:---:|:---:|:---:|:---:|:---:|:---:|
| **AI-generated descriptions** | :white_check_mark: | :x: | :x: | :x: | :x: | :x: |
| **Output formats** | :white_check_mark: 6 formats | 1 format | 1 format | 1 format | 1 format | Manual |
| **Tone control** | :white_check_mark: 4 tones | :x: | :x: | :x: | :x: | :x: |
| **Auto migration guides** | :white_check_mark: | :x: | :x: | :x: | :x: | :x: |
| **Twitter/X threads** | :white_check_mark: | :x: | :x: | :x: | :x: | :x: |
| **Slack Block Kit** | :white_check_mark: | :x: | :x: | :x: | :x: | :x: |
| **Discord Rich Embeds** | :white_check_mark: | :x: | :x: | :x: | :x: | :x: |
| **HTML/email output** | :white_check_mark: | :x: | :x: | :x: | :x: | :x: |
| **Breaking change detection** | :white_check_mark: 5 methods | Basic (1) | Basic (1) | Basic | :x: | :x: |
| **Before/after code examples** | :white_check_mark: Auto | :x: | :x: | :x: | :x: | :x: |
| **Multi-language** | :white_check_mark: 9 langs | English | English | English | English | Manual |
| **Custom categories** | :white_check_mark: JSON | :x: | :x: | :x: | Labels | :x: |
| **Screenshot detection** | :white_check_mark: | :x: | :x: | :x: | :x: | :x: |
| **Works without AI key** | :white_check_mark: | N/A | N/A | N/A | N/A | N/A |
| **Zero config** | :white_check_mark: | :x: Complex | :white_check_mark: | :white_check_mark: | :white_check_mark: | :x: Manual |
| **CLI tool (npx)** | :white_check_mark: | :x: | :white_check_mark: | :x: | :x: | :x: |
| **Node.js API** | :white_check_mark: | :white_check_mark: | :x: | :x: | :x: | :x: |
| **Auto-post to Slack** | :white_check_mark: | :x: | :x: | :x: | :x: | :x: |
| **Auto-post to Discord** | :white_check_mark: | :x: | :x: | :x: | :x: | :x: |
| **First-time contributor highlight** | :white_check_mark: | :x: | :x: | :x: | :x: | :x: |
| **Price** | **Free** | Free | Free | Free | Free | Free |

> :trophy: **TL;DR**: If you want AI-powered, multi-format, multi-tone release notes with migration guides and social posts, nothing else comes close.

---

## Quick Start (30 Seconds)

Two paths. Both take under 2 minutes.

### Path A: GitHub Action

#### Step 1: Create the workflow file

Create `.github/workflows/release-notes.yml`:

```yaml
name: Release Notes

on:
  push:
    tags: ['v*']          # matches v1.0.0, v2.1.3, etc.
  workflow_dispatch:      # also allows manual trigger

permissions:
  contents: write         # needed to create GitHub Releases

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      # fetch-depth: 0 is REQUIRED -- the analyzer needs full git history
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate AI Release Notes
        uses: USERNAME/ai-release-notes@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          api-key: ${{ secrets.OPENAI_API_KEY }}    # Optional - works without it
          template: default
          language: en
```

Push a tag. Get beautiful release notes. That's it.

<details>
<summary><strong>:scroll: Full workflow with all integrations</strong></summary>

```yaml
name: Release Notes

on:
  push:
    tags: ['v*']
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to release (e.g. v1.2.0)'
        required: false

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate & Publish Release Notes
        uses: USERNAME/ai-release-notes@v1
        with:
          # Required
          github-token: ${{ secrets.GITHUB_TOKEN }}

          # AI Configuration (optional -- works without)
          api-key: ${{ secrets.OPENAI_API_KEY }}
          api-base: https://api.openai.com/v1
          model: gpt-4o-mini

          # Output Configuration
          template: detailed
          language: en

          # Commit Analysis
          commit-mode: auto
          max-commits: 200
          categories: auto

          # Version Configuration
          version-from: tag

          # Content Sections
          include-breaking: true
          include-contributors: true
          include-diff-stats: true
          include-screenshots: true

          # Integrations
          slack-webhook: ${{ secrets.SLACK_WEBHOOK }}
          discord-webhook: ${{ secrets.DISCORD_WEBHOOK }}
          update-changelog: true
          changelog-path: CHANGELOG.md

          # Twitter (all 4 required if any provided)
          # twitter-consumer-key: ${{ secrets.TWITTER_KEY }}
          # twitter-consumer-secret: ${{ secrets.TWITTER_SECRET }}
          # twitter-access-token: ${{ secrets.TWITTER_TOKEN }}
          # twitter-access-secret: ${{ secrets.TWITTER_TOKEN_SECRET }}

          dry-run: false
```

</details>

#### Step 2: Add your secrets

Go to **Settings > Secrets and variables > Actions** and add:

| Secret | When Required | Where to Get It |
|:-------|:--------------|:----------------|
| `GITHUB_TOKEN` | Always | Auto-provided by GitHub Actions. No setup needed. |
| `OPENAI_API_KEY` | For AI-powered notes | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `SLACK_WEBHOOK` | For Slack auto-post | [api.slack.com/messaging/webhooks](https://api.slack.com/messaging/webhooks) |
| `DISCORD_WEBHOOK` | For Discord auto-post | Server Settings > Integrations > Webhooks |

#### Step 3: Push a tag

```bash
git tag v1.2.0
git push origin v1.2.0
```

The action will analyze commits, detect breaking changes, generate release notes, create a GitHub Release, post to Slack/Discord if configured, and update your CHANGELOG.md.

---

### Path B: CLI (Zero Install)

```bash
# Basic: auto-detect versions from git tags
npx ai-release-notes --github-token=$GITHUB_TOKEN --api-key=$OPENAI_API_KEY

# Specific version range
npx ai-release-notes --from=v1.0.0 --to=v2.0.0 --api-key=sk-xxx

# Casual tone for Slack
npx ai-release-notes --template=casual --format=slack --from=v2.0.0

# Humorous tone in Japanese
npx ai-release-notes --tone=humorous --language=ja --from=v1.0.0

# Dry run - preview without creating a release
npx ai-release-notes --from=v1.0.0 --dry-run

# Works without AI key (template-based generation)
npx ai-release-notes --from=v1.0.0

# Save to file
npx ai-release-notes --from=v1.0.0 > RELEASE_NOTES.md

# Pipe to clipboard (macOS)
npx ai-release-notes --from=v1.0.0 | pbcopy

# Post to custom endpoint
npx ai-release-notes --from=v1.0.0 --format=json | curl -X POST -d @- https://api.example.com/releases
```

<details>
<summary><strong>:terminal: All CLI flags</strong></summary>

```
Usage: ai-release-notes [options]

Options:
  --from <tag>              Starting tag/commit (required)
  --to <tag>                Ending tag/commit (default: HEAD)
  --api-key <key>           OpenAI-compatible API key (optional)
  --api-base <url>          Custom API base URL (default: https://api.openai.com/v1)
  --model <name>            AI model (default: gpt-4o-mini)
  --tone <mode>             Tone: professional, casual, humorous, technical
  --language <code>         Language: en, es, fr, de, ja, zh, ko, pt, ru
  --template <name>         Template: default, minimal, detailed, enterprise, fun
  --format <fmt>            Output: markdown, html, slack, discord, twitter, compact
  --output <file>           Output file path
  --dry-run                 Preview without creating release
  --max-commits <n>         Max commits to analyze (1-1000, default: 200)
  --no-ai                   Disable AI, use template-based generation
  --update-changelog        Auto-update CHANGELOG.md
  --changelog-path <path>   Path to changelog file (default: CHANGELOG.md)
  --github-token <token>    GitHub token for API access
  --slack-webhook <url>     Slack webhook URL for auto-posting
  --discord-webhook <url>   Discord webhook URL for auto-posting
  -h, --help                Show help
  -V, --version             Show version
```

</details>

---

## Output Examples

### 1. Professional Markdown (GitHub / GitLab Releases)

The default format. Full-featured, beautifully formatted markdown that lands on your GitHub Releases page.

````markdown
# Release v2.1.0 -- "The Security & Speed Update"

> We are pleased to announce the release of version 2.1.0, which includes
> significant improvements to security and performance across the platform.
> This release contains 3 new features, 2 bug fixes, and 1 breaking change.

---

## Breaking Changes

> **Warning:** This release contains a breaking change. Please review the
> migration guide below before upgrading.

<details>
<summary><strong>Breaking Changes and Migration Guide (click to expand)</strong></summary>

### Removed deprecated /api/v1/users endpoint

**Scope:** `api`
**Severity:** major
**PR:** [#40](https://github.com/acme/app/pull/40) by @sarah

#### Before
```javascript
// Old usage -- this will now return 404
const response = await fetch('/api/v1/users', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const users = await response.json();
```

#### After
```javascript
// Updated to v2 API -- includes pagination by default
const response = await fetch('/api/v2/users?page=1&limit=50', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data: users, meta } = await response.json();
// meta.pagination contains total pages, current page, etc.
```

#### Migration Steps
1. Replace all `/api/v1/users` calls with `/api/v2/users`
2. Update response handling to use `data` wrapper and `meta.pagination`
3. Update all client SDK calls (SDK v3.0+ required)
4. Remove any v1-specific query parameters

#### Deprecation Timeline
- **v2.1.0 (now):** v1 endpoint returns 404 with migration header
- **v2.2.0:** v1 endpoint removed entirely from routing
- **v3.0.0:** No backward compatibility guaranteed

</details>

---

## New Features

- **User avatar upload API** [`api`] ([#42](https://github.com/acme/app/pull/42)) by @alice
  Users can now upload profile avatars via the new `POST /api/v2/users/:id/avatar` endpoint.
  Supports JPEG, PNG, and WebP up to 5MB. Auto-cropped and optimized.

- **Dark mode toggle** [`ui`] ([#43](https://github.com/acme/app/pull/43)) by @bob
  System-aware dark mode toggle in user settings. Respects OS preference
  by default and persists manual overrides in localStorage.

- **Pagination for all list endpoints** [`api`] ([#44](https://github.com/acme/app/pull/44)) by @charlie
  Every list endpoint now supports `page` and `limit` query parameters with
  cursor-based pagination for large datasets. Default page size is 50.

## Performance Improvements

- **Database query optimization** -- Reduced average API response time by **40%** (340ms -> 204ms)
  on user-related endpoints through indexed query restructuring ([#47](https://github.com/acme/app/pull/47))

- **Asset pipeline rebuild** -- Frontend bundle size reduced by **23%** (1.2MB -> 924KB) through
  tree-shaking improvements and dynamic imports ([#48](https://github.com/acme/app/pull/48))

## Bug Fixes

- **Fixed login timeout on slow connections** [`auth`] ([#45](https://github.com/acme/app/pull/45)) by @dave
  Login requests no longer timeout after 10s on connections slower than 1Mbps. Progressive
  polling with a 60s max timeout.

- **Fixed memory leak in event listeners** [`core`] ([#46](https://github.com/acme/app/pull/46)) by @eve
  Resolved a memory leak where WebSocket event listeners were not properly cleaned up
  on component unmount, causing ~2MB/hour memory growth.

## Contributors

| Contributor | Commits | First Contribution? |
|:------------|:--------|:--------------------|
| @alice | 3 | |
| @bob | 2 | :tada: First contribution! |
| @charlie | 1 | :tada: First contribution! |
| @dave | 1 | |
| @eve | 1 | |
| @sarah | 2 | |

**Full Changelog**: https://github.com/acme/app/compare/v2.0.0...v2.1.0
````

---

### 2. HTML (Email-Ready)

Standalone HTML page with inline CSS for email client compatibility. Color-coded sections, responsive design, contributor badges.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Release v2.1.0</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           max-width: 680px; margin: 0 auto; padding: 20px; color: #24292f;
           background: #ffffff; line-height: 1.6; }
    .header { border-bottom: 3px solid #238636; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { margin: 0 0 8px; font-size: 28px; color: #1f2328; }
    .version { display: inline-block; background: #238636; color: white;
               padding: 4px 12px; border-radius: 12px; font-size: 14px; }
    .summary { background: #f6f8fa; border-radius: 8px; padding: 16px; margin-bottom: 24px;
               border-left: 4px solid #238636; }
    .section-title.features { color: #238636; }
    .section-title.fixes { color: #0969da; }
    .section-title.breaking { color: #cf222e; }
    .section-title.perf { color: #8250df; }
    .breaking-box { background: #ffebe9; border: 1px solid #ff8182; border-radius: 8px;
                    padding: 16px; margin-bottom: 16px; }
    .migration { background: #fff8c5; border-left: 4px solid #d29922; padding: 12px;
                 margin-top: 8px; border-radius: 4px; }
    .scope { display: inline-block; background: #ddf4ff; color: #0969da;
             padding: 2px 8px; border-radius: 12px; font-size: 12px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Release v2.1.0</h1>
    <span class="version">v2.1.0</span>
    <div class="date">Released on January 15, 2025</div>
  </div>

  <div class="summary">
    <strong>The Security &amp; Speed Update</strong> -- 3 features, 2 fixes,
    1 breaking change. API response time reduced by 40%. Bundle size down 23%.
  </div>

  <div class="section">
    <h2 class="section-title breaking">Breaking Changes</h2>
    <div class="breaking-box">
      <strong>Removed deprecated /api/v1/users endpoint</strong><br>
      <span class="scope">api</span> by @sarah
      <div class="migration">
        <strong>Migration:</strong> Use <code>/api/v2/users</code> instead.
        Update all client SDK calls. See migration guide for before/after code.
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title features">New Features</h2>
    <div class="item">
      <strong>User avatar upload API</strong> <span class="scope">api</span><br>
      Upload profile avatars via POST. JPEG, PNG, WebP up to 5MB.
      <a href="#" class="link">#42</a> <span class="author">by @alice</span>
    </div>
    <div class="item">
      <strong>Dark mode toggle</strong> <span class="scope">ui</span><br>
      System-aware dark mode in user settings.
      <a href="#" class="link">#43</a> <span class="author">by @bob</span>
    </div>
    <div class="item">
      <strong>Pagination for list endpoints</strong> <span class="scope">api</span><br>
      Every list endpoint supports page/limit. Default 50/page.
      <a href="#" class="link">#44</a> <span class="author">by @charlie</span>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title perf">Performance</h2>
    <div class="item">
      <strong>Database query optimization</strong> -- API response time reduced by
      <strong>40%</strong> (340ms to 204ms). <a href="#" class="link">#47</a>
    </div>
    <div class="item">
      <strong>Asset pipeline rebuild</strong> -- Bundle size reduced by
      <strong>23%</strong> (1.2MB to 924KB). <a href="#" class="link">#48</a>
    </div>
  </div>
</body>
</html>
```

---

### 3. Slack Block Kit

Interactive Slack message with sections, dividers, and action buttons. Ready to post via webhook.

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": ":rocket: Release v2.1.0",
        "emoji": true
      }
    },
    {
      "type": "context",
      "elements": [
        { "type": "mrkdwn", "text": "*January 15, 2025* | 3 features | 2 fixes | 1 breaking" }
      ]
    },
    { "type": "divider" },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":rotating_light: *Breaking Changes*\n`api` Removed `/api/v1/users` -- use `/api/v2/users` instead\n_Migration guide available in release notes_"
      }
    },
    { "type": "divider" },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":rocket: *New Features*\n* User avatar upload API <https://github.com/acme/app/pull/42|#42> _@alice_\n* Dark mode toggle <https://github.com/acme/app/pull/43|#43> _@bob_\n* Pagination for list endpoints <https://github.com/acme/app/pull/44|#44> _@charlie_"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":zap: *Performance*\n* API response time: 340ms -> 204ms (-40%) <https://github.com/acme/app/pull/47|#47>\n* Bundle size: 1.2MB -> 924KB (-23%) <https://github.com/acme/app/pull/48|#48>"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":bug: *Bug Fixes*\n* Login timeout on slow connections <https://github.com/acme/app/pull/45|#45> _@dave_\n* Memory leak in event listeners <https://github.com/acme/app/pull/46|#46> _@eve_"
      }
    },
    { "type": "divider" },
    {
      "type": "context",
      "elements": [
        { "type": "mrkdwn", "text": ":busts_in_silhouette: `@alice` (3) `@bob` (2) :star: `@charlie` (1) :star: `@dave` (1) `@eve` (1) `@sarah` (2)" }
      ]
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View Full Release Notes" },
          "url": "https://github.com/acme/app/releases/tag/v2.1.0",
          "style": "primary"
        },
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View Changelog" },
          "url": "https://github.com/acme/app/compare/v2.0.0...v2.1.0"
        }
      ]
    }
  ]
}
```

---

### 4. Discord Rich Embeds

Color-coded embeds with fields layout. Each section gets its own embed with a distinct color.

```json
{
  "username": "Release Bot",
  "avatar_url": "https://github.com/acme/app/blob/main/assets/logo.png",
  "embeds": [
    {
      "title": "Release v2.1.0 -- The Security & Speed Update",
      "url": "https://github.com/acme/app/releases/tag/v2.1.0",
      "color": 5763719,
      "description": "3 features, 2 bug fixes, 1 breaking change.\nAPI response time reduced by 40%. Bundle size down 23%.",
      "fields": [
        { "name": "Version", "value": "v2.1.0", "inline": true },
        { "name": "Date", "value": "2025-01-15", "inline": true },
        { "name": "Commits", "value": "14", "inline": true },
        { "name": "Contributors", "value": "6", "inline": true }
      ],
      "footer": { "text": "Auto-generated by AI Release Notes" },
      "timestamp": "2025-01-15T10:30:00Z"
    },
    {
      "title": ":warning: Breaking Changes",
      "color": 15554053,
      "fields": [
        {
          "name": "Removed /api/v1/users endpoint",
          "value": "**Scope:** `api` | **Severity:** major\n**Migration:** Use `/api/v2/users` instead\n**Details:** [#40](https://github.com/acme/app/pull/40)"
        }
      ]
    },
    {
      "title": ":rocket: New Features",
      "color": 5763719,
      "fields": [
        {
          "name": "User avatar upload API",
          "value": "Upload profile avatars via `POST /api/v2/users/:id/avatar`. JPEG, PNG, WebP up to 5MB. [#42](...) by `@alice`"
        },
        {
          "name": "Dark mode toggle",
          "value": "System-aware dark mode in user settings. Respects OS preference. [#43](...) by `@bob`"
        },
        {
          "name": "Pagination for list endpoints",
          "value": "Every list endpoint supports `page` and `limit`. Default 50/page. [#44](...) by `@charlie`"
        }
      ]
    },
    {
      "title": ":zap: Performance",
      "color": 8250df,
      "fields": [
        { "name": "API response time", "value": "340ms -> 204ms (**-40%**)", "inline": true },
        { "name": "Bundle size", "value": "1.2MB -> 924KB (**-23%**)", "inline": true }
      ]
    },
    {
      "title": ":bug: Bug Fixes",
      "color": 3447003,
      "fields": [
        { "name": "Login timeout on slow connections", "value": "Progressive polling with 60s max. [#45](...) by `@dave`", "inline": true },
        { "name": "Memory leak in event listeners", "value": "Fixed ~2MB/hr leak. [#46](...) by `@eve`", "inline": true }
      ]
    },
    {
      "title": ":busts_in_silhouette: Contributors",
      "color": 5793266,
      "description": "`@alice` (3 commits) | `@bob` (2) :star: | `@charlie` (1) :star: | `@dave` (1) | `@eve` (1) | `@sarah` (2)",
      "footer": { "text": ":star: = First contribution!" }
    }
  ]
}
```

---

### 5. Twitter/X Thread (7 Tweets)

Optimized for engagement. Thread format with hook, features, performance, breaking changes, and CTA.

```json
[
  "1/7 v2.1.0 is HERE.\n\n3 features. 2 bug fixes. 40% faster APIs.\nThe biggest update since our launch.\n\nHere's everything (and one breaking change): >>>",
  "2/7 :rocket: New in v2.1.0:\n\n- Avatar uploads (JPEG, PNG, WebP up to 5MB) #42\n- Dark mode (system-aware, respects OS preference) #43\n- Pagination on ALL list endpoints (50/page default) #44\n\nYes, dark mode. We heard you.",
  "3/7 :zap: Performance:\n\nAPI response time: 340ms -> 204ms (-40%)\nBundle size: 1.2MB -> 924KB (-23%)\n\nThat's not a typo. Your app just got significantly faster.",
  "4/7 :wrench: Bugs squashed:\n\n- Login no longer times out on slow connections #45\n- Fixed memory leak eating ~2MB/hr in event listeners #46\n\nYour apps will thank you.",
  "5/7 :rotating_light: BREAKING CHANGE:\n\n/api/v1/users is GONE.\nUse /api/v2/users instead.\nMigration guide is in the full release notes. We've got your back.",
  "6/7 Contributors: @alice (3) @bob (2) :tada: @charlie (1) :tada: @dave (1) @eve (1) @sarah (2)\n\n:tada: = First time contributors!\n\nFull changelog:\ngithub.com/acme/app/compare/v2.0.0...v2.1.0\n\n#ReleaseNotes #OpenSource #Changelog",
  "7/7 That's v2.1.0!\n\nnpm install your-package@2.1.0\n\nStar us on GitHub if this saved you time!\nFeedback? Reply to this thread."
]
```

---

### 6. Compact Mode

Minimal. Every word counts. For changelogs, feeds, and SMS notifications.

```
v2.1.0 (2025-01-15) -- 3 features, 2 fixes, 1 breaking

BREAKING: /api/v1/users removed -> use /api/v2/users (#40 @sarah)
FEAT: Avatar upload API - JPEG/PNG/WebP up to 5MB (#42 @alice)
FEAT: Dark mode toggle - system-aware (#43 @bob)
FEAT: Pagination on list endpoints - 50/page default (#44 @charlie)
PERF: API response time -40% (340ms->204ms) (#47)
PERF: Bundle size -23% (1.2MB->924KB) (#48)
FIX: Login timeout on slow connections (#45 @dave)
FIX: Memory leak in event listeners (#46 @eve)

Contributors: @alice @bob @charlie @dave @eve @sarah
https://github.com/acme/app/compare/v2.0.0...v2.1.0
```

---

## Tone Examples

The same release opening line in all four tones:

| Tone | Opening Line |
|:-----|:-------------|
| :briefcase: **Professional** | "We are pleased to announce the release of version 2.1.0, which includes significant improvements to security and performance across the platform. This release contains 3 new features, 2 bug fixes, and 1 breaking change." |
| :wave: **Casual** | "v2.1.0 just dropped! We've got avatar uploads, dark mode, and pagination. Plus we squashed two annoying bugs and made everything 40% faster. Heads up: there's one breaking change." |
| :joy: **Humorous** | "Plot twist: v2.1.0 is here and it's bringing gifts. Dark mode (because we know you code at 3AM), avatar uploads (time to ditch the default silhouette), and pagination (because loading 10,000 results was... a choice). We also evicted two bugs from the premises." |
| :gear: **Technical** | "`v2.1.0` (MINOR bump -- contains 1 breaking change in `api` scope). Core changes: new avatar upload endpoint (`POST /api/v2/users/:id/avatar`), CSS media query dark mode, cursor-based pagination on all list endpoints. Auth timeout: 10s -> 60s with progressive polling." |

Full tone comparison for every section:

| Section | :briefcase: Professional | :wave: Casual | :joy: Humorous | :gear: Technical |
|:--------|:-------------------------|:--------------|:---------------|:-----------------|
| **Opening** | "We are pleased to announce..." | "v2.1.0 just dropped!" | "Plot twist: v2.1.0 is here..." | "`v2.1.0` (MINOR -- contains breaking changes)" |
| **Features** | "New Features" -- formal descriptions with scope tags | "What's New" -- friendly, conversational | "Things That Are New and Shiny" -- playful commentary | "`feat:` New Features" -- commit-style with technical details |
| **Fixes** | "Bug Fixes and Resolutions" -- clinical, detailed | "Bug Squashes" -- "Login should stop timing out now" | "Bugs We Sent to Bug Heaven" -- irreverent fun | "`fix:` Bug Fixes" -- root cause + resolution |
| **Breaking** | "This release introduces a change to the public API that may require migration..." | "Heads up! We changed something that might affect you..." | "Plot twist: we broke something on purpose..." | "`[api] BREAKING:` Removed endpoint with before/after code" |
| **Perf** | "Performance Improvements" -- benchmarks cited | "Speed Boosts" -- "Things are faster now!" | "We Made It Go Brrr" -- meme-friendly | "`perf:` Performance Optimizations" -- specific metrics |
| **Security** | "Security Enhancements" -- CVE references | "Security Fixes" -- "Your stuff is safer now" | "Fort Knox Mode: Activated" -- dramatic | "`security:` Security Patches" -- advisory links |
| **Docs** | "Documentation Updates" -- formal | "Docs & Guides" -- helpful tone | "Words About Code" -- self-aware | "`docs:` Documentation" -- changelog entries |
| **Tests** | "Test Coverage Improvements" | "Test Improvements" -- "More tests!" | "We Actually Test Things Now" | "`test:` Test Suite" -- coverage metrics |
| **Chores** | "Maintenance and Infrastructure" | "Housekeeping" | "Things Nobody Sees But Everyone Needs" | "`chore:` Build/CI/Maintenance" |
| **Contributors** | Formal table with commit counts | Friendly shout-outs with emojis | "The heroes who made this happen" | Committer list with email hashes |

---

## Configuration

### Inputs

Every parameter you can configure:

| Input | Description | Required | Default | Example |
|:------|:------------|:--------|:--------|:--------|
| `github-token` | GitHub token for API access (repo + releases) | Yes | -- | `${{ secrets.GITHUB_TOKEN }}` |
| `api-key` | OpenAI-compatible API key. Remove for template-only mode | No | -- | `sk-...` |
| `api-base` | Custom API endpoint (Ollama, Azure, etc.) | No | `https://api.openai.com/v1` | `http://localhost:11434/v1` |
| `model` | AI model for natural language generation | No | `gpt-4o-mini` | `gpt-4o`, `llama3` |
| `template` | Output template | No | `default` | `minimal`, `detailed`, `enterprise`, `fun` |
| `commit-mode` | How to collect changes | No | `auto` | `commits`, `pull-requests` |
| `version-from` | How to determine version number | No | `tag` | `package-json`, `manual` |
| `version` | Manual version (when `version-from` is `manual`) | No | -- | `v2.0.0` |
| `previous-tag` | Previous release tag (auto-detected if omitted) | No | Auto | `v1.9.0` |
| `max-commits` | Maximum commits to analyze (prevents token overflow) | No | `200` | `50`, `500` |
| `language` | Output language | No | `en` | `es`, `fr`, `de`, `ja`, `ko`, `zh`, `pt`, `ru` |
| `categories` | Custom categories as JSON array | No | `auto` | `[{"label":"Features","patterns":["feat"]}]` |
| `include-breaking` | Include BREAKING CHANGE section | No | `true` | `false` |
| `include-contributors` | Include contributor acknowledgments | No | `true` | `false` |
| `include-diff-stats` | Include file change statistics | No | `true` | `false` |
| `include-screenshots` | Detect and include PR screenshots | No | `true` | `false` |
| `dry-run` | Generate notes without creating a release | No | `false` | `true` |
| `slack-webhook` | Slack webhook URL for auto-posting | No | -- | `https://hooks.slack.com/...` |
| `discord-webhook` | Discord webhook URL for auto-posting | No | -- | `https://discord.com/api/webhooks/...` |
| `twitter-consumer-key` | Twitter API consumer key | No | -- | -- |
| `twitter-consumer-secret` | Twitter API consumer secret | No | -- | -- |
| `twitter-access-token` | Twitter API access token | No | -- | -- |
| `twitter-access-secret` | Twitter API access token secret | No | -- | -- |
| `update-changelog` | Auto-update CHANGELOG.md | No | `false` | `true` |
| `changelog-path` | Path to changelog file | No | `CHANGELOG.md` | `docs/CHANGES.md` |

### Outputs

| Output | Description | Example |
|:-------|:------------|:--------|
| `version` | The calculated/extracted version number | `v2.1.0` |
| `release-notes` | Generated release notes in markdown | *(full markdown output)* |
| `release-url` | URL of the created GitHub Release | `https://github.com/acme/app/releases/tag/v2.1.0` |
| `summary` | One-line summary of the release | `3 features, 2 fixes, 1 breaking change` |
| `changelog` | Generated CHANGELOG.md content | *(full changelog)* |

---

## Architecture

How AI Release Notes works under the hood:

```
+=====================================================================+
|                         AI RELEASE NOTES                             |
|                     The Complete Pipeline                            |
+=====================================================================+
|                                                                     |
|  +------------------+                                               |
|  |  Git Trigger      |  tag push / workflow_dispatch / CLI          |
|  +--------+---------+                                              |
|           |                                                         |
|           v                                                         |
|  +================================================================+ |
|  |                   COMMIT ANALYSIS ENGINE                       | |
|  |                                                                | |
|  |  +--------------+  +-------------+  +---------------------+  | |
|  |  | Categorizer   |  | Semver      |  | Breaking Change     |  | |
|  |  |               |  | Calculator  |  | Detector            |  | |
|  |  | feat: -> feat |  |             |  |                     |  | |
|  |  | fix:   -> fix |  | feat -> min |  | 1. ! suffix        |  | |
|  |  | docs:  -> docs|  | fix   -> pat|  | 2. BREAKING CHANGE |  | |
|  |  | perf:  -> perf|  | break -> maj|  | 3. breaking: prefix|  | |
|  |  | Custom JSON   |  |             |  | 4. API keywords    |  | |
|  |  | categories    |  | Version     |  | 5. Code diff       |  | |
|  |  +-------+------+  +------+------+  +---------+----------+  | |
|  |          |                 |                   |              | |
|  |          +------+ +--------+------+             |              | |
|  |                 | |               |             |              | |
|  |                 v v               v             v              | |
|  |          +--------------+  +--------------------------+       | |
|  |          |  AI Writer   |  |  Migration Guide Gen     |       | |
|  |          |  (OpenAI)    |  |  - Before/After code     |       | |
|  |          |              |  |  - Migration steps        |       | |
|  |          |  OR          |  |  - Deprecation timeline   |       | |
|  |          |  Template    |  |  - Upgrade commands       |       | |
|  |          |  Engine      |  |  - Severity rating        |       | |
|  |          +-------+------+  +-----------+--------------+       | |
|  +==================+=====================+======================+ |
|                     |                    |                        |
|                     v                    v                        |
|  +================================================================+ |
|  |                   OUTPUT FORMATTERS                            | |
|  |                                                                | |
|  |  +--------+  +--------+  +--------+  +---------+  +---------+ | |
|  |  |  MD    |  |  HTML  |  | SLACK  |  | DISCORD |  | TWITTER | | |
|  |  | GitHub |  | Email  |  | Block  |  | Rich    |  | /X      | | |
|  |  | GitLab |  | Ready  |  | Kit    |  | Embeds  |  | Thread  | | |
|  |  +--------+  +--------+  +--------+  +---------+  +---------+ | |
|  |                                                                | |
|  |  +-------------+  +-----------+  +---------+  +------------+ | |
|  |  | TONE ENGINE  |  | LANGUAGE  |  | COMPACT |  | CUSTOM     | | |
|  |  | 4 tones      |  | 9 locales |  | MODE    |  | TEMPLATES  | | |
|  |  +-------------+  +-----------+  +---------+  +------------+ | |
|  +==============================+================================+ |
|                                 |                                  |
|                                 v                                  |
|  +================================================================+ |
|  |                   INTEGRATIONS                                | |
|  |                                                                | |
|  |  +----------+  +----------+  +----------+  +---------------+  | |
|  |  | GitHub   |  | Slack &  |  | Twitter/ |  | CHANGELOG.md  |  | |
|  |  | Release  |  | Discord  |  | X Post   |  | Auto-Update   |  | |
|  |  | Create   |  | Webhook  |  | Thread   |  | Git Commit    |  | |
|  |  +----------+  +----------+  +----------+  +---------------+  | |
|  +================================================================+ |
+=====================================================================+
```

---

## Breaking Change Detection

The analyzer detects breaking changes through **5 independent methods**, running in parallel for maximum coverage:

### Method 1: Conventional Commit `!` Suffix

```bash
feat!: redesigned the entire authentication API
fix(auth)!: changed login function signature
refactor(core)!: rewrote plugin system
```

Any commit type with `!` between the type and `:` is flagged as breaking.

### Method 2: BREAKING CHANGE Footer

```bash
feat: add new caching layer

BREAKING CHANGE: The cache key format has changed from
`{userId}:{key}` to `{tenant}:{userId}:{key}`. All cached
data will be invalidated on upgrade.

Migration: Clear your Redis cache after upgrading.
```

Standard conventional commit footer. Multi-line descriptions supported.

### Method 3: `breaking:` Prefix

```bash
breaking: removed support for Node.js 14
breaking(api): deprecated v1 endpoints, use v2
```

Explicit breaking change commits that don't follow conventional format.

### Method 4: Deprecation Keywords

```bash
refactor: remove deprecated getUser() method
feat: rename validateInput to validatePayload
docs: deprecating the legacy callback API
```

Detects `remove`, `rename`, `deprecat(e|ed|ing)` followed by method/function/API names using pattern matching.

### Method 5: Code Analysis

```bash
# Detected automatically from the diff:
- Removed export files (deleted index.ts in public API)
- Large deletion ratios (>60% lines removed in a file)
- Public API modifications (changed function signatures in exported modules)
```

Static analysis of the actual diff to detect structural breaking changes.

### What Each Breaking Change Includes

| Field | Description |
|:------|:------------|
| Description | Human-readable explanation of what broke and why |
| Scope | Affected module/area (e.g., `api`, `auth`, `core`) |
| Severity | `major`, `minor`, or `patch` impact level |
| PR Reference | Link to the pull request with author |
| Migration Guide | Step-by-step upgrade instructions |
| Before Code | Working code from the previous version |
| After Code | Updated code for the new version |
| Affected APIs | List of changed function/class signatures |
| Timeline | Deprecation schedule with key dates |
| Upgrade Commands | Package-specific commands (`npm`, `yarn`, `pnpm`) |

---

## Detailed Setup Guides

<details>
<summary><strong>:brain: AI Provider Configuration</strong></summary>

### OpenAI (Default)

```yaml
- uses: USERNAME/ai-release-notes@v1
  with:
    api-key: ${{ secrets.OPENAI_API_KEY }}
    model: gpt-4o-mini  # or gpt-4o, gpt-4-turbo
```

### Azure OpenAI

```yaml
- uses: USERNAME/ai-release-notes@v1
  with:
    api-key: ${{ secrets.AZURE_OPENAI_KEY }}
    api-base: https://your-resource.openai.azure.com/openai/deployments/your-deployment
    model: gpt-4o
```

### Local LLM (Ollama, LM Studio)

```yaml
- uses: USERNAME/ai-release-notes@v1
  with:
    api-key: not-needed
    api-base: http://localhost:11434/v1
    model: llama3
```

### Any OpenAI-Compatible API

```yaml
- uses: USERNAME/ai-release-notes@v1
  with:
    api-key: ${{ secrets.CUSTOM_API_KEY }}
    api-base: https://your-api.example.com/v1
    model: your-model-name
```

### Without AI Key (Template Engine)

```yaml
- uses: USERNAME/ai-release-notes@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    # No api-key needed -- uses intelligent template-based generation
```

Works offline. No API calls. Still generates great release notes using conventional commit analysis and templates.

</details>

<details>
<summary><strong>:package: Node.js Library API</strong></summary>

### Programmatic Usage

```javascript
import { generateReleaseNotes } from 'ai-release-notes';

// Basic usage
const result = await generateReleaseNotes({
  owner: 'USERNAME',
  repo: 'your-repo',
  fromTag: 'v1.0.0',
  toTag: 'v1.1.0',
  githubToken: process.env.GITHUB_TOKEN,
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(result.releaseNotes);  // Markdown string
console.log(result.version);       // 'v1.1.0'
console.log(result.summary);       // One-line summary
console.log(result.releaseUrl);    // GitHub Release URL

// With all options
const result = await generateReleaseNotes({
  owner: 'USERNAME',
  repo: 'your-repo',
  fromTag: 'v1.0.0',
  toTag: 'v1.1.0',
  githubToken: process.env.GITHUB_TOKEN,
  apiKey: process.env.OPENAI_API_KEY,
  apiBase: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  tone: 'professional',
  language: 'en',
  template: 'detailed',
  includeBreaking: true,
  includeContributors: true,
  includeDiffStats: true,
  maxCommits: 200,
});
```

### Get Specific Formats

```javascript
import {
  generateReleaseNotes,
  formatSlack,
  formatDiscord,
  formatTwitter,
  formatHTML,
  formatCompact,
} from 'ai-release-notes';

const result = await generateReleaseNotes({ /* ... */ });

// Get different formats from the same analysis
const slack = formatSlack(result.analysis);
const discord = formatDiscord(result.analysis);
const twitter = formatTwitter(result.analysis);
const html = formatHTML(result.analysis);
const compact = formatCompact(result.analysis);
```

</details>

---

## Development

```bash
# Install dependencies
npm install

# Run the full test suite (148 tests)
npm test

# Build the bundled action
npm run build

# Lint source code
npm run lint

# Format with Prettier
npm run format
```

### Test Coverage

| Suite | Tests | Coverage |
|:------|:------|:---------|
| Commit Analysis | 32 | Categorization, conventional commits, grouping |
| Breaking Change Detection | 28 | All 5 detection methods, severity, migration |
| Format Generation | 24 | Markdown, HTML, Slack, Discord, Twitter, Compact |
| Tone Adjustment | 16 | Professional, Casual, Humorous, Technical |
| Language Support | 18 | All 9 languages |
| Version Calculation | 14 | Semver bumps, tag parsing, package.json |
| Integration | 16 | GitHub API, webhooks, CLI, library |

**Total: 148 tests passing**

---

## Roadmap

- [ ] GitLab and Bitbucket support
- [ ] Notion integration for release documentation
- [ ] Email templates for subscriber notifications
- [ ] RSS feed generation
- [ ] Custom template system with Handlebars
- [ ] Multi-repo / monorepo support
- [ ] Release notes diff comparison (v1 vs v2 output)
- [ ] Contributor recognition with GitHub avatar images
- [ ] Automatic social media image generation (og:image)
- [ ] Linear/Jira issue linking from commit references
- [ ] Release health scoring (coverage, breaking change ratio)
- [ ] AI-powered release title generation

---

## Contributing

We love contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Write tests** for your feature (we have 148 tests and counting)
4. **Run** `npm test && npm run build` to verify everything passes
5. **Submit** a pull request with a clear description

Please ensure:
- All tests pass (`npm test`)
- Code is linted (`npm run lint`)
- Code is formatted (`npm run format`)
- New features include test coverage

### Contribution Ideas

- New output formats (Notion, Confluence, Jira)
- New languages (Arabic, Hindi, Turkish, Vietnamese)
- New tone modes (Excited, Concise, Executive)
- AI provider integrations (Anthropic, Google, Cohere)
- Template system improvements
- Documentation and examples

---

## License

MIT License -- use it however you want. See [LICENSE](LICENSE) for details.

---

<div align="center">

<br />

### Stop writing release notes. Start shipping them.

**[Get Started in 30 Seconds](#-quick-start-30-seconds)** &bull; **[See All Formats](#-output-examples)** &bull; **[Compare Alternatives](#-comparison)**

<br /><br />

</div>
