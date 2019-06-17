//
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { IWTexture } from './iwtexture';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Consts } from './consts';
import { IStore } from './interfaces';
import { Utils } from './utils';
import { IClassifier } from './iclassifier';
// tslint:disable:no-redundant-jsdoc
/**
 * An object for storing trained Class information
 * and as a temporary store during teaching.
 *
 * Input0: Decoder (DecodeW,DecodeH)
 * Input1: TempStore (DecodeW,DecodeH)
 *
 * Output: Store. (W,H) (DecodeW,DecodeH)
 */
export class Store extends WObject implements IStore {
    //
    private itsPendingClear = false;
    /**
     * Input0: Decoder
     * Input1: TempStore
     */
    constructor(theId?: number, theSrcDecoder?: IWObject, theSrcTempStore?: IWObject) {
        super('Store', theId);
        super.setInput0(theSrcDecoder); // Decoder
        super.setInput1(theSrcTempStore); // TempStore
    }
    /**
     * Clear this store the next time it is processed.
     */
    clear() {
        this.itsPendingClear = true;
    }
    /**
     * Teach this store the next time it is processed.
     */
    teach() {
        // The pending teach request is stored in the classifier
        // to ensure that only one class gets trained at a time.
        const aClassifier = super.getClassifier();
        const aId = super.getId();
        aClassifier.setPendingTeach(aId);
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
     * Input0: Decoder
     * Input1: TempStore
     *             +---------+
     * --Decoder---+0        |
     *             |  Store  +--Store--
     * --TempStore-+1        |
     *             +---------+
     */
    process() {
        //
        const aSupport = Support.getInst();
        if (aSupport.isOpen() === false) {
            return;
        }
        //
        const aInput0 = super.getInput0();
        if (aInput0 === null) {
            return;
        }
        //
        const aInput1 = super.getInput1();
        if (aInput1 === null) {
            return;
        }
        //
        const aId = super.getId();
        //
        if (this.itsPendingClear === true) {
            this.itsPendingClear = false;
            this.doClear();
        }
        //
        // test pending teach request.
        const aClassifier = super.getClassifier();
        const aPendingTeach = aClassifier.getPendingTeach();
        //
        if (aPendingTeach === aId) {
            // clear request.
            aClassifier.setPendingTeach(0);
            this.doTeach();
        }
        //
    }
    /**
     * Clear the store's contents.
     */
    private doClear() {
        //
        const aSupport = Support.getInst();
        //
        const aDstStore = super.getOutput();
        //
        aSupport.processBegin();
        aSupport.processPrepTextureToTexture(null, aDstStore);
        aSupport.processSetMode(Consts.Mode_Fill);
        aSupport.processSetColor([0.0, 0.0, 0.0]);
        aSupport.processCopy();
        aSupport.processEnd();
        //
    }
    /**
     * Teach thid class.
     * Merge the Decoder with the Store.
     * Step1: copy(Store,TempStore)
     * Step2: merge(Decoder,TempStore,Store)
     *
     * Input0: Decoder
     * Input1: TempStore
     *             +---------+
     * --Decoder---+0        |
     *             |  Store  +--Store--
     * --TempStore-+1        |
     *             +---------+
     */
    private doTeach() {
        //
        const aSupport = Support.getInst();
        //
        const aSrcDecoder = super.getInput0().getOutput();
        const aSrcTempStore = super.getInput1().getOutput();
        const aDstStore = super.getOutput();
        //
        // Copy(Store,TempStore)
        aSupport.processBegin();
        aSupport.processPrepTextureToTexture(aDstStore, aSrcTempStore);
        aSupport.processSetMode(Consts.Mode_Copy);
        aSupport.processCopy();
        aSupport.processEnd();
        //
        // Merge(Decoder,TempStore,Store)
        aSupport.processBegin();
        aSupport.processPrepTextureToTexture(aSrcDecoder, aDstStore);
        aSupport.processSetMode(Consts.Mode_Merge);
        aSupport.processAddTexture1(aSrcTempStore.getT());
        aSupport.processCopy();
        aSupport.processEnd();
        //
    }
    // ----
    /**
     *
     */
    bgAction(theAction: string) {
        const aItems = theAction.split(',');
        const aAction = aItems[0];
        if (aAction === 'clear') {
            this.clear();
        } else if (aAction === 'teach') {
            this.teach();
        }
    }
    // ----
    /**
     *
     */
    log(theMessage: string) {
        super.log('Store: ' + theMessage);
    }
    //
}
