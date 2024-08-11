import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/fogVertexDeclaration.js
var name = "fogVertexDeclaration";
var shader = `#ifdef FOG
varying vec3 vFogDistance;
#endif
`;
ShaderStore.IncludesShadersStore[name] = shader;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/fogVertex.js
var name2 = "fogVertex";
var shader2 = `#ifdef FOG
vFogDistance=(view*worldPos).xyz;
#endif
`;
ShaderStore.IncludesShadersStore[name2] = shader2;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/logDepthVertex.js
var name3 = "logDepthVertex";
var shader3 = `#ifdef LOGARITHMICDEPTH
vFragmentDepth=1.0+gl_Position.w;gl_Position.z=log2(max(0.000001,vFragmentDepth))*logarithmicDepthConstant;
#endif
`;
ShaderStore.IncludesShadersStore[name3] = shader3;
//# sourceMappingURL=chunk-PKL6C5YA.js.map
