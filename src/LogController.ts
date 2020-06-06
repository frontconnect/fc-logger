import { LOG_LEVEL } from './LogLevel.js';
import { LogOptions } from './LogOptions.js';
import { LogEntry } from './LogEntry.js';
import { Logger } from './Logger.js' ;
import { EventBus } from '../EventBus.js';

class LogControllerClass {
  #options: LogOptions = {
    minLevels: {
      '': LOG_LEVEL.debug,
    }
  }

  configure(logOptions: LogOptions): LogControllerClass {
    this.#options = {
      ...this.#options,
      ...logOptions,
    }
    return this;
  }

  getLogger(moduleName: string): Logger {
    const minLevel = this.#options.minLevels[moduleName];
    if (minLevel) return new Logger(moduleName, minLevel);

    return new Logger(moduleName, this.#options.minLevels['']);
  }

  private log(logEntry: LogEntry): void {
    const header = `${logEntry.location} [${logEntry.moduleName}]`;
    if (logEntry.logLevel == LOG_LEVEL.trace) {
      console.trace(header, logEntry.message);
    } else if (logEntry.logLevel == LOG_LEVEL.debug) {
      console.debug(header, logEntry.message);
    } else if (logEntry.logLevel == LOG_LEVEL.info) {
      console.info(header, logEntry.message);
    } else if (logEntry.logLevel == LOG_LEVEL.warn) {
      console.warn(header, logEntry.message);
    } else if (logEntry.logLevel == LOG_LEVEL.error) {
      console.error(header, logEntry.message);
    } else {
      console.log(`{${logEntry.logLevel}}`, logEntry.message);
    }
  }

  register() {
    if (EventBus.hasEvent('log')) return;
    EventBus.addEventListener('log', this.log.bind(this));
  }
}

export const LogController = new LogControllerClass();
