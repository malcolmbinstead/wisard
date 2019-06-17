//
import { HttpClient } from '@angular/common/http';
import { IMacros } from './imacros';
import { Http } from './http';
import { Utils } from './utils';
import { IActions } from './iactions';
import { Log } from './log';
//
// tslint:disable:no-redundant-jsdoc
//
class MacroAction {
    /**
     *
     */
    private itsAction = '';
    private itsN = 0;
    private itsIndex = 0;
    /**
     *
     */
    constructor(theAction: string, theN?: number, theIndex?: number) {
        //
        if (Utils.isValid(theAction)) {
            this.itsAction = String(theAction);
        }
        if (Utils.isValid(theN)) {
            this.itsN = theN;
        }
        if (Utils.isValid(theIndex)) {
            this.itsIndex = theIndex;
        }
        //
    }
    /**
     *
     */
    getAction(): string {
        return this.itsAction;
    }
    /**
     *
     */
    getN(): number {
        return this.itsN;
    }
    /**
     *
     */
    getIndex(): number {
        return this.itsIndex;
    }
    //
}
/**
 * The Macros class reads a macro file which can then be used
 * to inject actions into the application.
 */
export class Macros implements IMacros {
    //
    private itsFileName = '';
    private itsLoaded = false;
    private itsWait = 0;
    private itsInit: string[] = [];
    private itsTeachPos1: string[] = [];
    private itsTeachPos2: string[] = [];
    private itsTeachPos3: string[] = [];
    private itsTeachPos4: string[] = [];
    private itsTestPos1: string[] = [];
    private itsTestPos2: string[] = [];
    private itsTestPos3: string[] = [];
    private itsTestPos4: string[] = [];
    //
    private itsActionsCB: IActions = null;
    //
    private itsActions: MacroAction[] = [];
    //
    /**
     *
     */
    constructor() { }
    /**
     *
     */
    setActionsCB(theActionsCB: IActions) {
        this.itsActionsCB = theActionsCB;
    }
    /**
     *
     */
    getActionsCB(): IActions {
        return this.itsActionsCB;
    }
    /**
     *
     */
    setFileName(theFileName: string) {
        if (Utils.isValid(theFileName) === false) {
            theFileName = '';
        }
        this.itsFileName = theFileName;
    }
    /**
     *
     */
    getFileName(): string {
        return this.itsFileName;
    }
    /**
     *
     */
    load() {
        const aFileName = this.itsFileName;
        //
        this.itsLoaded = false;
        this.itsWait = 1000;
        //
        this.itsInit = [];
        this.itsTeachPos1 = [];
        this.itsTeachPos2 = [];
        this.itsTeachPos3 = [];
        this.itsTeachPos4 = [];
        this.itsTestPos1 = [];
        this.itsTestPos2 = [];
        this.itsTestPos3 = [];
        this.itsTestPos4 = [];
        //
        if (Utils.isValid(aFileName) === false) { return; }
        if (aFileName.length === 0) { return; }
        const aHttp = Http.getHttp();
        if (aHttp === null) { return; }
        //
        aHttp.get(aFileName).subscribe(theData => this.onLoad(theData));
        //
    }
    /**
     * Respond to load callback.
     */
    private onLoad(theData) {
        // Read payload.
        this.itsInit = this.check(theData.init);
        //
        this.itsTeachPos1 = this.check(theData.teach1);
        this.itsTeachPos2 = this.check(theData.teach2);
        this.itsTeachPos3 = this.check(theData.teach3);
        this.itsTeachPos4 = this.check(theData.teach4);
        //
        this.itsTestPos1 = this.check(theData.test1);
        this.itsTestPos2 = this.check(theData.test2);
        this.itsTestPos3 = this.check(theData.test3);
        this.itsTestPos4 = this.check(theData.test4);
        //
        // Mark as loaded.
        this.itsLoaded = true;
        this.itsWait = 0;
        //
    }
    /**
     *
     */
    private check(theObj): string[] {
        let aReturn: string[] = [];
        if (Utils.isValid(theObj)) {
            aReturn = theObj;
        }
        return aReturn;
    }
    /**
     * Have the macros been loaded ?
     */
    isLoaded(): boolean {
        return this.itsLoaded;
    }
    /**
     *
     */
    getInit(): string[] {
        return this.itsInit;
    }
    /**
     *
     */
    getTeachPos(theN: number): string[] {
        let aReturn: string[] = [];
        switch (theN) {
            case 1: aReturn = this.itsTeachPos1; break;
            case 2: aReturn = this.itsTeachPos2; break;
            case 3: aReturn = this.itsTeachPos3; break;
            case 4: aReturn = this.itsTeachPos4; break;
        }
        return aReturn;
    }
    /**
     *
     */
    getTestPos(theN: number): string[] {
        let aReturn: string[] = [];
        switch (theN) {
            case 1: aReturn = this.itsTestPos1; break;
            case 2: aReturn = this.itsTestPos2; break;
            case 3: aReturn = this.itsTestPos3; break;
            case 4: aReturn = this.itsTestPos4; break;
        }
        return aReturn;
    }
    /**
     * place actions in the request queue.
     */
    sendActions(theActions: string[]) {
        if (Utils.isValid(theActions) === true) {
            const aLength = theActions.length;
            for (let aIndex = 0; aIndex < aLength; aIndex++) {
                const aAction = theActions[aIndex];
                this.sendAction(aAction);
            }
        }
    }
    /**
     * place an action in the request queue.
     */
    sendAction(theAction: string) {
        if (Utils.isValid(theAction) === true) {
            const aAction = new MacroAction(theAction);
            this.itsActions.push(aAction);
        }
    }
    /**
     * place an init in the request queue.
     */
    sendInit() {
        const aAction = new MacroAction('init');
        this.itsActions.push(aAction);
    }
    /**
     * place a teach position in the request queue.
     * @param theN Which teach class (1-4)
     * @param theIndex Which teach position.
     * @param theAction Optional action.
     */
    sendTeachPos(theN: number, theIndex: number, theAction?: string) {
        const aAction = new MacroAction('teachpos', theN, theIndex);
        this.itsActions.push(aAction);
        this.sendAction(theAction);
    }
    /**
     * place a test position in the request queue.
     * @param theN Which test class (1-4)
     * @param theIndex When test position.
     * @param theAction Optional action.
     */
    sendTestPos(theN: number, theIndex: number, theAction?: string) {
        const aAction = new MacroAction('testpos', theN, theIndex);
        this.itsActions.push(aAction);
        this.sendAction(theAction);
    }
    /**
     * Deliver pending actions.
     */
    poll() {
        //
        const aLoaded = this.itsLoaded;
        //
        if (this.itsWait > 0) {
            this.itsWait--;
            return;
        }
        //
        if (this.itsActionsCB === null) {
            return;
        }
        //
        while (this.itsActions.length > 0) {
            //
            const aMacroAction = this.itsActions.shift();
            const aAction = aMacroAction.getAction();
            const aN = aMacroAction.getN();
            const aIndex = aMacroAction.getIndex();
            //
            if (aAction === 'init' && aLoaded) {
                this.itsActionsCB.actions(this.getInit());
            } else if (aAction === 'teachpos' && aLoaded) {
                const aTeachPosN = this.getTeachPos(aN);
                this.itsActionsCB.action(aTeachPosN[aIndex]);
            } else if (aAction === 'testpos' && aLoaded) {
                const aTestPosN = this.getTestPos(aN);
                this.itsActionsCB.action(aTestPosN[aIndex]);
            } else {
                this.itsActionsCB.action(aAction);
            }
        }
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
