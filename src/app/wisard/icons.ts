//
import { IIcons } from './iicons';
import { IIcon } from './iicon';
import { Icon } from './icon';
import { IWTexture } from './iwtexture';
import { WTexture } from './wtexture';
import { Support } from './support';
import { Utils } from './utils';
import { Consts } from './consts';

/**
 *
 */
export class Icons implements IIcons {
    //
    private static itsInst: Icons = null;
    private itsIcons: Icon[] = [];
    /**
     * Access the Icons singlton.
     */
    static getInst(): Icons {
        if (Icons.itsInst === null) {
            Icons.itsInst = new Icons();
        }
        return Icons.itsInst;
    }
    /**
     *
     */
    private constructor() {
    }
    /**
     * Attempt to add new icon names to the pool.
     */
    addNames(theNames: string[]) {
        if (Utils.isValid(theNames) === false) { return; }
        const aLength = theNames.length;
        for (let aIndex = 0; aIndex < aLength; aIndex++) {
            this.addName(theNames[aIndex]);
        }
    }
    /**
     *
     */
    addName(theName: string) {
        if (Utils.isValid(theName) === false) { return; }
        if (this.findIcon(theName) !== null) { return; }
        if (theName.length === 0) { return; }
        const aIcon = new Icon(theName);
        this.itsIcons.push(aIcon);
        aIcon.load();
    }
    /**
     * Try to find an icon using its name.
     */
    findIcon(theName: string): IIcon {
        let aReturn: IIcon = null;
        if (Utils.isValid(theName) === true) {
            const aLength = this.itsIcons.length;
            for (let aIndex = 0; aIndex < aLength; aIndex++) {
                const aIcon = this.itsIcons[aIndex];
                if (theName === aIcon.getName()) {
                    aReturn = aIcon;
                    break;
                }
            }
        }
        return aReturn;
    }
    /**
     * Remove all known Icons from the pool
     * and recycle their resources.
     */
    clear() {
        while (this.itsIcons.length > 0) {
            const aIcon = this.itsIcons.pop();
            aIcon.deallocate();
        }
    }
    //
}
