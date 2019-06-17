//
import { IConfig } from './iconfig';
import { Consts } from './consts';
import { Utils } from './utils';
import { IMacros } from './imacros';
import { Macros } from './macros';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export class Config implements IConfig {
  //
  private itsLocked = false;
  private itsId = 0;
  private itsName = '';
  private itsMacroName = '';
  private itsViewW = Consts.ViewWH_Def;
  private itsViewH = Consts.ViewWH_Def;
  private itsScrambleSeed = Consts.ScrambleSeed_Def;
  private itsTupleW = Consts.TupleW_Def;
  private itsStoreCount = Consts.StoreCount_Def;
  private itsIconNames: string[] = [];
  //
  private itsMacros = new Macros();
  /**
   *
   */
  constructor(theParams?: object) {
    this.set(theParams);
  }
  /**
   *
   */
  set(theParams?: object) {
    if (Utils.isValid(theParams) === false) { return; }
    const aKeys = Object.keys(theParams);
    const aLength = aKeys.length;
    if (aLength === 0) { return; }
    const aValues = Object.values(theParams);
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aKey = aKeys[aIndex];
      const aValue = aValues[aIndex];
      switch (aKey) {
        default: break;
        case 'Id': this.setId(Number(aValue)); break;
        case 'Name': this.setName(String(aValue)); break;
        case 'MacroName': this.setMacroName(String(aValue)); break;
        case 'ViewW': this.setViewW(Number(aValue)); break;
        case 'ViewH': this.setViewH(Number(aValue)); break;
        case 'ScrambleSeed': this.setScrambleSeed(Number(aValue)); break;
        case 'TupleW': this.setTupleW(Number(aValue)); break;
        case 'StoreCount': this.setStoreCount(Number(aValue)); break;
        case 'IconNames': this.setIconNames(Utils.checkStringArray(aValue)); break;
      }
    }
  }
  /**
   *
   */
  setId(theId: number) {
    if (this.isLocked() === false) {
      this.itsId = theId;
    }
  }
  /**
   *
   */
  getId(): number {
    return this.itsId;
  }
  /**
   *
   */
  setName(theName: string) {
    this.itsName = theName;
    this.inventMacroName();
    this.loadMacros();
  }
  /**
   *
   */
  getPath(): string {
    return Consts.Assets_Input;
  }
  /**
   *
   */
  getName(): string {
    return this.itsName;
  }
  /**
   * Create a MacroName based on the file name.
   */
  inventMacroName() {
    const aName1 = this.itsName.toString();
    const aName2 = aName1.replace('.', '_');
    const aName3 = aName2 + '.json';
    this.setMacroName(aName3);
  }
  /**
   *
   */
  setMacroName(theMacroName: string) {
    this.itsMacroName = theMacroName;
    this.loadMacros();
  }
  /**
   *
   */
  getMacroName(): string {
    return this.itsMacroName;
  }
  /**
   *
   */
  loadMacros() {
    const aPath = this.getPath();
    const aMacroName = this.getMacroName();
    this.itsMacros.setFileName(aPath + aMacroName);
    this.itsMacros.load();
  }
  /**
   *
   */
  getMacros(): IMacros {
    return this.itsMacros;
  }
  /**
   *
   */
  setViewW(theViewW: number) {
    if (this.isLocked() === false) {
      this.itsViewW = Utils.forceRange(
        theViewW,
        Consts.ViewWH_Min,
        Consts.ViewWH_Max
      );
    }
  }
  /**
   *
   */
  getViewW(): number {
    return this.itsViewW;
  }
  /**
   *
   */
  setViewH(theViewH: number) {
    if (this.isLocked() === false) {
      this.itsViewH = Utils.forceRange(
        theViewH,
        Consts.ViewWH_Min,
        Consts.ViewWH_Max
      );
    }
  }
  /**
   *
   */
  getViewH(): number {
    return this.itsViewH;
  }
  /**
   *
   */
  setScrambleSeed(theScrambleSeed: number) {
    if (this.isLocked() === false) {
      this.itsScrambleSeed = theScrambleSeed;
    }
  }
  /**
   *
   */
  getScrambleSeed(): number {
    return this.itsScrambleSeed;
  }
  /**
   *
   */
  setTupleW(theTupleW: number) {
    if (this.isLocked() === false) {
      this.itsTupleW = Utils.forceRange(theTupleW, Consts.TupleW_Min, Consts.TupleW_Max);
    }
  }
  /**
   *
   */
  getTupleW(): number {
    return this.itsTupleW;
  }
  /**
   * Compute the height of the tuple output.
   */
  getTupleH(): number {
    const aW = this.itsViewW;
    const aH = this.itsViewH;
    const aTW = this.itsTupleW;
    const aTH = Utils.getAddrH(aW, aH, aTW);
    return aTH;
  }
  /**
   *
   */
  getDecodeW(): number {
    return Math.pow(2, this.getTupleW());
  }
  /**
   *
   */
  getDecodeH(): number {
    return this.getTupleH();
  }
  /**
   * Set the number of Stores to use.
   * @param theStoreCount
   */
  setStoreCount(theStoreCount: number) {
    if (this.isLocked() === false) {
      this.itsStoreCount = Utils.forceRange(
        theStoreCount,
        Consts.StoreCount_Min,
        Consts.StoreCount_Max
      );
    }
  }
  /**
   * Get the number of Stores in use.
   */
  getStoreCount(): number {
    return this.itsStoreCount;
  }
  /**
   *
   * @param theIcons
   */
  setIconNames(theIconNames: string[]) {
    if (this.isLocked() === false) {
      this.itsIconNames = theIconNames;
    }
  }
  /**
   * Get the base names of the icons.
   */
  getIconNames(): string[] {
    return this.itsIconNames;
  }
  /**
   * Can the Config object be modified.
   */
  isLocked(): boolean {
    return this.itsLocked;
  }
  /**
   * Stop the Config object being modified.
   */
  setLocked() {
    this.itsLocked = true;
  }
  //
}
