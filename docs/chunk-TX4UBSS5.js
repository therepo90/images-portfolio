import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/rgbdDecode.fragment.js
var name = "rgbdDecodePixelShader";
var shader = `varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=vec4(fromRGBD(texture2D(textureSampler,vUV)),1.0);}`;
ShaderStore.ShadersStore[name] = shader;
var rgbdDecodePixelShader = {
  name,
  shader
};

export {
  rgbdDecodePixelShader
};
//# sourceMappingURL=chunk-TX4UBSS5.js.map
