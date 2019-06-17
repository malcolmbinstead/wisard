//
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Consts } from './consts';
import { IConfig } from './iconfig';
import { IScoreIn } from './interfaces';
// tslint:disable:no-redundant-jsdoc
/**
 * Computes the score and save it a single item.
 * Output: ScoreIn. (W,H) (1,1)
 */
export class ScoreIn extends WObject implements IScoreIn {
    /**
     *
     */
    constructor(theId?: number, theInput0?: IWObject) {
        super('ScoreIn', theId);
        super.setInput0(theInput0);
    }
    /**
     * Allocate local storage.
     */
    allocate() {
        super.deallocate();
        //
        const aT0 = super.getOutput() as WTexture;
        aT0.allocateNearest(1, 1);
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
        const aSrc = aInput.getOutput();
        const aDst = super.getOutput() as WTexture;
        //
        aSupport.processBegin();
        // Collect the score.
        aSupport.processPrepTextureToTexture(aSrc, aDst);
        aSupport.processSetMode(Consts.Mode_ScoreIn);
        aSupport.processDstClear();
        aSupport.processCopy();
        // Read the packed score back.
        const aGL = aSupport.getGL();
        aGL.readBuffer(aGL.COLOR_ATTACHMENT0);
        const aConfig = super.getConfig();
        const aDecodeH = aConfig.getDecodeH();
        const aFC = Math.max(1, aDecodeH);
        let aScore = 0;
        {
            const aX = 0;
            const aY = 0;
            const aW = 1;
            const aH = 1;
            const aFormat = aGL.RGBA;
            const aType = aGL.UNSIGNED_BYTE;
            const aData = new Uint8Array(4);
            aGL.readPixels(aX, aY, aW, aH, aFormat, aType, aData);
            //
            const aR = aData[0];
            const aG = aData[1] * 256;
            const aB = aData[2] * 256 * 256;
            aScore = aR + aG + aB;
            aScore = Math.min(aScore, aFC);
        }
        aSupport.processEnd();
        //
        // Save normalised score.
        super.setScore(aScore / aFC);
        //
    }
    /**
     *
     */
    getScore() {
        return super.getScore();
    }
    //
}
