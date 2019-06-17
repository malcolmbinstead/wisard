//
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { IWTexture } from './iwtexture';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Consts } from './consts';
import { PRNG } from './prng';
import { IScramble } from './interfaces';
// tslint:disable:no-redundant-jsdoc
/**
 * Converts and Image into a scrambled version.
 *
 * Input: Threshold. (W,H) (ViewW,ViewH)
 * Output: Scramble. (W,H) (ViewW,ViewH)
 *
 */
export class Scramble extends WObject implements IScramble {
    //
    private itsReverse = false;
    /**
     *
     */
    constructor(theId?: number, theInput0?: IWObject) {
        super('Scramble', theId);
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
        //
        const aT0 = super.getOutput() as WTexture;
        aT0.allocateNearest(aW, aH);
        //
        const aT1 = super.getLookup() as WTexture;
        let aSeed = aConfig.getScrambleSeed();
        this.itsReverse = false;
        if (aSeed < 0) {
            aSeed = -aSeed;
            this.itsReverse = true;
        }
        const aData = this.createMapping(aW, aH, aSeed);
        aT1.allocateNearestF32(aW, aH, aData);
        //
    }
    /**
     *
     */
    private createMapping(theW: number, theH: number, theSeed: number): Float32Array {
        //
        const aW = theW;
        const aH = theH;
        //
        const aDX = 1.0 / aW;
        const aHDX = aDX * 0.5;
        //
        const aDY = 1.0 / aH;
        const aHDY = aDY * 0.5;
        //
        const aMXY = new Uint16Array(aW * aH * 4);
        const aFMXY = new Float32Array(aW * aH * 4);
        //
        // create a 1to1 mapping.
        for (let aY = 0; aY < aH; aY++) {
            for (let aX = 0; aX < aW; aX++) {
                const aI = (aY * aW + aX) * 4;
                aMXY[aI + 0] = aX;
                aMXY[aI + 1] = aY;
            }
        }
        if (theSeed > 0) {
            // Shuffle the mapping.
            const aRNG = new PRNG(theSeed);
            for (let aY1 = 0; aY1 < aH; aY1++) {
                for (let aX1 = 0; aX1 < aW; aX1++) {
                    const aX2 = aRNG.nextRange(aW);
                    const aY2 = aRNG.nextRange(aH);
                    const aI1 = (aY1 * aW + aX1) * 4;
                    const aI2 = (aY2 * aW + aX2) * 4;
                    // swap mapping elements.
                    const aTMX1 = aMXY[aI1 + 0];
                    const aTMY1 = aMXY[aI1 + 1];
                    const aTMX2 = aMXY[aI2 + 0];
                    const aTMY2 = aMXY[aI2 + 1];
                    aMXY[aI1 + 0] = aTMX2;
                    aMXY[aI1 + 1] = aTMY2;
                    aMXY[aI2 + 0] = aTMX1;
                    aMXY[aI2 + 1] = aTMY1;
                }
            }
        }
        // Create a reverse mapping
        for (let aY = 0; aY < aH; aY++) {
            for (let aX = 0; aX < aW; aX++) {
                const aI = (aY * aW + aX) * 4;
                const aMX = aMXY[aI + 0];
                const aMY = aMXY[aI + 1];
                const aMI = (aMY * aW + aMX) * 4;
                aMXY[aMI + 2] = aX;
                aMXY[aMI + 3] = aY;
            }
        }
        // Convert all values to normalised floats.
        for (let aY = 0; aY < aH; aY++) {
            for (let aX = 0; aX < aW; aX++) {
                const aI = (aY * aW + aX) * 4;
                aFMXY[aI + 0] = aMXY[aI + 0] * aDX + aHDX;
                aFMXY[aI + 1] = aMXY[aI + 1] * aDY + aHDY;
                aFMXY[aI + 2] = aMXY[aI + 2] * aDX + aHDX;
                aFMXY[aI + 3] = aMXY[aI + 3] * aDY + aHDY;
            }
        }
        //
        return aFMXY;
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
        const aDst = super.getOutput();
        const aT1 = super.getLookup().getT();
        //
        aSupport.processBegin();
        aSupport.processPrepTextureToTexture(aSrc, aDst);
        aSupport.processSetMode(Consts.Mode_Scramble);
        aSupport.processAddTexture1(aT1);
        if (this.itsReverse === true) {
            aSupport.processSetReverse();
        }
        // aSupport.processDstClear();
        aSupport.processCopy();
        aSupport.processEnd();
    }
    //
}
