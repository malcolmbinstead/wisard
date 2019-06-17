//
import { IActions } from './iactions';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export interface IMacros {
    //
    setActionsCB(theActionsCB: IActions);
    getActionsCB(): IActions;
    //
    setFileName(theFielName: string);
    getFileName(): string;
    load();
    isLoaded(): boolean;
    //
    getInit(): string[];
    getTeachPos(theN: number): string[];
    getTestPos(theN: number): string[];
    //
    poll();
    //
    sendActions(theActions: string[]);
    sendAction(theAction: string);
    sendInit();
    sendTeachPos(theN: number, theIndex: number, theAction?: string);
    sendTestPos(theN: number, theIndex: number, theAction?: string);
    //
}
