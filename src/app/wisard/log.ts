import { LogService } from '../log/log.service';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export class Log {
  //
  private static itsLog: LogService = null;
  /**
   *
   */
  private constructor() {}
  /**
   *
   */
  static setLog(theLog: LogService) {
    Log.itsLog = theLog;
  }
  /**
   *
   */
  static add(theMessage) {
    if (Log.itsLog !== null) {
      Log.itsLog.add(theMessage);
    }
  }
  //
}
