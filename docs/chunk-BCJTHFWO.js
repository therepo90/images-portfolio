import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/kernelBlurVertex.js
var name = "kernelBlurVertex";
var shader = `sampleCoord{X}=sampleCenter+delta*KERNEL_OFFSET{X};`;
ShaderStore.IncludesShadersStore[name] = shader;

// node_modules/@babylonjs/core/Shaders/kernelBlur.vertex.js
var name2 = "kernelBlurVertexShader";
var shader2 = `attribute vec2 position;uniform vec2 delta;varying vec2 sampleCenter;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
sampleCenter=(position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;
ShaderStore.ShadersStore[name2] = shader2;
var kernelBlurVertexShader = {
  name: name2,
  shader: shader2
};

export {
  kernelBlurVertexShader
};
//# sourceMappingURL=chunk-BCJTHFWO.js.map
