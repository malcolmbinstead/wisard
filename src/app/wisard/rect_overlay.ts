// tslint:disable:no-redundant-jsdoc
// tslint:disable:no-redundant-jsdoc
/**
 * Local test.
 * @param theObj
 */
function isValid(theObj: any): boolean {
    return theObj !== null && theObj !== undefined;
}
/**
 * Location and visiblity of rectangular overlay.
 */
export class RectOverlay {
    //
    visible = false;
    nx = 0.5;
    ny = 0.5;
    nw = 1.0;
    nh = 1.0;
    rdeg = 0.0;
    /**
     *
     */
    constructor() { }
    /**
     *
     * @param theV
     * @param theNX
     * @param theNY
     * @param theNW
     * @param theNH
     * @param theRdeg
     */
    set(theV?: boolean, theNX?: number, theNY?: number, theNW?: number, theNH?: number, theRdeg?: number) {
        if (isValid(theV)) {
            this.visible = theV;
        }
        if (isValid(theNX)) {
            this.nx = theNX;
        }
        if (isValid(theNY)) {
            this.ny = theNY;
        }
        if (isValid(theNW)) {
            this.nw = theNW;
        }
        if (isValid(theNH)) {
            this.nh = theNH;
        }
        if (isValid(theRdeg)) {
            this.rdeg = theRdeg;
        }
    }
    //
}

