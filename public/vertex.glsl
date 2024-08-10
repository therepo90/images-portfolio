attribute vec2 a_position;
attribute vec2 a_uv;        // Texture coordinates (UV)

uniform vec2 iResolution;
uniform float iTime; // seconds
uniform vec2 iMouse;
varying vec2 vUV;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    vUV = a_uv;
}
