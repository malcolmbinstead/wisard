//
// tslint:disable:no-empty-interface
//
export interface ISource {
  setFileName(theFileName: string);
  getFileName(): string;
  setX(theX: number);
  setY(theY: number);
  setXY(theX: number, theY: number);
  getX(): number;
  getY(): number;
  moveDX(theDX: number);
  moveDY(theDY: number);
  moveDXY(theDX: number, theDY: number);
}
//
export interface IView {
  setScale(theS: number);
  getScale(): number;
  setRotate(theRdeg: number);
  getRotate(): number;
}
//
export interface IThreshold {
  setThresh(theThresh: number);
  getThresh(): number;
}
//
export interface IScramble {
}
//
export interface ITuple {
}
//
export interface IDecoder {
}
//
export interface IStore {
  clear();
  teach();
}
//
export interface IMatch {
}
//
export interface IScoreIn {
  getScore(): number;
}
//
export interface IScoreOut {
  getScore(): number;
}
//
export interface IResult {
  setThresh(theThresh: number);
  getThresh(): number;
  getResult(): number;
}
//



