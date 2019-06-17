// tslint:disable-next-line:no-reference
/// <reference path="../../../node_modules/@types/webgl2/index.d.ts" />
import { Consts } from './consts';
import { Log } from './log';
import { WVertex } from './wvertex';
import { WFragment } from './wfragment';
import { GLUtils } from './glutils';
import { IWTexture } from './iwtexture';
import { Txywh } from './types';
// tslint:disable:no-redundant-jsdoc
// tslint:disable:variable-name
/**
 *
 */
export class Support {
  // tslint:disable:no-redundant-jsdoc
  //
  private static itsInst: Support = null;
  //
  private itsStatus = '';
  private itsOpen = false;
  //
  private itsGL: WebGL2RenderingContext = null;
  //
  // ----
  private itsProgram: WebGLProgram = null;
  //
  private itsA2f_TexCoord: GLint;
  private itsA2f_Position: GLint;
  //
  private itsU1i_Mode: WebGLUniformLocation;
  private itsU1f_Threshold: WebGLUniformLocation;
  private itsU1i_Reverse: WebGLUniformLocation;
  private itsU1i_NWidth: WebGLUniformLocation;
  private itsU2f_Resolution: WebGLUniformLocation;
  private itsU3f_Color: WebGLUniformLocation;
  private itsU1f_FlipY: WebGLUniformLocation;
  private itsU1i_Image0: WebGLUniformLocation;
  private itsU1i_Image1: WebGLUniformLocation;
  //
  private itsVA: WebGLVertexArrayObject = null;
  //
  // Array Buffers
  private itsBuf_A2f_TexCoord: WebGLBuffer = null; // normalised texture locations.
  private itsBuf_A2f_Position: WebGLBuffer = null; // pixel based image locations.
  //
  private itsFramebuffer: WebGLFramebuffer = null;
  //
  private its1x1: WebGLTexture = null;
  //
  // ----
  /**
   *
   */
  private constructor() { }
  /**
   * Access singleton.
   */
  static getInst(): Support {
    if (Support.itsInst === null) {
      Support.itsInst = new Support();
    }
    return Support.itsInst;
  }
  /**
   * What was the last open status message.
   */
  getStatus(): string {
    return this.itsStatus;
  }
  /**
   * is the Core open ?
   */
  isOpen(): boolean {
    return this.itsOpen;
  }
  // ----
  /**
   * Attempt to open the Core.
   */
  open(): boolean {
    if (this.itsOpen === true) {
      return true;
    }
    this.itsStatus = '';
    const aCanvas = document.getElementById(
      Consts.Core_Canvas
    ) as HTMLCanvasElement;
    if (aCanvas === null) {
      this.log('coreOpen: Failed to locate canvas.');
      this.itsStatus = 'no canvas';
      return false;
    }
    const aGL = aCanvas.getContext('webgl2') as WebGL2RenderingContext;
    if (aGL === null) {
      this.log('coreOpen: Failed to allocate GL.');
      this.itsStatus = 'failed to open webgl2';
      return false;
    }
    // save the basic GL features.
    this.itsGL = aGL;
    //
    // setup GLSL program
    this.itsProgram = GLUtils.createProgramFromSources(aGL, [
      WVertex.V,
      WFragment.F
    ]);
    if (this.itsProgram == null) {
      this.close();
      this.itsStatus = 'failed to open webgl2/program';
      return false;
    }
    // ---- Attributes ----
    this.itsA2f_TexCoord = this.AL('a2f_texCoord');
    this.itsA2f_Position = this.AL('a2f_position');
    // ---- Uniforms ----
    this.itsU1i_Mode = this.UL('u1i_mode');
    this.itsU1f_Threshold = this.UL('u1f_threshold');
    this.itsU1i_Reverse = this.UL('u1i_reverse');
    this.itsU1i_NWidth = this.UL('u1i_nwidth');
    this.itsU2f_Resolution = this.UL('u2f_resolution');
    this.itsU3f_Color = this.UL('u3f_color');
    this.itsU1f_FlipY = this.UL('u1f_flipY');
    this.itsU1i_Image0 = this.UL('u1i_image0');
    this.itsU1i_Image1 = this.UL('u1i_image1');
    //
    // ---- Vertex Array ----
    //
    // Create VertexArrayObject and bind to it.
    this.itsVA = GLUtils.createVertexArray(aGL);
    aGL.bindVertexArray(this.itsVA);
    this.ok();
    //
    // ---- Buffer ---- itsBuf_A2f_Position ----
    //
    // Create and Init 'Position' buffer.
    this.itsBuf_A2f_Position = GLUtils.createBuffer(aGL);
    // Turn on the attribute
    aGL.enableVertexAttribArray(this.itsA2f_Position);
    this.ok();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = a_position_Buffer)
    aGL.bindBuffer(aGL.ARRAY_BUFFER, this.itsBuf_A2f_Position);
    this.ok();
    // Populate ArrayBuffer with pixel coords of the rectangle.
    // Tell the attribute how to get data out of ab_position (ARRAY_BUFFER)
    {
      const aSize = 2; // 2 components per iteration
      const aType = aGL.FLOAT; // the data is 32bit floats
      const aNormalize = false; // don't normalize the data
      const aStride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      const aOffset = 0; // start at the beginning of the buffer
      // bind itsA2f_Position to itsBuf_A2f_Position.
      aGL.vertexAttribPointer(
        this.itsA2f_Position,
        aSize,
        aType,
        aNormalize,
        aStride,
        aOffset
      );
      this.ok();
    }
    //
    // ---- Buffer ---- itsBuf_A2f_TexCoord ----
    //
    // Create and Init 'TexCoord' buffer.
    this.itsBuf_A2f_TexCoord = GLUtils.createBuffer(aGL);
    // Turn on the attribute.
    aGL.enableVertexAttribArray(this.itsA2f_TexCoord);
    this.ok();
    aGL.bindBuffer(aGL.ARRAY_BUFFER, this.itsBuf_A2f_TexCoord);
    this.ok();
    {
      const aSize = 2; // 2 components per iteration
      const aType = aGL.FLOAT; // the data is 32bit floats
      const aNormalize = false; // don't normalize the data
      const aStride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      const aOffset = 0; // start at the beginning of the buffer
      aGL.vertexAttribPointer(
        this.itsA2f_TexCoord,
        aSize,
        aType,
        aNormalize,
        aStride,
        aOffset
      );
      this.ok();
    }
    //
    // ----itsFrameBuffer----
    // create a framebuffer for rendering into.
    this.itsFramebuffer = GLUtils.createFramebuffer(aGL);
    aGL.bindFramebuffer(aGL.FRAMEBUFFER, this.itsFramebuffer);
    this.ok();
    // ---- Dummy Texture ----
    this.its1x1 = GLUtils.createTextureNearest(aGL);
    GLUtils.primeTexRGBA8U(aGL, 1, 1);
    GLUtils.unbindTexture(aGL);
    // ----
    this.itsOpen = true;
    this.itsStatus = 'ok';
    //
    return true;
  }
  // ----
  /**
   *
   */
  close() {
    this.itsOpen = false;
    const aGL = this.itsGL;
    if (aGL === null) {
      return;
    }
    GLUtils.unbindTexture(aGL);
    if (this.its1x1 !== null) {
      GLUtils.deleteTexture(aGL, this.its1x1);
      this.its1x1 = null;
    }
    if (this.itsFramebuffer !== null) {
      GLUtils.deleteFramebuffer(aGL, this.itsFramebuffer);
      this.itsFramebuffer = null;
    }
    aGL.bindBuffer(aGL.ARRAY_BUFFER, null);
    this.ok();
    if (this.itsBuf_A2f_TexCoord !== null) {
      GLUtils.deleteBuffer(aGL, this.itsBuf_A2f_TexCoord);
      this.itsBuf_A2f_TexCoord = null;
    }
    if (this.itsBuf_A2f_Position !== null) {
      GLUtils.deleteBuffer(aGL, this.itsBuf_A2f_Position);
      this.itsBuf_A2f_Position = null;
    }
    aGL.bindVertexArray(null);
    this.ok();
    if (this.itsVA !== null) {
      GLUtils.deleteVertexArray(aGL, this.itsVA);
      this.itsVA = null;
    }
    aGL.useProgram(null);
    this.ok();
    if (this.itsProgram !== null) {
      aGL.deleteProgram(this.itsProgram);
      this.ok();
      this.itsProgram = null;
    }
  }
  // ----
  /**
   * Get an Attribute Location.
   * @param theName
   */
  private AL(theName: string): GLint {
    const aAL = this.itsGL.getAttribLocation(this.itsProgram, theName);
    GLUtils.ok(this.itsGL);
    return aAL;
  }
  /**
   * Get a Uniform Location.
   * @param theName
   */
  private UL(theName: string): WebGLUniformLocation {
    const aUL = this.itsGL.getUniformLocation(this.itsProgram, theName);
    GLUtils.ok(this.itsGL);
    return aUL;
  }
  // ----
  /**
   *
   */
  getGL() {
    return this.itsGL;
  }
  // ----
  /**
   * Start a processing sequence.
   */
  processBegin() { }
  // ----
  /**
   * End a processing sequence.
   */
  processEnd() {
    if (this.itsOpen === false) {
      return;
    }
    const aGL = this.itsGL;
    aGL.bindTexture(aGL.TEXTURE_2D, null);
    this.ok('bindTexture');
    aGL.bindBuffer(aGL.ARRAY_BUFFER, null);
    this.ok('bindBuffer');
    aGL.bindVertexArray(null);
    this.ok('bindVertexArray');
    aGL.bindFramebuffer(aGL.FRAMEBUFFER, null);
    this.ok();
    aGL.useProgram(null);
    this.ok('useProgram');
  }
  // ----
  /**
   * Prepare to Copy Texture to Texture.
   * @param theSrcTexture
   * @param theDstTexture
   * @param theSrcXYWH where in the src (normalised)
   * @param theDstXYWH where in the dst
   */
  processPrepTextureToTexture(
    theSrcTexture: IWTexture,
    theDstTexture: IWTexture,
    theSrcXYWH?: Txywh,
    theDstXYWH?: Txywh
  ) {
    if (this.itsOpen === false) {
      return;
    }
    const aGL = this.getGL();
    let aSrcT = null;
    if (GLUtils.isValid(theSrcTexture)) {
      aSrcT = theSrcTexture.getT();
    }
    let aSrcX = 0.0;
    let aSrcY = 0.0;
    let aSrcW = 1.0;
    let aSrcH = 1.0;
    if (GLUtils.isValid(theSrcXYWH)) {
      aSrcX = theSrcXYWH.x;
      aSrcY = theSrcXYWH.y;
      aSrcW = theSrcXYWH.w;
      aSrcH = theSrcXYWH.h;
    }
    const aDstT = theDstTexture.getT();
    const aDstW = theDstTexture.getW();
    const aDstH = theDstTexture.getH();
    // ----Tell it to use our program (pair of shaders)----
    aGL.useProgram(this.itsProgram);
    this.ok();
    // ---- Bind the attribute/buffer set we want.----
    aGL.bindVertexArray(this.itsVA);
    this.ok();
    // ----Source texture coordinates----
    aGL.bindBuffer(aGL.ARRAY_BUFFER, this.itsBuf_A2f_TexCoord);
    this.ok();
    // Populate ArrayBuffer with normalised coords of the src texture.
    GLUtils.setRectangleXYWH(aGL, aSrcX, aSrcY, aSrcW, aSrcH);
    // ----Destination pixel coordinates----
    aGL.bindBuffer(aGL.ARRAY_BUFFER, this.itsBuf_A2f_Position);
    this.ok();
    // Populate ArrayBuffer with pixel coords of the dst rectangle.
    GLUtils.setRectangleXYWH(aGL, 0, 0, aDstW, aDstH);
    // ---- Use texture Unit0+1 ----
    this.setTextureUnit0(aSrcT);
    this.setTextureUnit1(aSrcT);
    // ---- Prepare to write to texture ----
    aGL.viewport(0, 0, aDstW, aDstH);
    this.ok();
    // don't y flip images while drawing to the textures
    aGL.uniform1f(this.itsU1f_FlipY, 1.0);
    this.ok();
    aGL.bindFramebuffer(aGL.FRAMEBUFFER, this.itsFramebuffer);
    this.ok();
    // make our texture the destination within the framebuffer.
    {
      const aTarget = aGL.FRAMEBUFFER;
      const aAttachment = aGL.COLOR_ATTACHMENT0;
      const aTexTarget = aGL.TEXTURE_2D;
      const aTexture = aDstT;
      const aMipLevel = 0;
      aGL.framebufferTexture2D(
        aTarget,
        aAttachment,
        aTexTarget,
        aTexture,
        aMipLevel
      );
      this.ok();
    }
    // ----
    // Set default uniform locators.
    aGL.uniform2f(this.itsU2f_Resolution, aDstW, aDstH);
    this.ok();
    aGL.uniform3f(this.itsU3f_Color, 0.0, 0.0, 0.0);
    this.ok();
    aGL.uniform1i(this.itsU1i_Mode, Consts.Mode_Fill);
    this.ok();
    aGL.uniform1i(this.itsU1i_Image0, 0);
    this.ok();
    aGL.uniform1i(this.itsU1i_Image1, 1);
    this.ok();
    aGL.uniform1i(this.itsU1i_Reverse, 0);
    this.ok();
    aGL.uniform1i(this.itsU1i_NWidth, 1);
    this.ok();
    aGL.uniform1f(this.itsU1f_Threshold, 0.5);
    this.ok();
    // ----
  }
  // ----
  /**
   * Prepare to Copy Texture to Screen.
   * @param theSrcTexture
   * @param theSrcXYWH where in the source (normalised).
   * @param theDstXYWH where on the screen (pixels).
   */
  processPrepTextureToScreen(
    theSrcTexture?: IWTexture,
    theSrcXYWH?: Txywh,
    theDstXYWH?: Txywh
  ) {
    if (this.itsOpen === false) {
      return;
    }
    const aGL = this.getGL();
    GLUtils.resizeCanvasToDisplaySize(aGL.canvas);
    const aCW = aGL.canvas.width;
    const aCH = aGL.canvas.height;
    let aSrcT = null;
    if (GLUtils.isValid(theSrcTexture)) {
      aSrcT = theSrcTexture.getT();
    }
    let aSrcX = 0.0;
    let aSrcY = 0.0;
    let aSrcW = 1.0;
    let aSrcH = 1.0;
    if (GLUtils.isValid(theSrcXYWH)) {
      aSrcX = theSrcXYWH.x;
      aSrcY = theSrcXYWH.y;
      aSrcW = theSrcXYWH.w;
      aSrcH = theSrcXYWH.h;
    }
    let aDstX = 0;
    let aDstY = 0;
    let aDstW = aCW;
    let aDstH = aCH;
    if (GLUtils.isValid(theDstXYWH)) {
      aDstX = theDstXYWH.x;
      aDstY = theDstXYWH.y;
      aDstW = theDstXYWH.w;
      aDstH = theDstXYWH.h;
    }
    // ----Tell it to use our program (pair of shaders)----
    aGL.useProgram(this.itsProgram);
    this.ok();
    // ---- Bind the attribute/buffer set we want.----
    aGL.bindVertexArray(this.itsVA);
    this.ok();
    // ----Source texture coordinates----
    aGL.bindBuffer(aGL.ARRAY_BUFFER, this.itsBuf_A2f_TexCoord);
    this.ok();
    // Populate ArrayBuffer with normalised coords of the src texture.
    GLUtils.setRectangleXYWH(aGL, aSrcX, aSrcY, aSrcW, aSrcH);
    // ----Destination pixel coordinates----
    aGL.bindBuffer(aGL.ARRAY_BUFFER, this.itsBuf_A2f_Position);
    this.ok();
    // Populate ArrayBuffer with pixel coords of the dst rectangle.
    GLUtils.setRectangleXYWH(aGL, 0, 0, aDstW, aDstH);
    // ---- Use texture Unit0+1 ----
    this.setTextureUnit0(aSrcT);
    this.setTextureUnit1(aSrcT);
    // ---- Prepare to write to the screen ----
    aGL.viewport(aDstX, aDstY, aDstW, aDstH);
    this.ok();
    // flip images while drawing to the screen
    aGL.uniform1f(this.itsU1f_FlipY, -1.0);
    this.ok();
    aGL.bindFramebuffer(aGL.FRAMEBUFFER, null);
    this.ok();
    // ----
    // Set default uniform locators.
    aGL.uniform2f(this.itsU2f_Resolution, aDstW, aDstH);
    this.ok();
    aGL.uniform3f(this.itsU3f_Color, 0.0, 0.0, 0.0);
    this.ok();
    aGL.uniform1i(this.itsU1i_Mode, Consts.Mode_Fill);
    this.ok();
    aGL.uniform1i(this.itsU1i_Image0, 0);
    this.ok();
    aGL.uniform1i(this.itsU1i_Image1, 1);
    this.ok();
    aGL.uniform1i(this.itsU1i_Reverse, 0);
    this.ok();
    aGL.uniform1i(this.itsU1i_NWidth, 1);
    this.ok();
    aGL.uniform1f(this.itsU1f_Threshold, 0.5);
    this.ok();
    // ----
  }
  // ----
  /**
   *
   * @param theMode
   */
  processSetMode(theMode: number) {
    const aGL = this.getGL();
    aGL.uniform1i(this.itsU1i_Mode, theMode);
    this.ok();
  }
  // ----
  /**
   *
   * @param theThr
   */
  processSetThreshold(theThr: number) {
    const aGL = this.getGL();
    aGL.uniform1f(this.itsU1f_Threshold, theThr);
    this.ok();
  }
  // ----
  /**
   * Set the color. For using with color filling.
   * @param theRGB
   */
  processSetColor(theRGB: number[]) {
    const aGL = this.getGL();
    aGL.uniform3f(this.itsU3f_Color, theRGB[0], theRGB[1], theRGB[2]);
    this.ok();
  }
  // ----
  /**
   *
   */
  processSetReverse() {
    const aGL = this.getGL();
    aGL.uniform1i(this.itsU1i_Reverse, 1);
    this.ok();
  }
  // ----
  /**
   *
   * @param theNWidth
   */
  processSetNWidth(theNWidth: number) {
    const aGL = this.getGL();
    aGL.uniform1i(this.itsU1i_NWidth, theNWidth);
    this.ok();
  }
  /**
   * Use extra texture.
   * @param theSrc
   */
  processAddTexture1(theSrc: WebGLTexture) {
    this.setTextureUnit1(theSrc);
  }
  /**
   *
   */
  private setTextureUnit0(theSrc: WebGLTexture) {
    const aSrc = theSrc || this.its1x1;
    const aGL = this.getGL();
    aGL.activeTexture(aGL.TEXTURE0);
    this.ok();
    aGL.bindTexture(aGL.TEXTURE_2D, aSrc);
    this.ok();
  }
  /**
   *
   */
  private setTextureUnit1(theSrc: WebGLTexture) {
    const aSrc = theSrc || this.its1x1;
    const aGL = this.getGL();
    aGL.activeTexture(aGL.TEXTURE1);
    this.ok();
    aGL.bindTexture(aGL.TEXTURE_2D, aSrc);
    this.ok();
  }
  /**
   * Set the Source texture position.
   * @param theNCX
   * @param theNCY
   * @param theSrcW
   * @param theSrcH
   * @param theDstW
   * @param theDstH
   * @param theS
   * @param theRdeg
   */
  processSrcPosition(
    theNCX: number,
    theNCY: number,
    theSrcW: number,
    theSrcH: number,
    theDstW: number,
    theDstH: number,
    theS: number,
    theRdeg: number
  ) {
    const aGL = this.getGL();
    //
    aGL.bindBuffer(aGL.ARRAY_BUFFER, this.itsBuf_A2f_TexCoord);
    this.ok();
    //
    // Populate ArrayBuffer with a unit rectangle.
    GLUtils.setRectangleScaleRot(
      aGL,
      theNCX,
      theNCY,
      theSrcW,
      theSrcH,
      theDstW,
      theDstH,
      theS,
      theRdeg
    );
  }
  // ----
  /**
   * Set the Source View Outline.
   * @param theCX
   * @param theCY
   * @param theW
   * @param theH
   * @param theRdeg
   */
  processSrcPositionOutline(
    theCX,
    theCY,
    theW,
    theH,
    theRdeg
  ) {
    const aGL = this.getGL();
    //
    // Draw in position space.
    aGL.bindBuffer(aGL.ARRAY_BUFFER, this.itsBuf_A2f_Position);
    //
    // Populate ArrayBuffer with a unit rectangle.
    GLUtils.setRectangleScaleRotOutline(
      aGL,
      theCX,
      theCY,
      theW,
      theH,
      theRdeg
    );
  }
  // ----
  /**
   * Clear the texture/canvas
   * @param theR
   * @param theG
   * @param theB
   * @param theA
   */
  processDstClear(theR?: number, theG?: number, theB?: number, theA?: number) {
    const aGL = this.getGL();
    let aR = 0;
    let aG = 0;
    let aB = 0;
    let aA = 255;
    if (GLUtils.isValid(theR)) {
      aR = theR;
    }
    if (GLUtils.isValid(theG)) {
      aG = theG;
    }
    if (GLUtils.isValid(theB)) {
      aB = theB;
    }
    if (GLUtils.isValid(theA)) {
      aA = theA;
    }
    aGL.clearColor(aR, aG, aB, aA);
    this.ok();
    aGL.clear(aGL.COLOR_BUFFER_BIT);
    this.ok();
  }
  // ----
  /**
   * copy texture.
   */
  processCopy() {
    const aGL = this.getGL();
    // Draw the rectangle.
    {
      const aPrimitiveType = aGL.TRIANGLES;
      const aOffset = 0;
      const aCount = 6;
      aGL.drawArrays(aPrimitiveType, aOffset, aCount);
      this.ok();
    }
  }
  // ----
  /**
   * draw an outline.
   */
  processCopyOutline() {
    const aGL = this.getGL();
    // Draw the rectangle.
    {
      const aPrimitiveType = aGL.LINE_LOOP;
      const aOffset = 0;
      const aCount = 4;
      aGL.drawArrays(aPrimitiveType, aOffset, aCount);
      this.ok();
    }
  }
  // ----
  /**
   *
   */
  clearBackground() {
    if (this.itsOpen === false) { return; }
    //
    const aGL = this.getGL();
    //
    this.ok('clearBackground');
    //
    this.processEnd();
    aGL.viewport(0, 0, aGL.canvas.width, aGL.canvas.height);
    this.ok('viewport');
    aGL.clearColor(0, 0, 0, 0);
    this.ok('clearColor');
    aGL.clear(aGL.COLOR_BUFFER_BIT);
    this.ok('clear');
  }
  // ----
  /**
   *
   */
  copyImageToTexture(theSrc, theDst) {
    if (this.itsOpen === false) { return; }
    const aGL = this.getGL();
    this.processBegin();
    GLUtils.bindTexture(aGL, theDst);
    GLUtils.copyImageToTexture(aGL, theSrc);
    this.processEnd();
  }
  // ----
  /**
   *
   */
  ok(theNotes?: string): boolean {
    const aGL = this.getGL();
    return GLUtils.ok(aGL, theNotes);
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
