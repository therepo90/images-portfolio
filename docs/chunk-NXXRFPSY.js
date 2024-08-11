import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/clipPlaneVertex.js
var name = "clipPlaneVertex";
var shader = `#ifdef CLIPPLANE
fClipDistance=dot(worldPos,vClipPlane);
#endif
#ifdef CLIPPLANE2
fClipDistance2=dot(worldPos,vClipPlane2);
#endif
#ifdef CLIPPLANE3
fClipDistance3=dot(worldPos,vClipPlane3);
#endif
#ifdef CLIPPLANE4
fClipDistance4=dot(worldPos,vClipPlane4);
#endif
#ifdef CLIPPLANE5
fClipDistance5=dot(worldPos,vClipPlane5);
#endif
#ifdef CLIPPLANE6
fClipDistance6=dot(worldPos,vClipPlane6);
#endif
`;
ShaderStore.IncludesShadersStore[name] = shader;
var clipPlaneVertex = {
  name,
  shader
};

export {
  clipPlaneVertex
};
//# sourceMappingURL=chunk-NXXRFPSY.js.map
