import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/rgbdEncode.fragment.js
var name = "rgbdEncodePixelShader";
var shader = `varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);}`;
ShaderStore.ShadersStore[name] = shader;
var rgbdEncodePixelShader = {
  name,
  shader
};

export {
  rgbdEncodePixelShader
};
//# sourceMappingURL=chunk-ASVN3W7Y.js.map
