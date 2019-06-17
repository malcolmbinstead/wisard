//
import { WObject } from './wobject';
import { WTexture } from './wtexture';
import { Support } from './support';
import { ISource } from './interfaces';
import { Utils } from './utils';
//
// tslint:disable:no-redundant-jsdoc
/**
 * This object turns an image file into a source
 * for the the processing chain.
 *
 * Input: MP4 image file.
 * Output: Texture WxH detrmined by file content.
 */
export class VideoSource extends WObject implements ISource {
    //
    private itsVideo: HTMLVideoElement = null;
    private itsLoaded = false;
    private itsPlaying = false;
    private itsTimeUpdate = false;
    /**
     *
     */
    constructor(theId?: number) {
        super('Source', theId);
    }
    /**
     *
     */
    setFileName(theFileName: string) {
        const aConfig = super.getConfig();
        aConfig.setName(theFileName);
        this.load();
    }
    /**
     *
     */
    getFileName(): string {
        const aConfig = super.getConfig();
        return aConfig.getName();
    }
    // ----
    /**
     * Allocate local storage.
     */
    allocate() {
        this.load();
    }
    /**
     * Attempt to load the image.
     */
    load() {
        this.deallocate();
        //
        const aConfig = super.getConfig();
        const aPath = aConfig.getPath();
        const aName = aConfig.getName();
        const aPathName = aPath + aName;
        //
        this.itsLoaded = false;
        this.itsPlaying = false;
        this.itsTimeUpdate = false;
        //
        this.itsVideo = document.createElement('video');
        if (this.itsVideo === null) { return; }
        //
        this.itsVideo.autoplay = true;
        this.itsVideo.muted = true;
        this.itsVideo.loop = true;
        //
        this.itsVideo.onerror = () => { this.onError(); };
        // We must wait for 2 events before
        // we are ready to process the imagery.
        this.itsVideo.onplaying = () => { this.onPlaying(); };
        this.itsVideo.ontimeupdate = () => { this.onTimeUpdate(); };
        //
        this.itsVideo.src = aPathName;
        //
        this.itsVideo.play();
        //
    }
    /**
     *
     */
    private onError() {
        this.deallocate();
    }
    /**
     *
     */
    private onPlaying() {
        this.itsPlaying = true;
        this.checkReady();
    }
    /**
     *
     */
    private onTimeUpdate() {
        this.itsTimeUpdate = true;
        this.checkReady();
    }
    /**
     *
     */
    private checkReady() {
        if (this.itsPlaying && this.itsTimeUpdate) {
            this.firstLoad();
        }
    }
    /**
     *
     */
    private firstLoad() {
        const aSrc = this.itsVideo;
        if (aSrc !== null) {
            const aW = aSrc.videoWidth;
            const aH = aSrc.videoHeight;
            const aT = super.getOutput() as WTexture;
            if (aT.allocateLinear(aW, aH)) {
                this.itsLoaded = true;
                this.copy();
            }
        }
    }
    /**
     * Discard resources.
     */
    deallocate() {
        this.itsVideo = null;
        this.itsLoaded = false;
        super.deallocate();
    }
    /**
     *
     */
    play() {
        if (this.itsVideo !== null) {
            this.itsVideo.play();
        }
    }
    /**
     *
     */
    stop() {
        if (this.itsVideo !== null) {
            this.itsVideo.pause();
        }
    }
    /**
     *
     */
    process() {
        this.copy();
    }
    /**
     *
     */
    private copy() {
        if (this.itsVideo === null) { return; }
        if (this.itsLoaded === false) { return; }
        const aSupport = Support.getInst();
        const aSrc = this.itsVideo;
        const aDst = super.getOutput().getT();
        aSupport.copyImageToTexture(aSrc, aDst);
    }
    // ----
    /**
     * Various move commands.
     */
    setX(theX: number) { super.setX(theX); }
    setY(theY: number) { super.setY(theY); }
    setXY(theX: number, theY: number) { super.setXY(theX, theY); }
    getX(): number { return super.getX(); }
    getY(): number { return super.getY(); }
    moveDX(theDX: number) { super.moveDX(theDX); }
    moveDY(theDY: number) { super.moveDY(theDY); }
    moveDXY(theDX: number, theDY: number) { super.moveDXY(theDX, theDX); }
    // ----
    /**
     * Respond to action.
     */
    bgAction(theAction: string) {
        const aItems = theAction.split(',');
        const aAction = aItems[0];
        const aP0 = aItems[1];
        const aP1 = aItems[2];
        if (aAction === 'setXY') {
            this.setXY(Utils.parseInt(aP0), Utils.parseInt(aP1));
        }
    }
    // ----
    /**
     *
     */
    log(theMessage: string) {
        super.log('VideoSource: ' + theMessage);
    }
    //
}
