//
import { IWObject } from './iwobject';
import { IClassifier } from './iclassifier';
import { Utils } from './utils';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export class WeakRef {
    //
    private itsKey = { key: 0 };
    private itsWeakMap = new WeakMap();
    /**
     *
     */
    protected constructor() {
    }
    /**
     *
     */
    protected setBaseRef(theRef?: any) {
        const aKey = this.itsKey;
        this.itsWeakMap.delete(aKey);
        if (Utils.isValid(theRef)) {
            this.itsWeakMap.set(aKey, theRef);
        }
    }
    /**
     *
     */
    protected getBaseRef(): any {
        let aReturn: IWObject = null;
        const aKey = this.itsKey;
        const aRef = this.itsWeakMap.get(aKey);
        if (Utils.isValid(aRef)) {
            aReturn = aRef;
        }
        return aReturn;
    }
    //
}
/**
 *
 */
export class IWObjectRef extends WeakRef {
    /**
     *
     */
    constructor(theRef?: IWObject) {
        super();
        this.setRef(theRef);
    }
    /**
     *
     */
    setRef(theRef?: IWObject) {
        this.setBaseRef(theRef);
    }
    /**
     *
     */
    getRef(): IWObject {
        return this.getBaseRef();
    }
}
/**
 *
 */
export class IClassifierRef extends WeakRef {
    /**
     *
     */
    constructor(theRef?: IClassifier) {
        super();
        this.setRef(theRef);
    }
    /**
     *
     */
    setRef(theRef?: IClassifier) {
        this.setBaseRef(theRef);
    }
    /**
     *
     */
    getRef(): IClassifier {
        return this.getBaseRef();
    }
}
//

