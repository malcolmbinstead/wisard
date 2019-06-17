// tslint:disable:no-redundant-jsdoc
/**
 * Wrapped texture interface
 */
export interface IWTexture {
    //
    isValid(): boolean;
    getT(): WebGLTexture;
    getW(): number;
    getH(): number;
    //
}
