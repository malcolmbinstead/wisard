//
import { IConfig } from './iconfig';
import { Config } from './config';
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { Txy } from './types';
import { IMacros } from './imacros';
import { IActions } from './iactions';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export interface IClassifier extends IActions {
  //
  setConfig(theConfig: Config);
  getConfig(): IConfig;
  //
  getClass(): string;
  getId(): number;
  getClassId(): string;
  //
  addObject(theObject: WObject);
  getObjectCount(): number;
  getObjectByIndex(theIndex: number): IWObject;
  removeObjectByIndex(theIndex: number);
  removeAllObjects();
  findObjectByNameId(theNameId: string): IWObject;
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
  //
  getPendingTeach(): number;
  setPendingTeach(thePendingTeach: number);
  //
}
