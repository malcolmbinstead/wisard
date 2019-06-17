//
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Consts } from './consts';
import { IThreshold } from './interfaces';
import { Utils } from './utils';
// tslint:disable:no-redundant-jsdoc
/**
 * Converters an Colour View into a Black and White texture.
 *
 * Input: View
 * Output: Threshold. WxH the same as View.
 */
export class Threshold extends WObject implements IThreshold {
  //
  private itsThresh = 0.2;
  /**
   *
   */
  constructor(theId?: number, theInput0?: IWObject) {
    super('Threshold', theId);
    super.setInput0(theInput0);
  }
  /**
   *
   * @param theThresh
   */
  setThresh(theThresh: number) {
    this.itsThresh = theThresh;
  }
  /**
   *
   */
  getThresh(): number {
    return this.itsThresh;
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
    aT.allocateNearest(aW, aH);
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
    const aThresh = this.itsThresh;
    //
    const aSrc = aInput.getOutput();
    const aDst = super.getOutput();
    //
    aSupport.processBegin();
    aSupport.processPrepTextureToTexture(aSrc, aDst);
    aSupport.processSetMode(Consts.Mode_Threshold);
    aSupport.processSetThreshold(aThresh);
    // aSupport.processDstClear();
    aSupport.processCopy();
    aSupport.processEnd();
  }
  // ----
  /**
   * Respond to action.
   */
  bgAction(theAction: string) {
    const aItems = theAction.split(',');
    const aAction = aItems[0];
    const aP0 = aItems[1];
    if (aAction === 'setThresh') {
      this.setThresh(Utils.parseFloat(aP0));
    }
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    super.log('Threshold: ' + theMessage);
  }
  //
}
