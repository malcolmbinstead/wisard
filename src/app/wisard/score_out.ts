//
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Consts } from './consts';
import { IScoreIn, IScoreOut } from './interfaces';
// tslint:disable:no-redundant-jsdoc
/**
 * Displays Score as a bar graph element.
 * Output: ScoreOut. (W,H) (1,DecodeH)
 */
export class ScoreOut extends WObject implements IScoreOut {
    /**
     *
     */
    constructor(theId?: number, theInput0?: IWObject) {
        super('ScoreOut', theId);
        super.setInput0(theInput0);
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
        const aT = super.getOutput() as WTexture;
        aT.allocateNearest(1, aH);
        //
    }
    /**
     *
     */
    process() {
        //
        super.setScore(0.0);
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
        const aScore = aInput.getScore();
        //
        const aSrc = aInput.getOutput();
        const aDst = super.getOutput();
        //
        aSupport.processBegin();
        aSupport.processPrepTextureToTexture(aSrc, aDst);
        aSupport.processSetMode(Consts.Mode_ScoreOut);
        aSupport.processSetThreshold(aScore);
        aSupport.processSetColor([255, 0, 0]);
        // aSupport.processDstClear();
        aSupport.processCopy();
        aSupport.processEnd();
        //
        super.setScore(aScore);
        //
    }
    /**
     *
     */
    getScore(): number {
        return super.getScore();
    }
    //
}
