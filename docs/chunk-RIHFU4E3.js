import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrFragmentExtraDeclaration.js
var name = "pbrFragmentExtraDeclaration";
var shader = `varying vPositionW: vec3f;
#if DEBUGMODE>0
varying vClipSpacePosition: vec4f;
#endif
#include<mainUVVaryingDeclaration>[1..7]
#ifdef NORMAL
varying vNormalW: vec3f;
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
varying vEnvironmentIrradiance: vec3f;
#endif
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name] = shader;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/samplerFragmentAlternateDeclaration.js
var name2 = "samplerFragmentAlternateDeclaration";
var shader2 = `#ifdef _DEFINENAME_
#if _DEFINENAME_DIRECTUV==1
#define v_VARYINGNAME_UV vMainUV1
#elif _DEFINENAME_DIRECTUV==2
#define v_VARYINGNAME_UV vMainUV2
#elif _DEFINENAME_DIRECTUV==3
#define v_VARYINGNAME_UV vMainUV3
#elif _DEFINENAME_DIRECTUV==4
#define v_VARYINGNAME_UV vMainUV4
#elif _DEFINENAME_DIRECTUV==5
#define v_VARYINGNAME_UV vMainUV5
#elif _DEFINENAME_DIRECTUV==6
#define v_VARYINGNAME_UV vMainUV6
#else
varying v_VARYINGNAME_UV: vec2f;
#endif
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name2] = shader2;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrFragmentSamplersDeclaration.js
var name3 = "pbrFragmentSamplersDeclaration";
var shader3 = `#include<samplerFragmentDeclaration>(_DEFINENAME_,ALBEDO,_VARYINGNAME_,Albedo,_SAMPLERNAME_,albedo)
#include<samplerFragmentDeclaration>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient,_SAMPLERNAME_,ambient)
#include<samplerFragmentDeclaration>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity,_SAMPLERNAME_,opacity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive,_SAMPLERNAME_,emissive)
#include<samplerFragmentDeclaration>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap,_SAMPLERNAME_,lightmap)
#include<samplerFragmentDeclaration>(_DEFINENAME_,REFLECTIVITY,_VARYINGNAME_,Reflectivity,_SAMPLERNAME_,reflectivity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,MICROSURFACEMAP,_VARYINGNAME_,MicroSurfaceSampler,_SAMPLERNAME_,microSurface)
#include<samplerFragmentDeclaration>(_DEFINENAME_,METALLIC_REFLECTANCE,_VARYINGNAME_,MetallicReflectance,_SAMPLERNAME_,metallicReflectance)
#include<samplerFragmentDeclaration>(_DEFINENAME_,REFLECTANCE,_VARYINGNAME_,Reflectance,_SAMPLERNAME_,reflectance)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_SAMPLERNAME_,decal)
#ifdef CLEARCOAT
#include<samplerFragmentDeclaration>(_DEFINENAME_,CLEARCOAT_TEXTURE,_VARYINGNAME_,ClearCoat,_SAMPLERNAME_,clearCoat)
#include<samplerFragmentAlternateDeclaration>(_DEFINENAME_,CLEARCOAT_TEXTURE_ROUGHNESS,_VARYINGNAME_,ClearCoatRoughness)
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS)
var clearCoatRoughnessSamplerSampler: sampler;var clearCoatRoughnessSampler: texture_2d<f32>;
#endif
#include<samplerFragmentDeclaration>(_DEFINENAME_,CLEARCOAT_BUMP,_VARYINGNAME_,ClearCoatBump,_SAMPLERNAME_,clearCoatBump)
#include<samplerFragmentDeclaration>(_DEFINENAME_,CLEARCOAT_TINT_TEXTURE,_VARYINGNAME_,ClearCoatTint,_SAMPLERNAME_,clearCoatTint)
#endif
#ifdef IRIDESCENCE
#include<samplerFragmentDeclaration>(_DEFINENAME_,IRIDESCENCE_TEXTURE,_VARYINGNAME_,Iridescence,_SAMPLERNAME_,iridescence)
#include<samplerFragmentDeclaration>(_DEFINENAME_,IRIDESCENCE_THICKNESS_TEXTURE,_VARYINGNAME_,IridescenceThickness,_SAMPLERNAME_,iridescenceThickness)
#endif
#ifdef SHEEN
#include<samplerFragmentDeclaration>(_DEFINENAME_,SHEEN_TEXTURE,_VARYINGNAME_,Sheen,_SAMPLERNAME_,sheen)
#include<samplerFragmentAlternateDeclaration>(_DEFINENAME_,SHEEN_TEXTURE_ROUGHNESS,_VARYINGNAME_,SheenRoughness)
#if defined(SHEEN_ROUGHNESS) && defined(SHEEN_TEXTURE_ROUGHNESS)
var sheenRoughnessSamplerSampler: sampler;var sheenRoughnessSampler: texture_2d<f32>;
#endif
#endif
#ifdef ANISOTROPIC
#include<samplerFragmentDeclaration>(_DEFINENAME_,ANISOTROPIC_TEXTURE,_VARYINGNAME_,Anisotropy,_SAMPLERNAME_,anisotropy)
#endif
#ifdef REFLECTION
#ifdef REFLECTIONMAP_3D
var reflectionSamplerSampler: sampler;var reflectionSampler: texture_cube<f32>;
#ifdef LODBASEDMICROSFURACE
#else
var reflectionLowSamplerSampler: sampler;var reflectionLowSampler: texture_cube<f32>;var reflectionHighSamplerSampler: sampler;var reflectionHighSampler: texture_cube<f32>;
#endif
#ifdef USEIRRADIANCEMAP
var irradianceSamplerSampler: sampler;var irradianceSampler: texture_cube<f32>;
#endif
#else
var reflectionSamplerSampler: sampler;var reflectionSampler: texture_2d<f32>;
#ifdef LODBASEDMICROSFURACE
#else
var reflectionLowSamplerSampler: sampler;var reflectionLowSampler: texture_2d<f32>;var reflectionHighSamplerSampler: sampler;var reflectionHighSampler: texture_2d<f32>;
#endif
#ifdef USEIRRADIANCEMAP
var irradianceSamplerSampler: sampler;var irradianceSampler: texture_2d<f32>;
#endif
#endif
#ifdef REFLECTIONMAP_SKYBOX
varying vPositionUVW: vec3f;
#else
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vDirectionW: vec3f;
#endif
#endif
#endif
#ifdef ENVIRONMENTBRDF
var environmentBrdfSamplerSampler: sampler;var environmentBrdfSampler: texture_2d<f32>;
#endif
#ifdef SUBSURFACE
#ifdef SS_REFRACTION
#ifdef SS_REFRACTIONMAP_3D
var refractionSamplerSampler: sampler;var refractionSampler: texture_cube<f32>;
#ifdef LODBASEDMICROSFURACE
#else
var refractionLowSamplerSampler: sampler;var refractionLowSampler: texture_cube<f32>;var refractionHighSamplerSampler: sampler;var refractionHighSampler: texture_cube<f32>;
#endif
#else
var refractionSamplerSampler: sampler;var refractionSampler: texture_2d<f32>;
#ifdef LODBASEDMICROSFURACE
#else
var refractionLowSamplerSampler: sampler;var refractionLowSampler: texture_2d<f32>;var refractionHighSamplerSampler: sampler;var refractionHighSampler: texture_2d<f32>;
#endif
#endif
#endif
#include<samplerFragmentDeclaration>(_DEFINENAME_,SS_THICKNESSANDMASK_TEXTURE,_VARYINGNAME_,Thickness,_SAMPLERNAME_,thickness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SS_REFRACTIONINTENSITY_TEXTURE,_VARYINGNAME_,RefractionIntensity,_SAMPLERNAME_,refractionIntensity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SS_TRANSLUCENCYINTENSITY_TEXTURE,_VARYINGNAME_,TranslucencyIntensity,_SAMPLERNAME_,translucencyIntensity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SS_TRANSLUCENCYCOLOR_TEXTURE,_VARYINGNAME_,TranslucencyColor,_SAMPLERNAME_,translucencyColor)
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name3] = shader3;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/subSurfaceScatteringFunctions.js
var name4 = "subSurfaceScatteringFunctions";
var shader4 = `fn testLightingForSSS(diffusionProfile: f32)->bool
{return diffusionProfile<1.;}`;
ShaderStore.IncludesShadersStoreWGSL[name4] = shader4;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/importanceSampling.js
var name5 = "importanceSampling";
var shader5 = `fn hemisphereCosSample(u: vec2f)->vec3f {var phi: f32=2.*PI*u.x;var cosTheta2: f32=1.-u.y;var cosTheta: f32=sqrt(cosTheta2);var sinTheta: f32=sqrt(1.-cosTheta2);return vec3f(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);}
fn hemisphereImportanceSampleDggx(u: vec2f,a: f32)->vec3f {var phi: f32=2.*PI*u.x;var cosTheta2: f32=(1.-u.y)/(1.+(a+1.)*((a-1.)*u.y));var cosTheta: f32=sqrt(cosTheta2);var sinTheta: f32=sqrt(1.-cosTheta2);return vec3f(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);}
fn hemisphereImportanceSampleDCharlie(u: vec2f,a: f32)->vec3f { 
var phi: f32=2.*PI*u.x;var sinTheta: f32=pow(u.y,a/(2.*a+1.));var cosTheta: f32=sqrt(1.-sinTheta*sinTheta);return vec3f(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);}`;
ShaderStore.IncludesShadersStoreWGSL[name5] = shader5;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrHelperFunctions.js
var name6 = "pbrHelperFunctions";
var shader6 = `#define MINIMUMVARIANCE 0.0005
fn convertRoughnessToAverageSlope(roughness: f32)->f32
{return roughness*roughness+MINIMUMVARIANCE;}
fn fresnelGrazingReflectance(reflectance0: f32)->f32 {var reflectance90: f32=saturate(reflectance0*25.0);return reflectance90;}
fn getAARoughnessFactors(normalVector: vec3f)->vec2f {
#ifdef SPECULARAA
var nDfdx: vec3f=dpdx(normalVector.xyz);var nDfdy: vec3f=dpdy(normalVector.xyz);var slopeSquare: f32=max(dot(nDfdx,nDfdx),dot(nDfdy,nDfdy));var geometricRoughnessFactor: f32=pow(saturate(slopeSquare),0.333);var geometricAlphaGFactor: f32=sqrt(slopeSquare);geometricAlphaGFactor*=0.75;return vec2f(geometricRoughnessFactor,geometricAlphaGFactor);
#else
return vec2f(0.);
#endif
}
#ifdef ANISOTROPIC
#ifdef ANISOTROPIC_LEGACY
fn getAnisotropicRoughness(alphaG: f32,anisotropy: f32)->vec2f {var alphaT: f32=max(alphaG*(1.0+anisotropy),MINIMUMVARIANCE);var alphaB: f32=max(alphaG*(1.0-anisotropy),MINIMUMVARIANCE);return vec2f(alphaT,alphaB);}
fn getAnisotropicBentNormals(T: vec3f,B: vec3f,N: vec3f,V: vec3f,anisotropy: f32,roughness: f32)->vec3f {var anisotropicFrameDirection: vec3f=select(T,B,anisotropy>=0.0);var anisotropicFrameTangent: vec3f=cross(normalize(anisotropicFrameDirection),V);var anisotropicFrameNormal: vec3f=cross(anisotropicFrameTangent,anisotropicFrameDirection);var anisotropicNormal: vec3f=normalize(mix(N,anisotropicFrameNormal,abs(anisotropy)));return anisotropicNormal;}
#else
fn getAnisotropicRoughness(alphaG: f32,anisotropy: f32)->vec2f {var alphaT: f32=max(mix(alphaG,1.0,anisotropy*anisotropy),MINIMUMVARIANCE);var alphaB: f32=max(alphaG,MINIMUMVARIANCE);return vec2f(alphaT,alphaB);}
fn getAnisotropicBentNormals(T: vec3f,B: vec3f,N: vec3f,V: vec3f,anisotropy: f32,roughness: f32)->vec3f {var bentNormal: vec3f=cross(B,V);bentNormal=normalize(cross(bentNormal,B));var sq=1.0-anisotropy*(1.0-roughness);var a: f32=sq*sq*sq*sq;bentNormal=normalize(mix(bentNormal,N,a));return bentNormal;}
#endif
#endif
#if defined(CLEARCOAT) || defined(SS_REFRACTION)
fn cocaLambertVec3(alpha: vec3f,distance: f32)->vec3f {return exp(-alpha*distance);}
fn cocaLambert(NdotVRefract: f32,NdotLRefract: f32,alpha: vec3f,thickness: f32)->vec3f {return cocaLambertVec3(alpha,(thickness*((NdotLRefract+NdotVRefract)/(NdotLRefract*NdotVRefract))));}
fn computeColorAtDistanceInMedia(color: vec3f,distance: f32)->vec3f {return -log(color)/distance;}
fn computeClearCoatAbsorption(NdotVRefract: f32,NdotLRefract: f32,clearCoatColor: vec3f,clearCoatThickness: f32,clearCoatIntensity: f32)->vec3f {var clearCoatAbsorption: vec3f=mix( vec3f(1.0),
cocaLambert(NdotVRefract,NdotLRefract,clearCoatColor,clearCoatThickness),
clearCoatIntensity);return clearCoatAbsorption;}
#endif
#ifdef MICROSURFACEAUTOMATIC
fn computeDefaultMicroSurface(microSurface: f32,reflectivityColor: vec3f)->f32
{const kReflectivityNoAlphaWorkflow_SmoothnessMax: f32=0.95;var reflectivityLuminance: f32=getLuminance(reflectivityColor);var reflectivityLuma: f32=sqrt(reflectivityLuminance);var resultMicroSurface=reflectivityLuma*kReflectivityNoAlphaWorkflow_SmoothnessMax;return resultMicroSurface;}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name6] = shader6;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrDirectLightingSetupFunctions.js
var name7 = "pbrDirectLightingSetupFunctions";
var shader7 = `struct preLightingInfo
{lightOffset: vec3f,
lightDistanceSquared: f32,
lightDistance: f32,
attenuation: f32,
L: vec3f,
H: vec3f,
NdotV: f32,
NdotLUnclamped: f32,
NdotL: f32,
VdotH: f32,
roughness: f32,
#ifdef IRIDESCENCE
iridescenceIntensity: f32
#endif
};fn computePointAndSpotPreLightingInfo(lightData: vec4f,V: vec3f,N: vec3f,posW: vec3f)->preLightingInfo {var result: preLightingInfo;result.lightOffset=lightData.xyz-posW;result.lightDistanceSquared=dot(result.lightOffset,result.lightOffset);result.lightDistance=sqrt(result.lightDistanceSquared);result.L=normalize(result.lightOffset);result.H=normalize(V+result.L);result.VdotH=saturate(dot(V,result.H));result.NdotLUnclamped=dot(N,result.L);result.NdotL=saturateEps(result.NdotLUnclamped);return result;}
fn computeDirectionalPreLightingInfo(lightData: vec4f,V: vec3f,N: vec3f)->preLightingInfo {var result: preLightingInfo;result.lightDistance=length(-lightData.xyz);result.L=normalize(-lightData.xyz);result.H=normalize(V+result.L);result.VdotH=saturate(dot(V,result.H));result.NdotLUnclamped=dot(N,result.L);result.NdotL=saturateEps(result.NdotLUnclamped);return result;}
fn computeHemisphericPreLightingInfo(lightData: vec4f,V: vec3f,N: vec3f)->preLightingInfo {var result: preLightingInfo;result.NdotL=dot(N,lightData.xyz)*0.5+0.5;result.NdotL=saturateEps(result.NdotL);result.NdotLUnclamped=result.NdotL;
#ifdef SPECULARTERM
result.L=normalize(lightData.xyz);result.H=normalize(V+result.L);result.VdotH=saturate(dot(V,result.H));
#endif
return result;}`;
ShaderStore.IncludesShadersStoreWGSL[name7] = shader7;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrDirectLightingFalloffFunctions.js
var name8 = "pbrDirectLightingFalloffFunctions";
var shader8 = `fn computeDistanceLightFalloff_Standard(lightOffset: vec3f,range: f32)->f32
{return max(0.,1.0-length(lightOffset)/range);}
fn computeDistanceLightFalloff_Physical(lightDistanceSquared: f32)->f32
{return 1.0/maxEps(lightDistanceSquared);}
fn computeDistanceLightFalloff_GLTF(lightDistanceSquared: f32,inverseSquaredRange: f32)->f32
{var lightDistanceFalloff: f32=1.0/maxEps(lightDistanceSquared);var factor: f32=lightDistanceSquared*inverseSquaredRange;var attenuation: f32=saturate(1.0-factor*factor);attenuation*=attenuation;lightDistanceFalloff*=attenuation;return lightDistanceFalloff;}
fn computeDistanceLightFalloff(lightOffset: vec3f,lightDistanceSquared: f32,range: f32,inverseSquaredRange: f32)->f32
{
#ifdef USEPHYSICALLIGHTFALLOFF
return computeDistanceLightFalloff_Physical(lightDistanceSquared);
#elif defined(USEGLTFLIGHTFALLOFF)
return computeDistanceLightFalloff_GLTF(lightDistanceSquared,inverseSquaredRange);
#else
return computeDistanceLightFalloff_Standard(lightOffset,range);
#endif
}
fn computeDirectionalLightFalloff_Standard(lightDirection: vec3f,directionToLightCenterW: vec3f,cosHalfAngle: f32,exponent: f32)->f32
{var falloff: f32=0.0;var cosAngle: f32=maxEps(dot(-lightDirection,directionToLightCenterW));if (cosAngle>=cosHalfAngle)
{falloff=max(0.,pow(cosAngle,exponent));}
return falloff;}
fn computeDirectionalLightFalloff_Physical(lightDirection: vec3f,directionToLightCenterW: vec3f,cosHalfAngle: f32)->f32
{const kMinusLog2ConeAngleIntensityRatio: f32=6.64385618977; 
var concentrationKappa: f32=kMinusLog2ConeAngleIntensityRatio/(1.0-cosHalfAngle);var lightDirectionSpreadSG: vec4f= vec4f(-lightDirection*concentrationKappa,-concentrationKappa);var falloff: f32=exp2(dot( vec4f(directionToLightCenterW,1.0),lightDirectionSpreadSG));return falloff;}
fn computeDirectionalLightFalloff_GLTF(lightDirection: vec3f,directionToLightCenterW: vec3f,lightAngleScale: f32,lightAngleOffset: f32)->f32
{var cd: f32=dot(-lightDirection,directionToLightCenterW);var falloff: f32=saturate(cd*lightAngleScale+lightAngleOffset);falloff*=falloff;return falloff;}
fn computeDirectionalLightFalloff(lightDirection: vec3f,directionToLightCenterW: vec3f,cosHalfAngle: f32,exponent: f32,lightAngleScale: f32,lightAngleOffset: f32)->f32
{
#ifdef USEPHYSICALLIGHTFALLOFF
return computeDirectionalLightFalloff_Physical(lightDirection,directionToLightCenterW,cosHalfAngle);
#elif defined(USEGLTFLIGHTFALLOFF)
return computeDirectionalLightFalloff_GLTF(lightDirection,directionToLightCenterW,lightAngleScale,lightAngleOffset);
#else
return computeDirectionalLightFalloff_Standard(lightDirection,directionToLightCenterW,cosHalfAngle,exponent);
#endif
}`;
ShaderStore.IncludesShadersStoreWGSL[name8] = shader8;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBRDFFunctions.js
var name9 = "pbrBRDFFunctions";
var shader9 = `#define FRESNEL_MAXIMUM_ON_ROUGH 0.25
#ifdef MS_BRDF_ENERGY_CONSERVATION
fn getEnergyConservationFactor(specularEnvironmentR0: vec3f,environmentBrdf: vec3f)->vec3f {return 1.0+specularEnvironmentR0*(1.0/environmentBrdf.y-1.0);}
#endif
#ifdef ENVIRONMENTBRDF
fn getBRDFLookup(NdotV: f32,perceptualRoughness: f32)->vec3f {var UV: vec2f= vec2f(NdotV,perceptualRoughness);var brdfLookup: vec4f= textureSample(environmentBrdfSampler,environmentBrdfSamplerSampler,UV);
#ifdef ENVIRONMENTBRDF_RGBD
brdfLookup=vec4f(fromRGBD(brdfLookup.rgba),brdfLookup.a);
#endif
return brdfLookup.rgb;}
fn getReflectanceFromBRDFWithEnvLookup(specularEnvironmentR0: vec3f,specularEnvironmentR90: vec3f,environmentBrdf: vec3f)->vec3f {
#ifdef BRDF_V_HEIGHT_CORRELATED
var reflectance: vec3f=(specularEnvironmentR90-specularEnvironmentR0)*environmentBrdf.x+specularEnvironmentR0*environmentBrdf.y;
#else
var reflectance: vec3f=specularEnvironmentR0*environmentBrdf.x+specularEnvironmentR90*environmentBrdf.y;
#endif
return reflectance;}
fn getReflectanceFromBRDFLookup(specularEnvironmentR0: vec3f,environmentBrdf: vec3f)->vec3f {
#ifdef BRDF_V_HEIGHT_CORRELATED
var reflectance: vec3f=mix(environmentBrdf.xxx,environmentBrdf.yyy,specularEnvironmentR0);
#else
var reflectance: vec3f=specularEnvironmentR0*environmentBrdf.x+environmentBrdf.y;
#endif
return reflectance;}
#endif
/* NOT USED
#if defined(SHEEN) && defined(SHEEN_SOFTER)
fn getBRDFLookupCharlieSheen(NdotV: f32,perceptualRoughness: f32)->f32
{var c: f32=1.0-NdotV;var c3: f32=c*c*c;return 0.65584461*c3+1.0/(4.16526551+exp(-7.97291361*perceptualRoughness+6.33516894));}
#endif
*/
#if !defined(ENVIRONMENTBRDF) || defined(REFLECTIONMAP_SKYBOX) || defined(ALPHAFRESNEL)
fn getReflectanceFromAnalyticalBRDFLookup_Jones(VdotN: f32,reflectance0: vec3f,reflectance90: vec3f,smoothness: f32)->vec3f
{var weight: f32=mix(FRESNEL_MAXIMUM_ON_ROUGH,1.0,smoothness);return reflectance0+weight*(reflectance90-reflectance0)*pow5(saturate(1.0-VdotN));}
#endif
#if defined(SHEEN) && defined(ENVIRONMENTBRDF)
/**
* The sheen BRDF not containing F can be easily stored in the blue channel of the BRDF texture.
* The blue channel contains DCharlie*VAshikhmin*NdotL as a lokkup table
*/
fn getSheenReflectanceFromBRDFLookup(reflectance0: vec3f,environmentBrdf: vec3f)->vec3f {var sheenEnvironmentReflectance: vec3f=reflectance0*environmentBrdf.b;return sheenEnvironmentReflectance;}
#endif
fn fresnelSchlickGGXVec3(VdotH: f32,reflectance0: vec3f,reflectance90: vec3f)->vec3f
{return reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);}
fn fresnelSchlickGGX(VdotH: f32,reflectance0: f32,reflectance90: f32)->f32
{return reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);}
#ifdef CLEARCOAT
fn getR0RemappedForClearCoat(f0: vec3f)->vec3f {
#ifdef CLEARCOAT_DEFAULTIOR
#ifdef MOBILE
return saturateVec3(f0*(f0*0.526868+0.529324)-0.0482256);
#else
return saturateVec3(f0*(f0*(0.941892-0.263008*f0)+0.346479)-0.0285998);
#endif
#else
var s: vec3f=sqrt(f0);var t: vec3f=(uniforms.vClearCoatRefractionParams.z+uniforms.vClearCoatRefractionParams.w*s)/(uniforms.vClearCoatRefractionParams.w+uniforms.vClearCoatRefractionParams.z*s);return squareVec3(t);
#endif
}
#endif
#ifdef IRIDESCENCE
const XYZ_TO_REC709: mat3x3f= mat3x3f(
3.2404542,-0.9692660, 0.0556434,
-1.5371385, 1.8760108,-0.2040259,
-0.4985314, 0.0415560, 1.0572252
);fn getIORTfromAirToSurfaceR0(f0: vec3f)->vec3f {var sqrtF0: vec3f=sqrt(f0);return (1.+sqrtF0)/(1.-sqrtF0);}
fn getR0fromIORsVec3(iorT: vec3f,iorI: f32)->vec3f {return squareVec3((iorT- vec3f(iorI))/(iorT+ vec3f(iorI)));}
fn getR0fromIORs(iorT: f32,iorI: f32)->f32 {return square((iorT-iorI)/(iorT+iorI));}
fn evalSensitivity(opd: f32,shift: vec3f)->vec3f {var phase: f32=2.0*PI*opd*1.0e-9;const val: vec3f= vec3f(5.4856e-13,4.4201e-13,5.2481e-13);const pos: vec3f= vec3f(1.6810e+06,1.7953e+06,2.2084e+06);const vr: vec3f= vec3f(4.3278e+09,9.3046e+09,6.6121e+09);var xyz: vec3f=val*sqrt(2.0*PI*vr)*cos(pos*phase+shift)*exp(-square(phase)*vr);xyz.x+=9.7470e-14*sqrt(2.0*PI*4.5282e+09)*cos(2.2399e+06*phase+shift[0])*exp(-4.5282e+09*square(phase));xyz/=1.0685e-7;var srgb: vec3f=XYZ_TO_REC709*xyz;return srgb;}
fn evalIridescence(outsideIOR: f32,eta2: f32,cosTheta1: f32,thinFilmThickness: f32,baseF0: vec3f)->vec3f {var I: vec3f= vec3f(1.0);var iridescenceIOR: f32=mix(outsideIOR,eta2,smoothstep(0.0,0.03,thinFilmThickness));var sinTheta2Sq: f32=square(outsideIOR/iridescenceIOR)*(1.0-square(cosTheta1));var cosTheta2Sq: f32=1.0-sinTheta2Sq;if (cosTheta2Sq<0.0) {return I;}
var cosTheta2: f32=sqrt(cosTheta2Sq);var R0: f32=getR0fromIORs(iridescenceIOR,outsideIOR);var R12: f32=fresnelSchlickGGX(cosTheta1,R0,1.);var R21: f32=R12;var T121: f32=1.0-R12;var phi12: f32=0.0;if (iridescenceIOR<outsideIOR) {phi12=PI;}
var phi21: f32=PI-phi12;var baseIOR: vec3f=getIORTfromAirToSurfaceR0(clamp(baseF0,vec3f(0.0),vec3f(0.9999))); 
var R1: vec3f=getR0fromIORsVec3(baseIOR,iridescenceIOR);var R23: vec3f=fresnelSchlickGGXVec3(cosTheta2,R1, vec3f(1.));var phi23: vec3f= vec3f(0.0);if (baseIOR[0]<iridescenceIOR) {phi23[0]=PI;}
if (baseIOR[1]<iridescenceIOR) {phi23[1]=PI;}
if (baseIOR[2]<iridescenceIOR) {phi23[2]=PI;}
var opd: f32=2.0*iridescenceIOR*thinFilmThickness*cosTheta2;var phi: vec3f= vec3f(phi21)+phi23;var R123: vec3f=clamp(R12*R23,vec3f(1e-5),vec3f(0.9999));var r123: vec3f=sqrt(R123);var Rs: vec3f=(T121*T121)*R23/( vec3f(1.0)-R123);var C0: vec3f=R12+Rs;I=C0;var Cm: vec3f=Rs-T121;for (var m: i32=1; m<=2; m++)
{Cm*=r123;var Sm: vec3f=2.0*evalSensitivity( f32(m)*opd, f32(m)*phi);I+=Cm*Sm;}
return max(I, vec3f(0.0));}
#endif
fn normalDistributionFunction_TrowbridgeReitzGGX(NdotH: f32,alphaG: f32)->f32
{var a2: f32=alphaG*alphaG;var d: f32=NdotH*NdotH*(a2-1.0)+1.0;return a2/(PI*d*d);}
#ifdef SHEEN
fn normalDistributionFunction_CharlieSheen(NdotH: f32,alphaG: f32)->f32
{var invR: f32=1./alphaG;var cos2h: f32=NdotH*NdotH;var sin2h: f32=1.-cos2h;return (2.+invR)*pow(sin2h,invR*.5)/(2.*PI);}
#endif
#ifdef ANISOTROPIC
fn normalDistributionFunction_BurleyGGX_Anisotropic(NdotH: f32,TdotH: f32,BdotH: f32,alphaTB: vec2f)->f32 {var a2: f32=alphaTB.x*alphaTB.y;var v: vec3f= vec3f(alphaTB.y*TdotH,alphaTB.x *BdotH,a2*NdotH);var v2: f32=dot(v,v);var w2: f32=a2/v2;return a2*w2*w2*RECIPROCAL_PI;}
#endif
#ifdef BRDF_V_HEIGHT_CORRELATED
fn smithVisibility_GGXCorrelated(NdotL: f32,NdotV: f32,alphaG: f32)->f32 {
#ifdef MOBILE
var GGXV: f32=NdotL*(NdotV*(1.0-alphaG)+alphaG);var GGXL: f32=NdotV*(NdotL*(1.0-alphaG)+alphaG);return 0.5/(GGXV+GGXL);
#else
var a2: f32=alphaG*alphaG;var GGXV: f32=NdotL*sqrt(NdotV*(NdotV-a2*NdotV)+a2);var GGXL: f32=NdotV*sqrt(NdotL*(NdotL-a2*NdotL)+a2);return 0.5/(GGXV+GGXL);
#endif
}
#else
fn smithVisibilityG1_TrowbridgeReitzGGXFast(dot: f32,alphaG: f32)->f32
{
#ifdef MOBILE
return 1.0/(dot+alphaG+(1.0-alphaG)*dot ));
#else
var alphaSquared: f32=alphaG*alphaG;return 1.0/(dot+sqrt(alphaSquared+(1.0-alphaSquared)*dot*dot));
#endif
}
fn smithVisibility_TrowbridgeReitzGGXFast(NdotL: f32,NdotV: f32,alphaG: f32)->f32
{var visibility: f32=smithVisibilityG1_TrowbridgeReitzGGXFast(NdotL,alphaG)*smithVisibilityG1_TrowbridgeReitzGGXFast(NdotV,alphaG);return visibility;}
#endif
#ifdef ANISOTROPIC
fn smithVisibility_GGXCorrelated_Anisotropic(NdotL: f32,NdotV: f32,TdotV: f32,BdotV: f32,TdotL: f32,BdotL: f32,alphaTB: vec2f)->f32 {var lambdaV: f32=NdotL*length( vec3f(alphaTB.x*TdotV,alphaTB.y*BdotV,NdotV));var lambdaL: f32=NdotV*length( vec3f(alphaTB.x*TdotL,alphaTB.y*BdotL,NdotL));var v: f32=0.5/(lambdaV+lambdaL);return v;}
#endif
#ifdef CLEARCOAT
fn visibility_Kelemen(VdotH: f32)->f32 {return 0.25/(VdotH*VdotH); }
#endif
#ifdef SHEEN
fn visibility_Ashikhmin(NdotL: f32,NdotV: f32)->f32
{return 1./(4.*(NdotL+NdotV-NdotL*NdotV));}
/* NOT USED
#ifdef SHEEN_SOFTER
fn l(x: f32,alphaG: f32)->f32
{var oneMinusAlphaSq: f32=(1.0-alphaG)*(1.0-alphaG);var a: f32=mix(21.5473,25.3245,oneMinusAlphaSq);var b: f32=mix(3.82987,3.32435,oneMinusAlphaSq);var c: f32=mix(0.19823,0.16801,oneMinusAlphaSq);var d: f32=mix(-1.97760,-1.27393,oneMinusAlphaSq);var e: f32=mix(-4.32054,-4.85967,oneMinusAlphaSq);return a/(1.0+b*pow(x,c))+d*x+e;}
fn lambdaSheen(cosTheta: f32,alphaG: f32)->f32
{return abs(cosTheta)<0.5 ? exp(l(cosTheta,alphaG)) : exp(2.0*l(0.5,alphaG)-l(1.0-cosTheta,alphaG));}
fn visibility_CharlieSheen(NdotL: f32,NdotV: f32,alphaG: f32)->f32
{var G: f32=1.0/(1.0+lambdaSheen(NdotV,alphaG)+lambdaSheen(NdotL,alphaG));return G/(4.0*NdotV*NdotL);}
#endif
*/
#endif
fn diffuseBRDF_Burley(NdotL: f32,NdotV: f32,VdotH: f32,roughness: f32)->f32 {var diffuseFresnelNV: f32=pow5(saturateEps(1.0-NdotL));var diffuseFresnelNL: f32=pow5(saturateEps(1.0-NdotV));var diffuseFresnel90: f32=0.5+2.0*VdotH*VdotH*roughness;var fresnel: f32 =
(1.0+(diffuseFresnel90-1.0)*diffuseFresnelNL) *
(1.0+(diffuseFresnel90-1.0)*diffuseFresnelNV);return fresnel/PI;}
#ifdef SS_TRANSLUCENCY
fn transmittanceBRDF_Burley(tintColor: vec3f,diffusionDistance: vec3f,thickness: f32)->vec3f {var S: vec3f=1./maxEpsVec3(diffusionDistance);var temp: vec3f=exp((-0.333333333*thickness)*S);return tintColor.rgb*0.25*(temp*temp*temp+3.0*temp);}
fn computeWrappedDiffuseNdotL(NdotL: f32,w: f32)->f32 {var t: f32=1.0+w;var invt2: f32=1.0/(t*t);return saturate((NdotL+w)*invt2);}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name9] = shader9;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/hdrFilteringFunctions.js
var name10 = "hdrFilteringFunctions";
var shader10 = `#ifdef NUM_SAMPLES
#if NUM_SAMPLES>0
fn radicalInverse_VdC(value: u32)->f32 
{var bits=(value<<16u) | (value>>16u);bits=((bits & 0x55555555u)<<1u) | ((bits & 0xAAAAAAAAu)>>1u);bits=((bits & 0x33333333u)<<2u) | ((bits & 0xCCCCCCCCu)>>2u);bits=((bits & 0x0F0F0F0Fu)<<4u) | ((bits & 0xF0F0F0F0u)>>4u);bits=((bits & 0x00FF00FFu)<<8u) | ((bits & 0xFF00FF00u)>>8u);return f32(bits)*2.3283064365386963e-10; }
fn hammersley(i: u32,N: u32)->vec2f
{return vec2f( f32(i)/ f32(N),radicalInverse_VdC(i));}
fn log4(x: f32)->f32 {return log2(x)/2.;}
const NUM_SAMPLES_FLOAT: f32= f32(NUM_SAMPLES);const NUM_SAMPLES_FLOAT_INVERSED: f32=1./NUM_SAMPLES_FLOAT;const K: f32=4.;fn irradiance(inputTexture: texture_cube<f32>,inputSampler: sampler,inputN: vec3f,filteringInfo: vec2f)->vec3f
{var n: vec3f=normalize(inputN);var result: vec3f= vec3f(0.0);var tangent: vec3f=select(vec3f(1.,0.,0.),vec3f(0.,0.,1.),abs(n.z)<0.999);tangent=normalize(cross(tangent,n));var bitangent: vec3f=cross(n,tangent);var tbn: mat3x3f= mat3x3f(tangent,bitangent,n);var maxLevel: f32=filteringInfo.y;var dim0: f32=filteringInfo.x;var omegaP: f32=(4.*PI)/(6.*dim0*dim0);for(var i: u32=0u; i<NUM_SAMPLES; i++)
{var Xi: vec2f=hammersley(i,NUM_SAMPLES);var Ls: vec3f=hemisphereCosSample(Xi);Ls=normalize(Ls);var Ns: vec3f= vec3f(0.,0.,1.);var NoL: f32=dot(Ns,Ls);if (NoL>0.) {var pdf_inversed: f32=PI/NoL;var omegaS: f32=NUM_SAMPLES_FLOAT_INVERSED*pdf_inversed;var l: f32=log4(omegaS)-log4(omegaP)+log4(K);var mipLevel: f32=clamp(l,0.0,maxLevel);var c: vec3f=textureSampleLevel(inputTexture,inputSampler,tbn*Ls,mipLevel).rgb;
#ifdef GAMMA_INPUT
c=toLinearSpaceVec3(c);
#endif
result+=c;}}
result=result*NUM_SAMPLES_FLOAT_INVERSED;return result;}
fn radiance(alphaG: f32,inputTexture: texture_cube<f32>,inputSampler: sampler,inputN: vec3f,filteringInfo: vec2f)->vec3f
{var n: vec3f=normalize(inputN);var c: vec3f=textureSample(inputTexture,inputSampler,n).rgb; 
if (alphaG==0.) {
#ifdef GAMMA_INPUT
c=toLinearSpace(c);
#endif
return c;} else {var result: vec3f= vec3f(0.);var tangent: vec3f=select(vec3f(1.,0.,0.),vec3f(0.,0.,1.),abs(n.z)<0.999);tangent=normalize(cross(tangent,n));var bitangent: vec3f=cross(n,tangent);var tbn: mat3x3f= mat3x3f(tangent,bitangent,n);var maxLevel: f32=filteringInfo.y;var dim0: f32=filteringInfo.x;var omegaP: f32=(4.*PI)/(6.*dim0*dim0);var weight: f32=0.;for(var i: u32=0u; i<NUM_SAMPLES; i++)
{var Xi: vec2f=hammersley(i,NUM_SAMPLES);var H: vec3f=hemisphereImportanceSampleDggx(Xi,alphaG);var NoV: f32=1.;var NoH: f32=H.z;var NoH2: f32=H.z*H.z;var NoL: f32=2.*NoH2-1.;var L: vec3f= vec3f(2.*NoH*H.x,2.*NoH*H.y,NoL);L=normalize(L);if (NoL>0.) {var pdf_inversed: f32=4./normalDistributionFunction_TrowbridgeReitzGGX(NoH,alphaG);var omegaS: f32=NUM_SAMPLES_FLOAT_INVERSED*pdf_inversed;var l: f32=log4(omegaS)-log4(omegaP)+log4(K);var mipLevel: f32=clamp( f32(l),0.0,maxLevel);weight+=NoL;var c: vec3f=textureSampleLevel(inputTexture,inputSampler,tbn*L,mipLevel).rgb;
#ifdef GAMMA_INPUT
c=toLinearSpace(c);
#endif
result+=c*NoL;}}
result=result/weight;return result;}}
#endif
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name10] = shader10;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrDirectLightingFunctions.js
var name11 = "pbrDirectLightingFunctions";
var shader11 = `#define CLEARCOATREFLECTANCE90 1.0
struct lightingInfo
{diffuse: vec3f,
#ifdef SPECULARTERM
specular: vec3f,
#endif
#ifdef CLEARCOAT
clearCoat: vec4f,
#endif
#ifdef SHEEN
sheen: vec3f
#endif
};fn adjustRoughnessFromLightProperties(roughness: f32,lightRadius: f32,lightDistance: f32)->f32 {
#if defined(USEPHYSICALLIGHTFALLOFF) || defined(USEGLTFLIGHTFALLOFF)
var lightRoughness: f32=lightRadius/lightDistance;var totalRoughness: f32=saturate(lightRoughness+roughness);return totalRoughness;
#else
return roughness;
#endif
}
fn computeHemisphericDiffuseLighting(info: preLightingInfo,lightColor: vec3f,groundColor: vec3f)->vec3f {return mix(groundColor,lightColor,info.NdotL);}
fn computeDiffuseLighting(info: preLightingInfo,lightColor: vec3f)->vec3f {var diffuseTerm: f32=diffuseBRDF_Burley(info.NdotL,info.NdotV,info.VdotH,info.roughness);return diffuseTerm*info.attenuation*info.NdotL*lightColor;}
fn computeProjectionTextureDiffuseLighting(projectionLightTexture: texture_2d<f32>,projectionLightSampler: sampler,textureProjectionMatrix: mat4x4f,posW: vec3f)->vec3f{var strq: vec4f=textureProjectionMatrix* vec4f(posW,1.0);strq/=strq.w;var textureColor: vec3f=textureSample(projectionLightTexture,projectionLightSampler,strq.xy).rgb;return toLinearSpaceVec3(textureColor);}
#ifdef SS_TRANSLUCENCY
fn computeDiffuseAndTransmittedLighting(info: preLightingInfo,lightColor: vec3f,transmittance: vec3f)->vec3f {var NdotL: f32=absEps(info.NdotLUnclamped);var wrapNdotL: f32=computeWrappedDiffuseNdotL(NdotL,0.02);var trAdapt: f32=step(0.,info.NdotLUnclamped);var transmittanceNdotL: vec3f=mix(transmittance*wrapNdotL, vec3f(wrapNdotL),trAdapt);var diffuseTerm: f32=diffuseBRDF_Burley(NdotL,info.NdotV,info.VdotH,info.roughness);return diffuseTerm*transmittanceNdotL*info.attenuation*lightColor;}
#endif
#ifdef SPECULARTERM
fn computeSpecularLighting(info: preLightingInfo,N: vec3f,reflectance0: vec3f,reflectance90: vec3f,geometricRoughnessFactor: f32,lightColor: vec3f)->vec3f {var NdotH: f32=saturateEps(dot(N,info.H));var roughness: f32=max(info.roughness,geometricRoughnessFactor);var alphaG: f32=convertRoughnessToAverageSlope(roughness);var fresnel: vec3f=fresnelSchlickGGXVec3(info.VdotH,reflectance0,reflectance90);
#ifdef IRIDESCENCE
fresnel=mix(fresnel,reflectance0,info.iridescenceIntensity);
#endif
var distribution: f32=normalDistributionFunction_TrowbridgeReitzGGX(NdotH,alphaG);
#ifdef BRDF_V_HEIGHT_CORRELATED
var smithVisibility: f32=smithVisibility_GGXCorrelated(info.NdotL,info.NdotV,alphaG);
#else
var smithVisibility: f32=smithVisibility_TrowbridgeReitzGGXFast(info.NdotL,info.NdotV,alphaG);
#endif
var specTerm: vec3f=fresnel*distribution*smithVisibility;return specTerm*info.attenuation*info.NdotL*lightColor;}
#endif
#ifdef ANISOTROPIC
fn computeAnisotropicSpecularLighting(info: preLightingInfo,V: vec3f,N: vec3f,T: vec3f,B: vec3f,anisotropy: f32,reflectance0: vec3f,reflectance90: vec3f,geometricRoughnessFactor: f32,lightColor: vec3f)->vec3f {var NdotH: f32=saturateEps(dot(N,info.H));var TdotH: f32=dot(T,info.H);var BdotH: f32=dot(B,info.H);var TdotV: f32=dot(T,V);var BdotV: f32=dot(B,V);var TdotL: f32=dot(T,info.L);var BdotL: f32=dot(B,info.L);var alphaG: f32=convertRoughnessToAverageSlope(info.roughness);var alphaTB: vec2f=getAnisotropicRoughness(alphaG,anisotropy);alphaTB=max(alphaTB,vec2f(geometricRoughnessFactor*geometricRoughnessFactor));var fresnel: vec3f=fresnelSchlickGGXVec3(info.VdotH,reflectance0,reflectance90);
#ifdef IRIDESCENCE
fresnel=mix(fresnel,reflectance0,info.iridescenceIntensity);
#endif
var distribution: f32=normalDistributionFunction_BurleyGGX_Anisotropic(NdotH,TdotH,BdotH,alphaTB);var smithVisibility: f32=smithVisibility_GGXCorrelated_Anisotropic(info.NdotL,info.NdotV,TdotV,BdotV,TdotL,BdotL,alphaTB);var specTerm: vec3f=fresnel*distribution*smithVisibility;return specTerm*info.attenuation*info.NdotL*lightColor;}
#endif
#ifdef CLEARCOAT
fn computeClearCoatLighting(info: preLightingInfo,Ncc: vec3f,geometricRoughnessFactor: f32,clearCoatIntensity: f32,lightColor: vec3f)->vec4f {var NccdotL: f32=saturateEps(dot(Ncc,info.L));var NccdotH: f32=saturateEps(dot(Ncc,info.H));var clearCoatRoughness: f32=max(info.roughness,geometricRoughnessFactor);var alphaG: f32=convertRoughnessToAverageSlope(clearCoatRoughness);var fresnel: f32=fresnelSchlickGGX(info.VdotH,uniforms.vClearCoatRefractionParams.x,CLEARCOATREFLECTANCE90);fresnel*=clearCoatIntensity;var distribution: f32=normalDistributionFunction_TrowbridgeReitzGGX(NccdotH,alphaG);var kelemenVisibility: f32=visibility_Kelemen(info.VdotH);var clearCoatTerm: f32=fresnel*distribution*kelemenVisibility;return vec4f(
clearCoatTerm*info.attenuation*NccdotL*lightColor,
1.0-fresnel
);}
fn computeClearCoatLightingAbsorption(NdotVRefract: f32,L: vec3f,Ncc: vec3f,clearCoatColor: vec3f,clearCoatThickness: f32,clearCoatIntensity: f32)->vec3f {var LRefract: vec3f=-refract(L,Ncc,uniforms.vClearCoatRefractionParams.y);var NdotLRefract: f32=saturateEps(dot(Ncc,LRefract));var absorption: vec3f=computeClearCoatAbsorption(NdotVRefract,NdotLRefract,clearCoatColor,clearCoatThickness,clearCoatIntensity);return absorption;}
#endif
#ifdef SHEEN
fn computeSheenLighting(info: preLightingInfo,N: vec3f,reflectance0: vec3f,reflectance90: vec3f,geometricRoughnessFactor: f32,lightColor: vec3f)->vec3f {var NdotH: f32=saturateEps(dot(N,info.H));var roughness: f32=max(info.roughness,geometricRoughnessFactor);var alphaG: f32=convertRoughnessToAverageSlope(roughness);var fresnel: f32=1.;var distribution: f32=normalDistributionFunction_CharlieSheen(NdotH,alphaG);/*#ifdef SHEEN_SOFTER
var visibility: f32=visibility_CharlieSheen(info.NdotL,info.NdotV,alphaG);
#else */
var visibility: f32=visibility_Ashikhmin(info.NdotL,info.NdotV);/* #endif */
var sheenTerm: f32=fresnel*distribution*visibility;return sheenTerm*info.attenuation*info.NdotL*lightColor;}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name11] = shader11;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrIBLFunctions.js
var name12 = "pbrIBLFunctions";
var shader12 = `#if defined(REFLECTION) || defined(SS_REFRACTION)
fn getLodFromAlphaG(cubeMapDimensionPixels: f32,microsurfaceAverageSlope: f32)->f32 {var microsurfaceAverageSlopeTexels: f32=cubeMapDimensionPixels*microsurfaceAverageSlope;var lod: f32=log2(microsurfaceAverageSlopeTexels);return lod;}
fn getLinearLodFromRoughness(cubeMapDimensionPixels: f32,roughness: f32)->f32 {var lod: f32=log2(cubeMapDimensionPixels)*roughness;return lod;}
#endif
#if defined(ENVIRONMENTBRDF) && defined(RADIANCEOCCLUSION)
fn environmentRadianceOcclusion(ambientOcclusion: f32,NdotVUnclamped: f32)->f32 {var temp: f32=NdotVUnclamped+ambientOcclusion;return saturate(temp*temp-1.0+ambientOcclusion);}
#endif
#if defined(ENVIRONMENTBRDF) && defined(HORIZONOCCLUSION)
fn environmentHorizonOcclusion(view: vec3f,normal: vec3f,geometricNormal: vec3f)->f32 {var reflection: vec3f=reflect(view,normal);var temp: f32=saturate(1.0+1.1*dot(reflection,geometricNormal));return temp*temp;}
#endif
#if defined(LODINREFLECTIONALPHA) || defined(SS_LODINREFRACTIONALPHA)
fn UNPACK_LOD(x: f32)->f32 {return (1.0-x)*255.0;}
fn getLodFromAlphaGNdotV(cubeMapDimensionPixels: f32,alphaG: f32,NdotV: f32)->f32 {var microsurfaceAverageSlope: f32=alphaG;microsurfaceAverageSlope*=sqrt(abs(NdotV));return getLodFromAlphaG(cubeMapDimensionPixels,microsurfaceAverageSlope);}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name12] = shader12;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockAlbedoOpacity.js
var name13 = "pbrBlockAlbedoOpacity";
var shader13 = `struct albedoOpacityOutParams
{surfaceAlbedo: vec3f,
alpha: f32};
#define pbr_inline
fn albedoOpacityBlock(
vAlbedoColor: vec4f
#ifdef ALBEDO
,albedoTexture: vec4f
,albedoInfos: vec2f
#endif
#ifdef OPACITY
,opacityMap: vec4f
,vOpacityInfos: vec2f
#endif
#ifdef DETAIL
,detailColor: vec4f
,vDetailInfos: vec4f
#endif
#ifdef DECAL
,decalColor: vec4f
,vDecalInfos: vec4f
#endif
)->albedoOpacityOutParams
{var outParams: albedoOpacityOutParams;var surfaceAlbedo: vec3f=vAlbedoColor.rgb;var alpha: f32=vAlbedoColor.a;
#ifdef ALBEDO
#if defined(ALPHAFROMALBEDO) || defined(ALPHATEST)
alpha*=albedoTexture.a;
#endif
#ifdef GAMMAALBEDO
surfaceAlbedo*=toLinearSpaceVec3(albedoTexture.rgb);
#else
surfaceAlbedo*=albedoTexture.rgb;
#endif
surfaceAlbedo*=albedoInfos.y;
#endif
#ifndef DECAL_AFTER_DETAIL
#include<decalFragment>
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
surfaceAlbedo*=fragmentInputs.vColor.rgb;
#endif
#ifdef DETAIL
var detailAlbedo: f32=2.0*mix(0.5,detailColor.r,vDetailInfos.y);surfaceAlbedo=surfaceAlbedo.rgb*detailAlbedo*detailAlbedo; 
#endif
#ifdef DECAL_AFTER_DETAIL
#include<decalFragment>
#endif
#define CUSTOM_FRAGMENT_UPDATE_ALBEDO
#ifdef OPACITY
#ifdef OPACITYRGB
alpha=getLuminance(opacityMap.rgb);
#else
alpha*=opacityMap.a;
#endif
alpha*=vOpacityInfos.y;
#endif
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=fragmentInputs.vColor.a;
#endif
#if !defined(SS_LINKREFRACTIONTOTRANSPARENCY) && !defined(ALPHAFRESNEL)
#ifdef ALPHATEST 
#if DEBUGMODE != 88
if (alpha<ALPHATESTVALUE) {discard;}
#endif
#ifndef ALPHABLEND
alpha=1.0;
#endif
#endif
#endif
outParams.surfaceAlbedo=surfaceAlbedo;outParams.alpha=alpha;return outParams;}
`;
ShaderStore.IncludesShadersStoreWGSL[name13] = shader13;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockReflectivity.js
var name14 = "pbrBlockReflectivity";
var shader14 = `struct reflectivityOutParams
{microSurface: f32,
roughness: f32,
surfaceReflectivityColor: vec3f,
#ifdef METALLICWORKFLOW
surfaceAlbedo: vec3f,
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
ambientOcclusionColor: vec3f,
#endif
#if DEBUGMODE>0
#ifdef METALLICWORKFLOW
metallicRoughness: vec2f,
#ifdef REFLECTIVITY
surfaceMetallicColorMap: vec4f,
#endif
#ifndef FROSTBITE_REFLECTANCE
metallicF0: vec3f,
#endif
#else
#ifdef REFLECTIVITY
surfaceReflectivityColorMap: vec4f,
#endif
#endif
#endif
};
#define pbr_inline
fn reflectivityBlock(
vReflectivityColor: vec4f
#ifdef METALLICWORKFLOW
,surfaceAlbedo: vec3f
,metallicReflectanceFactors: vec4f
#endif
#ifdef REFLECTIVITY
,reflectivityInfos: vec3f
,surfaceMetallicOrReflectivityColorMap: vec4f
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
,ambientOcclusionColorIn: vec3f
#endif
#ifdef MICROSURFACEMAP
,microSurfaceTexel: vec4f
#endif
#ifdef DETAIL
,detailColor: vec4f
,vDetailInfos: vec4f
#endif
)->reflectivityOutParams
{var outParams: reflectivityOutParams;var microSurface: f32=vReflectivityColor.a;var surfaceReflectivityColor: vec3f=vReflectivityColor.rgb;
#ifdef METALLICWORKFLOW
var metallicRoughness: vec2f=surfaceReflectivityColor.rg;
#ifdef REFLECTIVITY
#if DEBUGMODE>0
outParams.surfaceMetallicColorMap=surfaceMetallicOrReflectivityColorMap;
#endif
#ifdef AOSTOREINMETALMAPRED
var aoStoreInMetalMap: vec3f= vec3f(surfaceMetallicOrReflectivityColorMap.r,surfaceMetallicOrReflectivityColorMap.r,surfaceMetallicOrReflectivityColorMap.r);outParams.ambientOcclusionColor=mix(ambientOcclusionColorIn,aoStoreInMetalMap,reflectivityInfos.z);
#endif
#ifdef METALLNESSSTOREINMETALMAPBLUE
metallicRoughness.r*=surfaceMetallicOrReflectivityColorMap.b;
#else
metallicRoughness.r*=surfaceMetallicOrReflectivityColorMap.r;
#endif
#ifdef ROUGHNESSSTOREINMETALMAPALPHA
metallicRoughness.g*=surfaceMetallicOrReflectivityColorMap.a;
#else
#ifdef ROUGHNESSSTOREINMETALMAPGREEN
metallicRoughness.g*=surfaceMetallicOrReflectivityColorMap.g;
#endif
#endif
#endif
#ifdef DETAIL
var detailRoughness: f32=mix(0.5,detailColor.b,vDetailInfos.w);var loLerp: f32=mix(0.,metallicRoughness.g,detailRoughness*2.);var hiLerp: f32=mix(metallicRoughness.g,1.,(detailRoughness-0.5)*2.);metallicRoughness.g=mix(loLerp,hiLerp,step(detailRoughness,0.5));
#endif
#ifdef MICROSURFACEMAP
metallicRoughness.g*=microSurfaceTexel.r;
#endif
#if DEBUGMODE>0
outParams.metallicRoughness=metallicRoughness;
#endif
#define CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS
microSurface=1.0-metallicRoughness.g;var baseColor: vec3f=surfaceAlbedo;
#ifdef FROSTBITE_REFLECTANCE
outParams.surfaceAlbedo=baseColor.rgb*(1.0-metallicRoughness.r);surfaceReflectivityColor=mix(0.16*reflectance*reflectance,baseColor,metallicRoughness.r);
#else
var metallicF0: vec3f=metallicReflectanceFactors.rgb;
#if DEBUGMODE>0
outParams.metallicF0=metallicF0;
#endif
outParams.surfaceAlbedo=mix(baseColor.rgb*(1.0-metallicF0), vec3f(0.,0.,0.),metallicRoughness.r);surfaceReflectivityColor=mix(metallicF0,baseColor,metallicRoughness.r);
#endif
#else
#ifdef REFLECTIVITY
surfaceReflectivityColor*=surfaceMetallicOrReflectivityColorMap.rgb;
#if DEBUGMODE>0
outParams.surfaceReflectivityColorMap=surfaceMetallicOrReflectivityColorMap;
#endif
#ifdef MICROSURFACEFROMREFLECTIVITYMAP
microSurface*=surfaceMetallicOrReflectivityColorMap.a;microSurface*=reflectivityInfos.z;
#else
#ifdef MICROSURFACEAUTOMATIC
microSurface*=computeDefaultMicroSurface(microSurface,surfaceReflectivityColor);
#endif
#ifdef MICROSURFACEMAP
microSurface*=microSurfaceTexel.r;
#endif
#define CUSTOM_FRAGMENT_UPDATE_MICROSURFACE
#endif
#endif
#endif
microSurface=saturate(microSurface);var roughness: f32=1.-microSurface;outParams.microSurface=microSurface;outParams.roughness=roughness;outParams.surfaceReflectivityColor=surfaceReflectivityColor;return outParams;}
`;
ShaderStore.IncludesShadersStoreWGSL[name14] = shader14;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockAmbientOcclusion.js
var name15 = "pbrBlockAmbientOcclusion";
var shader15 = `struct ambientOcclusionOutParams
{ambientOcclusionColor: vec3f,
#if DEBUGMODE>0 && defined(AMBIENT)
ambientOcclusionColorMap: vec3f
#endif
};
#define pbr_inline
fn ambientOcclusionBlock(
#ifdef AMBIENT
ambientOcclusionColorMap_: vec3f,
vAmbientInfos: vec4f
#endif
)->ambientOcclusionOutParams
{ 
var outParams: ambientOcclusionOutParams;var ambientOcclusionColor: vec3f= vec3f(1.,1.,1.);
#ifdef AMBIENT
var ambientOcclusionColorMap: vec3f=ambientOcclusionColorMap_*vAmbientInfos.y;
#ifdef AMBIENTINGRAYSCALE
ambientOcclusionColorMap= vec3f(ambientOcclusionColorMap.r,ambientOcclusionColorMap.r,ambientOcclusionColorMap.r);
#endif
ambientOcclusionColor=mix(ambientOcclusionColor,ambientOcclusionColorMap,vAmbientInfos.z);
#if DEBUGMODE>0
outParams.ambientOcclusionColorMap=ambientOcclusionColorMap;
#endif
#endif
outParams.ambientOcclusionColor=ambientOcclusionColor;return outParams;}
`;
ShaderStore.IncludesShadersStoreWGSL[name15] = shader15;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockAlphaFresnel.js
var name16 = "pbrBlockAlphaFresnel";
var shader16 = `#ifdef ALPHAFRESNEL
#if defined(ALPHATEST) || defined(ALPHABLEND)
struct alphaFresnelOutParams
{alpha: f32};fn faceforward(N: vec3<f32>,I: vec3<f32>,Nref: vec3<f32>)->vec3<f32> {return select(N,-N,dot(Nref,I)>0.0);}
#define pbr_inline
fn alphaFresnelBlock(
normalW: vec3f,
viewDirectionW: vec3f,
alpha: f32,
microSurface: f32
)->alphaFresnelOutParams
{var outParams: alphaFresnelOutParams;var opacityPerceptual: f32=alpha;
#ifdef LINEARALPHAFRESNEL
var opacity0: f32=opacityPerceptual;
#else
var opacity0: f32=opacityPerceptual*opacityPerceptual;
#endif
var opacity90: f32=fresnelGrazingReflectance(opacity0);var normalForward: vec3f=faceforward(normalW,-viewDirectionW,normalW);outParams.alpha=getReflectanceFromAnalyticalBRDFLookup_Jones(saturate(dot(viewDirectionW,normalForward)), vec3f(opacity0), vec3f(opacity90),sqrt(microSurface)).x;
#ifdef ALPHATEST
if (outParams.alpha<ALPHATESTVALUE) {discard;}
#ifndef ALPHABLEND
outParams.alpha=1.0;
#endif
#endif
return outParams;}
#endif
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name16] = shader16;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockAnisotropic.js
var name17 = "pbrBlockAnisotropic";
var shader17 = `#ifdef ANISOTROPIC
struct anisotropicOutParams
{anisotropy: f32,
anisotropicTangent: vec3f,
anisotropicBitangent: vec3f,
anisotropicNormal: vec3f,
#if DEBUGMODE>0 && defined(ANISOTROPIC_TEXTURE)
anisotropyMapData: vec3f
#endif
};
#define pbr_inline
fn anisotropicBlock(
vAnisotropy: vec3f,
roughness: f32,
#ifdef ANISOTROPIC_TEXTURE
anisotropyMapData: vec3f,
#endif
TBN: mat3x3f,
normalW: vec3f,
viewDirectionW: vec3f
)->anisotropicOutParams
{ 
var outParams: anisotropicOutParams;var anisotropy: f32=vAnisotropy.b;var anisotropyDirection: vec3f= vec3f(vAnisotropy.xy,0.);
#ifdef ANISOTROPIC_TEXTURE
var amd=anisotropyMapData.rg;anisotropy*=anisotropyMapData.b;
#if DEBUGMODE>0
outParams.anisotropyMapData=anisotropyMapData;
#endif
amd=amd*2.0-1.0;
#ifdef ANISOTROPIC_LEGACY
anisotropyDirection=vec3f(anisotropyDirection.xy*amd,anisotropyDirection.z);
#else
anisotropyDirection=vec3f(mat2x2f(anisotropyDirection.x,anisotropyDirection.y,-anisotropyDirection.y,anisotropyDirection.x)*normalize(amd),anisotropyDirection.z);
#endif
#endif
var anisoTBN: mat3x3f= mat3x3f(normalize(TBN[0]),normalize(TBN[1]),normalize(TBN[2]));var anisotropicTangent: vec3f=normalize(anisoTBN*anisotropyDirection);var anisotropicBitangent: vec3f=normalize(cross(anisoTBN[2],anisotropicTangent));outParams.anisotropy=anisotropy;outParams.anisotropicTangent=anisotropicTangent;outParams.anisotropicBitangent=anisotropicBitangent;outParams.anisotropicNormal=getAnisotropicBentNormals(anisotropicTangent,anisotropicBitangent,normalW,viewDirectionW,anisotropy,roughness);return outParams;}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name17] = shader17;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockReflection.js
var name18 = "pbrBlockReflection";
var shader18 = `#ifdef REFLECTION
struct reflectionOutParams
{environmentRadiance: vec4f
,environmentIrradiance: vec3f
#ifdef REFLECTIONMAP_3D
,reflectionCoords: vec3f
#else
,reflectionCoords: vec2f
#endif
#ifdef SS_TRANSLUCENCY
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
,irradianceVector: vec3f
#endif
#endif
#endif
};
#define pbr_inline
#ifdef REFLECTIONMAP_3D
fn createReflectionCoords(
vPositionW: vec3f,
normalW: vec3f,
#ifdef ANISOTROPIC
anisotropicOut: anisotropicOutParams,
#endif
)->vec3f
{var reflectionCoords: vec3f;
#else
fn createReflectionCoords(
vPositionW: vec3f,
normalW: vec3f,
#ifdef ANISOTROPIC
anisotropicOut: anisotropicOutParams,
#endif
)->vec2f
{ 
var reflectionCoords: vec2f;
#endif
#ifdef ANISOTROPIC
var reflectionVector: vec3f=computeReflectionCoords( vec4f(vPositionW,1.0),anisotropicOut.anisotropicNormal);
#else
var reflectionVector: vec3f=computeReflectionCoords( vec4f(vPositionW,1.0),normalW);
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
#ifdef REFLECTIONMAP_3D
reflectionCoords=reflectionVector;
#else
reflectionCoords=reflectionVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
reflectionCoords/=reflectionVector.z;
#endif
reflectionCoords.y=1.0-reflectionCoords.y;
#endif
return reflectionCoords;}
#define pbr_inline
fn sampleReflectionTexture(
alphaG: f32
,vReflectionMicrosurfaceInfos: vec3f
,vReflectionInfos: vec2f
,vReflectionColor: vec3f
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
,NdotVUnclamped: f32
#endif
#ifdef LINEARSPECULARREFLECTION
,roughness: f32
#endif
#ifdef REFLECTIONMAP_3D
,reflectionSampler: texture_cube<f32>
,reflectionSamplerSampler: sampler
,reflectionCoords: vec3f
#else
,reflectionSampler: texture_2d<f32>
,reflectionSamplerSampler: sampler
,reflectionCoords: vec2f
#endif
#ifndef LODBASEDMICROSFURACE
#ifdef REFLECTIONMAP_3D
,reflectionLowSampler: texture_cube<f32>
,reflectionLowSamplerSampler: sampler
,reflectionHighSampler: texture_cube<f32>
,reflectionHighSamplerSampler: sampler
#else
,reflectionLowSampler: texture_2d<f32>
,reflectionLowSamplerSampler: sampler
,reflectionHighSampler: texture_2d<f32>
,reflectionHighSamplerSampler: sampler
#endif
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo: vec2f
#endif 
)->vec4f
{var environmentRadiance: vec4f;
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
var reflectionLOD: f32=getLodFromAlphaGNdotV(vReflectionMicrosurfaceInfos.x,alphaG,NdotVUnclamped);
#elif defined(LINEARSPECULARREFLECTION)
var reflectionLOD: f32=getLinearLodFromRoughness(vReflectionMicrosurfaceInfos.x,roughness);
#else
var reflectionLOD: f32=getLodFromAlphaG(vReflectionMicrosurfaceInfos.x,alphaG);
#endif
#ifdef LODBASEDMICROSFURACE
reflectionLOD=reflectionLOD*vReflectionMicrosurfaceInfos.y+vReflectionMicrosurfaceInfos.z;
#ifdef LODINREFLECTIONALPHA
var automaticReflectionLOD: f32=UNPACK_LOD(textureSample(reflectionSampler,reflectionSamplerSampler,reflectionCoords).a);var requestedReflectionLOD: f32=max(automaticReflectionLOD,reflectionLOD);
#else
var requestedReflectionLOD: f32=reflectionLOD;
#endif
#ifdef REALTIME_FILTERING
environmentRadiance= vec4f(radiance(alphaG,reflectionSampler,reflectionSamplerSampler,reflectionCoords,vReflectionFilteringInfo),1.0);
#else
environmentRadiance=textureSampleLevel(reflectionSampler,reflectionSamplerSampler,reflectionCoords,reflectionLOD);
#endif
#else
var lodReflectionNormalized: f32=saturate(reflectionLOD/log2(vReflectionMicrosurfaceInfos.x));var lodReflectionNormalizedDoubled: f32=lodReflectionNormalized*2.0;var environmentMid: vec4f=textureSample(reflectionSampler,reflectionSamplerSampler,reflectionCoords);if (lodReflectionNormalizedDoubled<1.0){environmentRadiance=mix(
textureSample(reflectionHighSampler,reflectionHighSamplerSampler,reflectionCoords),
environmentMid,
lodReflectionNormalizedDoubled
);} else {environmentRadiance=mix(
environmentMid,
textureSample(reflectionLowSampler,reflectionLowSamplerSampler,reflectionCoords),
lodReflectionNormalizedDoubled-1.0
);}
#endif
var envRadiance=environmentRadiance.rgb;
#ifdef RGBDREFLECTION
envRadiance=fromRGBD(environmentRadiance);
#endif
#ifdef GAMMAREFLECTION
envRadiance=toLinearSpaceVec3(environmentRadiance.rgb);
#endif
envRadiance*=vReflectionInfos.x;envRadiance*=vReflectionColor.rgb;return vec4f(envRadiance,environmentRadiance.a);}
#define pbr_inline
fn reflectionBlock(
vPositionW: vec3f
,normalW: vec3f
,alphaG: f32
,vReflectionMicrosurfaceInfos: vec3f
,vReflectionInfos: vec2f
,vReflectionColor: vec3f
#ifdef ANISOTROPIC
,anisotropicOut: anisotropicOutParams
#endif
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
,NdotVUnclamped: f32
#endif
#ifdef LINEARSPECULARREFLECTION
,roughness: f32
#endif
#ifdef REFLECTIONMAP_3D
,reflectionSampler: texture_cube<f32>
,reflectionSamplerSampler: sampler
#else
,reflectionSampler: texture_2d<f32>
,reflectionSamplerSampler: sampler
#endif
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance: vec3f
#endif
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
,reflectionMatrix: mat4x4f
#endif
#endif
#ifdef USEIRRADIANCEMAP
#ifdef REFLECTIONMAP_3D
,irradianceSampler: texture_cube<f32>
,irradianceSamplerSampler: sampler 
#else
,irradianceSampler: texture_2d<f32>
,irradianceSamplerSampler: sampler 
#endif
#endif
#ifndef LODBASEDMICROSFURACE
#ifdef REFLECTIONMAP_3D
,reflectionLowSampler: texture_cube<f32>
,reflectionLowSamplerSampler: sampler 
,reflectionHighSampler: texture_cube<f32>
,reflectionHighSamplerSampler: sampler 
#else
,reflectionLowSampler: texture_2d<f32>
,reflectionLowSamplerSampler: sampler 
,reflectionHighSampler: texture_2d<f32>
,reflectionHighSamplerSampler: sampler 
#endif
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo: vec2f
#endif
)->reflectionOutParams
{var outParams: reflectionOutParams;var environmentRadiance: vec4f= vec4f(0.,0.,0.,0.);
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f= vec3f(0.);
#else
var reflectionCoords: vec2f= vec2f(0.);
#endif
reflectionCoords=createReflectionCoords(
vPositionW,
normalW,
#ifdef ANISOTROPIC
anisotropicOut,
#endif 
);environmentRadiance=sampleReflectionTexture(
alphaG
,vReflectionMicrosurfaceInfos
,vReflectionInfos
,vReflectionColor
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
,NdotVUnclamped
#endif
#ifdef LINEARSPECULARREFLECTION
,roughness
#endif
#ifdef REFLECTIONMAP_3D
,reflectionSampler
,reflectionSamplerSampler
,reflectionCoords
#else
,reflectionSampler
,reflectionSamplerSampler
,reflectionCoords
#endif
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif 
);var environmentIrradiance: vec3f= vec3f(0.,0.,0.);
#ifdef USESPHERICALFROMREFLECTIONMAP
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
environmentIrradiance=vEnvironmentIrradiance;
#else
#ifdef ANISOTROPIC
var irradianceVector: vec3f= (reflectionMatrix* vec4f(anisotropicOut.anisotropicNormal,0)).xyz;
#else
var irradianceVector: vec3f= (reflectionMatrix* vec4f(normalW,0)).xyz;
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
irradianceVector.z*=-1.0;
#endif
#ifdef INVERTCUBICMAP
irradianceVector.y*=-1.0;
#endif
#if defined(REALTIME_FILTERING)
environmentIrradiance=irradiance(reflectionSampler,reflectionSamplerSampler,irradianceVector,vReflectionFilteringInfo);
#else
environmentIrradiance=computeEnvironmentIrradiance(irradianceVector);
#endif
#ifdef SS_TRANSLUCENCY
outParams.irradianceVector=irradianceVector;
#endif
#endif
#elif defined(USEIRRADIANCEMAP)
var environmentIrradiance4: vec4f=textureSample(irradianceSampler,irradianceSamplerSampler,reflectionCoords);environmentIrradiance=environmentIrradiance4.rgb;
#ifdef RGBDREFLECTION
environmentIrradiance=fromRGBD(environmentIrradiance4);
#endif
#ifdef GAMMAREFLECTION
environmentIrradiance=toLinearSpaceVec3(environmentIrradiance.rgb);
#endif
#endif
environmentIrradiance*=vReflectionColor.rgb;outParams.environmentRadiance=environmentRadiance;outParams.environmentIrradiance=environmentIrradiance;outParams.reflectionCoords=reflectionCoords;return outParams;}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name18] = shader18;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockSheen.js
var name19 = "pbrBlockSheen";
var shader19 = `#ifdef SHEEN
struct sheenOutParams
{sheenIntensity: f32
,sheenColor: vec3f
,sheenRoughness: f32
#ifdef SHEEN_LINKWITHALBEDO
,surfaceAlbedo: vec3f
#endif
#if defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
,sheenAlbedoScaling: f32
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
,finalSheenRadianceScaled: vec3f
#endif
#if DEBUGMODE>0
#ifdef SHEEN_TEXTURE
,sheenMapData: vec4f
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
,sheenEnvironmentReflectance: vec3f
#endif
#endif
};
#define pbr_inline
fn sheenBlock(
vSheenColor: vec4f
#ifdef SHEEN_ROUGHNESS
,vSheenRoughness: f32
#if defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)
,sheenMapRoughnessData: vec4f
#endif
#endif
,roughness: f32
#ifdef SHEEN_TEXTURE
,sheenMapData: vec4f
,sheenMapLevel: f32
#endif
,reflectance: f32
#ifdef SHEEN_LINKWITHALBEDO
,baseColor: vec3f
,surfaceAlbedo: vec3f
#endif
#ifdef ENVIRONMENTBRDF
,NdotV: f32
,environmentBrdf: vec3f
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
,AARoughnessFactors: vec2f
,vReflectionMicrosurfaceInfos: vec3f
,vReflectionInfos: vec2f
,vReflectionColor: vec3f
,vLightingIntensity: vec4f
#ifdef REFLECTIONMAP_3D
,reflectionSampler: texture_cube<f32>
,reflectionSamplerSampler: sampler
,reflectionCoords: vec3f
#else
,reflectionSampler: texture_2d<f32>
,reflectionSamplerSampler: sampler
,reflectionCoords: vec2f
#endif
,NdotVUnclamped: f32
#ifndef LODBASEDMICROSFURACE
#ifdef REFLECTIONMAP_3D
,reflectionLowSampler: texture_cube<f32>
,reflectionLowSamplerSampler: sampler 
,reflectionHighSampler: texture_cube<f32>
,reflectionHighSamplerSampler: sampler 
#else
,reflectionLowSampler: texture_2d<f32>
,reflectionLowSamplerSampler: sampler 
,reflectionHighSampler: texture_2d<f32>
,reflectionHighSamplerSampler: sampler 
#endif
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo: vec2f
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)
,seo: f32
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
,eho: f32
#endif
#endif
)->sheenOutParams
{var outParams: sheenOutParams;var sheenIntensity: f32=vSheenColor.a;
#ifdef SHEEN_TEXTURE
#if DEBUGMODE>0
outParams.sheenMapData=sheenMapData;
#endif
#endif
#ifdef SHEEN_LINKWITHALBEDO
var sheenFactor: f32=pow5(1.0-sheenIntensity);var sheenColor: vec3f=baseColor.rgb*(1.0-sheenFactor);var sheenRoughness: f32=sheenIntensity;outParams.surfaceAlbedo=surfaceAlbedo*sheenFactor;
#ifdef SHEEN_TEXTURE
sheenIntensity*=sheenMapData.a;
#endif
#else
var sheenColor: vec3f=vSheenColor.rgb;
#ifdef SHEEN_TEXTURE
#ifdef SHEEN_GAMMATEXTURE
sheenColor*=toLinearSpaceVec3(sheenMapData.rgb);
#else
sheenColor*=sheenMapData.rgb;
#endif
sheenColor*=sheenMapLevel;
#endif
#ifdef SHEEN_ROUGHNESS
var sheenRoughness: f32=vSheenRoughness;
#ifdef SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE
#if defined(SHEEN_TEXTURE)
sheenRoughness*=sheenMapData.a;
#endif
#elif defined(SHEEN_TEXTURE_ROUGHNESS)
sheenRoughness*=sheenMapRoughnessData.a;
#endif
#else
var sheenRoughness: f32=roughness;
#ifdef SHEEN_TEXTURE
sheenIntensity*=sheenMapData.a;
#endif
#endif
#if !defined(SHEEN_ALBEDOSCALING)
sheenIntensity*=(1.-reflectance);
#endif
sheenColor*=sheenIntensity;
#endif
#ifdef ENVIRONMENTBRDF
/*#ifdef SHEEN_SOFTER
var environmentSheenBrdf: vec3f= vec3f(0.,0.,getBRDFLookupCharlieSheen(NdotV,sheenRoughness));
#else*/
#ifdef SHEEN_ROUGHNESS
var environmentSheenBrdf: vec3f=getBRDFLookup(NdotV,sheenRoughness);
#else
var environmentSheenBrdf: vec3f=environmentBrdf;
#endif
/*#endif*/
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
var sheenAlphaG: f32=convertRoughnessToAverageSlope(sheenRoughness);
#ifdef SPECULARAA
sheenAlphaG+=AARoughnessFactors.y;
#endif
var environmentSheenRadiance: vec4f= vec4f(0.,0.,0.,0.);environmentSheenRadiance=sampleReflectionTexture(
sheenAlphaG
,vReflectionMicrosurfaceInfos
,vReflectionInfos
,vReflectionColor
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
,NdotVUnclamped
#endif
#ifdef LINEARSPECULARREFLECTION
,sheenRoughness
#endif
,reflectionSampler
,reflectionSamplerSampler
,reflectionCoords
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);var sheenEnvironmentReflectance: vec3f=getSheenReflectanceFromBRDFLookup(sheenColor,environmentSheenBrdf);
#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)
sheenEnvironmentReflectance*=seo;
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
sheenEnvironmentReflectance*=eho;
#endif
#if DEBUGMODE>0
outParams.sheenEnvironmentReflectance=sheenEnvironmentReflectance;
#endif
outParams.finalSheenRadianceScaled=
environmentSheenRadiance.rgb *
sheenEnvironmentReflectance *
vLightingIntensity.z;
#endif
#if defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
outParams.sheenAlbedoScaling=1.0-sheenIntensity*max(max(sheenColor.r,sheenColor.g),sheenColor.b)*environmentSheenBrdf.b;
#endif
outParams.sheenIntensity=sheenIntensity;outParams.sheenColor=sheenColor;outParams.sheenRoughness=sheenRoughness;return outParams;}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name19] = shader19;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockClearcoat.js
var name20 = "pbrBlockClearcoat";
var shader20 = `struct clearcoatOutParams
{specularEnvironmentR0: vec3f,
conservationFactor: f32,
clearCoatNormalW: vec3f,
clearCoatAARoughnessFactors: vec2f,
clearCoatIntensity: f32,
clearCoatRoughness: f32,
#ifdef REFLECTION
finalClearCoatRadianceScaled: vec3f,
#endif
#ifdef CLEARCOAT_TINT
absorption: vec3f,
clearCoatNdotVRefract: f32,
clearCoatColor: vec3f,
clearCoatThickness: f32,
#endif
#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)
energyConservationFactorClearCoat: vec3f,
#endif
#if DEBUGMODE>0
#ifdef CLEARCOAT_BUMP
TBNClearCoat: mat3x3f,
#endif
#ifdef CLEARCOAT_TEXTURE
clearCoatMapData: vec2f,
#endif
#if defined(CLEARCOAT_TINT) && defined(CLEARCOAT_TINT_TEXTURE)
clearCoatTintMapData: vec4f,
#endif
#ifdef REFLECTION
environmentClearCoatRadiance: vec4f,
clearCoatEnvironmentReflectance: vec3f,
#endif
clearCoatNdotV: f32
#endif
};
#ifdef CLEARCOAT
#define pbr_inline
fn clearcoatBlock(
vPositionW: vec3f
,geometricNormalW: vec3f
,viewDirectionW: vec3f
,vClearCoatParams: vec2f
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
,clearCoatMapRoughnessData: vec4f
#endif
,specularEnvironmentR0: vec3f
#ifdef CLEARCOAT_TEXTURE
,clearCoatMapData: vec2f
#endif
#ifdef CLEARCOAT_TINT
,vClearCoatTintParams: vec4f
,clearCoatColorAtDistance: f32
,vClearCoatRefractionParams: vec4f
#ifdef CLEARCOAT_TINT_TEXTURE
,clearCoatTintMapData: vec4f
#endif
#endif
#ifdef CLEARCOAT_BUMP
,vClearCoatBumpInfos: vec2f
,clearCoatBumpMapData: vec4f
,vClearCoatBumpUV: vec2f
#if defined(TANGENT) && defined(NORMAL)
,vTBN: mat3x3f
#else
,vClearCoatTangentSpaceParams: vec2f
#endif
#ifdef OBJECTSPACE_NORMALMAP
,normalMatrix: mat4x4f
#endif
#endif
#if defined(FORCENORMALFORWARD) && defined(NORMAL)
,faceNormal: vec3f
#endif
#ifdef REFLECTION
,vReflectionMicrosurfaceInfos: vec3f
,vReflectionInfos: vec2f
,vReflectionColor: vec3f
,vLightingIntensity: vec4f
#ifdef REFLECTIONMAP_3D
,reflectionSampler: texture_cube<f32>
,reflectionSamplerSampler: sampler
#else
,reflectionSampler: texture_2d<f32>
,reflectionSamplerSampler: sampler
#endif
#ifndef LODBASEDMICROSFURACE
#ifdef REFLECTIONMAP_3D
,reflectionLowSampler: texture_cube<f32>
,reflectionLowSamplerSampler: sampler 
,reflectionHighSampler: texture_cube<f32>
,reflectionHighSamplerSampler: sampler 
#else
,reflectionLowSampler: texture_2d<f32>
,reflectionLowSamplerSampler: sampler 
,reflectionHighSampler: texture_2d<f32>
,reflectionHighSamplerSampler: sampler 
#endif
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo: vec2f
#endif
#endif
#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
#ifdef RADIANCEOCCLUSION
,ambientMonochrome: f32
#endif
#endif
#if defined(CLEARCOAT_BUMP) || defined(TWOSIDEDLIGHTING)
,frontFacingMultiplier: f32
#endif 
)->clearcoatOutParams
{var outParams: clearcoatOutParams;var clearCoatIntensity: f32=vClearCoatParams.x;var clearCoatRoughness: f32=vClearCoatParams.y;
#ifdef CLEARCOAT_TEXTURE
clearCoatIntensity*=clearCoatMapData.x;
#ifdef CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE
clearCoatRoughness*=clearCoatMapData.y;
#endif
#if DEBUGMODE>0
outParams.clearCoatMapData=clearCoatMapData;
#endif
#endif
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
clearCoatRoughness*=clearCoatMapRoughnessData.y;
#endif
outParams.clearCoatIntensity=clearCoatIntensity;outParams.clearCoatRoughness=clearCoatRoughness;
#ifdef CLEARCOAT_TINT
var clearCoatColor: vec3f=vClearCoatTintParams.rgb;var clearCoatThickness: f32=vClearCoatTintParams.a;
#ifdef CLEARCOAT_TINT_TEXTURE
#ifdef CLEARCOAT_TINT_GAMMATEXTURE
clearCoatColor*=toLinearSpaceVec3(clearCoatTintMapData.rgb);
#else
clearCoatColor*=clearCoatTintMapData.rgb;
#endif
clearCoatThickness*=clearCoatTintMapData.a;
#if DEBUGMODE>0
outParams.clearCoatTintMapData=clearCoatTintMapData;
#endif
#endif
outParams.clearCoatColor=computeColorAtDistanceInMedia(clearCoatColor,clearCoatColorAtDistance);outParams.clearCoatThickness=clearCoatThickness;
#endif
#ifdef CLEARCOAT_REMAP_F0
var specularEnvironmentR0Updated: vec3f=getR0RemappedForClearCoat(specularEnvironmentR0);
#else
var specularEnvironmentR0Updated: vec3f=specularEnvironmentR0;
#endif
outParams.specularEnvironmentR0=mix(specularEnvironmentR0,specularEnvironmentR0Updated,clearCoatIntensity);var clearCoatNormalW: vec3f=geometricNormalW;
#ifdef CLEARCOAT_BUMP
#ifdef NORMALXYSCALE
var clearCoatNormalScale: f32=1.0;
#else
var clearCoatNormalScale: f32=vClearCoatBumpInfos.y;
#endif
#if defined(TANGENT) && defined(NORMAL)
var TBNClearCoat: mat3x3f=vTBN;
#else
var TBNClearCoatUV: vec2f=vClearCoatBumpUV*frontFacingMultiplier;var TBNClearCoat: mat3x3f=cotangent_frame(clearCoatNormalW*clearCoatNormalScale,vPositionW,TBNClearCoatUV,vClearCoatTangentSpaceParams);
#endif
#if DEBUGMODE>0
outParams.TBNClearCoat=TBNClearCoat;
#endif
#ifdef OBJECTSPACE_NORMALMAP
clearCoatNormalW=normalize(clearCoatBumpMapData.xyz *2.0-1.0);clearCoatNormalW=normalize( mat3x3f(normalMatrix[0].xyz,normalMatrix[1].xyz,normalMatrix[2].xyz)*clearCoatNormalW);
#else
clearCoatNormalW=perturbNormal(TBNClearCoat,clearCoatBumpMapData.xyz,vClearCoatBumpInfos.y);
#endif
#endif
#if defined(FORCENORMALFORWARD) && defined(NORMAL)
clearCoatNormalW*=sign(dot(clearCoatNormalW,faceNormal));
#endif
#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)
clearCoatNormalW=clearCoatNormalW*frontFacingMultiplier;
#endif
outParams.clearCoatNormalW=clearCoatNormalW;outParams.clearCoatAARoughnessFactors=getAARoughnessFactors(clearCoatNormalW.xyz);var clearCoatNdotVUnclamped: f32=dot(clearCoatNormalW,viewDirectionW);var clearCoatNdotV: f32=absEps(clearCoatNdotVUnclamped);
#if DEBUGMODE>0
outParams.clearCoatNdotV=clearCoatNdotV;
#endif
#ifdef CLEARCOAT_TINT
var clearCoatVRefract: vec3f=refract(-viewDirectionW,clearCoatNormalW,vClearCoatRefractionParams.y);outParams.clearCoatNdotVRefract=absEps(dot(clearCoatNormalW,clearCoatVRefract));
#endif
#if defined(ENVIRONMENTBRDF) && (!defined(REFLECTIONMAP_SKYBOX) || defined(MS_BRDF_ENERGY_CONSERVATION))
var environmentClearCoatBrdf: vec3f=getBRDFLookup(clearCoatNdotV,clearCoatRoughness);
#endif
#if defined(REFLECTION)
var clearCoatAlphaG: f32=convertRoughnessToAverageSlope(clearCoatRoughness);
#ifdef SPECULARAA
clearCoatAlphaG+=outParams.clearCoatAARoughnessFactors.y;
#endif
var environmentClearCoatRadiance: vec4f= vec4f(0.,0.,0.,0.);var clearCoatReflectionVector: vec3f=computeReflectionCoords( vec4f(vPositionW,1.0),clearCoatNormalW);
#ifdef REFLECTIONMAP_OPPOSITEZ
clearCoatReflectionVector.z*=-1.0;
#endif
#ifdef REFLECTIONMAP_3D
var clearCoatReflectionCoords: vec3f=clearCoatReflectionVector;
#else
var clearCoatReflectionCoords: vec2f=clearCoatReflectionVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
clearCoatReflectionCoords/=clearCoatReflectionVector.z;
#endif
clearCoatReflectionCoords.y=1.0-clearCoatReflectionCoords.y;
#endif
environmentClearCoatRadiance=sampleReflectionTexture(
clearCoatAlphaG
,vReflectionMicrosurfaceInfos
,vReflectionInfos
,vReflectionColor
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
,clearCoatNdotVUnclamped
#endif
#ifdef LINEARSPECULARREFLECTION
,clearCoatRoughness
#endif
,reflectionSampler
,reflectionSamplerSampler
,clearCoatReflectionCoords
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif 
);
#if DEBUGMODE>0
outParams.environmentClearCoatRadiance=environmentClearCoatRadiance;
#endif
#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
var clearCoatEnvironmentReflectance: vec3f=getReflectanceFromBRDFLookup(vec3f(uniforms.vClearCoatRefractionParams.x),environmentClearCoatBrdf);
#ifdef HORIZONOCCLUSION
#ifdef BUMP
#ifdef REFLECTIONMAP_3D
var clearCoatEho: f32=environmentHorizonOcclusion(-viewDirectionW,clearCoatNormalW,geometricNormalW);clearCoatEnvironmentReflectance*=clearCoatEho;
#endif
#endif
#endif
#else
var clearCoatEnvironmentReflectance: vec3f=getReflectanceFromAnalyticalBRDFLookup_Jones(clearCoatNdotV, vec3f(1.), vec3f(1.),sqrt(1.-clearCoatRoughness));
#endif
clearCoatEnvironmentReflectance*=clearCoatIntensity;
#if DEBUGMODE>0
outParams.clearCoatEnvironmentReflectance=clearCoatEnvironmentReflectance;
#endif
outParams.finalClearCoatRadianceScaled=
environmentClearCoatRadiance.rgb *
clearCoatEnvironmentReflectance *
vLightingIntensity.z;
#endif
#if defined(CLEARCOAT_TINT)
outParams.absorption=computeClearCoatAbsorption(outParams.clearCoatNdotVRefract,outParams.clearCoatNdotVRefract,outParams.clearCoatColor,clearCoatThickness,clearCoatIntensity);
#endif
var fresnelIBLClearCoat: f32=fresnelSchlickGGX(clearCoatNdotV,uniforms.vClearCoatRefractionParams.x,CLEARCOATREFLECTANCE90);fresnelIBLClearCoat*=clearCoatIntensity;outParams.conservationFactor=(1.-fresnelIBLClearCoat);
#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)
outParams.energyConservationFactorClearCoat=getEnergyConservationFactor(outParams.specularEnvironmentR0,environmentClearCoatBrdf);
#endif
return outParams;}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name20] = shader20;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockIridescence.js
var name21 = "pbrBlockIridescence";
var shader21 = `struct iridescenceOutParams
{iridescenceIntensity: f32,
iridescenceIOR: f32,
iridescenceThickness: f32,
specularEnvironmentR0: vec3f};
#ifdef IRIDESCENCE
fn iridescenceBlock(
vIridescenceParams: vec4f
,viewAngle: f32
,specularEnvironmentR0: vec3f
#ifdef IRIDESCENCE_TEXTURE
,iridescenceMapData: vec2f
#endif
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
,iridescenceThicknessMapData: vec2f
#endif
#ifdef CLEARCOAT
,NdotVUnclamped: f32
#ifdef CLEARCOAT_TEXTURE
,clearCoatMapData: vec2f
#endif
#endif
)->iridescenceOutParams
{var outParams: iridescenceOutParams;var iridescenceIntensity: f32=vIridescenceParams.x;var iridescenceIOR: f32=vIridescenceParams.y;var iridescenceThicknessMin: f32=vIridescenceParams.z;var iridescenceThicknessMax: f32=vIridescenceParams.w;var iridescenceThicknessWeight: f32=1.;
#ifdef IRIDESCENCE_TEXTURE
iridescenceIntensity*=iridescenceMapData.x;
#endif
#if defined(IRIDESCENCE_THICKNESS_TEXTURE)
iridescenceThicknessWeight=iridescenceThicknessMapData.g;
#endif
var iridescenceThickness: f32=mix(iridescenceThicknessMin,iridescenceThicknessMax,iridescenceThicknessWeight);var topIor: f32=1.; 
#ifdef CLEARCOAT
var clearCoatIntensity: f32=vClearCoatParams.x;
#ifdef CLEARCOAT_TEXTURE
clearCoatIntensity*=clearCoatMapData.x;
#endif
topIor=mix(1.0,uniforms.vClearCoatRefractionParams.w-1.,clearCoatIntensity);viewAngle=sqrt(1.0+((1.0/topIor)*(1.0/topIor))*((NdotVUnclamped*NdotVUnclamped)-1.0));
#endif
var iridescenceFresnel: vec3f=evalIridescence(topIor,iridescenceIOR,viewAngle,iridescenceThickness,specularEnvironmentR0);outParams.specularEnvironmentR0=mix(specularEnvironmentR0,iridescenceFresnel,iridescenceIntensity);outParams.iridescenceIntensity=iridescenceIntensity;outParams.iridescenceThickness=iridescenceThickness;outParams.iridescenceIOR=iridescenceIOR;return outParams;}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name21] = shader21;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockSubSurface.js
var name22 = "pbrBlockSubSurface";
var shader22 = `struct subSurfaceOutParams
{specularEnvironmentReflectance: vec3f,
#ifdef SS_REFRACTION
finalRefraction: vec3f,
surfaceAlbedo: vec3f,
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
alpha: f32,
#endif
#ifdef REFLECTION
refractionFactorForIrradiance: f32,
#endif
#endif
#ifdef SS_TRANSLUCENCY
transmittance: vec3f,
translucencyIntensity: f32,
#ifdef REFLECTION
refractionIrradiance: vec3f,
#endif
#endif
#if DEBUGMODE>0
#ifdef SS_THICKNESSANDMASK_TEXTURE
thicknessMap: vec4f,
#endif
#ifdef SS_REFRACTION
environmentRefraction: vec4f,
refractionTransmittance: vec3f
#endif
#endif
};
#ifdef SUBSURFACE
#ifdef SS_REFRACTION
#define pbr_inline
fn sampleEnvironmentRefraction(
ior: f32
,thickness: f32
,refractionLOD: f32
,normalW: vec3f
,vPositionW: vec3f
,viewDirectionW: vec3f
,view: mat4x4f
,vRefractionInfos: vec4f
,refractionMatrix: mat4x4f
,vRefractionMicrosurfaceInfos: vec4f
,alphaG: f32
#ifdef SS_REFRACTIONMAP_3D
,refractionSampler: texture_cube<f32>
,refractionSamplerSampler: sampler
#ifndef LODBASEDMICROSFURACE
,refractionLowSampler: texture_cube<f32>
,refractionLowSamplerSampler: sampler
,refractionHighSampler: texture_cube<f32>
,refractionHighSamplerSampler: sampler 
#endif
#else
,refractionSampler: texture_2d<f32>
,refractionSamplerSampler: sampler
#ifndef LODBASEDMICROSFURACE
,refractionLowSampler: texture_2d<f32>
,refractionLowSamplerSampler: sampler
,refractionHighSampler: texture_2d<f32>
,refractionHighSamplerSampler: sampler 
#endif
#endif
#ifdef ANISOTROPIC
,anisotropicOut: anisotropicOutParams
#endif
#ifdef REALTIME_FILTERING
,vRefractionFilteringInfo: vec2f
#endif
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
,refractionPosition: vec3f
,refractionSize: vec3f
#endif
)->vec4f {var environmentRefraction: vec4f= vec4f(0.,0.,0.,0.);
#ifdef ANISOTROPIC
var refractionVector: vec3f=refract(-viewDirectionW,anisotropicOut.anisotropicNormal,ior);
#else
var refractionVector: vec3f=refract(-viewDirectionW,normalW,ior);
#endif
#ifdef SS_REFRACTIONMAP_OPPOSITEZ
refractionVector.z*=-1.0;
#endif
#ifdef SS_REFRACTIONMAP_3D
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
refractionVector=parallaxCorrectNormal(vPositionW,refractionVector,refractionSize,refractionPosition);
#endif
refractionVector.y=refractionVector.y*vRefractionInfos.w;var refractionCoords: vec3f=refractionVector;refractionCoords= (refractionMatrix* vec4f(refractionCoords,0)).xyz;
#else
#ifdef SS_USE_THICKNESS_AS_DEPTH
var vRefractionUVW: vec3f= (refractionMatrix*(view* vec4f(vPositionW+refractionVector*thickness,1.0))).xyz;
#else
var vRefractionUVW: vec3f= (refractionMatrix*(view* vec4f(vPositionW+refractionVector*vRefractionInfos.z,1.0))).xyz;
#endif
var refractionCoords: vec2f=vRefractionUVW.xy/vRefractionUVW.z;refractionCoords.y=1.0-refractionCoords.y;
#endif
#ifdef LODBASEDMICROSFURACE
var lod=refractionLOD*vRefractionMicrosurfaceInfos.y+vRefractionMicrosurfaceInfos.z;
#ifdef SS_LODINREFRACTIONALPHA
var automaticRefractionLOD: f32=UNPACK_LOD(textureSample(refractionSampler,refractionSamplerSampler,refractionCoords).a);var requestedRefractionLOD: f32=max(automaticRefractionLOD,lod);
#else
var requestedRefractionLOD: f32=lod;
#endif
#if defined(REALTIME_FILTERING) && defined(SS_REFRACTIONMAP_3D)
environmentRefraction= vec4f(radiance(alphaG,refractionSampler,refractionSamplerSampler,refractionCoords,vRefractionFilteringInfo),1.0);
#else
environmentRefraction=textureSampleLevel(refractionSampler,refractionSamplerSampler,refractionCoords,requestedRefractionLOD);
#endif
#else
var lodRefractionNormalized: f32=saturate(refractionLOD/log2(vRefractionMicrosurfaceInfos.x));var lodRefractionNormalizedDoubled: f32=lodRefractionNormalized*2.0;var environmentRefractionMid: vec4f=textureSample(refractionSampler,refractionSamplerSampler,refractionCoords);if (lodRefractionNormalizedDoubled<1.0){environmentRefraction=mix(
textureSample(refractionHighSampler,refractionHighSamplerSampler,refractionCoords),
environmentRefractionMid,
lodRefractionNormalizedDoubled
);} else {environmentRefraction=mix(
environmentRefractionMid,
textureSample(refractionLowSampler,refractionLowSamplerSampler,refractionCoords),
lodRefractionNormalizedDoubled-1.0
);}
#endif
var refraction=environmentRefraction.rgb;
#ifdef SS_RGBDREFRACTION
refraction=fromRGBD(environmentRefraction);
#endif
#ifdef SS_GAMMAREFRACTION
refraction=toLinearSpaceVec3(environmentRefraction.rgb);
#endif
return vec4f(refraction,environmentRefraction.a);}
#endif
#define pbr_inline
fn subSurfaceBlock(
vSubSurfaceIntensity: vec3f
,vThicknessParam: vec2f
,vTintColor: vec4f
,normalW: vec3f
,specularEnvironmentReflectance: vec3f
#ifdef SS_THICKNESSANDMASK_TEXTURE
,thicknessMap: vec4f
#endif
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
,refractionIntensityMap: vec4f
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
,translucencyIntensityMap: vec4f
#endif
#ifdef REFLECTION
#ifdef SS_TRANSLUCENCY
,reflectionMatrix: mat4x4f
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
,irradianceVector_: vec3f
#endif
#if defined(REALTIME_FILTERING)
,reflectionSampler: texture_cube<f32>
,reflectionSamplerSampler: sampler
,vReflectionFilteringInfo: vec2f
#endif
#endif
#ifdef USEIRRADIANCEMAP
#ifdef REFLECTIONMAP_3D
,irradianceSampler: texture_cube<f32>
,irradianceSamplerSampler: sampler
#else
,irradianceSampler: texture_2d<f32>
,irradianceSamplerSampler: sampler
#endif
#endif
#endif
#endif
#if defined(SS_REFRACTION) || defined(SS_TRANSLUCENCY)
,surfaceAlbedo: vec3f
#endif
#ifdef SS_REFRACTION
,vPositionW: vec3f
,viewDirectionW: vec3f
,view: mat4x4f
,vRefractionInfos: vec4f
,refractionMatrix: mat4x4f
,vRefractionMicrosurfaceInfos: vec4f
,vLightingIntensity: vec4f
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
,alpha: f32
#endif
#ifdef SS_LODINREFRACTIONALPHA
,NdotVUnclamped: f32
#endif
#ifdef SS_LINEARSPECULARREFRACTION
,roughness: f32
#endif
,alphaG: f32
#ifdef SS_REFRACTIONMAP_3D
,refractionSampler: texture_cube<f32>
,refractionSamplerSampler: sampler
#ifndef LODBASEDMICROSFURACE
,refractionLowSampler: texture_cube<f32>
,refractionLowSamplerSampler: sampler
,refractionHighSampler: texture_cube<f32>
,refractionHighSamplerSampler: sampler 
#endif
#else
,refractionSampler: texture_2d<f32>
,refractionSamplerSampler: sampler
#ifndef LODBASEDMICROSFURACE
,refractionLowSampler: texture_2d<f32>
,refractionLowSamplerSampler: sampler
,refractionHighSampler: texture_2d<f32>
,refractionHighSamplerSampler: sampler 
#endif
#endif
#ifdef ANISOTROPIC
,anisotropicOut: anisotropicOutParams
#endif
#ifdef REALTIME_FILTERING
,vRefractionFilteringInfo: vec2f
#endif
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
,refractionPosition: vec3f
,refractionSize: vec3f
#endif
#ifdef SS_DISPERSION
,dispersion: f32
#endif
#endif
#ifdef SS_TRANSLUCENCY
,vDiffusionDistance: vec3f
,vTranslucencyColor: vec4f
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
,translucencyColorMap: vec4f
#endif
#endif
)->subSurfaceOutParams
{var outParams: subSurfaceOutParams;outParams.specularEnvironmentReflectance=specularEnvironmentReflectance;
#ifdef SS_REFRACTION
var refractionIntensity: f32=vSubSurfaceIntensity.x;
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
refractionIntensity*=(1.0-alpha);outParams.alpha=1.0;
#endif
#endif
#ifdef SS_TRANSLUCENCY
var translucencyIntensity: f32=vSubSurfaceIntensity.y;
#endif
#ifdef SS_THICKNESSANDMASK_TEXTURE
#ifdef SS_USE_GLTF_TEXTURES
var thickness: f32=thicknessMap.g*vThicknessParam.y+vThicknessParam.x;
#else
var thickness: f32=thicknessMap.r*vThicknessParam.y+vThicknessParam.x;
#endif
#if DEBUGMODE>0
outParams.thicknessMap=thicknessMap;
#endif
#if defined(SS_REFRACTION) && defined(SS_REFRACTION_USE_INTENSITY_FROM_THICKNESS)
#ifdef SS_USE_GLTF_TEXTURES
refractionIntensity*=thicknessMap.r;
#else
refractionIntensity*=thicknessMap.g;
#endif
#endif
#if defined(SS_TRANSLUCENCY) && defined(SS_TRANSLUCENCY_USE_INTENSITY_FROM_THICKNESS)
#ifdef SS_USE_GLTF_TEXTURES
translucencyIntensity*=thicknessMap.a;
#else
translucencyIntensity*=thicknessMap.b;
#endif
#endif
#else
var thickness: f32=vThicknessParam.y;
#endif
#if defined(SS_REFRACTION) && defined(SS_REFRACTIONINTENSITY_TEXTURE)
#ifdef SS_USE_GLTF_TEXTURES
refractionIntensity*=refractionIntensityMap.r;
#else
refractionIntensity*=refractionIntensityMap.g;
#endif
#endif
#if defined(SS_TRANSLUCENCY) && defined(SS_TRANSLUCENCYINTENSITY_TEXTURE)
#ifdef SS_USE_GLTF_TEXTURES
translucencyIntensity*=translucencyIntensityMap.a;
#else
translucencyIntensity*=translucencyIntensityMap.b;
#endif
#endif
#ifdef SS_TRANSLUCENCY
thickness=maxEps(thickness);var translucencyColor: vec4f=vTranslucencyColor;
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
translucencyColor*=translucencyColorMap;
#endif
var transmittance: vec3f=transmittanceBRDF_Burley(translucencyColor.rgb,vDiffusionDistance,thickness);transmittance*=translucencyIntensity;outParams.transmittance=transmittance;outParams.translucencyIntensity=translucencyIntensity;
#endif
#ifdef SS_REFRACTION
var environmentRefraction: vec4f= vec4f(0.,0.,0.,0.);
#ifdef SS_HAS_THICKNESS
var ior: f32=vRefractionInfos.y;
#else
var ior: f32=vRefractionMicrosurfaceInfos.w;
#endif
#ifdef SS_LODINREFRACTIONALPHA
var refractionAlphaG: f32=alphaG;refractionAlphaG=mix(alphaG,0.0,clamp(ior*3.0-2.0,0.0,1.0));var refractionLOD: f32=getLodFromAlphaGNdotV(vRefractionMicrosurfaceInfos.x,refractionAlphaG,NdotVUnclamped);
#elif defined(SS_LINEARSPECULARREFRACTION)
var refractionRoughness: f32=alphaG;refractionRoughness=mix(alphaG,0.0,clamp(ior*3.0-2.0,0.0,1.0));var refractionLOD: f32=getLinearLodFromRoughness(vRefractionMicrosurfaceInfos.x,refractionRoughness);
#else
var refractionAlphaG: f32=alphaG;refractionAlphaG=mix(alphaG,0.0,clamp(ior*3.0-2.0,0.0,1.0));var refractionLOD: f32=getLodFromAlphaG(vRefractionMicrosurfaceInfos.x,refractionAlphaG);
#endif
var refraction_ior: f32=vRefractionInfos.y;
#ifdef SS_DISPERSION
var realIOR: f32=1.0/refraction_ior;var iorDispersionSpread: f32=0.04*dispersion*(realIOR-1.0);var iors: vec3f= vec3f(1.0/(realIOR-iorDispersionSpread),refraction_ior,1.0/(realIOR+iorDispersionSpread));for (var i: i32=0; i<3; i++) {refraction_ior=iors[i];
#endif
var envSample: vec4f=sampleEnvironmentRefraction(refraction_ior,thickness,refractionLOD,normalW,vPositionW,viewDirectionW,view,vRefractionInfos,refractionMatrix,vRefractionMicrosurfaceInfos,alphaG
#ifdef SS_REFRACTIONMAP_3D
,refractionSampler
,refractionSamplerSampler
#ifndef LODBASEDMICROSFURACE
,refractionLowSampler
,refractionLowSamplerSampler
,refractionHighSampler
,refractionHighSamplerSampler
#endif
#else
,refractionSampler
,refractionSamplerSampler
#ifndef LODBASEDMICROSFURACE
,refractionLowSampler
,refractionLowSamplerSampler
,refractionHighSampler
,refractionHighSamplerSampler
#endif
#endif
#ifdef ANISOTROPIC
,anisotropicOut
#endif
#ifdef REALTIME_FILTERING
,vRefractionFilteringInfo
#endif
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
,refractionPosition
,refractionSize
#endif
);
#ifdef SS_DISPERSION
environmentRefraction[i]=envSample[i];}
#else
environmentRefraction=envSample;
#endif
environmentRefraction=vec4f(environmentRefraction.rgb*vRefractionInfos.x,environmentRefraction.a);
#endif
#ifdef SS_REFRACTION
var refractionTransmittance: vec3f= vec3f(refractionIntensity);
#ifdef SS_THICKNESSANDMASK_TEXTURE
var volumeAlbedo: vec3f=computeColorAtDistanceInMedia(vTintColor.rgb,vTintColor.w);refractionTransmittance*=cocaLambertVec3(volumeAlbedo,thickness);
#elif defined(SS_LINKREFRACTIONTOTRANSPARENCY)
var maxChannel: f32=max(max(surfaceAlbedo.r,surfaceAlbedo.g),surfaceAlbedo.b);var volumeAlbedo: vec3f=saturateVec3(maxChannel*surfaceAlbedo);environmentRefraction=vec4f(environmentRefraction.rgb*volumeAlbedo,environmentRefraction.a);
#else
var volumeAlbedo: vec3f=computeColorAtDistanceInMedia(vTintColor.rgb,vTintColor.w);refractionTransmittance*=cocaLambertVec3(volumeAlbedo,vThicknessParam.y);
#endif
#ifdef SS_ALBEDOFORREFRACTIONTINT
environmentRefraction=vec4f(environmentRefraction.rgb*surfaceAlbedo.rgb,environmentRefraction.a);
#endif
outParams.surfaceAlbedo=surfaceAlbedo*(1.-refractionIntensity);
#ifdef REFLECTION
outParams.refractionFactorForIrradiance=(1.-refractionIntensity);
#endif
#ifdef UNUSED_MULTIPLEBOUNCES
var bounceSpecularEnvironmentReflectance: vec3f=(2.0*specularEnvironmentReflectance)/(1.0+specularEnvironmentReflectance);outParams.specularEnvironmentReflectance=mix(bounceSpecularEnvironmentReflectance,specularEnvironmentReflectance,refractionIntensity);
#endif
refractionTransmittance*=1.0-outParams.specularEnvironmentReflectance;
#if DEBUGMODE>0
outParams.refractionTransmittance=refractionTransmittance;
#endif
outParams.finalRefraction=environmentRefraction.rgb*refractionTransmittance*vLightingIntensity.z;
#if DEBUGMODE>0
outParams.environmentRefraction=environmentRefraction;
#endif
#endif
#if defined(REFLECTION) && defined(SS_TRANSLUCENCY)
#if defined(NORMAL) && defined(USESPHERICALINVERTEX) || !defined(USESPHERICALFROMREFLECTIONMAP)
var irradianceVector: vec3f= (reflectionMatrix* vec4f(normalW,0)).xyz;
#ifdef REFLECTIONMAP_OPPOSITEZ
irradianceVector.z*=-1.0;
#endif
#ifdef INVERTCUBICMAP
irradianceVector.y*=-1.0;
#endif
#else
var irradianceVector: vec3f=irradianceVector_;
#endif
#if defined(USESPHERICALFROMREFLECTIONMAP)
#if defined(REALTIME_FILTERING)
var refractionIrradiance: vec3f=irradiance(reflectionSampler,reflectionSamplerSampler,-irradianceVector,vReflectionFilteringInfo);
#else
var refractionIrradiance: vec3f=computeEnvironmentIrradiance(-irradianceVector);
#endif
#elif defined(USEIRRADIANCEMAP)
#ifdef REFLECTIONMAP_3D
var irradianceCoords: vec3f=irradianceVector;
#else
var irradianceCoords: vec2f=irradianceVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
irradianceCoords/=irradianceVector.z;
#endif
irradianceCoords.y=1.0-irradianceCoords.y;
#endif
var temp: vec4f=textureSample(irradianceSampler,irradianceSamplerSampler,-irradianceCoords);var refractionIrradiance=temp.rgb;
#ifdef RGBDREFLECTION
refractionIrradiance=fromRGBD(temp).rgb;
#endif
#ifdef GAMMAREFLECTION
refractionIrradiance=toLinearSpaceVec3(refractionIrradiance);
#endif
#else
var refractionIrradiance: vec3f= vec3f(0.);
#endif
refractionIrradiance*=transmittance;
#ifdef SS_ALBEDOFORTRANSLUCENCYTINT
refractionIrradiance*=surfaceAlbedo.rgb;
#endif
outParams.refractionIrradiance=refractionIrradiance;
#endif
return outParams;}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name22] = shader22;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockNormalGeometric.js
var name23 = "pbrBlockNormalGeometric";
var shader23 = `var viewDirectionW: vec3f=normalize(scene.vEyePosition.xyz-input.vPositionW);
#ifdef NORMAL
var normalW: vec3f=normalize(input.vNormalW);
#else
var normalW: vec3f=normalize(cross(dpdx(input.vPositionW),dpdy(input.vPositionW)))*scene.vEyePosition.w;
#endif
var geometricNormalW: vec3f=normalW;
#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)
geometricNormalW=select(-geometricNormalW,geometricNormalW,fragmentInputs.frontFacing);
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name23] = shader23;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockNormalFinal.js
var name24 = "pbrBlockNormalFinal";
var shader24 = `#if defined(FORCENORMALFORWARD) && defined(NORMAL)
var faceNormal: vec3f=normalize(cross(dpdx(fragmentInputs.vPositionW),dpdy(fragmentInputs.vPositionW)))*scene.vEyePosition.w;
#if defined(TWOSIDEDLIGHTING)
faceNormal=select(-faceNormal,faceNormal,fragmentInputs.frontFacing);
#endif
normalW*=sign(dot(normalW,faceNormal));
#endif
#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)
normalW=select(-normalW,normalW,fragmentInputs.frontFacing);
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name24] = shader24;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockLightmapInit.js
var name25 = "pbrBlockLightmapInit";
var shader25 = `#ifdef LIGHTMAP
var lightmapColor: vec4f=textureSample(lightmapSampler,lightmapSamplerSampler,fragmentInputs.vLightmapUV+uvOffset);
#ifdef RGBDLIGHTMAP
lightmapColor=vec4f(fromRGBD(lightmapColor),lightmapColor.a);
#endif
#ifdef GAMMALIGHTMAP
lightmapColor=vec4f(toLinearSpaceVec3(lightmapColor.rgb),lightmapColor.a);
#endif
lightmapColor=vec4f(lightmapColor.rgb*uniforms.vLightmapInfos.y,lightmapColor.a);
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name25] = shader25;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockGeometryInfo.js
var name26 = "pbrBlockGeometryInfo";
var shader26 = `var NdotVUnclamped: f32=dot(normalW,viewDirectionW);var NdotV: f32=absEps(NdotVUnclamped);var alphaG: f32=convertRoughnessToAverageSlope(roughness);var AARoughnessFactors: vec2f=getAARoughnessFactors(normalW.xyz);
#ifdef SPECULARAA
alphaG+=AARoughnessFactors.y;
#endif
#if defined(ENVIRONMENTBRDF)
var environmentBrdf: vec3f=getBRDFLookup(NdotV,roughness);
#endif
#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
#ifdef RADIANCEOCCLUSION
#ifdef AMBIENTINGRAYSCALE
var ambientMonochrome: f32=aoOut.ambientOcclusionColor.r;
#else
var ambientMonochrome: f32=getLuminance(aoOut.ambientOcclusionColor);
#endif
var seo: f32=environmentRadianceOcclusion(ambientMonochrome,NdotVUnclamped);
#endif
#ifdef HORIZONOCCLUSION
#ifdef BUMP
#ifdef REFLECTIONMAP_3D
var eho: f32=environmentHorizonOcclusion(-viewDirectionW,normalW,geometricNormalW);
#endif
#endif
#endif
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name26] = shader26;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockReflectance0.js
var name27 = "pbrBlockReflectance0";
var shader27 = `var reflectance: f32=max(max(reflectivityOut.surfaceReflectivityColor.r,reflectivityOut.surfaceReflectivityColor.g),reflectivityOut.surfaceReflectivityColor.b);var specularEnvironmentR0: vec3f=reflectivityOut.surfaceReflectivityColor.rgb;
#ifdef METALLICWORKFLOW
var specularEnvironmentR90: vec3f= vec3f(metallicReflectanceFactors.a);
#else 
var specularEnvironmentR90: vec3f= vec3f(1.0,1.0,1.0);
#endif
#ifdef ALPHAFRESNEL
var reflectance90: f32=fresnelGrazingReflectance(reflectance);specularEnvironmentR90=specularEnvironmentR90*reflectance90;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name27] = shader27;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockReflectance.js
var name28 = "pbrBlockReflectance";
var shader28 = `#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
var specularEnvironmentReflectance: vec3f=getReflectanceFromBRDFWithEnvLookup(clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,environmentBrdf);
#ifdef RADIANCEOCCLUSION
specularEnvironmentReflectance*=seo;
#endif
#ifdef HORIZONOCCLUSION
#ifdef BUMP
#ifdef REFLECTIONMAP_3D
specularEnvironmentReflectance*=eho;
#endif
#endif
#endif
#else
var specularEnvironmentReflectance: vec3f=getReflectanceFromAnalyticalBRDFLookup_Jones(NdotV,clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,sqrt(microSurface));
#endif
#ifdef CLEARCOAT
specularEnvironmentReflectance*=clearcoatOut.conservationFactor;
#if defined(CLEARCOAT_TINT)
specularEnvironmentReflectance*=clearcoatOut.absorption;
#endif
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name28] = shader28;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockDirectLighting.js
var name29 = "pbrBlockDirectLighting";
var shader29 = `var diffuseBase: vec3f=vec3f(0.,0.,0.);
#ifdef SPECULARTERM
var specularBase: vec3f=vec3f(0.,0.,0.);
#endif
#ifdef CLEARCOAT
var clearCoatBase: vec3f=vec3f(0.,0.,0.);
#endif
#ifdef SHEEN
var sheenBase: vec3f=vec3f(0.,0.,0.);
#endif
var preInfo: preLightingInfo;var info: lightingInfo;var shadow: f32=1.; 
var aggShadow: f32=0.;var numLights: f32=0.;
#if defined(CLEARCOAT) && defined(CLEARCOAT_TINT)
var absorption: vec3f=vec3f(0.);
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name29] = shader29;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockFinalLitComponents.js
var name30 = "pbrBlockFinalLitComponents";
var shader30 = `aggShadow=aggShadow/numLights;
#if defined(ENVIRONMENTBRDF)
#ifdef MS_BRDF_ENERGY_CONSERVATION
var energyConservationFactor: vec3f=getEnergyConservationFactor(clearcoatOut.specularEnvironmentR0,environmentBrdf);
#endif
#endif
#ifndef METALLICWORKFLOW
#ifdef SPECULAR_GLOSSINESS_ENERGY_CONSERVATION
surfaceAlbedo=(1.-reflectance)*surfaceAlbedo.rgb;
#endif
#endif
#if defined(SHEEN) && defined(SHEEN_ALBEDOSCALING) && defined(ENVIRONMENTBRDF)
surfaceAlbedo=sheenOut.sheenAlbedoScaling*surfaceAlbedo.rgb;
#endif
#ifdef REFLECTION
var finalIrradiance: vec3f=reflectionOut.environmentIrradiance;
#if defined(CLEARCOAT)
finalIrradiance*=clearcoatOut.conservationFactor;
#if defined(CLEARCOAT_TINT)
finalIrradiance*=clearcoatOut.absorption;
#endif
#endif
#if defined(SS_REFRACTION)
finalIrradiance*=subSurfaceOut.refractionFactorForIrradiance;
#endif
#if defined(SS_TRANSLUCENCY)
finalIrradiance*=(1.0-subSurfaceOut.translucencyIntensity);finalIrradiance+=subSurfaceOut.refractionIrradiance;
#endif
finalIrradiance*=surfaceAlbedo.rgb;finalIrradiance*=uniforms.vLightingIntensity.z;finalIrradiance*=aoOut.ambientOcclusionColor;
#endif
#ifdef SPECULARTERM
var finalSpecular: vec3f=specularBase;finalSpecular=max(finalSpecular,vec3f(0.0));var finalSpecularScaled: vec3f=finalSpecular*uniforms.vLightingIntensity.x*uniforms.vLightingIntensity.w;
#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)
finalSpecularScaled*=energyConservationFactor;
#endif
#if defined(SHEEN) && defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
finalSpecularScaled*=sheenOut.sheenAlbedoScaling;
#endif
#endif
#ifdef REFLECTION
var finalRadiance: vec3f=reflectionOut.environmentRadiance.rgb;finalRadiance*=subSurfaceOut.specularEnvironmentReflectance;var finalRadianceScaled: vec3f=finalRadiance*uniforms.vLightingIntensity.z;
#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)
finalRadianceScaled*=energyConservationFactor;
#endif
#if defined(SHEEN) && defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
finalRadianceScaled*=sheenOut.sheenAlbedoScaling;
#endif
#endif
#ifdef SHEEN
var finalSheen: vec3f=sheenBase*sheenOut.sheenColor;finalSheen=max(finalSheen,vec3f(0.0));var finalSheenScaled: vec3f=finalSheen*uniforms.vLightingIntensity.x*uniforms.vLightingIntensity.w;
#if defined(CLEARCOAT) && defined(REFLECTION) && defined(ENVIRONMENTBRDF)
sheenOut.finalSheenRadianceScaled*=clearcoatOut.conservationFactor;
#if defined(CLEARCOAT_TINT)
sheenOut.finalSheenRadianceScaled*=clearcoatOut.absorption;
#endif
#endif
#endif
#ifdef CLEARCOAT
var finalClearCoat: vec3f=clearCoatBase;finalClearCoat=max(finalClearCoat,vec3f(0.0));var finalClearCoatScaled: vec3f=finalClearCoat*uniforms.vLightingIntensity.x*uniforms.vLightingIntensity.w;
#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)
finalClearCoatScaled*=clearcoatOut.energyConservationFactorClearCoat;
#endif
#ifdef SS_REFRACTION
subSurfaceOut.finalRefraction*=clearcoatOut.conservationFactor;
#ifdef CLEARCOAT_TINT
subSurfaceOut.finalRefraction*=clearcoatOut.absorption;
#endif
#endif
#endif
#ifdef ALPHABLEND
var luminanceOverAlpha: f32=0.0;
#if defined(REFLECTION) && defined(RADIANCEOVERALPHA)
luminanceOverAlpha+=getLuminance(finalRadianceScaled);
#if defined(CLEARCOAT)
luminanceOverAlpha+=getLuminance(clearcoatOut.finalClearCoatRadianceScaled);
#endif
#endif
#if defined(SPECULARTERM) && defined(SPECULAROVERALPHA)
luminanceOverAlpha+=getLuminance(finalSpecularScaled);
#endif
#if defined(CLEARCOAT) && defined(CLEARCOATOVERALPHA)
luminanceOverAlpha+=getLuminance(finalClearCoatScaled);
#endif
#if defined(RADIANCEOVERALPHA) || defined(SPECULAROVERALPHA) || defined(CLEARCOATOVERALPHA)
alpha=saturate(alpha+luminanceOverAlpha*luminanceOverAlpha);
#endif
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name30] = shader30;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockFinalUnlitComponents.js
var name31 = "pbrBlockFinalUnlitComponents";
var shader31 = `var finalDiffuse: vec3f=diffuseBase;finalDiffuse*=surfaceAlbedo.rgb;finalDiffuse=max(finalDiffuse,vec3f(0.0));finalDiffuse*=uniforms.vLightingIntensity.x;var finalAmbient: vec3f=uniforms.vAmbientColor;finalAmbient*=surfaceAlbedo.rgb;var finalEmissive: vec3f=uniforms.vEmissiveColor;
#ifdef EMISSIVE
var emissiveColorTex: vec3f=textureSample(emissiveSampler,emissiveSamplerSampler,fragmentInputs.vEmissiveUV+uvOffset).rgb;
#ifdef GAMMAEMISSIVE
finalEmissive*=toLinearSpaceVec3(emissiveColorTex.rgb);
#else
finalEmissive*=emissiveColorTex.rgb;
#endif
finalEmissive*= uniforms.vEmissiveInfos.y;
#endif
finalEmissive*=uniforms.vLightingIntensity.y;
#ifdef AMBIENT
var ambientOcclusionForDirectDiffuse: vec3f=mix( vec3f(1.),aoOut.ambientOcclusionColor,uniforms.vAmbientInfos.w);
#else
var ambientOcclusionForDirectDiffuse: vec3f=aoOut.ambientOcclusionColor;
#endif
finalAmbient*=aoOut.ambientOcclusionColor;finalDiffuse*=ambientOcclusionForDirectDiffuse;
`;
ShaderStore.IncludesShadersStoreWGSL[name31] = shader31;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockFinalColorComposition.js
var name32 = "pbrBlockFinalColorComposition";
var shader32 = `var finalColor: vec4f= vec4f(
#ifndef UNLIT
#ifdef REFLECTION
finalIrradiance +
#endif
#ifdef SPECULARTERM
finalSpecularScaled +
#endif
#ifdef SHEEN
finalSheenScaled +
#endif
#ifdef CLEARCOAT
finalClearCoatScaled +
#endif
#ifdef REFLECTION
finalRadianceScaled +
#if defined(SHEEN) && defined(ENVIRONMENTBRDF)
sheenOut.finalSheenRadianceScaled +
#endif
#ifdef CLEARCOAT
clearcoatOut.finalClearCoatRadianceScaled +
#endif
#endif
#ifdef SS_REFRACTION
subSurfaceOut.finalRefraction +
#endif
#endif
finalAmbient +
finalDiffuse,
alpha);
#ifdef LIGHTMAP
#ifndef LIGHTMAPEXCLUDED
#ifdef USELIGHTMAPASSHADOWMAP
finalColor=vec4f(finalColor.rgb*lightmapColor.rgb,finalColor.a);
#else
finalColor=vec4f(finalColor.rgb+lightmapColor.rgb,finalColor.a);
#endif
#endif
#endif
finalColor=vec4f(finalColor.rgb+finalEmissive,finalColor.a);
#define CUSTOM_FRAGMENT_BEFORE_FOG
finalColor=max(finalColor,vec4f(0.0));
`;
ShaderStore.IncludesShadersStoreWGSL[name32] = shader32;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrBlockImageProcessing.js
var name33 = "pbrBlockImageProcessing";
var shader33 = `#if defined(IMAGEPROCESSINGPOSTPROCESS) || defined(SS_SCATTERING)
#if !defined(SKIPFINALCOLORCLAMP)
finalColor=vec4f(clamp(finalColor.rgb,vec3f(0.),vec3f(30.0)),finalColor.a);
#endif
#else
finalColor=applyImageProcessing(finalColor);
#endif
finalColor=vec4f(finalColor.rgb,finalColor.a*mesh.visibility);
#ifdef PREMULTIPLYALPHA
finalColor=vec4f(finalColor.rgb*finalColor.a,finalColor.a);;
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name33] = shader33;

// node_modules/@babylonjs/core/ShadersWGSL/ShadersInclude/pbrDebug.js
var name34 = "pbrDebug";
var shader34 = `#if DEBUGMODE>0
if (input.vClipSpacePosition.x/input.vClipSpacePosition.w>=uniforms.vDebugMode.x) {var color: vec3f;
#if DEBUGMODE==1
color=fragmentInputs.vPositionW.rgb;
#define DEBUGMODE_NORMALIZE
#elif DEBUGMODE==2 && defined(NORMAL)
color=fragmentInputs.vNormalW.rgb;
#define DEBUGMODE_NORMALIZE
#elif DEBUGMODE==3 && defined(BUMP) || DEBUGMODE==3 && defined(PARALLAX) || DEBUGMODE==3 && defined(ANISOTROPIC)
color=TBN[0];
#define DEBUGMODE_NORMALIZE
#elif DEBUGMODE==4 && defined(BUMP) || DEBUGMODE==4 && defined(PARALLAX) || DEBUGMODE==4 && defined(ANISOTROPIC)
color=TBN[1];
#define DEBUGMODE_NORMALIZE
#elif DEBUGMODE==5
color=normalW;
#define DEBUGMODE_NORMALIZE
#elif DEBUGMODE==6 && defined(MAINUV1)
color= vec3f(input.vMainUV1,0.0);
#elif DEBUGMODE==7 && defined(MAINUV2)
color= vec3f(input.vMainUV2,0.0);
#elif DEBUGMODE==8 && defined(CLEARCOAT) && defined(CLEARCOAT_BUMP)
color=clearcoatOut.TBNClearCoat[0];
#define DEBUGMODE_NORMALIZE
#elif DEBUGMODE==9 && defined(CLEARCOAT) && defined(CLEARCOAT_BUMP)
color=clearcoatOut.TBNClearCoat[1];
#define DEBUGMODE_NORMALIZE
#elif DEBUGMODE==10 && defined(CLEARCOAT)
color=clearcoatOut.clearCoatNormalW;
#define DEBUGMODE_NORMALIZE
#elif DEBUGMODE==11 && defined(ANISOTROPIC)
color=anisotropicOut.anisotropicNormal;
#define DEBUGMODE_NORMALIZE
#elif DEBUGMODE==12 && defined(ANISOTROPIC)
color=anisotropicOut.anisotropicTangent;
#define DEBUGMODE_NORMALIZE
#elif DEBUGMODE==13 && defined(ANISOTROPIC)
color=anisotropicOut.anisotropicBitangent;
#define DEBUGMODE_NORMALIZE
#elif DEBUGMODE==20 && defined(ALBEDO)
color=albedoTexture.rgb;
#ifndef GAMMAALBEDO
#define DEBUGMODE_GAMMA
#endif
#elif DEBUGMODE==21 && defined(AMBIENT)
color=aoOut.ambientOcclusionColorMap.rgb;
#elif DEBUGMODE==22 && defined(OPACITY)
color=opacityMap.rgb;
#elif DEBUGMODE==23 && defined(EMISSIVE)
color=emissiveColorTex.rgb;
#ifndef GAMMAEMISSIVE
#define DEBUGMODE_GAMMA
#endif
#elif DEBUGMODE==24 && defined(LIGHTMAP)
color=lightmapColor;
#ifndef GAMMALIGHTMAP
#define DEBUGMODE_GAMMA
#endif
#elif DEBUGMODE==25 && defined(REFLECTIVITY) && defined(METALLICWORKFLOW)
color=reflectivityOut.surfaceMetallicColorMap.rgb;
#elif DEBUGMODE==26 && defined(REFLECTIVITY) && !defined(METALLICWORKFLOW)
color=reflectivityOut.surfaceReflectivityColorMap.rgb;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==27 && defined(CLEARCOAT) && defined(CLEARCOAT_TEXTURE)
color= vec3f(clearcoatOut.clearCoatMapData.rg,0.0);
#elif DEBUGMODE==28 && defined(CLEARCOAT) && defined(CLEARCOAT_TINT) && defined(CLEARCOAT_TINT_TEXTURE)
color=clearcoatOut.clearCoatTintMapData.rgb;
#elif DEBUGMODE==29 && defined(SHEEN) && defined(SHEEN_TEXTURE)
color=sheenOut.sheenMapData.rgb;
#elif DEBUGMODE==30 && defined(ANISOTROPIC) && defined(ANISOTROPIC_TEXTURE)
color=anisotropicOut.anisotropyMapData.rgb;
#elif DEBUGMODE==31 && defined(SUBSURFACE) && defined(SS_THICKNESSANDMASK_TEXTURE)
color=subSurfaceOut.thicknessMap.rgb;
#elif DEBUGMODE==32 && defined(BUMP)
color=textureSample(bumpSampler,bumpSamplerSampler,fragmentInputs.vBumpUV).rgb;
#elif DEBUGMODE==40 && defined(SS_REFRACTION)
color=subSurfaceOut.environmentRefraction.rgb;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==41 && defined(REFLECTION)
color=reflectionOut.environmentRadiance.rgb;
#ifndef GAMMAREFLECTION
#define DEBUGMODE_GAMMA
#endif
#elif DEBUGMODE==42 && defined(CLEARCOAT) && defined(REFLECTION)
color=clearcoatOut.environmentClearCoatRadiance.rgb;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==50
color=diffuseBase.rgb;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==51 && defined(SPECULARTERM)
color=specularBase.rgb;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==52 && defined(CLEARCOAT)
color=clearCoatBase.rgb;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==53 && defined(SHEEN)
color=sheenBase.rgb;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==54 && defined(REFLECTION)
color=reflectionOut.environmentIrradiance.rgb;
#ifndef GAMMAREFLECTION
#define DEBUGMODE_GAMMA
#endif
#elif DEBUGMODE==60
color=surfaceAlbedo.rgb;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==61
color=clearcoatOut.specularEnvironmentR0;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==62 && defined(METALLICWORKFLOW)
color= vec3f(reflectivityOut.metallicRoughness.r);
#elif DEBUGMODE==71 && defined(METALLICWORKFLOW)
color=reflectivityOut.metallicF0;
#elif DEBUGMODE==63
color= vec3f(roughness);
#elif DEBUGMODE==64
color= vec3f(alphaG);
#elif DEBUGMODE==65
color= vec3f(NdotV);
#elif DEBUGMODE==66 && defined(CLEARCOAT) && defined(CLEARCOAT_TINT)
color=clearcoatOut.clearCoatColor;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==67 && defined(CLEARCOAT)
color= vec3f(clearcoatOut.clearCoatRoughness);
#elif DEBUGMODE==68 && defined(CLEARCOAT)
color= vec3f(clearcoatOut.clearCoatNdotV);
#elif DEBUGMODE==69 && defined(SUBSURFACE) && defined(SS_TRANSLUCENCY)
color=subSurfaceOut.transmittance;
#elif DEBUGMODE==70 && defined(SUBSURFACE) && defined(SS_REFRACTION)
color=subSurfaceOut.refractionTransmittance;
#elif DEBUGMODE==72
color= vec3f(microSurface);
#elif DEBUGMODE==73
color=uniforms.vAlbedoColor.rgb;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==74 && !defined(METALLICWORKFLOW)
color=uniforms.vReflectivityColor.rgb;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==75
color=uniforms.vEmissiveColor;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==80 && defined(RADIANCEOCCLUSION)
color= vec3f(seo);
#elif DEBUGMODE==81 && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
color= vec3f(eho);
#elif DEBUGMODE==82 && defined(MS_BRDF_ENERGY_CONSERVATION)
color= vec3f(energyConservationFactor);
#elif DEBUGMODE==83 && defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
color=specularEnvironmentReflectance;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==84 && defined(CLEARCOAT) && defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
color=clearcoatOut.clearCoatEnvironmentReflectance;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==85 && defined(SHEEN) && defined(REFLECTION)
color=sheenOut.sheenEnvironmentReflectance;
#define DEBUGMODE_GAMMA
#elif DEBUGMODE==86 && defined(ALPHABLEND)
color= vec3f(luminanceOverAlpha);
#elif DEBUGMODE==87
color= vec3f(alpha);
#elif DEBUGMODE==88 && defined(ALBEDO)
color= vec3f(albedoTexture.a);
#elif DEBUGMODE==89
color=aoOut.ambientOcclusionColor;
#else
var stripeWidth: f32=30.;var stripePos: f32=abs(floor(input.position.x/stripeWidth));var whichColor: f32=((stripePos)%(2.));var color1: vec3f= vec3f(.6,.2,.2);var color2: vec3f= vec3f(.3,.1,.1);color=mix(color1,color2,whichColor);
#endif
color*=uniforms.vDebugMode.y;
#ifdef DEBUGMODE_NORMALIZE
color=normalize(color)*0.5+0.5;
#endif
#ifdef DEBUGMODE_GAMMA
color=toGammaSpaceVec3(color);
#endif
fragmentOutputs.color=vec4f(color,1.0);
#ifdef PREPASS
fragmentOutputs.fragData0=toLinearSpaceVec3(color); 
fragmentOutputs.fragData1=vec4f(0.,0.,0.,0.); 
#endif
#ifdef DEBUGMODE_FORCERETURN
return fragmentOutputs;
#endif
}
#endif
`;
ShaderStore.IncludesShadersStoreWGSL[name34] = shader34;

// node_modules/@babylonjs/core/ShadersWGSL/pbr.fragment.js
var name35 = "pbrPixelShader";
var shader35 = `#define CUSTOM_FRAGMENT_BEGIN
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<pbrUboDeclaration>
#include<pbrFragmentExtraDeclaration>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<pbrFragmentSamplersDeclaration>
#include<imageProcessingDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#include<helperFunctions>
#include<subSurfaceScatteringFunctions>
#include<importanceSampling>
#include<pbrHelperFunctions>
#include<imageProcessingFunctions>
#include<shadowsFragmentFunctions>
#include<harmonicsFunctions>
#include<pbrDirectLightingSetupFunctions>
#include<pbrDirectLightingFalloffFunctions>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
#include<pbrDirectLightingFunctions>
#include<pbrIBLFunctions>
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#ifdef REFLECTION
#include<reflectionFunction>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<pbrBlockAlbedoOpacity>
#include<pbrBlockReflectivity>
#include<pbrBlockAmbientOcclusion>
#include<pbrBlockAlphaFresnel>
#include<pbrBlockAnisotropic>
#include<pbrBlockReflection>
#include<pbrBlockSheen>
#include<pbrBlockClearcoat>
#include<pbrBlockIridescence>
#include<pbrBlockSubSurface>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
#include<bumpFragment>
#include<pbrBlockNormalFinal>
var albedoOpacityOut: albedoOpacityOutParams;
#ifdef ALBEDO
var albedoTexture: vec4f=textureSample(albedoSampler,albedoSamplerSampler,fragmentInputs.vAlbedoUV+uvOffset);
#endif
#ifdef OPACITY
var opacityMap: vec4f=textureSample(opacitySampler,opacitySamplerSampler,fragmentInputs.vOpacityUV+uvOffset);
#endif
#ifdef DECAL
var decalColor: vec4f=textureSample(decalSampler,decalSamplerSampler,fragmentInputs.vDecalUV+uvOffset);
#endif
albedoOpacityOut=albedoOpacityBlock(
uniforms.vAlbedoColor
#ifdef ALBEDO
,albedoTexture
,uniforms.vAlbedoInfos
#endif
#ifdef OPACITY
,opacityMap
,uniforms.vOpacityInfos
#endif
#ifdef DETAIL
,detailColor
,uniforms.vDetailInfos
#endif
#ifdef DECAL
,decalColor
,uniforms.vDecalInfos
#endif
);var surfaceAlbedo: vec3f=albedoOpacityOut.surfaceAlbedo;var alpha: f32=albedoOpacityOut.alpha;
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
#include<depthPrePass>
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
var aoOut: ambientOcclusionOutParams;
#ifdef AMBIENT
var ambientOcclusionColorMap: vec3f=textureSample(ambientSampler,ambientSamplerSampler,fragmentInputs.vAmbientUV+uvOffset).rgb;
#endif
aoOut=ambientOcclusionBlock(
#ifdef AMBIENT
ambientOcclusionColorMap,
uniforms.vAmbientInfos
#endif 
);
#include<pbrBlockLightmapInit>
#ifdef UNLIT
var diffuseBase: vec3f= vec3f(1.,1.,1.);
#else
var baseColor: vec3f=surfaceAlbedo;var reflectivityOut: reflectivityOutParams;
#if defined(REFLECTIVITY)
var surfaceMetallicOrReflectivityColorMap: vec4f=textureSample(reflectivitySampler,reflectivitySamplerSampler,fragmentInputs.vReflectivityUV+uvOffset);var baseReflectivity: vec4f=surfaceMetallicOrReflectivityColorMap;
#ifndef METALLICWORKFLOW
#ifdef REFLECTIVITY_GAMMA
surfaceMetallicOrReflectivityColorMap=toLinearSpaceVec4(surfaceMetallicOrReflectivityColorMap);
#endif
surfaceMetallicOrReflectivityColorMap=vec4f(surfaceMetallicOrReflectivityColorMap.rgb*uniforms.vReflectivityInfos.y,surfaceMetallicOrReflectivityColorMap.a);
#endif
#endif
#if defined(MICROSURFACEMAP)
var microSurfaceTexel: vec4f=textureSample(microSurfaceSampler,microSurfaceSamplerSampler,fragmentInputs.vMicroSurfaceSamplerUV+uvOffset)*uniforms.vMicroSurfaceSamplerInfos.y;
#endif
#ifdef METALLICWORKFLOW
var metallicReflectanceFactors: vec4f=uniforms.vMetallicReflectanceFactors;
#ifdef REFLECTANCE
var reflectanceFactorsMap: vec4f=textureSample(reflectanceSampler,reflectanceSamplerSampler,fragmentInputs.vReflectanceUV+uvOffset);
#ifdef REFLECTANCE_GAMMA
reflectanceFactorsMap=toLinearSpaceVec4(reflectanceFactorsMap);
#endif
metallicReflectanceFactors=vec4f(metallicReflectanceFactors.rgb*reflectanceFactorsMap.rgb,metallicReflectanceFactors.a);
#endif
#ifdef METALLIC_REFLECTANCE
var metallicReflectanceFactorsMap: vec4f=textureSample(metallicReflectanceSampler,metallicReflectanceSamplerSampler,fragmentInputs.vMetallicReflectanceUV+uvOffset);
#ifdef METALLIC_REFLECTANCE_GAMMA
metallicReflectanceFactorsMap=toLinearSpaceVec4(metallicReflectanceFactorsMap);
#endif
#ifndef METALLIC_REFLECTANCE_USE_ALPHA_ONLY
metallicReflectanceFactors=vec4f(metallicReflectanceFactors.rgb*reflectanceFactorsMap.rgb,metallicReflectanceFactors.a);
#endif
metallicReflectanceFactors*=metallicReflectanceFactorsMap.a;
#endif
#endif
reflectivityOut=reflectivityBlock(
uniforms.vReflectivityColor
#ifdef METALLICWORKFLOW
,surfaceAlbedo
,metallicReflectanceFactors
#endif
#ifdef REFLECTIVITY
,uniforms.vReflectivityInfos
,surfaceMetallicOrReflectivityColorMap
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
,aoOut.ambientOcclusionColor
#endif
#ifdef MICROSURFACEMAP
,microSurfaceTexel
#endif
#ifdef DETAIL
,detailColor
,uniforms.vDetailInfos
#endif
);var microSurface: f32=reflectivityOut.microSurface;var roughness: f32=reflectivityOut.roughness;
#ifdef METALLICWORKFLOW
surfaceAlbedo=reflectivityOut.surfaceAlbedo;
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
aoOut.ambientOcclusionColor=reflectivityOut.ambientOcclusionColor;
#endif
#ifdef ALPHAFRESNEL
#if defined(ALPHATEST) || defined(ALPHABLEND)
var alphaFresnelOut: alphaFresnelOutParams;alphaFresnelOut=alphaFresnelBlock(
normalW,
viewDirectionW,
alpha,
microSurface
);alpha=alphaFresnelOut.alpha;
#endif
#endif
#include<pbrBlockGeometryInfo>
#ifdef ANISOTROPIC
var anisotropicOut: anisotropicOutParams;
#ifdef ANISOTROPIC_TEXTURE
var anisotropyMapData: vec3f=textureSample(anisotropySampler,anisotropySamplerSampler,fragmentInputs.vAnisotropyUV+uvOffset).rgb*uniforms.vAnisotropyInfos.y;
#endif
anisotropicOut=anisotropicBlock(
uniforms.vAnisotropy,
roughness,
#ifdef ANISOTROPIC_TEXTURE
anisotropyMapData,
#endif
TBN,
normalW,
viewDirectionW 
);
#endif
#ifdef REFLECTION
var reflectionOut: reflectionOutParams;
#ifndef USE_CUSTOM_REFLECTION
reflectionOut=reflectionBlock(
input.vPositionW
,normalW
,alphaG
,uniforms.vReflectionMicrosurfaceInfos
,uniforms.vReflectionInfos
,uniforms.vReflectionColor
#ifdef ANISOTROPIC
,anisotropicOut
#endif
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
,NdotVUnclamped
#endif
#ifdef LINEARSPECULARREFLECTION
,roughness
#endif
,reflectionSampler
,reflectionSamplerSampler
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,input.vEnvironmentIrradiance
#endif
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
,uniforms.reflectionMatrix
#endif
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#endif
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
#define CUSTOM_REFLECTION
#endif
#endif
#include<pbrBlockReflectance0>
#ifdef SHEEN
var sheenOut: sheenOutParams;
#ifdef SHEEN_TEXTURE
var sheenMapData: vec4f=textureSample(sheenSampler,sheenSamplerSampler,fragmentInputs.vSheenUV+uvOffset);
#endif
#if defined(SHEEN_ROUGHNESS) && defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)
var sheenMapRoughnessData: vec4f=textureSample(sheenRoughnessSampler,sheenRoughnessSamplerSampler,fragmentInputs.vSheenRoughnessUV+uvOffset)*uniforms.vSheenInfos.w;
#endif
sheenOut=sheenBlock(
uniforms.vSheenColor
#ifdef SHEEN_ROUGHNESS
,uniforms.vSheenRoughness
#if defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)
,sheenMapRoughnessData
#endif
#endif
,roughness
#ifdef SHEEN_TEXTURE
,sheenMapData
,uniforms.vSheenInfos.y
#endif
,reflectance
#ifdef SHEEN_LINKWITHALBEDO
,baseColor
,surfaceAlbedo
#endif
#ifdef ENVIRONMENTBRDF
,NdotV
,environmentBrdf
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
,AARoughnessFactors
,uniforms.vReflectionMicrosurfaceInfos
,uniforms.vReflectionInfos
,uniforms.vReflectionColor
,uniforms.vLightingIntensity
,reflectionSampler
,reflectionSamplerSampler
,reflectionOut.reflectionCoords
,NdotVUnclamped
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)
,seo
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
,eho
#endif
#endif
);
#ifdef SHEEN_LINKWITHALBEDO
surfaceAlbedo=sheenOut.surfaceAlbedo;
#endif
#endif
#ifdef CLEARCOAT
#ifdef CLEARCOAT_TEXTURE
var clearCoatMapData: vec2f=textureSample(clearCoatSampler,clearCoatSamplerSampler,fragmentInputs.vClearCoatUV+uvOffset).rg*uniforms.vClearCoatInfos.y;
#endif
#endif
#ifdef IRIDESCENCE
var iridescenceOut: iridescenceOutParams;
#ifdef IRIDESCENCE_TEXTURE
var iridescenceMapData: vec2f=textureSample(iridescenceSampler,iridescenceSamplerSampler,fragmentInputs.vIridescenceUV+uvOffset).rg*vIridescenceInfos.y;
#endif
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
var iridescenceThicknessMapData: vec2f=textureSample(iridescenceThicknessSampler,iridescenceThicknessSamplerSampler,fragmentInputs.vIridescenceThicknessUV+uvOffset).rg*vIridescenceInfos.w;
#endif
iridescenceOut=iridescenceBlock(
uniforms.vIridescenceParams
,NdotV
,specularEnvironmentR0
#ifdef IRIDESCENCE_TEXTURE
,iridescenceMapData
#endif
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
,iridescenceThicknessMapData
#endif
#ifdef CLEARCOAT
,NdotVUnclamped
#ifdef CLEARCOAT_TEXTURE
,clearCoatMapData
#endif
#endif
);var iridescenceIntensity: f32=iridescenceOut.iridescenceIntensity;specularEnvironmentR0=iridescenceOut.specularEnvironmentR0;
#endif
var clearcoatOut: clearcoatOutParams;
#ifdef CLEARCOAT
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
var clearCoatMapRoughnessData: vec4f=textureSample(clearCoatRoughnessSampler,clearCoatRoughnessSamplerSampler,fragmentInputs.vClearCoatRoughnessUV+uvOffset)*uniforms.vClearCoatInfos.w;
#endif
#if defined(CLEARCOAT_TINT) && defined(CLEARCOAT_TINT_TEXTURE)
var clearCoatTintMapData: vec4f=textureSample(clearCoatTintSampler,clearCoatTintSamplerSampler,fragmentInputs.vClearCoatTintUV+uvOffset);
#endif
#ifdef CLEARCOAT_BUMP
var clearCoatBumpMapData: vec4f=textureSample(clearCoatBumpSampler,clearCoatBumpSamplerSampler,fragmentInputs.vClearCoatBumpUV+uvOffset);
#endif
clearcoatOut=clearcoatBlock(
input.vPositionW
,geometricNormalW
,viewDirectionW
,uniforms.vClearCoatParams
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
,clearCoatMapRoughnessData
#endif
,specularEnvironmentR0
#ifdef CLEARCOAT_TEXTURE
,clearCoatMapData
#endif
#ifdef CLEARCOAT_TINT
,uniforms.vClearCoatTintParams
,uniforms.clearCoatColorAtDistance
,uniforms.vClearCoatRefractionParams
#ifdef CLEARCOAT_TINT_TEXTURE
,clearCoatTintMapData
#endif
#endif
#ifdef CLEARCOAT_BUMP
,uniforms.vClearCoatBumpInfos
,clearCoatBumpMapData
,fragmentInputs.vClearCoatBumpUV
#if defined(TANGENT) && defined(NORMAL)
,vTBN
#else
,uniforms.vClearCoatTangentSpaceParams
#endif
#ifdef OBJECTSPACE_NORMALMAP
,uniforms.normalMatrix
#endif
#endif
#if defined(FORCENORMALFORWARD) && defined(NORMAL)
,faceNormal
#endif
#ifdef REFLECTION
,uniforms.vReflectionMicrosurfaceInfos
,uniforms.vReflectionInfos
,uniforms.vReflectionColor
,uniforms.vLightingIntensity
,reflectionSampler
,reflectionSamplerSampler
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
#endif
#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
#ifdef RADIANCEOCCLUSION
,ambientMonochrome
#endif
#endif
#if defined(CLEARCOAT_BUMP) || defined(TWOSIDEDLIGHTING)
,select(-1.,1.,fragmentInputs.frontFacing)
#endif
);
#else
clearcoatOut.specularEnvironmentR0=specularEnvironmentR0;
#endif
#include<pbrBlockReflectance>
var subSurfaceOut: subSurfaceOutParams;
#ifdef SUBSURFACE
#ifdef SS_THICKNESSANDMASK_TEXTURE
var thicknessMap: vec4f=textureSample(thicknessSampler,thicknessSamplerSampler,fragmentInputs.vThicknessUV+uvOffset);
#endif
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
var refractionIntensityMap: vec4f=textureSample(refractionIntensitySampler,refractionIntensitySamplerSampler,fragmentInputs.vRefractionIntensityUV+uvOffset);
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
var translucencyIntensityMap: vec4f=textureSample(translucencyIntensitySampler,translucencyIntensitySamplerSampler,fragmentInputs.vTranslucencyIntensityUV+uvOffset);
#endif
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
var translucencyColorMap: vec4f=textureSample(translucencyColorSampler,translucencyColorSamplerSampler,fragmentInputs.vTranslucencyColorUV+uvOffset);
#endif
subSurfaceOut=subSurfaceBlock(
uniforms.vSubSurfaceIntensity
,uniforms.vThicknessParam
,uniforms.vTintColor
,normalW
,specularEnvironmentReflectance
#ifdef SS_THICKNESSANDMASK_TEXTURE
,thicknessMap
#endif
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
,refractionIntensityMap
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
,translucencyIntensityMap
#endif
#ifdef REFLECTION
#ifdef SS_TRANSLUCENCY
,uniforms.reflectionMatrix
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
,reflectionOut.irradianceVector
#endif
#if defined(REALTIME_FILTERING)
,reflectionSampler
,reflectionSamplerSampler
,vReflectionFilteringInfo
#endif
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#endif
#endif
#endif
#if defined(SS_REFRACTION) || defined(SS_TRANSLUCENCY)
,surfaceAlbedo
#endif
#ifdef SS_REFRACTION
,input.vPositionW
,viewDirectionW
,scene.view
,uniforms.vRefractionInfos
,uniforms.refractionMatrix
,uniforms.vRefractionMicrosurfaceInfos
,uniforms.vLightingIntensity
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
,alpha
#endif
#ifdef SS_LODINREFRACTIONALPHA
,NdotVUnclamped
#endif
#ifdef SS_LINEARSPECULARREFRACTION
,roughness
#endif
,alphaG
,refractionSampler
,refractionSamplerSampler
#ifndef LODBASEDMICROSFURACE
,refractionLowSampler
,refractionLowSamplerSampler
,refractionHighSampler
,refractionHighSamplerSampler
#endif
#ifdef ANISOTROPIC
,anisotropicOut
#endif
#ifdef REALTIME_FILTERING
,uniforms.vRefractionFilteringInfo
#endif
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
,uniforms.vRefractionPosition
,uniforms.vRefractionSize
#endif
#ifdef SS_DISPERSION
,dispersion
#endif
#endif
#ifdef SS_TRANSLUCENCY
,uniforms.vDiffusionDistance
,uniforms.vTranslucencyColor
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
,translucencyColorMap
#endif
#endif
);
#ifdef SS_REFRACTION
surfaceAlbedo=subSurfaceOut.surfaceAlbedo;
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
alpha=subSurfaceOut.alpha;
#endif
#endif
#else
subSurfaceOut.specularEnvironmentReflectance=specularEnvironmentReflectance;
#endif
#include<pbrBlockDirectLighting>
#include<lightFragment>[0..maxSimultaneousLights]
#include<pbrBlockFinalLitComponents>
#endif 
#include<pbrBlockFinalUnlitComponents>
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
#include<pbrBlockFinalColorComposition>
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
var writeGeometryInfo: f32=select(0.0,1.0,finalColor.a>0.4);var fragData: array<vec4<f32>,SCENE_MRT_COUNT>;
#ifdef PREPASS_POSITION
fragData[PREPASS_POSITION_INDEX]= vec4f(input.vPositionW,writeGeometryInfo);
#endif
#ifdef PREPASS_VELOCITY
var a: vec2f=(fragmentInputs.vCurrentPosition.xy/fragmentInputs.vCurrentPosition.w)*0.5+0.5;var b: vec2f=(fragmentInputs.vPreviousPosition.xy/fragmentInputs.vPreviousPosition.w)*0.5+0.5;var velocity: vec2f=abs(a-b);velocity= vec2f(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;fragData[PREPASS_VELOCITY_INDEX]= vec4f(velocity,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO_SQRT
var sqAlbedo: vec3f=sqrt(surfaceAlbedo); 
#endif
#ifdef PREPASS_IRRADIANCE
var irradiance: vec3f=finalDiffuse;
#ifndef UNLIT
#ifdef REFLECTION
irradiance+=finalIrradiance;
#endif
#endif
#ifdef SS_SCATTERING
fragData[0]= vec4f(finalColor.rgb-irradiance,finalColor.a); 
irradiance/=sqAlbedo;
#else
fragData[0]=finalColor; 
var scatteringDiffusionProfile: f32=255.;
#endif
fragData[PREPASS_IRRADIANCE_INDEX]= vec4f(clamp(irradiance, vec3f(0.), vec3f(1.)),writeGeometryInfo*scatteringDiffusionProfile/255.); 
#else
fragData[0]= vec4f(finalColor.rgb,finalColor.a);
#endif
#ifdef PREPASS_DEPTH
fragData[PREPASS_DEPTH_INDEX]= vec4f(fragmentInputs.vViewPos.z,0.0,0.0,writeGeometryInfo); 
#endif
#ifdef PREPASS_NORMAL
#ifdef PREPASS_NORMAL_WORLDSPACE
fragData[PREPASS_NORMAL_INDEX]= vec4f(normalW,writeGeometryInfo); 
#else
fragData[PREPASS_NORMAL_INDEX]= vec4f(normalize((scene.view* vec4f(normalW,0.0)).rgb),writeGeometryInfo); 
#endif
#endif
#ifdef PREPASS_ALBEDO_SQRT
fragData[PREPASS_ALBEDO_SQRT_INDEX]= vec4f(sqAlbedo,writeGeometryInfo); 
#endif
#ifdef PREPASS_REFLECTIVITY
#ifndef UNLIT
fragData[PREPASS_REFLECTIVITY_INDEX]= vec4f(specularEnvironmentR0,microSurface)*writeGeometryInfo;
#else
fragData[PREPASS_REFLECTIVITY_INDEX]= vec4f( 0.0,0.0,0.0,1.0 )*writeGeometryInfo;
#endif
#endif
#if SCENE_MRT_COUNT>0
fragmentOutputs.fragData0= fragData[0];
#endif
#if SCENE_MRT_COUNT>1
fragmentOutputs.fragData1= fragData[1];
#endif
#if SCENE_MRT_COUNT>2
fragmentOutputs.fragData2= fragData[2];
#endif
#if SCENE_MRT_COUNT>3
fragmentOutputs.fragData3= fragData[3];
#endif
#if SCENE_MRT_COUNT>4
fragmentOutputs.fragData4= fragData[4];
#endif
#if SCENE_MRT_COUNT>5
fragmentOutputs.fragData5= fragData[5];
#endif
#if SCENE_MRT_COUNT>6
fragmentOutputs.fragData6= fragData[6];
#endif
#if SCENE_MRT_COUNT>7
fragmentOutputs.fragData7= fragData[7];
#endif
#endif
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color=finalColor;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {fragmentOutputs.frontColor=vec4f(fragmentOutputs.frontColor.rgb+finalColor.rgb*finalColor.a*alphaMultiplier,1.0-alphaMultiplier*(1.0-finalColor.a));} else {fragmentOutputs.backColor+=finalColor;}
#endif
#include<pbrDebug>
#define CUSTOM_FRAGMENT_MAIN_END
}
`;
ShaderStore.ShadersStoreWGSL[name35] = shader35;
var pbrPixelShaderWGSL = {
  name: name35,
  shader: shader35
};

export {
  pbrPixelShaderWGSL
};
//# sourceMappingURL=chunk-RIHFU4E3.js.map
