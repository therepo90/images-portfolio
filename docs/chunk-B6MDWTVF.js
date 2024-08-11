import {
  Buffer,
  Color3,
  EngineStore,
  Logger,
  Vector3,
  VertexBuffer,
  __decorate,
  nativeOverride
} from "./chunk-P4ROUPGK.js";
import {
  ShaderStore
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Lights/lightConstants.js
var LightConstants = class {
  /**
   * Sort function to order lights for rendering.
   * @param a First Light object to compare to second.
   * @param b Second Light object to compare first.
   * @returns -1 to reduce's a's index relative to be, 0 for no change, 1 to increase a's index relative to b.
   */
  static CompareLightsPriority(a, b) {
    if (a.shadowEnabled !== b.shadowEnabled) {
      return (b.shadowEnabled ? 1 : 0) - (a.shadowEnabled ? 1 : 0);
    }
    return b.renderPriority - a.renderPriority;
  }
};
LightConstants.FALLOFF_DEFAULT = 0;
LightConstants.FALLOFF_PHYSICAL = 1;
LightConstants.FALLOFF_GLTF = 2;
LightConstants.FALLOFF_STANDARD = 3;
LightConstants.LIGHTMAP_DEFAULT = 0;
LightConstants.LIGHTMAP_SPECULAR = 1;
LightConstants.LIGHTMAP_SHADOWSONLY = 2;
LightConstants.INTENSITYMODE_AUTOMATIC = 0;
LightConstants.INTENSITYMODE_LUMINOUSPOWER = 1;
LightConstants.INTENSITYMODE_LUMINOUSINTENSITY = 2;
LightConstants.INTENSITYMODE_ILLUMINANCE = 3;
LightConstants.INTENSITYMODE_LUMINANCE = 4;
LightConstants.LIGHTTYPEID_POINTLIGHT = 0;
LightConstants.LIGHTTYPEID_DIRECTIONALLIGHT = 1;
LightConstants.LIGHTTYPEID_SPOTLIGHT = 2;
LightConstants.LIGHTTYPEID_HEMISPHERICLIGHT = 3;

// node_modules/@babylonjs/core/Materials/clipPlaneMaterialHelper.js
function addClipPlaneUniforms(uniforms) {
  if (uniforms.indexOf("vClipPlane") === -1) {
    uniforms.push("vClipPlane");
  }
  if (uniforms.indexOf("vClipPlane2") === -1) {
    uniforms.push("vClipPlane2");
  }
  if (uniforms.indexOf("vClipPlane3") === -1) {
    uniforms.push("vClipPlane3");
  }
  if (uniforms.indexOf("vClipPlane4") === -1) {
    uniforms.push("vClipPlane4");
  }
  if (uniforms.indexOf("vClipPlane5") === -1) {
    uniforms.push("vClipPlane5");
  }
  if (uniforms.indexOf("vClipPlane6") === -1) {
    uniforms.push("vClipPlane6");
  }
}
function prepareStringDefinesForClipPlanes(primaryHolder, secondaryHolder, defines) {
  const clipPlane = !!(primaryHolder.clipPlane ?? secondaryHolder.clipPlane);
  const clipPlane2 = !!(primaryHolder.clipPlane2 ?? secondaryHolder.clipPlane2);
  const clipPlane3 = !!(primaryHolder.clipPlane3 ?? secondaryHolder.clipPlane3);
  const clipPlane4 = !!(primaryHolder.clipPlane4 ?? secondaryHolder.clipPlane4);
  const clipPlane5 = !!(primaryHolder.clipPlane5 ?? secondaryHolder.clipPlane5);
  const clipPlane6 = !!(primaryHolder.clipPlane6 ?? secondaryHolder.clipPlane6);
  if (clipPlane) defines.push("#define CLIPPLANE");
  if (clipPlane2) defines.push("#define CLIPPLANE2");
  if (clipPlane3) defines.push("#define CLIPPLANE3");
  if (clipPlane4) defines.push("#define CLIPPLANE4");
  if (clipPlane5) defines.push("#define CLIPPLANE5");
  if (clipPlane6) defines.push("#define CLIPPLANE6");
}
function prepareDefinesForClipPlanes(primaryHolder, secondaryHolder, defines) {
  let changed = false;
  const clipPlane = !!(primaryHolder.clipPlane ?? secondaryHolder.clipPlane);
  const clipPlane2 = !!(primaryHolder.clipPlane2 ?? secondaryHolder.clipPlane2);
  const clipPlane3 = !!(primaryHolder.clipPlane3 ?? secondaryHolder.clipPlane3);
  const clipPlane4 = !!(primaryHolder.clipPlane4 ?? secondaryHolder.clipPlane4);
  const clipPlane5 = !!(primaryHolder.clipPlane5 ?? secondaryHolder.clipPlane5);
  const clipPlane6 = !!(primaryHolder.clipPlane6 ?? secondaryHolder.clipPlane6);
  if (defines["CLIPPLANE"] !== clipPlane) {
    defines["CLIPPLANE"] = clipPlane;
    changed = true;
  }
  if (defines["CLIPPLANE2"] !== clipPlane2) {
    defines["CLIPPLANE2"] = clipPlane2;
    changed = true;
  }
  if (defines["CLIPPLANE3"] !== clipPlane3) {
    defines["CLIPPLANE3"] = clipPlane3;
    changed = true;
  }
  if (defines["CLIPPLANE4"] !== clipPlane4) {
    defines["CLIPPLANE4"] = clipPlane4;
    changed = true;
  }
  if (defines["CLIPPLANE5"] !== clipPlane5) {
    defines["CLIPPLANE5"] = clipPlane5;
    changed = true;
  }
  if (defines["CLIPPLANE6"] !== clipPlane6) {
    defines["CLIPPLANE6"] = clipPlane6;
    changed = true;
  }
  return changed;
}
function bindClipPlane(effect, primaryHolder, secondaryHolder) {
  let clipPlane = primaryHolder.clipPlane ?? secondaryHolder.clipPlane;
  setClipPlane(effect, "vClipPlane", clipPlane);
  clipPlane = primaryHolder.clipPlane2 ?? secondaryHolder.clipPlane2;
  setClipPlane(effect, "vClipPlane2", clipPlane);
  clipPlane = primaryHolder.clipPlane3 ?? secondaryHolder.clipPlane3;
  setClipPlane(effect, "vClipPlane3", clipPlane);
  clipPlane = primaryHolder.clipPlane4 ?? secondaryHolder.clipPlane4;
  setClipPlane(effect, "vClipPlane4", clipPlane);
  clipPlane = primaryHolder.clipPlane5 ?? secondaryHolder.clipPlane5;
  setClipPlane(effect, "vClipPlane5", clipPlane);
  clipPlane = primaryHolder.clipPlane6 ?? secondaryHolder.clipPlane6;
  setClipPlane(effect, "vClipPlane6", clipPlane);
}
function setClipPlane(effect, uniformName, clipPlane) {
  if (clipPlane) {
    effect.setFloat4(uniformName, clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d);
  }
}

// node_modules/@babylonjs/core/Materials/materialHelper.functions.js
var _TempFogColor = Color3.Black();
var _TmpMorphInfluencers = {
  NUM_MORPH_INFLUENCERS: 0
};
function BindLogDepth(defines, effect, scene) {
  if (!defines || defines["LOGARITHMICDEPTH"] || defines.indexOf && defines.indexOf("LOGARITHMICDEPTH") >= 0) {
    const camera = scene.activeCamera;
    if (camera.mode === 1) {
      Logger.Error("Logarithmic depth is not compatible with orthographic cameras!", 20);
    }
    effect.setFloat("logarithmicDepthConstant", 2 / (Math.log(camera.maxZ + 1) / Math.LN2));
  }
}
function BindFogParameters(scene, mesh, effect, linearSpace = false) {
  if (effect && scene.fogEnabled && (!mesh || mesh.applyFog) && scene.fogMode !== 0) {
    effect.setFloat4("vFogInfos", scene.fogMode, scene.fogStart, scene.fogEnd, scene.fogDensity);
    if (linearSpace) {
      scene.fogColor.toLinearSpaceToRef(_TempFogColor, scene.getEngine().useExactSrgbConversions);
      effect.setColor3("vFogColor", _TempFogColor);
    } else {
      effect.setColor3("vFogColor", scene.fogColor);
    }
  }
}
function PrepareAttributesForMorphTargetsInfluencers(attribs, mesh, influencers) {
  _TmpMorphInfluencers.NUM_MORPH_INFLUENCERS = influencers;
  PrepareAttributesForMorphTargets(attribs, mesh, _TmpMorphInfluencers);
}
function PrepareAttributesForMorphTargets(attribs, mesh, defines) {
  const influencers = defines["NUM_MORPH_INFLUENCERS"];
  if (influencers > 0 && EngineStore.LastCreatedEngine) {
    const maxAttributesCount = EngineStore.LastCreatedEngine.getCaps().maxVertexAttribs;
    const manager = mesh.morphTargetManager;
    if (manager?.isUsingTextureForTargets) {
      return;
    }
    const normal = manager && manager.supportsNormals && defines["NORMAL"];
    const tangent = manager && manager.supportsTangents && defines["TANGENT"];
    const uv = manager && manager.supportsUVs && defines["UV1"];
    for (let index = 0; index < influencers; index++) {
      attribs.push(`position` + index);
      if (normal) {
        attribs.push(`normal` + index);
      }
      if (tangent) {
        attribs.push(`tangent` + index);
      }
      if (uv) {
        attribs.push(`uv_` + index);
      }
      if (attribs.length > maxAttributesCount) {
        Logger.Error("Cannot add more vertex attributes for mesh " + mesh.name);
      }
    }
  }
}
function PushAttributesForInstances(attribs, needsPreviousMatrices = false) {
  attribs.push("world0");
  attribs.push("world1");
  attribs.push("world2");
  attribs.push("world3");
  if (needsPreviousMatrices) {
    attribs.push("previousWorld0");
    attribs.push("previousWorld1");
    attribs.push("previousWorld2");
    attribs.push("previousWorld3");
  }
}
function BindMorphTargetParameters(abstractMesh, effect) {
  const manager = abstractMesh.morphTargetManager;
  if (!abstractMesh || !manager) {
    return;
  }
  effect.setFloatArray("morphTargetInfluences", manager.influences);
}
function BindSceneUniformBuffer(effect, sceneUbo) {
  sceneUbo.bindToEffect(effect, "Scene");
}
function PrepareDefinesForMergedUV(texture, defines, key) {
  defines._needUVs = true;
  defines[key] = true;
  if (texture.optimizeUVAllocation && texture.getTextureMatrix().isIdentityAs3x2()) {
    defines[key + "DIRECTUV"] = texture.coordinatesIndex + 1;
    defines["MAINUV" + (texture.coordinatesIndex + 1)] = true;
  } else {
    defines[key + "DIRECTUV"] = 0;
  }
}
function BindTextureMatrix(texture, uniformBuffer, key) {
  const matrix = texture.getTextureMatrix();
  uniformBuffer.updateMatrix(key + "Matrix", matrix);
}
function PrepareAttributesForBakedVertexAnimation(attribs, mesh, defines) {
  const enabled = defines["BAKED_VERTEX_ANIMATION_TEXTURE"] && defines["INSTANCES"];
  if (enabled) {
    attribs.push("bakedVertexAnimationSettingsInstanced");
  }
}
function _CopyBonesTransformationMatrices(source, target) {
  target.set(source);
  return target;
}
function BindBonesParameters(mesh, effect, prePassConfiguration) {
  if (!effect || !mesh) {
    return;
  }
  if (mesh.computeBonesUsingShaders && effect._bonesComputationForcedToCPU) {
    mesh.computeBonesUsingShaders = false;
  }
  if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
    const skeleton = mesh.skeleton;
    if (skeleton.isUsingTextureForMatrices && effect.getUniformIndex("boneTextureWidth") > -1) {
      const boneTexture = skeleton.getTransformMatrixTexture(mesh);
      effect.setTexture("boneSampler", boneTexture);
      effect.setFloat("boneTextureWidth", 4 * (skeleton.bones.length + 1));
    } else {
      const matrices = skeleton.getTransformMatrices(mesh);
      if (matrices) {
        effect.setMatrices("mBones", matrices);
        if (prePassConfiguration && mesh.getScene().prePassRenderer && mesh.getScene().prePassRenderer.getIndex(2)) {
          if (!prePassConfiguration.previousBones[mesh.uniqueId]) {
            prePassConfiguration.previousBones[mesh.uniqueId] = matrices.slice();
          }
          effect.setMatrices("mPreviousBones", prePassConfiguration.previousBones[mesh.uniqueId]);
          _CopyBonesTransformationMatrices(matrices, prePassConfiguration.previousBones[mesh.uniqueId]);
        }
      }
    }
  }
}
function BindLightProperties(light, effect, lightIndex) {
  light.transferToEffect(effect, lightIndex + "");
}
function BindLight(light, lightIndex, scene, effect, useSpecular, receiveShadows = true) {
  light._bindLight(lightIndex, scene, effect, useSpecular, receiveShadows);
}
function BindLights(scene, mesh, effect, defines, maxSimultaneousLights = 4) {
  const len = Math.min(mesh.lightSources.length, maxSimultaneousLights);
  for (let i = 0; i < len; i++) {
    const light = mesh.lightSources[i];
    BindLight(light, i, scene, effect, typeof defines === "boolean" ? defines : defines["SPECULARTERM"], mesh.receiveShadows);
  }
}
function PrepareAttributesForBones(attribs, mesh, defines, fallbacks) {
  if (defines["NUM_BONE_INFLUENCERS"] > 0) {
    fallbacks.addCPUSkinningFallback(0, mesh);
    attribs.push(`matricesIndices`);
    attribs.push(`matricesWeights`);
    if (defines["NUM_BONE_INFLUENCERS"] > 4) {
      attribs.push(`matricesIndicesExtra`);
      attribs.push(`matricesWeightsExtra`);
    }
  }
}
function PrepareAttributesForInstances(attribs, defines) {
  if (defines["INSTANCES"] || defines["THIN_INSTANCES"]) {
    PushAttributesForInstances(attribs, !!defines["PREPASS_VELOCITY"]);
  }
  if (defines.INSTANCESCOLOR) {
    attribs.push(`instanceColor`);
  }
}
function HandleFallbacksForShadows(defines, fallbacks, maxSimultaneousLights = 4, rank = 0) {
  let lightFallbackRank = 0;
  for (let lightIndex = 0; lightIndex < maxSimultaneousLights; lightIndex++) {
    if (!defines["LIGHT" + lightIndex]) {
      break;
    }
    if (lightIndex > 0) {
      lightFallbackRank = rank + lightIndex;
      fallbacks.addFallback(lightFallbackRank, "LIGHT" + lightIndex);
    }
    if (!defines["SHADOWS"]) {
      if (defines["SHADOW" + lightIndex]) {
        fallbacks.addFallback(rank, "SHADOW" + lightIndex);
      }
      if (defines["SHADOWPCF" + lightIndex]) {
        fallbacks.addFallback(rank, "SHADOWPCF" + lightIndex);
      }
      if (defines["SHADOWPCSS" + lightIndex]) {
        fallbacks.addFallback(rank, "SHADOWPCSS" + lightIndex);
      }
      if (defines["SHADOWPOISSON" + lightIndex]) {
        fallbacks.addFallback(rank, "SHADOWPOISSON" + lightIndex);
      }
      if (defines["SHADOWESM" + lightIndex]) {
        fallbacks.addFallback(rank, "SHADOWESM" + lightIndex);
      }
      if (defines["SHADOWCLOSEESM" + lightIndex]) {
        fallbacks.addFallback(rank, "SHADOWCLOSEESM" + lightIndex);
      }
    }
  }
  return lightFallbackRank++;
}
function GetFogState(mesh, scene) {
  return scene.fogEnabled && mesh.applyFog && scene.fogMode !== 0;
}
function PrepareDefinesForMisc(mesh, scene, useLogarithmicDepth, pointsCloud, fogEnabled, alphaTest, defines, applyDecalAfterDetail = false) {
  if (defines._areMiscDirty) {
    defines["LOGARITHMICDEPTH"] = useLogarithmicDepth;
    defines["POINTSIZE"] = pointsCloud;
    defines["FOG"] = fogEnabled && GetFogState(mesh, scene);
    defines["NONUNIFORMSCALING"] = mesh.nonUniformScaling;
    defines["ALPHATEST"] = alphaTest;
    defines["DECAL_AFTER_DETAIL"] = applyDecalAfterDetail;
  }
}
function PrepareDefinesForLights(scene, mesh, defines, specularSupported, maxSimultaneousLights = 4, disableLighting = false) {
  if (!defines._areLightsDirty) {
    return defines._needNormals;
  }
  let lightIndex = 0;
  const state = {
    needNormals: defines._needNormals,
    needRebuild: false,
    lightmapMode: false,
    shadowEnabled: false,
    specularEnabled: false
  };
  if (scene.lightsEnabled && !disableLighting) {
    for (const light of mesh.lightSources) {
      PrepareDefinesForLight(scene, mesh, light, lightIndex, defines, specularSupported, state);
      lightIndex++;
      if (lightIndex === maxSimultaneousLights) {
        break;
      }
    }
  }
  defines["SPECULARTERM"] = state.specularEnabled;
  defines["SHADOWS"] = state.shadowEnabled;
  for (let index = lightIndex; index < maxSimultaneousLights; index++) {
    if (defines["LIGHT" + index] !== void 0) {
      defines["LIGHT" + index] = false;
      defines["HEMILIGHT" + index] = false;
      defines["POINTLIGHT" + index] = false;
      defines["DIRLIGHT" + index] = false;
      defines["SPOTLIGHT" + index] = false;
      defines["SHADOW" + index] = false;
      defines["SHADOWCSM" + index] = false;
      defines["SHADOWCSMDEBUG" + index] = false;
      defines["SHADOWCSMNUM_CASCADES" + index] = false;
      defines["SHADOWCSMUSESHADOWMAXZ" + index] = false;
      defines["SHADOWCSMNOBLEND" + index] = false;
      defines["SHADOWCSM_RIGHTHANDED" + index] = false;
      defines["SHADOWPCF" + index] = false;
      defines["SHADOWPCSS" + index] = false;
      defines["SHADOWPOISSON" + index] = false;
      defines["SHADOWESM" + index] = false;
      defines["SHADOWCLOSEESM" + index] = false;
      defines["SHADOWCUBE" + index] = false;
      defines["SHADOWLOWQUALITY" + index] = false;
      defines["SHADOWMEDIUMQUALITY" + index] = false;
    }
  }
  const caps = scene.getEngine().getCaps();
  if (defines["SHADOWFLOAT"] === void 0) {
    state.needRebuild = true;
  }
  defines["SHADOWFLOAT"] = state.shadowEnabled && (caps.textureFloatRender && caps.textureFloatLinearFiltering || caps.textureHalfFloatRender && caps.textureHalfFloatLinearFiltering);
  defines["LIGHTMAPEXCLUDED"] = state.lightmapMode;
  if (state.needRebuild) {
    defines.rebuild();
  }
  return state.needNormals;
}
function PrepareDefinesForLight(scene, mesh, light, lightIndex, defines, specularSupported, state) {
  state.needNormals = true;
  if (defines["LIGHT" + lightIndex] === void 0) {
    state.needRebuild = true;
  }
  defines["LIGHT" + lightIndex] = true;
  defines["SPOTLIGHT" + lightIndex] = false;
  defines["HEMILIGHT" + lightIndex] = false;
  defines["POINTLIGHT" + lightIndex] = false;
  defines["DIRLIGHT" + lightIndex] = false;
  light.prepareLightSpecificDefines(defines, lightIndex);
  defines["LIGHT_FALLOFF_PHYSICAL" + lightIndex] = false;
  defines["LIGHT_FALLOFF_GLTF" + lightIndex] = false;
  defines["LIGHT_FALLOFF_STANDARD" + lightIndex] = false;
  switch (light.falloffType) {
    case LightConstants.FALLOFF_GLTF:
      defines["LIGHT_FALLOFF_GLTF" + lightIndex] = true;
      break;
    case LightConstants.FALLOFF_PHYSICAL:
      defines["LIGHT_FALLOFF_PHYSICAL" + lightIndex] = true;
      break;
    case LightConstants.FALLOFF_STANDARD:
      defines["LIGHT_FALLOFF_STANDARD" + lightIndex] = true;
      break;
  }
  if (specularSupported && !light.specular.equalsFloats(0, 0, 0)) {
    state.specularEnabled = true;
  }
  defines["SHADOW" + lightIndex] = false;
  defines["SHADOWCSM" + lightIndex] = false;
  defines["SHADOWCSMDEBUG" + lightIndex] = false;
  defines["SHADOWCSMNUM_CASCADES" + lightIndex] = false;
  defines["SHADOWCSMUSESHADOWMAXZ" + lightIndex] = false;
  defines["SHADOWCSMNOBLEND" + lightIndex] = false;
  defines["SHADOWCSM_RIGHTHANDED" + lightIndex] = false;
  defines["SHADOWPCF" + lightIndex] = false;
  defines["SHADOWPCSS" + lightIndex] = false;
  defines["SHADOWPOISSON" + lightIndex] = false;
  defines["SHADOWESM" + lightIndex] = false;
  defines["SHADOWCLOSEESM" + lightIndex] = false;
  defines["SHADOWCUBE" + lightIndex] = false;
  defines["SHADOWLOWQUALITY" + lightIndex] = false;
  defines["SHADOWMEDIUMQUALITY" + lightIndex] = false;
  if (mesh && mesh.receiveShadows && scene.shadowsEnabled && light.shadowEnabled) {
    const shadowGenerator = light.getShadowGenerator(scene.activeCamera) ?? light.getShadowGenerator();
    if (shadowGenerator) {
      const shadowMap = shadowGenerator.getShadowMap();
      if (shadowMap) {
        if (shadowMap.renderList && shadowMap.renderList.length > 0) {
          state.shadowEnabled = true;
          shadowGenerator.prepareDefines(defines, lightIndex);
        }
      }
    }
  }
  if (light.lightmapMode != LightConstants.LIGHTMAP_DEFAULT) {
    state.lightmapMode = true;
    defines["LIGHTMAPEXCLUDED" + lightIndex] = true;
    defines["LIGHTMAPNOSPECULAR" + lightIndex] = light.lightmapMode == LightConstants.LIGHTMAP_SHADOWSONLY;
  } else {
    defines["LIGHTMAPEXCLUDED" + lightIndex] = false;
    defines["LIGHTMAPNOSPECULAR" + lightIndex] = false;
  }
}
function PrepareDefinesForFrameBoundValues(scene, engine, material, defines, useInstances, useClipPlane = null, useThinInstances = false) {
  let changed = PrepareDefinesForCamera(scene, defines);
  if (useClipPlane !== false) {
    changed = prepareDefinesForClipPlanes(material, scene, defines);
  }
  if (defines["DEPTHPREPASS"] !== !engine.getColorWrite()) {
    defines["DEPTHPREPASS"] = !defines["DEPTHPREPASS"];
    changed = true;
  }
  if (defines["INSTANCES"] !== useInstances) {
    defines["INSTANCES"] = useInstances;
    changed = true;
  }
  if (defines["THIN_INSTANCES"] !== useThinInstances) {
    defines["THIN_INSTANCES"] = useThinInstances;
    changed = true;
  }
  if (changed) {
    defines.markAsUnprocessed();
  }
}
function PrepareDefinesForBones(mesh, defines) {
  if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
    defines["NUM_BONE_INFLUENCERS"] = mesh.numBoneInfluencers;
    const materialSupportsBoneTexture = defines["BONETEXTURE"] !== void 0;
    if (mesh.skeleton.isUsingTextureForMatrices && materialSupportsBoneTexture) {
      defines["BONETEXTURE"] = true;
    } else {
      defines["BonesPerMesh"] = mesh.skeleton.bones.length + 1;
      defines["BONETEXTURE"] = materialSupportsBoneTexture ? false : void 0;
      const prePassRenderer = mesh.getScene().prePassRenderer;
      if (prePassRenderer && prePassRenderer.enabled) {
        const nonExcluded = prePassRenderer.excludedSkinnedMesh.indexOf(mesh) === -1;
        defines["BONES_VELOCITY_ENABLED"] = nonExcluded;
      }
    }
  } else {
    defines["NUM_BONE_INFLUENCERS"] = 0;
    defines["BonesPerMesh"] = 0;
    if (defines["BONETEXTURE"] !== void 0) {
      defines["BONETEXTURE"] = false;
    }
  }
}
function PrepareDefinesForMorphTargets(mesh, defines) {
  const manager = mesh.morphTargetManager;
  if (manager) {
    defines["MORPHTARGETS_UV"] = manager.supportsUVs && defines["UV1"];
    defines["MORPHTARGETS_TANGENT"] = manager.supportsTangents && defines["TANGENT"];
    defines["MORPHTARGETS_NORMAL"] = manager.supportsNormals && defines["NORMAL"];
    defines["NUM_MORPH_INFLUENCERS"] = manager.numMaxInfluencers || manager.numInfluencers;
    defines["MORPHTARGETS"] = defines["NUM_MORPH_INFLUENCERS"] > 0;
    defines["MORPHTARGETS_TEXTURE"] = manager.isUsingTextureForTargets;
  } else {
    defines["MORPHTARGETS_UV"] = false;
    defines["MORPHTARGETS_TANGENT"] = false;
    defines["MORPHTARGETS_NORMAL"] = false;
    defines["MORPHTARGETS"] = false;
    defines["NUM_MORPH_INFLUENCERS"] = 0;
  }
}
function PrepareDefinesForBakedVertexAnimation(mesh, defines) {
  const manager = mesh.bakedVertexAnimationManager;
  defines["BAKED_VERTEX_ANIMATION_TEXTURE"] = manager && manager.isEnabled ? true : false;
}
function PrepareDefinesForAttributes(mesh, defines, useVertexColor, useBones, useMorphTargets = false, useVertexAlpha = true, useBakedVertexAnimation = true) {
  if (!defines._areAttributesDirty && defines._needNormals === defines._normals && defines._needUVs === defines._uvs) {
    return false;
  }
  defines._normals = defines._needNormals;
  defines._uvs = defines._needUVs;
  defines["NORMAL"] = defines._needNormals && mesh.isVerticesDataPresent(`normal`);
  if (defines._needNormals && mesh.isVerticesDataPresent(`tangent`)) {
    defines["TANGENT"] = true;
  }
  for (let i = 1; i <= 6; ++i) {
    defines["UV" + i] = defines._needUVs ? mesh.isVerticesDataPresent(`uv${i === 1 ? "" : i}`) : false;
  }
  if (useVertexColor) {
    const hasVertexColors = mesh.useVertexColors && mesh.isVerticesDataPresent(`color`);
    defines["VERTEXCOLOR"] = hasVertexColors;
    defines["VERTEXALPHA"] = mesh.hasVertexAlpha && hasVertexColors && useVertexAlpha;
  }
  if (mesh.isVerticesDataPresent(`instanceColor`) && (mesh.hasInstances || mesh.hasThinInstances)) {
    defines["INSTANCESCOLOR"] = true;
  }
  if (useBones) {
    PrepareDefinesForBones(mesh, defines);
  }
  if (useMorphTargets) {
    PrepareDefinesForMorphTargets(mesh, defines);
  }
  if (useBakedVertexAnimation) {
    PrepareDefinesForBakedVertexAnimation(mesh, defines);
  }
  return true;
}
function PrepareDefinesForMultiview(scene, defines) {
  if (scene.activeCamera) {
    const previousMultiview = defines.MULTIVIEW;
    defines.MULTIVIEW = scene.activeCamera.outputRenderTarget !== null && scene.activeCamera.outputRenderTarget.getViewCount() > 1;
    if (defines.MULTIVIEW != previousMultiview) {
      defines.markAsUnprocessed();
    }
  }
}
function PrepareDefinesForOIT(scene, defines, needAlphaBlending) {
  const previousDefine = defines.ORDER_INDEPENDENT_TRANSPARENCY;
  const previousDefine16Bits = defines.ORDER_INDEPENDENT_TRANSPARENCY_16BITS;
  defines.ORDER_INDEPENDENT_TRANSPARENCY = scene.useOrderIndependentTransparency && needAlphaBlending;
  defines.ORDER_INDEPENDENT_TRANSPARENCY_16BITS = !scene.getEngine().getCaps().textureFloatLinearFiltering;
  if (previousDefine !== defines.ORDER_INDEPENDENT_TRANSPARENCY || previousDefine16Bits !== defines.ORDER_INDEPENDENT_TRANSPARENCY_16BITS) {
    defines.markAsUnprocessed();
  }
}
function PrepareDefinesForPrePass(scene, defines, canRenderToMRT) {
  const previousPrePass = defines.PREPASS;
  if (!defines._arePrePassDirty) {
    return;
  }
  const texturesList = [{
    type: 1,
    define: "PREPASS_POSITION",
    index: "PREPASS_POSITION_INDEX"
  }, {
    type: 2,
    define: "PREPASS_VELOCITY",
    index: "PREPASS_VELOCITY_INDEX"
  }, {
    type: 3,
    define: "PREPASS_REFLECTIVITY",
    index: "PREPASS_REFLECTIVITY_INDEX"
  }, {
    type: 0,
    define: "PREPASS_IRRADIANCE",
    index: "PREPASS_IRRADIANCE_INDEX"
  }, {
    type: 7,
    define: "PREPASS_ALBEDO_SQRT",
    index: "PREPASS_ALBEDO_SQRT_INDEX"
  }, {
    type: 5,
    define: "PREPASS_DEPTH",
    index: "PREPASS_DEPTH_INDEX"
  }, {
    type: 6,
    define: "PREPASS_NORMAL",
    index: "PREPASS_NORMAL_INDEX"
  }];
  if (scene.prePassRenderer && scene.prePassRenderer.enabled && canRenderToMRT) {
    defines.PREPASS = true;
    defines.SCENE_MRT_COUNT = scene.prePassRenderer.mrtCount;
    defines.PREPASS_NORMAL_WORLDSPACE = scene.prePassRenderer.generateNormalsInWorldSpace;
    for (let i = 0; i < texturesList.length; i++) {
      const index = scene.prePassRenderer.getIndex(texturesList[i].type);
      if (index !== -1) {
        defines[texturesList[i].define] = true;
        defines[texturesList[i].index] = index;
      } else {
        defines[texturesList[i].define] = false;
      }
    }
  } else {
    defines.PREPASS = false;
    for (let i = 0; i < texturesList.length; i++) {
      defines[texturesList[i].define] = false;
    }
  }
  if (defines.PREPASS != previousPrePass) {
    defines.markAsUnprocessed();
    defines.markAsImageProcessingDirty();
  }
}
function PrepareDefinesForCamera(scene, defines) {
  let changed = false;
  if (scene.activeCamera) {
    const wasOrtho = defines["CAMERA_ORTHOGRAPHIC"] ? 1 : 0;
    const wasPersp = defines["CAMERA_PERSPECTIVE"] ? 1 : 0;
    const isOrtho = scene.activeCamera.mode === 1 ? 1 : 0;
    const isPersp = scene.activeCamera.mode === 0 ? 1 : 0;
    if (wasOrtho ^ isOrtho || wasPersp ^ isPersp) {
      defines["CAMERA_ORTHOGRAPHIC"] = isOrtho === 1;
      defines["CAMERA_PERSPECTIVE"] = isPersp === 1;
      changed = true;
    }
  }
  return changed;
}
function PrepareUniformsAndSamplersForLight(lightIndex, uniformsList, samplersList, projectedLightTexture, uniformBuffersList = null, updateOnlyBuffersList = false) {
  if (uniformBuffersList) {
    uniformBuffersList.push("Light" + lightIndex);
  }
  if (updateOnlyBuffersList) {
    return;
  }
  uniformsList.push("vLightData" + lightIndex, "vLightDiffuse" + lightIndex, "vLightSpecular" + lightIndex, "vLightDirection" + lightIndex, "vLightFalloff" + lightIndex, "vLightGround" + lightIndex, "lightMatrix" + lightIndex, "shadowsInfo" + lightIndex, "depthValues" + lightIndex);
  samplersList.push("shadowTexture" + lightIndex);
  samplersList.push("depthTexture" + lightIndex);
  uniformsList.push("viewFrustumZ" + lightIndex, "cascadeBlendFactor" + lightIndex, "lightSizeUVCorrection" + lightIndex, "depthCorrection" + lightIndex, "penumbraDarkness" + lightIndex, "frustumLengths" + lightIndex);
  if (projectedLightTexture) {
    samplersList.push("projectionLightTexture" + lightIndex);
    uniformsList.push("textureProjectionMatrix" + lightIndex);
  }
}
function PrepareUniformsAndSamplersList(uniformsListOrOptions, samplersList, defines, maxSimultaneousLights = 4) {
  let uniformsList;
  let uniformBuffersList = null;
  if (uniformsListOrOptions.uniformsNames) {
    const options = uniformsListOrOptions;
    uniformsList = options.uniformsNames;
    uniformBuffersList = options.uniformBuffersNames;
    samplersList = options.samplers;
    defines = options.defines;
    maxSimultaneousLights = options.maxSimultaneousLights || 0;
  } else {
    uniformsList = uniformsListOrOptions;
    if (!samplersList) {
      samplersList = [];
    }
  }
  for (let lightIndex = 0; lightIndex < maxSimultaneousLights; lightIndex++) {
    if (!defines["LIGHT" + lightIndex]) {
      break;
    }
    PrepareUniformsAndSamplersForLight(lightIndex, uniformsList, samplersList, defines["PROJECTEDLIGHTTEXTURE" + lightIndex], uniformBuffersList);
  }
  if (defines["NUM_MORPH_INFLUENCERS"]) {
    uniformsList.push("morphTargetInfluences");
    uniformsList.push("morphTargetCount");
  }
  if (defines["BAKED_VERTEX_ANIMATION_TEXTURE"]) {
    uniformsList.push("bakedVertexAnimationSettings");
    uniformsList.push("bakedVertexAnimationTextureSizeInverted");
    uniformsList.push("bakedVertexAnimationTime");
    samplersList.push("bakedVertexAnimationTexture");
  }
}

// node_modules/@babylonjs/core/Maths/math.functions.js
var MathHelpers = class {
  static extractMinAndMaxIndexed(positions, indices, indexStart, indexCount, minimum, maximum) {
    for (let index = indexStart; index < indexStart + indexCount; index++) {
      const offset = indices[index] * 3;
      const x = positions[offset];
      const y = positions[offset + 1];
      const z = positions[offset + 2];
      minimum.minimizeInPlaceFromFloats(x, y, z);
      maximum.maximizeInPlaceFromFloats(x, y, z);
    }
  }
  static extractMinAndMax(positions, start, count, stride, minimum, maximum) {
    for (let index = start, offset = start * stride; index < start + count; index++, offset += stride) {
      const x = positions[offset];
      const y = positions[offset + 1];
      const z = positions[offset + 2];
      minimum.minimizeInPlaceFromFloats(x, y, z);
      maximum.maximizeInPlaceFromFloats(x, y, z);
    }
  }
};
__decorate([
  nativeOverride.filter((...[positions, indices]) => !Array.isArray(positions) && !Array.isArray(indices))
  // eslint-disable-next-line @typescript-eslint/naming-convention
], MathHelpers, "extractMinAndMaxIndexed", null);
__decorate([
  nativeOverride.filter((...[positions]) => !Array.isArray(positions))
  // eslint-disable-next-line @typescript-eslint/naming-convention
], MathHelpers, "extractMinAndMax", null);
function extractMinAndMaxIndexed(positions, indices, indexStart, indexCount, bias = null) {
  const minimum = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
  const maximum = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
  MathHelpers.extractMinAndMaxIndexed(positions, indices, indexStart, indexCount, minimum, maximum);
  if (bias) {
    minimum.x -= minimum.x * bias.x + bias.y;
    minimum.y -= minimum.y * bias.x + bias.y;
    minimum.z -= minimum.z * bias.x + bias.y;
    maximum.x += maximum.x * bias.x + bias.y;
    maximum.y += maximum.y * bias.x + bias.y;
    maximum.z += maximum.z * bias.x + bias.y;
  }
  return {
    minimum,
    maximum
  };
}
function extractMinAndMax(positions, start, count, bias = null, stride) {
  const minimum = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
  const maximum = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
  if (!stride) {
    stride = 3;
  }
  MathHelpers.extractMinAndMax(positions, start, count, stride, minimum, maximum);
  if (bias) {
    minimum.x -= minimum.x * bias.x + bias.y;
    minimum.y -= minimum.y * bias.x + bias.y;
    minimum.z -= minimum.z * bias.x + bias.y;
    maximum.x += maximum.x * bias.x + bias.y;
    maximum.y += maximum.y * bias.x + bias.y;
    maximum.z += maximum.z * bias.x + bias.y;
  }
  return {
    minimum,
    maximum
  };
}

// node_modules/@babylonjs/core/Shaders/gpuTransform.vertex.js
var name = "gpuTransformVertexShader";
var shader = `attribute vec3 position;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
out vec3 outPosition;const mat4 identity=mat4(
vec4(1.0,0.0,0.0,0.0),
vec4(0.0,1.0,0.0,0.0),
vec4(0.0,0.0,1.0,0.0),
vec4(0.0,0.0,0.0,1.0)
);void main(void) {vec3 positionUpdated=position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
mat4 finalWorld=identity;
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);outPosition=worldPos.xyz;}`;
ShaderStore.ShadersStore[name] = shader;

// node_modules/@babylonjs/core/Shaders/gpuTransform.fragment.js
var name2 = "gpuTransformPixelShader";
var shader2 = `#version 300 es
void main() {discard;}
`;
ShaderStore.ShadersStore[name2] = shader2;

// node_modules/@babylonjs/core/Culling/Helper/transformFeedbackBoundingHelper.js
var TransformFeedbackBoundingHelper = class _TransformFeedbackBoundingHelper {
  /**
   * Creates a new TransformFeedbackBoundingHelper
   * @param engine defines the engine to use
   */
  constructor(engine) {
    this._buffers = {};
    this._effects = {};
    this._meshListCounter = 0;
    this._engine = engine;
  }
  /** @internal */
  processAsync(meshes) {
    if (!Array.isArray(meshes)) {
      meshes = [meshes];
    }
    this._meshListCounter = 0;
    this._processMeshList(meshes);
    return Promise.resolve();
  }
  _processMeshList(meshes) {
    const parallelShaderCompile = this._engine.getCaps().parallelShaderCompile;
    this._engine.getCaps().parallelShaderCompile = void 0;
    for (let i = 0; i < meshes.length; ++i) {
      const mesh = meshes[i];
      const vertexCount = mesh.getTotalVertices();
      if (vertexCount === 0 || !mesh.getVertexBuffer || !mesh.getVertexBuffer(VertexBuffer.PositionKind)) {
        continue;
      }
      let computeEffect;
      let numInfluencers = 0;
      const defines = [];
      let uniforms = [];
      const attribs = [VertexBuffer.PositionKind];
      const samplers = [];
      if (mesh && mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
        attribs.push(VertexBuffer.MatricesIndicesKind);
        attribs.push(VertexBuffer.MatricesWeightsKind);
        if (mesh.numBoneInfluencers > 4) {
          attribs.push(VertexBuffer.MatricesIndicesExtraKind);
          attribs.push(VertexBuffer.MatricesWeightsExtraKind);
        }
        const skeleton = mesh.skeleton;
        defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
        if (skeleton.isUsingTextureForMatrices) {
          defines.push("#define BONETEXTURE");
          if (uniforms.indexOf("boneTextureWidth") === -1) {
            uniforms.push("boneTextureWidth");
          }
          if (samplers.indexOf("boneSampler") === -1) {
            samplers.push("boneSampler");
          }
        } else {
          defines.push("#define BonesPerMesh " + (skeleton.bones.length + 1));
          if (uniforms.indexOf("mBones") === -1) {
            uniforms.push("mBones");
          }
        }
      } else {
        defines.push("#define NUM_BONE_INFLUENCERS 0");
      }
      const manager = mesh ? mesh.morphTargetManager : null;
      if (manager) {
        numInfluencers = manager.numMaxInfluencers || manager.numInfluencers;
        if (numInfluencers > 0) {
          defines.push("#define MORPHTARGETS");
        }
        if (manager.isUsingTextureForTargets) {
          defines.push("#define MORPHTARGETS_TEXTURE");
          if (uniforms.indexOf("morphTargetTextureIndices") === -1) {
            uniforms.push("morphTargetTextureIndices");
          }
          if (samplers.indexOf("morphTargets") === -1) {
            samplers.push("morphTargets");
          }
        }
        defines.push("#define NUM_MORPH_INFLUENCERS " + numInfluencers);
        for (let index = 0; index < numInfluencers; index++) {
          attribs.push(VertexBuffer.PositionKind + index);
        }
        if (numInfluencers > 0) {
          uniforms = uniforms.slice();
          uniforms.push("morphTargetInfluences");
          uniforms.push("morphTargetCount");
          uniforms.push("morphTargetTextureInfo");
          uniforms.push("morphTargetTextureIndices");
        }
      }
      const bvaManager = mesh.bakedVertexAnimationManager;
      if (bvaManager && bvaManager.isEnabled) {
        defines.push("#define BAKED_VERTEX_ANIMATION_TEXTURE");
        if (uniforms.indexOf("bakedVertexAnimationSettings") === -1) {
          uniforms.push("bakedVertexAnimationSettings");
        }
        if (uniforms.indexOf("bakedVertexAnimationTextureSizeInverted") === -1) {
          uniforms.push("bakedVertexAnimationTextureSizeInverted");
        }
        if (uniforms.indexOf("bakedVertexAnimationTime") === -1) {
          uniforms.push("bakedVertexAnimationTime");
        }
        if (samplers.indexOf("bakedVertexAnimationTexture") === -1) {
          samplers.push("bakedVertexAnimationTexture");
        }
        PrepareAttributesForBakedVertexAnimation(attribs, mesh, defines);
      }
      const join = defines.join("\n");
      if (!this._effects[join]) {
        const computeEffectOptions = {
          attributes: attribs,
          uniformsNames: uniforms,
          uniformBuffersNames: [],
          samplers,
          defines: join,
          fallbacks: null,
          onCompiled: null,
          onError: null,
          indexParameters: {
            maxSimultaneousMorphTargets: numInfluencers
          },
          maxSimultaneousLights: 0,
          transformFeedbackVaryings: ["outPosition"]
        };
        computeEffect = this._engine.createEffect("gpuTransform", computeEffectOptions, this._engine);
        this._effects[join] = computeEffect;
      } else {
        computeEffect = this._effects[join];
      }
      this._compute(mesh, computeEffect);
    }
    this._engine.getCaps().parallelShaderCompile = parallelShaderCompile;
  }
  _compute(mesh, effect) {
    const engine = this._engine;
    let targetBuffer;
    const vertexCount = mesh.getTotalVertices();
    if (!this._buffers[mesh.uniqueId]) {
      const targetData = new Float32Array(vertexCount * 3);
      targetBuffer = new Buffer(mesh.getEngine(), targetData, true, 3);
      this._buffers[mesh.uniqueId] = targetBuffer;
    } else {
      targetBuffer = this._buffers[mesh.uniqueId];
    }
    effect.getEngine().enableEffect(effect);
    mesh._bindDirect(effect, null, true);
    BindBonesParameters(mesh, effect);
    const manager = mesh.morphTargetManager;
    if (manager && manager.numInfluencers > 0) {
      BindMorphTargetParameters(mesh, effect);
    }
    const bvaManager = mesh.bakedVertexAnimationManager;
    if (bvaManager && bvaManager.isEnabled) {
      mesh.bakedVertexAnimationManager?.bind(effect, false);
    }
    const arrayBuffer = targetBuffer.getData();
    engine.bindTransformFeedbackBuffer(targetBuffer.getBuffer());
    engine.setRasterizerState(false);
    engine.beginTransformFeedback(true);
    engine.drawArraysType(2, 0, vertexCount);
    engine.endTransformFeedback();
    engine.setRasterizerState(true);
    engine.readTransformFeedbackBuffer(arrayBuffer);
    engine.bindTransformFeedbackBuffer(null);
    if (this._meshListCounter === 0) {
      mesh._refreshBoundingInfo(arrayBuffer, null);
    } else {
      const bb = mesh.getBoundingInfo().boundingBox;
      const extend = extractMinAndMax(arrayBuffer, 0, vertexCount);
      _TransformFeedbackBoundingHelper._Min.copyFrom(bb.minimum).minimizeInPlace(extend.minimum);
      _TransformFeedbackBoundingHelper._Max.copyFrom(bb.maximum).maximizeInPlace(extend.maximum);
      mesh._refreshBoundingInfoDirect({
        minimum: _TransformFeedbackBoundingHelper._Min,
        maximum: _TransformFeedbackBoundingHelper._Max
      });
    }
  }
  /** @internal */
  registerMeshListAsync(meshes) {
    if (!Array.isArray(meshes)) {
      meshes = [meshes];
    }
    this._meshList = meshes;
    this._meshListCounter = 0;
    return Promise.resolve();
  }
  /** @internal */
  processMeshList() {
    if (this._meshList.length === 0) {
      return;
    }
    this._processMeshList(this._meshList);
    this._meshListCounter++;
  }
  /** @internal */
  fetchResultsForMeshListAsync() {
    this._meshListCounter = 0;
    return Promise.resolve();
  }
  /** @internal */
  dispose() {
    for (const key in this._buffers) {
      this._buffers[key].dispose();
    }
    this._buffers = {};
    this._effects = {};
    this._engine = null;
  }
};
TransformFeedbackBoundingHelper._Min = new Vector3();
TransformFeedbackBoundingHelper._Max = new Vector3();

export {
  LightConstants,
  extractMinAndMaxIndexed,
  extractMinAndMax,
  addClipPlaneUniforms,
  prepareStringDefinesForClipPlanes,
  bindClipPlane,
  BindLogDepth,
  BindFogParameters,
  PrepareAttributesForMorphTargetsInfluencers,
  PrepareAttributesForMorphTargets,
  PushAttributesForInstances,
  BindMorphTargetParameters,
  BindSceneUniformBuffer,
  PrepareDefinesForMergedUV,
  BindTextureMatrix,
  PrepareAttributesForBakedVertexAnimation,
  BindBonesParameters,
  BindLightProperties,
  BindLight,
  BindLights,
  PrepareAttributesForBones,
  PrepareAttributesForInstances,
  HandleFallbacksForShadows,
  GetFogState,
  PrepareDefinesForMisc,
  PrepareDefinesForLights,
  PrepareDefinesForLight,
  PrepareDefinesForFrameBoundValues,
  PrepareDefinesForBones,
  PrepareDefinesForMorphTargets,
  PrepareDefinesForBakedVertexAnimation,
  PrepareDefinesForAttributes,
  PrepareDefinesForMultiview,
  PrepareDefinesForOIT,
  PrepareDefinesForPrePass,
  PrepareDefinesForCamera,
  PrepareUniformsAndSamplersForLight,
  PrepareUniformsAndSamplersList,
  TransformFeedbackBoundingHelper
};
//# sourceMappingURL=chunk-B6MDWTVF.js.map
