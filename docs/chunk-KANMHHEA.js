import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/meshUboDeclaration.js
var name = "meshUboDeclaration";
var shader = `#ifdef WEBGL2
uniform mat4 world;uniform float visibility;
#else
layout(std140,column_major) uniform;uniform Mesh
{mat4 world;float visibility;};
#endif
#define WORLD_UBO
`;
ShaderStore.IncludesShadersStore[name] = shader;
//# sourceMappingURL=chunk-KANMHHEA.js.map
