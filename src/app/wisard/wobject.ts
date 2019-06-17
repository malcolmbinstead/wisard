//
import { IWObject } from './iwobject';
import { IWTexture } from './iwtexture';
import { WTexture } from './wtexture';
import { IClassifier } from './iclassifier';
import { Classifier } from './classifier';
import { IConfig } from './iconfig';
import { Config } from './config';
import { Log } from './log';
import { GLUtils } from './glutils';
import { Support } from './support';
import { Txy, Txywh, TArrayXYWH } from './types';
import { RectOverlay } from './rect_overlay';
import { Consts } from './consts';
import { Keys } from './keys';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export class WObject implements IWObject {
  //
  private itsClassifier: Classifier = null;
  //
  private itsName = '';
  private itsId = 0;
  //
  private itsInputs = new WeakMap();
  private itsLookup: WTexture = new WTexture();
  private itsOutput: WTexture = new WTexture();
  private itsOutputs = new WeakMap();
  //
  private itsCanvasItems: TArrayXYWH = new TArrayXYWH();
  private itsNormalisedMouseCoord = new Txy(0.5, 0.5);
  private itsRectOverlay = new RectOverlay();
  //
  private itsScore = 0.0;
  //
  /**
   *
   */
  constructor(
    theName?: string,
    theId?: number
  ) {
    if (GLUtils.isValid(theName)) {
      this.itsName = theName;
    }
    if (GLUtils.isValid(theId)) {
      this.itsId = theId;
    }
  }
  /**
   * Which classifier is this part of.
   */
  getClassifier(): IClassifier {
    return this.itsClassifier;
  }
  /**
   *
   * @param theClassifier
   */
  setClassifier(theClassifier: Classifier) {
    this.itsClassifier = theClassifier;
  }
  /**
   *
   */
  getConfig(): IConfig {
    let aReturn: IConfig = null;
    if (this.itsClassifier !== null) {
      aReturn = this.itsClassifier.getConfig();
    }
    if (aReturn === null) {
      aReturn = new Config();
    }
    return aReturn;
  }
  /**
   * Name of this object.
   */
  getName(): string {
    return this.itsName;
  }
  /**
   * Set the Id.
   */
  setId(theId: number) {
    this.itsId = theId;
  }
  /**
   * Id of this object.
   */
  getId(): number {
    return this.itsId;
  }
  /**
   *
   */
  getNameId(): string {
    return this.itsName + this.itsId;
  }
  /**
   *
   */
  getClassIdNameId(): string {
    const aClassifier = this.getClassifier();
    if (GLUtils.isValid(aClassifier)) {
      const aClassId = aClassifier.getClassId();
      return aClassId + this.itsName + this.itsId;
    }
    return '';
  }
  /**
   *
   * @param theKey
   * @param theInput
   */
  private setInputK(theKey, theInput: IWObject) {
    this.itsInputs.delete(theKey);
    if (GLUtils.isValid(theInput)) {
      this.itsInputs.set(theKey, theInput);
    }
  }
  /**
   *
   */
  setInputN(theIndex: number, theInput: IWObject) {
    this.setInputK(Keys.key(theIndex), theInput);
  }
  /**
   *
   * @param theInput
   */
  setInput0(theInput: IWObject) {
    this.setInputN(0, theInput);
  }
  /**
   *
   * @param theInput
   */
  setInput1(theInput: IWObject) {
    this.setInputN(1, theInput);
  }
  /**
   * Attempt to get an input using its key.
   * This may rturn null if the entry has been garbage collected.
   */
  private getInputK(theKey): IWObject {
    let aReturn = null;
    const aValue = this.itsInputs.get(theKey);
    if (GLUtils.isValid(aValue)) {
      aReturn = aValue;
    }
    return aReturn;
  }
  /**
   *
   */
  getInputN(theIndex: number) {
    return this.getInputK(Keys.key(theIndex));
  }
  /**
   *
   */
  getInput0(): IWObject {
    return this.getInputN(0);
  }
  /**
   *
   */
  getInput1(): IWObject {
    return this.getInputN(1);
  }
  /**
   * Access the object's lookup table.
   */
  getLookup(): IWTexture {
    return this.itsLookup;
  }
  /**
   * Access the object's output texture.
   * NB: this output may get substituted.
   */
  getOutput(): IWTexture {
    const aOutput = this.itsOutput;
    const aOutput0 = this.getOutput0();
    if (aOutput0 !== null) {
      return aOutput0;
    }
    return aOutput;
  }
  /**
   *
   */
  private setOutputK(theKey, theOutput: IWTexture) {
    this.itsOutputs.delete(theKey);
    if (GLUtils.isValid(theOutput)) {
      this.itsOutputs.set(theKey, theOutput);
    }
  }
  /**
   *
   */
  setOutputN(theIndex: number, theOutput: IWTexture) {
    this.setOutputK(Keys.key(theIndex), theOutput);
  }
  /**
   *
   */
  setOutput0(theOutput: IWTexture) {
    this.setOutputN(0, theOutput);
  }
  /**
   *
   */
  private getOutputK(theKey): IWTexture {
    let aReturn = null;
    const aValue = this.itsOutputs.get(theKey);
    if (GLUtils.isValid(aValue)) {
      aReturn = aValue;
    }
    return aReturn;
  }
  /**
   *
   */
  getOutputN(theIndex: number) {
    return this.getOutputK(Keys.key(theIndex));
  }
  /**
   *
   */
  getOutput0(): IWTexture {
    return this.getOutputN(0);
  }
  /**
   * Allocate resources for this object.
   */
  allocate() {
  }
  /**
   * Deallocate resources for this object.
   */
  deallocate() {
    this.itsLookup.deallocate();
    this.itsOutput.deallocate();
  }
  /**
   * Search the DOM for instances of this object
   * and record their location on the canvas.
   */
  findCanvasItems() {
    this.itsCanvasItems.clear();
    const aSupport = Support.getInst();
    if (aSupport.isOpen() === false) {
      return;
    }
    const aOutput = this.getOutput();
    if (aOutput.isValid() === false) {
      return;
    }
    const aSrc = aOutput;
    const aName = this.getClassIdNameId();
    const aElements = document.getElementsByClassName(aName);
    const aCount = aElements.length;
    if (aCount === 0) {
      return;
    }
    const aGL = aSupport.getGL();
    //
    const aWSX = window.scrollX;
    const aWSY = window.scrollY;
    // using 'template literal' to compose transform.
    aGL.canvas.style.transform = `translate(${aWSX}px,${aWSY}px)`;
    //
    const aCCW = aGL.canvas.clientWidth;
    const aCCH = aGL.canvas.clientHeight;
    //
    for (let aIndex = 0; aIndex < aCount; aIndex++) {
      const aElement = aElements[aIndex];
      const aRE = aElement.getBoundingClientRect();
      // Is the element on screen ?
      if (
        aRE.bottom > 0 &&
        aRE.top < aCCH &&
        aRE.right > 0 &&
        aRE.left < aCCW
      ) {
        // yes - record the position,
        // the image will be copied to this location
        // after it has been processed.
        const aW = aRE.right - aRE.left;
        const aH = aRE.bottom - aRE.top;
        const aX = aRE.left;
        const aY = aCCH - aRE.bottom;
        if (aW > 0 && aH > 0) {
          const aDstXYWH = new Txywh(aX, aY, aW, aH);
          this.itsCanvasItems.add(aDstXYWH);
        }
      }
    }
  }
  /**
   * How many instances of this object are visible
   * on the canvas.
   */
  getCanvasItemsCount(): number {
    return this.itsCanvasItems.getLength();
  }
  /**
   *
   */
  process() {
  }
  /**
   * Copy bg processed textures to the fg canvas.
   */
  copyToCanvas() {
    const aCount = this.itsCanvasItems.getLength();
    if (aCount === 0) { return; }
    const aSupport = Support.getInst();
    if (aSupport.isOpen() === false) { return; }
    const aOutput = this.getOutput();
    if (aOutput.isValid() === false) { return; }
    //
    const aSrc = aOutput;
    const aGL = aSupport.getGL();
    //
    for (let aIndex = 0; aIndex < aCount; aIndex++) {
      const aDstXYWH = this.itsCanvasItems.data[aIndex];
      aSupport.processBegin();
      aSupport.processPrepTextureToScreen(aSrc, null, aDstXYWH);
      aSupport.processSetMode(Consts.Mode_Copy);
      //
      aGL.enable(aGL.SCISSOR_TEST);
      GLUtils.ok(aGL, 'enable');
      aGL.scissor(aDstXYWH.x, aDstXYWH.y, aDstXYWH.w, aDstXYWH.h);
      GLUtils.ok(aGL, 'scissor');
      //
      aSupport.processCopy();
      aSupport.processEnd();
    }
    //
    aGL.disable(aGL.SCISSOR_TEST);
    GLUtils.ok(aGL, 'disable');
    //
  }
  /**
   * Draw overlay on canvas.
   * NB: There may be severlay instances that need to be drawn.
   */
  drawOverlay() {
    const aRect = this.itsRectOverlay;
    const aVisible = aRect.visible;
    if (aVisible === false) { return; }
    const aCount = this.itsCanvasItems.getLength();
    if (aCount === 0) { return; }
    const aSupport = Support.getInst();
    if (aSupport.isOpen() === false) { return; }
    const aOutput = this.getOutput();
    if (aOutput.isValid() === false) { return; }
    //
    const aSrc = aOutput;
    const aGL = aSupport.getGL();
    const aRGB = [1.0, 0.0, 0.0];
    //
    for (let aIndex = 0; aIndex < aCount; aIndex++) {
      //
      const aDstXYWH = this.itsCanvasItems.data[aIndex];
      //
      const aCX = aDstXYWH.w * aRect.nx;
      const aCY = aDstXYWH.h * aRect.ny;
      const aW = aDstXYWH.w * aRect.nw;
      const aH = aDstXYWH.h * aRect.nh;
      const aRdeg = aRect.rdeg;
      //
      aSupport.processBegin();
      aSupport.processPrepTextureToScreen(aSrc, null, aDstXYWH);
      aSupport.processSetMode(Consts.Mode_Fill);
      aSupport.processSetColor(aRGB);
      //
      aGL.enable(aGL.SCISSOR_TEST);
      GLUtils.ok(aGL, 'enable');
      aGL.scissor(aDstXYWH.x, aDstXYWH.y, aDstXYWH.w, aDstXYWH.h);
      GLUtils.ok(aGL, 'scissor');
      //
      aSupport.processSrcPositionOutline(
        aCX,
        aCY,
        aW,
        aH,
        aRdeg
      );
      aSupport.processCopyOutline();
      aSupport.processEnd();
    }
    //
    aGL.disable(aGL.SCISSOR_TEST);
    GLUtils.ok(aGL, 'disable');
    //
  }
  /**
   *
   */
  findElements() {
    const aName = this.getClassIdNameId();
    const aElements = document.getElementsByClassName(aName);
    const aCount = aElements.length;
    this.log('findElements: ' + aCount);
  }
  /**
   * This method checks to see if a given mouse point falls inside
   * a view of this object on the canvas.
   * A WObject may have several instances visible on the canvas at once.
   * This method returns the index of the first instance found.
   * This method returns -1 if no instances are found.
   * NB: Unless views overlap, only one instance can respond to a mouse event.
   */
  isInside(theXY: Txy): number {
    const aIndex = this.itsCanvasItems.isInside(theXY);
    // Side effect - record mouse coordinate.
    if (aIndex >= 0) {
      const aRect = this.itsCanvasItems.data[aIndex];
      const aDx = theXY.x - aRect.x;
      const aDy = theXY.y - aRect.y;
      const aNDx = aDx / aRect.w;
      const aNDy = 1.0 - (aDy / aRect.h);
      //
      this.itsNormalisedMouseCoord.set(aNDx, aNDy);
    }
    return aIndex;
  }
  /**
   *
   */
  getNormalisedMouseCoord(): Txy {
    return this.itsNormalisedMouseCoord;
  }
  /**
   *
   * @param theX
   */
  setX(theX: number) {
    const aOutput = this.getOutput();
    const aW = aOutput.getW();
    if (aW > 0) {
      theX = Math.max(theX, 0);
      theX = Math.min(theX, aW);
      const aNX = theX / aW;
      this.itsNormalisedMouseCoord.x = aNX;
    }
  }
  /**
   *
   */
  setY(theY: number) {
    const aOutput = this.getOutput();
    const aH = aOutput.getH();
    if (aH > 0) {
      theY = Math.max(theY, 0);
      theY = Math.min(theY, aH);
      const aNY = theY / aH;
      this.itsNormalisedMouseCoord.y = aNY;
    }
  }
  /**
   *
   * @param theX
   * @param theY
   */
  setXY(theX: number, theY: number) {
    this.setX(theX);
    this.setY(theY);
  }
  /**
   *
   */
  getX(): number {
    const aOutput = this.getOutput();
    const aW = aOutput.getW();
    const aNX = this.itsNormalisedMouseCoord.x;
    const aX = aW * aNX;
    const aRX = Math.round(aX);
    return aRX;
  }
  /**
   *
   */
  getY(): number {
    const aOutput = this.getOutput();
    const aH = aOutput.getH();
    const aNY = this.itsNormalisedMouseCoord.y;
    const aY = aH * aNY;
    const aRY = Math.round(aY);
    return aRY;
  }
  /**
   *
   */
  moveDX(theDX: number) {
    this.setX(this.getX() + theDX);
  }
  /**
   *
   */
  moveDY(theDY: number) {
    this.setY(this.getY() + theDY);
  }
  /**
   *
   * @param theDX
   * @param theDY
   */
  moveDXY(theDX: number, theDY: number) {
    this.moveDX(theDX);
    this.moveDY(theDY);
  }
  /**
   *
   */
  getRectOverlay(): RectOverlay {
    return this.itsRectOverlay;
  }
  /**
   * Try to perform an action.
   * This method should be overridden.
   */
  bgAction(theAction: string) {
  }
  // ----
  /**
   *
   */
  setScore(theScore: number) {
    this.itsScore = theScore;
  }
  /**
   *
   */
  getScore(): number {
    return this.itsScore;
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
