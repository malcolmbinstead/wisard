//
import { Injectable } from '@angular/core';
//
@Injectable({
  providedIn: 'root'
})
export class LogService {
  // ----
  private itsLog: string[] = [];
  private itsLimit = 4;
  // ----
  /**
   * Constructor.
   */
  constructor() {
    this.add('log:');
  }
  /**
   * Change the message count limit.
   */
  setLimit(theLimit: number) {
    this.itsLimit = Math.max(theLimit, 1);
    this.truncate();
  }
  /**
   * Get the message count limit.
   */
  getLimit(): number {
    return this.itsLimit;
  }
  /**
   * Add a message to the log.
   */
  add(theMessage: string) {
    //
    console.log(theMessage);
    //
    this.itsLog.push(theMessage);
    this.truncate();
  }
  /**
   * Keep the message list within limits.
   */
  private truncate() {
    // discard excess lines.
    while (this.itsLog.length > this.itsLimit) {
      this.itsLog.shift();
    }
  }
  /**
   * Clear the message list.
   */
  clear() {
    this.itsLog.length = 0;
  }
  /**
   * What is the current length of the message list.
   */
  getLength(): number {
    return this.itsLog.length;
  }
  /**
   * Access an item from the message list.
   */
  getItem(theIndex: number): string {
    let aReturn = '';
    const aLength = this.itsLog.length;
    if (theIndex >= 0 && theIndex < aLength) {
      aReturn = this.itsLog[theIndex];
    }
    return aReturn;
  }
  /**
   *
   */
  getItems(): string[] {
    return this.itsLog;
  }
  // ----
}

