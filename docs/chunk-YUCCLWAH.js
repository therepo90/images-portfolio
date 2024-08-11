import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/clipPlaneVertexDeclaration.js
var name = "clipPlaneVertexDeclaration";
var shader = `#ifdef CLIPPLANE
uniform vec4 vClipPlane;varying float fClipDistance;
#endif
#ifdef CLIPPLANE2
uniform vec4 vClipPlane2;varying float fClipDistance2;
#endif
#ifdef CLIPPLANE3
uniform vec4 vClipPlane3;varying float fClipDistance3;
#endif
#ifdef CLIPPLANE4
uniform vec4 vClipPlane4;varying float fClipDistance4;
#endif
#ifdef CLIPPLANE5
uniform vec4 vClipPlane5;varying float fClipDistance5;
#endif
#ifdef CLIPPLANE6
uniform vec4 vClipPlane6;varying float fClipDistance6;
#endif
`;
ShaderStore.IncludesShadersStore[name] = shader;
var clipPlaneVertexDeclaration = {
  name,
  shader
};

export {
  clipPlaneVertexDeclaration
};
//# sourceMappingURL=chunk-YUCCLWAH.js.map
