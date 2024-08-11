import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/fogVertexDeclaration.js
var name = "fogVertexDeclaration";
var shader = `#ifdef FOG
varying vFogDistance: vec3f;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/fogVertex.js
var name2 = "fogVertex";
var shader2 = `#ifdef FOG
vertexOutputs.vFogDistance=(scene.view*worldPos).xyz;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name2] = shader2;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/logDepthVertex.js
var name3 = "logDepthVertex";
var shader3 = `#ifdef LOGARITHMICDEPTH
vertexOutputs.vFragmentDepth=1.0+vertexOutputs.position.w;vertexOutputs.position.z=log2(max(0.000001,vertexOutputs.vFragmentDepth))*uniforms.logarithmicDepthConstant;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name3] = shader3;
//# sourceMappingURL=chunk-QCX45PBD.js.map
