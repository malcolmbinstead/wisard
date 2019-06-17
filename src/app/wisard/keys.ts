// tslint:disable:no-redundant-jsdoc
// tslint:disable:variable-name
/**
 * A collection of static keys for use with WeakMaps.
 */
export class Keys {
    //
    static readonly KEY_MAX = 200;
    //
    private static itsInst: Keys = null;
    //
    private itsKeys: any[] = [];
    /**
     *
     */
    private constructor() {
        for (let aIndex = 0; aIndex < Keys.KEY_MAX; aIndex++) {
            this.itsKeys.push({});
        }
    }
    /**
     *
     */
    static getInst(): Keys {
        if (Keys.itsInst === null) {
            Keys.itsInst = new Keys();
        }
        return Keys.itsInst;
    }
    /**
     *
     * @param theIndex
     */
    static key(theIndex: number): any {
        return Keys.getInst().getKey(theIndex);
    }
    /**
     *
     */
    getKey(theIndex: number): any {
        let aReturn = {};
        if (theIndex >= 0 && theIndex < Keys.KEY_MAX) {
            aReturn = this.itsKeys[theIndex];
        }
        return aReturn;
    }
    //
}

