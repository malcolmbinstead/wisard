//
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Consts } from './consts';
// tslint:disable:no-redundant-jsdoc
/**
 * An object for reading the Store using an Address
 * and creating a Match object.
 *
 * Input0: Address
 * Input1: Store
 *
 * Output: Match. (W,H) (1,DecodeH)
 */
export class Match extends WObject {
    /**
     * Input0: Address
     * Input1: Store
     */
    constructor(theId?: number, theSrcAddress?: IWObject, theSrcStore?: IWObject) {
        super('Match', theId);
        super.setInput0(theSrcAddress); // Address
        super.setInput1(theSrcStore); // Store
    }
    /**
     * Allocate local storage.
     */
    allocate() {
        super.deallocate();
        //
        const aConfig = super.getConfig();
        const aH = aConfig.getDecodeH();
        //
        const aT0 = super.getOutput() as WTexture;
        aT0.allocateNearest(1, aH);
        //
    }
    /**
     * Input0: Address
     * Input1: Store
     *         +---------+
     * --Addr--+0        |
     *         |  Match  +--Match--
     * --Store-+1        |
     *         +---------+
     */
    process() {
        //
        const aSupport = Support.getInst();
        if (aSupport.isOpen() === false) {
            return;
        }
        const aInput0 = super.getInput0();
        if (aInput0 === null) {
            return;
        }
        const aInput1 = super.getInput1();
        if (aInput1 === null) {
            return;
        }
        //
        const aConfig = super.getConfig();
        const aTupleW = aConfig.getTupleW();
        //
        const aSrcAddress = aInput0.getOutput(); // Address
        const aSrcStore = aInput1.getOutput(); // Store
        const aDstMatch = super.getOutput();
        //
        aSupport.processBegin();
        aSupport.processPrepTextureToTexture(aSrcAddress, aDstMatch); // Address
        aSupport.processAddTexture1(aSrcStore.getT()); // Store
        aSupport.processSetMode(Consts.Mode_Match);
        aSupport.processSetNWidth(aTupleW);
        // aSupport.processDstClear();
        aSupport.processCopy();
        aSupport.processEnd();
        //
    }
    //
}
