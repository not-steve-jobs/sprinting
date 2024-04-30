import {logInfo, parseProcessingTime} from './seed.utils';

/**
 * A simple Stopwatch class used to measure the elapsed time between two events
 */
export class Stopwatch {
  startTime: number;
  endTime: number;
  logIndent: number;

  constructor(logIndent = 4) {
    this.logIndent = logIndent;
    this.start();
  }

  start() {
    this.startTime = Date.now();
  }

  stop() {
    this.endTime = Date.now();
  }

  logElapsedTime(message?: string) {
    if (message) {
      logInfo(message, this.logIndent);
    }

    logInfo(`time:  ${parseProcessingTime(this.endTime - this.startTime)}`, this.logIndent);
  }

  stopAndLogElapsedTime(message?: string) {
    this.stop();
    this.logElapsedTime(message);
  }
}
