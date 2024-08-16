#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUV;
uniform sampler2D iChannel1;
uniform sampler2D iChannel0;
uniform vec2 iMouse;
uniform vec2 iResolution;
uniform vec3 laserTint;
uniform float iTime;

#include "fragment.glsl"

void main()
{
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
