import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Shaders/ShadersInclude/imageProcessingDeclaration.js
var name = "imageProcessingDeclaration";
var shader = `#ifdef EXPOSURE
uniform float exposureLinear;
#endif
#ifdef CONTRAST
uniform float contrast;
#endif
#if defined(VIGNETTE) || defined(DITHER)
uniform vec2 vInverseScreenSize;
#endif
#ifdef VIGNETTE
uniform vec4 vignetteSettings1;uniform vec4 vignetteSettings2;
#endif
#ifdef COLORCURVES
uniform vec4 vCameraColorCurveNegative;uniform vec4 vCameraColorCurveNeutral;uniform vec4 vCameraColorCurvePositive;
#endif
#ifdef COLORGRADING
#ifdef COLORGRADING3D
uniform highp sampler3D txColorTransform;
#else
uniform sampler2D txColorTransform;
#endif
uniform vec4 colorTransformSettings;
#endif
#ifdef DITHER
uniform float ditherIntensity;
#endif
`;
ShaderStore.IncludesShadersStore[name] = shader;
var imageProcessingDeclaration = {
  name,
  shader
};

export {
  imageProcessingDeclaration
};
//# sourceMappingURL=chunk-FY6BV7NW.js.map
