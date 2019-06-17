// tslint:disable:no-redundant-jsdoc
/**
 * Pseudo Random Number Generator.
 */
export class PRNG {
  //
  private itsSeed = 0;
  private itsState = 0;
  /**
   *
   * @param theSeed
   */
  constructor(theSeed: number) {
    this.itsSeed = theSeed;
    this.reset();
  }
  /**
   *
   */
  reset() {
    this.itsState = this.itsSeed % 2147483647;
    if (this.itsState <= 0) {
      this.itsState += 2147483646;
    }
  }
  /**
   * Get the next random number in the range 1 and 2^32 - 2.
   */
  next(): number {
    this.itsState = (this.itsState * 16807) % 2147483647;
    return this.itsState;
  }
  /**
   * Get the next random number in the range 0 to N-1.
   * @param theN
   */
  nextRange(theN: number): number {
    return this.next() % theN;
  }
  //
}
