// tslint:disable-next-line:no-reference
/// <reference path="../../../node_modules/@types/webgl2/index.d.ts" />
import { ICore } from './icore';
import { IConfig } from './iconfig';
import { IClassifier } from './iclassifier';
import { Classifier } from './classifier';
import { GLUtils } from './glutils';
import { Log } from './log';
import { Support } from './support';
import { Consts } from './consts';
import { Utils } from './utils';
import { IWObject } from './iwobject';
import { Txy, Txywh } from './types';
import { Icons } from './icons';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export default class Core implements ICore {
  //
  // Core is a singleton.
  private static itsInst: Core = null;
  //
  // A collection of classifiers.
  private itsClassifiers: Classifier[] = [];
  private itsRunning = false;
  private itsRenderCounter = 0;
  private itsRenderRateCounter = 0;
  private itsRenderRate = 0;
  private itsTimer;
  private itsMouseXY = new Txy();
  /**
   * Access the Core singleton.
   */
  static getInst(): Core {
    if (Core.itsInst === null) {
      Core.itsInst = new Core();
    }
    return Core.itsInst;
  }
  /**
   *
   */
  private constructor() {
    this.init();
  }
  /**
   *
   */
  private init() {
    // Mouse events.
    this.addMouseEvent('mousedown');
    this.addMouseEvent('mousemove');
    // Timer events.
    this.itsTimer = setInterval(() => {
      this.tick();
    }, 1000);
  }
  /**
   *
   */
  private addMouseEvent(theType: string) {
    document.addEventListener(
      theType,
      (theEvent) => {
        this.onMouseEvent(theEvent as MouseEvent);
      }
    );
  }
  /**
   * Respond to a mouse event.
   */
  private onMouseEvent(theEvent: MouseEvent) {
    //
    const aSupport = Support.getInst();
    if (aSupport.isOpen() === false) { return; }
    const aGL = aSupport.getGL();
    const aWSX = window.scrollX;
    const aWSY = window.scrollY;
    aGL.canvas.style.transform = `translate(${aWSX}px,${aWSY}px)`;
    //
    const aCCH = aGL.canvas.clientHeight;
    //
    const aType = theEvent.type;
    const aMouseDown = aType === 'mousedown';
    const aMouseMove = aType === 'mousemove';
    const aButtons = theEvent.buttons !== 0;
    //
    if (aMouseDown || (aMouseMove && aButtons)) {
      //
      const aX = theEvent.x;
      const aY = theEvent.y;
      //
      // record mouse location.
      this.itsMouseXY.x = aX;
      this.itsMouseXY.y = aCCH - aY;
      //
      // Look for views that contain the mouse event
      // and update them as a side effect.
      const aFoundId = this.isInside(this.itsMouseXY);
    }
  }
  /**
   *
   */
  getCodeVersion(): string {
    return Consts.CodeVersion;
  }
  /**
   * How many textures are currently allocated.
   */
  getTextureCount(): number {
    return GLUtils.getTextureCount();
  }
  /**
   *
   */
  getBufferCount(): number {
    return GLUtils.getBufferCount();
  }
  /**
   *
   */
  getFramebufferCount(): number {
    return GLUtils.getFramebufferCount();
  }
  /**
   *
   */
  getVertexArrayCount(): number {
    return GLUtils.getVertexArrayCount();
  }
  /**
   * How many frames per second are being rendered.
   */
  getRenderCounter(): number {
    return this.itsRenderCounter;
  }
  getRenderRate(): number {
    return this.itsRenderRate;
  }
  // ----
  /**
   * Attempt to add a classifier to the core.
   */
  addClassifier(theClassifier: Classifier) {
    if (GLUtils.isValid(theClassifier)) {
      const aConfig = theClassifier.getConfig();
      const aId = aConfig.getId();
      if (aId <= 0) {
        this.log('addClassifier: failed - invalid Id');
      } else {
        if (this.findClassifierById(aId) !== null) {
          this.log('addClassifier: warning - replacing classifier.');
          this.removeClassifierById(aId);
        }
        this.itsClassifiers.push(theClassifier);
        theClassifier.allocate();
        this.addIconNames(theClassifier);
      }
    }
  }
  /**
   * Add any named icons to the shared pool.
   */
  private addIconNames(theClassifier: Classifier) {
    const aIcons = Icons.getInst();
    aIcons.addNames(theClassifier.getConfig().getIconNames());
  }
  /**
   * How many classifiers are there.
   */
  getClassifierCount(): number {
    return this.itsClassifiers.length;
  }
  /**
   * Attempt to access a classifier using its index.
   */
  getClassifierByIndex(theIndex: number): IClassifier {
    let aReturn: IClassifier = null;
    const aLength = this.itsClassifiers.length;
    if (theIndex >= 0 && theIndex < aLength) {
      aReturn = this.itsClassifiers[theIndex];
    }
    return aReturn;
  }
  /**
   * Attempt to find a Classifier using its Id.
   */
  findClassifierById(theId: number): IClassifier {
    let aReturn: IClassifier = null;
    const aIndex = this.findClassifierIndexById(theId);
    if (aIndex >= 0) {
      aReturn = this.itsClassifiers[aIndex];
    }
    return aReturn;
  }
  /**
   * Attempt to find a Classifiers Index using its Id.
   */
  findClassifierIndexById(theId: number): number {
    let aReturn = -1;
    const aLength = this.itsClassifiers.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsClassifiers[aIndex];
      if (aItem.getId() === theId) {
        aReturn = aIndex;
        break;
      }
    }
    return aReturn;
  }
  /**
   * Attempt to find a Classifiers Index using its ClassId.
   */
  findClassifierIndexByClassId(theClassId: string): number {
    let aReturn = -1;
    const aLength = this.itsClassifiers.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsClassifiers[aIndex];
      if (aItem.getClassId() === theClassId) {
        aReturn = aIndex;
        break;
      }
    }
    return aReturn;
  }
  /**
   * Attempt to remove a classifier using its Id.
   */
  removeClassifierById(theId: number) {
    const aIndex = this.findClassifierIndexById(theId);
    this.removeClassifierByIndex(aIndex);
  }
  /**
   * Attempt to remove a classifier using its Index.
   */
  removeClassifierByIndex(theIndex: number) {
    const aLength = this.itsClassifiers.length;
    if (theIndex >= 0 && theIndex < aLength) {
      const aItem = this.itsClassifiers[theIndex];
      this.itsClassifiers.splice(theIndex);
      aItem.deallocate();
    }
  }
  /**
   * Remove all classifiers.
   */
  removeAllClassifiers() {
    const aLength = this.itsClassifiers.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      this.removeClassifierByIndex(0);
    }
  }
  // ----
  /**
   * Attempt to find a Classifier using its ClassId.
   * @param theClassId
   */
  findClassifierByClassId(theClassId: string): IClassifier {
    let aReturn: IClassifier = null;
    const aIndex = this.findClassifierIndexByClassId(theClassId);
    if (aIndex >= 0) {
      aReturn = this.itsClassifiers[aIndex];
    }
    return aReturn;
  }
  // ----
  /**
   * Attempt to find a WObject from itsClassIdNameId string.
   * @param theClassIdNameId
   */
  findObjectByClassIdNameId(theClassIdNameId: string): IWObject {
    let aReturn: IWObject = null;
    if (Utils.isValid(theClassIdNameId)) {
      const aANArray: string[] = Utils.getAlphaNumArray(theClassIdNameId);
      if (aANArray.length >= 2) {
        const aClassifier = this.findClassifierByClassId(aANArray[0]);
        if (aClassifier !== null) {
          const aObject = aClassifier.findObjectByNameId(aANArray[1]);
          if (aObject !== null) {
            aReturn = aObject;
          }
        }
      }
    }
    return aReturn;
  }
  // ----
  /**
   * What was the last open status message.
   */
  getStatus(): string {
    return Support.getInst().getStatus();
  }
  /**
   * Attempt to open the core.
   */
  open(): boolean {
    return Support.getInst().open();
  }
  /**
   *
   */
  close() {
    Support.getInst().close();
  }
  /**
   * Start Rendering loop.
   */
  start() {
    if (this.itsRunning === false) {
      if (this.open() === true) {
        this.itsRunning = true;
        this.requestNextRender();
      }
    }
  }
  /**
   * Stop rendering loop.
   */
  stop() {
    this.itsRunning = false;
  }
  /**
   * Is rendering loop running.
   */
  isRunning(): boolean {
    return this.itsRunning;
  }
  /**
   * One second has elapsed.
   */
  private tick() {
    this.itsRenderRate = this.itsRenderRateCounter;
    this.itsRenderRateCounter = 0;
  }
  /**
   *
   */
  private requestNextRender() {
    if (this.itsRunning === true) {
      requestAnimationFrame(() => {
        this.doRender();
      });
    }
  }
  /**
   *
   */
  private doRender() {
    if (this.itsRunning === true) {
      //
      this.itsRenderCounter++;
      this.itsRenderRateCounter++;
      //
      this.clearBackground();
      this.findCanvasItemsAll();
      this.processAll();
      this.copyToCanvasAll();
      this.drawOverlayAll();
      //
      this.requestNextRender();
    }
  }
  /**
   *
   */
  private clearBackground() {
    const aSupport = Support.getInst();
    aSupport.clearBackground();
    //
  }
  /**
   * Find the currently visible canvas items for all the classifier.
   * NB: If a classifier has no visible items then it need not be processed.
   */
  private findCanvasItemsAll() {
    const aLength = this.itsClassifiers.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsClassifiers[aIndex];
      aItem.findCanvasItems();
    }
  }
  /**
   *
   */
  private processAll() {
    const aLength = this.itsClassifiers.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsClassifiers[aIndex];
      const aCount = aItem.getCanvasItemsCount();
      if (aCount > 0) {
        aItem.process();
      }
    }
  }
  /**
   *
   */
  private copyToCanvasAll() {
    const aLength = this.itsClassifiers.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsClassifiers[aIndex];
      const aCount = aItem.getCanvasItemsCount();
      if (aCount > 0) {
        aItem.copyToCanvas();
      }
    }
  }
  /**
   *
   */
  private drawOverlayAll() {
    const aLength = this.itsClassifiers.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsClassifiers[aIndex];
      const aCount = aItem.getCanvasItemsCount();
      if (aCount > 0) {
        aItem.drawOverlay();
      }
    }
  }
  /**
   *
   */
  findElements() {
    const aLength = this.itsClassifiers.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsClassifiers[aIndex];
      aItem.findElements();
    }
  }
  /**
   * Testing: deallocate and reallocate storage.
   */
  reallocate() {
    const aLength = this.itsClassifiers.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsClassifiers[aIndex];
      aItem.deallocate();
    }
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem = this.itsClassifiers[aIndex];
      aItem.allocate();
    }
  }
  /**
   * Attempt to find a classifier that is at the mouse location.
   * Returns the classifiers Id or 0.
   */
  isInside(theXY: Txy): number {
    let aReturn = 0;
    const aLength = this.itsClassifiers.length;
    for (let aIndex = 0; aIndex < aLength; aIndex++) {
      const aItem: Classifier = this.itsClassifiers[aIndex];
      const aFound = aItem.isInside(theXY);
      if (aFound >= 0) {
        aReturn = aItem.getId();
        break;
      }
    }
    return aReturn;
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
