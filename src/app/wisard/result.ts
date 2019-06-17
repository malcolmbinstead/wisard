//
import { IWObject } from './iwobject';
import { WObject } from './wobject';
import { IWTexture } from './iwtexture';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Consts } from './consts';
import { IResult } from './interfaces';
import { IConfig } from './iconfig';
import { IIcon } from './iicon';
import { Icons } from './icons';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export class Result extends WObject implements IResult {
    //
    private itsThresh = 0.1;
    private itsResult = 0;
    /**
     * Display the best scoring store.
     */
    constructor(theId?: number) {
        super('Result', theId);
    }
    /**
     * Allocate local storage.
     */
    allocate() {
        super.deallocate();
    }
    /**
     * Find the best input, and check that it exceeds the threshold.
     * If some thing is found attempt to make the output texture
     * that of the assigned icon.
     */
    process() {
        //
        this.setResult(0);
        //
        const aConfig = super.getConfig();
        const aStoreCount = aConfig.getStoreCount();
        //
        if (aStoreCount <= 0) { return; }
        //
        let aBestScore = this.getThresh();
        let aBestIndex = -1;
        //
        for (let aIndex = 0; aIndex < aStoreCount ; aIndex++) {
            const aInput = super.getInputN(aIndex);
            if (aInput !== null) {
                const aScore = aInput.getScore();
                if (aBestScore < aScore) {
                    aBestScore = aScore;
                    aBestIndex = aIndex;
                }
            }
        }
        //
        this.setResult(aBestIndex + 1);
    }
    /**
     *
     */
    setThresh(theThresh: number) {
        this.itsThresh = theThresh;
    }
    /**
     *
     */
    getThresh(): number {
        return this.itsThresh;
    }
    /**
     *
     */
    setResult(theResult: number) {
        //
        this.itsResult = theResult;
        //
        let aTexture: IWTexture = null;
        const aConfig = super.getConfig();
        const aIconNames = aConfig.getIconNames();
        const aName = aIconNames[theResult];
        const aIcons = Icons.getInst();
        const aIcon = aIcons.findIcon(aName);
        if (aIcon !== null) {
            aTexture = aIcon.getTexture();
        }
        super.setOutput0(aTexture);
        //
    }
    /**
     *
     */
    getResult(): number {
        return this.itsResult;
    }
    //
}
