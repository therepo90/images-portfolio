import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/backgroundUboDeclaration.js
var name = "backgroundUboDeclaration";
var shader = `uniform vPrimaryColor: vec4f;uniform vPrimaryColorShadow: vec4f;uniform vDiffuseInfos: vec2f;uniform vReflectionInfos: vec2f;uniform diffuseMatrix: mat4x4f;uniform reflectionMatrix: mat4x4f;uniform vReflectionMicrosurfaceInfos: vec3f;uniform fFovMultiplier: f32;uniform pointSize: f32;uniform shadowLevel: f32;uniform alpha: f32;uniform vBackgroundCenter: vec3f;uniform vReflectionControl: vec4f;uniform projectedGroundInfos: vec2f;
#include<sceneUboDeclaration>
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
//# sourceMappingURL=chunk-4SSMJPIQ.js.map
