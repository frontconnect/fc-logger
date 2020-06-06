import { LOG_LEVEL } from './LogLevel.js';
import { LogEntry } from './LogEntry.js';
import { EventBus } from '../EventBus.js';

export class Logger {
  #minLevel: number = LOG_LEVEL.trace;
  readonly #moduleName: string;

  constructor(moduleName: string, minLevel: number) {
    this.#moduleName = moduleName;
    this.#minLevel = minLevel;
  }

  private log(logLevel: number, message: any): void {
    if (logLevel < this.#minLevel) return;
    const logEntry: LogEntry = {
      logLevel: logLevel,
      moduleName: this.#moduleName,
      message,
    };

    // Obtain the line/file through a thoroughly hacky method
    // This creates a new stack trace and pulls the caller from it.  If the caller
    // if .trace()
    const error = new Error('');
    if (error.stack) {
      const lines = error.stack.split('\n');
      const locationIndex = lines.findIndex((line) => {
        return (line.includes(`at Logger.${LOG_LEVEL[logEntry.logLevel]}`))
      });
      logEntry.location = lines[locationIndex + 1];
    }

    EventBus.dispatchEvent('log', logEntry);
  }

  public trace(message: any): void {
    this.log(LOG_LEVEL.trace, message);
  }
  public debug(message: any): void {
    this.log(LOG_LEVEL.debug, message);
  }
  public info(message: any): void  {
    this.log(LOG_LEVEL.info, message);
  }
  public warn(message: any): void  {
    this.log(LOG_LEVEL.warn, message);
  }
  public error(message: any): void {
    this.log(LOG_LEVEL.error, message);
  }
}

