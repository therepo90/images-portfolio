import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/depthBoxBlur.fragment.js
var name = "depthBoxBlurPixelShader";
var shader = `varying vec2 vUV;uniform sampler2D textureSampler;uniform vec2 screenSize;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 colorDepth=vec4(0.0);for (int x=-OFFSET; x<=OFFSET; x++)
for (int y=-OFFSET; y<=OFFSET; y++)
colorDepth+=texture2D(textureSampler,vUV+vec2(x,y)/screenSize);gl_FragColor=(colorDepth/float((OFFSET*2+1)*(OFFSET*2+1)));}`;
ShaderStore.ShadersStore[name] = shader;
var depthBoxBlurPixelShader = {
  name,
  shader
};

export {
  depthBoxBlurPixelShader
};
//# sourceMappingURL=chunk-LVKJKJXI.js.map
