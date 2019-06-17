//
import { IIcon } from './iicon';
import { IWTexture } from './iwtexture';
import { WTexture } from './wtexture';
import { Consts } from './consts';
import { Log } from './log';
// tslint:disable:no-redundant-;jsdoc
/**
 *
 */
export class Icon implements IIcon {
    //
    private itsName = '';
    private itsTexture = new WTexture();
    private itsImage: HTMLImageElement = null;
    /**
     *
     */
    constructor(theName: string) {
        this.itsName = theName;
    }
    /**
     *
     */
    getName(): string {
        return this.itsName;
    }
    /**
     *
     */
    getTexture(): IWTexture {
        return this.itsTexture;
    }
    /**
     *
     */
    deallocate() {
        this.itsImage = null;
        this.itsTexture.deallocate();
    }
    /**
     *
     */
    load() {
        this.deallocate();
        //
        const aPath = Consts.Assets_Icons;
        const aName = this.itsName;
        const aPathName = aPath + aName + '.jpg';
        //
        this.itsImage = document.createElement('img');
        this.itsImage.onerror = () => this.onError();
        this.itsImage.onload = () => this.onLoad();
        this.itsImage.src = aPathName;
    }
    /**
     *
     */
    private onError() {
        this.itsImage = null;
    }
    /**
     *
     */
    private onLoad() {
        if (this.itsImage !== null) {
            const aW = this.itsImage.width;
            const aH = this.itsImage.height;
            const aWT = this.itsTexture;
            aWT.allocateLinear(aW, aH, this.itsImage);
            this.log('icon loaded - '  + this.getName());
        }
        this.itsImage = null;
    }
    // ----
    /**
     *
     */
    log(theMessage: string) {
        Log.add(theMessage);
    }
    //
}
