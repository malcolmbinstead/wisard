// tslint:disable-next-line:no-reference
/// <reference path="../../../node_modules/@types/webgl2/index.d.ts" />
import { Log } from './log';
import { Txy, TArrayXY } from './types';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
export class GLUtils {
  //
  static itsDefaultShaderType = ['VERTEX_SHADER', 'FRAGMENT_SHADER'];
  private static itsTextureCount = 0;
  private static itsFramebufferCount = 0;
  private static itsBufferCount = 0;
  private static itsVertexArrayCount = 0;
  /**
   * Do not construct.
   */
  private constructor() { }
  /**
   * Log a local message.
   * @param theMsg
   */
  private static log(theMsg) {
    Log.add(theMsg);
  }
  /**
   * Report and error message.
   * @param theMsg
   */
  private static errorCallback(theMsg) {
    GLUtils.log(theMsg);
  }
  /**
   * Does an object exist.
   * @param theObj
   */
  static isValid(theObj: any): boolean {
    return theObj !== null && theObj !== undefined;
  }
  /**
   * Is this the name of a JPEG file.
   * @param theName
   */
  static isJPG(theName: string): boolean {
    let aReturn = false;
    if (GLUtils.isValid(theName)) {
      aReturn = theName.toLowerCase().endsWith('.jpg');
    }
    return aReturn;
  }
  /**
   *  Is this the name of an MP4 file.
   * @param theName
   */
  static isMP4(theName: string): boolean {
    let aReturn = false;
    if (GLUtils.isValid(theName)) {
      aReturn = theName.toLowerCase().endsWith('.mp4');
    }
    return aReturn;
  }
  /**
   *
   */
  static getTextureCount(): number {
    return GLUtils.itsTextureCount;
  }
  /**
   *
   */
  static getFramebufferCount(): number {
    return GLUtils.itsFramebufferCount;
  }
  /**
   *
   */
  static getBufferCount(): number {
    return GLUtils.itsBufferCount;
  }
  /**
   *
   */
  static getVertexArrayCount(): number {
    return GLUtils.itsVertexArrayCount;
  }
  // ----
  /**
   * Create a Framebuffer
   * @param theGL
   */
  static createFramebuffer(theGL) {
    const aFramebuffer = theGL.createFramebuffer();
    if (GLUtils.ok(theGL)) {
      GLUtils.itsFramebufferCount++;
    }
    return aFramebuffer;
  }
  /**
   * Delete a Framebuffer.
   * @param theGL
   * @param theFramebuffer
   */
  static deleteFramebuffer(theGL, theFramebuffer) {
    theGL.deleteFramebuffer(theFramebuffer);
    if (GLUtils.ok(theGL)) {
      GLUtils.itsFramebufferCount++;
    }
  }
  // ----
  /**
   * Create a Buffer
   * @param theGL
   */
  static createBuffer(theGL) {
    const aBuffer = theGL.createBuffer();
    if (GLUtils.ok(theGL)) {
      GLUtils.itsBufferCount++;
    }
    return aBuffer;
  }
  /**
   * Delete a Buffer.
   * @param theGL
   * @param theBuffer
   */
  static deleteBuffer(theGL, theBuffer) {
    theGL.deleteBuffer(theBuffer);
    if (GLUtils.ok(theGL)) {
      GLUtils.itsBufferCount++;
    }
  }
  // ----
  /**
   * Create VertexArray
   * @param theGL
   */
  static createVertexArray(theGL) {
    const aVertexArray = theGL.createVertexArray();
    if (GLUtils.ok(theGL)) {
      GLUtils.itsVertexArrayCount++;
    }
    return aVertexArray;
  }
  /**
   * Delete VerexArray.
   * @param theGL
   * @param theVertexArray
   */
  static deleteVertexArray(theGL, theVertexArray) {
    theGL.deleteVertexArray(theVertexArray);
    if (GLUtils.ok(theGL)) {
      GLUtils.itsVertexArrayCount++;
    }
  }
  // ----
  /**
   * Delete a texture;
   * @param theGL
   * @param theTexture
   */
  static deleteTexture(theGL, theTexture) {
    theGL.deleteTexture(theTexture);
    if (GLUtils.ok(theGL)) {
      GLUtils.itsTextureCount--;
    }
  }
  /**
   * Create and bind a texture
   * with linear filtering.
   */
  static createTextureLinear(theGL): WebGLTexture {
    const aTexture: WebGLTexture = theGL.createTexture();
    if (GLUtils.ok(theGL)) {
      GLUtils.itsTextureCount++;
    }
    GLUtils.setupTextureLinear(theGL, aTexture);
    return aTexture;
  }
  /**
   * Create and bind to a texture
   * with nearest filtering.
   */
  /**
   * Create and bind to a texture
   * with nearest filtering.
   * @param theGL
   */
  static createTextureNearest(theGL): WebGLTexture {
    const aTexture: WebGLTexture = theGL.createTexture();
    if (GLUtils.ok(theGL)) {
      GLUtils.itsTextureCount++;
    }
    GLUtils.setupTextureNearest(theGL, aTexture);
    return aTexture;
  }
  /**
   * Size and populate the bound texture to RGBA_8U/Image
   * @param theGL
   * @param theWidth
   * @param theHeight
   * @param theRGBA Optional Colour
   * @param theData Optional Image
   */
  static primeTexRGBA8U(
    theGL,
    theWidth: number,
    theHeight: number,
    theRGBA?: number,
    theData?: Uint8Array
  ) {
    //
    const aMipLevel = 0; // the largest mip
    const aInternalFormat = theGL.RGBA; // format we want in the texture
    const aBorder = 0; // must be 0
    const aSrcFormat = theGL.RGBA; // format of data we are supplying
    const aSrcType = theGL.UNSIGNED_BYTE; // type of data we are supplying
    let aData = theData;
    //
    if (GLUtils.isValid(aData) === false) {
      //
      aData = new Uint8Array(theWidth * theHeight * 4); // no data = create a blank texture
      //
      let aR = 0;
      let aG = 0;
      let aB = 0;
      let aA = 255;
      if (GLUtils.isValid(theRGBA)) {
        const aM = 255;
        // tslint:disable:no-bitwise
        aA = theRGBA & aM;
        theRGBA >>= 8;
        aB = theRGBA & aM;
        theRGBA >>= 8;
        aG = theRGBA & aM;
        theRGBA >>= 8;
        aR = theRGBA & aM;
        // tslint:enable:no-bitwise
      }
      const aSize = theWidth * theHeight;
      let aI = 0;
      for (let aIndex = 0; aIndex < aSize; aIndex++) {
        aData[aI++] = aR;
        aData[aI++] = aG;
        aData[aI++] = aB;
        aData[aI++] = aA;
      }
    }
    //
    theGL.pixelStorei(theGL.UNPACK_ALIGNMENT, 1);
    GLUtils.ok(theGL);
    //
    theGL.texImage2D(
      theGL.TEXTURE_2D,
      aMipLevel,
      aInternalFormat,
      theWidth,
      theHeight,
      aBorder,
      aSrcFormat,
      aSrcType,
      aData
    );
    GLUtils.ok(theGL);
  }
  /**
   *  Size and populate the bound texture to RGBA_32F.
   * @param theGL 
   * @param theWidth 
   * @param theHeight 
   * @param theData 
   */
  static primeTexRGBA32F(
    theGL,
    theWidth: number,
    theHeight: number,
    theData?: Float32Array
  ) {
    //
    const aMipLevel = 0; // the largest mip
    const aInternalFormat = theGL.RGBA32F; // format we want in the texture
    const aBorder = 0; // must be 0
    const aSrcFormat = theGL.RGBA; // format of data we are supplying
    const aSrcType = theGL.FLOAT; // type of data we are supplying
    let aData = theData;
    if (GLUtils.isValid(aData) === false) {
      aData = new Float32Array(theWidth * theHeight * 4); // no data = create a blank texture
    }
    //
    theGL.pixelStorei(theGL.UNPACK_ALIGNMENT, 1);
    GLUtils.ok(theGL);
    //
    theGL.texImage2D(
      theGL.TEXTURE_2D,
      aMipLevel,
      aInternalFormat,
      theWidth,
      theHeight,
      aBorder,
      aSrcFormat,
      aSrcType,
      aData
    );
    GLUtils.ok(theGL);
  }
  /**
   * Copy an image to the bound texture.
   * @param theGL
   * @param theImage
   */
  static copyImageToTexture(theGL, theImage) {
    const aMipLevel = 0; // the largest mip
    const aInternalFormat = theGL.RGBA; // format we want in the texture
    const aSrcFormat = theGL.RGBA; // format of data we are supplying
    const aSrcType = theGL.UNSIGNED_BYTE; // type of data we are supplying
    theGL.texImage2D(
      theGL.TEXTURE_2D,
      aMipLevel,
      aInternalFormat,
      aSrcFormat,
      aSrcType,
      theImage
    );
    GLUtils.ok(theGL);
  }
  /**
   * Bind and use linear filtering.
   */
  private static setupTextureLinear(theGL, theTexture) {
    GLUtils.setupTextureFilter(theGL, theTexture, theGL.LINEAR);
  }
  /**
   * Bind and use nearest filtering.
   */
  private static setupTextureNearest(theGL, theTexture) {
    GLUtils.setupTextureFilter(theGL, theTexture, theGL.NEAREST);
  }
  /**
   * Bind and use filter.
   */
  private static setupTextureFilter(theGL, theTexture, theFilter) {
    //
    const aTex2D = theGL.TEXTURE_2D;
    const aEdge = theGL.CLAMP_TO_EDGE;
    //
    theGL.bindTexture(theGL.TEXTURE_2D, theTexture);
    GLUtils.ok(theGL);
    // Set up texture so we can render any size image and so we are
    // working with pixels.
    theGL.texParameteri(aTex2D, theGL.TEXTURE_MIN_FILTER, theFilter);
    GLUtils.ok(theGL);
    theGL.texParameteri(aTex2D, theGL.TEXTURE_MAG_FILTER, theFilter);
    GLUtils.ok(theGL);
    //
    theGL.texParameteri(aTex2D, theGL.TEXTURE_WRAP_S, aEdge);
    GLUtils.ok(theGL);
    theGL.texParameteri(aTex2D, theGL.TEXTURE_WRAP_T, aEdge);
    GLUtils.ok(theGL);
    //
  }
  /**
   *
   */
  static bindTexture(theGL, theTexture) {
    theGL.bindTexture(theGL.TEXTURE_2D, theTexture);
    GLUtils.ok(theGL);
  }
  /**
   * Discard the current texture binding.
   */
  static unbindTexture(theGL) {
    theGL.bindTexture(theGL.TEXTURE_2D, null);
    GLUtils.ok(theGL);
  }
  // ----
  /**
   * Check for a WebGL error.
   */
  static ok(theGL: WebGL2RenderingContext, theNotes?: string): boolean {
    let aReturn = true;
    const aErr = theGL.getError();
    if (aErr !== theGL.NO_ERROR) {
      const aMsg = GLUtils.getErrorMsg(theGL, aErr);
      const aNotes = theNotes || '';
      GLUtils.log('Error ' + aErr + ' ' + aMsg + ' ' + aNotes);
      aReturn = false;
    }
    return aReturn;
  }
  // ----
  /**
   *
   */
  private static getErrorMsg(
    theGL: WebGL2RenderingContext,
    theErr: number
  ): string {
    let aReturn = '';
    switch (theErr) {
      case theGL.NO_ERROR:
        aReturn = 'NO_ERROR';
        break;
      case theGL.INVALID_ENUM:
        aReturn = 'INVALID_ENUM';
        break;
      case theGL.INVALID_VALUE:
        aReturn = 'INVALID_VALUE';
        break;
      case theGL.INVALID_OPERATION:
        aReturn = 'INVALID_OPERATION';
        break;
      case theGL.INVALID_FRAMEBUFFER_OPERATION:
        aReturn = 'INVALID_FRAMEBUFFER_OPERATION';
        break;
      case theGL.OUT_OF_MEMORY:
        aReturn = 'OUT_OF_MEMORY';
        break;
      case theGL.CONTEXT_LOST_WEBGL:
        aReturn = 'CONTEXT_LOST_WEBGL';
        break;
    }
    return aReturn;
  }
  // --------
  /**
   * Creates a program from 2 sources.
   *
   * @param {WebGLRenderingContext} theGL The WebGLRenderingContext
   *        to use.
   * @param {string[]} shaderSourcess Array of sources for the
   *        shaders. The first is assumed to be the vertex shader,
   *        the second the fragment shader.
   * @param {string[]} [theOptAttribs] An array of attribs names. Locations will be assigned by index if not passed in
   * @param {number[]} [theOptLocations] The locations for the. A parallel array to opt_attribs letting you assign locations.
   * @param {module:webgl-utils.ErrorCallback} theOptErrorCallback
   *        callback for errors. By default it just prints an error to the console
   *        on error. If you want something else pass an callback. It's passed an error message.
   * @return {WebGLProgram} The created program.
   * @memberOf module:webgl-utils
   */
  static createProgramFromSources(
    theGL,
    theShaderSources,
    theOptAttribs?,
    theOptLocations?,
    theOptErrorCallback?
  ): WebGLProgram {
    //
    const aSourcesLength = theShaderSources.length;
    if (aSourcesLength === 0) {
      return null;
    }
    //
    const aShaders = [];
    for (let aIndex = 0; aIndex < aSourcesLength; aIndex++) {
      const aShader = GLUtils.loadShader(
        theGL,
        theShaderSources[aIndex],
        theGL[GLUtils.itsDefaultShaderType[aIndex]],
        theOptErrorCallback
      );
      if (aShader === null) {
        break;
      }
      aShaders.push(aShader);
    }
    const aShadersLength = aShaders.length;
    if (aSourcesLength !== aShadersLength) {
      for (let aIndex = 0; aIndex < aShadersLength; aIndex++) {
        const aShader = aShaders[aIndex];
        theGL.deleteShader(aShader);
      }
      return null;
    }
    return GLUtils.createProgram(
      theGL,
      aShaders,
      theOptAttribs,
      theOptLocations,
      theOptErrorCallback
    );
  }
  //
  /**
   * Loads a shader.
   * @param {WebGLRenderingContext} theGL The WebGLRenderingContext to use.
   * @param {string} theShaderSource The shader source.
   * @param {number} theShaderType The type of shader.
   * @param {module:webgl-utils.ErrorCallback} theOptErrorCallback callback for errors.
   * @return {WebGLShader} The created shader.
   */
  private static loadShader(
    theGL,
    theShaderSource,
    theShaderType,
    theOptErrorCallback
  ): WebGLShader {
    //
    const aErrorFn = theOptErrorCallback || GLUtils.errorCallback;
    // Create the shader object
    const aShader = theGL.createShader(theShaderType);
    // Load the shader source
    theGL.shaderSource(aShader, theShaderSource);
    // Compile the shader
    theGL.compileShader(aShader);
    // Check the compile status
    const aCompiled = theGL.getShaderParameter(aShader, theGL.COMPILE_STATUS);
    if (!aCompiled) {
      // Something went wrong during compilation; get the error
      const aLastError = theGL.getShaderInfoLog(aShader);
      aErrorFn('Error compiling shader ' + aShader + ':' + aLastError);
      theGL.deleteShader(aShader);
      return null;
    }
    return aShader;
  }
  //
  /**
   * Creates a program, attaches shaders, binds attrib locations, links the
   * program and calls useProgram.
   * @param {WebGLShader[]} theShaders The shaders to attach
   * @param {string[]} [theOptAttribs] An array of attribs names. Locations will be assigned by index if not passed in
   * @param {number[]} [theOptLocations] The locations for the. A parallel array to opt_attribs letting you assign locations.
   * @param {module:webgl-utils.ErrorCallback} theOptErrorCallback
   *        callback for errors. By default it just prints an error to the console
   *        on error. If you want something else pass an callback. It's passed an error message.
   * @memberOf module:webgl-utils
   */
  private static createProgram(
    theGL,
    theShaders,
    theOptAttribs,
    theOptLocations,
    theOptErrorCallback
  ): WebGLProgram {
    //
    const aErrorFn = theOptErrorCallback || GLUtils.errorCallback;
    //
    const aProgram = theGL.createProgram();
    GLUtils.ok(theGL);
    //
    const aShadersLength = theShaders.length;
    for (let aIndex = 0; aIndex < aShadersLength; aIndex++) {
      const aShader = theShaders[aIndex];
      theGL.attachShader(aProgram, aShader);
      GLUtils.ok(theGL);
    }
    //
    if (theOptAttribs) {
      const aOptAttribsLength = theOptAttribs.length;
      for (let aIndex = 0; aIndex < aOptAttribsLength; aIndex++) {
        const aOptAttrib = theOptAttribs[aIndex];
        theGL.bindAttribLocation(
          aProgram,
          theOptLocations ? theOptLocations[aIndex] : aIndex,
          aOptAttrib
        );
        GLUtils.ok(theGL);
      }
    }
    theGL.linkProgram(aProgram);
    GLUtils.ok(theGL);
    // Check the link status
    const aLinked = theGL.getProgramParameter(aProgram, theGL.LINK_STATUS);
    if (!aLinked) {
      // something went wrong with the link
      const aLastError = theGL.getProgramInfoLog(aProgram);
      aErrorFn('Error in program linking:' + aLastError);
      theGL.deleteProgram(aProgram);
      return null;
    }
    return aProgram;
  }
  // --------
  /**
   * Resize a canvas to match the size it is displayed.
   * @param {HTMLCanvasElement} theCanvas The canvas to resize.
   * @param {number} [theMultiplier] amount to multiply by.
   *    Pass in window.devicePixelRatio for native pixels.
   * @return {boolean} true if the canvas was resized.
   * @memberOf module:wutils
   */
  static resizeCanvasToDisplaySize(
    theCanvas: HTMLCanvasElement,
    theMultiplier?: number
  ): boolean {
    theMultiplier = theMultiplier || 1;
    const aCCW = theCanvas.clientWidth;
    const aCCH = theCanvas.clientHeight;
    const aMCCW = aCCW * theMultiplier;
    const aMCCH = aCCH * theMultiplier;
    if (theCanvas.width !== aMCCW || theCanvas.height !== aMCCH) {
      theCanvas.width = aMCCW;
      theCanvas.height = aMCCH;
      return true;
    }
    return false;
  }
  // --------
  /**
   * Fill the currently bound buffer with a sized rectangle.
   * @param theGL
   * @param theX
   * @param theY
   * @param theW
   * @param theH
   */
  static setRectangleXYWH(theGL, theX, theY, theW, theH) {
    //
    const aX1 = theX;
    const aX2 = theX + theW;
    const aY1 = theY;
    const aY2 = theY + theH;
    //
    // D---C
    // |   |
    // A---B
    // Create rectangle from corners.
    const aA = new Txy(aX1, aY1);
    const aB = new Txy(aX2, aY1);
    const aC = new Txy(aX2, aY2);
    const aD = new Txy(aX1, aY2);
    //
    const aList = new TArrayXY();
    //
    // Draw two triangles to form a rectangle.
    aList.add(aA, aB, aC);
    aList.add(aC, aD, aA);
    //
    const aData = new Float32Array(aList.getArray());
    //
    theGL.bufferData(theGL.ARRAY_BUFFER, aData, theGL.STATIC_DRAW);
    GLUtils.ok(theGL);
  }
  // --------
  /**
   * Prepare a filled rectangle that has been scaled/rotated/positioned.
   * This produces normalised (0..1) coordinates that are suitable for textures.
   * @param theGL
   * @param theNCX - normalised centre XY
   * @param theNCY
   * @param theSrcW - the source dimensions
   * @param theSrcH
   * @param theDstW - the unscaled/rotated desting dimensions.
   * @param theDstH
   * @param theS
   * @param theRdeg
   */
  static setRectangleScaleRot(
    theGL,
    theNCX,
    theNCY,
    theSrcW,
    theSrcH,
    theDstW,
    theDstH,
    theS,
    theRdeg
  ) {
    // what size is the dst as a fraction of the src.
    const aSFX = theDstW / theSrcW;
    const aSFY = theDstH / theSrcH;
    //
    // calculate the length from the centre of the rectangle
    // to one corner.
    const aRW = aSFX * 0.5;
    const aRH = aSFY * 0.5;
    const aRW2 = aRW * aRW;
    const aRH2 = aRH * aRH;
    let aH = Math.sqrt(aRW2 + aRH2);
    // Scale the rectangle.
    aH *= theS;
    // Calc the angler offset of one corner of the rectangle.
    const aCR = Math.atan2(aSFY, aSFX);
    //
    // Determine the angler offset of all
    // the corners of the rectangle.
    let aAr = aCR;
    let aBr = Math.PI - aCR;
    let aCr = Math.PI + aCR;
    let aDr = -aCR;
    //
    // Rotate the rectangle.
    const aR = GLUtils.degToRad(theRdeg);
    aAr += aR;
    aBr += aR;
    aCr += aR;
    aDr += aR;
    //
    // Determine the absolute position of each corner,
    // in texture space.
    const aAx = theNCX - aH * Math.cos(aAr);
    const aAy = theNCY - aH * Math.sin(aAr);
    //
    const aBx = theNCX - aH * Math.cos(aBr);
    const aBy = theNCY - aH * Math.sin(aBr);
    //
    const aCx = theNCX - aH * Math.cos(aCr);
    const aCy = theNCY - aH * Math.sin(aCr);
    //
    const aDx = theNCX - aH * Math.cos(aDr);
    const aDy = theNCY - aH * Math.sin(aDr);
    //
    // D---C
    // |   |
    // A---B
    // Create rectangle from the corners.
    const aA = new Txy(aAx, aAy);
    const aB = new Txy(aBx, aBy);
    const aC = new Txy(aCx, aCy);
    const aD = new Txy(aDx, aDy);
    //
    const aList = new TArrayXY();
    //
    // Draw two triangles to form a rectangle.
    aList.add(aA, aB, aC);
    aList.add(aC, aD, aA);
    //
    const aData = new Float32Array(aList.getArray());
    //
    theGL.bufferData(theGL.ARRAY_BUFFER, aData, theGL.STATIC_DRAW);
    GLUtils.ok(theGL);
  }
  // ----
  /**
   * Prepare a rectangular outline that has been positioned and rotated.
   * @param theGL
   * @param theCX Centre of Rectangle
   * @param theCY
   * @param theW  Size prior to rotation
   * @param theH
   * @param theRdeg Amount to rotate.
   */
  static setRectangleScaleRotOutline(
    theGL,
    theCX,
    theCY,
    theW,
    theH,
    theRdeg
  ) {
    // calculate the length from the centre of the rectangle
    // to one corner.
    const aW = theW;
    const aH = theH;
    const aWW = aW * aW;
    const aHH = aH * aH;
    // Hypotenuse.
    const aHyp = Math.sqrt(aWW + aHH) * 0.5;
    // Calc the angler offset of one corner of the rectangle.
    const aCR = Math.atan2(aW, aH);
    //
    // Determine the angler offset of all
    // the corners of the rectangle.
    let aAr = aCR;
    let aBr = Math.PI - aCR;
    let aCr = Math.PI + aCR;
    let aDr = -aCR;
    //
    // Rotate the rectangle.
    const aR = GLUtils.degToRad(theRdeg);
    aAr += aR;
    aBr += aR;
    aCr += aR;
    aDr += aR;
    //
    // Determine the absolute position of each corner
    // in display space.
    const aAx = theCX - aHyp * Math.cos(aAr);
    const aAy = theCY - aHyp * Math.sin(aAr);
    const aBx = theCX - aHyp * Math.cos(aBr);
    const aBy = theCY - aHyp * Math.sin(aBr);
    const aCx = theCX - aHyp * Math.cos(aCr);
    const aCy = theCY - aHyp * Math.sin(aCr);
    const aDx = theCX - aHyp * Math.cos(aDr);
    const aDy = theCY - aHyp * Math.sin(aDr);
    //
    // D---C
    // :   |
    // A---B
    // Create rectangle from the corners.
    const aA = new Txy(aAx, aAy);
    const aB = new Txy(aBx, aBy);
    const aC = new Txy(aCx, aCy);
    const aD = new Txy(aDx, aDy);
    //
    const aList = new TArrayXY();
    //
    // Draw lines to form an outline of the rectangle.
    // This can be drawn using GL.LINE_LOOP 4
    aList.add(aA, aB, aC, aD);
    //
    const aData = new Float32Array(aList.getArray());
    //
    theGL.bufferData(theGL.ARRAY_BUFFER, aData, theGL.STATIC_DRAW);
    GLUtils.ok(theGL);
  }
  // ----
  /**
   * Convert Degrees to Radians.
   * @param theDeg
   */
  static degToRad(theDeg: number): number {
    const aSF = Math.PI / 180.0;
    return theDeg * aSF;
  }
  // ----
  /**
   * Convert Radians to Degrees.
   * @param theRad
   */
  static radToDeg(theRad: number): number {
    const aSF = 180.0 / Math.PI;
    return theRad * aSF;
  }
  // ----
  // the end
}
