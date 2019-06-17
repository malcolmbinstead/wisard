//
import { WObject } from './wobject';
import { WTexture } from './wtexture';
import { IConfig } from './iconfig';
import { ISource } from './interfaces';
import { Utils } from './utils';
//
// tslint:disable:no-redundant-jsdoc
/**
 * This object turns an image file into a source
 * for the the processing chain.
 *
 * Input: JPG image file.
 * Output: Texture WxH detrmined by file content.
 */
export class ImageSource extends WObject implements ISource {
  //
  private itsImage: HTMLImageElement = null;
  /**
   *
   */
  constructor(theId?: number) {
    super('Source', theId);
  }
  /**
   *
   */
  setFileName(theFileName: string) {
    const aConfig = super.getConfig();
    aConfig.setName(theFileName);
    this.load();
  }
  /**
   *
   */
  getFileName(): string {
    const aConfig = super.getConfig();
    return aConfig.getName();
  }
  // ----
  /**
   * Allocate local storage.
   */
  allocate() {
    this.load();
  }
  /**
   * Attempt to load the image.
   */
  load() {
    this.deallocate();
    //
    const aConfig = super.getConfig();
    const aPath = aConfig.getPath();
    const aName = aConfig.getName();
    const aPathName = aPath + aName;
    //
    this.itsImage = document.createElement('img');
    this.itsImage.onerror = () => this.onError();
    this.itsImage.onload = () => this.onLoad();
    this.itsImage.src = aPathName;
    //
  }
  /**
   * Discard the current image.
   */
  unload() {
    this.itsImage = null;
    const aWTexture = super.getOutput() as WTexture;
    aWTexture.deallocate();
  }
  /**
   * Load error.
   */
  private onError() {
    this.itsImage = null;
  }
  /**
   * Load complete.
   */
  private onLoad() {
    if (this.itsImage !== null) {
      const aW = this.itsImage.width;
      const aH = this.itsImage.height;
      const aDst = super.getOutput() as WTexture;
      aDst.allocateLinear(aW, aH, this.itsImage);
    }
    this.itsImage = null;
  }
  /**
   * Discard resources.
   */
  deallocate() {
    this.itsImage = null;
    super.deallocate();
  }
  // ----
  /**
   * Various move commands.
   */
  setX(theX: number) { super.setX(theX); }
  setY(theY: number) { super.setY(theY); }
  setXY(theX: number, theY: number) { super.setXY(theX, theY); }
  getX(): number { return super.getX(); }
  getY(): number { return super.getY(); }
  moveDX(theDX: number) { super.moveDX(theDX); }
  moveDY(theDY: number) { super.moveDY(theDY); }
  moveDXY(theDX: number, theDY: number) { super.moveDXY(theDX, theDX); }
  // ----
  /**
   *
   */
  bgAction(theAction: string) {
    const aItems = theAction.split(',');
    const aAction = aItems[0];
    const aP0 = aItems[1];
    const aP1 = aItems[2];
    if (aAction === 'setXY') {
      this.setXY(Utils.parseInt(aP0), Utils.parseInt(aP1));
    }
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    super.log('ImageSource: ' + theMessage);
  }
  //
}
