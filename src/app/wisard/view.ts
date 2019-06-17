//
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Consts } from './consts';
import { IView } from './interfaces';
import { Utils } from './utils';
// tslint:disable:no-redundant-jsdoc
/**
 * This object maps part of a source object into a movebale view.
 * Input: Source.
 * Output: View - WxH determined by Config object.
 */
export class View extends WObject implements IView {
  //
  private itsS = 0.5;
  private itsRdeg = 0.0;
  /**
   *
   */
  constructor(theId?: number, theInput0?: IWObject) {
    super('View', theId);
    super.setInput0(theInput0);
  }
  /**
   * Allocate local storage.
   */
  allocate() {
    super.deallocate();
    //
    const aConfig = super.getConfig();
    const aW = aConfig.getViewW();
    const aH = aConfig.getViewH();
    const aT = super.getOutput() as WTexture;
    aT.allocateLinear(aW, aH);
  }
  /**
   *
   * @param theS
   */
  setScale(theS: number) {
    this.itsS = theS;
  }
  /**
   *
   */
  getScale(): number {
    return this.itsS;
  }
  /**
   *
   * @param theRdeg
   */
  setRotate(theRdeg: number) {
    this.itsRdeg = theRdeg;
  }
  /**
   *
   */
  getRotate(): number {
    return this.itsRdeg;
  }
  /**
   *
   */
  process() {
    //
    const aSupport = Support.getInst();
    if (aSupport.isOpen() === false) {
      return;
    }
    const aInput = super.getInput0();
    if (aInput === null) {
      return;
    }
    //
    const aSrc = aInput.getOutput();
    const aSrcW = aSrc.getW();
    const aSrcH = aSrc.getH();
    //
    const aDst = super.getOutput();
    const aDstW = aDst.getW();
    const aDstH = aDst.getH();
    //
    const aNM = aInput.getNormalisedMouseCoord();
    //
    const aNCX = aNM.x;
    const aNCY = aNM.y;
    const aS = this.itsS;
    const aRdeg = this.itsRdeg;
    //
    aSupport.processBegin();
    aSupport.processPrepTextureToTexture(aSrc, aDst);
    aSupport.processSetMode(Consts.Mode_Copy);
    aSupport.processSrcPosition(
      aNCX,
      aNCY,
      aSrcW,
      aSrcH,
      aDstW,
      aDstH,
      aS,
      aRdeg
    );
    // aSupport.processDstClear();
    aSupport.processCopy();
    aSupport.processEnd();
    //
    this.setOverlayPosition();
  }
  /**
   * Position this view's outline inside it's source.
   */
  setOverlayPosition() {
    //
    const aInput = super.getInput0();
    if (aInput === null) {
      return;
    }
    const aSrc = aInput.getOutput();
    const aSrcW = aSrc.getW();
    const aSrcH = aSrc.getH();
    const aDst = super.getOutput();
    const aDstW = aDst.getW();
    const aDstH = aDst.getH();
    //
    if (aSrcW < 1 || aSrcH < 1) {
      return;
    }
    const aNM = aInput.getNormalisedMouseCoord();
    const aNX = aNM.x;
    const aNY = aNM.y;
    const aS = this.itsS;
    const aRdeg = this.itsRdeg;
    const aNW = (aDstW * aS) / aSrcW;
    const aNH = (aDstH * aS) / aSrcH;
    //
    aInput.getRectOverlay().set(true, aNX, aNY, aNW, aNH, aRdeg);
    //
  }
  // ----
  /**
   * Respond to action.
   */
  bgAction(theAction: string) {
    const aItems = theAction.split(',');
    const aAction = aItems[0];
    const aP0 = aItems[1];
    if (aAction === 'setScale') {
      this.setScale(Utils.parseFloat(aP0));
    } else if (aAction === 'setRotate') {
      this.setRotate(Utils.parseFloat(aP0));
    }
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    super.log('View: ' + theMessage);
  }
  //
}
