import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/logDepthDeclaration.js
var name = "logDepthDeclaration";
var shader = `#ifdef LOGARITHMICDEPTH
uniform float logarithmicDepthConstant;varying float vFragmentDepth;
#endif
`;
ShaderStore.IncludesShadersStore[name] = shader;
//# sourceMappingURL=chunk-FTGCJ6MI.js.map
