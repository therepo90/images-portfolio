import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/rgbdEncode.fragment.js
var name = "rgbdEncodePixelShader";
var shader = `varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=toRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb);}`;
ShaderStore.ShadersStoreWGSL[name] = shader;
var rgbdEncodePixelShaderWGSL = {
  name,
  shader
};

export {
  rgbdEncodePixelShaderWGSL
};
//# sourceMappingURL=chunk-4HVO7WJH.js.map
