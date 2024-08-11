import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/sceneUboDeclaration.js
var name = "sceneUboDeclaration";
var shader = `layout(std140,column_major) uniform;uniform Scene {mat4 viewProjection;
#ifdef MULTIVIEW
mat4 viewProjectionR;
#endif 
mat4 view;mat4 projection;vec4 vEyePosition;};
`;
ShaderStore.IncludesShadersStore[name] = shader;
//# sourceMappingURL=chunk-QYYW7NDU.js.map
