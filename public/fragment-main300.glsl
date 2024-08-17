#version 300 es
precision mediump float;

in vec2 vUV;
uniform sampler2D iChannel1;
uniform sampler2D iChannel0;
uniform vec2 iMouse;
uniform vec2 iResolution;
uniform vec3 laserTint;
uniform float iTime;
uniform int iFrame;
// Declare the output color variable
out vec4 theFragColor;
#include "fragment.glsl"

void main()
{
  mainImage(theFragColor, gl_FragCoord.xy);
}
