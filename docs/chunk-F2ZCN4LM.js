import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/morphTargetsVertexDeclaration.js
var name = "morphTargetsVertexDeclaration";
var shader = `#ifdef MORPHTARGETS
#ifndef MORPHTARGETS_TEXTURE
attribute position{X} : vec3<f32>;
#ifdef MORPHTARGETS_NORMAL
attribute normal{X} : vec3<f32>;
#endif
#ifdef MORPHTARGETS_TANGENT
attribute tangent{X} : vec3<f32>;
#endif
#ifdef MORPHTARGETS_UV
attribute uv_{X} : vec2<f32>;
#endif
#elif {X}==0
uniform morphTargetCount: i32;
#endif
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
var morphTargetsVertexDeclarationWGSL = {
  name,
  shader
};

export {
  morphTargetsVertexDeclarationWGSL
};
//# sourceMappingURL=chunk-F2ZCN4LM.js.map