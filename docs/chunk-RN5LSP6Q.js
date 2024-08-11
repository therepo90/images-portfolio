import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/shadowMapFragmentSoftTransparentShadow.js
var name = "shadowMapFragmentSoftTransparentShadow";
var shader = `#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(((fragmentInputs.position.xy)%(8.0)))))/64.0>=uniforms.softTransparentShadowSM.x*alpha) {discard;}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
var shadowMapFragmentSoftTransparentShadowWGSL = {
  name,
  shader
};

export {
  shadowMapFragmentSoftTransparentShadowWGSL
};
//# sourceMappingURL=chunk-RN5LSP6Q.js.map
