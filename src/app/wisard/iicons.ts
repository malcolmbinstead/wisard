//
import { IIcon } from './iicon';
// tslint:disable:no-empty-interface
/**
 * Interface to the Icon pool.
 */
export interface IIcons {
    addNames(theNames: string[]);
    addName(theName: string);
    findIcon(theName: string): IIcon;
    clear();
}
