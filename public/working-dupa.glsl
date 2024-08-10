#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 texColor0 = texture2D(iChannel0, uv);
    vec4 texColor1 = texture2D(iChannel1, uv);
    gl_FragColor = mix(texColor0, texColor1, 0.5); // Example mixing
    //gl_FragColor = texColor1;
}
