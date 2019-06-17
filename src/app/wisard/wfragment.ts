// tslint:disable:no-redundant-jsdoc
/**
 * Fragment description.
 */
export class WFragment {
         static readonly F = `#version 300 es
precision mediump float;
precision mediump int;

//what sort of processing to perform.
uniform int u1i_mode;
uniform float u1f_threshold;
uniform int u1i_reverse;
uniform int u1i_nwidth;
uniform vec2 u2f_resolution;
uniform vec3 u3f_color;

// textures
uniform sampler2D u1i_image0;
uniform sampler2D u1i_image1;

// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;

// we need to declare an output for the fragment shader
out vec4 outColor;

//--------
//simple color fill
void modeFill(){
  outColor = vec4(u3f_color,1.0);
}
//--------
//simple texture copy.
void modeCopy(){
  outColor = texture(u1i_image0, v_texCoord);
}
//--------
//copy and threshold texture
void modeThreshold(){
  vec3 rgb = texture(u1i_image0, v_texCoord).rgb;
  float v = (rgb.r +  rgb.g + rgb.b) / 3.0;
  float c = (v < u1f_threshold) ? 0.0 : 1.0;
  outColor = vec4(c,c,c,1.0);
}
//--------
//forward scramble.
void modePScrambleF(){
  vec4 xyzw = texture(u1i_image1,v_texCoord);
  vec2 mxy = xyzw.xy;
  outColor = texture(u1i_image0, mxy);
}
//----
//reserve scramble
void modePScrambleR(){
  vec4 xyzw = texture(u1i_image1,v_texCoord);
  vec2 mxy = xyzw.zw;
  outColor = texture(u1i_image0, mxy);
}
//----
//pscramble
void modePScramble(){
  if (u1i_reverse == 0){
    modePScrambleF();
  }else{
    modePScrambleR();
  }
}
//--------
//break a texture up into tuples.
void modeNTuple(){
  vec4 xyzw = texture(u1i_image1,v_texCoord);
  vec2 mxy = xyzw.xy;
  outColor = texture(u1i_image0, mxy);
}
//--------
//forward address.
//
//for each row, convert N_pixels into a packed RGB value.
//
void modeAddressF(){
  //which row.
  float y = v_texCoord.y;
  //
  float dw = 1.0 / float(u1i_nwidth);
  float hdw = dw * 0.5;
  //
  int is0 = 0;
  int is1 = 0;
  int is2 = 0;
  //
  int ix;
  float x = hdw;
  //
  for (ix = 0;ix < u1i_nwidth;ix++){
    //
    int imask = 1 << (ix & 7);
    int iband = ix >> 3;
    //
    vec2 mxy = vec2(x,y);
    //
    float r = texture(u1i_image0, mxy).r;
    int iv = r < 0.5 ? 0 : 1;
    //
    if (iv == 1){
      switch(iband){
        case 0:
          is0 |= imask;
          break;
        case 1:
          is1 |= imask;
          break;
        case 2:
          is2 |= imask;
          break;
      }
    }
    x += dw;
  }
  //
  float fs0 = float(is0);
  float fs1 = float(is1);
  float fs2 = float(is2);
  //
  //convert (0,255) to (0.0,1.0)
  float dp = 1.0 / 255.0;
  //
  vec3 rgb;
  rgb.r = dp * fs0;
  rgb.g = dp * fs1;
  rgb.b = dp * fs2;
  outColor=vec4(rgb,1.0);
}
//----
//reverse address
//for each row, convert a packed RGB value into N_pixels.
void modeAddressR(){
  //
  float x = v_texCoord.x;
  float y = v_texCoord.y;
  vec2 xy = vec2(0.5,y);
  vec3 rgb = texture(u1i_image0, xy).rgb;
  //
  //convert (0.0,1.0) to (0.0,255.0)
  float dp = 255.0;
  int ir = int(floor(dp * rgb.r));
  int ig = int(floor(dp * rgb.g));
  int ib = int(floor(dp * rgb.b));
  //
  //determine the current X offset.
  int ix = int(floor(x * u2f_resolution.x));
  int imask = 1 << (ix & 7);
  int iband = ix >> 3;
  //
  int iv = 0;
  switch(iband){
    case 0:
      iv = ir;
      break;
    case 1:
      iv = ig;
      break;
    case 2:
      iv = ib;
      break;
  }
  iv &= imask;
  //
  float c = iv == 0 ? 0.0 : 1.0;
  outColor=vec4(c,c,c,1.0);
}
//----
//address.
void modeAddress(){
    if (u1i_reverse == 0){
    modeAddressF();
  }else{
    modeAddressR();
  }
}
//--------
//decode
//for each row, convert a packed RGB value into an offset pixel.
//u1i_image0 = packed rgb address.
void modeDecode(){
  //
  float x = v_texCoord.x;
  float y = v_texCoord.y;
  //
  vec3 rgb = texture(u1i_image0,vec2(0.5,y)).rgb;
  //
  //convert (0.0,1.0) to (0.0,255.0)
  float dp = 255.0;
  int ip = 256;
  int ir = int(floor(dp * rgb.r));
  int ig = int(floor(dp * rgb.g)) * ip;
  int ib = int(floor(dp * rgb.b)) * ip * ip;
  int irgb = ir + ig + ib;
  //
  //determine the current X offset.
  int ix = int(floor(x * u2f_resolution.x));
  //
  float c = ix == irgb ? 1.0 : 0.0;
  outColor = vec4(vec3(c),1.0);
  //
}
//--------
//match
//for each row, convert a packed RBG value into an offset pixel,
//access the pixel and store its state in the output.
//u_image0 = packed rgb address (1,F)
//u_image1 = stored data        (2**N,F)
//output   = matched features   (1,F)
void modeMatch(){
  //which row.
  float aY = v_texCoord.y;
  //
  //read packed RGB address value from image0.
  vec3 aRGB = texture(u1i_image0,vec2(0.5,aY)).rgb;
  //
  //unpack RGB value into 24bit integer.
  //convert (0.0,1.0) to (0.0,255.0)
  float aDP = 255.0;
  int aIP = 256;
  int aIR = int(floor(aDP * aRGB.r));
  int aIG = int(floor(aDP * aRGB.g)) * aIP;
  int aIB = int(floor(aDP * aRGB.b)) * aIP * aIP;
  int aIRGB = aIR + aIG + aIB;
  //
  //Determine X offset into the store (image1).
  //convert (0,w-1) to (FirstX,LastX)
  int aW = textureSize(u1i_image1,0).x;
  float aDW = 1.0 / float(aW);
  float aHDW = aDW * 0.5;
  float aX = aHDW + (aDW * float(aIRGB));
  //
  //access store
  float aR = texture(u1i_image1,vec2(aX,aY)).r;
  //
  //populate the output bit.
  float aC = aR > 0.5 ? 1.0 : 0.0;
  //
  outColor = vec4(vec3(aC),1.0);
  //
}
//--------
//merge
//Combine the two sources to for one.
//u1i_image0 = stored data (S,F)
//u1i_image1 = stored data (S,F)
//output   = merged data (S,F)
void modeMerge(){
  vec4 aI0 = texture(u1i_image0, v_texCoord);
  vec4 aI1 = texture(u1i_image1, v_texCoord);
  vec4 aS = aI0 + aI1;
  outColor = clamp(aS,0.0,1.0);
}
//--------
//modeScoreIn
//
//counts the number of feature that are active and turn this into packed RGB value
//
//u1i_image0 = packed rgb address (1,F)
//output = score (1,1) range 0..F
//
void modeScoreIn(){
  //
  //how many features.
  int aFeatureCount =  textureSize(u1i_image0,0).y;
  float aDH = 1.0 / float(aFeatureCount);
  float aHDH = aDH * 0.5;
  //
  //Count the number of set bits.
  int aSum = 0;
  float aSumY = aHDH;
  int aIndex;
  for (aIndex = 0;aIndex < aFeatureCount;aIndex++){
    float aR = texture(u1i_image0,vec2(0.5,aSumY)).r;
    if (aR > 0.5){
      aSum++;
    }
    aSumY += aDH;
  }
  //Sum has a range of 0 to F
  //
  //Convert into packed RGB.
  int aIR = aSum & 255;
  aSum >>= 8;
  int aIG = aSum & 255;
  aSum >>= 8;
  int aIB = aSum & 255;
  //
  float aDB = 1.0 / 256.0;
  float aHDB = aDB * 0.5;
  //
  float aFR = aHDB + (aDB*float(aIR));
  float aFG = aHDB + (aDB*float(aIG));
  float aFB = aHDB + (aDB*float(aIB));
  //
  outColor = vec4(aFR,aFG,aFB,1.0);
}
//--------
//modeScoreOut
//
//Create a simple bar graph.
//
//IN:
//u1f_threshold = how much of the bar to fill (0.0,1.0)
//u3f_color = colour of the bar graph.
//v_texCoord = current position.
//
//OUT:
//output = score bar graph (1,F)
//
void modeScoreOut(){
  //Current row.
  float aY = v_texCoord.y;
  //
  //paint a thermometer.
  float aFlipY = 1.0 - aY;
  vec3 c = vec3(0.0);
  if (u1f_threshold > aFlipY) {
    c = u3f_color;
  }
  //
  outColor = vec4(c,1.0);
}
//--------
//
void main() {
  //
  switch(u1i_mode){
    default:
    case 0:
      modeCopy();
      break;
      //
    case 1:
      modeFill();
      break;
      //
    case 2:
      modeCopy();
      break;
      //
    case 3:
      modeThreshold();
      break;
      //
    case 4:
      modePScramble();
      break;
      //
    case 5:
      modeNTuple();
      break;
      //
    case 6:
      modeAddress();
      break;
      //
    case 7:
      modeDecode();
      break;
      //
    case 8:
      modeMatch();
      break;
      //
    case 9:
      modeMerge();
      break;
      //
    case 10:
      modeScoreIn();
      break;
      //
    case 11:
      modeScoreOut();
      break;
    //----
  }
}
`;
       }
