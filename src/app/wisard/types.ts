// tslint:disable:no-redundant-jsdoc
/**
 * Local test.
 * @param theObj
 */
function isValid(theObj: any): boolean {
  return theObj !== null && theObj !== undefined;
}
// ----
/**
 * Location defined by x and y.
 */
export class Txy {
  // ----
  x = 0.0;
  y = 0.0;
  // ----
  /**
   *
   */
  constructor(theX?: number, theY?: number) {
    this.set(theX, theY);
  }
  /**
   *
   */
  set(theX?: number, theY?: number) {
    if (isValid(theX)) {
      this.x = theX;
    }
    if (isValid(theY)) {
      this.y = theY;
    }
  }
  /**
   *
   */
  getArray(): number[] {
    const aReturn: number[] = [];
    aReturn.push(this.x);
    aReturn.push(this.y);
    return aReturn;
  }
  /**
   *
   */
  toString(): string {
    return 'Txy(' + this.x + ',' + this.y + ')';
  }
  //
}
// ----
/**
 * Rectangle defined by origin, width and height.
 */
export class Txywh {
  // ----
  x = 0.0;
  y = 0.0;
  w = 1.0;
  h = 1.0;
  // ----
  /**
   *
   * @param theX
   * @param theY
   * @param theW
   * @param theH
   */
  constructor(theX?: number, theY?: number, theW?: number, theH?: number) {
    this.set(theX, theY, theW, theH);
  }
  /**
   *
   */
  set(theX?: number, theY?: number, theW?: number, theH?: number) {
    if (isValid(theX)) {
      this.x = theX;
    }
    if (isValid(theY)) {
      this.y = theY;
    }
    if (isValid(theW)) {
      this.w = theW;
    }
    if (isValid(theH)) {
      this.h = theH;
    }
  }
  /**
   * Test to see if a point falls inside this region.
   */
  isInside(theXY: Txy): boolean {
    const aX = theXY.x;
    const aX1 = this.x;
    if (aX < aX1) { return false; }
    const aX2 = aX1 + this.w;
    if (aX > aX2) { return false; }
    const aY = theXY.y;
    const aY1 = this.y;
    if (aY < aY1) { return false; }
    const aY2 = aY1 + this.h;
    if (aY > aY2) { return false; }
    return true;
  }
  /**
   *
   */
  toString(): string {
    return 'Txywh(' + this.x + ',' + this.y + ',' + this.w + ',' + this.h + ')';
  }
  //
}
// ----
/**
 * Collection of XY locations.
 */
export class TArrayXY {
  // ----
  data: Txy[] = [];
  // ----
  /**
   *
   */
  constructor() { }
  /**
   *
   */
  clear() {
    this.data = [];
  }
  /**
   *
   */
  getLength(): number {
    return this.data.length;
  }
  /**
   * Add multiple points to the array.
   * @param theA
   * @param theB
   * @param theC
   * @param theD
   */
  add(theA?: Txy, theB?: Txy, theC?: Txy, theD?: Txy) {
    if (isValid(theA)) {
      this.data.push(theA);
    }
    if (isValid(theB)) {
      this.data.push(theB);
    }
    if (isValid(theC)) {
      this.data.push(theC);
    }
    if (isValid(theD)) {
      this.data.push(theD);
    }
  }
  /**
   * Get a copy of the contents as a 1D array of Number.
   */
  getArray(): number[] {
    const aReturn: number[] = [];
    const aLength = this.data.length;
    for (let aI = 0; aI < aLength; aI++) {
      const aItem = this.data[aI];
      aReturn.push(aItem.x);
      aReturn.push(aItem.y);
    }
    return aReturn;
  }
  //
}
// ----
/**
 * Collection of XYWH locations.
 */
export class TArrayXYWH {
  // ----
  data: Txywh[] = [];
  // ----
  /**
   *
   */
  constructor() { }
  /**
   *
   */
  clear() {
    this.data = [];
  }
  /**
   *
   */
  getLength(): number {
    return this.data.length;
  }
  /**
   * Add multiple points to the array.
   * @param theA
   * @param theB
   * @param theC
   * @param theD
   */
  add(theA?: Txywh, theB?: Txywh, theC?: Txywh, theD?: Txywh) {
    if (isValid(theA)) {
      this.data.push(theA);
    }
    if (isValid(theB)) {
      this.data.push(theB);
    }
    if (isValid(theC)) {
      this.data.push(theC);
    }
    if (isValid(theD)) {
      this.data.push(theD);
    }
  }
  /**
   * Get a copy of the contents as a 1D array of Number.
   */
  getArray(): number[] {
    const aReturn: number[] = [];
    const aLength = this.data.length;
    for (let aI = 0; aI < aLength; aI++) {
      const aItem = this.data[aI];
      aReturn.push(aItem.x);
      aReturn.push(aItem.y);
      aReturn.push(aItem.w);
      aReturn.push(aItem.h);
    }
    return aReturn;
  }
  /**
   * Check to see if a point falls inside any of the regions
   * stored in this array.
   * If a match is found this method returns the index of the first match,
   * if a match is not found it returns a value of -1.
   */
  isInside(theXY: Txy): number {
    let aFound = -1;
    const aLength = this.data.length;
    for (let aI = 0; aI < aLength; aI++) {
      const aItem = this.data[aI];
      if (aItem.isInside(theXY)) {
        aFound = aI;
        break;
      }
    }
    return aFound;
  }
}
// ----
