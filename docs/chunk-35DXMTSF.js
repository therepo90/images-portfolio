import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/logDepthDeclaration.js
var name = "logDepthDeclaration";
var shader = `#ifdef LOGARITHMICDEPTH
uniform logarithmicDepthConstant: f32;varying vFragmentDepth: f32;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
//# sourceMappingURL=chunk-35DXMTSF.js.map
