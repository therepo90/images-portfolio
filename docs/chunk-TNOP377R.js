import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/logDepthFragment.js
var name = "logDepthFragment";
var shader = `#ifdef LOGARITHMICDEPTH
fragmentOutputs.fragDepth=log2(fragmentInputs.vFragmentDepth)*uniforms.logarithmicDepthConstant*0.5;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/fogFragment.js
var name2 = "fogFragment";
var shader2 = `#ifdef FOG
var fog: f32=CalcFogFactor();
#ifdef PBR
fog=toLinearSpace(fog);
#endif
color= vec4f(mix(uniforms.vFogColor,color.rgb,fog),color.a);
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name2] = shader2;
//# sourceMappingURL=chunk-TNOP377R.js.map
