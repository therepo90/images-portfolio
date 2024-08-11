import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/prePassDeclaration.js
var name = "prePassDeclaration";
var shader = `#ifdef PREPASS
#ifdef PREPASS_DEPTH
varying vViewPos: vec3f;
#endif
#ifdef PREPASS_VELOCITY
varying vCurrentPosition: vec4f;varying vPreviousPosition: vec4f;
#endif
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/oitDeclaration.js
var name2 = "oitDeclaration";
var shader2 = `#ifdef ORDER_INDEPENDENT_TRANSPARENCY
#define MAX_DEPTH 99999.0
var oitDepthSamplerSampler: sampler;var oitDepthSampler: texture_2d<f32>;var oitFrontColorSamplerSampler: sampler;var oitFrontColorSampler: texture_2d<f32>;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name2] = shader2;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/decalFragment.js
var name3 = "decalFragment";
var shader3 = `#ifdef DECAL
var decalTempColor=decalColor.rgb;var decalTempAlpha=decalColor.a;
#ifdef GAMMADECAL
decalTempColor=toLinearSpaceVec3(decalColor.rgb);
#endif
#ifdef DECAL_SMOOTHALPHA
decalTempAlpha=decalColor.a*decalColor.a;
#endif
surfaceAlbedo=mix(surfaceAlbedo.rgb,decalTempColor,decalTempAlpha);
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name3] = shader3;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/depthPrePass.js
var name4 = "depthPrePass";
var shader4 = `#ifdef DEPTHPREPASS
gl_FragColor= vec4f(0.,0.,0.,1.0);return;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name4] = shader4;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/oitFragment.js
var name5 = "oitFragment";
var shader5 = `#ifdef ORDER_INDEPENDENT_TRANSPARENCY
var fragDepth: f32=fragmentInputs.position.z; 
#ifdef ORDER_INDEPENDENT_TRANSPARENCY_16BITS
uvar halfFloat: i32=packHalf2x16( vec2f(fragDepth));var full: vec2f=unpackHalf2x16(halfFloat);fragDepth=full.x;
#endif
var fragCoord: vec2i=vec2i(fragmentInputs.position.xy);var lastDepth: vec2f=textureLoad(oitDepthSampler,fragCoord,0).rg;var lastFrontColor: vec4f=textureLoad(oitFrontColorSampler,fragCoord,0);fragmentOutputs.depth=vec2f(-MAX_DEPTH);fragmentOutputs.frontColor=lastFrontColor;fragmentOutputs.backColor= vec4f(0.0);
#ifdef USE_REVERSE_DEPTHBUFFER
var furthestDepth: f32=-lastDepth.x;var nearestDepth: f32=lastDepth.y;
#else
var nearestDepth: f32=-lastDepth.x;var furthestDepth: f32=lastDepth.y;
#endif
var alphaMultiplier: f32=1.0-lastFrontColor.a;
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth>nearestDepth || fragDepth<furthestDepth) {
#else
if (fragDepth<nearestDepth || fragDepth>furthestDepth) {
#endif
return fragmentOutputs;}
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth<nearestDepth && fragDepth>furthestDepth) {
#else
if (fragDepth>nearestDepth && fragDepth<furthestDepth) {
#endif
fragmentOutputs.depth=vec2f(-fragDepth,fragDepth);return fragmentOutputs;}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name5] = shader5;
//# sourceMappingURL=chunk-YBBJOB7X.js.map
