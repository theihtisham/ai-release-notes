'use strict';

const core = require('@actions/core');

class Logger {
  constructor(debugEnabled = false) {
    this.debugEnabled = debugEnabled;
  }

  debug(message, data) {
    if (this.debugEnabled) {
      core.debug(message);
      if (data) {
        core.debug(JSON.stringify(data, null, 2));
      }
    }
  }

  info(message) {
    core.info(message);
  }

  warn(message) {
    core.warning(message);
  }

  error(message, err) {
    if (err) {
      core.error(`${message}: ${err.message || err}`);
      if (err.stack && this.debugEnabled) {
        core.debug(err.stack);
      }
    } else {
      core.error(message);
    }
  }

  group(name) {
    core.startGroup(name);
  }

  groupEnd() {
    core.endGroup();
  }

  setDebugEnabled(enabled) {
    this.debugEnabled = enabled;
  }
}

module.exports = new Logger();
module.exports.Logger = Logger;
