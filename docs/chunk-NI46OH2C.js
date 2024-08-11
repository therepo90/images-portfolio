import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/clipPlaneFragmentDeclaration.js
var name = "clipPlaneFragmentDeclaration";
var shader = `#ifdef CLIPPLANE
varying float fClipDistance;
#endif
#ifdef CLIPPLANE2
varying float fClipDistance2;
#endif
#ifdef CLIPPLANE3
varying float fClipDistance3;
#endif
#ifdef CLIPPLANE4
varying float fClipDistance4;
#endif
#ifdef CLIPPLANE5
varying float fClipDistance5;
#endif
#ifdef CLIPPLANE6
varying float fClipDistance6;
#endif
`;
ShaderStore.IncludesShadersStore[name] = shader;
var clipPlaneFragmentDeclaration = {
  name,
  shader
};

export {
  clipPlaneFragmentDeclaration
};
//# sourceMappingURL=chunk-NI46OH2C.js.map
