import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/kernelBlurVertex.js
var name = "kernelBlurVertex";
var shader = `vertexOutputs.sampleCoord{X}=vertexOutputs.sampleCenter+uniforms.delta*KERNEL_OFFSET{X};`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;

// node_modules/@babylonjs/core/ShadersWGSL/kernelBlur.vertex.js
var name2 = "kernelBlurVertexShader";
var shader2 = `attribute position: vec2f;uniform delta: vec2f;varying sampleCenter: vec2f;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.sampleCenter=(input.position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
vertexOutputs.position= vec4f(input.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;
ShaderStore.ShadersStoreWGSL[name2] = shader2;
var kernelBlurVertexShaderWGSL = {
  name: name2,
  shader: shader2
};

export {
  kernelBlurVertexShaderWGSL
};
//# sourceMappingURL=chunk-ZQJNAFHZ.js.map
