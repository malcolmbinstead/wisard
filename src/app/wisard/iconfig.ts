//
import { IMacros } from '../wisard/imacros';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export interface IConfig {
  //
  setId(theId: number);
  getId(): number;
  //
  getPath(): string;
  //
  setName(theName: string);
  getName(): string;
  //
  setMacroName(theMacroName: string);
  getMacroName(): string;
   //
  setViewW(theViewW: number);
  getViewW(): number;
  setViewH(theViewH: number);
  getViewH(): number;
  //
  setScrambleSeed(theScrambleSeed: number);
  getScrambleSeed(): number;
  //
  setTupleW(theTupleW: number);
  getTupleW(): number;
  getTupleH(): number;
  //
  getDecodeW(): number;
  getDecodeH(): number;
  //
  setStoreCount(theStoreCount: number);
  getStoreCount(): number;
  //
  getIconNames(): string[];
  //
  isLocked(): boolean;
  //
  loadMacros();
  getMacros(): IMacros;
  //
}
