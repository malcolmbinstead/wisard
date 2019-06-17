//
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { IWTexture } from './iwtexture';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Consts } from './consts';
import { ITuple } from './interfaces';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export class Tuple extends WObject implements ITuple {
    /**
     * Resample an image so that each line has a fixed width,
     * and the height is modified to show all the inputs.
     *
     * Input0: Scramble (W,H) (ViewW,ViewH)
     * Output: Tuple. (W,H) (TupleW,TupleH)
     *
     */
    constructor(theId?: number, theInput0?: IWObject) {
        super('Tuple', theId);
        super.setInput0(theInput0);
    }
    /**
     * Allocate local storage.
     */
    allocate() {
        this.deallocate();
        //
        const aConfig = super.getConfig();
        const aViewW = aConfig.getViewW();
        const aViewH = aConfig.getViewH();
        const aTupleW = aConfig.getTupleW();
        const aTupleH = aConfig.getTupleH();
        //
        const aT0 = super.getOutput() as WTexture;
        aT0.allocateNearest(aTupleW, aTupleH);
        //
        const aT1 = super.getLookup() as WTexture;
        const aData = this.createMapping(aViewW, aViewH, aTupleW, aTupleH);
        aT1.allocateNearestF32(aTupleW, aTupleH, aData);
        //
    }
    /**
     *
     * @param theSrcW
     * @param theSrcH
     * @param theDstW
     * @param theDstH
     */
    private createMapping(theSrcW, theSrcH, theDstW, theDstH): Float32Array {
        //
        const aSrcW = theSrcW;
        const aSrcH = theSrcH;
        const aDstW = theDstW;
        const aDstH = theDstH;
        //
        const aDX = 1.0 / aSrcW;
        const aHDX = aDX * 0.5;
        //
        const aDY = 1.0 / aSrcH;
        const aHDY = aDY * 0.5;
        //
        const aMXY = new Uint16Array(aDstW * aDstH * 4);
        const aFMXY = new Float32Array(aDstW * aDstH * 4);
        //
        // create a 1to1 mapping.
        let aSrcX = 0;
        let aSrcY = 0;
        for (let aY = 0; aY < aDstH; aY++) {
            for (let aX = 0; aX < aDstW; aX++) {
                const aI = (aY * aDstW + aX) * 4;
                aMXY[aI + 0] = aSrcX++;
                aMXY[aI + 1] = aSrcY;
                aMXY[aI + 2] = 0;
                aMXY[aI + 3] = 0;
                if (aSrcX >= aSrcW) {
                    aSrcX = 0;
                    aSrcY++;
                }
            }
        }
        // Convert all values to normalised floats.
        for (let aY = 0; aY < aDstH; aY++) {
            for (let aX = 0; aX < aDstW; aX++) {
                const aI = (aY * aDstW + aX) * 4;
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
        aSupport.processSetMode(Consts.Mode_Tuple);
        aSupport.processAddTexture1(aT1);
        // aSupport.processDstClear();
        aSupport.processCopy();
        aSupport.processEnd();
    }
    //
}

