import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/glowMapMerge.vertex.js
var name = "glowMapMergeVertexShader";
var shader = `attribute vec2 position;varying vec2 vUV;const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vUV=position*madd+madd;gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;
ShaderStore.ShadersStore[name] = shader;
var glowMapMergeVertexShader = {
  name,
  shader
};

export {
  glowMapMergeVertexShader
};
//# sourceMappingURL=chunk-NA77OH6R.js.map
