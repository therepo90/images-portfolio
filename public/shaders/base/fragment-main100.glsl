#version 100
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUV;
uniform sampler2D iChannel1;
uniform sampler2D iChannel0;
uniform vec2 iMouse;
uniform vec2 iResolution;
uniform float iTime;
uniform int iFrame;
#include "fragment.glsl"

void main()
{
  //vUV=vec2(0,0);// just use it so auv is not stripped
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
