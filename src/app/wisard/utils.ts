import { Log } from './log';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export class Utils {
  /**
   * Do not construct.
   */
  private constructor() { }
  /**
   * Log a local message.
   * @param theMsg
   */
  private static log(theMsg) {
    Log.add(theMsg);
  }
  /**
   * Does an object exist.
   * @param theObj
   */
  static isValid(theObj: any): boolean {
    return theObj !== null && theObj !== undefined;
  }
  /**
   * Force a number to fall inside a min/max range.
   * @param theV
   * @param theMin
   * @param theMax
   */
  static forceRange(theV: number, theMin: number, theMax: number): number {
    let aV = theV;
    aV = Math.max(aV, theMin);
    aV = Math.min(aV, theMax);
    return aV;
  }
  /**
   * Convert a string of AN text into an array of ANs.
   * ANANAN => [AN][AN][AN]
   * @param theAlphaNum
   */
  static getAlphaNumArray(theAlphaNum: string): string[] {
    const aReturn: string[] = [];
    let aBody = theAlphaNum;
    for (; ;) {
      if (aBody.length === 0) { break; }
      const aHead = Utils.getAlphaNum(aBody);
      if (aHead.length === 0) { break; }
      aReturn.push(aHead);
      const aTail = aBody.slice(aHead.length);
      aBody = aTail;
    }
    return aReturn;
  }
  /**
   * split of the leading AlphaNum string.
   * @param theAphaNum
   */
  static getAlphaNum(theAlphaNum: string): string {
    let aReturn = '';
    const aLength = theAlphaNum.length;
    //
    // search for thefirst digit.
    let aIndex = 0;
    let aDigitFound = false;
    for (; aIndex < aLength; aIndex++) {
      const aCh = theAlphaNum.charAt(aIndex);
      if (Utils.isDigit(aCh) === true) {
        aDigitFound = true;
        break;
      }
    }
    if (aDigitFound) {
      // search for when the digits stop.
      let aAlphaFound = false;
      for (; aIndex < aLength; aIndex++) {
        const aCh = theAlphaNum.charAt(aIndex);
        if (Utils.isDigit(aCh) === false) {
          aAlphaFound = true;
          // return the start sequence.
          aReturn = theAlphaNum.slice(0, aIndex);
          break;
        }
      }
      if (aAlphaFound === false) {
        aReturn = theAlphaNum;
      }
    }
    return aReturn;
  }
  /**
   * If the first character in a string a digit.
   * @param theCh
   */
  static isDigit(theCh: string): boolean {
    let aReturn = false;
    if (theCh !== null && theCh !== undefined && theCh.length > 0) {
      const aCh = theCh[0];
      aReturn = aCh >= '0' && aCh <= '9';
    }
    return aReturn;
  }
  /**
   * If the first character in a string a leter of the alphabet.
   * @param theCh
   */
  static isAlpha(theCh: string): boolean {
    let aReturn = false;
    if (theCh !== null && theCh !== undefined && theCh.length > 0) {
      const aCh = theCh[0];
      const aLC = aCh >= 'a' && aCh <= 'z';
      const aUC = aCh >= 'A' && aCh <= 'Z';
      aReturn = aLC || aUC;
    }
    return aReturn;
  }
  /**
   * Convert to a number within the range min to max.
   * @param theN
   * @param theMin
   * @param theMax
   */
  static toN(theN: any, theMin?: number, theMax?: number): number {
    let aMin = 1;
    if (theMin !== undefined && theMin !== null) {
      aMin = theMin;
    }
    let aMax = 1000;
    if (theMax !== undefined && theMax !== null) {
      aMax = theMax;
    }
    let aN = aMin;
    if (theN !== undefined && theN !== null) {
      aN = theN;
    }
    if (aN < aMin) {
      aN = aMin;
    }
    if (aN > aMax) {
      aN = aMax;
    }
    return aN;
  }
  /**
   *
   * @param theW
   * @param theH
   * @param theN
   */
  static getAddrH(theW: number, theH: number, theN: number) {
    const aWH = theW * theH;
    const aH = Utils.toN(Math.ceil((aWH + 0.0) / (theN + 0.0)));
    return aH;
  }
  /**
   *
   * @param theSrc
   */
  static getHead(theSrc: string): string {
    let aReturn = '';
    if (Utils.isValid(theSrc)) {
      let aIndex = theSrc.indexOf(',');
      if (aIndex < 0) { aIndex = 0; }
      aReturn = theSrc.slice(0, aIndex);
    }
    return aReturn;
  }
  /**
   *
   * @param theSrc
   */
  static getTail(theSrc: string): string {
    let aReturn = '';
    if (Utils.isValid(theSrc)) {
      const aLength = theSrc.length;
      const aIndex = theSrc.indexOf(',');
      if (aIndex >= 0) {
        aReturn = theSrc.slice(aIndex + 1, aLength);
      }
    }
    return aReturn;
  }
  /**
   *
   */
  static parseInt(theV: string): number {
    let aReturn = parseInt(theV, 10);
    if (isNaN(aReturn)) {
      aReturn = 0;
    }
    return aReturn;
  }
  /**
   *
   */
  static parseFloat(theV: string): number {
    let aReturn = parseFloat(theV);
    if (isNaN(aReturn)) {
      aReturn = 0.0;
    }
    return aReturn;
  }
  /**
   * Check an object that should be a string array.
   * @param theV
   */
  static checkStringArray(theV: any): string[] {
    const aReturn: string[] = [];
    try {
      const aLength = theV.length;
      for (let aIndex = 0; aIndex < aLength; aIndex++) {
        const aV = theV[aIndex];
        aReturn.push(String(aV));
      }
    } catch (theE) {}
    return aReturn;
  }
  //
}
