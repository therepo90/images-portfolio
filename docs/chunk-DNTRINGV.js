import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/clipPlaneFragmentDeclaration.js
var name = "clipPlaneFragmentDeclaration";
var shader = `#ifdef CLIPPLANE
varying fClipDistance: f32;
#endif
#ifdef CLIPPLANE2
varying fClipDistance2: f32;
#endif
#ifdef CLIPPLANE3
varying fClipDistance3: f32;
#endif
#ifdef CLIPPLANE4
varying fClipDistance4: f32;
#endif
#ifdef CLIPPLANE5
varying fClipDistance5: f32;
#endif
#ifdef CLIPPLANE6
varying fClipDistance6: f32;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
var clipPlaneFragmentDeclarationWGSL = {
  name,
  shader
};

export {
  clipPlaneFragmentDeclarationWGSL
};
//# sourceMappingURL=chunk-DNTRINGV.js.map
