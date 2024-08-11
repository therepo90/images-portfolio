import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/morphTargetsVertexGlobal.js
var name = "morphTargetsVertexGlobal";
var shader = `#ifdef MORPHTARGETS
#ifdef MORPHTARGETS_TEXTURE
var vertexID : f32;
#endif
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
var morphTargetsVertexGlobalWGSL = {
  name,
  shader
};

export {
  morphTargetsVertexGlobalWGSL
};
//# sourceMappingURL=chunk-WVJVTAQY.js.map
