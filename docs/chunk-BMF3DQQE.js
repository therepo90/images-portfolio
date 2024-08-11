import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/rgbdDecode.fragment.js
var name = "rgbdDecodePixelShader";
var shader = `varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(fromRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV)),1.0);}`;
ShaderStore.ShadersStoreWGSL[name] = shader;
var rgbdDecodePixelShaderWGSL = {
  name,
  shader
};

export {
  rgbdDecodePixelShaderWGSL
};
//# sourceMappingURL=chunk-BMF3DQQE.js.map
