//
import { IWTexture } from './iwtexture';
import { IClassifier } from './iclassifier';
import { IConfig } from './iconfig';
import { Txy } from './types';
import { RectOverlay } from './rect_overlay';
// tslint:disable:no-redundant-jsdoc
/**
 * The interface for a WObject.
 * A WObject is the primitive that all wisard processing
 * blocks are built with.
 */
export interface IWObject {
  //
  getClassifier(): IClassifier;
  getConfig(): IConfig;
  //
  getName(): string;
  getId(): number;
  getNameId(): string;
  getClassIdNameId(): string;
  //
  setInputN(theIndex: number, theInput: IWObject);
  setInput0(theInput: IWObject);
  setInput1(theInput1: IWObject);
  //
  getInputN(theIndex: number);
  getInput0(): IWObject;
  getInput1(): IWObject;
  //
  getLookup(): IWTexture;
  getOutput(): IWTexture;
  //
  allocate();
  deallocate();
  //
  findCanvasItems();
  getCanvasItemsCount(): number;
  process();
  copyToCanvas();
  drawOverlay();
  //
  findElements();
  isInside(theXY: Txy): number;
  getNormalisedMouseCoord(): Txy;
  getRectOverlay(): RectOverlay;
  //
  getScore(): number;
  //
  bgAction(theAction: string);
  //
}
