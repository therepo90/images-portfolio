#version 100
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime; // seconds
uniform vec2 iMouse;

#include "fragment.glsl"

void main()
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
