import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/pass.fragment.js
var name = "passPixelShader";
var shader = `varying vec2 vUV;uniform sampler2D textureSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=texture2D(textureSampler,vUV);}`;
ShaderStore.ShadersStore[name] = shader;
var passPixelShader = {
  name,
  shader
};

export {
  passPixelShader
};
//# sourceMappingURL=chunk-QMM2QCWT.js.map
