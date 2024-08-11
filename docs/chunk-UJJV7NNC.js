import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/morphTargetsVertexGlobal.js
var name = "morphTargetsVertexGlobal";
var shader = `#ifdef MORPHTARGETS
#ifdef MORPHTARGETS_TEXTURE
float vertexID;
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name] = shader;
var morphTargetsVertexGlobal = {
  name,
  shader
};

export {
  morphTargetsVertexGlobal
};
//# sourceMappingURL=chunk-UJJV7NNC.js.map
