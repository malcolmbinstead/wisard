//
import { IWTexture } from './iwtexture';
// tslint:disable:no-empty-interface
//
/**
 * Interface to a single Icon in the pool.
 */
export interface IIcon {
    getName(): string;
    getTexture(): IWTexture;
}
