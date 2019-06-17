//
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { IWTexture } from './iwtexture';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Consts } from './consts';
// tslint:disable:no-redundant-jsdoc
/**
 * Converts a compressed Address array into a Decoded bit array.
 *
 * Input: Address. (W,H) (1,DecodeH)
 * Output: Decode. (W,H) (DecodeW,DecodeH)
 */
export class Decoder extends WObject {
    /**
     *
     */
    constructor(theId?: number, theInput0?: IWObject) {
        super('Decoder', theId);
        super.setInput0(theInput0);
    }
    /**
     * Allocate local storage.
     */
    allocate() {
        super.deallocate();
        //
        const aConfig = super.getConfig();
        const aW = aConfig.getDecodeW();
        const aH = aConfig.getDecodeH();
        //
        const aT0 = super.getOutput() as WTexture;
        aT0.allocateNearest(aW, aH);
        //
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
        const aConfig = super.getConfig();
        const aTupleW = aConfig.getTupleW();
        const aSrc = aInput.getOutput();
        const aDst = super.getOutput();
        //
        aSupport.processBegin();
        aSupport.processPrepTextureToTexture(aSrc, aDst);
        aSupport.processSetMode(Consts.Mode_Decode);
        aSupport.processSetNWidth(aTupleW);
        // aSupport.processDstClear();
        aSupport.processCopy();
        aSupport.processEnd();
    }
    //
}
