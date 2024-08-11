import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/glowMapMerge.vertex.js
var name = "glowMapMergeVertexShader";
var shader = `attribute position: vec2f;varying vUV: vec2f;
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.vUV=input.position*madd+madd;vertexOutputs.position= vec4f(input.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;
ShaderStore.ShadersStoreWGSL[name] = shader;
var glowMapMergeVertexShaderWGSL = {
  name,
  shader
};

export {
  glowMapMergeVertexShaderWGSL
};
//# sourceMappingURL=chunk-BABELHPN.js.map
