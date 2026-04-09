'use strict';

const logger = require('./logger');

/**
 * Get contributors from commits and PRs.
 * Detects first-time contributors, counts contributions, sorts by count.
 */
function getContributors(commits, prs) {
  const contributorMap = new Map();

  // Collect from commits
  if (commits && Array.isArray(commits)) {
    for (const commit of commits) {
      try {
        const author = commit.author || (commit.commit && commit.commit.author) || {};
        const login =
          author.login ||
          (author.name) ||
          '';
        const avatarUrl = author.avatar_url || '';
        const name = author.name || author.login || login;

        if (!login) continue;

        if (contributorMap.has(login)) {
          const existing = contributorMap.get(login);
          existing.commits_count += 1;
        } else {
          contributorMap.set(login, {
            login: login,
            name: name,
            avatar_url: avatarUrl,
            commits_count: 1,
            is_first_time: false,
          });
        }
      } catch (err) {
        logger.debug(`Failed to process commit author: ${err.message}`);
      }
    }
  }

  // Collect from PRs
  if (prs && Array.isArray(prs)) {
    for (const pr of prs) {
      try {
        const user = pr.user || {};
        const login = user.login || '';
        if (!login) continue;

        if (contributorMap.has(login)) {
          contributorMap.get(login).commits_count += 1;
        } else {
          contributorMap.set(login, {
            login: login,
            name: user.name || login,
            avatar_url: user.avatar_url || '',
            commits_count: 1,
            is_first_time: false,
          });
        }

        // Add reviewers
        if (pr.requested_reviewers && Array.isArray(pr.requested_reviewers)) {
          for (const reviewer of pr.requested_reviewers) {
            const rLogin = reviewer.login || '';
            if (!rLogin) continue;
            if (!contributorMap.has(rLogin)) {
              contributorMap.set(rLogin, {
                login: rLogin,
                name: reviewer.name || rLogin,
                avatar_url: reviewer.avatar_url || '',
                commits_count: 0,
                is_first_time: false,
              });
            }
          }
        }
      } catch (err) {
        logger.debug(`Failed to process PR contributor: ${err.message}`);
      }
    }
  }

  // Sort by contribution count (descending)
  const contributors = Array.from(contributorMap.values()).sort(
    (a, b) => b.commits_count - a.commits_count
  );

  return contributors;
}

/**
 * Detect first-time contributors by comparing against known contributors from previous releases.
 */
function detectFirstTimers(contributors, previousContributors) {
  const previousSet = new Set((previousContributors || []).map(c => c.login || c));

  return contributors.map(c => ({
    ...c,
    is_first_time: !previousSet.has(c.login),
  }));
}

/**
 * Format a contributor thanks string.
 * Example: "Thanks to @user1, @user2, @user3 and @user4 for their contributions!"
 */
function formatContributorThanks(contributors) {
  if (!contributors || contributors.length === 0) {
    return '';
  }

  const firstTimers = contributors.filter(c => c.is_first_time);
  const allLogins = contributors.map(c => `@${c.login}`);

  let thanks = '';
  if (allLogins.length === 1) {
    thanks = `Thanks to ${allLogins[0]} for this release!`;
  } else if (allLogins.length === 2) {
    thanks = `Thanks to ${allLogins[0]} and ${allLogins[1]} for their contributions!`;
  } else if (allLogins.length <= 5) {
    const last = allLogins.pop();
    thanks = `Thanks to ${allLogins.join(', ')} and ${last} for their contributions!`;
  } else {
    const displayed = allLogins.slice(0, 5);
    const remaining = allLogins.length - 5;
    thanks = `Thanks to ${displayed.join(', ')} and ${remaining} other contributor${remaining > 1 ? 's' : ''} for their contributions!`;
  }

  if (firstTimers.length > 0) {
    const firstTimerLogins = firstTimers.map(c => `@${c.login}`);
    thanks += `\n\n🎉 First-time contributors: ${firstTimerLogins.join(', ')}`;
  }

  return thanks;
}

module.exports = {
  getContributors,
  detectFirstTimers,
  formatContributorThanks,
};
