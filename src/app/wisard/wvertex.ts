// tslint:disable:no-redundant-jsdoc
/**
 * Vertex description.
 */
export class WVertex {
  static readonly V = `#version 300 es
precision mediump float;
precision mediump int;

in vec2 a2f_position;
in vec2 a2f_texCoord;

// Used to pass in the resolution of the canvas
uniform vec2 u2f_resolution;
uniform float u1f_flipY;

// Used to pass the texture coordinates to the fragment shader
out vec2 v_texCoord;

// all shaders have a main function
void main() {

  // convert the position in pixels to the range 0.0 -> 1.0
  vec2 zeroToOne = a2f_position / u2f_resolution;

  // convert range from 0.0 -> 1.0 to 0.0 -> 2.0
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0.0 -> 2.0 to -1.0 -> +1.0 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1.0, u1f_flipY), 0.0, 1.0);

  // pass the texCoord to the fragment shader
  // The GPU will interpolate this value between points.
  v_texCoord = a2f_texCoord;
}
`;
}
