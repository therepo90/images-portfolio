import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/shadowMapFragmentSoftTransparentShadow.js
var name = "shadowMapFragmentSoftTransparentShadow";
var shader = `#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x*alpha) discard;
#endif
`;
ShaderStore.IncludesShadersStore[name] = shader;
var shadowMapFragmentSoftTransparentShadow = {
  name,
  shader
};

export {
  shadowMapFragmentSoftTransparentShadow
};
//# sourceMappingURL=chunk-GIGO2NON.js.map
