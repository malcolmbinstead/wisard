//
import { Utils } from './utils';
//
export class MacroList {
    //
    private itsLength = 0;
    private itsIndex = -1;
    //
    constructor() {}
    /**
     *
     */
    set length(theLength: number) {
        this.itsLength = theLength;
        if (theLength <= 0) {
            this.itsIndex = -1;
        }
    }
    /**
     *
     */
    isValid(): boolean {
        const aLength = this.itsLength;
        return aLength > 0;
    }
    /**
     *
     */
    first() {
        this.itsIndex = -1;
    }
    /**
     *
     */
    next(): number {
        if (this.itsIndex < -1) {
            this.itsIndex = -1;
        }
        const aLength = this.itsLength;
        if (aLength > 0) {
            this.itsIndex++;
            if (this.itsIndex >= aLength) {
                this.itsIndex = 0;
            }
        } else {
            this.itsIndex = -1;
        }
        return this.itsIndex;
    }
    /**
     *
     */
    get index(): number {
        return this.itsIndex;
    }
    //
}

