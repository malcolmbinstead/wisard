//
import { IClassifier } from './iclassifier';
import { IConfig } from './iconfig';
import { Config } from './config';
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { GLUtils } from './glutils';
import { ImageSource } from './image_source';
import { VideoSource } from './video_source';
import { Log } from './log';
import { View } from './view';
import { Threshold } from './threshold';
import { Scramble } from './scramble';
import { Tuple } from './tuple';
import { Address } from './address';
import { Decoder } from './decoder';
import { TestPattern } from './test_pattern';
import { Store } from './store';
import { Match } from './match';
import { ScoreIn } from './score_in';
import { ScoreOut } from './score_out';
import { Txy } from './types';
import { Utils } from './utils';
import { IMacros } from './imacros';
import { Macros } from './macros';
import { Result } from './result';
import { allowPreviousPlayerStylesMerge } from '@angular/animations/browser/src/util';
// tslint:disable:no-redundant-jsdoc
/**
 * A classifier is a collection of WObjects which
 * collect and process a scene, and then presents
 * these to a collection of classes to see which can identify
 * the contents.
 */
export class Classifier implements IClassifier {
  //
  private itsConfig: Config = null;
  // A collection of WObjects.
  private itsObjects: WObject[] = [];
  // ----
  // Actions waiting to be performed.
  private itsBgActionList: string[] = [];
  private itsBgTimeStamp = Date.now();
  private itsBgActionTimerMSec = 0;
  private itsBgActionWait = 0;
  // ----
  //
  private itsPendingTeach = 0;
  //
  /**
   *
   */
  constructor() {
    this.itsConfig = new Config();
  }
  /**
   *
   */
  setConfig(theConfig: Config) {
    if (GLUtils.isValid(theConfig)) {
      this.itsConfig = theConfig;
      this.itsConfig.setLocked();
      // instruct the Macro object to call the
      // 'action' or 'actions' method.
      this.itsConfig.getMacros().setActionsCB(this);
    }
  }
  /**
   *
   */
  getConfig(): IConfig {
    return this.itsConfig;
  }
  /**
   *
   */
  getClass(): string {
    return 'W';
  }
  /**
   *
   */
  getId(): number {
    return this.getConfig().getId();
  }
  /**
   * What symbolic name does this classifier have.
   */
  getClassId(): string {
    const aClass = this.getClass();
    const aId = this.getId();
    return aClass + aId;
  }
  /**
   * Add an object to the classifier.
   */
  addObject(theObject: WObject) {
    if (GLUtils.isValid(theObject)) {
      this.itsObjects.push(theObject);
      theObject.setClassifier(this);
    }
  }
  /**
   * How many objects are attached to the classifier.
   */
  getObjectCount(): number {
    return this.itsObjects.length;
  }
  /**
   * Access an object using its index;
   */
  getObjectByIndex(theIndex: number): IWObject {
    let aReturn: IWObject = null;
    const aLength = this.itsObjects.length;
    if (theIndex >= 0 && theIndex < aLength) {
      aReturn = this.itsObjects[theIndex];
    }
    return aReturn;
  }
  /**
   *
   */
  removeObjectByIndex(theIndex: number) {
    const aLength = this.itsObjects.length;
    if (theIndex >= 0 && theIndex < aLength) {
      const aItem = this.itsObjects[theIndex];
      this.itsObjects.splice(theIndex);
      aItem.setClassifier(null);
    }
  }
  /**
   *
   */
  removeAllObjects() {
    const aLength = this.itsObjects.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      this.removeObjectByIndex(0);
    }
  }
  /**
   * Search for an object using its NameId.
   */
  findObjectByNameId(theNameId: string): IWObject {
    let aReturn: IWObject = null;
    const aLength = this.itsObjects.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsObjects[aIndex];
      if (aItem.getNameId() === theNameId) {
        aReturn = aItem;
        break;
      }
    }
    return aReturn;
  }
  // ----
  /**
   * Allocate all the objects that make up this classifier.
   */
  allocate() {
    //
    const aConfig = this.getConfig();
    const aPath = aConfig.getPath();
    const aName = aConfig.getName();
    const aPathName = aPath + aName;
    const aW = aConfig.getViewW();
    const aH = aConfig.getViewH();
    const aStoreCount = aConfig.getStoreCount();
    let aId = 0;
    //
    // Create a source scene.
    let aSource = null;
    if (GLUtils.isJPG(aPathName)) {
      aSource = new ImageSource(aId);
    } else if (GLUtils.isMP4(aPathName)) {
      aSource = new VideoSource(aId);
    }
    // Create common processing chain.
    const aView = new View(aId, aSource);
    const aThreshold = new Threshold(aId, aView);
    const aScramble = new Scramble(aId, aThreshold);
    const aTuple = new Tuple(aId, aScramble);
    const aAddress = new Address(aId, aTuple);
    const aDecoder = new Decoder(aId, aAddress);
    const aTempStore = new Store(aId);
    const aResult = new Result(aId);
    //
    this.addObject(aSource);
    this.addObject(aView);
    this.addObject(aThreshold);
    this.addObject(aScramble);
    this.addObject(aTuple);
    this.addObject(aAddress);
    this.addObject(aDecoder);
    this.addObject(aTempStore);
    //
    // Create multiple Store/Match/ScoreIn/ScoreOut.
    for (let aStoreIndex = 0; aStoreIndex < aStoreCount; aStoreIndex++) {
      //
      aId = aStoreIndex + 1;
      //
      const aStore = new Store(aId, aDecoder, aTempStore);
      const aMatch = new Match(aId, aAddress, aStore);
      const aScoreIn = new ScoreIn(aId, aMatch);
      const aScoreOut = new ScoreOut(aId, aScoreIn);
      //
      this.addObject(aStore);
      this.addObject(aMatch);
      this.addObject(aScoreIn);
      this.addObject(aScoreOut);
      //
      aResult.setInputN(aStoreIndex, aScoreOut);
      //
    }
    this.addObject(aResult);
    //
    // Finally instruct all the attached object to allocate their resources.
    const aLength = this.itsObjects.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsObjects[aIndex];
      aItem.allocate();
    }
    //
  }
  // ----
  /**
   * Deallocate all the objects.
   */
  deallocate() {
    const aLength = this.itsObjects.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsObjects[aIndex];
      aItem.deallocate();
    }
    this.itsObjects.length = 0;
  }
  // ----
  /**
   * Locate all the canvas items.
   * This must  be performws prior to 'copyToCanvas'.
   * NB: If there are no canvas items visible then there
   * may be no need to process the assocaited objects.
   */
  findCanvasItems() {
    const aLength = this.itsObjects.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsObjects[aIndex];
      aItem.findCanvasItems();
    }
  }
  /**
   *
   */
  getCanvasItemsCount(): number {
    let aCount = 0;
    const aLength = this.itsObjects.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsObjects[aIndex];
      aCount += aItem.getCanvasItemsCount();
    }
    return aCount;
  }
  // ----
  /**
   * Process all objects.
   */
  process() {
    // Copy pending actions.
    this.itsConfig.getMacros().poll();
    // perform next action.
    this.bgAction();
    //
    const aLength = this.itsObjects.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsObjects[aIndex];
      aItem.process();
    }
  }
  // ----
  /**
   * Copy processed texture to the canvas.
   */
  copyToCanvas() {
    const aLength = this.itsObjects.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsObjects[aIndex];
      aItem.copyToCanvas();
    }
  }
  /**
   *
   */
  findElements() {
    const aLength = this.itsObjects.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsObjects[aIndex];
      aItem.findElements();
    }
  }
  /**
   * Use a screen coordinate to locate an object on the screen
   * thta belongs to this classifier.
   * Returns the index of the first item found
   * or -1 if nothing is found.
   */
  isInside(theXY: Txy): number {
    let aFound = -1;
    const aLength = this.itsObjects.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsObjects[aIndex];
      const aTest = aItem.isInside(theXY);
      if (aTest >= 0) {
        this.log('Index ' + aIndex);
        aFound = aIndex;
        break;
      }
    }
    return aFound;
  }
  /**
   *
   */
  drawOverlay() {
    const aLength = this.itsObjects.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsObjects[aIndex];
      aItem.drawOverlay();
    }
  }
  // ----
  /**
   * Perform several actions.
   * The actions are placed on a queue for processing in the near future.
   */
  actions(theActions: string[]) {
    if (Utils.isValid(theActions) === false) { return; }
    const aLength = theActions.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aAction = theActions[aIndex];
      this.action(aAction);
    }
  }
  /**
   * Perform an action.
   * The action is placed on a queue for processing in the near future.
   */
  action(theAction: string) {
    if (Utils.isValid(theAction) === false) { return; }
    // split line-grouped actions in seperate actions.
    //  e.g. 'action1;action2' becomes 'action1' then 'action2'.
    const aItems = theAction.split(';');
    const aCount = aItems.length;
    for (let aIndex = 0; aIndex < aCount; aIndex++) {
      const aItem = aItems[aIndex];
      this.actionToBg(aItem);
    }
  }
  /**
   * Place an action in the background queue.
   * @param theAction
   */
  private actionToBg(theAction: string) {
    this.itsBgActionList.push(String(theAction));
  }
  /**
   * Perform a single action that has been waiting in the queue.
   */
  private bgAction() {
    // timer ?
    const aTimeStamp = Date.now();
    const aTimeDiffMSec = Math.abs(aTimeStamp - this.itsBgTimeStamp);
    this.itsBgTimeStamp = aTimeStamp;
    //
    if (this.itsBgActionTimerMSec > 0) {
      this.itsBgActionTimerMSec -= aTimeDiffMSec;
      return;
    }
    // wait ?
    if (this.itsBgActionWait > 0) {
      this.itsBgActionWait--;
      return;
    }
    // anthing to do ?
    if (this.itsBgActionList.length === 0) { return; }
    //
    // do it.
    const aAction = this.itsBgActionList.shift();
    this.bgActionDecode(aAction);
  }
  /**
   * Partially decode an action that has been wating in the queue
   * and pass it to the object that might be able to perform it.
   */
  private bgActionDecode(theAction: string) {
    //
    const aHead = Utils.getHead(theAction);
    const aTail = Utils.getTail(theAction);
    //
    const aObj = this.findObjectByNameId(aHead);
    if (aObj !== null) {
      aObj.bgAction(aTail);
    } else {
      this.bgActionLocal(theAction);
    }
  }
  /**
   * Perfrom an action within this classifier.
   */
  private bgActionLocal(theAction: string) {
    const aItems = theAction.split(',');
    const aAction = aItems[0];
    const aP0 = aItems[1];
    if (aAction === 'timer') {
      const aT = Utils.parseInt(aP0);
      this.setTimer(aT);
    } else if (aAction === 'wait') {
      const aT = Utils.parseInt(aP0);
      this.setWait(aT);
    }
  }
  /**
   * Set a time delay to pause background actions.
   */
  private setTimer(theTimeMSec: number) {
    let aTimeMSec = 1;
    if (theTimeMSec > 0 && theTimeMSec < 1000) {
      aTimeMSec = theTimeMSec;
    }
    this.itsBgActionTimerMSec = aTimeMSec;
  }
  /**
   * Set a number of process cycles to pause background actions.
   */
  private setWait(theWait: number) {
    let aWait = 1;
    if (theWait > 0 && theWait < 100) {
      aWait = theWait;
    }
    this.itsBgActionWait = aWait;
  }
  // ----
  /**
   *
   */
  getPendingTeach(): number {
    return this.itsPendingTeach;
  }
  /**
   *
   */
  setPendingTeach(thePendingTeach: number) {
    this.itsPendingTeach = thePendingTeach;
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    Log.add(theMessage);
  }
  //
}
