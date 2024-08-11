import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/meshUboDeclaration.js
var name = "meshUboDeclaration";
var shader = `struct Mesh {world : mat4x4<f32>,
visibility : f32,};var<uniform> mesh : Mesh;
#define WORLD_UBO
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
//# sourceMappingURL=chunk-QVSLTQ5W.js.map
