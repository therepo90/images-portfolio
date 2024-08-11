import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/clipPlaneVertexDeclaration.js
var name = "clipPlaneVertexDeclaration";
var shader = `#ifdef CLIPPLANE
uniform vClipPlane: vec4<f32>;varying fClipDistance: f32;
#endif
#ifdef CLIPPLANE2
uniform vClipPlane2: vec4<f32>;varying fClipDistance2: f32;
#endif
#ifdef CLIPPLANE3
uniform vClipPlane3: vec4<f32>;varying fClipDistance3: f32;
#endif
#ifdef CLIPPLANE4
uniform vClipPlane4: vec4<f32>;varying fClipDistance4: f32;
#endif
#ifdef CLIPPLANE5
uniform vClipPlane5: vec4<f32>;varying fClipDistance5: f32;
#endif
#ifdef CLIPPLANE6
uniform vClipPlane6: vec4<f32>;varying fClipDistance6: f32;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
var clipPlaneVertexDeclarationWGSL = {
  name,
  shader
};

export {
  clipPlaneVertexDeclarationWGSL
};
//# sourceMappingURL=chunk-KEBT7VYT.js.map
