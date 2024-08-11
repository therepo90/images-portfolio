var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __reflectGet = Reflect.get;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __superGet = (cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/@babylonjs/core/Engines/shaderStore.js
var ShaderStore = class _ShaderStore {
  /**
   * Gets the shaders repository path for a given shader language
   * @param shaderLanguage the shader language
   * @returns the path to the shaders repository
   */
  static GetShadersRepository(shaderLanguage = 0) {
    return shaderLanguage === 0 ? _ShaderStore.ShadersRepository : _ShaderStore.ShadersRepositoryWGSL;
  }
  /**
   * Gets the shaders store of a given shader language
   * @param shaderLanguage the shader language
   * @returns the shaders store
   */
  static GetShadersStore(shaderLanguage = 0) {
    return shaderLanguage === 0 ? _ShaderStore.ShadersStore : _ShaderStore.ShadersStoreWGSL;
  }
  /**
   * Gets the include shaders store of a given shader language
   * @param shaderLanguage the shader language
   * @returns the include shaders store
   */
  static GetIncludesShadersStore(shaderLanguage = 0) {
    return shaderLanguage === 0 ? _ShaderStore.IncludesShadersStore : _ShaderStore.IncludesShadersStoreWGSL;
  }
};
ShaderStore.ShadersRepository = "src/Shaders/";
ShaderStore.ShadersStore = {};
ShaderStore.IncludesShadersStore = {};
ShaderStore.ShadersRepositoryWGSL = "src/ShadersWGSL/";
ShaderStore.ShadersStoreWGSL = {};
ShaderStore.IncludesShadersStoreWGSL = {};

export {
  __spreadValues,
  __spreadProps,
  __superGet,
  __async,
  ShaderStore
};
//# sourceMappingURL=chunk-DLJ6TMVI.js.map
