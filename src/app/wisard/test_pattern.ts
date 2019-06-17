//
import { WObject } from './wobject';
import { IWTexture } from './iwtexture';
import { WTexture } from './wtexture';
import { Utils } from './utils';
// tslint:disable:no-redundant-jsdoc
// tslint:disable:no-bitwise
/**
 *
 */
export class TestPattern extends WObject {
    //
    private itsW = 0;
    private itsH = 0;
    private itsP = 0;
    /**
     * Create a test pattern for feeding int a WObject.
     */
    constructor(theW: number, theH: number, theP: number, theId?: number) {
        super('TestPattern', theId);
        this.itsW = theW;
        this.itsH = theH;
        this.itsP = theP;
    }
    /**
     *
     */
    allocate() {
        this.deallocate();
        //
        const aW = this.itsW;
        const aH = this.itsH;
        //
        const aT0 = this.getOutput() as WTexture;
        aT0.allocateNearest(aW, aH, null, this.createPattern());
    }
    /**
     *
     */
    private createPattern(): Uint8Array {
        const aW = this.itsW;
        const aH = this.itsH;
        const aP = this.itsP;
        if (aW <= 0) { return null; }
        if (aH <= 0) { return null; }
        const aData = new Uint8Array(aW * aH * 4);
        for (let aY = 0; aY < aH; aY++) {
            for (let aX = 0; aX < aW; aX++) {
                switch (aP) {
                    default:
                    case 0: this.pattern0(aData, aX, aY); break;
                    case 1: this.pattern1(aData, aX, aY); break;
                    case 2: this.pattern2(aData, aX, aY); break;
                    case 3: this.pattern3(aData, aX, aY); break;
                    case 4: this.pattern4(aData, aX, aY); break;
                    case 5: this.pattern5(aData, aX, aY); break;
                    case 6: this.pattern6(aData, aX, aY); break;
                }
            }
        }
        return aData;
    }
    /**
     *
     * @param theData
     * @param theX
     * @param theY
     * @param theV
     */
    private set(theData: Uint8Array, theX: number, theY: number, theV: number) {
        const aW = this.itsW;
        const aOffset = ((theY * aW) + theX) * 4;
        const aV = Utils.forceRange(theV, 0, 255);
        theData[aOffset + 0] = aV;
        theData[aOffset + 1] = aV;
        theData[aOffset + 2] = aV;
        theData[aOffset + 3] = 255;
    }
    /**
     * All black.
     */
    private pattern0(theData: Uint8Array, theX: number, theY: number) {
        this.set(theData, theX, theY, 0);
    }
    /**
     * Vertical stripes
     */
    private pattern1(theData: Uint8Array, theX: number, theY: number) {
        if ((theX & 1) === 0) {
            this.set(theData, theX, theY, 0);
        } else {
            this.set(theData, theX, theY, 255);
        }
    }
    /**
     * Horizontal stripes.
     */
    private pattern2(theData: Uint8Array, theX: number, theY: number) {
        if ((theY & 1) === 0) {
            this.set(theData, theX, theY, 0);
        } else {
            this.set(theData, theX, theY, 255);
        }
    }
    /**
     * Checker pattern.
     */
    private pattern3(theData: Uint8Array, theX: number, theY: number) {
        if ((theX & 1) === (theY & 1)) {
            this.set(theData, theX, theY, 0);
        } else {
            this.set(theData, theX, theY, 255);
        }
    }
    /**
     * wedge pattern.
     */
    private pattern4(theData: Uint8Array, theX: number, theY: number) {
        if (theX < theY) {
            this.set(theData, theX, theY, 0);
        } else {
            this.set(theData, theX, theY, 255);
        }
    }
    /**
     *
     */
    private pattern5(theData: Uint8Array, theX: number, theY: number) {
        const aW = this.itsW;
        const aH = this.itsH;
        const aVX = aW - theX;
        const aVY = aH - theY;
        this.set(theData, theX, theY, (aVX + aVY) * 16);
    }
    /**
     *
     */
    private pattern6(theData: Uint8Array, theX: number, theY: number) {
        let aMask = 0;
        if (theX < 32) {
            aMask = 1 << theX;
        }
        const aV = (aMask & theY) === 0 ? 0 : 255;
        this.set(theData, theX, theY, aV);
    }
    //
}
