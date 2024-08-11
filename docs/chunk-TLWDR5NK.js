import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/backgroundUboDeclaration.js
var name = "backgroundUboDeclaration";
var shader = `layout(std140,column_major) uniform;uniform Material
{uniform vec4 vPrimaryColor;uniform vec4 vPrimaryColorShadow;uniform vec2 vDiffuseInfos;uniform vec2 vReflectionInfos;uniform mat4 diffuseMatrix;uniform mat4 reflectionMatrix;uniform vec3 vReflectionMicrosurfaceInfos;uniform float fFovMultiplier;uniform float pointSize;uniform float shadowLevel;uniform float alpha;uniform vec3 vBackgroundCenter;uniform vec4 vReflectionControl;uniform vec2 projectedGroundInfos;};
#include<sceneUboDeclaration>
`;
ShaderStore.IncludesShadersStore[name] = shader;
//# sourceMappingURL=chunk-TLWDR5NK.js.map
