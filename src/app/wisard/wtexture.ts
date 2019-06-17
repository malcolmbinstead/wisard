//
import { IWTexture } from './iwtexture';
import { GLUtils } from './glutils';
import { Support } from './support';
// tslint:disable:no-redundant-jsdoc
/**
 * Wrapped texture.
 */
export class WTexture implements IWTexture {
  //
  private itsT: WebGLTexture = null;
  private itsW = 0;
  private itsH = 0;
  //
  /**
   * Get wrapped texture.
   */
  constructor() { }
  /**
   * Is the wrapped texture valid.
   */
  isValid(): boolean {
    return this.itsT !== null;
  }
  /**
   * Access the wrapped texture.
   */
  getT(): WebGLTexture {
    return this.itsT;
  }
  /**
   * Get the width of the wrapped texture.
   */
  getW(): number {
    return this.itsW;
  }
  /**
   * Get height of the wrappped texture.
   */
  getH(): number {
    return this.itsH;
  }
  /**
   * Allocate a texture with a 'Linear' filter.
   */
  allocateLinear(theW: number, theH: number, theImg?: HTMLImageElement): boolean {
    let aReturn = false;
    this.deallocate();
    if (theW > 0 && theH > 0) {
      const aGL = Support.getInst().getGL();
      //
      const aT = GLUtils.createTextureLinear(aGL);
      GLUtils.primeTexRGBA8U(aGL, theW, theH);
      if (GLUtils.isValid(theImg)) {
        GLUtils.copyImageToTexture(aGL, theImg);
      }
      GLUtils.unbindTexture(aGL);
      //
      this.itsT = aT;
      this.itsW = theW;
      this.itsH = theH;
      aReturn = true;
    }
    return aReturn;
  }
  /**
   * Allocate a texture with a 'Nearest' filter and RGBA8U/data
   * @param theW
   * @param theH
   * @param theRGBA Optional colour.
   * @param theData Optional data
   */
  allocateNearest(theW: number, theH: number, theRGBA?: number, theData?: Uint8Array): boolean {
    let aReturn = false;
    this.deallocate();
    if (theW > 0 && theH > 0) {
      const aGL = Support.getInst().getGL();
      //
      const aT = GLUtils.createTextureNearest(aGL);
      GLUtils.primeTexRGBA8U(aGL, theW, theH, theRGBA, theData);
      GLUtils.unbindTexture(aGL);
      //
      this.itsT = aT;
      this.itsW = theW;
      this.itsH = theH;
      aReturn = true;
    }
    return aReturn;
  }
  /**
   * Allocate a texture with a 'Nearest' filter and RGBA32F data.
   * @param theW
   * @param theH
   * @param theData
   */
  allocateNearestF32(theW: number, theH: number, theData?: Float32Array): boolean {
    let aReturn = false;
    this.deallocate();
    if (theW > 0 && theH > 0) {
      const aGL = Support.getInst().getGL();
      //
      const aT = GLUtils.createTextureNearest(aGL);
      GLUtils.primeTexRGBA32F(aGL, theW, theH, theData);
      GLUtils.unbindTexture(aGL);
      //
      this.itsT = aT;
      this.itsW = theW;
      this.itsH = theH;
      aReturn = true;
    }
    return aReturn;
  }
  /**
   *
   */
  deallocate() {
    if (this.itsT !== null) {
      const aGL = Support.getInst().getGL();
      //
      GLUtils.deleteTexture(aGL, this.itsT);
      this.itsT = null;
      this.itsW = 0;
      this.itsH = 0;
    }
  }
  //
}
