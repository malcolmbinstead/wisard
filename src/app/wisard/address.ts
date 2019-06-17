//
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { IWTexture } from './iwtexture';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Consts } from './consts';
// tslint:disable:no-redundant-jsdoc
/**
 * Converts a Tuple array into a one dimensional array.
 *
 * Input: Tuple.
 * Output: Address.
 */
export class Address extends WObject {
    //
    private itsTupleW = 1;
    /**
     *
     */
    constructor(theId?: number, theInput0?: IWObject) {
        super('Address', theId);
        this.setInput0(theInput0);
    }
    /**
     * Allocate local storage.
     */
    allocate() {
        this.deallocate();
        //
        const aConfig = this.getConfig();
        this.itsTupleW = aConfig.getTupleW();
        const aH = aConfig.getTupleH();
        //
        const aT0 = this.getOutput() as WTexture;
        aT0.allocateNearest(1, aH);
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
        const aInput = this.getInput0();
        if (aInput === null) {
            return;
        }
        //
        const aSrc = aInput.getOutput();
        const aDst = this.getOutput();
        //
        aSupport.processBegin();
        aSupport.processPrepTextureToTexture(aSrc, aDst);
        aSupport.processSetMode(Consts.Mode_Address);
        aSupport.processSetNWidth(this.itsTupleW);
        // aSupport.processDstClear();
        aSupport.processCopy();
        aSupport.processEnd();
    }
    //
}
