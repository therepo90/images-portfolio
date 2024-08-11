import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/pass.fragment.js
var name = "passPixelShader";
var shader = `varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=textureSample(textureSampler,textureSamplerSampler,input.vUV);}`;
ShaderStore.ShadersStoreWGSL[name] = shader;
var passPixelShaderWGSL = {
  name,
  shader
};

export {
  passPixelShaderWGSL
};
//# sourceMappingURL=chunk-WO5AWHQ6.js.map
