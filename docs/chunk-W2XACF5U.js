import {
  Color3,
  Color4,
  DataBuffer,
  EngineStore,
  GetClass,
  GetMergedStore,
  Logger,
  Matrix,
  Observable,
  PerformanceConfigurator,
  Quaternion,
  RegisterClass,
  TmpVectors,
  Vector2,
  Vector3,
  VertexBuffer,
  __decorate,
  serialize,
  serializeAsTexture
} from "./chunk-P4ROUPGK.js";
import {
  ShaderStore,
  __async,
  __spreadValues
} from "./chunk-DLJ6TMVI.js";

// node_modules/@babylonjs/core/Misc/devTools.js
var warnedMap = {};
function _WarnImport(name2, warnOnce = false) {
  if (warnOnce && warnedMap[name2]) {
    return;
  }
  warnedMap[name2] = true;
  return `${name2} needs to be imported before as it contains a side-effect required by your code.`;
}

// node_modules/@babylonjs/core/Misc/andOrNotEvaluator.js
var AndOrNotEvaluator = class _AndOrNotEvaluator {
  /**
   * Evaluate a query
   * @param query defines the query to evaluate
   * @param evaluateCallback defines the callback used to filter result
   * @returns true if the query matches
   */
  static Eval(query, evaluateCallback) {
    if (!query.match(/\([^()]*\)/g)) {
      query = _AndOrNotEvaluator._HandleParenthesisContent(query, evaluateCallback);
    } else {
      query = query.replace(/\([^()]*\)/g, (r) => {
        r = r.slice(1, r.length - 1);
        return _AndOrNotEvaluator._HandleParenthesisContent(r, evaluateCallback);
      });
    }
    if (query === "true") {
      return true;
    }
    if (query === "false") {
      return false;
    }
    return _AndOrNotEvaluator.Eval(query, evaluateCallback);
  }
  static _HandleParenthesisContent(parenthesisContent, evaluateCallback) {
    evaluateCallback = evaluateCallback || ((r) => {
      return r === "true" ? true : false;
    });
    let result;
    const or = parenthesisContent.split("||");
    for (const i in or) {
      if (Object.prototype.hasOwnProperty.call(or, i)) {
        let ori = _AndOrNotEvaluator._SimplifyNegation(or[i].trim());
        const and = ori.split("&&");
        if (and.length > 1) {
          for (let j = 0; j < and.length; ++j) {
            const andj = _AndOrNotEvaluator._SimplifyNegation(and[j].trim());
            if (andj !== "true" && andj !== "false") {
              if (andj[0] === "!") {
                result = !evaluateCallback(andj.substring(1));
              } else {
                result = evaluateCallback(andj);
              }
            } else {
              result = andj === "true" ? true : false;
            }
            if (!result) {
              ori = "false";
              break;
            }
          }
        }
        if (result || ori === "true") {
          result = true;
          break;
        }
        if (ori !== "true" && ori !== "false") {
          if (ori[0] === "!") {
            result = !evaluateCallback(ori.substring(1));
          } else {
            result = evaluateCallback(ori);
          }
        } else {
          result = ori === "true" ? true : false;
        }
      }
    }
    return result ? "true" : "false";
  }
  static _SimplifyNegation(booleanString) {
    booleanString = booleanString.replace(/^[\s!]+/, (r) => {
      r = r.replace(/[\s]/g, () => "");
      return r.length % 2 ? "!" : "";
    });
    booleanString = booleanString.trim();
    if (booleanString === "!true") {
      booleanString = "false";
    } else if (booleanString === "!false") {
      booleanString = "true";
    }
    return booleanString;
  }
};

// node_modules/@babylonjs/core/Misc/tags.js
var Tags = class _Tags {
  /**
   * Adds support for tags on the given object
   * @param obj defines the object to use
   */
  static EnableFor(obj) {
    obj._tags = obj._tags || {};
    obj.hasTags = () => {
      return _Tags.HasTags(obj);
    };
    obj.addTags = (tagsString) => {
      return _Tags.AddTagsTo(obj, tagsString);
    };
    obj.removeTags = (tagsString) => {
      return _Tags.RemoveTagsFrom(obj, tagsString);
    };
    obj.matchesTagsQuery = (tagsQuery) => {
      return _Tags.MatchesQuery(obj, tagsQuery);
    };
  }
  /**
   * Removes tags support
   * @param obj defines the object to use
   */
  static DisableFor(obj) {
    delete obj._tags;
    delete obj.hasTags;
    delete obj.addTags;
    delete obj.removeTags;
    delete obj.matchesTagsQuery;
  }
  /**
   * Gets a boolean indicating if the given object has tags
   * @param obj defines the object to use
   * @returns a boolean
   */
  static HasTags(obj) {
    if (!obj._tags) {
      return false;
    }
    const tags = obj._tags;
    for (const i in tags) {
      if (Object.prototype.hasOwnProperty.call(tags, i)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Gets the tags available on a given object
   * @param obj defines the object to use
   * @param asString defines if the tags must be returned as a string instead of an array of strings
   * @returns the tags
   */
  static GetTags(obj, asString = true) {
    if (!obj._tags) {
      return null;
    }
    if (asString) {
      const tagsArray = [];
      for (const tag in obj._tags) {
        if (Object.prototype.hasOwnProperty.call(obj._tags, tag) && obj._tags[tag] === true) {
          tagsArray.push(tag);
        }
      }
      return tagsArray.join(" ");
    } else {
      return obj._tags;
    }
  }
  /**
   * Adds tags to an object
   * @param obj defines the object to use
   * @param tagsString defines the tag string. The tags 'true' and 'false' are reserved and cannot be used as tags.
   * A tag cannot start with '||', '&&', and '!'. It cannot contain whitespaces
   */
  static AddTagsTo(obj, tagsString) {
    if (!tagsString) {
      return;
    }
    if (typeof tagsString !== "string") {
      return;
    }
    const tags = tagsString.split(" ");
    tags.forEach(function(tag) {
      _Tags._AddTagTo(obj, tag);
    });
  }
  /**
   * @internal
   */
  static _AddTagTo(obj, tag) {
    tag = tag.trim();
    if (tag === "" || tag === "true" || tag === "false") {
      return;
    }
    if (tag.match(/[\s]/) || tag.match(/^([!]|([|]|[&]){2})/)) {
      return;
    }
    _Tags.EnableFor(obj);
    obj._tags[tag] = true;
  }
  /**
   * Removes specific tags from a specific object
   * @param obj defines the object to use
   * @param tagsString defines the tags to remove
   */
  static RemoveTagsFrom(obj, tagsString) {
    if (!_Tags.HasTags(obj)) {
      return;
    }
    const tags = tagsString.split(" ");
    for (const t in tags) {
      _Tags._RemoveTagFrom(obj, tags[t]);
    }
  }
  /**
   * @internal
   */
  static _RemoveTagFrom(obj, tag) {
    delete obj._tags[tag];
  }
  /**
   * Defines if tags hosted on an object match a given query
   * @param obj defines the object to use
   * @param tagsQuery defines the tag query
   * @returns a boolean
   */
  static MatchesQuery(obj, tagsQuery) {
    if (tagsQuery === void 0) {
      return true;
    }
    if (tagsQuery === "") {
      return _Tags.HasTags(obj);
    }
    return AndOrNotEvaluator.Eval(tagsQuery, (r) => _Tags.HasTags(obj) && obj._tags[r]);
  }
};

// node_modules/@babylonjs/core/Misc/decorators.serialization.js
var _copySource = function(creationFunction, source, instanciate, options = {}) {
  const destination = creationFunction();
  if (Tags && Tags.HasTags(source)) {
    Tags.AddTagsTo(destination, Tags.GetTags(source, true));
  }
  const classStore = GetMergedStore(destination);
  const textureMap = {};
  for (const property in classStore) {
    const propertyDescriptor = classStore[property];
    const sourceProperty = source[property];
    const propertyType = propertyDescriptor.type;
    if (sourceProperty !== void 0 && sourceProperty !== null && (property !== "uniqueId" || SerializationHelper.AllowLoadingUniqueId)) {
      switch (propertyType) {
        case 0:
        case 6:
        case 11:
          destination[property] = sourceProperty;
          break;
        case 1:
          if (options.cloneTexturesOnlyOnce && textureMap[sourceProperty.uniqueId]) {
            destination[property] = textureMap[sourceProperty.uniqueId];
          } else {
            destination[property] = instanciate || sourceProperty.isRenderTarget ? sourceProperty : sourceProperty.clone();
            textureMap[sourceProperty.uniqueId] = destination[property];
          }
          break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 7:
        case 10:
        case 12:
          destination[property] = instanciate ? sourceProperty : sourceProperty.clone();
          break;
      }
    }
  }
  return destination;
};
var SerializationHelper = class _SerializationHelper {
  /**
   * Appends the serialized animations from the source animations
   * @param source Source containing the animations
   * @param destination Target to store the animations
   */
  static AppendSerializedAnimations(source, destination) {
    if (source.animations) {
      destination.animations = [];
      for (let animationIndex = 0; animationIndex < source.animations.length; animationIndex++) {
        const animation = source.animations[animationIndex];
        destination.animations.push(animation.serialize());
      }
    }
  }
  /**
   * Static function used to serialized a specific entity
   * @param entity defines the entity to serialize
   * @param serializationObject defines the optional target object where serialization data will be stored
   * @returns a JSON compatible object representing the serialization of the entity
   */
  static Serialize(entity, serializationObject) {
    if (!serializationObject) {
      serializationObject = {};
    }
    if (Tags) {
      serializationObject.tags = Tags.GetTags(entity);
    }
    const serializedProperties = GetMergedStore(entity);
    for (const property in serializedProperties) {
      const propertyDescriptor = serializedProperties[property];
      const targetPropertyName = propertyDescriptor.sourceName || property;
      const propertyType = propertyDescriptor.type;
      const sourceProperty = entity[property];
      if (sourceProperty !== void 0 && sourceProperty !== null && (property !== "uniqueId" || _SerializationHelper.AllowLoadingUniqueId)) {
        switch (propertyType) {
          case 0:
            serializationObject[targetPropertyName] = sourceProperty;
            break;
          case 1:
            serializationObject[targetPropertyName] = sourceProperty.serialize();
            break;
          case 2:
            serializationObject[targetPropertyName] = sourceProperty.asArray();
            break;
          case 3:
            serializationObject[targetPropertyName] = sourceProperty.serialize();
            break;
          case 4:
            serializationObject[targetPropertyName] = sourceProperty.asArray();
            break;
          case 5:
            serializationObject[targetPropertyName] = sourceProperty.asArray();
            break;
          case 6:
            serializationObject[targetPropertyName] = sourceProperty.id;
            break;
          case 7:
            serializationObject[targetPropertyName] = sourceProperty.serialize();
            break;
          case 8:
            serializationObject[targetPropertyName] = sourceProperty.asArray();
            break;
          case 9:
            serializationObject[targetPropertyName] = sourceProperty.serialize();
            break;
          case 10:
            serializationObject[targetPropertyName] = sourceProperty.asArray();
            break;
          case 11:
            serializationObject[targetPropertyName] = sourceProperty.id;
            break;
          case 12:
            serializationObject[targetPropertyName] = sourceProperty.asArray();
            break;
        }
      }
    }
    return serializationObject;
  }
  /**
   * Given a source json and a destination object in a scene, this function will parse the source and will try to apply its content to the destination object
   * @param source the source json data
   * @param destination the destination object
   * @param scene the scene where the object is
   * @param rootUrl root url to use to load assets
   */
  static ParseProperties(source, destination, scene, rootUrl) {
    if (!rootUrl) {
      rootUrl = "";
    }
    const classStore = GetMergedStore(destination);
    for (const property in classStore) {
      const propertyDescriptor = classStore[property];
      const sourceProperty = source[propertyDescriptor.sourceName || property];
      const propertyType = propertyDescriptor.type;
      if (sourceProperty !== void 0 && sourceProperty !== null && (property !== "uniqueId" || _SerializationHelper.AllowLoadingUniqueId)) {
        const dest = destination;
        switch (propertyType) {
          case 0:
            dest[property] = sourceProperty;
            break;
          case 1:
            if (scene) {
              dest[property] = _SerializationHelper._TextureParser(sourceProperty, scene, rootUrl);
            }
            break;
          case 2:
            dest[property] = Color3.FromArray(sourceProperty);
            break;
          case 3:
            dest[property] = _SerializationHelper._FresnelParametersParser(sourceProperty);
            break;
          case 4:
            dest[property] = Vector2.FromArray(sourceProperty);
            break;
          case 5:
            dest[property] = Vector3.FromArray(sourceProperty);
            break;
          case 6:
            if (scene) {
              dest[property] = scene.getLastMeshById(sourceProperty);
            }
            break;
          case 7:
            dest[property] = _SerializationHelper._ColorCurvesParser(sourceProperty);
            break;
          case 8:
            dest[property] = Color4.FromArray(sourceProperty);
            break;
          case 9:
            dest[property] = _SerializationHelper._ImageProcessingConfigurationParser(sourceProperty);
            break;
          case 10:
            dest[property] = Quaternion.FromArray(sourceProperty);
            break;
          case 11:
            if (scene) {
              dest[property] = scene.getCameraById(sourceProperty);
            }
            break;
          case 12:
            dest[property] = Matrix.FromArray(sourceProperty);
            break;
        }
      }
    }
  }
  /**
   * Creates a new entity from a serialization data object
   * @param creationFunction defines a function used to instanciated the new entity
   * @param source defines the source serialization data
   * @param scene defines the hosting scene
   * @param rootUrl defines the root url for resources
   * @returns a new entity
   */
  static Parse(creationFunction, source, scene, rootUrl = null) {
    const destination = creationFunction();
    if (Tags) {
      Tags.AddTagsTo(destination, source.tags);
    }
    _SerializationHelper.ParseProperties(source, destination, scene, rootUrl);
    return destination;
  }
  /**
   * Clones an object
   * @param creationFunction defines the function used to instanciate the new object
   * @param source defines the source object
   * @param options defines the options to use
   * @returns the cloned object
   */
  static Clone(creationFunction, source, options = {}) {
    return _copySource(creationFunction, source, false, options);
  }
  /**
   * Instanciates a new object based on a source one (some data will be shared between both object)
   * @param creationFunction defines the function used to instanciate the new object
   * @param source defines the source object
   * @returns the new object
   */
  static Instanciate(creationFunction, source) {
    return _copySource(creationFunction, source, true);
  }
};
SerializationHelper.AllowLoadingUniqueId = false;
SerializationHelper._ImageProcessingConfigurationParser = (sourceProperty) => {
  throw _WarnImport("ImageProcessingConfiguration");
};
SerializationHelper._FresnelParametersParser = (sourceProperty) => {
  throw _WarnImport("FresnelParameters");
};
SerializationHelper._ColorCurvesParser = (sourceProperty) => {
  throw _WarnImport("ColorCurves");
};
SerializationHelper._TextureParser = (sourceProperty, scene, rootUrl) => {
  throw _WarnImport("Texture");
};

// node_modules/@babylonjs/core/Misc/guid.js
function RandomGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}

// node_modules/@babylonjs/core/Misc/webRequest.js
function createXMLHttpRequest() {
  if (typeof _native !== "undefined" && _native.XMLHttpRequest) {
    return new _native.XMLHttpRequest();
  } else {
    return new XMLHttpRequest();
  }
}
var WebRequest = class _WebRequest {
  constructor() {
    this._xhr = createXMLHttpRequest();
    this._requestURL = "";
  }
  /**
   * This function can be called to check if there are request modifiers for network requests
   * @returns true if there are any custom requests available
   */
  static get IsCustomRequestAvailable() {
    return Object.keys(_WebRequest.CustomRequestHeaders).length > 0 || _WebRequest.CustomRequestModifiers.length > 0;
  }
  _injectCustomRequestHeaders() {
    if (this._shouldSkipRequestModifications(this._requestURL)) {
      return;
    }
    for (const key in _WebRequest.CustomRequestHeaders) {
      const val = _WebRequest.CustomRequestHeaders[key];
      if (val) {
        this._xhr.setRequestHeader(key, val);
      }
    }
  }
  _shouldSkipRequestModifications(url) {
    return _WebRequest.SkipRequestModificationForBabylonCDN && (url.includes("preview.babylonjs.com") || url.includes("cdn.babylonjs.com"));
  }
  /**
   * Gets or sets a function to be called when loading progress changes
   */
  get onprogress() {
    return this._xhr.onprogress;
  }
  set onprogress(value) {
    this._xhr.onprogress = value;
  }
  /**
   * Returns client's state
   */
  get readyState() {
    return this._xhr.readyState;
  }
  /**
   * Returns client's status
   */
  get status() {
    return this._xhr.status;
  }
  /**
   * Returns client's status as a text
   */
  get statusText() {
    return this._xhr.statusText;
  }
  /**
   * Returns client's response
   */
  get response() {
    return this._xhr.response;
  }
  /**
   * Returns client's response url
   */
  get responseURL() {
    return this._xhr.responseURL;
  }
  /**
   * Returns client's response as text
   */
  get responseText() {
    return this._xhr.responseText;
  }
  /**
   * Gets or sets the expected response type
   */
  get responseType() {
    return this._xhr.responseType;
  }
  set responseType(value) {
    this._xhr.responseType = value;
  }
  /**
   * Gets or sets the timeout value in milliseconds
   */
  get timeout() {
    return this._xhr.timeout;
  }
  set timeout(value) {
    this._xhr.timeout = value;
  }
  addEventListener(type, listener, options) {
    this._xhr.addEventListener(type, listener, options);
  }
  removeEventListener(type, listener, options) {
    this._xhr.removeEventListener(type, listener, options);
  }
  /**
   * Cancels any network activity
   */
  abort() {
    this._xhr.abort();
  }
  /**
   * Initiates the request. The optional argument provides the request body. The argument is ignored if request method is GET or HEAD
   * @param body defines an optional request body
   */
  send(body) {
    if (_WebRequest.CustomRequestHeaders) {
      this._injectCustomRequestHeaders();
    }
    this._xhr.send(body);
  }
  /**
   * Sets the request method, request URL
   * @param method defines the method to use (GET, POST, etc..)
   * @param url defines the url to connect with
   */
  open(method, url) {
    for (const update of _WebRequest.CustomRequestModifiers) {
      if (this._shouldSkipRequestModifications(url)) {
        return;
      }
      update(this._xhr, url);
    }
    url = url.replace("file:http:", "http:");
    url = url.replace("file:https:", "https:");
    this._requestURL = url;
    this._xhr.open(method, url, true);
  }
  /**
   * Sets the value of a request header.
   * @param name The name of the header whose value is to be set
   * @param value The value to set as the body of the header
   */
  setRequestHeader(name2, value) {
    this._xhr.setRequestHeader(name2, value);
  }
  /**
   * Get the string containing the text of a particular header's value.
   * @param name The name of the header
   * @returns The string containing the text of the given header name
   */
  getResponseHeader(name2) {
    return this._xhr.getResponseHeader(name2);
  }
};
WebRequest.CustomRequestHeaders = {};
WebRequest.CustomRequestModifiers = new Array();
WebRequest.SkipRequestModificationForBabylonCDN = true;

// node_modules/@babylonjs/core/Misc/domManagement.js
function IsWindowObjectExist() {
  return typeof window !== "undefined";
}
function IsNavigatorAvailable() {
  return typeof navigator !== "undefined";
}
function IsDocumentAvailable() {
  return typeof document !== "undefined";
}
function GetDOMTextContent(element) {
  let result = "";
  let child = element.firstChild;
  while (child) {
    if (child.nodeType === 3) {
      result += child.textContent;
    }
    child = child.nextSibling;
  }
  return result;
}

// node_modules/@babylonjs/core/Misc/filesInputStore.js
var FilesInputStore = class {
};
FilesInputStore.FilesToLoad = {};

// node_modules/@babylonjs/core/Misc/retryStrategy.js
var RetryStrategy = class {
  /**
   * Function used to defines an exponential back off strategy
   * @param maxRetries defines the maximum number of retries (3 by default)
   * @param baseInterval defines the interval between retries
   * @returns the strategy function to use
   */
  static ExponentialBackoff(maxRetries = 3, baseInterval = 500) {
    return (url, request, retryIndex) => {
      if (request.status !== 0 || retryIndex >= maxRetries || url.indexOf("file:") !== -1) {
        return -1;
      }
      return Math.pow(2, retryIndex) * baseInterval;
    };
  }
};

// node_modules/@babylonjs/core/Misc/error.js
var BaseError = class extends Error {
};
BaseError._setPrototypeOf = Object.setPrototypeOf || ((o, proto) => {
  o.__proto__ = proto;
  return o;
});
var ErrorCodes = {
  // Mesh errors 0-999
  /** Invalid or empty mesh vertex positions. */
  MeshInvalidPositionsError: 0,
  // Texture errors 1000-1999
  /** Unsupported texture found. */
  UnsupportedTextureError: 1e3,
  // GLTFLoader errors 2000-2999
  /** Unexpected magic number found in GLTF file header. */
  GLTFLoaderUnexpectedMagicError: 2e3,
  // SceneLoader errors 3000-3999
  /** SceneLoader generic error code. Ideally wraps the inner exception. */
  SceneLoaderError: 3e3,
  // File related errors 4000-4999
  /** Load file error */
  LoadFileError: 4e3,
  /** Request file error */
  RequestFileError: 4001,
  /** Read file error */
  ReadFileError: 4002
};
var RuntimeError = class _RuntimeError extends BaseError {
  /**
   * Creates a new RuntimeError
   * @param message defines the message of the error
   * @param errorCode the error code
   * @param innerError the error that caused the outer error
   */
  constructor(message, errorCode, innerError) {
    super(message);
    this.errorCode = errorCode;
    this.innerError = innerError;
    this.name = "RuntimeError";
    BaseError._setPrototypeOf(this, _RuntimeError.prototype);
  }
};

// node_modules/@babylonjs/core/Misc/stringTools.js
var EncodeArrayBufferToBase64 = (buffer) => {
  const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  let i = 0;
  const bytes = ArrayBuffer.isView(buffer) ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) : new Uint8Array(buffer);
  while (i < bytes.length) {
    chr1 = bytes[i++];
    chr2 = i < bytes.length ? bytes[i++] : Number.NaN;
    chr3 = i < bytes.length ? bytes[i++] : Number.NaN;
    enc1 = chr1 >> 2;
    enc2 = (chr1 & 3) << 4 | chr2 >> 4;
    enc3 = (chr2 & 15) << 2 | chr3 >> 6;
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output += keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
  }
  return output;
};
var DecodeBase64ToString = (base64Data) => {
  return atob(base64Data);
};
var DecodeBase64ToBinary = (base64Data) => {
  const decodedString = DecodeBase64ToString(base64Data);
  const bufferLength = decodedString.length;
  const bufferView = new Uint8Array(new ArrayBuffer(bufferLength));
  for (let i = 0; i < bufferLength; i++) {
    bufferView[i] = decodedString.charCodeAt(i);
  }
  return bufferView.buffer;
};

// node_modules/@babylonjs/core/Engines/Processors/shaderCodeNode.js
var defaultAttributeKeywordName = "attribute";
var defaultVaryingKeywordName = "varying";
var ShaderCodeNode = class {
  constructor() {
    this.children = [];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValid(preprocessors) {
    return true;
  }
  process(preprocessors, options) {
    let result = "";
    if (this.line) {
      let value = this.line;
      const processor = options.processor;
      if (processor) {
        if (processor.lineProcessor) {
          value = processor.lineProcessor(value, options.isFragment, options.processingContext);
        }
        const attributeKeyword = options.processor?.attributeKeywordName ?? defaultAttributeKeywordName;
        const varyingKeyword = options.isFragment && options.processor?.varyingFragmentKeywordName ? options.processor?.varyingFragmentKeywordName : !options.isFragment && options.processor?.varyingVertexKeywordName ? options.processor?.varyingVertexKeywordName : defaultVaryingKeywordName;
        if (!options.isFragment && processor.attributeProcessor && this.line.startsWith(attributeKeyword)) {
          value = processor.attributeProcessor(this.line, preprocessors, options.processingContext);
        } else if (processor.varyingProcessor && (processor.varyingCheck?.(this.line, options.isFragment) || !processor.varyingCheck && this.line.startsWith(varyingKeyword))) {
          value = processor.varyingProcessor(this.line, options.isFragment, preprocessors, options.processingContext);
        } else if (processor.uniformProcessor && processor.uniformRegexp && processor.uniformRegexp.test(this.line)) {
          if (!options.lookForClosingBracketForUniformBuffer) {
            value = processor.uniformProcessor(this.line, options.isFragment, preprocessors, options.processingContext);
          }
        } else if (processor.uniformBufferProcessor && processor.uniformBufferRegexp && processor.uniformBufferRegexp.test(this.line)) {
          if (!options.lookForClosingBracketForUniformBuffer) {
            value = processor.uniformBufferProcessor(this.line, options.isFragment, options.processingContext);
            options.lookForClosingBracketForUniformBuffer = true;
          }
        } else if (processor.textureProcessor && processor.textureRegexp && processor.textureRegexp.test(this.line)) {
          value = processor.textureProcessor(this.line, options.isFragment, preprocessors, options.processingContext);
        } else if ((processor.uniformProcessor || processor.uniformBufferProcessor) && this.line.startsWith("uniform") && !options.lookForClosingBracketForUniformBuffer) {
          const regex = /uniform\s+(?:(?:highp)?|(?:lowp)?)\s*(\S+)\s+(\S+)\s*;/;
          if (regex.test(this.line)) {
            if (processor.uniformProcessor) {
              value = processor.uniformProcessor(this.line, options.isFragment, preprocessors, options.processingContext);
            }
          } else {
            if (processor.uniformBufferProcessor) {
              value = processor.uniformBufferProcessor(this.line, options.isFragment, options.processingContext);
              options.lookForClosingBracketForUniformBuffer = true;
            }
          }
        }
        if (options.lookForClosingBracketForUniformBuffer && this.line.indexOf("}") !== -1) {
          options.lookForClosingBracketForUniformBuffer = false;
          if (processor.endOfUniformBufferProcessor) {
            value = processor.endOfUniformBufferProcessor(this.line, options.isFragment, options.processingContext);
          }
        }
      }
      result += value + "\n";
    }
    this.children.forEach((child) => {
      result += child.process(preprocessors, options);
    });
    if (this.additionalDefineKey) {
      preprocessors[this.additionalDefineKey] = this.additionalDefineValue || "true";
    }
    return result;
  }
};

// node_modules/@babylonjs/core/Engines/Processors/shaderCodeCursor.js
var ShaderCodeCursor = class {
  constructor() {
    this._lines = [];
  }
  get currentLine() {
    return this._lines[this.lineIndex];
  }
  get canRead() {
    return this.lineIndex < this._lines.length - 1;
  }
  set lines(value) {
    this._lines.length = 0;
    for (const line of value) {
      if (!line || line === "\r") {
        continue;
      }
      if (line[0] === "#") {
        this._lines.push(line);
        continue;
      }
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        continue;
      }
      if (trimmedLine.startsWith("//")) {
        this._lines.push(line);
        continue;
      }
      const semicolonIndex = trimmedLine.indexOf(";");
      if (semicolonIndex === -1) {
        this._lines.push(trimmedLine);
      } else if (semicolonIndex === trimmedLine.length - 1) {
        if (trimmedLine.length > 1) {
          this._lines.push(trimmedLine);
        }
      } else {
        const split = line.split(";");
        for (let index = 0; index < split.length; index++) {
          let subLine = split[index];
          if (!subLine) {
            continue;
          }
          subLine = subLine.trim();
          if (!subLine) {
            continue;
          }
          this._lines.push(subLine + (index !== split.length - 1 ? ";" : ""));
        }
      }
    }
  }
};

// node_modules/@babylonjs/core/Engines/Processors/shaderCodeConditionNode.js
var ShaderCodeConditionNode = class extends ShaderCodeNode {
  process(preprocessors, options) {
    for (let index = 0; index < this.children.length; index++) {
      const node = this.children[index];
      if (node.isValid(preprocessors)) {
        return node.process(preprocessors, options);
      }
    }
    return "";
  }
};

// node_modules/@babylonjs/core/Engines/Processors/shaderCodeTestNode.js
var ShaderCodeTestNode = class extends ShaderCodeNode {
  isValid(preprocessors) {
    return this.testExpression.isTrue(preprocessors);
  }
};

// node_modules/@babylonjs/core/Engines/Processors/Expressions/shaderDefineExpression.js
var ShaderDefineExpression = class _ShaderDefineExpression {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isTrue(preprocessors) {
    return true;
  }
  static postfixToInfix(postfix) {
    const stack = [];
    for (const c of postfix) {
      if (_ShaderDefineExpression._OperatorPriority[c] === void 0) {
        stack.push(c);
      } else {
        const v1 = stack[stack.length - 1], v2 = stack[stack.length - 2];
        stack.length -= 2;
        stack.push(`(${v2}${c}${v1})`);
      }
    }
    return stack[stack.length - 1];
  }
  /**
   * Converts an infix expression to a postfix expression.
   *
   * This method is used to transform infix expressions, which are more human-readable,
   * into postfix expressions, also known as Reverse Polish Notation (RPN), that can be
   * evaluated more efficiently by a computer. The conversion is based on the operator
   * priority defined in _OperatorPriority.
   *
   * The function employs a stack-based algorithm for the conversion and caches the result
   * to improve performance. The cache keeps track of each converted expression's access time
   * to manage the cache size and optimize memory usage. When the cache size exceeds a specified
   * limit, the least recently accessed items in the cache are deleted.
   *
   * The cache mechanism is particularly helpful for shader compilation, where the same infix
   * expressions might be encountered repeatedly, hence the caching can speed up the process.
   *
   * @param infix - The infix expression to be converted.
   * @returns The postfix expression as an array of strings.
   */
  static infixToPostfix(infix) {
    const cacheItem = _ShaderDefineExpression._InfixToPostfixCache.get(infix);
    if (cacheItem) {
      cacheItem.accessTime = Date.now();
      return cacheItem.result;
    }
    if (!infix.includes("&&") && !infix.includes("||") && !infix.includes(")") && !infix.includes("(")) {
      return [infix];
    }
    const result = [];
    let stackIdx = -1;
    const pushOperand = () => {
      operand = operand.trim();
      if (operand !== "") {
        result.push(operand);
        operand = "";
      }
    };
    const push = (s) => {
      if (stackIdx < _ShaderDefineExpression._Stack.length - 1) {
        _ShaderDefineExpression._Stack[++stackIdx] = s;
      }
    };
    const peek = () => _ShaderDefineExpression._Stack[stackIdx];
    const pop = () => stackIdx === -1 ? "!!INVALID EXPRESSION!!" : _ShaderDefineExpression._Stack[stackIdx--];
    let idx = 0, operand = "";
    while (idx < infix.length) {
      const c = infix.charAt(idx), token = idx < infix.length - 1 ? infix.substr(idx, 2) : "";
      if (c === "(") {
        operand = "";
        push(c);
      } else if (c === ")") {
        pushOperand();
        while (stackIdx !== -1 && peek() !== "(") {
          result.push(pop());
        }
        pop();
      } else if (_ShaderDefineExpression._OperatorPriority[token] > 1) {
        pushOperand();
        while (stackIdx !== -1 && _ShaderDefineExpression._OperatorPriority[peek()] >= _ShaderDefineExpression._OperatorPriority[token]) {
          result.push(pop());
        }
        push(token);
        idx++;
      } else {
        operand += c;
      }
      idx++;
    }
    pushOperand();
    while (stackIdx !== -1) {
      if (peek() === "(") {
        pop();
      } else {
        result.push(pop());
      }
    }
    if (_ShaderDefineExpression._InfixToPostfixCache.size >= _ShaderDefineExpression.InfixToPostfixCacheLimitSize) {
      _ShaderDefineExpression.ClearCache();
    }
    _ShaderDefineExpression._InfixToPostfixCache.set(infix, {
      result,
      accessTime: Date.now()
    });
    return result;
  }
  static ClearCache() {
    const sortedCache = Array.from(_ShaderDefineExpression._InfixToPostfixCache.entries()).sort((a, b) => a[1].accessTime - b[1].accessTime);
    for (let i = 0; i < _ShaderDefineExpression.InfixToPostfixCacheCleanupSize; i++) {
      _ShaderDefineExpression._InfixToPostfixCache.delete(sortedCache[i][0]);
    }
  }
};
ShaderDefineExpression.InfixToPostfixCacheLimitSize = 5e4;
ShaderDefineExpression.InfixToPostfixCacheCleanupSize = 25e3;
ShaderDefineExpression._InfixToPostfixCache = /* @__PURE__ */ new Map();
ShaderDefineExpression._OperatorPriority = {
  ")": 0,
  "(": 1,
  "||": 2,
  "&&": 3
};
ShaderDefineExpression._Stack = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

// node_modules/@babylonjs/core/Engines/Processors/Expressions/Operators/shaderDefineIsDefinedOperator.js
var ShaderDefineIsDefinedOperator = class extends ShaderDefineExpression {
  constructor(define, not = false) {
    super();
    this.define = define;
    this.not = not;
  }
  isTrue(preprocessors) {
    let condition = preprocessors[this.define] !== void 0;
    if (this.not) {
      condition = !condition;
    }
    return condition;
  }
};

// node_modules/@babylonjs/core/Engines/Processors/Expressions/Operators/shaderDefineOrOperator.js
var ShaderDefineOrOperator = class extends ShaderDefineExpression {
  isTrue(preprocessors) {
    return this.leftOperand.isTrue(preprocessors) || this.rightOperand.isTrue(preprocessors);
  }
};

// node_modules/@babylonjs/core/Engines/Processors/Expressions/Operators/shaderDefineAndOperator.js
var ShaderDefineAndOperator = class extends ShaderDefineExpression {
  isTrue(preprocessors) {
    return this.leftOperand.isTrue(preprocessors) && this.rightOperand.isTrue(preprocessors);
  }
};

// node_modules/@babylonjs/core/Engines/Processors/Expressions/Operators/shaderDefineArithmeticOperator.js
var ShaderDefineArithmeticOperator = class extends ShaderDefineExpression {
  constructor(define, operand, testValue) {
    super();
    this.define = define;
    this.operand = operand;
    this.testValue = testValue;
  }
  isTrue(preprocessors) {
    let value = preprocessors[this.define];
    if (value === void 0) {
      value = this.define;
    }
    let condition = false;
    const left = parseInt(value);
    const right = parseInt(this.testValue);
    switch (this.operand) {
      case ">":
        condition = left > right;
        break;
      case "<":
        condition = left < right;
        break;
      case "<=":
        condition = left <= right;
        break;
      case ">=":
        condition = left >= right;
        break;
      case "==":
        condition = left === right;
        break;
      case "!=":
        condition = left !== right;
        break;
    }
    return condition;
  }
};

// node_modules/@babylonjs/core/Engines/abstractEngine.functions.js
var EngineFunctionContext = {};
function _ConcatenateShader(source, defines, shaderVersion = "") {
  return shaderVersion + (defines ? defines + "\n" : "") + source;
}
function _loadFile(url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError, injectedLoadFile) {
  const loadFile = injectedLoadFile || EngineFunctionContext.loadFile;
  if (loadFile) {
    const request = loadFile(url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError);
    return request;
  }
  throw _WarnImport("FileTools");
}
function _getGlobalDefines(defines, isNDCHalfZRange, useReverseDepthBuffer, useExactSrgbConversions) {
  if (defines) {
    if (isNDCHalfZRange) {
      defines["IS_NDC_HALF_ZRANGE"] = "";
    } else {
      delete defines["IS_NDC_HALF_ZRANGE"];
    }
    if (useReverseDepthBuffer) {
      defines["USE_REVERSE_DEPTHBUFFER"] = "";
    } else {
      delete defines["USE_REVERSE_DEPTHBUFFER"];
    }
    if (useExactSrgbConversions) {
      defines["USE_EXACT_SRGB_CONVERSIONS"] = "";
    } else {
      delete defines["USE_EXACT_SRGB_CONVERSIONS"];
    }
    return;
  } else {
    let s = "";
    if (isNDCHalfZRange) {
      s += "#define IS_NDC_HALF_ZRANGE";
    }
    if (useReverseDepthBuffer) {
      if (s) {
        s += "\n";
      }
      s += "#define USE_REVERSE_DEPTHBUFFER";
    }
    if (useExactSrgbConversions) {
      if (s) {
        s += "\n";
      }
      s += "#define USE_EXACT_SRGB_CONVERSIONS";
    }
    return s;
  }
}

// node_modules/@babylonjs/core/Engines/Processors/shaderProcessor.js
var regexSE = /defined\s*?\((.+?)\)/g;
var regexSERevert = /defined\s*?\[(.+?)\]/g;
var regexShaderInclude = /#include\s?<(.+)>(\((.*)\))*(\[(.*)\])*/g;
var regexShaderDecl = /__decl__/;
var regexLightX = /light\{X\}.(\w*)/g;
var regexX = /\{X\}/g;
var reusableMatches = [];
var _MoveCursorRegex = /(#ifdef)|(#else)|(#elif)|(#endif)|(#ifndef)|(#if)/;
function Initialize(options) {
  if (options.processor && options.processor.initializeShaders) {
    options.processor.initializeShaders(options.processingContext);
  }
}
function Process(sourceCode, options, callback, engine) {
  if (options.processor?.preProcessShaderCode) {
    sourceCode = options.processor.preProcessShaderCode(sourceCode, options.isFragment);
  }
  _ProcessIncludes(sourceCode, options, (codeWithIncludes) => {
    if (options.processCodeAfterIncludes) {
      codeWithIncludes = options.processCodeAfterIncludes(options.isFragment ? "fragment" : "vertex", codeWithIncludes, options.defines);
    }
    const migratedCode = _ProcessShaderConversion(codeWithIncludes, options, engine);
    callback(migratedCode, codeWithIncludes);
  });
}
function PreProcess(sourceCode, options, callback, engine) {
  if (options.processor?.preProcessShaderCode) {
    sourceCode = options.processor.preProcessShaderCode(sourceCode, options.isFragment);
  }
  _ProcessIncludes(sourceCode, options, (codeWithIncludes) => {
    if (options.processCodeAfterIncludes) {
      codeWithIncludes = options.processCodeAfterIncludes(options.isFragment ? "fragment" : "vertex", codeWithIncludes, options.defines);
    }
    const migratedCode = _ApplyPreProcessing(codeWithIncludes, options, engine);
    callback(migratedCode, codeWithIncludes);
  });
}
function Finalize(vertexCode, fragmentCode, options) {
  if (!options.processor || !options.processor.finalizeShaders) {
    return {
      vertexCode,
      fragmentCode
    };
  }
  return options.processor.finalizeShaders(vertexCode, fragmentCode, options.processingContext);
}
function _ProcessPrecision(source, options) {
  if (options.processor?.noPrecision) {
    return source;
  }
  const shouldUseHighPrecisionShader = options.shouldUseHighPrecisionShader;
  if (source.indexOf("precision highp float") === -1) {
    if (!shouldUseHighPrecisionShader) {
      source = "precision mediump float;\n" + source;
    } else {
      source = "precision highp float;\n" + source;
    }
  } else {
    if (!shouldUseHighPrecisionShader) {
      source = source.replace("precision highp float", "precision mediump float");
    }
  }
  return source;
}
function _ExtractOperation(expression) {
  const regex = /defined\((.+)\)/;
  const match = regex.exec(expression);
  if (match && match.length) {
    return new ShaderDefineIsDefinedOperator(match[1].trim(), expression[0] === "!");
  }
  const operators = ["==", "!=", ">=", "<=", "<", ">"];
  let operator = "";
  let indexOperator = 0;
  for (operator of operators) {
    indexOperator = expression.indexOf(operator);
    if (indexOperator > -1) {
      break;
    }
  }
  if (indexOperator === -1) {
    return new ShaderDefineIsDefinedOperator(expression);
  }
  const define = expression.substring(0, indexOperator).trim();
  const value = expression.substring(indexOperator + operator.length).trim();
  return new ShaderDefineArithmeticOperator(define, operator, value);
}
function _BuildSubExpression(expression) {
  expression = expression.replace(regexSE, "defined[$1]");
  const postfix = ShaderDefineExpression.infixToPostfix(expression);
  const stack = [];
  for (const c of postfix) {
    if (c !== "||" && c !== "&&") {
      stack.push(c);
    } else if (stack.length >= 2) {
      let v1 = stack[stack.length - 1], v2 = stack[stack.length - 2];
      stack.length -= 2;
      const operator = c == "&&" ? new ShaderDefineAndOperator() : new ShaderDefineOrOperator();
      if (typeof v1 === "string") {
        v1 = v1.replace(regexSERevert, "defined($1)");
      }
      if (typeof v2 === "string") {
        v2 = v2.replace(regexSERevert, "defined($1)");
      }
      operator.leftOperand = typeof v2 === "string" ? _ExtractOperation(v2) : v2;
      operator.rightOperand = typeof v1 === "string" ? _ExtractOperation(v1) : v1;
      stack.push(operator);
    }
  }
  let result = stack[stack.length - 1];
  if (typeof result === "string") {
    result = result.replace(regexSERevert, "defined($1)");
  }
  return typeof result === "string" ? _ExtractOperation(result) : result;
}
function _BuildExpression(line, start) {
  const node = new ShaderCodeTestNode();
  const command = line.substring(0, start);
  let expression = line.substring(start);
  expression = expression.substring(0, (expression.indexOf("//") + 1 || expression.length + 1) - 1).trim();
  if (command === "#ifdef") {
    node.testExpression = new ShaderDefineIsDefinedOperator(expression);
  } else if (command === "#ifndef") {
    node.testExpression = new ShaderDefineIsDefinedOperator(expression, true);
  } else {
    node.testExpression = _BuildSubExpression(expression);
  }
  return node;
}
function _MoveCursorWithinIf(cursor, rootNode, ifNode) {
  let line = cursor.currentLine;
  while (_MoveCursor(cursor, ifNode)) {
    line = cursor.currentLine;
    const first5 = line.substring(0, 5).toLowerCase();
    if (first5 === "#else") {
      const elseNode = new ShaderCodeNode();
      rootNode.children.push(elseNode);
      _MoveCursor(cursor, elseNode);
      return;
    } else if (first5 === "#elif") {
      const elifNode = _BuildExpression(line, 5);
      rootNode.children.push(elifNode);
      ifNode = elifNode;
    }
  }
}
function _MoveCursor(cursor, rootNode) {
  while (cursor.canRead) {
    cursor.lineIndex++;
    const line = cursor.currentLine;
    if (line.indexOf("#") >= 0) {
      const matches = _MoveCursorRegex.exec(line);
      if (matches && matches.length) {
        const keyword = matches[0];
        switch (keyword) {
          case "#ifdef": {
            const newRootNode = new ShaderCodeConditionNode();
            rootNode.children.push(newRootNode);
            const ifNode = _BuildExpression(line, 6);
            newRootNode.children.push(ifNode);
            _MoveCursorWithinIf(cursor, newRootNode, ifNode);
            break;
          }
          case "#else":
          case "#elif":
            return true;
          case "#endif":
            return false;
          case "#ifndef": {
            const newRootNode = new ShaderCodeConditionNode();
            rootNode.children.push(newRootNode);
            const ifNode = _BuildExpression(line, 7);
            newRootNode.children.push(ifNode);
            _MoveCursorWithinIf(cursor, newRootNode, ifNode);
            break;
          }
          case "#if": {
            const newRootNode = new ShaderCodeConditionNode();
            const ifNode = _BuildExpression(line, 3);
            rootNode.children.push(newRootNode);
            newRootNode.children.push(ifNode);
            _MoveCursorWithinIf(cursor, newRootNode, ifNode);
            break;
          }
        }
        continue;
      }
    }
    const newNode = new ShaderCodeNode();
    newNode.line = line;
    rootNode.children.push(newNode);
    if (line[0] === "#" && line[1] === "d") {
      const split = line.replace(";", "").split(" ");
      newNode.additionalDefineKey = split[1];
      if (split.length === 3) {
        newNode.additionalDefineValue = split[2];
      }
    }
  }
  return false;
}
function _EvaluatePreProcessors(sourceCode, preprocessors, options) {
  const rootNode = new ShaderCodeNode();
  const cursor = new ShaderCodeCursor();
  cursor.lineIndex = -1;
  cursor.lines = sourceCode.split("\n");
  _MoveCursor(cursor, rootNode);
  return rootNode.process(preprocessors, options);
}
function _PreparePreProcessors(options, engine) {
  const defines = options.defines;
  const preprocessors = {};
  for (const define of defines) {
    const keyValue = define.replace("#define", "").replace(";", "").trim();
    const split = keyValue.split(" ");
    preprocessors[split[0]] = split.length > 1 ? split[1] : "";
  }
  if (options.processor?.shaderLanguage === 0) {
    preprocessors["GL_ES"] = "true";
  }
  preprocessors["__VERSION__"] = options.version;
  preprocessors[options.platformName] = "true";
  _getGlobalDefines(preprocessors, engine?.isNDCHalfZRange, engine?.useReverseDepthBuffer, engine?.useExactSrgbConversions);
  return preprocessors;
}
function _ProcessShaderConversion(sourceCode, options, engine) {
  let preparedSourceCode = _ProcessPrecision(sourceCode, options);
  if (!options.processor) {
    return preparedSourceCode;
  }
  if (options.processor.shaderLanguage === 0 && preparedSourceCode.indexOf("#version 3") !== -1) {
    preparedSourceCode = preparedSourceCode.replace("#version 300 es", "");
    if (!options.processor.parseGLES3) {
      return preparedSourceCode;
    }
  }
  const defines = options.defines;
  const preprocessors = _PreparePreProcessors(options, engine);
  if (options.processor.preProcessor) {
    preparedSourceCode = options.processor.preProcessor(preparedSourceCode, defines, preprocessors, options.isFragment, options.processingContext);
  }
  preparedSourceCode = _EvaluatePreProcessors(preparedSourceCode, preprocessors, options);
  if (options.processor.postProcessor) {
    preparedSourceCode = options.processor.postProcessor(preparedSourceCode, defines, options.isFragment, options.processingContext, engine ? {
      drawBuffersExtensionDisabled: engine.getCaps().drawBuffersExtension ? false : true
    } : {});
  }
  if (engine?._features.needShaderCodeInlining) {
    preparedSourceCode = engine.inlineShaderCode(preparedSourceCode);
  }
  return preparedSourceCode;
}
function _ApplyPreProcessing(sourceCode, options, engine) {
  let preparedSourceCode = sourceCode;
  const defines = options.defines;
  const preprocessors = _PreparePreProcessors(options, engine);
  if (options.processor?.preProcessor) {
    preparedSourceCode = options.processor.preProcessor(preparedSourceCode, defines, preprocessors, options.isFragment, options.processingContext);
  }
  preparedSourceCode = _EvaluatePreProcessors(preparedSourceCode, preprocessors, options);
  if (options.processor?.postProcessor) {
    preparedSourceCode = options.processor.postProcessor(preparedSourceCode, defines, options.isFragment, options.processingContext, engine ? {
      drawBuffersExtensionDisabled: engine.getCaps().drawBuffersExtension ? false : true
    } : {});
  }
  if (engine._features.needShaderCodeInlining) {
    preparedSourceCode = engine.inlineShaderCode(preparedSourceCode);
  }
  return preparedSourceCode;
}
function _ProcessIncludes(sourceCode, options, callback) {
  reusableMatches.length = 0;
  let match;
  while ((match = regexShaderInclude.exec(sourceCode)) !== null) {
    reusableMatches.push(match);
  }
  let returnValue = String(sourceCode);
  let parts = [sourceCode];
  let keepProcessing = false;
  for (const match2 of reusableMatches) {
    let includeFile = match2[1];
    if (includeFile.indexOf("__decl__") !== -1) {
      includeFile = includeFile.replace(regexShaderDecl, "");
      if (options.supportsUniformBuffers) {
        includeFile = includeFile.replace("Vertex", "Ubo").replace("Fragment", "Ubo");
      }
      includeFile = includeFile + "Declaration";
    }
    if (options.includesShadersStore[includeFile]) {
      let includeContent = options.includesShadersStore[includeFile];
      if (match2[2]) {
        const splits = match2[3].split(",");
        for (let index = 0; index < splits.length; index += 2) {
          const source = new RegExp(splits[index], "g");
          const dest = splits[index + 1];
          includeContent = includeContent.replace(source, dest);
        }
      }
      if (match2[4]) {
        const indexString = match2[5];
        if (indexString.indexOf("..") !== -1) {
          const indexSplits = indexString.split("..");
          const minIndex = parseInt(indexSplits[0]);
          let maxIndex = parseInt(indexSplits[1]);
          let sourceIncludeContent = includeContent.slice(0);
          includeContent = "";
          if (isNaN(maxIndex)) {
            maxIndex = options.indexParameters[indexSplits[1]];
          }
          for (let i = minIndex; i < maxIndex; i++) {
            if (!options.supportsUniformBuffers) {
              sourceIncludeContent = sourceIncludeContent.replace(regexLightX, (str, p1) => {
                return p1 + "{X}";
              });
            }
            includeContent += sourceIncludeContent.replace(regexX, i.toString()) + "\n";
          }
        } else {
          if (!options.supportsUniformBuffers) {
            includeContent = includeContent.replace(regexLightX, (str, p1) => {
              return p1 + "{X}";
            });
          }
          includeContent = includeContent.replace(regexX, indexString);
        }
      }
      const newParts = [];
      for (const part of parts) {
        const splitPart = part.split(match2[0]);
        for (let i = 0; i < splitPart.length - 1; i++) {
          newParts.push(splitPart[i]);
          newParts.push(includeContent);
        }
        newParts.push(splitPart[splitPart.length - 1]);
      }
      parts = newParts;
      keepProcessing = keepProcessing || includeContent.indexOf("#include<") >= 0 || includeContent.indexOf("#include <") >= 0;
    } else {
      const includeShaderUrl = options.shadersRepository + "ShadersInclude/" + includeFile + ".fx";
      _functionContainer.loadFile(includeShaderUrl, (fileContent) => {
        options.includesShadersStore[includeFile] = fileContent;
        _ProcessIncludes(parts.join(""), options, callback);
      });
      return;
    }
  }
  reusableMatches.length = 0;
  returnValue = parts.join("");
  if (keepProcessing) {
    _ProcessIncludes(returnValue.toString(), options, callback);
  } else {
    callback(returnValue);
  }
}
var _functionContainer = {
  /**
   * Loads a file from a url
   * @param url url to load
   * @param onSuccess callback called when the file successfully loads
   * @param onProgress callback called while file is loading (if the server supports this mode)
   * @param offlineProvider defines the offline provider for caching
   * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
   * @param onError callback called when the file fails to load
   * @returns a file request object
   * @internal
   */
  loadFile: (url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) => {
    throw _WarnImport("FileTools");
  }
};

// node_modules/@babylonjs/core/Misc/timingTools.js
var TimingTools = class {
  /**
   * Polyfill for setImmediate
   * @param action defines the action to execute after the current execution block
   */
  static SetImmediate(action) {
    if (IsWindowObjectExist() && window.setImmediate) {
      window.setImmediate(action);
    } else {
      setTimeout(action, 1);
    }
  }
};

// node_modules/@babylonjs/core/Engines/WebGL/webGLPipelineContext.js
var WebGLPipelineContext = class {
  constructor() {
    this._valueCache = {};
    this.vertexCompilationError = null;
    this.fragmentCompilationError = null;
    this.programLinkError = null;
    this.programValidationError = null;
    this._isDisposed = false;
  }
  get isAsync() {
    return this.isParallelCompiled;
  }
  get isReady() {
    if (this.program) {
      if (this.isParallelCompiled) {
        return this.engine._isRenderingStateCompiled(this);
      }
      return true;
    }
    return false;
  }
  _handlesSpectorRebuildCallback(onCompiled) {
    if (onCompiled && this.program) {
      onCompiled(this.program);
    }
  }
  setEngine(engine) {
    this.engine = engine;
  }
  _fillEffectInformation(effect, uniformBuffersNames, uniformsNames, uniforms, samplerList, samplers, attributesNames, attributes) {
    const engine = this.engine;
    if (engine.supportsUniformBuffers) {
      for (const name2 in uniformBuffersNames) {
        effect.bindUniformBlock(name2, uniformBuffersNames[name2]);
      }
    }
    const effectAvailableUniforms = this.engine.getUniforms(this, uniformsNames);
    effectAvailableUniforms.forEach((uniform, index2) => {
      uniforms[uniformsNames[index2]] = uniform;
    });
    this._uniforms = uniforms;
    let index;
    for (index = 0; index < samplerList.length; index++) {
      const sampler = effect.getUniform(samplerList[index]);
      if (sampler == null) {
        samplerList.splice(index, 1);
        index--;
      }
    }
    samplerList.forEach((name2, index2) => {
      samplers[name2] = index2;
    });
    for (const attr of engine.getAttributes(this, attributesNames)) {
      attributes.push(attr);
    }
  }
  /**
   * Release all associated resources.
   **/
  dispose() {
    this._uniforms = {};
    this._isDisposed = true;
  }
  /**
   * @internal
   */
  _cacheMatrix(uniformName, matrix) {
    const cache = this._valueCache[uniformName];
    const flag = matrix.updateFlag;
    if (cache !== void 0 && cache === flag) {
      return false;
    }
    this._valueCache[uniformName] = flag;
    return true;
  }
  /**
   * @internal
   */
  _cacheFloat2(uniformName, x, y) {
    let cache = this._valueCache[uniformName];
    if (!cache || cache.length !== 2) {
      cache = [x, y];
      this._valueCache[uniformName] = cache;
      return true;
    }
    let changed = false;
    if (cache[0] !== x) {
      cache[0] = x;
      changed = true;
    }
    if (cache[1] !== y) {
      cache[1] = y;
      changed = true;
    }
    return changed;
  }
  /**
   * @internal
   */
  _cacheFloat3(uniformName, x, y, z) {
    let cache = this._valueCache[uniformName];
    if (!cache || cache.length !== 3) {
      cache = [x, y, z];
      this._valueCache[uniformName] = cache;
      return true;
    }
    let changed = false;
    if (cache[0] !== x) {
      cache[0] = x;
      changed = true;
    }
    if (cache[1] !== y) {
      cache[1] = y;
      changed = true;
    }
    if (cache[2] !== z) {
      cache[2] = z;
      changed = true;
    }
    return changed;
  }
  /**
   * @internal
   */
  _cacheFloat4(uniformName, x, y, z, w) {
    let cache = this._valueCache[uniformName];
    if (!cache || cache.length !== 4) {
      cache = [x, y, z, w];
      this._valueCache[uniformName] = cache;
      return true;
    }
    let changed = false;
    if (cache[0] !== x) {
      cache[0] = x;
      changed = true;
    }
    if (cache[1] !== y) {
      cache[1] = y;
      changed = true;
    }
    if (cache[2] !== z) {
      cache[2] = z;
      changed = true;
    }
    if (cache[3] !== w) {
      cache[3] = w;
      changed = true;
    }
    return changed;
  }
  /**
   * Sets an integer value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param value Value to be set.
   */
  setInt(uniformName, value) {
    const cache = this._valueCache[uniformName];
    if (cache !== void 0 && cache === value) {
      return;
    }
    if (this.engine.setInt(this._uniforms[uniformName], value)) {
      this._valueCache[uniformName] = value;
    }
  }
  /**
   * Sets a int2 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First int in int2.
   * @param y Second int in int2.
   */
  setInt2(uniformName, x, y) {
    if (this._cacheFloat2(uniformName, x, y)) {
      if (!this.engine.setInt2(this._uniforms[uniformName], x, y)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a int3 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First int in int3.
   * @param y Second int in int3.
   * @param z Third int in int3.
   */
  setInt3(uniformName, x, y, z) {
    if (this._cacheFloat3(uniformName, x, y, z)) {
      if (!this.engine.setInt3(this._uniforms[uniformName], x, y, z)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a int4 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First int in int4.
   * @param y Second int in int4.
   * @param z Third int in int4.
   * @param w Fourth int in int4.
   */
  setInt4(uniformName, x, y, z, w) {
    if (this._cacheFloat4(uniformName, x, y, z, w)) {
      if (!this.engine.setInt4(this._uniforms[uniformName], x, y, z, w)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets an int array on a uniform variable.
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setIntArray(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setIntArray(this._uniforms[uniformName], array);
  }
  /**
   * Sets an int array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setIntArray2(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setIntArray2(this._uniforms[uniformName], array);
  }
  /**
   * Sets an int array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setIntArray3(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setIntArray3(this._uniforms[uniformName], array);
  }
  /**
   * Sets an int array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setIntArray4(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setIntArray4(this._uniforms[uniformName], array);
  }
  /**
   * Sets an unsigned integer value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param value Value to be set.
   */
  setUInt(uniformName, value) {
    const cache = this._valueCache[uniformName];
    if (cache !== void 0 && cache === value) {
      return;
    }
    if (this.engine.setUInt(this._uniforms[uniformName], value)) {
      this._valueCache[uniformName] = value;
    }
  }
  /**
   * Sets an unsigned int2 value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First unsigned int in uint2.
   * @param y Second unsigned int in uint2.
   */
  setUInt2(uniformName, x, y) {
    if (this._cacheFloat2(uniformName, x, y)) {
      if (!this.engine.setUInt2(this._uniforms[uniformName], x, y)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets an unsigned int3 value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First unsigned int in uint3.
   * @param y Second unsigned int in uint3.
   * @param z Third unsigned int in uint3.
   */
  setUInt3(uniformName, x, y, z) {
    if (this._cacheFloat3(uniformName, x, y, z)) {
      if (!this.engine.setUInt3(this._uniforms[uniformName], x, y, z)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets an unsigned int4 value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First unsigned int in uint4.
   * @param y Second unsigned int in uint4.
   * @param z Third unsigned int in uint4.
   * @param w Fourth unsigned int in uint4.
   */
  setUInt4(uniformName, x, y, z, w) {
    if (this._cacheFloat4(uniformName, x, y, z, w)) {
      if (!this.engine.setUInt4(this._uniforms[uniformName], x, y, z, w)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets an unsigned int array on a uniform variable.
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setUIntArray(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setUIntArray(this._uniforms[uniformName], array);
  }
  /**
   * Sets an unsigned int array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setUIntArray2(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setUIntArray2(this._uniforms[uniformName], array);
  }
  /**
   * Sets an unsigned int array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setUIntArray3(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setUIntArray3(this._uniforms[uniformName], array);
  }
  /**
   * Sets an unsigned int array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setUIntArray4(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setUIntArray4(this._uniforms[uniformName], array);
  }
  /**
   * Sets an array on a uniform variable.
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setArray(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setArray(this._uniforms[uniformName], array);
  }
  /**
   * Sets an array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setArray2(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setArray2(this._uniforms[uniformName], array);
  }
  /**
   * Sets an array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setArray3(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setArray3(this._uniforms[uniformName], array);
  }
  /**
   * Sets an array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   */
  setArray4(uniformName, array) {
    this._valueCache[uniformName] = null;
    this.engine.setArray4(this._uniforms[uniformName], array);
  }
  /**
   * Sets matrices on a uniform variable.
   * @param uniformName Name of the variable.
   * @param matrices matrices to be set.
   */
  setMatrices(uniformName, matrices) {
    if (!matrices) {
      return;
    }
    this._valueCache[uniformName] = null;
    this.engine.setMatrices(this._uniforms[uniformName], matrices);
  }
  /**
   * Sets matrix on a uniform variable.
   * @param uniformName Name of the variable.
   * @param matrix matrix to be set.
   */
  setMatrix(uniformName, matrix) {
    if (this._cacheMatrix(uniformName, matrix)) {
      if (!this.engine.setMatrices(this._uniforms[uniformName], matrix.asArray())) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a 3x3 matrix on a uniform variable. (Specified as [1,2,3,4,5,6,7,8,9] will result in [1,2,3][4,5,6][7,8,9] matrix)
   * @param uniformName Name of the variable.
   * @param matrix matrix to be set.
   */
  setMatrix3x3(uniformName, matrix) {
    this._valueCache[uniformName] = null;
    this.engine.setMatrix3x3(this._uniforms[uniformName], matrix);
  }
  /**
   * Sets a 2x2 matrix on a uniform variable. (Specified as [1,2,3,4] will result in [1,2][3,4] matrix)
   * @param uniformName Name of the variable.
   * @param matrix matrix to be set.
   */
  setMatrix2x2(uniformName, matrix) {
    this._valueCache[uniformName] = null;
    this.engine.setMatrix2x2(this._uniforms[uniformName], matrix);
  }
  /**
   * Sets a float on a uniform variable.
   * @param uniformName Name of the variable.
   * @param value value to be set.
   */
  setFloat(uniformName, value) {
    const cache = this._valueCache[uniformName];
    if (cache !== void 0 && cache === value) {
      return;
    }
    if (this.engine.setFloat(this._uniforms[uniformName], value)) {
      this._valueCache[uniformName] = value;
    }
  }
  /**
   * Sets a Vector2 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param vector2 vector2 to be set.
   */
  setVector2(uniformName, vector2) {
    if (this._cacheFloat2(uniformName, vector2.x, vector2.y)) {
      if (!this.engine.setFloat2(this._uniforms[uniformName], vector2.x, vector2.y)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a float2 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First float in float2.
   * @param y Second float in float2.
   */
  setFloat2(uniformName, x, y) {
    if (this._cacheFloat2(uniformName, x, y)) {
      if (!this.engine.setFloat2(this._uniforms[uniformName], x, y)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a Vector3 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param vector3 Value to be set.
   */
  setVector3(uniformName, vector3) {
    if (this._cacheFloat3(uniformName, vector3.x, vector3.y, vector3.z)) {
      if (!this.engine.setFloat3(this._uniforms[uniformName], vector3.x, vector3.y, vector3.z)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a float3 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First float in float3.
   * @param y Second float in float3.
   * @param z Third float in float3.
   */
  setFloat3(uniformName, x, y, z) {
    if (this._cacheFloat3(uniformName, x, y, z)) {
      if (!this.engine.setFloat3(this._uniforms[uniformName], x, y, z)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a Vector4 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param vector4 Value to be set.
   */
  setVector4(uniformName, vector4) {
    if (this._cacheFloat4(uniformName, vector4.x, vector4.y, vector4.z, vector4.w)) {
      if (!this.engine.setFloat4(this._uniforms[uniformName], vector4.x, vector4.y, vector4.z, vector4.w)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a Quaternion on a uniform variable.
   * @param uniformName Name of the variable.
   * @param quaternion Value to be set.
   */
  setQuaternion(uniformName, quaternion) {
    if (this._cacheFloat4(uniformName, quaternion.x, quaternion.y, quaternion.z, quaternion.w)) {
      if (!this.engine.setFloat4(this._uniforms[uniformName], quaternion.x, quaternion.y, quaternion.z, quaternion.w)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a float4 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First float in float4.
   * @param y Second float in float4.
   * @param z Third float in float4.
   * @param w Fourth float in float4.
   */
  setFloat4(uniformName, x, y, z, w) {
    if (this._cacheFloat4(uniformName, x, y, z, w)) {
      if (!this.engine.setFloat4(this._uniforms[uniformName], x, y, z, w)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a Color3 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param color3 Value to be set.
   */
  setColor3(uniformName, color3) {
    if (this._cacheFloat3(uniformName, color3.r, color3.g, color3.b)) {
      if (!this.engine.setFloat3(this._uniforms[uniformName], color3.r, color3.g, color3.b)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a Color4 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param color3 Value to be set.
   * @param alpha Alpha value to be set.
   */
  setColor4(uniformName, color3, alpha) {
    if (this._cacheFloat4(uniformName, color3.r, color3.g, color3.b, alpha)) {
      if (!this.engine.setFloat4(this._uniforms[uniformName], color3.r, color3.g, color3.b, alpha)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  /**
   * Sets a Color4 on a uniform variable
   * @param uniformName defines the name of the variable
   * @param color4 defines the value to be set
   */
  setDirectColor4(uniformName, color4) {
    if (this._cacheFloat4(uniformName, color4.r, color4.g, color4.b, color4.a)) {
      if (!this.engine.setFloat4(this._uniforms[uniformName], color4.r, color4.g, color4.b, color4.a)) {
        this._valueCache[uniformName] = null;
      }
    }
  }
  _getVertexShaderCode() {
    return this.vertexShader ? this.engine._getShaderSource(this.vertexShader) : null;
  }
  _getFragmentShaderCode() {
    return this.fragmentShader ? this.engine._getShaderSource(this.fragmentShader) : null;
  }
};

// node_modules/@babylonjs/core/Engines/thinEngine.functions.js
var _stateObject = /* @__PURE__ */ new WeakMap();
var singleStateObject = {
  _webGLVersion: 2,
  cachedPipelines: {}
};
function getStateObject(context) {
  let state = _stateObject.get(context);
  if (!state) {
    if (!context) {
      return singleStateObject;
    }
    state = {
      // use feature detection. instanceof returns false. This only exists on WebGL2 context
      _webGLVersion: context.TEXTURE_BINDING_3D ? 2 : 1,
      _context: context,
      cachedPipelines: {}
    };
    _stateObject.set(context, state);
  }
  return state;
}
function deleteStateObject(context) {
  _stateObject.delete(context);
}
function createRawShaderProgram(pipelineContext, vertexCode, fragmentCode, context, transformFeedbackVaryings, _createShaderProgramInjection) {
  const stateObject = getStateObject(context);
  if (!_createShaderProgramInjection) {
    _createShaderProgramInjection = stateObject._createShaderProgramInjection ?? _createShaderProgram;
  }
  const vertexShader = _compileRawShader(vertexCode, "vertex", context, stateObject._contextWasLost);
  const fragmentShader = _compileRawShader(fragmentCode, "fragment", context, stateObject._contextWasLost);
  return _createShaderProgramInjection(pipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings, stateObject.validateShaderPrograms);
}
function createShaderProgram(pipelineContext, vertexCode, fragmentCode, defines, context, transformFeedbackVaryings = null, _createShaderProgramInjection) {
  const stateObject = getStateObject(context);
  if (!_createShaderProgramInjection) {
    _createShaderProgramInjection = stateObject._createShaderProgramInjection ?? _createShaderProgram;
  }
  const shaderVersion = stateObject._webGLVersion > 1 ? "#version 300 es\n#define WEBGL2 \n" : "";
  const vertexShader = _compileShader(vertexCode, "vertex", defines, shaderVersion, context, stateObject._contextWasLost);
  const fragmentShader = _compileShader(fragmentCode, "fragment", defines, shaderVersion, context, stateObject._contextWasLost);
  return _createShaderProgramInjection(pipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings, stateObject.validateShaderPrograms);
}
function createPipelineContext(context, _shaderProcessingContext) {
  const pipelineContext = new WebGLPipelineContext();
  const stateObject = getStateObject(context);
  if (stateObject.parallelShaderCompile) {
    pipelineContext.isParallelCompiled = true;
  }
  pipelineContext.context = stateObject._context;
  return pipelineContext;
}
function _createShaderProgram(pipelineContext, vertexShader, fragmentShader, context, _transformFeedbackVaryings = null, validateShaderPrograms) {
  const shaderProgram = context.createProgram();
  pipelineContext.program = shaderProgram;
  if (!shaderProgram) {
    throw new Error("Unable to create program");
  }
  context.attachShader(shaderProgram, vertexShader);
  context.attachShader(shaderProgram, fragmentShader);
  context.linkProgram(shaderProgram);
  pipelineContext.context = context;
  pipelineContext.vertexShader = vertexShader;
  pipelineContext.fragmentShader = fragmentShader;
  if (!pipelineContext.isParallelCompiled) {
    _finalizePipelineContext(pipelineContext, context, validateShaderPrograms);
  }
  return shaderProgram;
}
function _finalizePipelineContext(pipelineContext, gl, validateShaderPrograms) {
  const context = pipelineContext.context;
  const vertexShader = pipelineContext.vertexShader;
  const fragmentShader = pipelineContext.fragmentShader;
  const program = pipelineContext.program;
  const linked = context.getProgramParameter(program, context.LINK_STATUS);
  if (!linked) {
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(vertexShader);
      if (log) {
        pipelineContext.vertexCompilationError = log;
        throw new Error("VERTEX SHADER " + log);
      }
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(fragmentShader);
      if (log) {
        pipelineContext.fragmentCompilationError = log;
        throw new Error("FRAGMENT SHADER " + log);
      }
    }
    const error = context.getProgramInfoLog(program);
    if (error) {
      pipelineContext.programLinkError = error;
      throw new Error(error);
    }
  }
  if (
    /*this.*/
    validateShaderPrograms
  ) {
    context.validateProgram(program);
    const validated = context.getProgramParameter(program, context.VALIDATE_STATUS);
    if (!validated) {
      const error = context.getProgramInfoLog(program);
      if (error) {
        pipelineContext.programValidationError = error;
        throw new Error(error);
      }
    }
  }
  context.deleteShader(vertexShader);
  context.deleteShader(fragmentShader);
  pipelineContext.vertexShader = void 0;
  pipelineContext.fragmentShader = void 0;
  if (pipelineContext.onCompiled) {
    pipelineContext.onCompiled();
    pipelineContext.onCompiled = void 0;
  }
}
function _preparePipelineContext(pipelineContext, vertexSourceCode, fragmentSourceCode, createAsRaw, _rawVertexSourceCode, _rawFragmentSourceCode, rebuildRebind, defines, transformFeedbackVaryings, _key = "", onReady, createRawShaderProgramInjection, createShaderProgramInjection) {
  const stateObject = getStateObject(pipelineContext.context);
  if (!createRawShaderProgramInjection) {
    createRawShaderProgramInjection = stateObject.createRawShaderProgramInjection ?? createRawShaderProgram;
  }
  if (!createShaderProgramInjection) {
    createShaderProgramInjection = stateObject.createShaderProgramInjection ?? createShaderProgram;
  }
  const webGLRenderingState = pipelineContext;
  if (createAsRaw) {
    webGLRenderingState.program = createRawShaderProgramInjection(webGLRenderingState, vertexSourceCode, fragmentSourceCode, webGLRenderingState.context, transformFeedbackVaryings);
  } else {
    webGLRenderingState.program = createShaderProgramInjection(webGLRenderingState, vertexSourceCode, fragmentSourceCode, defines, webGLRenderingState.context, transformFeedbackVaryings);
  }
  webGLRenderingState.program.__SPECTOR_rebuildProgram = rebuildRebind;
  onReady();
}
function _compileShader(source, type, defines, shaderVersion, gl, _contextWasLost) {
  return _compileRawShader(_ConcatenateShader(source, defines, shaderVersion), type, gl, _contextWasLost);
}
function _compileRawShader(source, type, gl, _contextWasLost) {
  const shader2 = gl.createShader(type === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
  if (!shader2) {
    let error = gl.NO_ERROR;
    let tempError = gl.NO_ERROR;
    while ((tempError = gl.getError()) !== gl.NO_ERROR) {
      error = tempError;
    }
    throw new Error(`Something went wrong while creating a gl ${type} shader object. gl error=${error}, gl isContextLost=${gl.isContextLost()}, _contextWasLost=${_contextWasLost}`);
  }
  gl.shaderSource(shader2, source);
  gl.compileShader(shader2);
  return shader2;
}
function _setProgram(program, gl) {
  gl.useProgram(program);
}
function _executeWhenRenderingStateIsCompiled(pipelineContext, action) {
  const webGLPipelineContext = pipelineContext;
  if (!webGLPipelineContext.isParallelCompiled) {
    action(pipelineContext);
    return;
  }
  const oldHandler = webGLPipelineContext.onCompiled;
  webGLPipelineContext.onCompiled = () => {
    oldHandler?.();
    action(pipelineContext);
  };
}

// node_modules/@babylonjs/core/Materials/effect.functions.js
function getCachedPipeline(name2, context) {
  const stateObject = getStateObject(context);
  return stateObject.cachedPipelines[name2];
}
function resetCachedPipeline(pipeline) {
  const name2 = pipeline._name;
  const context = pipeline.context;
  if (name2 && context) {
    const stateObject = getStateObject(context);
    const cachedPipeline = stateObject.cachedPipelines[name2];
    cachedPipeline?.dispose();
    delete stateObject.cachedPipelines[name2];
  }
}
function _processShaderCode(processorOptions, baseName, processFinalCode, onFinalCodeReady, shaderLanguage, engine, effectContext) {
  let vertexSource;
  let fragmentSource;
  const hostDocument = IsWindowObjectExist() ? engine?.getHostDocument() : null;
  if (typeof baseName === "string") {
    vertexSource = baseName;
  } else if (baseName.vertexSource) {
    vertexSource = "source:" + baseName.vertexSource;
  } else if (baseName.vertexElement) {
    vertexSource = hostDocument?.getElementById(baseName.vertexElement) || baseName.vertexElement;
  } else {
    vertexSource = baseName.vertex || baseName;
  }
  if (typeof baseName === "string") {
    fragmentSource = baseName;
  } else if (baseName.fragmentSource) {
    fragmentSource = "source:" + baseName.fragmentSource;
  } else if (baseName.fragmentElement) {
    fragmentSource = hostDocument?.getElementById(baseName.fragmentElement) || baseName.fragmentElement;
  } else {
    fragmentSource = baseName.fragment || baseName;
  }
  const shaderCodes = [void 0, void 0];
  const shadersLoaded = () => {
    if (shaderCodes[0] && shaderCodes[1]) {
      processorOptions.isFragment = true;
      const [migratedVertexCode, fragmentCode] = shaderCodes;
      Process(fragmentCode, processorOptions, (migratedFragmentCode, codeBeforeMigration) => {
        if (effectContext) {
          effectContext._fragmentSourceCodeBeforeMigration = codeBeforeMigration;
        }
        if (processFinalCode) {
          migratedFragmentCode = processFinalCode("fragment", migratedFragmentCode);
        }
        const finalShaders = Finalize(migratedVertexCode, migratedFragmentCode, processorOptions);
        processorOptions = null;
        const finalCode = _useFinalCode(finalShaders.vertexCode, finalShaders.fragmentCode, baseName, shaderLanguage);
        onFinalCodeReady?.(finalCode.vertexSourceCode, finalCode.fragmentSourceCode);
      }, engine);
    }
  };
  _loadShader(vertexSource, "Vertex", "", (vertexCode) => {
    Initialize(processorOptions);
    Process(vertexCode, processorOptions, (migratedVertexCode, codeBeforeMigration) => {
      if (effectContext) {
        effectContext._rawVertexSourceCode = vertexCode;
        effectContext._vertexSourceCodeBeforeMigration = codeBeforeMigration;
      }
      if (processFinalCode) {
        migratedVertexCode = processFinalCode("vertex", migratedVertexCode);
      }
      shaderCodes[0] = migratedVertexCode;
      shadersLoaded();
    }, engine);
  }, shaderLanguage);
  _loadShader(fragmentSource, "Fragment", "Pixel", (fragmentCode) => {
    if (effectContext) {
      effectContext._rawFragmentSourceCode = fragmentCode;
    }
    shaderCodes[1] = fragmentCode;
    shadersLoaded();
  }, shaderLanguage);
}
function _loadShader(shader2, key, optionalKey, callback, shaderLanguage, _loadFileInjection) {
  if (typeof HTMLElement !== "undefined") {
    if (shader2 instanceof HTMLElement) {
      const shaderCode = GetDOMTextContent(shader2);
      callback(shaderCode);
      return;
    }
  }
  if (shader2.substr(0, 7) === "source:") {
    callback(shader2.substr(7));
    return;
  }
  if (shader2.substr(0, 7) === "base64:") {
    const shaderBinary = window.atob(shader2.substr(7));
    callback(shaderBinary);
    return;
  }
  const shaderStore = ShaderStore.GetShadersStore(shaderLanguage);
  if (shaderStore[shader2 + key + "Shader"]) {
    callback(shaderStore[shader2 + key + "Shader"]);
    return;
  }
  if (optionalKey && shaderStore[shader2 + optionalKey + "Shader"]) {
    callback(shaderStore[shader2 + optionalKey + "Shader"]);
    return;
  }
  let shaderUrl;
  if (shader2[0] === "." || shader2[0] === "/" || shader2.indexOf("http") > -1) {
    shaderUrl = shader2;
  } else {
    shaderUrl = ShaderStore.GetShadersRepository(shaderLanguage) + shader2;
  }
  _loadFileInjection = _loadFileInjection || _loadFile;
  if (!_loadFileInjection) {
    throw new Error("loadFileInjection is not defined");
  }
  _loadFileInjection(shaderUrl + "." + key.toLowerCase() + ".fx", callback);
}
function _useFinalCode(migratedVertexCode, migratedFragmentCode, baseName, shaderLanguage) {
  if (baseName) {
    const vertex = baseName.vertexElement || baseName.vertex || baseName.spectorName || baseName;
    const fragment = baseName.fragmentElement || baseName.fragment || baseName.spectorName || baseName;
    return {
      vertexSourceCode: (shaderLanguage === 1 ? "//" : "") + "#define SHADER_NAME vertex:" + vertex + "\n" + migratedVertexCode,
      fragmentSourceCode: (shaderLanguage === 1 ? "//" : "") + "#define SHADER_NAME fragment:" + fragment + "\n" + migratedFragmentCode
    };
  } else {
    return {
      vertexSourceCode: migratedVertexCode,
      fragmentSourceCode: migratedFragmentCode
    };
  }
}
var createAndPreparePipelineContext = (options, createPipelineContext2, _preparePipelineContext2, _executeWhenRenderingStateIsCompiled2) => {
  try {
    const pipelineContext = options.existingPipelineContext || createPipelineContext2(options.shaderProcessingContext);
    pipelineContext._name = options.name;
    if (options.name && options.context) {
      const stateObject = getStateObject(options.context);
      stateObject.cachedPipelines[options.name] = pipelineContext;
    }
    _preparePipelineContext2(pipelineContext, options.vertex, options.fragment, !!options.createAsRaw, "", "", options.rebuildRebind, options.defines, options.transformFeedbackVaryings, "", () => {
      _executeWhenRenderingStateIsCompiled2(pipelineContext, () => {
        options.onRenderingStateCompiled?.(pipelineContext);
      });
    });
    return pipelineContext;
  } catch (e) {
    Logger.Error("Error compiling effect");
    throw e;
  }
};

// node_modules/@babylonjs/core/Materials/effect.js
var Effect = class _Effect {
  /**
   * Gets or sets the relative url used to load shaders if using the engine in non-minified mode
   */
  static get ShadersRepository() {
    return ShaderStore.ShadersRepository;
  }
  static set ShadersRepository(repo) {
    ShaderStore.ShadersRepository = repo;
  }
  /**
   * Observable that will be called when effect is bound.
   */
  get onBindObservable() {
    if (!this._onBindObservable) {
      this._onBindObservable = new Observable();
    }
    return this._onBindObservable;
  }
  /**
   * Gets the shader language type used to write vertex and fragment source code.
   */
  get shaderLanguage() {
    return this._shaderLanguage;
  }
  /**
   * Instantiates an effect.
   * An effect can be used to create/manage/execute vertex and fragment shaders.
   * @param baseName Name of the effect.
   * @param attributesNamesOrOptions List of attribute names that will be passed to the shader or set of all options to create the effect.
   * @param uniformsNamesOrEngine List of uniform variable names that will be passed to the shader or the engine that will be used to render effect.
   * @param samplers List of sampler variables that will be passed to the shader.
   * @param engine Engine to be used to render the effect
   * @param defines Define statements to be added to the shader.
   * @param fallbacks Possible fallbacks for this effect to improve performance when needed.
   * @param onCompiled Callback that will be called when the shader is compiled.
   * @param onError Callback that will be called if an error occurs during shader compilation.
   * @param indexParameters Parameters to be used with Babylons include syntax to iterate over an array (eg. \{lights: 10\})
   * @param key Effect Key identifying uniquely compiled shader variants
   * @param shaderLanguage the language the shader is written in (default: GLSL)
   */
  constructor(baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers = null, engine, defines = null, fallbacks = null, onCompiled = null, onError = null, indexParameters, key = "", shaderLanguage = 0) {
    this.defines = "";
    this.onCompiled = null;
    this.onError = null;
    this.onBind = null;
    this.uniqueId = 0;
    this.onCompileObservable = new Observable();
    this.onErrorObservable = new Observable();
    this._onBindObservable = null;
    this._isDisposed = false;
    this._bonesComputationForcedToCPU = false;
    this._uniformBuffersNames = {};
    this._multiTarget = false;
    this._samplers = {};
    this._isReady = false;
    this._compilationError = "";
    this._allFallbacksProcessed = false;
    this._uniforms = {};
    this._key = "";
    this._fallbacks = null;
    this._vertexSourceCodeOverride = "";
    this._fragmentSourceCodeOverride = "";
    this._transformFeedbackVaryings = null;
    this._pipelineContext = null;
    this._vertexSourceCode = "";
    this._fragmentSourceCode = "";
    this._vertexSourceCodeBeforeMigration = "";
    this._fragmentSourceCodeBeforeMigration = "";
    this._rawVertexSourceCode = "";
    this._rawFragmentSourceCode = "";
    this._processCodeAfterIncludes = void 0;
    this._processFinalCode = null;
    this.name = baseName;
    this._key = key;
    const pipelineName = this._key.replace(/\r/g, "").replace(/\n/g, "|");
    let cachedPipeline = void 0;
    if (attributesNamesOrOptions.attributes) {
      const options = attributesNamesOrOptions;
      this._engine = uniformsNamesOrEngine;
      this._attributesNames = options.attributes;
      this._uniformsNames = options.uniformsNames.concat(options.samplers);
      this._samplerList = options.samplers.slice();
      this.defines = options.defines;
      this.onError = options.onError;
      this.onCompiled = options.onCompiled;
      this._fallbacks = options.fallbacks;
      this._indexParameters = options.indexParameters;
      this._transformFeedbackVaryings = options.transformFeedbackVaryings || null;
      this._multiTarget = !!options.multiTarget;
      this._shaderLanguage = options.shaderLanguage ?? 0;
      if (options.uniformBuffersNames) {
        this._uniformBuffersNamesList = options.uniformBuffersNames.slice();
        for (let i = 0; i < options.uniformBuffersNames.length; i++) {
          this._uniformBuffersNames[options.uniformBuffersNames[i]] = i;
        }
      }
      this._processFinalCode = options.processFinalCode ?? null;
      this._processCodeAfterIncludes = options.processCodeAfterIncludes ?? void 0;
      cachedPipeline = options.existingPipelineContext;
    } else {
      this._engine = engine;
      this.defines = defines == null ? "" : defines;
      this._uniformsNames = uniformsNamesOrEngine.concat(samplers);
      this._samplerList = samplers ? samplers.slice() : [];
      this._attributesNames = attributesNamesOrOptions;
      this._uniformBuffersNamesList = [];
      this._shaderLanguage = shaderLanguage;
      this.onError = onError;
      this.onCompiled = onCompiled;
      this._indexParameters = indexParameters;
      this._fallbacks = fallbacks;
    }
    if (this._engine.shaderPlatformName === "WEBGL2") {
      cachedPipeline = getCachedPipeline(pipelineName, this._engine._gl) ?? cachedPipeline;
    }
    this._attributeLocationByName = {};
    this.uniqueId = _Effect._UniqueIdSeed++;
    if (!cachedPipeline) {
      this._processShaderCode();
    } else {
      this._pipelineContext = cachedPipeline;
      this._pipelineContext.setEngine(this._engine);
      this._onRenderingStateCompiled(this._pipelineContext);
      if (this._pipelineContext.program) {
        this._pipelineContext.program.__SPECTOR_rebuildProgram = this._rebuildProgram.bind(this);
      }
    }
  }
  /** @internal */
  _processShaderCode(shaderProcessor = null, keepExistingPipelineContext = false, shaderProcessingContext = null) {
    this._processingContext = shaderProcessingContext || this._engine._getShaderProcessingContext(this._shaderLanguage, false);
    const processorOptions = {
      defines: this.defines.split("\n"),
      indexParameters: this._indexParameters,
      isFragment: false,
      shouldUseHighPrecisionShader: this._engine._shouldUseHighPrecisionShader,
      processor: shaderProcessor ?? this._engine._getShaderProcessor(this._shaderLanguage),
      supportsUniformBuffers: this._engine.supportsUniformBuffers,
      shadersRepository: ShaderStore.GetShadersRepository(this._shaderLanguage),
      includesShadersStore: ShaderStore.GetIncludesShadersStore(this._shaderLanguage),
      version: (this._engine.version * 100).toString(),
      platformName: this._engine.shaderPlatformName,
      processingContext: this._processingContext,
      isNDCHalfZRange: this._engine.isNDCHalfZRange,
      useReverseDepthBuffer: this._engine.useReverseDepthBuffer,
      processCodeAfterIncludes: this._processCodeAfterIncludes
    };
    _processShaderCode(processorOptions, this.name, this._processFinalCode, (migratedVertexCode, migratedFragmentCode) => {
      this._vertexSourceCode = migratedVertexCode;
      this._fragmentSourceCode = migratedFragmentCode;
      this._prepareEffect(keepExistingPipelineContext);
    }, this._shaderLanguage, this._engine, this);
  }
  /**
   * Unique key for this effect
   */
  get key() {
    return this._key;
  }
  /**
   * If the effect has been compiled and prepared.
   * @returns if the effect is compiled and prepared.
   */
  isReady() {
    try {
      return this._isReadyInternal();
    } catch {
      return false;
    }
  }
  _isReadyInternal() {
    if (this._isReady) {
      return true;
    }
    if (this._pipelineContext) {
      return this._pipelineContext.isReady;
    }
    return false;
  }
  /**
   * The engine the effect was initialized with.
   * @returns the engine.
   */
  getEngine() {
    return this._engine;
  }
  /**
   * The pipeline context for this effect
   * @returns the associated pipeline context
   */
  getPipelineContext() {
    return this._pipelineContext;
  }
  /**
   * The set of names of attribute variables for the shader.
   * @returns An array of attribute names.
   */
  getAttributesNames() {
    return this._attributesNames;
  }
  /**
   * Returns the attribute at the given index.
   * @param index The index of the attribute.
   * @returns The location of the attribute.
   */
  getAttributeLocation(index) {
    return this._attributes[index];
  }
  /**
   * Returns the attribute based on the name of the variable.
   * @param name of the attribute to look up.
   * @returns the attribute location.
   */
  getAttributeLocationByName(name2) {
    return this._attributeLocationByName[name2];
  }
  /**
   * The number of attributes.
   * @returns the number of attributes.
   */
  getAttributesCount() {
    return this._attributes.length;
  }
  /**
   * Gets the index of a uniform variable.
   * @param uniformName of the uniform to look up.
   * @returns the index.
   */
  getUniformIndex(uniformName) {
    return this._uniformsNames.indexOf(uniformName);
  }
  /**
   * Returns the attribute based on the name of the variable.
   * @param uniformName of the uniform to look up.
   * @returns the location of the uniform.
   */
  getUniform(uniformName) {
    return this._uniforms[uniformName];
  }
  /**
   * Returns an array of sampler variable names
   * @returns The array of sampler variable names.
   */
  getSamplers() {
    return this._samplerList;
  }
  /**
   * Returns an array of uniform variable names
   * @returns The array of uniform variable names.
   */
  getUniformNames() {
    return this._uniformsNames;
  }
  /**
   * Returns an array of uniform buffer variable names
   * @returns The array of uniform buffer variable names.
   */
  getUniformBuffersNames() {
    return this._uniformBuffersNamesList;
  }
  /**
   * Returns the index parameters used to create the effect
   * @returns The index parameters object
   */
  getIndexParameters() {
    return this._indexParameters;
  }
  /**
   * The error from the last compilation.
   * @returns the error string.
   */
  getCompilationError() {
    return this._compilationError;
  }
  /**
   * Gets a boolean indicating that all fallbacks were used during compilation
   * @returns true if all fallbacks were used
   */
  allFallbacksProcessed() {
    return this._allFallbacksProcessed;
  }
  /**
   * Adds a callback to the onCompiled observable and call the callback immediately if already ready.
   * @param func The callback to be used.
   */
  executeWhenCompiled(func) {
    if (this.isReady()) {
      func(this);
      return;
    }
    this.onCompileObservable.add((effect) => {
      func(effect);
    });
    if (!this._pipelineContext || this._pipelineContext.isAsync) {
      setTimeout(() => {
        this._checkIsReady(null);
      }, 16);
    }
  }
  _checkIsReady(previousPipelineContext) {
    try {
      if (this._isReadyInternal()) {
        return;
      }
    } catch (e) {
      this._processCompilationErrors(e, previousPipelineContext);
      return;
    }
    if (this._isDisposed) {
      return;
    }
    setTimeout(() => {
      this._checkIsReady(previousPipelineContext);
    }, 16);
  }
  /**
   * Gets the vertex shader source code of this effect
   * This is the final source code that will be compiled, after all the processing has been done (pre-processing applied, code injection/replacement, etc)
   */
  get vertexSourceCode() {
    return this._vertexSourceCodeOverride && this._fragmentSourceCodeOverride ? this._vertexSourceCodeOverride : this._pipelineContext?._getVertexShaderCode() ?? this._vertexSourceCode;
  }
  /**
   * Gets the fragment shader source code of this effect
   * This is the final source code that will be compiled, after all the processing has been done (pre-processing applied, code injection/replacement, etc)
   */
  get fragmentSourceCode() {
    return this._vertexSourceCodeOverride && this._fragmentSourceCodeOverride ? this._fragmentSourceCodeOverride : this._pipelineContext?._getFragmentShaderCode() ?? this._fragmentSourceCode;
  }
  /**
   * Gets the vertex shader source code before migration.
   * This is the source code after the include directives have been replaced by their contents but before the code is migrated, i.e. before ShaderProcess._ProcessShaderConversion is executed.
   * This method is, among other things, responsible for parsing #if/#define directives as well as converting GLES2 syntax to GLES3 (in the case of WebGL).
   */
  get vertexSourceCodeBeforeMigration() {
    return this._vertexSourceCodeBeforeMigration;
  }
  /**
   * Gets the fragment shader source code before migration.
   * This is the source code after the include directives have been replaced by their contents but before the code is migrated, i.e. before ShaderProcess._ProcessShaderConversion is executed.
   * This method is, among other things, responsible for parsing #if/#define directives as well as converting GLES2 syntax to GLES3 (in the case of WebGL).
   */
  get fragmentSourceCodeBeforeMigration() {
    return this._fragmentSourceCodeBeforeMigration;
  }
  /**
   * Gets the vertex shader source code before it has been modified by any processing
   */
  get rawVertexSourceCode() {
    return this._rawVertexSourceCode;
  }
  /**
   * Gets the fragment shader source code before it has been modified by any processing
   */
  get rawFragmentSourceCode() {
    return this._rawFragmentSourceCode;
  }
  getPipelineGenerationOptions() {
    return {
      platformName: this._engine.shaderPlatformName,
      shaderLanguage: this._shaderLanguage,
      shaderNameOrContent: this.name,
      key: this._key,
      defines: this.defines.split("\n"),
      addGlobalDefines: false,
      extendedProcessingOptions: {
        indexParameters: this._indexParameters,
        isNDCHalfZRange: this._engine.isNDCHalfZRange,
        useReverseDepthBuffer: this._engine.useReverseDepthBuffer,
        supportsUniformBuffers: this._engine.supportsUniformBuffers
      },
      extendedCreatePipelineOptions: {
        transformFeedbackVaryings: this._transformFeedbackVaryings,
        createAsRaw: !!(this._vertexSourceCodeOverride && this._fragmentSourceCodeOverride)
      }
    };
  }
  /**
   * Recompiles the webGL program
   * @param vertexSourceCode The source code for the vertex shader.
   * @param fragmentSourceCode The source code for the fragment shader.
   * @param onCompiled Callback called when completed.
   * @param onError Callback called on error.
   * @internal
   */
  _rebuildProgram(vertexSourceCode, fragmentSourceCode, onCompiled, onError) {
    this._isReady = false;
    this._vertexSourceCodeOverride = vertexSourceCode;
    this._fragmentSourceCodeOverride = fragmentSourceCode;
    this.onError = (effect, error) => {
      if (onError) {
        onError(error);
      }
    };
    this.onCompiled = () => {
      const scenes = this.getEngine().scenes;
      if (scenes) {
        for (let i = 0; i < scenes.length; i++) {
          scenes[i].markAllMaterialsAsDirty(63);
        }
      }
      this._pipelineContext._handlesSpectorRebuildCallback?.(onCompiled);
    };
    this._fallbacks = null;
    this._prepareEffect();
  }
  _onRenderingStateCompiled(pipelineContext) {
    this._pipelineContext = pipelineContext;
    this._pipelineContext.setEngine(this._engine);
    this._attributes = [];
    this._pipelineContext._fillEffectInformation(this, this._uniformBuffersNames, this._uniformsNames, this._uniforms, this._samplerList, this._samplers, this._attributesNames, this._attributes);
    if (this._attributesNames) {
      for (let i = 0; i < this._attributesNames.length; i++) {
        const name2 = this._attributesNames[i];
        this._attributeLocationByName[name2] = this._attributes[i];
      }
    }
    this._engine.bindSamplers(this);
    this._compilationError = "";
    this._isReady = true;
    if (this.onCompiled) {
      this.onCompiled(this);
    }
    this.onCompileObservable.notifyObservers(this);
    this.onCompileObservable.clear();
    if (this._fallbacks) {
      this._fallbacks.unBindMesh();
    }
  }
  /**
   * Prepares the effect
   * @internal
   */
  _prepareEffect(keepExistingPipelineContext = false) {
    const previousPipelineContext = this._pipelineContext;
    this._isReady = false;
    try {
      const overrides = !!(this._vertexSourceCodeOverride && this._fragmentSourceCodeOverride);
      const defines = overrides ? null : this.defines;
      const vertex = overrides ? this._vertexSourceCodeOverride : this._vertexSourceCode;
      const fragment = overrides ? this._fragmentSourceCodeOverride : this._fragmentSourceCode;
      const engine = this._engine;
      this._pipelineContext = createAndPreparePipelineContext({
        existingPipelineContext: keepExistingPipelineContext ? previousPipelineContext : null,
        vertex,
        fragment,
        context: engine.shaderPlatformName === "WEBGL2" ? engine._gl : void 0,
        rebuildRebind: (vertexSourceCode, fragmentSourceCode, onCompiled, onError) => this._rebuildProgram(vertexSourceCode, fragmentSourceCode, onCompiled, onError),
        defines,
        transformFeedbackVaryings: this._transformFeedbackVaryings,
        name: this._key.replace(/\r/g, "").replace(/\n/g, "|"),
        createAsRaw: overrides,
        parallelShaderCompile: engine._caps.parallelShaderCompile,
        shaderProcessingContext: this._processingContext,
        onRenderingStateCompiled: (pipelineContext) => {
          if (previousPipelineContext && !keepExistingPipelineContext) {
            this._engine._deletePipelineContext(previousPipelineContext);
          }
          if (pipelineContext) {
            this._onRenderingStateCompiled(pipelineContext);
          }
        }
      }, this._engine.createPipelineContext.bind(this._engine), this._engine._preparePipelineContext.bind(this._engine), this._engine._executeWhenRenderingStateIsCompiled.bind(this._engine));
      if (this._pipelineContext.isAsync) {
        this._checkIsReady(previousPipelineContext);
      }
    } catch (e) {
      this._processCompilationErrors(e, previousPipelineContext);
    }
  }
  _getShaderCodeAndErrorLine(code, error, isFragment) {
    const regexp = isFragment ? /FRAGMENT SHADER ERROR: 0:(\d+?):/ : /VERTEX SHADER ERROR: 0:(\d+?):/;
    let errorLine = null;
    if (error && code) {
      const res = error.match(regexp);
      if (res && res.length === 2) {
        const lineNumber = parseInt(res[1]);
        const lines = code.split("\n", -1);
        if (lines.length >= lineNumber) {
          errorLine = `Offending line [${lineNumber}] in ${isFragment ? "fragment" : "vertex"} code: ${lines[lineNumber - 1]}`;
        }
      }
    }
    return [code, errorLine];
  }
  _processCompilationErrors(e, previousPipelineContext = null) {
    this._compilationError = e.message;
    const attributesNames = this._attributesNames;
    const fallbacks = this._fallbacks;
    Logger.Error("Unable to compile effect:");
    Logger.Error("Uniforms: " + this._uniformsNames.map(function(uniform) {
      return " " + uniform;
    }));
    Logger.Error("Attributes: " + attributesNames.map(function(attribute) {
      return " " + attribute;
    }));
    Logger.Error("Defines:\n" + this.defines);
    if (_Effect.LogShaderCodeOnCompilationError) {
      let lineErrorVertex = null, lineErrorFragment = null, code = null;
      if (this._pipelineContext?._getVertexShaderCode()) {
        [code, lineErrorVertex] = this._getShaderCodeAndErrorLine(this._pipelineContext._getVertexShaderCode(), this._compilationError, false);
        if (code) {
          Logger.Error("Vertex code:");
          Logger.Error(code);
        }
      }
      if (this._pipelineContext?._getFragmentShaderCode()) {
        [code, lineErrorFragment] = this._getShaderCodeAndErrorLine(this._pipelineContext?._getFragmentShaderCode(), this._compilationError, true);
        if (code) {
          Logger.Error("Fragment code:");
          Logger.Error(code);
        }
      }
      if (lineErrorVertex) {
        Logger.Error(lineErrorVertex);
      }
      if (lineErrorFragment) {
        Logger.Error(lineErrorFragment);
      }
    }
    Logger.Error("Error: " + this._compilationError);
    const notifyErrors = () => {
      if (this.onError) {
        this.onError(this, this._compilationError);
      }
      this.onErrorObservable.notifyObservers(this);
    };
    if (previousPipelineContext) {
      this._pipelineContext = previousPipelineContext;
      this._isReady = true;
      notifyErrors();
    }
    if (fallbacks) {
      this._pipelineContext = null;
      if (fallbacks.hasMoreFallbacks) {
        this._allFallbacksProcessed = false;
        Logger.Error("Trying next fallback.");
        this.defines = fallbacks.reduce(this.defines, this);
        this._prepareEffect();
      } else {
        this._allFallbacksProcessed = true;
        notifyErrors();
        this.onErrorObservable.clear();
        if (this._fallbacks) {
          this._fallbacks.unBindMesh();
        }
      }
    } else {
      this._allFallbacksProcessed = true;
      if (!previousPipelineContext) {
        notifyErrors();
      }
    }
  }
  /**
   * Checks if the effect is supported. (Must be called after compilation)
   */
  get isSupported() {
    return this._compilationError === "";
  }
  /**
   * Binds a texture to the engine to be used as output of the shader.
   * @param channel Name of the output variable.
   * @param texture Texture to bind.
   * @internal
   */
  _bindTexture(channel, texture) {
    this._engine._bindTexture(this._samplers[channel], texture, channel);
  }
  /**
   * Sets a texture on the engine to be used in the shader.
   * @param channel Name of the sampler variable.
   * @param texture Texture to set.
   */
  setTexture(channel, texture) {
    this._engine.setTexture(this._samplers[channel], this._uniforms[channel], texture, channel);
  }
  /**
   * Sets an array of textures on the engine to be used in the shader.
   * @param channel Name of the variable.
   * @param textures Textures to set.
   */
  setTextureArray(channel, textures) {
    const exName = channel + "Ex";
    if (this._samplerList.indexOf(exName + "0") === -1) {
      const initialPos = this._samplerList.indexOf(channel);
      for (let index = 1; index < textures.length; index++) {
        const currentExName = exName + (index - 1).toString();
        this._samplerList.splice(initialPos + index, 0, currentExName);
      }
      let channelIndex = 0;
      for (const key of this._samplerList) {
        this._samplers[key] = channelIndex;
        channelIndex += 1;
      }
    }
    this._engine.setTextureArray(this._samplers[channel], this._uniforms[channel], textures, channel);
  }
  /**
   * Binds a buffer to a uniform.
   * @param buffer Buffer to bind.
   * @param name Name of the uniform variable to bind to.
   */
  bindUniformBuffer(buffer, name2) {
    const bufferName = this._uniformBuffersNames[name2];
    if (bufferName === void 0 || _Effect._BaseCache[bufferName] === buffer && this._engine._features.useUBOBindingCache) {
      return;
    }
    _Effect._BaseCache[bufferName] = buffer;
    this._engine.bindUniformBufferBase(buffer, bufferName, name2);
  }
  /**
   * Binds block to a uniform.
   * @param blockName Name of the block to bind.
   * @param index Index to bind.
   */
  bindUniformBlock(blockName, index) {
    this._engine.bindUniformBlock(this._pipelineContext, blockName, index);
  }
  /**
   * Sets an integer value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param value Value to be set.
   * @returns this effect.
   */
  setInt(uniformName, value) {
    this._pipelineContext.setInt(uniformName, value);
    return this;
  }
  /**
   * Sets an int2 value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First int in int2.
   * @param y Second int in int2.
   * @returns this effect.
   */
  setInt2(uniformName, x, y) {
    this._pipelineContext.setInt2(uniformName, x, y);
    return this;
  }
  /**
   * Sets an int3 value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First int in int3.
   * @param y Second int in int3.
   * @param z Third int in int3.
   * @returns this effect.
   */
  setInt3(uniformName, x, y, z) {
    this._pipelineContext.setInt3(uniformName, x, y, z);
    return this;
  }
  /**
   * Sets an int4 value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First int in int4.
   * @param y Second int in int4.
   * @param z Third int in int4.
   * @param w Fourth int in int4.
   * @returns this effect.
   */
  setInt4(uniformName, x, y, z, w) {
    this._pipelineContext.setInt4(uniformName, x, y, z, w);
    return this;
  }
  /**
   * Sets an int array on a uniform variable.
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setIntArray(uniformName, array) {
    this._pipelineContext.setIntArray(uniformName, array);
    return this;
  }
  /**
   * Sets an int array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setIntArray2(uniformName, array) {
    this._pipelineContext.setIntArray2(uniformName, array);
    return this;
  }
  /**
   * Sets an int array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setIntArray3(uniformName, array) {
    this._pipelineContext.setIntArray3(uniformName, array);
    return this;
  }
  /**
   * Sets an int array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setIntArray4(uniformName, array) {
    this._pipelineContext.setIntArray4(uniformName, array);
    return this;
  }
  /**
   * Sets an unsigned integer value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param value Value to be set.
   * @returns this effect.
   */
  setUInt(uniformName, value) {
    this._pipelineContext.setUInt(uniformName, value);
    return this;
  }
  /**
   * Sets an unsigned int2 value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First unsigned int in uint2.
   * @param y Second unsigned int in uint2.
   * @returns this effect.
   */
  setUInt2(uniformName, x, y) {
    this._pipelineContext.setUInt2(uniformName, x, y);
    return this;
  }
  /**
   * Sets an unsigned int3 value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First unsigned int in uint3.
   * @param y Second unsigned int in uint3.
   * @param z Third unsigned int in uint3.
   * @returns this effect.
   */
  setUInt3(uniformName, x, y, z) {
    this._pipelineContext.setUInt3(uniformName, x, y, z);
    return this;
  }
  /**
   * Sets an unsigned int4 value on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First unsigned int in uint4.
   * @param y Second unsigned int in uint4.
   * @param z Third unsigned int in uint4.
   * @param w Fourth unsigned int in uint4.
   * @returns this effect.
   */
  setUInt4(uniformName, x, y, z, w) {
    this._pipelineContext.setUInt4(uniformName, x, y, z, w);
    return this;
  }
  /**
   * Sets an unsigned int array on a uniform variable.
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setUIntArray(uniformName, array) {
    this._pipelineContext.setUIntArray(uniformName, array);
    return this;
  }
  /**
   * Sets an unsigned int array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setUIntArray2(uniformName, array) {
    this._pipelineContext.setUIntArray2(uniformName, array);
    return this;
  }
  /**
   * Sets an unsigned int array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setUIntArray3(uniformName, array) {
    this._pipelineContext.setUIntArray3(uniformName, array);
    return this;
  }
  /**
   * Sets an unsigned int array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setUIntArray4(uniformName, array) {
    this._pipelineContext.setUIntArray4(uniformName, array);
    return this;
  }
  /**
   * Sets an float array on a uniform variable.
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setFloatArray(uniformName, array) {
    this._pipelineContext.setArray(uniformName, array);
    return this;
  }
  /**
   * Sets an float array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setFloatArray2(uniformName, array) {
    this._pipelineContext.setArray2(uniformName, array);
    return this;
  }
  /**
   * Sets an float array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setFloatArray3(uniformName, array) {
    this._pipelineContext.setArray3(uniformName, array);
    return this;
  }
  /**
   * Sets an float array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setFloatArray4(uniformName, array) {
    this._pipelineContext.setArray4(uniformName, array);
    return this;
  }
  /**
   * Sets an array on a uniform variable.
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setArray(uniformName, array) {
    this._pipelineContext.setArray(uniformName, array);
    return this;
  }
  /**
   * Sets an array 2 on a uniform variable. (Array is specified as single array eg. [1,2,3,4] will result in [[1,2],[3,4]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setArray2(uniformName, array) {
    this._pipelineContext.setArray2(uniformName, array);
    return this;
  }
  /**
   * Sets an array 3 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6] will result in [[1,2,3],[4,5,6]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setArray3(uniformName, array) {
    this._pipelineContext.setArray3(uniformName, array);
    return this;
  }
  /**
   * Sets an array 4 on a uniform variable. (Array is specified as single array eg. [1,2,3,4,5,6,7,8] will result in [[1,2,3,4],[5,6,7,8]] in the shader)
   * @param uniformName Name of the variable.
   * @param array array to be set.
   * @returns this effect.
   */
  setArray4(uniformName, array) {
    this._pipelineContext.setArray4(uniformName, array);
    return this;
  }
  /**
   * Sets matrices on a uniform variable.
   * @param uniformName Name of the variable.
   * @param matrices matrices to be set.
   * @returns this effect.
   */
  setMatrices(uniformName, matrices) {
    this._pipelineContext.setMatrices(uniformName, matrices);
    return this;
  }
  /**
   * Sets matrix on a uniform variable.
   * @param uniformName Name of the variable.
   * @param matrix matrix to be set.
   * @returns this effect.
   */
  setMatrix(uniformName, matrix) {
    this._pipelineContext.setMatrix(uniformName, matrix);
    return this;
  }
  /**
   * Sets a 3x3 matrix on a uniform variable. (Specified as [1,2,3,4,5,6,7,8,9] will result in [1,2,3][4,5,6][7,8,9] matrix)
   * @param uniformName Name of the variable.
   * @param matrix matrix to be set.
   * @returns this effect.
   */
  setMatrix3x3(uniformName, matrix) {
    this._pipelineContext.setMatrix3x3(uniformName, matrix);
    return this;
  }
  /**
   * Sets a 2x2 matrix on a uniform variable. (Specified as [1,2,3,4] will result in [1,2][3,4] matrix)
   * @param uniformName Name of the variable.
   * @param matrix matrix to be set.
   * @returns this effect.
   */
  setMatrix2x2(uniformName, matrix) {
    this._pipelineContext.setMatrix2x2(uniformName, matrix);
    return this;
  }
  /**
   * Sets a float on a uniform variable.
   * @param uniformName Name of the variable.
   * @param value value to be set.
   * @returns this effect.
   */
  setFloat(uniformName, value) {
    this._pipelineContext.setFloat(uniformName, value);
    return this;
  }
  /**
   * Sets a boolean on a uniform variable.
   * @param uniformName Name of the variable.
   * @param bool value to be set.
   * @returns this effect.
   */
  setBool(uniformName, bool) {
    this._pipelineContext.setInt(uniformName, bool ? 1 : 0);
    return this;
  }
  /**
   * Sets a Vector2 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param vector2 vector2 to be set.
   * @returns this effect.
   */
  setVector2(uniformName, vector2) {
    this._pipelineContext.setVector2(uniformName, vector2);
    return this;
  }
  /**
   * Sets a float2 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First float in float2.
   * @param y Second float in float2.
   * @returns this effect.
   */
  setFloat2(uniformName, x, y) {
    this._pipelineContext.setFloat2(uniformName, x, y);
    return this;
  }
  /**
   * Sets a Vector3 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param vector3 Value to be set.
   * @returns this effect.
   */
  setVector3(uniformName, vector3) {
    this._pipelineContext.setVector3(uniformName, vector3);
    return this;
  }
  /**
   * Sets a float3 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First float in float3.
   * @param y Second float in float3.
   * @param z Third float in float3.
   * @returns this effect.
   */
  setFloat3(uniformName, x, y, z) {
    this._pipelineContext.setFloat3(uniformName, x, y, z);
    return this;
  }
  /**
   * Sets a Vector4 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param vector4 Value to be set.
   * @returns this effect.
   */
  setVector4(uniformName, vector4) {
    this._pipelineContext.setVector4(uniformName, vector4);
    return this;
  }
  /**
   * Sets a Quaternion on a uniform variable.
   * @param uniformName Name of the variable.
   * @param quaternion Value to be set.
   * @returns this effect.
   */
  setQuaternion(uniformName, quaternion) {
    this._pipelineContext.setQuaternion(uniformName, quaternion);
    return this;
  }
  /**
   * Sets a float4 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param x First float in float4.
   * @param y Second float in float4.
   * @param z Third float in float4.
   * @param w Fourth float in float4.
   * @returns this effect.
   */
  setFloat4(uniformName, x, y, z, w) {
    this._pipelineContext.setFloat4(uniformName, x, y, z, w);
    return this;
  }
  /**
   * Sets a Color3 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param color3 Value to be set.
   * @returns this effect.
   */
  setColor3(uniformName, color3) {
    this._pipelineContext.setColor3(uniformName, color3);
    return this;
  }
  /**
   * Sets a Color4 on a uniform variable.
   * @param uniformName Name of the variable.
   * @param color3 Value to be set.
   * @param alpha Alpha value to be set.
   * @returns this effect.
   */
  setColor4(uniformName, color3, alpha) {
    this._pipelineContext.setColor4(uniformName, color3, alpha);
    return this;
  }
  /**
   * Sets a Color4 on a uniform variable
   * @param uniformName defines the name of the variable
   * @param color4 defines the value to be set
   * @returns this effect.
   */
  setDirectColor4(uniformName, color4) {
    this._pipelineContext.setDirectColor4(uniformName, color4);
    return this;
  }
  /**
   * Release all associated resources.
   **/
  dispose() {
    if (this._pipelineContext) {
      resetCachedPipeline(this._pipelineContext);
    }
    this._engine._releaseEffect(this);
    this._isDisposed = true;
  }
  /**
   * This function will add a new shader to the shader store
   * @param name the name of the shader
   * @param pixelShader optional pixel shader content
   * @param vertexShader optional vertex shader content
   * @param shaderLanguage the language the shader is written in (default: GLSL)
   */
  static RegisterShader(name2, pixelShader, vertexShader, shaderLanguage = 0) {
    if (pixelShader) {
      ShaderStore.GetShadersStore(shaderLanguage)[`${name2}PixelShader`] = pixelShader;
    }
    if (vertexShader) {
      ShaderStore.GetShadersStore(shaderLanguage)[`${name2}VertexShader`] = vertexShader;
    }
  }
  /**
   * Resets the cache of effects.
   */
  static ResetCache() {
    _Effect._BaseCache = {};
  }
};
Effect.LogShaderCodeOnCompilationError = true;
Effect._UniqueIdSeed = 0;
Effect._BaseCache = {};
Effect.ShadersStore = ShaderStore.ShadersStore;
Effect.IncludesShadersStore = ShaderStore.IncludesShadersStore;

// node_modules/@babylonjs/core/Misc/precisionDate.js
var PrecisionDate = class {
  /**
   * Gets either window.performance.now() if supported or Date.now() else
   */
  static get Now() {
    if (IsWindowObjectExist() && window.performance && window.performance.now) {
      return window.performance.now();
    }
    return Date.now();
  }
};

// node_modules/@babylonjs/core/States/depthCullingState.js
var DepthCullingState = class {
  /**
   * Initializes the state.
   * @param reset
   */
  constructor(reset = true) {
    this._isDepthTestDirty = false;
    this._isDepthMaskDirty = false;
    this._isDepthFuncDirty = false;
    this._isCullFaceDirty = false;
    this._isCullDirty = false;
    this._isZOffsetDirty = false;
    this._isFrontFaceDirty = false;
    if (reset) {
      this.reset();
    }
  }
  get isDirty() {
    return this._isDepthFuncDirty || this._isDepthTestDirty || this._isDepthMaskDirty || this._isCullFaceDirty || this._isCullDirty || this._isZOffsetDirty || this._isFrontFaceDirty;
  }
  get zOffset() {
    return this._zOffset;
  }
  set zOffset(value) {
    if (this._zOffset === value) {
      return;
    }
    this._zOffset = value;
    this._isZOffsetDirty = true;
  }
  get zOffsetUnits() {
    return this._zOffsetUnits;
  }
  set zOffsetUnits(value) {
    if (this._zOffsetUnits === value) {
      return;
    }
    this._zOffsetUnits = value;
    this._isZOffsetDirty = true;
  }
  get cullFace() {
    return this._cullFace;
  }
  set cullFace(value) {
    if (this._cullFace === value) {
      return;
    }
    this._cullFace = value;
    this._isCullFaceDirty = true;
  }
  get cull() {
    return this._cull;
  }
  set cull(value) {
    if (this._cull === value) {
      return;
    }
    this._cull = value;
    this._isCullDirty = true;
  }
  get depthFunc() {
    return this._depthFunc;
  }
  set depthFunc(value) {
    if (this._depthFunc === value) {
      return;
    }
    this._depthFunc = value;
    this._isDepthFuncDirty = true;
  }
  get depthMask() {
    return this._depthMask;
  }
  set depthMask(value) {
    if (this._depthMask === value) {
      return;
    }
    this._depthMask = value;
    this._isDepthMaskDirty = true;
  }
  get depthTest() {
    return this._depthTest;
  }
  set depthTest(value) {
    if (this._depthTest === value) {
      return;
    }
    this._depthTest = value;
    this._isDepthTestDirty = true;
  }
  get frontFace() {
    return this._frontFace;
  }
  set frontFace(value) {
    if (this._frontFace === value) {
      return;
    }
    this._frontFace = value;
    this._isFrontFaceDirty = true;
  }
  reset() {
    this._depthMask = true;
    this._depthTest = true;
    this._depthFunc = null;
    this._cullFace = null;
    this._cull = null;
    this._zOffset = 0;
    this._zOffsetUnits = 0;
    this._frontFace = null;
    this._isDepthTestDirty = true;
    this._isDepthMaskDirty = true;
    this._isDepthFuncDirty = false;
    this._isCullFaceDirty = false;
    this._isCullDirty = false;
    this._isZOffsetDirty = true;
    this._isFrontFaceDirty = false;
  }
  apply(gl) {
    if (!this.isDirty) {
      return;
    }
    if (this._isCullDirty) {
      if (this.cull) {
        gl.enable(gl.CULL_FACE);
      } else {
        gl.disable(gl.CULL_FACE);
      }
      this._isCullDirty = false;
    }
    if (this._isCullFaceDirty) {
      gl.cullFace(this.cullFace);
      this._isCullFaceDirty = false;
    }
    if (this._isDepthMaskDirty) {
      gl.depthMask(this.depthMask);
      this._isDepthMaskDirty = false;
    }
    if (this._isDepthTestDirty) {
      if (this.depthTest) {
        gl.enable(gl.DEPTH_TEST);
      } else {
        gl.disable(gl.DEPTH_TEST);
      }
      this._isDepthTestDirty = false;
    }
    if (this._isDepthFuncDirty) {
      gl.depthFunc(this.depthFunc);
      this._isDepthFuncDirty = false;
    }
    if (this._isZOffsetDirty) {
      if (this.zOffset || this.zOffsetUnits) {
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(this.zOffset, this.zOffsetUnits);
      } else {
        gl.disable(gl.POLYGON_OFFSET_FILL);
      }
      this._isZOffsetDirty = false;
    }
    if (this._isFrontFaceDirty) {
      gl.frontFace(this.frontFace);
      this._isFrontFaceDirty = false;
    }
  }
};

// node_modules/@babylonjs/core/States/stencilStateComposer.js
var StencilStateComposer = class {
  get isDirty() {
    return this._isStencilTestDirty || this._isStencilMaskDirty || this._isStencilFuncDirty || this._isStencilOpDirty;
  }
  get func() {
    return this._func;
  }
  set func(value) {
    if (this._func === value) {
      return;
    }
    this._func = value;
    this._isStencilFuncDirty = true;
  }
  get funcRef() {
    return this._funcRef;
  }
  set funcRef(value) {
    if (this._funcRef === value) {
      return;
    }
    this._funcRef = value;
    this._isStencilFuncDirty = true;
  }
  get funcMask() {
    return this._funcMask;
  }
  set funcMask(value) {
    if (this._funcMask === value) {
      return;
    }
    this._funcMask = value;
    this._isStencilFuncDirty = true;
  }
  get opStencilFail() {
    return this._opStencilFail;
  }
  set opStencilFail(value) {
    if (this._opStencilFail === value) {
      return;
    }
    this._opStencilFail = value;
    this._isStencilOpDirty = true;
  }
  get opDepthFail() {
    return this._opDepthFail;
  }
  set opDepthFail(value) {
    if (this._opDepthFail === value) {
      return;
    }
    this._opDepthFail = value;
    this._isStencilOpDirty = true;
  }
  get opStencilDepthPass() {
    return this._opStencilDepthPass;
  }
  set opStencilDepthPass(value) {
    if (this._opStencilDepthPass === value) {
      return;
    }
    this._opStencilDepthPass = value;
    this._isStencilOpDirty = true;
  }
  get mask() {
    return this._mask;
  }
  set mask(value) {
    if (this._mask === value) {
      return;
    }
    this._mask = value;
    this._isStencilMaskDirty = true;
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    if (this._enabled === value) {
      return;
    }
    this._enabled = value;
    this._isStencilTestDirty = true;
  }
  constructor(reset = true) {
    this._isStencilTestDirty = false;
    this._isStencilMaskDirty = false;
    this._isStencilFuncDirty = false;
    this._isStencilOpDirty = false;
    this.useStencilGlobalOnly = false;
    if (reset) {
      this.reset();
    }
  }
  reset() {
    this.stencilMaterial = void 0;
    this.stencilGlobal?.reset();
    this._isStencilTestDirty = true;
    this._isStencilMaskDirty = true;
    this._isStencilFuncDirty = true;
    this._isStencilOpDirty = true;
  }
  apply(gl) {
    if (!gl) {
      return;
    }
    const stencilMaterialEnabled = !this.useStencilGlobalOnly && !!this.stencilMaterial?.enabled;
    this.enabled = stencilMaterialEnabled ? this.stencilMaterial.enabled : this.stencilGlobal.enabled;
    this.func = stencilMaterialEnabled ? this.stencilMaterial.func : this.stencilGlobal.func;
    this.funcRef = stencilMaterialEnabled ? this.stencilMaterial.funcRef : this.stencilGlobal.funcRef;
    this.funcMask = stencilMaterialEnabled ? this.stencilMaterial.funcMask : this.stencilGlobal.funcMask;
    this.opStencilFail = stencilMaterialEnabled ? this.stencilMaterial.opStencilFail : this.stencilGlobal.opStencilFail;
    this.opDepthFail = stencilMaterialEnabled ? this.stencilMaterial.opDepthFail : this.stencilGlobal.opDepthFail;
    this.opStencilDepthPass = stencilMaterialEnabled ? this.stencilMaterial.opStencilDepthPass : this.stencilGlobal.opStencilDepthPass;
    this.mask = stencilMaterialEnabled ? this.stencilMaterial.mask : this.stencilGlobal.mask;
    if (!this.isDirty) {
      return;
    }
    if (this._isStencilTestDirty) {
      if (this.enabled) {
        gl.enable(gl.STENCIL_TEST);
      } else {
        gl.disable(gl.STENCIL_TEST);
      }
      this._isStencilTestDirty = false;
    }
    if (this._isStencilMaskDirty) {
      gl.stencilMask(this.mask);
      this._isStencilMaskDirty = false;
    }
    if (this._isStencilFuncDirty) {
      gl.stencilFunc(this.func, this.funcRef, this.funcMask);
      this._isStencilFuncDirty = false;
    }
    if (this._isStencilOpDirty) {
      gl.stencilOp(this.opStencilFail, this.opDepthFail, this.opStencilDepthPass);
      this._isStencilOpDirty = false;
    }
  }
};

// node_modules/@babylonjs/core/States/stencilState.js
var StencilState = class _StencilState {
  constructor() {
    this.reset();
  }
  reset() {
    this.enabled = false;
    this.mask = 255;
    this.func = _StencilState.ALWAYS;
    this.funcRef = 1;
    this.funcMask = 255;
    this.opStencilFail = _StencilState.KEEP;
    this.opDepthFail = _StencilState.KEEP;
    this.opStencilDepthPass = _StencilState.REPLACE;
  }
  get stencilFunc() {
    return this.func;
  }
  set stencilFunc(value) {
    this.func = value;
  }
  get stencilFuncRef() {
    return this.funcRef;
  }
  set stencilFuncRef(value) {
    this.funcRef = value;
  }
  get stencilFuncMask() {
    return this.funcMask;
  }
  set stencilFuncMask(value) {
    this.funcMask = value;
  }
  get stencilOpStencilFail() {
    return this.opStencilFail;
  }
  set stencilOpStencilFail(value) {
    this.opStencilFail = value;
  }
  get stencilOpDepthFail() {
    return this.opDepthFail;
  }
  set stencilOpDepthFail(value) {
    this.opDepthFail = value;
  }
  get stencilOpStencilDepthPass() {
    return this.opStencilDepthPass;
  }
  set stencilOpStencilDepthPass(value) {
    this.opStencilDepthPass = value;
  }
  get stencilMask() {
    return this.mask;
  }
  set stencilMask(value) {
    this.mask = value;
  }
  get stencilTest() {
    return this.enabled;
  }
  set stencilTest(value) {
    this.enabled = value;
  }
};
StencilState.ALWAYS = 519;
StencilState.KEEP = 7680;
StencilState.REPLACE = 7681;

// node_modules/@babylonjs/core/States/alphaCullingState.js
var AlphaState = class {
  /**
   * Initializes the state.
   */
  constructor() {
    this._blendFunctionParameters = new Array(4);
    this._blendEquationParameters = new Array(2);
    this._blendConstants = new Array(4);
    this._isBlendConstantsDirty = false;
    this._alphaBlend = false;
    this._isAlphaBlendDirty = false;
    this._isBlendFunctionParametersDirty = false;
    this._isBlendEquationParametersDirty = false;
    this.reset();
  }
  get isDirty() {
    return this._isAlphaBlendDirty || this._isBlendFunctionParametersDirty || this._isBlendEquationParametersDirty;
  }
  get alphaBlend() {
    return this._alphaBlend;
  }
  set alphaBlend(value) {
    if (this._alphaBlend === value) {
      return;
    }
    this._alphaBlend = value;
    this._isAlphaBlendDirty = true;
  }
  setAlphaBlendConstants(r, g, b, a) {
    if (this._blendConstants[0] === r && this._blendConstants[1] === g && this._blendConstants[2] === b && this._blendConstants[3] === a) {
      return;
    }
    this._blendConstants[0] = r;
    this._blendConstants[1] = g;
    this._blendConstants[2] = b;
    this._blendConstants[3] = a;
    this._isBlendConstantsDirty = true;
  }
  setAlphaBlendFunctionParameters(value0, value1, value2, value3) {
    if (this._blendFunctionParameters[0] === value0 && this._blendFunctionParameters[1] === value1 && this._blendFunctionParameters[2] === value2 && this._blendFunctionParameters[3] === value3) {
      return;
    }
    this._blendFunctionParameters[0] = value0;
    this._blendFunctionParameters[1] = value1;
    this._blendFunctionParameters[2] = value2;
    this._blendFunctionParameters[3] = value3;
    this._isBlendFunctionParametersDirty = true;
  }
  setAlphaEquationParameters(rgb, alpha) {
    if (this._blendEquationParameters[0] === rgb && this._blendEquationParameters[1] === alpha) {
      return;
    }
    this._blendEquationParameters[0] = rgb;
    this._blendEquationParameters[1] = alpha;
    this._isBlendEquationParametersDirty = true;
  }
  reset() {
    this._alphaBlend = false;
    this._blendFunctionParameters[0] = null;
    this._blendFunctionParameters[1] = null;
    this._blendFunctionParameters[2] = null;
    this._blendFunctionParameters[3] = null;
    this._blendEquationParameters[0] = null;
    this._blendEquationParameters[1] = null;
    this._blendConstants[0] = null;
    this._blendConstants[1] = null;
    this._blendConstants[2] = null;
    this._blendConstants[3] = null;
    this._isAlphaBlendDirty = true;
    this._isBlendFunctionParametersDirty = false;
    this._isBlendEquationParametersDirty = false;
    this._isBlendConstantsDirty = false;
  }
  apply(gl) {
    if (!this.isDirty) {
      return;
    }
    if (this._isAlphaBlendDirty) {
      if (this._alphaBlend) {
        gl.enable(gl.BLEND);
      } else {
        gl.disable(gl.BLEND);
      }
      this._isAlphaBlendDirty = false;
    }
    if (this._isBlendFunctionParametersDirty) {
      gl.blendFuncSeparate(this._blendFunctionParameters[0], this._blendFunctionParameters[1], this._blendFunctionParameters[2], this._blendFunctionParameters[3]);
      this._isBlendFunctionParametersDirty = false;
    }
    if (this._isBlendEquationParametersDirty) {
      gl.blendEquationSeparate(this._blendEquationParameters[0], this._blendEquationParameters[1]);
      this._isBlendEquationParametersDirty = false;
    }
    if (this._isBlendConstantsDirty) {
      gl.blendColor(this._blendConstants[0], this._blendConstants[1], this._blendConstants[2], this._blendConstants[3]);
      this._isBlendConstantsDirty = false;
    }
  }
};

// node_modules/@babylonjs/core/Materials/Textures/textureSampler.js
var TextureSampler = class {
  /**
   * | Value | Type               | Description |
   * | ----- | ------------------ | ----------- |
   * | 0     | CLAMP_ADDRESSMODE  |             |
   * | 1     | WRAP_ADDRESSMODE   |             |
   * | 2     | MIRROR_ADDRESSMODE |             |
   */
  get wrapU() {
    return this._cachedWrapU;
  }
  set wrapU(value) {
    this._cachedWrapU = value;
  }
  /**
   * | Value | Type               | Description |
   * | ----- | ------------------ | ----------- |
   * | 0     | CLAMP_ADDRESSMODE  |             |
   * | 1     | WRAP_ADDRESSMODE   |             |
   * | 2     | MIRROR_ADDRESSMODE |             |
   */
  get wrapV() {
    return this._cachedWrapV;
  }
  set wrapV(value) {
    this._cachedWrapV = value;
  }
  /**
   * | Value | Type               | Description |
   * | ----- | ------------------ | ----------- |
   * | 0     | CLAMP_ADDRESSMODE  |             |
   * | 1     | WRAP_ADDRESSMODE   |             |
   * | 2     | MIRROR_ADDRESSMODE |             |
   */
  get wrapR() {
    return this._cachedWrapR;
  }
  set wrapR(value) {
    this._cachedWrapR = value;
  }
  /**
   * With compliant hardware and browser (supporting anisotropic filtering)
   * this defines the level of anisotropic filtering in the texture.
   * The higher the better but the slower.
   */
  get anisotropicFilteringLevel() {
    return this._cachedAnisotropicFilteringLevel;
  }
  set anisotropicFilteringLevel(value) {
    this._cachedAnisotropicFilteringLevel = value;
  }
  /**
   * Gets or sets the comparison function (513, 514, etc). Set 0 to not use a comparison function
   */
  get comparisonFunction() {
    return this._comparisonFunction;
  }
  set comparisonFunction(value) {
    this._comparisonFunction = value;
  }
  /**
   * Indicates to use the mip maps (if available on the texture).
   * Thanks to this flag, you can instruct the sampler to not sample the mipmaps even if they exist (and if the sampling mode is set to a value that normally samples the mipmaps!)
   */
  get useMipMaps() {
    return this._useMipMaps;
  }
  set useMipMaps(value) {
    this._useMipMaps = value;
  }
  /**
   * Creates a Sampler instance
   */
  constructor() {
    this.samplingMode = -1;
    this._useMipMaps = true;
    this._cachedWrapU = null;
    this._cachedWrapV = null;
    this._cachedWrapR = null;
    this._cachedAnisotropicFilteringLevel = null;
    this._comparisonFunction = 0;
  }
  /**
   * Sets all the parameters of the sampler
   * @param wrapU u address mode (default: TEXTURE_WRAP_ADDRESSMODE)
   * @param wrapV v address mode (default: TEXTURE_WRAP_ADDRESSMODE)
   * @param wrapR r address mode (default: TEXTURE_WRAP_ADDRESSMODE)
   * @param anisotropicFilteringLevel anisotropic level (default: 1)
   * @param samplingMode sampling mode (default: 2)
   * @param comparisonFunction comparison function (default: 0 - no comparison function)
   * @returns the current sampler instance
   */
  setParameters(wrapU = 1, wrapV = 1, wrapR = 1, anisotropicFilteringLevel = 1, samplingMode = 2, comparisonFunction = 0) {
    this._cachedWrapU = wrapU;
    this._cachedWrapV = wrapV;
    this._cachedWrapR = wrapR;
    this._cachedAnisotropicFilteringLevel = anisotropicFilteringLevel;
    this.samplingMode = samplingMode;
    this._comparisonFunction = comparisonFunction;
    return this;
  }
  /**
   * Compares this sampler with another one
   * @param other sampler to compare with
   * @returns true if the samplers have the same parametres, else false
   */
  compareSampler(other) {
    return this._cachedWrapU === other._cachedWrapU && this._cachedWrapV === other._cachedWrapV && this._cachedWrapR === other._cachedWrapR && this._cachedAnisotropicFilteringLevel === other._cachedAnisotropicFilteringLevel && this.samplingMode === other.samplingMode && this._comparisonFunction === other._comparisonFunction && this._useMipMaps === other._useMipMaps;
  }
};

// node_modules/@babylonjs/core/Materials/Textures/internalTexture.js
var InternalTextureSource;
(function(InternalTextureSource2) {
  InternalTextureSource2[InternalTextureSource2["Unknown"] = 0] = "Unknown";
  InternalTextureSource2[InternalTextureSource2["Url"] = 1] = "Url";
  InternalTextureSource2[InternalTextureSource2["Temp"] = 2] = "Temp";
  InternalTextureSource2[InternalTextureSource2["Raw"] = 3] = "Raw";
  InternalTextureSource2[InternalTextureSource2["Dynamic"] = 4] = "Dynamic";
  InternalTextureSource2[InternalTextureSource2["RenderTarget"] = 5] = "RenderTarget";
  InternalTextureSource2[InternalTextureSource2["MultiRenderTarget"] = 6] = "MultiRenderTarget";
  InternalTextureSource2[InternalTextureSource2["Cube"] = 7] = "Cube";
  InternalTextureSource2[InternalTextureSource2["CubeRaw"] = 8] = "CubeRaw";
  InternalTextureSource2[InternalTextureSource2["CubePrefiltered"] = 9] = "CubePrefiltered";
  InternalTextureSource2[InternalTextureSource2["Raw3D"] = 10] = "Raw3D";
  InternalTextureSource2[InternalTextureSource2["Raw2DArray"] = 11] = "Raw2DArray";
  InternalTextureSource2[InternalTextureSource2["DepthStencil"] = 12] = "DepthStencil";
  InternalTextureSource2[InternalTextureSource2["CubeRawRGBD"] = 13] = "CubeRawRGBD";
  InternalTextureSource2[InternalTextureSource2["Depth"] = 14] = "Depth";
})(InternalTextureSource || (InternalTextureSource = {}));
var InternalTexture = class _InternalTexture extends TextureSampler {
  /**
   * Gets a boolean indicating if the texture uses mipmaps
   * TODO implements useMipMaps as a separate setting from generateMipMaps
   */
  get useMipMaps() {
    return this.generateMipMaps;
  }
  set useMipMaps(value) {
    this.generateMipMaps = value;
  }
  /** Gets the unique id of the internal texture */
  get uniqueId() {
    return this._uniqueId;
  }
  /** @internal */
  _setUniqueId(id) {
    this._uniqueId = id;
  }
  /**
   * Gets the Engine the texture belongs to.
   * @returns The babylon engine
   */
  getEngine() {
    return this._engine;
  }
  /**
   * Gets the data source type of the texture
   */
  get source() {
    return this._source;
  }
  /**
   * Creates a new InternalTexture
   * @param engine defines the engine to use
   * @param source defines the type of data that will be used
   * @param delayAllocation if the texture allocation should be delayed (default: false)
   */
  constructor(engine, source, delayAllocation = false) {
    super();
    this.isReady = false;
    this.isCube = false;
    this.is3D = false;
    this.is2DArray = false;
    this.isMultiview = false;
    this.url = "";
    this.generateMipMaps = false;
    this.samples = 0;
    this.type = -1;
    this.format = -1;
    this.onLoadedObservable = new Observable();
    this.onErrorObservable = new Observable();
    this.onRebuildCallback = null;
    this.width = 0;
    this.height = 0;
    this.depth = 0;
    this.baseWidth = 0;
    this.baseHeight = 0;
    this.baseDepth = 0;
    this.invertY = false;
    this._invertVScale = false;
    this._associatedChannel = -1;
    this._source = 0;
    this._buffer = null;
    this._bufferView = null;
    this._bufferViewArray = null;
    this._bufferViewArrayArray = null;
    this._size = 0;
    this._extension = "";
    this._files = null;
    this._workingCanvas = null;
    this._workingContext = null;
    this._cachedCoordinatesMode = null;
    this._isDisabled = false;
    this._compression = null;
    this._sphericalPolynomial = null;
    this._sphericalPolynomialPromise = null;
    this._sphericalPolynomialComputed = false;
    this._lodGenerationScale = 0;
    this._lodGenerationOffset = 0;
    this._useSRGBBuffer = false;
    this._creationFlags = 0;
    this._lodTextureHigh = null;
    this._lodTextureMid = null;
    this._lodTextureLow = null;
    this._isRGBD = false;
    this._linearSpecularLOD = false;
    this._irradianceTexture = null;
    this._hardwareTexture = null;
    this._maxLodLevel = null;
    this._references = 1;
    this._gammaSpace = null;
    this._premulAlpha = false;
    this._dynamicTextureSource = null;
    this._engine = engine;
    this._source = source;
    this._uniqueId = _InternalTexture._Counter++;
    if (!delayAllocation) {
      this._hardwareTexture = engine._createHardwareTexture();
    }
  }
  /**
   * Increments the number of references (ie. the number of Texture that point to it)
   */
  incrementReferences() {
    this._references++;
  }
  /**
   * Change the size of the texture (not the size of the content)
   * @param width defines the new width
   * @param height defines the new height
   * @param depth defines the new depth (1 by default)
   */
  updateSize(width, height, depth = 1) {
    this._engine.updateTextureDimensions(this, width, height, depth);
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.baseWidth = width;
    this.baseHeight = height;
    this.baseDepth = depth;
    this._size = width * height * depth;
  }
  /** @internal */
  _rebuild() {
    this.isReady = false;
    this._cachedCoordinatesMode = null;
    this._cachedWrapU = null;
    this._cachedWrapV = null;
    this._cachedWrapR = null;
    this._cachedAnisotropicFilteringLevel = null;
    if (this.onRebuildCallback) {
      const data = this.onRebuildCallback(this);
      const swapAndSetIsReady = (proxyInternalTexture) => {
        proxyInternalTexture._swapAndDie(this, false);
        this.isReady = data.isReady;
      };
      if (data.isAsync) {
        data.proxy.then(swapAndSetIsReady);
      } else {
        swapAndSetIsReady(data.proxy);
      }
      return;
    }
    let proxy;
    switch (this.source) {
      case 2:
        break;
      case 1:
        proxy = this._engine.createTexture(
          this._originalUrl ?? this.url,
          !this.generateMipMaps,
          this.invertY,
          null,
          this.samplingMode,
          // Do not use Proxy here as it could be fully synchronous
          // and proxy would be undefined.
          (temp) => {
            temp._swapAndDie(this, false);
            this.isReady = true;
          },
          null,
          this._buffer,
          void 0,
          this.format,
          this._extension,
          void 0,
          void 0,
          void 0,
          this._useSRGBBuffer
        );
        return;
      case 3:
        proxy = this._engine.createRawTexture(this._bufferView, this.baseWidth, this.baseHeight, this.format, this.generateMipMaps, this.invertY, this.samplingMode, this._compression, this.type, this._creationFlags, this._useSRGBBuffer);
        proxy._swapAndDie(this, false);
        this.isReady = true;
        break;
      case 10:
        proxy = this._engine.createRawTexture3D(this._bufferView, this.baseWidth, this.baseHeight, this.baseDepth, this.format, this.generateMipMaps, this.invertY, this.samplingMode, this._compression, this.type);
        proxy._swapAndDie(this, false);
        this.isReady = true;
        break;
      case 11:
        proxy = this._engine.createRawTexture2DArray(this._bufferView, this.baseWidth, this.baseHeight, this.baseDepth, this.format, this.generateMipMaps, this.invertY, this.samplingMode, this._compression, this.type);
        proxy._swapAndDie(this, false);
        this.isReady = true;
        break;
      case 4:
        proxy = this._engine.createDynamicTexture(this.baseWidth, this.baseHeight, this.generateMipMaps, this.samplingMode);
        proxy._swapAndDie(this, false);
        if (this._dynamicTextureSource) {
          this._engine.updateDynamicTexture(this, this._dynamicTextureSource, this.invertY, this._premulAlpha, this.format, true);
        }
        break;
      case 7:
        proxy = this._engine.createCubeTexture(this.url, null, this._files, !this.generateMipMaps, () => {
          proxy._swapAndDie(this, false);
          this.isReady = true;
        }, null, this.format, this._extension, false, 0, 0, null, void 0, this._useSRGBBuffer, ArrayBuffer.isView(this._buffer) ? this._buffer : null);
        return;
      case 8:
        proxy = this._engine.createRawCubeTexture(this._bufferViewArray, this.width, this._originalFormat ?? this.format, this.type, this.generateMipMaps, this.invertY, this.samplingMode, this._compression);
        proxy._swapAndDie(this, false);
        this.isReady = true;
        break;
      case 13:
        return;
      case 9:
        proxy = this._engine.createPrefilteredCubeTexture(this.url, null, this._lodGenerationScale, this._lodGenerationOffset, (proxy2) => {
          if (proxy2) {
            proxy2._swapAndDie(this, false);
          }
          this.isReady = true;
        }, null, this.format, this._extension);
        proxy._sphericalPolynomial = this._sphericalPolynomial;
        return;
      case 12:
      case 14: {
        break;
      }
    }
  }
  /**
   * @internal
   */
  _swapAndDie(target, swapAll = true) {
    this._hardwareTexture?.setUsage(target._source, this.generateMipMaps, this.is2DArray, this.isCube, this.is3D, this.width, this.height, this.depth);
    target._hardwareTexture = this._hardwareTexture;
    if (swapAll) {
      target._isRGBD = this._isRGBD;
    }
    if (this._lodTextureHigh) {
      if (target._lodTextureHigh) {
        target._lodTextureHigh.dispose();
      }
      target._lodTextureHigh = this._lodTextureHigh;
    }
    if (this._lodTextureMid) {
      if (target._lodTextureMid) {
        target._lodTextureMid.dispose();
      }
      target._lodTextureMid = this._lodTextureMid;
    }
    if (this._lodTextureLow) {
      if (target._lodTextureLow) {
        target._lodTextureLow.dispose();
      }
      target._lodTextureLow = this._lodTextureLow;
    }
    if (this._irradianceTexture) {
      if (target._irradianceTexture) {
        target._irradianceTexture.dispose();
      }
      target._irradianceTexture = this._irradianceTexture;
    }
    const cache = this._engine.getLoadedTexturesCache();
    let index = cache.indexOf(this);
    if (index !== -1) {
      cache.splice(index, 1);
    }
    index = cache.indexOf(target);
    if (index === -1) {
      cache.push(target);
    }
  }
  /**
   * Dispose the current allocated resources
   */
  dispose() {
    this._references--;
    this.onLoadedObservable.clear();
    this.onErrorObservable.clear();
    if (this._references === 0) {
      this._engine._releaseTexture(this);
      this._hardwareTexture = null;
      this._dynamicTextureSource = null;
    }
  }
};
InternalTexture._Counter = 0;

// node_modules/@babylonjs/core/Engines/abstractEngine.js
function QueueNewFrame(func, requester) {
  if (!IsWindowObjectExist()) {
    if (typeof requestAnimationFrame === "function") {
      return requestAnimationFrame(func);
    }
  } else {
    const {
      requestAnimationFrame: requestAnimationFrame2
    } = requester || window;
    if (typeof requestAnimationFrame2 === "function") {
      return requestAnimationFrame2(func);
    }
  }
  return setTimeout(func, 16);
}
var AbstractEngine = class _AbstractEngine {
  /**
   * Gets the current frame id
   */
  get frameId() {
    return this._frameId;
  }
  /**
   * Gets a boolean indicating if the engine runs in WebGPU or not.
   */
  get isWebGPU() {
    return this._isWebGPU;
  }
  /**
   * @internal
   */
  _getShaderProcessor(shaderLanguage) {
    return this._shaderProcessor;
  }
  /**
   * Gets the shader platform name used by the effects.
   */
  get shaderPlatformName() {
    return this._shaderPlatformName;
  }
  _clearEmptyResources() {
    this._emptyTexture = null;
    this._emptyCubeTexture = null;
    this._emptyTexture3D = null;
    this._emptyTexture2DArray = null;
  }
  /**
   * Gets or sets a boolean indicating if depth buffer should be reverse, going from far to near.
   * This can provide greater z depth for distant objects.
   */
  get useReverseDepthBuffer() {
    return this._useReverseDepthBuffer;
  }
  set useReverseDepthBuffer(useReverse) {
    if (useReverse === this._useReverseDepthBuffer) {
      return;
    }
    this._useReverseDepthBuffer = useReverse;
    if (useReverse) {
      this._depthCullingState.depthFunc = 518;
    } else {
      this._depthCullingState.depthFunc = 515;
    }
  }
  /**
   * Enable or disable color writing
   * @param enable defines the state to set
   */
  setColorWrite(enable) {
    if (enable !== this._colorWrite) {
      this._colorWriteChanged = true;
      this._colorWrite = enable;
    }
  }
  /**
   * Gets a boolean indicating if color writing is enabled
   * @returns the current color writing state
   */
  getColorWrite() {
    return this._colorWrite;
  }
  /**
   * Gets the depth culling state manager
   */
  get depthCullingState() {
    return this._depthCullingState;
  }
  /**
   * Gets the alpha state manager
   */
  get alphaState() {
    return this._alphaState;
  }
  /**
   * Gets the stencil state manager
   */
  get stencilState() {
    return this._stencilState;
  }
  /**
   * Gets the stencil state composer
   */
  get stencilStateComposer() {
    return this._stencilStateComposer;
  }
  /** @internal */
  _getGlobalDefines(defines) {
    if (defines) {
      if (this.isNDCHalfZRange) {
        defines["IS_NDC_HALF_ZRANGE"] = "";
      } else {
        delete defines["IS_NDC_HALF_ZRANGE"];
      }
      if (this.useReverseDepthBuffer) {
        defines["USE_REVERSE_DEPTHBUFFER"] = "";
      } else {
        delete defines["USE_REVERSE_DEPTHBUFFER"];
      }
      if (this.useExactSrgbConversions) {
        defines["USE_EXACT_SRGB_CONVERSIONS"] = "";
      } else {
        delete defines["USE_EXACT_SRGB_CONVERSIONS"];
      }
      return;
    } else {
      let s = "";
      if (this.isNDCHalfZRange) {
        s += "#define IS_NDC_HALF_ZRANGE";
      }
      if (this.useReverseDepthBuffer) {
        if (s) {
          s += "\n";
        }
        s += "#define USE_REVERSE_DEPTHBUFFER";
      }
      if (this.useExactSrgbConversions) {
        if (s) {
          s += "\n";
        }
        s += "#define USE_EXACT_SRGB_CONVERSIONS";
      }
      return s;
    }
  }
  _rebuildInternalTextures() {
    const currentState = this._internalTexturesCache.slice();
    for (const internalTexture of currentState) {
      internalTexture._rebuild();
    }
  }
  _rebuildRenderTargetWrappers() {
    const currentState = this._renderTargetWrapperCache.slice();
    for (const renderTargetWrapper of currentState) {
      renderTargetWrapper._rebuild();
    }
  }
  _rebuildEffects() {
    for (const key in this._compiledEffects) {
      const effect = this._compiledEffects[key];
      effect._pipelineContext = null;
      effect._prepareEffect();
    }
    Effect.ResetCache();
  }
  _rebuildGraphicsResources() {
    this.wipeCaches(true);
    this._rebuildEffects();
    this._rebuildComputeEffects?.();
    this._rebuildBuffers();
    this._rebuildInternalTextures();
    this._rebuildTextures();
    this._rebuildRenderTargetWrappers();
    this.wipeCaches(true);
  }
  _flagContextRestored() {
    Logger.Warn(this.name + " context successfully restored.");
    this.onContextRestoredObservable.notifyObservers(this);
    this._contextWasLost = false;
  }
  _restoreEngineAfterContextLost(initEngine) {
    setTimeout(() => __async(this, null, function* () {
      this._clearEmptyResources();
      const depthTest = this._depthCullingState.depthTest;
      const depthFunc = this._depthCullingState.depthFunc;
      const depthMask = this._depthCullingState.depthMask;
      const stencilTest = this._stencilState.stencilTest;
      yield initEngine();
      this._rebuildGraphicsResources();
      this._depthCullingState.depthTest = depthTest;
      this._depthCullingState.depthFunc = depthFunc;
      this._depthCullingState.depthMask = depthMask;
      this._stencilState.stencilTest = stencilTest;
      this._flagContextRestored();
    }), 0);
  }
  /** Gets a boolean indicating if the engine was disposed */
  get isDisposed() {
    return this._isDisposed;
  }
  /**
   * Enables or disables the snapshot rendering mode
   * Note that the WebGL engine does not support snapshot rendering so setting the value won't have any effect for this engine
   */
  get snapshotRendering() {
    return false;
  }
  set snapshotRendering(activate) {
  }
  /**
   * Gets or sets the snapshot rendering mode
   */
  get snapshotRenderingMode() {
    return 0;
  }
  set snapshotRenderingMode(mode) {
  }
  /**
   * Returns the string "AbstractEngine"
   * @returns "AbstractEngine"
   */
  getClassName() {
    return "AbstractEngine";
  }
  /**
   * Gets the default empty texture
   */
  get emptyTexture() {
    if (!this._emptyTexture) {
      this._emptyTexture = this.createRawTexture(new Uint8Array(4), 1, 1, 5, false, false, 1);
    }
    return this._emptyTexture;
  }
  /**
   * Gets the default empty 3D texture
   */
  get emptyTexture3D() {
    if (!this._emptyTexture3D) {
      this._emptyTexture3D = this.createRawTexture3D(new Uint8Array(4), 1, 1, 1, 5, false, false, 1);
    }
    return this._emptyTexture3D;
  }
  /**
   * Gets the default empty 2D array texture
   */
  get emptyTexture2DArray() {
    if (!this._emptyTexture2DArray) {
      this._emptyTexture2DArray = this.createRawTexture2DArray(new Uint8Array(4), 1, 1, 1, 5, false, false, 1);
    }
    return this._emptyTexture2DArray;
  }
  /**
   * Gets the default empty cube texture
   */
  get emptyCubeTexture() {
    if (!this._emptyCubeTexture) {
      const faceData = new Uint8Array(4);
      const cubeData = [faceData, faceData, faceData, faceData, faceData, faceData];
      this._emptyCubeTexture = this.createRawCubeTexture(cubeData, 1, 5, 0, false, false, 1);
    }
    return this._emptyCubeTexture;
  }
  /**
   * Gets the list of current active render loop functions
   * @returns a read only array with the current render loop functions
   */
  get activeRenderLoops() {
    return this._activeRenderLoops;
  }
  /**
   * stop executing a render loop function and remove it from the execution array
   * @param renderFunction defines the function to be removed. If not provided all functions will be removed.
   */
  stopRenderLoop(renderFunction) {
    if (!renderFunction) {
      this._activeRenderLoops.length = 0;
      this._cancelFrame();
      return;
    }
    const index = this._activeRenderLoops.indexOf(renderFunction);
    if (index >= 0) {
      this._activeRenderLoops.splice(index, 1);
      if (this._activeRenderLoops.length == 0) {
        this._cancelFrame();
      }
    }
  }
  _cancelFrame() {
    if (this._frameHandler !== 0) {
      const handlerToCancel = this._frameHandler;
      this._frameHandler = 0;
      if (!IsWindowObjectExist()) {
        if (typeof cancelAnimationFrame === "function") {
          return cancelAnimationFrame(handlerToCancel);
        }
      } else {
        const {
          cancelAnimationFrame: cancelAnimationFrame2
        } = this.getHostWindow() || window;
        if (typeof cancelAnimationFrame2 === "function") {
          return cancelAnimationFrame2(handlerToCancel);
        }
      }
      return clearTimeout(handlerToCancel);
    }
  }
  /**
   * Begin a new frame
   */
  beginFrame() {
    this.onBeginFrameObservable.notifyObservers(this);
  }
  /**
   * End the current frame
   */
  endFrame() {
    this._frameId++;
    this.onEndFrameObservable.notifyObservers(this);
  }
  /** @internal */
  _renderLoop() {
    this._frameHandler = 0;
    if (!this._contextWasLost) {
      let shouldRender = true;
      if (this._isDisposed || !this.renderEvenInBackground && this._windowIsBackground) {
        shouldRender = false;
      }
      if (shouldRender) {
        this.beginFrame();
        if (!this._renderViews()) {
          this._renderFrame();
        }
        this.endFrame();
      }
    }
    if (this._activeRenderLoops.length > 0 && this._frameHandler === 0) {
      this._frameHandler = this._queueNewFrame(this._boundRenderFunction, this.getHostWindow());
    }
  }
  /** @internal */
  _renderFrame() {
    for (let index = 0; index < this._activeRenderLoops.length; index++) {
      const renderFunction = this._activeRenderLoops[index];
      renderFunction();
    }
  }
  /** @internal */
  _renderViews() {
    return false;
  }
  /**
   * Can be used to override the current requestAnimationFrame requester.
   * @internal
   */
  _queueNewFrame(bindedRenderFunction, requester) {
    return QueueNewFrame(bindedRenderFunction, requester);
  }
  /**
   * Register and execute a render loop. The engine can have more than one render function
   * @param renderFunction defines the function to continuously execute
   */
  runRenderLoop(renderFunction) {
    if (this._activeRenderLoops.indexOf(renderFunction) !== -1) {
      return;
    }
    this._activeRenderLoops.push(renderFunction);
    if (this._activeRenderLoops.length === 1 && this._frameHandler === 0) {
      this._frameHandler = this._queueNewFrame(this._boundRenderFunction, this.getHostWindow());
    }
  }
  /**
   * Gets a boolean indicating if depth testing is enabled
   * @returns the current state
   */
  getDepthBuffer() {
    return this._depthCullingState.depthTest;
  }
  /**
   * Enable or disable depth buffering
   * @param enable defines the state to set
   */
  setDepthBuffer(enable) {
    this._depthCullingState.depthTest = enable;
  }
  /**
   * Set the z offset Factor to apply to current rendering
   * @param value defines the offset to apply
   */
  setZOffset(value) {
    this._depthCullingState.zOffset = this.useReverseDepthBuffer ? -value : value;
  }
  /**
   * Gets the current value of the zOffset Factor
   * @returns the current zOffset Factor state
   */
  getZOffset() {
    const zOffset = this._depthCullingState.zOffset;
    return this.useReverseDepthBuffer ? -zOffset : zOffset;
  }
  /**
   * Set the z offset Units to apply to current rendering
   * @param value defines the offset to apply
   */
  setZOffsetUnits(value) {
    this._depthCullingState.zOffsetUnits = this.useReverseDepthBuffer ? -value : value;
  }
  /**
   * Gets the current value of the zOffset Units
   * @returns the current zOffset Units state
   */
  getZOffsetUnits() {
    const zOffsetUnits = this._depthCullingState.zOffsetUnits;
    return this.useReverseDepthBuffer ? -zOffsetUnits : zOffsetUnits;
  }
  /**
   * Gets host window
   * @returns the host window object
   */
  getHostWindow() {
    if (!IsWindowObjectExist()) {
      return null;
    }
    if (this._renderingCanvas && this._renderingCanvas.ownerDocument && this._renderingCanvas.ownerDocument.defaultView) {
      return this._renderingCanvas.ownerDocument.defaultView;
    }
    return window;
  }
  /**
   * (WebGPU only) True (default) to be in compatibility mode, meaning rendering all existing scenes without artifacts (same rendering than WebGL).
   * Setting the property to false will improve performances but may not work in some scenes if some precautions are not taken.
   * See https://doc.babylonjs.com/setup/support/webGPU/webGPUOptimization/webGPUNonCompatibilityMode for more details
   */
  get compatibilityMode() {
    return this._compatibilityMode;
  }
  set compatibilityMode(mode) {
    this._compatibilityMode = true;
  }
  _rebuildTextures() {
    for (const scene of this.scenes) {
      scene._rebuildTextures();
    }
    for (const scene of this._virtualScenes) {
      scene._rebuildTextures();
    }
  }
  /**
   * @internal
   */
  _releaseRenderTargetWrapper(rtWrapper) {
    const index = this._renderTargetWrapperCache.indexOf(rtWrapper);
    if (index !== -1) {
      this._renderTargetWrapperCache.splice(index, 1);
    }
  }
  /**
   * Gets the current viewport
   */
  get currentViewport() {
    return this._cachedViewport;
  }
  /**
   * Set the WebGL's viewport
   * @param viewport defines the viewport element to be used
   * @param requiredWidth defines the width required for rendering. If not provided the rendering canvas' width is used
   * @param requiredHeight defines the height required for rendering. If not provided the rendering canvas' height is used
   */
  setViewport(viewport, requiredWidth, requiredHeight) {
    const width = requiredWidth || this.getRenderWidth();
    const height = requiredHeight || this.getRenderHeight();
    const x = viewport.x || 0;
    const y = viewport.y || 0;
    this._cachedViewport = viewport;
    this._viewport(x * width, y * height, width * viewport.width, height * viewport.height);
  }
  /**
   * Create an image to use with canvas
   * @returns IImage interface
   */
  createCanvasImage() {
    return document.createElement("img");
  }
  /**
   * Returns a string describing the current engine
   */
  get description() {
    let description = this.name + this.version;
    if (this._caps.parallelShaderCompile) {
      description += " - Parallel shader compilation";
    }
    return description;
  }
  _createTextureBase(url, noMipmap, invertY, scene, samplingMode = 3, onLoad = null, onError = null, prepareTexture, prepareTextureProcess, buffer = null, fallback = null, format = null, forcedExtension = null, mimeType, loaderOptions, useSRGBBuffer) {
    url = url || "";
    const fromData = url.substr(0, 5) === "data:";
    const fromBlob = url.substr(0, 5) === "blob:";
    const isBase64 = fromData && url.indexOf(";base64,") !== -1;
    const texture = fallback ? fallback : new InternalTexture(
      this,
      1
      /* InternalTextureSource.Url */
    );
    if (texture !== fallback) {
      texture.label = url.substring(0, 60);
    }
    const originalUrl = url;
    if (this._transformTextureUrl && !isBase64 && !fallback && !buffer) {
      url = this._transformTextureUrl(url);
    }
    if (originalUrl !== url) {
      texture._originalUrl = originalUrl;
    }
    const lastDot = url.lastIndexOf(".");
    let extension = forcedExtension ? forcedExtension : lastDot > -1 ? url.substring(lastDot).toLowerCase() : "";
    let loader = null;
    const queryStringIndex = extension.indexOf("?");
    if (queryStringIndex > -1) {
      extension = extension.split("?")[0];
    }
    for (const availableLoader of _AbstractEngine._TextureLoaders) {
      if (availableLoader.canLoad(extension, mimeType)) {
        loader = availableLoader;
        break;
      }
    }
    if (scene) {
      scene.addPendingData(texture);
    }
    texture.url = url;
    texture.generateMipMaps = !noMipmap;
    texture.samplingMode = samplingMode;
    texture.invertY = invertY;
    texture._useSRGBBuffer = this._getUseSRGBBuffer(!!useSRGBBuffer, noMipmap);
    if (!this._doNotHandleContextLost) {
      texture._buffer = buffer;
    }
    let onLoadObserver = null;
    if (onLoad && !fallback) {
      onLoadObserver = texture.onLoadedObservable.add(onLoad);
    }
    if (!fallback) {
      this._internalTexturesCache.push(texture);
    }
    const onInternalError = (message, exception) => {
      if (scene) {
        scene.removePendingData(texture);
      }
      if (url === originalUrl) {
        if (onLoadObserver) {
          texture.onLoadedObservable.remove(onLoadObserver);
        }
        if (EngineStore.UseFallbackTexture && url !== EngineStore.FallbackTexture) {
          this._createTextureBase(EngineStore.FallbackTexture, noMipmap, texture.invertY, scene, samplingMode, null, onError, prepareTexture, prepareTextureProcess, buffer, texture);
        }
        message = (message || "Unknown error") + (EngineStore.UseFallbackTexture ? " - Fallback texture was used" : "");
        texture.onErrorObservable.notifyObservers({
          message,
          exception
        });
        if (onError) {
          onError(message, exception);
        }
      } else {
        Logger.Warn(`Failed to load ${url}, falling back to ${originalUrl}`);
        this._createTextureBase(originalUrl, noMipmap, texture.invertY, scene, samplingMode, onLoad, onError, prepareTexture, prepareTextureProcess, buffer, texture, format, forcedExtension, mimeType, loaderOptions, useSRGBBuffer);
      }
    };
    if (loader) {
      const callback = (data) => {
        loader.loadData(data, texture, (width, height, loadMipmap, isCompressed, done, loadFailed) => {
          if (loadFailed) {
            onInternalError("TextureLoader failed to load data");
          } else {
            prepareTexture(texture, extension, scene, {
              width,
              height
            }, texture.invertY, !loadMipmap, isCompressed, () => {
              done();
              return false;
            }, samplingMode);
          }
        }, loaderOptions);
      };
      if (!buffer) {
        this._loadFile(url, (data) => callback(new Uint8Array(data)), void 0, scene ? scene.offlineProvider : void 0, true, (request, exception) => {
          onInternalError("Unable to load " + (request ? request.responseURL : url, exception));
        });
      } else {
        if (buffer instanceof ArrayBuffer) {
          callback(new Uint8Array(buffer));
        } else if (ArrayBuffer.isView(buffer)) {
          callback(buffer);
        } else {
          if (onError) {
            onError("Unable to load: only ArrayBuffer or ArrayBufferView is supported", null);
          }
        }
      }
    } else {
      const onload = (img) => {
        if (fromBlob && !this._doNotHandleContextLost) {
          texture._buffer = img;
        }
        prepareTexture(texture, extension, scene, img, texture.invertY, noMipmap, false, prepareTextureProcess, samplingMode);
      };
      if (!fromData || isBase64) {
        if (buffer && (typeof buffer.decoding === "string" || buffer.close)) {
          onload(buffer);
        } else {
          _AbstractEngine._FileToolsLoadImage(url || "", onload, onInternalError, scene ? scene.offlineProvider : null, mimeType, texture.invertY && this._features.needsInvertingBitmap ? {
            imageOrientation: "flipY"
          } : void 0);
        }
      } else if (typeof buffer === "string" || buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer) || buffer instanceof Blob) {
        _AbstractEngine._FileToolsLoadImage(buffer, onload, onInternalError, scene ? scene.offlineProvider : null, mimeType, texture.invertY && this._features.needsInvertingBitmap ? {
          imageOrientation: "flipY"
        } : void 0);
      } else if (buffer) {
        onload(buffer);
      }
    }
    return texture;
  }
  _rebuildBuffers() {
    for (const uniformBuffer of this._uniformBuffers) {
      uniformBuffer._rebuildAfterContextLost();
    }
  }
  /** @internal */
  get _shouldUseHighPrecisionShader() {
    return !!(this._caps.highPrecisionShaderSupported && this._highPrecisionShadersAllowed);
  }
  /**
   * Gets host document
   * @returns the host document object
   */
  getHostDocument() {
    if (this._renderingCanvas && this._renderingCanvas.ownerDocument) {
      return this._renderingCanvas.ownerDocument;
    }
    return IsDocumentAvailable() ? document : null;
  }
  /**
   * Gets the list of loaded textures
   * @returns an array containing all loaded textures
   */
  getLoadedTexturesCache() {
    return this._internalTexturesCache;
  }
  /**
   * Clears the list of texture accessible through engine.
   * This can help preventing texture load conflict due to name collision.
   */
  clearInternalTexturesCache() {
    this._internalTexturesCache.length = 0;
  }
  /**
   * Gets the object containing all engine capabilities
   * @returns the EngineCapabilities object
   */
  getCaps() {
    return this._caps;
  }
  /**
   * Reset the texture cache to empty state
   */
  resetTextureCache() {
    for (const key in this._boundTexturesCache) {
      if (!Object.prototype.hasOwnProperty.call(this._boundTexturesCache, key)) {
        continue;
      }
      this._boundTexturesCache[key] = null;
    }
    this._currentTextureChannel = -1;
  }
  /**
   * Gets or sets the name of the engine
   */
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  /**
   * Returns the current npm package of the sdk
   */
  // Not mixed with Version for tooling purpose.
  static get NpmPackage() {
    return "babylonjs@7.20.1";
  }
  /**
   * Returns the current version of the framework
   */
  static get Version() {
    return "7.20.1";
  }
  /**
   * Gets the HTML canvas attached with the current webGL context
   * @returns a HTML canvas
   */
  getRenderingCanvas() {
    return this._renderingCanvas;
  }
  /**
   * Gets the audio context specified in engine initialization options
   * @returns an Audio Context
   */
  getAudioContext() {
    return this._audioContext;
  }
  /**
   * Gets the audio destination specified in engine initialization options
   * @returns an audio destination node
   */
  getAudioDestination() {
    return this._audioDestination;
  }
  /**
   * Defines the hardware scaling level.
   * By default the hardware scaling level is computed from the window device ratio.
   * if level = 1 then the engine will render at the exact resolution of the canvas. If level = 0.5 then the engine will render at twice the size of the canvas.
   * @param level defines the level to use
   */
  setHardwareScalingLevel(level) {
    this._hardwareScalingLevel = level;
    this.resize();
  }
  /**
   * Gets the current hardware scaling level.
   * By default the hardware scaling level is computed from the window device ratio.
   * if level = 1 then the engine will render at the exact resolution of the canvas. If level = 0.5 then the engine will render at twice the size of the canvas.
   * @returns a number indicating the current hardware scaling level
   */
  getHardwareScalingLevel() {
    return this._hardwareScalingLevel;
  }
  /**
   * Gets or sets a boolean indicating if resources should be retained to be able to handle context lost events
   * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene#handling-webgl-context-lost
   */
  get doNotHandleContextLost() {
    return this._doNotHandleContextLost;
  }
  set doNotHandleContextLost(value) {
    this._doNotHandleContextLost = value;
  }
  /**
   * Returns true if the stencil buffer has been enabled through the creation option of the context.
   */
  get isStencilEnable() {
    return this._isStencilEnable;
  }
  /**
   * Gets the options used for engine creation
   * @returns EngineOptions object
   */
  getCreationOptions() {
    return this._creationOptions;
  }
  /**
   * Creates a new engine
   * @param antialias defines whether anti-aliasing should be enabled. If undefined, it means that the underlying engine is free to enable it or not
   * @param options defines further options to be sent to the creation context
   * @param adaptToDeviceRatio defines whether to adapt to the device's viewport characteristics (default: false)
   */
  constructor(antialias, options, adaptToDeviceRatio) {
    this._colorWrite = true;
    this._colorWriteChanged = true;
    this._depthCullingState = new DepthCullingState();
    this._stencilStateComposer = new StencilStateComposer();
    this._stencilState = new StencilState();
    this._alphaState = new AlphaState();
    this._alphaMode = 1;
    this._alphaEquation = 0;
    this._activeRequests = [];
    this._badOS = false;
    this._badDesktopOS = false;
    this._compatibilityMode = true;
    this._internalTexturesCache = new Array();
    this._currentRenderTarget = null;
    this._boundTexturesCache = {};
    this._activeChannel = 0;
    this._currentTextureChannel = -1;
    this._viewportCached = {
      x: 0,
      y: 0,
      z: 0,
      w: 0
    };
    this._isWebGPU = false;
    this.onCanvasBlurObservable = new Observable();
    this.onCanvasFocusObservable = new Observable();
    this.onNewSceneAddedObservable = new Observable();
    this.onResizeObservable = new Observable();
    this.onCanvasPointerOutObservable = new Observable();
    this.disablePerformanceMonitorInBackground = false;
    this.disableVertexArrayObjects = false;
    this._frameId = 0;
    this.hostInformation = {
      isMobile: false
    };
    this.isFullscreen = false;
    this.enableOfflineSupport = false;
    this.disableManifestCheck = false;
    this.disableContextMenu = true;
    this.currentRenderPassId = 0;
    this.isPointerLock = false;
    this.postProcesses = [];
    this.canvasTabIndex = 1;
    this._contextWasLost = false;
    this._useReverseDepthBuffer = false;
    this.isNDCHalfZRange = false;
    this.hasOriginBottomLeft = true;
    this._renderTargetWrapperCache = new Array();
    this._compiledEffects = {};
    this._isDisposed = false;
    this.scenes = [];
    this._virtualScenes = new Array();
    this.onBeforeTextureInitObservable = new Observable();
    this.renderEvenInBackground = true;
    this.preventCacheWipeBetweenFrames = false;
    this._frameHandler = 0;
    this._activeRenderLoops = new Array();
    this._windowIsBackground = false;
    this._boundRenderFunction = () => this._renderLoop();
    this.onBeforeShaderCompilationObservable = new Observable();
    this.onAfterShaderCompilationObservable = new Observable();
    this.onBeginFrameObservable = new Observable();
    this.onEndFrameObservable = new Observable();
    this._transformTextureUrl = null;
    this._uniformBuffers = new Array();
    this._storageBuffers = new Array();
    this._highPrecisionShadersAllowed = true;
    this.onContextLostObservable = new Observable();
    this.onContextRestoredObservable = new Observable();
    this._name = "";
    this.premultipliedAlpha = true;
    this.adaptToDeviceRatio = false;
    this._lastDevicePixelRatio = 1;
    this._doNotHandleContextLost = false;
    this.cullBackFaces = null;
    this._renderPassNames = ["main"];
    this._fps = 60;
    this._deltaTime = 0;
    this._deterministicLockstep = false;
    this._lockstepMaxSteps = 4;
    this._timeStep = 1 / 60;
    this.onDisposeObservable = new Observable();
    EngineStore.Instances.push(this);
    this.startTime = PrecisionDate.Now;
    this._stencilStateComposer.stencilGlobal = this._stencilState;
    PerformanceConfigurator.SetMatrixPrecision(!!options.useHighPrecisionMatrix);
    if (IsNavigatorAvailable() && navigator.userAgent) {
      this._badOS = /iPad/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent);
      this._badDesktopOS = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    this.adaptToDeviceRatio = adaptToDeviceRatio ?? false;
    options.antialias = antialias ?? options.antialias;
    options.deterministicLockstep = options.deterministicLockstep ?? false;
    options.lockstepMaxSteps = options.lockstepMaxSteps ?? 4;
    options.timeStep = options.timeStep ?? 1 / 60;
    options.audioEngine = options.audioEngine ?? true;
    options.stencil = options.stencil ?? true;
    this._audioContext = options.audioEngineOptions?.audioContext ?? null;
    this._audioDestination = options.audioEngineOptions?.audioDestination ?? null;
    this.premultipliedAlpha = options.premultipliedAlpha ?? true;
    this._doNotHandleContextLost = !!options.doNotHandleContextLost;
    this._isStencilEnable = options.stencil ? true : false;
    this.useExactSrgbConversions = options.useExactSrgbConversions ?? false;
    const devicePixelRatio = IsWindowObjectExist() ? window.devicePixelRatio || 1 : 1;
    const limitDeviceRatio = options.limitDeviceRatio || devicePixelRatio;
    adaptToDeviceRatio = adaptToDeviceRatio || options.adaptToDeviceRatio || false;
    this._hardwareScalingLevel = adaptToDeviceRatio ? 1 / Math.min(limitDeviceRatio, devicePixelRatio) : 1;
    this._lastDevicePixelRatio = devicePixelRatio;
    this._creationOptions = options;
  }
  /**
   * Resize the view according to the canvas' size
   * @param forceSetSize true to force setting the sizes of the underlying canvas
   */
  resize(forceSetSize = false) {
    let width;
    let height;
    if (this.adaptToDeviceRatio) {
      const devicePixelRatio = IsWindowObjectExist() ? window.devicePixelRatio || 1 : 1;
      const changeRatio = this._lastDevicePixelRatio / devicePixelRatio;
      this._lastDevicePixelRatio = devicePixelRatio;
      this._hardwareScalingLevel *= changeRatio;
    }
    if (IsWindowObjectExist() && IsDocumentAvailable()) {
      if (this._renderingCanvas) {
        const boundingRect = this._renderingCanvas.getBoundingClientRect ? this._renderingCanvas.getBoundingClientRect() : {
          // fallback to last solution in case the function doesn't exist
          width: this._renderingCanvas.width * this._hardwareScalingLevel,
          height: this._renderingCanvas.height * this._hardwareScalingLevel
        };
        width = this._renderingCanvas.clientWidth || boundingRect.width || this._renderingCanvas.width || 100;
        height = this._renderingCanvas.clientHeight || boundingRect.height || this._renderingCanvas.height || 100;
      } else {
        width = window.innerWidth;
        height = window.innerHeight;
      }
    } else {
      width = this._renderingCanvas ? this._renderingCanvas.width : 100;
      height = this._renderingCanvas ? this._renderingCanvas.height : 100;
    }
    this.setSize(width / this._hardwareScalingLevel, height / this._hardwareScalingLevel, forceSetSize);
  }
  /**
   * Force a specific size of the canvas
   * @param width defines the new canvas' width
   * @param height defines the new canvas' height
   * @param forceSetSize true to force setting the sizes of the underlying canvas
   * @returns true if the size was changed
   */
  setSize(width, height, forceSetSize = false) {
    if (!this._renderingCanvas) {
      return false;
    }
    width = width | 0;
    height = height | 0;
    if (!forceSetSize && this._renderingCanvas.width === width && this._renderingCanvas.height === height) {
      return false;
    }
    this._renderingCanvas.width = width;
    this._renderingCanvas.height = height;
    if (this.scenes) {
      for (let index = 0; index < this.scenes.length; index++) {
        const scene = this.scenes[index];
        for (let camIndex = 0; camIndex < scene.cameras.length; camIndex++) {
          const cam = scene.cameras[camIndex];
          cam._currentRenderId = 0;
        }
      }
      if (this.onResizeObservable.hasObservers()) {
        this.onResizeObservable.notifyObservers(this);
      }
    }
    return true;
  }
  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Creates a raw texture
   * @param data defines the data to store in the texture
   * @param width defines the width of the texture
   * @param height defines the height of the texture
   * @param format defines the format of the data
   * @param generateMipMaps defines if the engine should generate the mip levels
   * @param invertY defines if data must be stored with Y axis inverted
   * @param samplingMode defines the required sampling mode (Texture.NEAREST_SAMPLINGMODE by default)
   * @param compression defines the compression used (null by default)
   * @param type defines the type fo the data (Engine.TEXTURETYPE_UNSIGNED_INT by default)
   * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
   * @param useSRGBBuffer defines if the texture must be loaded in a sRGB GPU buffer (if supported by the GPU).
   * @returns the raw texture inside an InternalTexture
   */
  createRawTexture(data, width, height, format, generateMipMaps, invertY, samplingMode, compression, type, creationFlags, useSRGBBuffer) {
    throw _WarnImport("engine.rawTexture");
  }
  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Creates a new raw cube texture
   * @param data defines the array of data to use to create each face
   * @param size defines the size of the textures
   * @param format defines the format of the data
   * @param type defines the type of the data (like Engine.TEXTURETYPE_UNSIGNED_INT)
   * @param generateMipMaps  defines if the engine should generate the mip levels
   * @param invertY defines if data must be stored with Y axis inverted
   * @param samplingMode defines the required sampling mode (like Texture.NEAREST_SAMPLINGMODE)
   * @param compression defines the compression used (null by default)
   * @returns the cube texture as an InternalTexture
   */
  createRawCubeTexture(data, size, format, type, generateMipMaps, invertY, samplingMode, compression) {
    throw _WarnImport("engine.rawTexture");
  }
  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Creates a new raw 3D texture
   * @param data defines the data used to create the texture
   * @param width defines the width of the texture
   * @param height defines the height of the texture
   * @param depth defines the depth of the texture
   * @param format defines the format of the texture
   * @param generateMipMaps defines if the engine must generate mip levels
   * @param invertY defines if data must be stored with Y axis inverted
   * @param samplingMode defines the required sampling mode (like Texture.NEAREST_SAMPLINGMODE)
   * @param compression defines the compressed used (can be null)
   * @param textureType defines the compressed used (can be null)
   * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
   * @returns a new raw 3D texture (stored in an InternalTexture)
   */
  createRawTexture3D(data, width, height, depth, format, generateMipMaps, invertY, samplingMode, compression, textureType, creationFlags) {
    throw _WarnImport("engine.rawTexture");
  }
  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Creates a new raw 2D array texture
   * @param data defines the data used to create the texture
   * @param width defines the width of the texture
   * @param height defines the height of the texture
   * @param depth defines the number of layers of the texture
   * @param format defines the format of the texture
   * @param generateMipMaps defines if the engine must generate mip levels
   * @param invertY defines if data must be stored with Y axis inverted
   * @param samplingMode defines the required sampling mode (like Texture.NEAREST_SAMPLINGMODE)
   * @param compression defines the compressed used (can be null)
   * @param textureType defines the compressed used (can be null)
   * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
   * @returns a new raw 2D array texture (stored in an InternalTexture)
   */
  createRawTexture2DArray(data, width, height, depth, format, generateMipMaps, invertY, samplingMode, compression, textureType, creationFlags) {
    throw _WarnImport("engine.rawTexture");
  }
  /**
   * Shared initialization across engines types.
   * @param canvas The canvas associated with this instance of the engine.
   */
  _sharedInit(canvas) {
    this._renderingCanvas = canvas;
  }
  _setupMobileChecks() {
    if (!(navigator && navigator.userAgent)) {
      return;
    }
    this._checkForMobile = () => {
      const currentUA = navigator.userAgent;
      this.hostInformation.isMobile = currentUA.indexOf("Mobile") !== -1 || // Needed for iOS 13+ detection on iPad (inspired by solution from https://stackoverflow.com/questions/9038625/detect-if-device-is-ios)
      currentUA.indexOf("Mac") !== -1 && IsDocumentAvailable() && "ontouchend" in document;
    };
    this._checkForMobile();
    if (IsWindowObjectExist()) {
      window.addEventListener("resize", this._checkForMobile);
    }
  }
  /**
   * creates and returns a new video element
   * @param constraints video constraints
   * @returns video element
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createVideoElement(constraints) {
    return document.createElement("video");
  }
  /**
   * @internal
   */
  _reportDrawCall(numDrawCalls = 1) {
    this._drawCalls?.addCount(numDrawCalls, false);
  }
  /**
   * Gets the current framerate
   * @returns a number representing the framerate
   */
  getFps() {
    return this._fps;
  }
  /**
   * Gets the time spent between current and previous frame
   * @returns a number representing the delta time in ms
   */
  getDeltaTime() {
    return this._deltaTime;
  }
  /**
   * Gets a boolean indicating that the engine is running in deterministic lock step mode
   * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#deterministic-lockstep
   * @returns true if engine is in deterministic lock step mode
   */
  isDeterministicLockStep() {
    return this._deterministicLockstep;
  }
  /**
   * Gets the max steps when engine is running in deterministic lock step
   * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#deterministic-lockstep
   * @returns the max steps
   */
  getLockstepMaxSteps() {
    return this._lockstepMaxSteps;
  }
  /**
   * Returns the time in ms between steps when using deterministic lock step.
   * @returns time step in (ms)
   */
  getTimeStep() {
    return this._timeStep * 1e3;
  }
  /**
   * Engine abstraction for loading and creating an image bitmap from a given source string.
   * @param imageSource source to load the image from.
   * @param options An object that sets options for the image's extraction.
   */
  _createImageBitmapFromSource(imageSource, options) {
    throw new Error("createImageBitmapFromSource is not implemented");
  }
  /**
   * Engine abstraction for createImageBitmap
   * @param image source for image
   * @param options An object that sets options for the image's extraction.
   * @returns ImageBitmap
   */
  createImageBitmap(image, options) {
    return createImageBitmap(image, options);
  }
  /**
   * Resize an image and returns the image data as an uint8array
   * @param image image to resize
   * @param bufferWidth destination buffer width
   * @param bufferHeight destination buffer height
   */
  resizeImageBitmap(image, bufferWidth, bufferHeight) {
    throw new Error("resizeImageBitmap is not implemented");
  }
  /**
   * Get Font size information
   * @param font font name
   */
  getFontOffset(font) {
    throw new Error("getFontOffset is not implemented");
  }
  static _CreateCanvas(width, height) {
    if (typeof document === "undefined") {
      return new OffscreenCanvas(width, height);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  /**
   * Create a canvas. This method is overridden by other engines
   * @param width width
   * @param height height
   * @returns ICanvas interface
   */
  createCanvas(width, height) {
    return _AbstractEngine._CreateCanvas(width, height);
  }
  /**
   * Loads an image as an HTMLImageElement.
   * @param input url string, ArrayBuffer, or Blob to load
   * @param onLoad callback called when the image successfully loads
   * @param onError callback called when the image fails to load
   * @param offlineProvider offline provider for caching
   * @param mimeType optional mime type
   * @param imageBitmapOptions optional the options to use when creating an ImageBitmap
   * @returns the HTMLImageElement of the loaded image
   * @internal
   */
  static _FileToolsLoadImage(input, onLoad, onError, offlineProvider, mimeType, imageBitmapOptions) {
    throw _WarnImport("FileTools");
  }
  /**
   * @internal
   */
  _loadFile(url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) {
    const request = _loadFile(url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError);
    this._activeRequests.push(request);
    request.onCompleteObservable.add(() => {
      const index = this._activeRequests.indexOf(request);
      if (index !== -1) {
        this._activeRequests.splice(index, 1);
      }
    });
    return request;
  }
  /**
   * Loads a file from a url
   * @param url url to load
   * @param onSuccess callback called when the file successfully loads
   * @param onProgress callback called while file is loading (if the server supports this mode)
   * @param offlineProvider defines the offline provider for caching
   * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
   * @param onError callback called when the file fails to load
   * @returns a file request object
   * @internal
   */
  static _FileToolsLoadFile(url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) {
    if (EngineFunctionContext.loadFile) {
      return EngineFunctionContext.loadFile(url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError);
    }
    throw _WarnImport("FileTools");
  }
  /**
   * Dispose and release all associated resources
   */
  dispose() {
    this.releaseEffects();
    this._isDisposed = true;
    this.stopRenderLoop();
    if (this._emptyTexture) {
      this._releaseTexture(this._emptyTexture);
      this._emptyTexture = null;
    }
    if (this._emptyCubeTexture) {
      this._releaseTexture(this._emptyCubeTexture);
      this._emptyCubeTexture = null;
    }
    this._renderingCanvas = null;
    if (this.onBeforeTextureInitObservable) {
      this.onBeforeTextureInitObservable.clear();
    }
    while (this.postProcesses.length) {
      this.postProcesses[0].dispose();
    }
    while (this.scenes.length) {
      this.scenes[0].dispose();
    }
    while (this._virtualScenes.length) {
      this._virtualScenes[0].dispose();
    }
    this.releaseComputeEffects?.();
    Effect.ResetCache();
    for (const request of this._activeRequests) {
      request.abort();
    }
    this._boundRenderFunction = null;
    this.onDisposeObservable.notifyObservers(this);
    this.onDisposeObservable.clear();
    this.onResizeObservable.clear();
    this.onCanvasBlurObservable.clear();
    this.onCanvasFocusObservable.clear();
    this.onCanvasPointerOutObservable.clear();
    this.onNewSceneAddedObservable.clear();
    if (IsWindowObjectExist()) {
      window.removeEventListener("resize", this._checkForMobile);
    }
    const index = EngineStore.Instances.indexOf(this);
    if (index >= 0) {
      EngineStore.Instances.splice(index, 1);
    }
    if (!EngineStore.Instances.length) {
      EngineStore.OnEnginesDisposedObservable.notifyObservers(this);
      EngineStore.OnEnginesDisposedObservable.clear();
    }
    this.onBeginFrameObservable.clear();
    this.onEndFrameObservable.clear();
  }
  /**
   * Method called to create the default loading screen.
   * This can be overridden in your own app.
   * @param canvas The rendering canvas element
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static DefaultLoadingScreenFactory(canvas) {
    throw _WarnImport("LoadingScreen");
  }
};
AbstractEngine._TextureLoaders = [];
AbstractEngine._RenderPassIdCounter = 0;
AbstractEngine._RescalePostProcessFactory = null;

// node_modules/@babylonjs/core/Misc/fileTools.js
var Base64DataUrlRegEx = new RegExp(/^data:([^,]+\/[^,]+)?;base64,/i);
var LoadFileError = class _LoadFileError extends RuntimeError {
  /**
   * Creates a new LoadFileError
   * @param message defines the message of the error
   * @param object defines the optional web request
   */
  constructor(message, object) {
    super(message, ErrorCodes.LoadFileError);
    this.name = "LoadFileError";
    BaseError._setPrototypeOf(this, _LoadFileError.prototype);
    if (object instanceof WebRequest) {
      this.request = object;
    } else {
      this.file = object;
    }
  }
};
var RequestFileError = class _RequestFileError extends RuntimeError {
  /**
   * Creates a new LoadFileError
   * @param message defines the message of the error
   * @param request defines the optional web request
   */
  constructor(message, request) {
    super(message, ErrorCodes.RequestFileError);
    this.request = request;
    this.name = "RequestFileError";
    BaseError._setPrototypeOf(this, _RequestFileError.prototype);
  }
};
var ReadFileError = class _ReadFileError extends RuntimeError {
  /**
   * Creates a new ReadFileError
   * @param message defines the message of the error
   * @param file defines the optional file
   */
  constructor(message, file) {
    super(message, ErrorCodes.ReadFileError);
    this.file = file;
    this.name = "ReadFileError";
    BaseError._setPrototypeOf(this, _ReadFileError.prototype);
  }
};
var CleanUrl = (url) => {
  url = url.replace(/#/gm, "%23");
  return url;
};
var FileToolsOptions = {
  /**
   * Gets or sets the retry strategy to apply when an error happens while loading an asset.
   * When defining this function, return the wait time before trying again or return -1 to
   * stop retrying and error out.
   */
  DefaultRetryStrategy: RetryStrategy.ExponentialBackoff(),
  /**
   * Gets or sets the base URL to use to load assets
   */
  BaseUrl: "",
  /**
   * Default behaviour for cors in the application.
   * It can be a string if the expected behavior is identical in the entire app.
   * Or a callback to be able to set it per url or on a group of them (in case of Video source for instance)
   */
  CorsBehavior: "anonymous",
  /**
   * Gets or sets a function used to pre-process url before using them to load assets
   * @param url
   * @returns the processed url
   */
  PreprocessUrl: (url) => url,
  /**
   * Gets or sets the base URL to use to load scripts
   * Used for both JS and WASM
   */
  ScriptBaseUrl: "",
  /**
   * Gets or sets a function used to pre-process script url before using them to load.
   * Used for both JS and WASM
   * @param url defines the url to process
   * @returns the processed url
   */
  ScriptPreprocessUrl: (url) => url,
  /**
   * Gets or sets a function used to clean the url before using it to load assets
   * @param url defines the url to clean
   * @returns the cleaned url
   */
  CleanUrl
};
var SetCorsBehavior = (url, element) => {
  if (url && url.indexOf("data:") === 0) {
    return;
  }
  if (FileToolsOptions.CorsBehavior) {
    if (typeof FileToolsOptions.CorsBehavior === "string" || FileToolsOptions.CorsBehavior instanceof String) {
      element.crossOrigin = FileToolsOptions.CorsBehavior;
    } else {
      const result = FileToolsOptions.CorsBehavior(url);
      if (result) {
        element.crossOrigin = result;
      }
    }
  }
};
var LoadImage = (input, onLoad, onError, offlineProvider, mimeType = "", imageBitmapOptions) => {
  const engine = EngineStore.LastCreatedEngine;
  if (typeof HTMLImageElement === "undefined" && !engine?._features.forceBitmapOverHTMLImageElement) {
    onError("LoadImage is only supported in web or BabylonNative environments.");
    return null;
  }
  let url;
  let usingObjectURL = false;
  if (input instanceof ArrayBuffer || ArrayBuffer.isView(input)) {
    if (typeof Blob !== "undefined" && typeof URL !== "undefined") {
      url = URL.createObjectURL(new Blob([input], {
        type: mimeType
      }));
      usingObjectURL = true;
    } else {
      url = `data:${mimeType};base64,` + EncodeArrayBufferToBase64(input);
    }
  } else if (input instanceof Blob) {
    url = URL.createObjectURL(input);
    usingObjectURL = true;
  } else {
    url = FileToolsOptions.CleanUrl(input);
    url = FileToolsOptions.PreprocessUrl(url);
  }
  const onErrorHandler = (exception) => {
    if (onError) {
      const inputText = url || input.toString();
      onError(`Error while trying to load image: ${inputText.indexOf("http") === 0 || inputText.length <= 128 ? inputText : inputText.slice(0, 128) + "..."}`, exception);
    }
  };
  if (engine?._features.forceBitmapOverHTMLImageElement) {
    LoadFile(url, (data) => {
      engine.createImageBitmap(new Blob([data], {
        type: mimeType
      }), __spreadValues({
        premultiplyAlpha: "none"
      }, imageBitmapOptions)).then((imgBmp) => {
        onLoad(imgBmp);
        if (usingObjectURL) {
          URL.revokeObjectURL(url);
        }
      }).catch((reason) => {
        if (onError) {
          onError("Error while trying to load image: " + input, reason);
        }
      });
    }, void 0, offlineProvider || void 0, true, (request, exception) => {
      onErrorHandler(exception);
    });
    return null;
  }
  const img = new Image();
  SetCorsBehavior(url, img);
  const handlersList = [];
  const loadHandlersList = () => {
    handlersList.forEach((handler) => {
      handler.target.addEventListener(handler.name, handler.handler);
    });
  };
  const unloadHandlersList = () => {
    handlersList.forEach((handler) => {
      handler.target.removeEventListener(handler.name, handler.handler);
    });
    handlersList.length = 0;
  };
  const loadHandler = () => {
    unloadHandlersList();
    onLoad(img);
    if (usingObjectURL && img.src) {
      URL.revokeObjectURL(img.src);
    }
  };
  const errorHandler = (err) => {
    unloadHandlersList();
    onErrorHandler(err);
    if (usingObjectURL && img.src) {
      URL.revokeObjectURL(img.src);
    }
  };
  const cspHandler = (err) => {
    if (err.blockedURI !== img.src) {
      return;
    }
    unloadHandlersList();
    const cspException = new Error(`CSP violation of policy ${err.effectiveDirective} ${err.blockedURI}. Current policy is ${err.originalPolicy}`);
    EngineStore.UseFallbackTexture = false;
    onErrorHandler(cspException);
    if (usingObjectURL && img.src) {
      URL.revokeObjectURL(img.src);
    }
    img.src = "";
  };
  handlersList.push({
    target: img,
    name: "load",
    handler: loadHandler
  });
  handlersList.push({
    target: img,
    name: "error",
    handler: errorHandler
  });
  handlersList.push({
    target: document,
    name: "securitypolicyviolation",
    handler: cspHandler
  });
  loadHandlersList();
  const fromBlob = url.substring(0, 5) === "blob:";
  const fromData = url.substring(0, 5) === "data:";
  const noOfflineSupport = () => {
    if (fromBlob || fromData || !WebRequest.IsCustomRequestAvailable) {
      img.src = url;
    } else {
      LoadFile(url, (data, _, contentType) => {
        const type = !mimeType && contentType ? contentType : mimeType;
        const blob = new Blob([data], {
          type
        });
        const url2 = URL.createObjectURL(blob);
        usingObjectURL = true;
        img.src = url2;
      }, void 0, offlineProvider || void 0, true, (_request, exception) => {
        onErrorHandler(exception);
      });
    }
  };
  const loadFromOfflineSupport = () => {
    if (offlineProvider) {
      offlineProvider.loadImage(url, img);
    }
  };
  if (!fromBlob && !fromData && offlineProvider && offlineProvider.enableTexturesOffline) {
    offlineProvider.open(loadFromOfflineSupport, noOfflineSupport);
  } else {
    if (url.indexOf("file:") !== -1) {
      const textureName = decodeURIComponent(url.substring(5).toLowerCase());
      if (FilesInputStore.FilesToLoad[textureName] && typeof URL !== "undefined") {
        try {
          let blobURL;
          try {
            blobURL = URL.createObjectURL(FilesInputStore.FilesToLoad[textureName]);
          } catch (ex) {
            blobURL = URL.createObjectURL(FilesInputStore.FilesToLoad[textureName]);
          }
          img.src = blobURL;
          usingObjectURL = true;
        } catch (e) {
          img.src = "";
        }
        return img;
      }
    }
    noOfflineSupport();
  }
  return img;
};
var ReadFile = (file, onSuccess, onProgress, useArrayBuffer, onError) => {
  const reader = new FileReader();
  const fileRequest = {
    onCompleteObservable: new Observable(),
    abort: () => reader.abort()
  };
  reader.onloadend = () => fileRequest.onCompleteObservable.notifyObservers(fileRequest);
  if (onError) {
    reader.onerror = () => {
      onError(new ReadFileError(`Unable to read ${file.name}`, file));
    };
  }
  reader.onload = (e) => {
    onSuccess(e.target["result"]);
  };
  if (onProgress) {
    reader.onprogress = onProgress;
  }
  if (!useArrayBuffer) {
    reader.readAsText(file);
  } else {
    reader.readAsArrayBuffer(file);
  }
  return fileRequest;
};
var LoadFile = (fileOrUrl, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError, onOpened) => {
  if (fileOrUrl.name) {
    return ReadFile(fileOrUrl, onSuccess, onProgress, useArrayBuffer, onError ? (error) => {
      onError(void 0, error);
    } : void 0);
  }
  const url = fileOrUrl;
  if (url.indexOf("file:") !== -1) {
    let fileName = decodeURIComponent(url.substring(5).toLowerCase());
    if (fileName.indexOf("./") === 0) {
      fileName = fileName.substring(2);
    }
    const file = FilesInputStore.FilesToLoad[fileName];
    if (file) {
      return ReadFile(file, onSuccess, onProgress, useArrayBuffer, onError ? (error) => onError(void 0, new LoadFileError(error.message, error.file)) : void 0);
    }
  }
  const {
    match,
    type
  } = TestBase64DataUrl(url);
  if (match) {
    const fileRequest = {
      onCompleteObservable: new Observable(),
      abort: () => () => {
      }
    };
    try {
      const data = useArrayBuffer ? DecodeBase64UrlToBinary(url) : DecodeBase64UrlToString(url);
      onSuccess(data, void 0, type);
    } catch (error) {
      if (onError) {
        onError(void 0, error);
      } else {
        Logger.Error(error.message || "Failed to parse the Data URL");
      }
    }
    TimingTools.SetImmediate(() => {
      fileRequest.onCompleteObservable.notifyObservers(fileRequest);
    });
    return fileRequest;
  }
  return RequestFile(url, (data, request) => {
    onSuccess(data, request?.responseURL, request?.getResponseHeader("content-type"));
  }, onProgress, offlineProvider, useArrayBuffer, onError ? (error) => {
    onError(error.request, new LoadFileError(error.message, error.request));
  } : void 0, onOpened);
};
var RequestFile = (url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError, onOpened) => {
  url = FileToolsOptions.CleanUrl(url);
  url = FileToolsOptions.PreprocessUrl(url);
  const loadUrl = FileToolsOptions.BaseUrl + url;
  let aborted = false;
  const fileRequest = {
    onCompleteObservable: new Observable(),
    abort: () => aborted = true
  };
  const requestFile = () => {
    let request = new WebRequest();
    let retryHandle = null;
    let onReadyStateChange;
    const unbindEvents = () => {
      if (!request) {
        return;
      }
      if (onProgress) {
        request.removeEventListener("progress", onProgress);
      }
      if (onReadyStateChange) {
        request.removeEventListener("readystatechange", onReadyStateChange);
      }
      request.removeEventListener("loadend", onLoadEnd);
    };
    let onLoadEnd = () => {
      unbindEvents();
      fileRequest.onCompleteObservable.notifyObservers(fileRequest);
      fileRequest.onCompleteObservable.clear();
      onProgress = void 0;
      onReadyStateChange = null;
      onLoadEnd = null;
      onError = void 0;
      onOpened = void 0;
      onSuccess = void 0;
    };
    fileRequest.abort = () => {
      aborted = true;
      if (onLoadEnd) {
        onLoadEnd();
      }
      if (request && request.readyState !== (XMLHttpRequest.DONE || 4)) {
        request.abort();
      }
      if (retryHandle !== null) {
        clearTimeout(retryHandle);
        retryHandle = null;
      }
      request = null;
    };
    const handleError = (error) => {
      const message = error.message || "Unknown error";
      if (onError && request) {
        onError(new RequestFileError(message, request));
      } else {
        Logger.Error(message);
      }
    };
    const retryLoop = (retryIndex) => {
      if (!request) {
        return;
      }
      request.open("GET", loadUrl);
      if (onOpened) {
        try {
          onOpened(request);
        } catch (e) {
          handleError(e);
          return;
        }
      }
      if (useArrayBuffer) {
        request.responseType = "arraybuffer";
      }
      if (onProgress) {
        request.addEventListener("progress", onProgress);
      }
      if (onLoadEnd) {
        request.addEventListener("loadend", onLoadEnd);
      }
      onReadyStateChange = () => {
        if (aborted || !request) {
          return;
        }
        if (request.readyState === (XMLHttpRequest.DONE || 4)) {
          if (onReadyStateChange) {
            request.removeEventListener("readystatechange", onReadyStateChange);
          }
          if (request.status >= 200 && request.status < 300 || request.status === 0 && (!IsWindowObjectExist() || IsFileURL())) {
            try {
              if (onSuccess) {
                onSuccess(useArrayBuffer ? request.response : request.responseText, request);
              }
            } catch (e) {
              handleError(e);
            }
            return;
          }
          const retryStrategy = FileToolsOptions.DefaultRetryStrategy;
          if (retryStrategy) {
            const waitTime = retryStrategy(loadUrl, request, retryIndex);
            if (waitTime !== -1) {
              unbindEvents();
              request = new WebRequest();
              retryHandle = setTimeout(() => retryLoop(retryIndex + 1), waitTime);
              return;
            }
          }
          const error = new RequestFileError("Error status: " + request.status + " " + request.statusText + " - Unable to load " + loadUrl, request);
          if (onError) {
            onError(error);
          }
        }
      };
      request.addEventListener("readystatechange", onReadyStateChange);
      request.send();
    };
    retryLoop(0);
  };
  if (offlineProvider && offlineProvider.enableSceneOffline) {
    const noOfflineSupport = (request) => {
      if (request && request.status > 400) {
        if (onError) {
          onError(request);
        }
      } else {
        requestFile();
      }
    };
    const loadFromOfflineSupport = () => {
      if (offlineProvider) {
        offlineProvider.loadFile(FileToolsOptions.BaseUrl + url, (data) => {
          if (!aborted && onSuccess) {
            onSuccess(data);
          }
          fileRequest.onCompleteObservable.notifyObservers(fileRequest);
        }, onProgress ? (event) => {
          if (!aborted && onProgress) {
            onProgress(event);
          }
        } : void 0, noOfflineSupport, useArrayBuffer);
      }
    };
    offlineProvider.open(loadFromOfflineSupport, noOfflineSupport);
  } else {
    requestFile();
  }
  return fileRequest;
};
var IsFileURL = () => {
  return typeof location !== "undefined" && location.protocol === "file:";
};
var IsBase64DataUrl = (uri) => {
  return Base64DataUrlRegEx.test(uri);
};
var TestBase64DataUrl = (uri) => {
  const results = Base64DataUrlRegEx.exec(uri);
  if (results === null || results.length === 0) {
    return {
      match: false,
      type: ""
    };
  } else {
    const type = results[0].replace("data:", "").replace("base64,", "");
    return {
      match: true,
      type
    };
  }
};
function DecodeBase64UrlToBinary(uri) {
  return DecodeBase64ToBinary(uri.split(",")[1]);
}
var DecodeBase64UrlToString = (uri) => {
  return DecodeBase64ToString(uri.split(",")[1]);
};
var initSideEffects = () => {
  AbstractEngine._FileToolsLoadImage = LoadImage;
  EngineFunctionContext.loadFile = LoadFile;
  _functionContainer.loadFile = LoadFile;
};
initSideEffects();
var FileTools;
var _injectLTSFileTools = (DecodeBase64UrlToBinary2, DecodeBase64UrlToString2, FileToolsOptions2, IsBase64DataUrl2, IsFileURL2, LoadFile2, LoadImage2, ReadFile2, RequestFile2, SetCorsBehavior2) => {
  FileTools = {
    DecodeBase64UrlToBinary: DecodeBase64UrlToBinary2,
    DecodeBase64UrlToString: DecodeBase64UrlToString2,
    DefaultRetryStrategy: FileToolsOptions2.DefaultRetryStrategy,
    BaseUrl: FileToolsOptions2.BaseUrl,
    CorsBehavior: FileToolsOptions2.CorsBehavior,
    PreprocessUrl: FileToolsOptions2.PreprocessUrl,
    IsBase64DataUrl: IsBase64DataUrl2,
    IsFileURL: IsFileURL2,
    LoadFile: LoadFile2,
    LoadImage: LoadImage2,
    ReadFile: ReadFile2,
    RequestFile: RequestFile2,
    SetCorsBehavior: SetCorsBehavior2
  };
  Object.defineProperty(FileTools, "DefaultRetryStrategy", {
    get: function() {
      return FileToolsOptions2.DefaultRetryStrategy;
    },
    set: function(value) {
      FileToolsOptions2.DefaultRetryStrategy = value;
    }
  });
  Object.defineProperty(FileTools, "BaseUrl", {
    get: function() {
      return FileToolsOptions2.BaseUrl;
    },
    set: function(value) {
      FileToolsOptions2.BaseUrl = value;
    }
  });
  Object.defineProperty(FileTools, "PreprocessUrl", {
    get: function() {
      return FileToolsOptions2.PreprocessUrl;
    },
    set: function(value) {
      FileToolsOptions2.PreprocessUrl = value;
    }
  });
  Object.defineProperty(FileTools, "CorsBehavior", {
    get: function() {
      return FileToolsOptions2.CorsBehavior;
    },
    set: function(value) {
      FileToolsOptions2.CorsBehavior = value;
    }
  });
};
_injectLTSFileTools(DecodeBase64UrlToBinary, DecodeBase64UrlToString, FileToolsOptions, IsBase64DataUrl, IsFileURL, LoadFile, LoadImage, ReadFile, RequestFile, SetCorsBehavior);

// node_modules/@babylonjs/core/Maths/math.size.js
var Size = class _Size {
  /**
   * Creates a Size object from the given width and height (floats).
   * @param width width of the new size
   * @param height height of the new size
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  /**
   * Returns a string with the Size width and height
   * @returns a string with the Size width and height
   */
  toString() {
    return `{W: ${this.width}, H: ${this.height}}`;
  }
  /**
   * "Size"
   * @returns the string "Size"
   */
  getClassName() {
    return "Size";
  }
  /**
   * Returns the Size hash code.
   * @returns a hash code for a unique width and height
   */
  getHashCode() {
    let hash = this.width | 0;
    hash = hash * 397 ^ (this.height | 0);
    return hash;
  }
  /**
   * Updates the current size from the given one.
   * @param src the given size
   */
  copyFrom(src) {
    this.width = src.width;
    this.height = src.height;
  }
  /**
   * Updates in place the current Size from the given floats.
   * @param width width of the new size
   * @param height height of the new size
   * @returns the updated Size.
   */
  copyFromFloats(width, height) {
    this.width = width;
    this.height = height;
    return this;
  }
  /**
   * Updates in place the current Size from the given floats.
   * @param width width to set
   * @param height height to set
   * @returns the updated Size.
   */
  set(width, height) {
    return this.copyFromFloats(width, height);
  }
  /**
   * Multiplies the width and height by numbers
   * @param w factor to multiple the width by
   * @param h factor to multiple the height by
   * @returns a new Size set with the multiplication result of the current Size and the given floats.
   */
  multiplyByFloats(w, h) {
    return new _Size(this.width * w, this.height * h);
  }
  /**
   * Clones the size
   * @returns a new Size copied from the given one.
   */
  clone() {
    return new _Size(this.width, this.height);
  }
  /**
   * True if the current Size and the given one width and height are strictly equal.
   * @param other the other size to compare against
   * @returns True if the current Size and the given one width and height are strictly equal.
   */
  equals(other) {
    if (!other) {
      return false;
    }
    return this.width === other.width && this.height === other.height;
  }
  /**
   * The surface of the Size : width * height (float).
   */
  get surface() {
    return this.width * this.height;
  }
  /**
   * Create a new size of zero
   * @returns a new Size set to (0.0, 0.0)
   */
  static Zero() {
    return new _Size(0, 0);
  }
  /**
   * Sums the width and height of two sizes
   * @param otherSize size to add to this size
   * @returns a new Size set as the addition result of the current Size and the given one.
   */
  add(otherSize) {
    const r = new _Size(this.width + otherSize.width, this.height + otherSize.height);
    return r;
  }
  /**
   * Subtracts the width and height of two
   * @param otherSize size to subtract to this size
   * @returns a new Size set as the subtraction result of  the given one from the current Size.
   */
  subtract(otherSize) {
    const r = new _Size(this.width - otherSize.width, this.height - otherSize.height);
    return r;
  }
  /**
   * Scales the width and height
   * @param scale the scale to multiply the width and height by
   * @returns a new Size set with the multiplication result of the current Size and the given floats.
   */
  scale(scale) {
    return new _Size(this.width * scale, this.height * scale);
  }
  /**
   * Creates a new Size set at the linear interpolation "amount" between "start" and "end"
   * @param start starting size to lerp between
   * @param end end size to lerp between
   * @param amount amount to lerp between the start and end values
   * @returns a new Size set at the linear interpolation "amount" between "start" and "end"
   */
  static Lerp(start, end, amount) {
    const w = start.width + (end.width - start.width) * amount;
    const h = start.height + (end.height - start.height) * amount;
    return new _Size(w, h);
  }
};

// node_modules/@babylonjs/core/Materials/Textures/thinTexture.js
var ThinTexture = class _ThinTexture {
  /**
   * | Value | Type               | Description |
   * | ----- | ------------------ | ----------- |
   * | 0     | CLAMP_ADDRESSMODE  |             |
   * | 1     | WRAP_ADDRESSMODE   |             |
   * | 2     | MIRROR_ADDRESSMODE |             |
   */
  get wrapU() {
    return this._wrapU;
  }
  set wrapU(value) {
    this._wrapU = value;
  }
  /**
   * | Value | Type               | Description |
   * | ----- | ------------------ | ----------- |
   * | 0     | CLAMP_ADDRESSMODE  |             |
   * | 1     | WRAP_ADDRESSMODE   |             |
   * | 2     | MIRROR_ADDRESSMODE |             |
   */
  get wrapV() {
    return this._wrapV;
  }
  set wrapV(value) {
    this._wrapV = value;
  }
  /**
   * How a texture is mapped.
   * Unused in thin texture mode.
   */
  get coordinatesMode() {
    return 0;
  }
  /**
   * Define if the texture is a cube texture or if false a 2d texture.
   */
  get isCube() {
    if (!this._texture) {
      return false;
    }
    return this._texture.isCube;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  set isCube(value) {
    if (!this._texture) {
      return;
    }
    this._texture.isCube = value;
  }
  /**
   * Define if the texture is a 3d texture (webgl 2) or if false a 2d texture.
   */
  get is3D() {
    if (!this._texture) {
      return false;
    }
    return this._texture.is3D;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  set is3D(value) {
    if (!this._texture) {
      return;
    }
    this._texture.is3D = value;
  }
  /**
   * Define if the texture is a 2d array texture (webgl 2) or if false a 2d texture.
   */
  get is2DArray() {
    if (!this._texture) {
      return false;
    }
    return this._texture.is2DArray;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  set is2DArray(value) {
    if (!this._texture) {
      return;
    }
    this._texture.is2DArray = value;
  }
  /**
   * Get the class name of the texture.
   * @returns "ThinTexture"
   */
  getClassName() {
    return "ThinTexture";
  }
  static _IsRenderTargetWrapper(texture) {
    return texture?.shareDepth !== void 0;
  }
  /**
   * Instantiates a new ThinTexture.
   * Base class of all the textures in babylon.
   * This can be used as an internal texture wrapper in AbstractEngine to benefit from the cache
   * @param internalTexture Define the internalTexture to wrap. You can also pass a RenderTargetWrapper, in which case the texture will be the render target's texture
   */
  constructor(internalTexture) {
    this._wrapU = 1;
    this._wrapV = 1;
    this.wrapR = 1;
    this.anisotropicFilteringLevel = 4;
    this.delayLoadState = 0;
    this._texture = null;
    this._engine = null;
    this._cachedSize = Size.Zero();
    this._cachedBaseSize = Size.Zero();
    this._initialSamplingMode = 2;
    this._texture = _ThinTexture._IsRenderTargetWrapper(internalTexture) ? internalTexture.texture : internalTexture;
    if (this._texture) {
      this._engine = this._texture.getEngine();
    }
  }
  /**
   * Get if the texture is ready to be used (downloaded, converted, mip mapped...).
   * @returns true if fully ready
   */
  isReady() {
    if (this.delayLoadState === 4) {
      this.delayLoad();
      return false;
    }
    if (this._texture) {
      return this._texture.isReady;
    }
    return false;
  }
  /**
   * Triggers the load sequence in delayed load mode.
   */
  delayLoad() {
  }
  /**
   * Get the underlying lower level texture from Babylon.
   * @returns the internal texture
   */
  getInternalTexture() {
    return this._texture;
  }
  /**
   * Get the size of the texture.
   * @returns the texture size.
   */
  getSize() {
    if (this._texture) {
      if (this._texture.width) {
        this._cachedSize.width = this._texture.width;
        this._cachedSize.height = this._texture.height;
        return this._cachedSize;
      }
      if (this._texture._size) {
        this._cachedSize.width = this._texture._size;
        this._cachedSize.height = this._texture._size;
        return this._cachedSize;
      }
    }
    return this._cachedSize;
  }
  /**
   * Get the base size of the texture.
   * It can be different from the size if the texture has been resized for POT for instance
   * @returns the base size
   */
  getBaseSize() {
    if (!this.isReady() || !this._texture) {
      this._cachedBaseSize.width = 0;
      this._cachedBaseSize.height = 0;
      return this._cachedBaseSize;
    }
    if (this._texture._size) {
      this._cachedBaseSize.width = this._texture._size;
      this._cachedBaseSize.height = this._texture._size;
      return this._cachedBaseSize;
    }
    this._cachedBaseSize.width = this._texture.baseWidth;
    this._cachedBaseSize.height = this._texture.baseHeight;
    return this._cachedBaseSize;
  }
  /**
   * Get the current sampling mode associated with the texture.
   */
  get samplingMode() {
    if (!this._texture) {
      return this._initialSamplingMode;
    }
    return this._texture.samplingMode;
  }
  /**
   * Update the sampling mode of the texture.
   * Default is Trilinear mode.
   *
   * | Value | Type               | Description |
   * | ----- | ------------------ | ----------- |
   * | 1     | NEAREST_SAMPLINGMODE or NEAREST_NEAREST_MIPLINEAR  | Nearest is: mag = nearest, min = nearest, mip = linear |
   * | 2     | BILINEAR_SAMPLINGMODE or LINEAR_LINEAR_MIPNEAREST | Bilinear is: mag = linear, min = linear, mip = nearest |
   * | 3     | TRILINEAR_SAMPLINGMODE or LINEAR_LINEAR_MIPLINEAR | Trilinear is: mag = linear, min = linear, mip = linear |
   * | 4     | NEAREST_NEAREST_MIPNEAREST |             |
   * | 5    | NEAREST_LINEAR_MIPNEAREST |             |
   * | 6    | NEAREST_LINEAR_MIPLINEAR |             |
   * | 7    | NEAREST_LINEAR |             |
   * | 8    | NEAREST_NEAREST |             |
   * | 9   | LINEAR_NEAREST_MIPNEAREST |             |
   * | 10   | LINEAR_NEAREST_MIPLINEAR |             |
   * | 11   | LINEAR_LINEAR |             |
   * | 12   | LINEAR_NEAREST |             |
   *
   *    > _mag_: magnification filter (close to the viewer)
   *    > _min_: minification filter (far from the viewer)
   *    > _mip_: filter used between mip map levels
   *@param samplingMode Define the new sampling mode of the texture
   */
  updateSamplingMode(samplingMode) {
    if (this._texture && this._engine) {
      this._engine.updateTextureSamplingMode(samplingMode, this._texture);
    }
  }
  /**
   * Release and destroy the underlying lower level texture aka internalTexture.
   */
  releaseInternalTexture() {
    if (this._texture) {
      this._texture.dispose();
      this._texture = null;
    }
  }
  /**
   * Dispose the texture and release its associated resources.
   */
  dispose() {
    if (this._texture) {
      this.releaseInternalTexture();
      this._engine = null;
    }
  }
};

// node_modules/@babylonjs/core/Materials/drawWrapper.functions.js
function IsWrapper(effect) {
  return effect.getPipelineContext === void 0;
}

// node_modules/@babylonjs/core/Engines/WebGL/webGLShaderProcessors.js
var WebGLShaderProcessor = class {
  constructor() {
    this.shaderLanguage = 0;
  }
  postProcessor(code, defines, isFragment, processingContext, parameters) {
    if (parameters.drawBuffersExtensionDisabled) {
      const regex = /#extension.+GL_EXT_draw_buffers.+(enable|require)/g;
      code = code.replace(regex, "");
    }
    return code;
  }
};

// node_modules/@babylonjs/core/Engines/WebGL/webGL2ShaderProcessors.js
var varyingRegex = /(flat\s)?\s*varying\s*.*/;
var WebGL2ShaderProcessor = class {
  constructor() {
    this.shaderLanguage = 0;
  }
  attributeProcessor(attribute) {
    return attribute.replace("attribute", "in");
  }
  varyingCheck(varying, _isFragment) {
    return varyingRegex.test(varying);
  }
  varyingProcessor(varying, isFragment) {
    return varying.replace("varying", isFragment ? "in" : "out");
  }
  postProcessor(code, defines, isFragment) {
    const hasDrawBuffersExtension = code.search(/#extension.+GL_EXT_draw_buffers.+require/) !== -1;
    const regex = /#extension.+(GL_OVR_multiview2|GL_OES_standard_derivatives|GL_EXT_shader_texture_lod|GL_EXT_frag_depth|GL_EXT_draw_buffers).+(enable|require)/g;
    code = code.replace(regex, "");
    code = code.replace(/texture2D\s*\(/g, "texture(");
    if (isFragment) {
      const hasOutput = code.search(/layout *\(location *= *0\) *out/g) !== -1;
      code = code.replace(/texture2DLodEXT\s*\(/g, "textureLod(");
      code = code.replace(/textureCubeLodEXT\s*\(/g, "textureLod(");
      code = code.replace(/textureCube\s*\(/g, "texture(");
      code = code.replace(/gl_FragDepthEXT/g, "gl_FragDepth");
      code = code.replace(/gl_FragColor/g, "glFragColor");
      code = code.replace(/gl_FragData/g, "glFragData");
      code = code.replace(/void\s+?main\s*\(/g, (hasDrawBuffersExtension || hasOutput ? "" : "layout(location = 0) out vec4 glFragColor;\n") + "void main(");
    } else {
      const hasMultiviewExtension = defines.indexOf("#define MULTIVIEW") !== -1;
      if (hasMultiviewExtension) {
        return "#extension GL_OVR_multiview2 : require\nlayout (num_views = 2) in;\n" + code;
      }
    }
    return code;
  }
};

// node_modules/@babylonjs/core/Meshes/WebGL/webGLDataBuffer.js
var WebGLDataBuffer = class extends DataBuffer {
  constructor(resource) {
    super();
    this._buffer = resource;
  }
  get underlyingResource() {
    return this._buffer;
  }
};

// node_modules/@babylonjs/core/Misc/tools.functions.js
function IsExponentOfTwo(value) {
  let count = 1;
  do {
    count *= 2;
  } while (count < value);
  return count === value;
}
function Mix(a, b, alpha) {
  return a * (1 - alpha) + b * alpha;
}
function NearestPOT(x) {
  const c = CeilingPOT(x);
  const f = FloorPOT(x);
  return c - x > x - f ? f : c;
}
function CeilingPOT(x) {
  x--;
  x |= x >> 1;
  x |= x >> 2;
  x |= x >> 4;
  x |= x >> 8;
  x |= x >> 16;
  x++;
  return x;
}
function FloorPOT(x) {
  x = x | x >> 1;
  x = x | x >> 2;
  x = x | x >> 4;
  x = x | x >> 8;
  x = x | x >> 16;
  return x - (x >> 1);
}
function GetExponentOfTwo(value, max, mode = 2) {
  let pot;
  switch (mode) {
    case 1:
      pot = FloorPOT(value);
      break;
    case 2:
      pot = NearestPOT(value);
      break;
    case 3:
    default:
      pot = CeilingPOT(value);
      break;
  }
  return Math.min(pot, max);
}

// node_modules/@babylonjs/core/Engines/WebGL/webGLHardwareTexture.js
var WebGLHardwareTexture = class {
  get underlyingResource() {
    return this._webGLTexture;
  }
  constructor(existingTexture = null, context) {
    this._MSAARenderBuffers = null;
    this._context = context;
    if (!existingTexture) {
      existingTexture = context.createTexture();
      if (!existingTexture) {
        throw new Error("Unable to create webGL texture");
      }
    }
    this.set(existingTexture);
  }
  setUsage() {
  }
  set(hardwareTexture) {
    this._webGLTexture = hardwareTexture;
  }
  reset() {
    this._webGLTexture = null;
    this._MSAARenderBuffers = null;
  }
  addMSAARenderBuffer(buffer) {
    if (!this._MSAARenderBuffers) {
      this._MSAARenderBuffers = [];
    }
    this._MSAARenderBuffers.push(buffer);
  }
  releaseMSAARenderBuffers() {
    if (this._MSAARenderBuffers) {
      for (const buffer of this._MSAARenderBuffers) {
        this._context.deleteRenderbuffer(buffer);
      }
      this._MSAARenderBuffers = null;
    }
  }
  getMSAARenderBuffer(index = 0) {
    return this._MSAARenderBuffers?.[index] ?? null;
  }
  release() {
    this.releaseMSAARenderBuffers();
    if (this._webGLTexture) {
      this._context.deleteTexture(this._webGLTexture);
    }
    this.reset();
  }
};

// node_modules/@babylonjs/core/Engines/thinEngine.js
var BufferPointer = class {
};
var ThinEngine = class _ThinEngine extends AbstractEngine {
  /**
   * Gets or sets the name of the engine
   */
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  /**
   * Returns the version of the engine
   */
  get version() {
    return this._webGLVersion;
  }
  /**
   * Gets or sets the relative url used to load shaders if using the engine in non-minified mode
   */
  static get ShadersRepository() {
    return Effect.ShadersRepository;
  }
  static set ShadersRepository(value) {
    Effect.ShadersRepository = value;
  }
  /**
   * Gets a boolean indicating that the engine supports uniform buffers
   * @see https://doc.babylonjs.com/setup/support/webGL2#uniform-buffer-objets
   */
  get supportsUniformBuffers() {
    return this.webGLVersion > 1 && !this.disableUniformBuffers;
  }
  /**
   * Gets a boolean indicating that only power of 2 textures are supported
   * Please note that you can still use non power of 2 textures but in this case the engine will forcefully convert them
   */
  get needPOTTextures() {
    return this._webGLVersion < 2 || this.forcePOTTextures;
  }
  get _supportsHardwareTextureRescaling() {
    return false;
  }
  /**
   * sets the object from which width and height will be taken from when getting render width and height
   * Will fallback to the gl object
   * @param dimensions the framebuffer width and height that will be used.
   */
  set framebufferDimensionsObject(dimensions) {
    this._framebufferDimensionsObject = dimensions;
  }
  /**
   * Creates a new snapshot at the next frame using the current snapshotRenderingMode
   */
  snapshotRenderingReset() {
    this.snapshotRendering = false;
  }
  /**
   * Creates a new engine
   * @param canvasOrContext defines the canvas or WebGL context to use for rendering. If you provide a WebGL context, Babylon.js will not hook events on the canvas (like pointers, keyboards, etc...) so no event observables will be available. This is mostly used when Babylon.js is used as a plugin on a system which already used the WebGL context
   * @param antialias defines whether anti-aliasing should be enabled (default value is "undefined", meaning that the browser may or may not enable it)
   * @param options defines further options to be sent to the getContext() function
   * @param adaptToDeviceRatio defines whether to adapt to the device's viewport characteristics (default: false)
   */
  constructor(canvasOrContext, antialias, options, adaptToDeviceRatio) {
    options = options || {};
    super(antialias ?? options.antialias, options, adaptToDeviceRatio);
    this._name = "WebGL";
    this.forcePOTTextures = false;
    this.validateShaderPrograms = false;
    this.disableUniformBuffers = false;
    this._webGLVersion = 1;
    this._vertexAttribArraysEnabled = [];
    this._uintIndicesCurrentlySet = false;
    this._currentBoundBuffer = new Array();
    this._currentFramebuffer = null;
    this._dummyFramebuffer = null;
    this._currentBufferPointers = new Array();
    this._currentInstanceLocations = new Array();
    this._currentInstanceBuffers = new Array();
    this._vaoRecordInProgress = false;
    this._mustWipeVertexAttributes = false;
    this._nextFreeTextureSlots = new Array();
    this._maxSimultaneousTextures = 0;
    this._maxMSAASamplesOverride = null;
    this._unpackFlipYCached = null;
    this.enableUnpackFlipYCached = true;
    this._boundUniforms = {};
    if (!canvasOrContext) {
      return;
    }
    let canvas = null;
    if (canvasOrContext.getContext) {
      canvas = canvasOrContext;
      this._renderingCanvas = canvas;
      if (options.preserveDrawingBuffer === void 0) {
        options.preserveDrawingBuffer = false;
      }
      if (options.xrCompatible === void 0) {
        options.xrCompatible = false;
      }
      if (navigator && navigator.userAgent) {
        this._setupMobileChecks();
        const ua = navigator.userAgent;
        for (const exception of _ThinEngine.ExceptionList) {
          const key = exception.key;
          const targets = exception.targets;
          const check = new RegExp(key);
          if (check.test(ua)) {
            if (exception.capture && exception.captureConstraint) {
              const capture = exception.capture;
              const constraint = exception.captureConstraint;
              const regex = new RegExp(capture);
              const matches = regex.exec(ua);
              if (matches && matches.length > 0) {
                const capturedValue = parseInt(matches[matches.length - 1]);
                if (capturedValue >= constraint) {
                  continue;
                }
              }
            }
            for (const target of targets) {
              switch (target) {
                case "uniformBuffer":
                  this.disableUniformBuffers = true;
                  break;
                case "vao":
                  this.disableVertexArrayObjects = true;
                  break;
                case "antialias":
                  options.antialias = false;
                  break;
                case "maxMSAASamples":
                  this._maxMSAASamplesOverride = 1;
                  break;
              }
            }
          }
        }
      }
      if (!this._doNotHandleContextLost) {
        this._onContextLost = (evt) => {
          evt.preventDefault();
          this._contextWasLost = true;
          Logger.Warn("WebGL context lost.");
          this.onContextLostObservable.notifyObservers(this);
        };
        this._onContextRestored = () => {
          this._restoreEngineAfterContextLost(() => this._initGLContext());
        };
        canvas.addEventListener("webglcontextlost", this._onContextLost, false);
        canvas.addEventListener("webglcontextrestored", this._onContextRestored, false);
        options.powerPreference = options.powerPreference || "high-performance";
      }
      if (this._badDesktopOS) {
        options.xrCompatible = false;
      }
      if (!options.disableWebGL2Support) {
        try {
          this._gl = canvas.getContext("webgl2", options) || canvas.getContext("experimental-webgl2", options);
          if (this._gl) {
            this._webGLVersion = 2;
            this._shaderPlatformName = "WEBGL2";
            if (!this._gl.deleteQuery) {
              this._webGLVersion = 1;
              this._shaderPlatformName = "WEBGL1";
            }
          }
        } catch (e) {
        }
      }
      if (!this._gl) {
        if (!canvas) {
          throw new Error("The provided canvas is null or undefined.");
        }
        try {
          this._gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
        } catch (e) {
          throw new Error("WebGL not supported");
        }
      }
      if (!this._gl) {
        throw new Error("WebGL not supported");
      }
    } else {
      this._gl = canvasOrContext;
      this._renderingCanvas = this._gl.canvas;
      if (this._gl.renderbufferStorageMultisample) {
        this._webGLVersion = 2;
        this._shaderPlatformName = "WEBGL2";
      } else {
        this._shaderPlatformName = "WEBGL1";
      }
      const attributes = this._gl.getContextAttributes();
      if (attributes) {
        options.stencil = attributes.stencil;
      }
    }
    this._gl.pixelStorei(this._gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, this._gl.NONE);
    if (options.useHighPrecisionFloats !== void 0) {
      this._highPrecisionShadersAllowed = options.useHighPrecisionFloats;
    }
    this.resize();
    this._initGLContext();
    this._initFeatures();
    for (let i = 0; i < this._caps.maxVertexAttribs; i++) {
      this._currentBufferPointers[i] = new BufferPointer();
    }
    this._shaderProcessor = this.webGLVersion > 1 ? new WebGL2ShaderProcessor() : new WebGLShaderProcessor();
    const versionToLog = `Babylon.js v${_ThinEngine.Version}`;
    Logger.Log(versionToLog + ` - ${this.description}`);
    if (this._renderingCanvas && this._renderingCanvas.setAttribute) {
      this._renderingCanvas.setAttribute("data-engine", versionToLog);
    }
    const stateObject = getStateObject(this._gl);
    stateObject.validateShaderPrograms = this.validateShaderPrograms;
    stateObject.parallelShaderCompile = this._caps.parallelShaderCompile;
  }
  _clearEmptyResources() {
    this._dummyFramebuffer = null;
    super._clearEmptyResources();
  }
  /**
   * @internal
   */
  _getShaderProcessingContext(shaderLanguage) {
    return null;
  }
  /**
   * Gets a boolean indicating if all created effects are ready
   * @returns true if all effects are ready
   */
  areAllEffectsReady() {
    for (const key in this._compiledEffects) {
      const effect = this._compiledEffects[key];
      if (!effect.isReady()) {
        return false;
      }
    }
    return true;
  }
  _initGLContext() {
    this._caps = {
      maxTexturesImageUnits: this._gl.getParameter(this._gl.MAX_TEXTURE_IMAGE_UNITS),
      maxCombinedTexturesImageUnits: this._gl.getParameter(this._gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
      maxVertexTextureImageUnits: this._gl.getParameter(this._gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      maxTextureSize: this._gl.getParameter(this._gl.MAX_TEXTURE_SIZE),
      maxSamples: this._webGLVersion > 1 ? this._gl.getParameter(this._gl.MAX_SAMPLES) : 1,
      maxCubemapTextureSize: this._gl.getParameter(this._gl.MAX_CUBE_MAP_TEXTURE_SIZE),
      maxRenderTextureSize: this._gl.getParameter(this._gl.MAX_RENDERBUFFER_SIZE),
      maxVertexAttribs: this._gl.getParameter(this._gl.MAX_VERTEX_ATTRIBS),
      maxVaryingVectors: this._gl.getParameter(this._gl.MAX_VARYING_VECTORS),
      maxFragmentUniformVectors: this._gl.getParameter(this._gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      maxVertexUniformVectors: this._gl.getParameter(this._gl.MAX_VERTEX_UNIFORM_VECTORS),
      parallelShaderCompile: this._gl.getExtension("KHR_parallel_shader_compile") || void 0,
      standardDerivatives: this._webGLVersion > 1 || this._gl.getExtension("OES_standard_derivatives") !== null,
      maxAnisotropy: 1,
      astc: this._gl.getExtension("WEBGL_compressed_texture_astc") || this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_astc"),
      bptc: this._gl.getExtension("EXT_texture_compression_bptc") || this._gl.getExtension("WEBKIT_EXT_texture_compression_bptc"),
      s3tc: this._gl.getExtension("WEBGL_compressed_texture_s3tc") || this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc"),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      s3tc_srgb: this._gl.getExtension("WEBGL_compressed_texture_s3tc_srgb") || this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc_srgb"),
      pvrtc: this._gl.getExtension("WEBGL_compressed_texture_pvrtc") || this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
      etc1: this._gl.getExtension("WEBGL_compressed_texture_etc1") || this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_etc1"),
      etc2: this._gl.getExtension("WEBGL_compressed_texture_etc") || this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_etc") || this._gl.getExtension("WEBGL_compressed_texture_es3_0"),
      textureAnisotropicFilterExtension: this._gl.getExtension("EXT_texture_filter_anisotropic") || this._gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || this._gl.getExtension("MOZ_EXT_texture_filter_anisotropic"),
      uintIndices: this._webGLVersion > 1 || this._gl.getExtension("OES_element_index_uint") !== null,
      fragmentDepthSupported: this._webGLVersion > 1 || this._gl.getExtension("EXT_frag_depth") !== null,
      highPrecisionShaderSupported: false,
      timerQuery: this._gl.getExtension("EXT_disjoint_timer_query_webgl2") || this._gl.getExtension("EXT_disjoint_timer_query"),
      supportOcclusionQuery: this._webGLVersion > 1,
      canUseTimestampForTimerQuery: false,
      drawBuffersExtension: false,
      maxMSAASamples: 1,
      colorBufferFloat: !!(this._webGLVersion > 1 && this._gl.getExtension("EXT_color_buffer_float")),
      supportFloatTexturesResolve: false,
      rg11b10ufColorRenderable: false,
      colorBufferHalfFloat: !!(this._webGLVersion > 1 && this._gl.getExtension("EXT_color_buffer_half_float")),
      textureFloat: this._webGLVersion > 1 || this._gl.getExtension("OES_texture_float") ? true : false,
      textureHalfFloat: this._webGLVersion > 1 || this._gl.getExtension("OES_texture_half_float") ? true : false,
      textureHalfFloatRender: false,
      textureFloatLinearFiltering: false,
      textureFloatRender: false,
      textureHalfFloatLinearFiltering: false,
      vertexArrayObject: false,
      instancedArrays: false,
      textureLOD: this._webGLVersion > 1 || this._gl.getExtension("EXT_shader_texture_lod") ? true : false,
      texelFetch: this._webGLVersion !== 1,
      blendMinMax: false,
      multiview: this._gl.getExtension("OVR_multiview2"),
      oculusMultiview: this._gl.getExtension("OCULUS_multiview"),
      depthTextureExtension: false,
      canUseGLInstanceID: this._webGLVersion > 1,
      canUseGLVertexID: this._webGLVersion > 1,
      supportComputeShaders: false,
      supportSRGBBuffers: false,
      supportTransformFeedbacks: this._webGLVersion > 1,
      textureMaxLevel: this._webGLVersion > 1,
      texture2DArrayMaxLayerCount: this._webGLVersion > 1 ? this._gl.getParameter(this._gl.MAX_ARRAY_TEXTURE_LAYERS) : 128,
      disableMorphTargetTexture: false
    };
    this._caps.supportFloatTexturesResolve = this._caps.colorBufferFloat;
    this._caps.rg11b10ufColorRenderable = this._caps.colorBufferFloat;
    this._glVersion = this._gl.getParameter(this._gl.VERSION);
    const rendererInfo = this._gl.getExtension("WEBGL_debug_renderer_info");
    if (rendererInfo != null) {
      this._glRenderer = this._gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL);
      this._glVendor = this._gl.getParameter(rendererInfo.UNMASKED_VENDOR_WEBGL);
    }
    if (!this._glVendor) {
      this._glVendor = this._gl.getParameter(this._gl.VENDOR) || "Unknown vendor";
    }
    if (!this._glRenderer) {
      this._glRenderer = this._gl.getParameter(this._gl.RENDERER) || "Unknown renderer";
    }
    if (this._gl.HALF_FLOAT_OES !== 36193) {
      this._gl.HALF_FLOAT_OES = 36193;
    }
    if (this._gl.RGBA16F !== 34842) {
      this._gl.RGBA16F = 34842;
    }
    if (this._gl.RGBA32F !== 34836) {
      this._gl.RGBA32F = 34836;
    }
    if (this._gl.DEPTH24_STENCIL8 !== 35056) {
      this._gl.DEPTH24_STENCIL8 = 35056;
    }
    if (this._caps.timerQuery) {
      if (this._webGLVersion === 1) {
        this._gl.getQuery = this._caps.timerQuery.getQueryEXT.bind(this._caps.timerQuery);
      }
      this._caps.canUseTimestampForTimerQuery = (this._gl.getQuery(this._caps.timerQuery.TIMESTAMP_EXT, this._caps.timerQuery.QUERY_COUNTER_BITS_EXT) ?? 0) > 0;
    }
    this._caps.maxAnisotropy = this._caps.textureAnisotropicFilterExtension ? this._gl.getParameter(this._caps.textureAnisotropicFilterExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
    this._caps.textureFloatLinearFiltering = this._caps.textureFloat && this._gl.getExtension("OES_texture_float_linear") ? true : false;
    this._caps.textureFloatRender = this._caps.textureFloat && this._canRenderToFloatFramebuffer() ? true : false;
    this._caps.textureHalfFloatLinearFiltering = this._webGLVersion > 1 || this._caps.textureHalfFloat && this._gl.getExtension("OES_texture_half_float_linear") ? true : false;
    if (this._caps.astc) {
      this._gl.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR = this._caps.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR;
    }
    if (this._caps.bptc) {
      this._gl.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT = this._caps.bptc.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT;
    }
    if (this._caps.s3tc_srgb) {
      this._gl.COMPRESSED_SRGB_S3TC_DXT1_EXT = this._caps.s3tc_srgb.COMPRESSED_SRGB_S3TC_DXT1_EXT;
      this._gl.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = this._caps.s3tc_srgb.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
      this._gl.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = this._caps.s3tc_srgb.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
    }
    if (this._caps.etc2) {
      this._gl.COMPRESSED_SRGB8_ETC2 = this._caps.etc2.COMPRESSED_SRGB8_ETC2;
      this._gl.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = this._caps.etc2.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;
    }
    if (this._webGLVersion > 1) {
      if (this._gl.HALF_FLOAT_OES !== 5131) {
        this._gl.HALF_FLOAT_OES = 5131;
      }
    }
    this._caps.textureHalfFloatRender = this._caps.textureHalfFloat && this._canRenderToHalfFloatFramebuffer();
    if (this._webGLVersion > 1) {
      this._caps.drawBuffersExtension = true;
      this._caps.maxMSAASamples = this._maxMSAASamplesOverride !== null ? this._maxMSAASamplesOverride : this._gl.getParameter(this._gl.MAX_SAMPLES);
    } else {
      const drawBuffersExtension = this._gl.getExtension("WEBGL_draw_buffers");
      if (drawBuffersExtension !== null) {
        this._caps.drawBuffersExtension = true;
        this._gl.drawBuffers = drawBuffersExtension.drawBuffersWEBGL.bind(drawBuffersExtension);
        this._gl.DRAW_FRAMEBUFFER = this._gl.FRAMEBUFFER;
        for (let i = 0; i < 16; i++) {
          this._gl["COLOR_ATTACHMENT" + i + "_WEBGL"] = drawBuffersExtension["COLOR_ATTACHMENT" + i + "_WEBGL"];
        }
      }
    }
    if (this._webGLVersion > 1) {
      this._caps.depthTextureExtension = true;
    } else {
      const depthTextureExtension = this._gl.getExtension("WEBGL_depth_texture");
      if (depthTextureExtension != null) {
        this._caps.depthTextureExtension = true;
        this._gl.UNSIGNED_INT_24_8 = depthTextureExtension.UNSIGNED_INT_24_8_WEBGL;
      }
    }
    if (this.disableVertexArrayObjects) {
      this._caps.vertexArrayObject = false;
    } else if (this._webGLVersion > 1) {
      this._caps.vertexArrayObject = true;
    } else {
      const vertexArrayObjectExtension = this._gl.getExtension("OES_vertex_array_object");
      if (vertexArrayObjectExtension != null) {
        this._caps.vertexArrayObject = true;
        this._gl.createVertexArray = vertexArrayObjectExtension.createVertexArrayOES.bind(vertexArrayObjectExtension);
        this._gl.bindVertexArray = vertexArrayObjectExtension.bindVertexArrayOES.bind(vertexArrayObjectExtension);
        this._gl.deleteVertexArray = vertexArrayObjectExtension.deleteVertexArrayOES.bind(vertexArrayObjectExtension);
      }
    }
    if (this._webGLVersion > 1) {
      this._caps.instancedArrays = true;
    } else {
      const instanceExtension = this._gl.getExtension("ANGLE_instanced_arrays");
      if (instanceExtension != null) {
        this._caps.instancedArrays = true;
        this._gl.drawArraysInstanced = instanceExtension.drawArraysInstancedANGLE.bind(instanceExtension);
        this._gl.drawElementsInstanced = instanceExtension.drawElementsInstancedANGLE.bind(instanceExtension);
        this._gl.vertexAttribDivisor = instanceExtension.vertexAttribDivisorANGLE.bind(instanceExtension);
      } else {
        this._caps.instancedArrays = false;
      }
    }
    if (this._gl.getShaderPrecisionFormat) {
      const vertexhighp = this._gl.getShaderPrecisionFormat(this._gl.VERTEX_SHADER, this._gl.HIGH_FLOAT);
      const fragmenthighp = this._gl.getShaderPrecisionFormat(this._gl.FRAGMENT_SHADER, this._gl.HIGH_FLOAT);
      if (vertexhighp && fragmenthighp) {
        this._caps.highPrecisionShaderSupported = vertexhighp.precision !== 0 && fragmenthighp.precision !== 0;
      }
    }
    if (this._webGLVersion > 1) {
      this._caps.blendMinMax = true;
    } else {
      const blendMinMaxExtension = this._gl.getExtension("EXT_blend_minmax");
      if (blendMinMaxExtension != null) {
        this._caps.blendMinMax = true;
        this._gl.MAX = blendMinMaxExtension.MAX_EXT;
        this._gl.MIN = blendMinMaxExtension.MIN_EXT;
      }
    }
    if (!this._caps.supportSRGBBuffers) {
      if (this._webGLVersion > 1) {
        this._caps.supportSRGBBuffers = true;
        this._glSRGBExtensionValues = {
          SRGB: WebGL2RenderingContext.SRGB,
          SRGB8: WebGL2RenderingContext.SRGB8,
          SRGB8_ALPHA8: WebGL2RenderingContext.SRGB8_ALPHA8
        };
      } else {
        const sRGBExtension = this._gl.getExtension("EXT_sRGB");
        if (sRGBExtension != null) {
          this._caps.supportSRGBBuffers = true;
          this._glSRGBExtensionValues = {
            SRGB: sRGBExtension.SRGB_EXT,
            SRGB8: sRGBExtension.SRGB_ALPHA_EXT,
            SRGB8_ALPHA8: sRGBExtension.SRGB_ALPHA_EXT
          };
        }
      }
      this._caps.supportSRGBBuffers = this._caps.supportSRGBBuffers && !!(this._creationOptions && this._creationOptions.forceSRGBBufferSupportState);
    }
    this._depthCullingState.depthTest = true;
    this._depthCullingState.depthFunc = this._gl.LEQUAL;
    this._depthCullingState.depthMask = true;
    this._maxSimultaneousTextures = this._caps.maxCombinedTexturesImageUnits;
    for (let slot = 0; slot < this._maxSimultaneousTextures; slot++) {
      this._nextFreeTextureSlots.push(slot);
    }
    if (this._glRenderer === "Mali-G72") {
      this._caps.disableMorphTargetTexture = true;
    }
  }
  _initFeatures() {
    this._features = {
      forceBitmapOverHTMLImageElement: typeof HTMLImageElement === "undefined",
      supportRenderAndCopyToLodForFloatTextures: this._webGLVersion !== 1,
      supportDepthStencilTexture: this._webGLVersion !== 1,
      supportShadowSamplers: this._webGLVersion !== 1,
      uniformBufferHardCheckMatrix: false,
      allowTexturePrefiltering: this._webGLVersion !== 1,
      trackUbosInFrame: false,
      checkUbosContentBeforeUpload: false,
      supportCSM: this._webGLVersion !== 1,
      basisNeedsPOT: this._webGLVersion === 1,
      support3DTextures: this._webGLVersion !== 1,
      needTypeSuffixInShaderConstants: this._webGLVersion !== 1,
      supportMSAA: this._webGLVersion !== 1,
      supportSSAO2: this._webGLVersion !== 1,
      supportExtendedTextureFormats: this._webGLVersion !== 1,
      supportSwitchCaseInShader: this._webGLVersion !== 1,
      supportSyncTextureRead: true,
      needsInvertingBitmap: true,
      useUBOBindingCache: true,
      needShaderCodeInlining: false,
      needToAlwaysBindUniformBuffers: false,
      supportRenderPasses: false,
      supportSpriteInstancing: true,
      forceVertexBufferStrideAndOffsetMultiple4Bytes: false,
      _checkNonFloatVertexBuffersDontRecreatePipelineContext: false,
      _collectUbosUpdatedInFrame: false
    };
  }
  /**
   * Gets version of the current webGL context
   * Keep it for back compat - use version instead
   */
  get webGLVersion() {
    return this._webGLVersion;
  }
  /**
   * Gets a string identifying the name of the class
   * @returns "Engine" string
   */
  getClassName() {
    return "ThinEngine";
  }
  /** @internal */
  _prepareWorkingCanvas() {
    if (this._workingCanvas) {
      return;
    }
    this._workingCanvas = this.createCanvas(1, 1);
    const context = this._workingCanvas.getContext("2d");
    if (context) {
      this._workingContext = context;
    }
  }
  /**
   * Gets an object containing information about the current engine context
   * @returns an object containing the vendor, the renderer and the version of the current engine context
   */
  getInfo() {
    return this.getGlInfo();
  }
  /**
   * Gets an object containing information about the current webGL context
   * @returns an object containing the vendor, the renderer and the version of the current webGL context
   */
  getGlInfo() {
    return {
      vendor: this._glVendor,
      renderer: this._glRenderer,
      version: this._glVersion
    };
  }
  /**Gets driver info if available */
  extractDriverInfo() {
    const glInfo = this.getGlInfo();
    if (glInfo && glInfo.renderer) {
      return glInfo.renderer;
    }
    return "";
  }
  /**
   * Gets the current render width
   * @param useScreen defines if screen size must be used (or the current render target if any)
   * @returns a number defining the current render width
   */
  getRenderWidth(useScreen = false) {
    if (!useScreen && this._currentRenderTarget) {
      return this._currentRenderTarget.width;
    }
    return this._framebufferDimensionsObject ? this._framebufferDimensionsObject.framebufferWidth : this._gl.drawingBufferWidth;
  }
  /**
   * Gets the current render height
   * @param useScreen defines if screen size must be used (or the current render target if any)
   * @returns a number defining the current render height
   */
  getRenderHeight(useScreen = false) {
    if (!useScreen && this._currentRenderTarget) {
      return this._currentRenderTarget.height;
    }
    return this._framebufferDimensionsObject ? this._framebufferDimensionsObject.framebufferHeight : this._gl.drawingBufferHeight;
  }
  /**
   * Clear the current render buffer or the current render target (if any is set up)
   * @param color defines the color to use
   * @param backBuffer defines if the back buffer must be cleared
   * @param depth defines if the depth buffer must be cleared
   * @param stencil defines if the stencil buffer must be cleared
   */
  clear(color, backBuffer, depth, stencil = false) {
    const useStencilGlobalOnly = this.stencilStateComposer.useStencilGlobalOnly;
    this.stencilStateComposer.useStencilGlobalOnly = true;
    this.applyStates();
    this.stencilStateComposer.useStencilGlobalOnly = useStencilGlobalOnly;
    let mode = 0;
    if (backBuffer && color) {
      let setBackBufferColor = true;
      if (this._currentRenderTarget) {
        const textureFormat = this._currentRenderTarget.texture?.format;
        if (textureFormat === 8 || textureFormat === 9 || textureFormat === 10 || textureFormat === 11) {
          const textureType = this._currentRenderTarget.texture?.type;
          if (textureType === 7 || textureType === 5) {
            _ThinEngine._TempClearColorUint32[0] = color.r * 255;
            _ThinEngine._TempClearColorUint32[1] = color.g * 255;
            _ThinEngine._TempClearColorUint32[2] = color.b * 255;
            _ThinEngine._TempClearColorUint32[3] = color.a * 255;
            this._gl.clearBufferuiv(this._gl.COLOR, 0, _ThinEngine._TempClearColorUint32);
            setBackBufferColor = false;
          } else {
            _ThinEngine._TempClearColorInt32[0] = color.r * 255;
            _ThinEngine._TempClearColorInt32[1] = color.g * 255;
            _ThinEngine._TempClearColorInt32[2] = color.b * 255;
            _ThinEngine._TempClearColorInt32[3] = color.a * 255;
            this._gl.clearBufferiv(this._gl.COLOR, 0, _ThinEngine._TempClearColorInt32);
            setBackBufferColor = false;
          }
        }
      }
      if (setBackBufferColor) {
        this._gl.clearColor(color.r, color.g, color.b, color.a !== void 0 ? color.a : 1);
        mode |= this._gl.COLOR_BUFFER_BIT;
      }
    }
    if (depth) {
      if (this.useReverseDepthBuffer) {
        this._depthCullingState.depthFunc = this._gl.GEQUAL;
        this._gl.clearDepth(0);
      } else {
        this._gl.clearDepth(1);
      }
      mode |= this._gl.DEPTH_BUFFER_BIT;
    }
    if (stencil) {
      this._gl.clearStencil(0);
      mode |= this._gl.STENCIL_BUFFER_BIT;
    }
    this._gl.clear(mode);
  }
  /**
   * @internal
   */
  _viewport(x, y, width, height) {
    if (x !== this._viewportCached.x || y !== this._viewportCached.y || width !== this._viewportCached.z || height !== this._viewportCached.w) {
      this._viewportCached.x = x;
      this._viewportCached.y = y;
      this._viewportCached.z = width;
      this._viewportCached.w = height;
      this._gl.viewport(x, y, width, height);
    }
  }
  /**
   * End the current frame
   */
  endFrame() {
    super.endFrame();
    if (this._badOS) {
      this.flushFramebuffer();
    }
  }
  /**
   * Gets the performance monitor attached to this engine
   * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene#engineinstrumentation
   */
  get performanceMonitor() {
    throw new Error("Not Supported by ThinEngine");
  }
  /**
   * Binds the frame buffer to the specified texture.
   * @param rtWrapper The render target wrapper to render to
   * @param faceIndex The face of the texture to render to in case of cube texture and if the render target wrapper is not a multi render target
   * @param requiredWidth The width of the target to render to
   * @param requiredHeight The height of the target to render to
   * @param forceFullscreenViewport Forces the viewport to be the entire texture/screen if true
   * @param lodLevel Defines the lod level to bind to the frame buffer
   * @param layer Defines the 2d array index to bind to the frame buffer if the render target wrapper is not a multi render target
   */
  bindFramebuffer(rtWrapper, faceIndex = 0, requiredWidth, requiredHeight, forceFullscreenViewport, lodLevel = 0, layer = 0) {
    const webglRTWrapper = rtWrapper;
    if (this._currentRenderTarget) {
      this.unBindFramebuffer(this._currentRenderTarget);
    }
    this._currentRenderTarget = rtWrapper;
    this._bindUnboundFramebuffer(webglRTWrapper._MSAAFramebuffer ? webglRTWrapper._MSAAFramebuffer : webglRTWrapper._framebuffer);
    const gl = this._gl;
    if (!rtWrapper.isMulti) {
      if (rtWrapper.is2DArray || rtWrapper.is3D) {
        gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, rtWrapper.texture._hardwareTexture?.underlyingResource, lodLevel, layer);
      } else if (rtWrapper.isCube) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, rtWrapper.texture._hardwareTexture?.underlyingResource, lodLevel);
      } else if (webglRTWrapper._currentLOD !== lodLevel) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rtWrapper.texture._hardwareTexture?.underlyingResource, lodLevel);
        webglRTWrapper._currentLOD = lodLevel;
      }
    }
    const depthStencilTexture = rtWrapper._depthStencilTexture;
    if (depthStencilTexture) {
      if (rtWrapper.is3D) {
        if (rtWrapper.texture.width !== depthStencilTexture.width || rtWrapper.texture.height !== depthStencilTexture.height || rtWrapper.texture.depth !== depthStencilTexture.depth) {
          Logger.Warn("Depth/Stencil attachment for 3D target must have same dimensions as color attachment");
        }
      }
      const attachment = rtWrapper._depthStencilTextureWithStencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT;
      if (rtWrapper.is2DArray || rtWrapper.is3D) {
        gl.framebufferTextureLayer(gl.FRAMEBUFFER, attachment, depthStencilTexture._hardwareTexture?.underlyingResource, lodLevel, layer);
      } else if (rtWrapper.isCube) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, depthStencilTexture._hardwareTexture?.underlyingResource, lodLevel);
      } else {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, depthStencilTexture._hardwareTexture?.underlyingResource, lodLevel);
      }
    }
    if (this._cachedViewport && !forceFullscreenViewport) {
      this.setViewport(this._cachedViewport, requiredWidth, requiredHeight);
    } else {
      if (!requiredWidth) {
        requiredWidth = rtWrapper.width;
        if (lodLevel) {
          requiredWidth = requiredWidth / Math.pow(2, lodLevel);
        }
      }
      if (!requiredHeight) {
        requiredHeight = rtWrapper.height;
        if (lodLevel) {
          requiredHeight = requiredHeight / Math.pow(2, lodLevel);
        }
      }
      this._viewport(0, 0, requiredWidth, requiredHeight);
    }
    this.wipeCaches();
  }
  /**
   * Set various states to the webGL context
   * @param culling defines culling state: true to enable culling, false to disable it
   * @param zOffset defines the value to apply to zOffset (0 by default)
   * @param force defines if states must be applied even if cache is up to date
   * @param reverseSide defines if culling must be reversed (CCW if false, CW if true)
   * @param cullBackFaces true to cull back faces, false to cull front faces (if culling is enabled)
   * @param stencil stencil states to set
   * @param zOffsetUnits defines the value to apply to zOffsetUnits (0 by default)
   */
  setState(culling, zOffset = 0, force, reverseSide = false, cullBackFaces, stencil, zOffsetUnits = 0) {
    if (this._depthCullingState.cull !== culling || force) {
      this._depthCullingState.cull = culling;
    }
    const cullFace = this.cullBackFaces ?? cullBackFaces ?? true ? this._gl.BACK : this._gl.FRONT;
    if (this._depthCullingState.cullFace !== cullFace || force) {
      this._depthCullingState.cullFace = cullFace;
    }
    this.setZOffset(zOffset);
    this.setZOffsetUnits(zOffsetUnits);
    const frontFace = reverseSide ? this._gl.CW : this._gl.CCW;
    if (this._depthCullingState.frontFace !== frontFace || force) {
      this._depthCullingState.frontFace = frontFace;
    }
    this._stencilStateComposer.stencilMaterial = stencil;
  }
  /**
   * @internal
   */
  _bindUnboundFramebuffer(framebuffer) {
    if (this._currentFramebuffer !== framebuffer) {
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer);
      this._currentFramebuffer = framebuffer;
    }
  }
  /** @internal */
  _currentFrameBufferIsDefaultFrameBuffer() {
    return this._currentFramebuffer === null;
  }
  /**
   * Generates the mipmaps for a texture
   * @param texture texture to generate the mipmaps for
   */
  generateMipmaps(texture) {
    const target = this._getTextureTarget(texture);
    this._bindTextureDirectly(target, texture, true);
    this._gl.generateMipmap(target);
    this._bindTextureDirectly(target, null);
  }
  /**
   * Unbind the current render target texture from the webGL context
   * @param texture defines the render target wrapper to unbind
   * @param disableGenerateMipMaps defines a boolean indicating that mipmaps must not be generated
   * @param onBeforeUnbind defines a function which will be called before the effective unbind
   */
  unBindFramebuffer(texture, disableGenerateMipMaps = false, onBeforeUnbind) {
    const webglRTWrapper = texture;
    this._currentRenderTarget = null;
    const gl = this._gl;
    if (webglRTWrapper._MSAAFramebuffer) {
      if (texture.isMulti) {
        this.unBindMultiColorAttachmentFramebuffer(texture, disableGenerateMipMaps, onBeforeUnbind);
        return;
      }
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, webglRTWrapper._MSAAFramebuffer);
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, webglRTWrapper._framebuffer);
      gl.blitFramebuffer(0, 0, texture.width, texture.height, 0, 0, texture.width, texture.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
    }
    if (texture.texture?.generateMipMaps && !disableGenerateMipMaps && !texture.isCube) {
      this.generateMipmaps(texture.texture);
    }
    if (onBeforeUnbind) {
      if (webglRTWrapper._MSAAFramebuffer) {
        this._bindUnboundFramebuffer(webglRTWrapper._framebuffer);
      }
      onBeforeUnbind();
    }
    this._bindUnboundFramebuffer(null);
  }
  /**
   * Force a webGL flush (ie. a flush of all waiting webGL commands)
   */
  flushFramebuffer() {
    this._gl.flush();
  }
  /**
   * Unbind the current render target and bind the default framebuffer
   */
  restoreDefaultFramebuffer() {
    if (this._currentRenderTarget) {
      this.unBindFramebuffer(this._currentRenderTarget);
    } else {
      this._bindUnboundFramebuffer(null);
    }
    if (this._cachedViewport) {
      this.setViewport(this._cachedViewport);
    }
    this.wipeCaches();
  }
  // VBOs
  /** @internal */
  _resetVertexBufferBinding() {
    this.bindArrayBuffer(null);
    this._cachedVertexBuffers = null;
  }
  /**
   * Creates a vertex buffer
   * @param data the data or size for the vertex buffer
   * @param _updatable whether the buffer should be created as updatable
   * @param _label defines the label of the buffer (for debug purpose)
   * @returns the new WebGL static buffer
   */
  createVertexBuffer(data, _updatable, _label) {
    return this._createVertexBuffer(data, this._gl.STATIC_DRAW);
  }
  _createVertexBuffer(data, usage) {
    const vbo = this._gl.createBuffer();
    if (!vbo) {
      throw new Error("Unable to create vertex buffer");
    }
    const dataBuffer = new WebGLDataBuffer(vbo);
    this.bindArrayBuffer(dataBuffer);
    if (typeof data !== "number") {
      if (data instanceof Array) {
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(data), usage);
        dataBuffer.capacity = data.length * 4;
      } else {
        this._gl.bufferData(this._gl.ARRAY_BUFFER, data, usage);
        dataBuffer.capacity = data.byteLength;
      }
    } else {
      this._gl.bufferData(this._gl.ARRAY_BUFFER, new Uint8Array(data), usage);
      dataBuffer.capacity = data;
    }
    this._resetVertexBufferBinding();
    dataBuffer.references = 1;
    return dataBuffer;
  }
  /**
   * Creates a dynamic vertex buffer
   * @param data the data for the dynamic vertex buffer
   * @param _label defines the label of the buffer (for debug purpose)
   * @returns the new WebGL dynamic buffer
   */
  createDynamicVertexBuffer(data, _label) {
    return this._createVertexBuffer(data, this._gl.DYNAMIC_DRAW);
  }
  _resetIndexBufferBinding() {
    this.bindIndexBuffer(null);
    this._cachedIndexBuffer = null;
  }
  /**
   * Creates a new index buffer
   * @param indices defines the content of the index buffer
   * @param updatable defines if the index buffer must be updatable
   * @param _label defines the label of the buffer (for debug purpose)
   * @returns a new webGL buffer
   */
  createIndexBuffer(indices, updatable, _label) {
    const vbo = this._gl.createBuffer();
    const dataBuffer = new WebGLDataBuffer(vbo);
    if (!vbo) {
      throw new Error("Unable to create index buffer");
    }
    this.bindIndexBuffer(dataBuffer);
    const data = this._normalizeIndexData(indices);
    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, data, updatable ? this._gl.DYNAMIC_DRAW : this._gl.STATIC_DRAW);
    this._resetIndexBufferBinding();
    dataBuffer.references = 1;
    dataBuffer.is32Bits = data.BYTES_PER_ELEMENT === 4;
    return dataBuffer;
  }
  _normalizeIndexData(indices) {
    const bytesPerElement = indices.BYTES_PER_ELEMENT;
    if (bytesPerElement === 2) {
      return indices;
    }
    if (this._caps.uintIndices) {
      if (indices instanceof Uint32Array) {
        return indices;
      } else {
        for (let index = 0; index < indices.length; index++) {
          if (indices[index] >= 65535) {
            return new Uint32Array(indices);
          }
        }
        return new Uint16Array(indices);
      }
    }
    return new Uint16Array(indices);
  }
  /**
   * Bind a webGL buffer to the webGL context
   * @param buffer defines the buffer to bind
   */
  bindArrayBuffer(buffer) {
    if (!this._vaoRecordInProgress) {
      this._unbindVertexArrayObject();
    }
    this._bindBuffer(buffer, this._gl.ARRAY_BUFFER);
  }
  /**
   * Bind a specific block at a given index in a specific shader program
   * @param pipelineContext defines the pipeline context to use
   * @param blockName defines the block name
   * @param index defines the index where to bind the block
   */
  bindUniformBlock(pipelineContext, blockName, index) {
    const program = pipelineContext.program;
    const uniformLocation = this._gl.getUniformBlockIndex(program, blockName);
    this._gl.uniformBlockBinding(program, uniformLocation, index);
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  bindIndexBuffer(buffer) {
    if (!this._vaoRecordInProgress) {
      this._unbindVertexArrayObject();
    }
    this._bindBuffer(buffer, this._gl.ELEMENT_ARRAY_BUFFER);
  }
  _bindBuffer(buffer, target) {
    if (this._vaoRecordInProgress || this._currentBoundBuffer[target] !== buffer) {
      this._gl.bindBuffer(target, buffer ? buffer.underlyingResource : null);
      this._currentBoundBuffer[target] = buffer;
    }
  }
  /**
   * update the bound buffer with the given data
   * @param data defines the data to update
   */
  updateArrayBuffer(data) {
    this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, data);
  }
  _vertexAttribPointer(buffer, indx, size, type, normalized, stride, offset) {
    const pointer = this._currentBufferPointers[indx];
    if (!pointer) {
      return;
    }
    let changed = false;
    if (!pointer.active) {
      changed = true;
      pointer.active = true;
      pointer.index = indx;
      pointer.size = size;
      pointer.type = type;
      pointer.normalized = normalized;
      pointer.stride = stride;
      pointer.offset = offset;
      pointer.buffer = buffer;
    } else {
      if (pointer.buffer !== buffer) {
        pointer.buffer = buffer;
        changed = true;
      }
      if (pointer.size !== size) {
        pointer.size = size;
        changed = true;
      }
      if (pointer.type !== type) {
        pointer.type = type;
        changed = true;
      }
      if (pointer.normalized !== normalized) {
        pointer.normalized = normalized;
        changed = true;
      }
      if (pointer.stride !== stride) {
        pointer.stride = stride;
        changed = true;
      }
      if (pointer.offset !== offset) {
        pointer.offset = offset;
        changed = true;
      }
    }
    if (changed || this._vaoRecordInProgress) {
      this.bindArrayBuffer(buffer);
      if (type === this._gl.UNSIGNED_INT || type === this._gl.INT) {
        this._gl.vertexAttribIPointer(indx, size, type, stride, offset);
      } else {
        this._gl.vertexAttribPointer(indx, size, type, normalized, stride, offset);
      }
    }
  }
  /**
   * @internal
   */
  _bindIndexBufferWithCache(indexBuffer) {
    if (indexBuffer == null) {
      return;
    }
    if (this._cachedIndexBuffer !== indexBuffer) {
      this._cachedIndexBuffer = indexBuffer;
      this.bindIndexBuffer(indexBuffer);
      this._uintIndicesCurrentlySet = indexBuffer.is32Bits;
    }
  }
  _bindVertexBuffersAttributes(vertexBuffers, effect, overrideVertexBuffers) {
    const attributes = effect.getAttributesNames();
    if (!this._vaoRecordInProgress) {
      this._unbindVertexArrayObject();
    }
    this.unbindAllAttributes();
    for (let index = 0; index < attributes.length; index++) {
      const order = effect.getAttributeLocation(index);
      if (order >= 0) {
        const ai = attributes[index];
        let vertexBuffer = null;
        if (overrideVertexBuffers) {
          vertexBuffer = overrideVertexBuffers[ai];
        }
        if (!vertexBuffer) {
          vertexBuffer = vertexBuffers[ai];
        }
        if (!vertexBuffer) {
          continue;
        }
        this._gl.enableVertexAttribArray(order);
        if (!this._vaoRecordInProgress) {
          this._vertexAttribArraysEnabled[order] = true;
        }
        const buffer = vertexBuffer.getBuffer();
        if (buffer) {
          this._vertexAttribPointer(buffer, order, vertexBuffer.getSize(), vertexBuffer.type, vertexBuffer.normalized, vertexBuffer.byteStride, vertexBuffer.byteOffset);
          if (vertexBuffer.getIsInstanced()) {
            this._gl.vertexAttribDivisor(order, vertexBuffer.getInstanceDivisor());
            if (!this._vaoRecordInProgress) {
              this._currentInstanceLocations.push(order);
              this._currentInstanceBuffers.push(buffer);
            }
          }
        }
      }
    }
  }
  /**
   * Records a vertex array object
   * @see https://doc.babylonjs.com/setup/support/webGL2#vertex-array-objects
   * @param vertexBuffers defines the list of vertex buffers to store
   * @param indexBuffer defines the index buffer to store
   * @param effect defines the effect to store
   * @param overrideVertexBuffers defines optional list of avertex buffers that overrides the entries in vertexBuffers
   * @returns the new vertex array object
   */
  recordVertexArrayObject(vertexBuffers, indexBuffer, effect, overrideVertexBuffers) {
    const vao = this._gl.createVertexArray();
    if (!vao) {
      throw new Error("Unable to create VAO");
    }
    this._vaoRecordInProgress = true;
    this._gl.bindVertexArray(vao);
    this._mustWipeVertexAttributes = true;
    this._bindVertexBuffersAttributes(vertexBuffers, effect, overrideVertexBuffers);
    this.bindIndexBuffer(indexBuffer);
    this._vaoRecordInProgress = false;
    this._gl.bindVertexArray(null);
    return vao;
  }
  /**
   * Bind a specific vertex array object
   * @see https://doc.babylonjs.com/setup/support/webGL2#vertex-array-objects
   * @param vertexArrayObject defines the vertex array object to bind
   * @param indexBuffer defines the index buffer to bind
   */
  bindVertexArrayObject(vertexArrayObject, indexBuffer) {
    if (this._cachedVertexArrayObject !== vertexArrayObject) {
      this._cachedVertexArrayObject = vertexArrayObject;
      this._gl.bindVertexArray(vertexArrayObject);
      this._cachedVertexBuffers = null;
      this._cachedIndexBuffer = null;
      this._uintIndicesCurrentlySet = indexBuffer != null && indexBuffer.is32Bits;
      this._mustWipeVertexAttributes = true;
    }
  }
  /**
   * Bind webGl buffers directly to the webGL context
   * @param vertexBuffer defines the vertex buffer to bind
   * @param indexBuffer defines the index buffer to bind
   * @param vertexDeclaration defines the vertex declaration to use with the vertex buffer
   * @param vertexStrideSize defines the vertex stride of the vertex buffer
   * @param effect defines the effect associated with the vertex buffer
   */
  bindBuffersDirectly(vertexBuffer, indexBuffer, vertexDeclaration, vertexStrideSize, effect) {
    if (this._cachedVertexBuffers !== vertexBuffer || this._cachedEffectForVertexBuffers !== effect) {
      this._cachedVertexBuffers = vertexBuffer;
      this._cachedEffectForVertexBuffers = effect;
      const attributesCount = effect.getAttributesCount();
      this._unbindVertexArrayObject();
      this.unbindAllAttributes();
      let offset = 0;
      for (let index = 0; index < attributesCount; index++) {
        if (index < vertexDeclaration.length) {
          const order = effect.getAttributeLocation(index);
          if (order >= 0) {
            this._gl.enableVertexAttribArray(order);
            this._vertexAttribArraysEnabled[order] = true;
            this._vertexAttribPointer(vertexBuffer, order, vertexDeclaration[index], this._gl.FLOAT, false, vertexStrideSize, offset);
          }
          offset += vertexDeclaration[index] * 4;
        }
      }
    }
    this._bindIndexBufferWithCache(indexBuffer);
  }
  _unbindVertexArrayObject() {
    if (!this._cachedVertexArrayObject) {
      return;
    }
    this._cachedVertexArrayObject = null;
    this._gl.bindVertexArray(null);
  }
  /**
   * Bind a list of vertex buffers to the webGL context
   * @param vertexBuffers defines the list of vertex buffers to bind
   * @param indexBuffer defines the index buffer to bind
   * @param effect defines the effect associated with the vertex buffers
   * @param overrideVertexBuffers defines optional list of avertex buffers that overrides the entries in vertexBuffers
   */
  bindBuffers(vertexBuffers, indexBuffer, effect, overrideVertexBuffers) {
    if (this._cachedVertexBuffers !== vertexBuffers || this._cachedEffectForVertexBuffers !== effect) {
      this._cachedVertexBuffers = vertexBuffers;
      this._cachedEffectForVertexBuffers = effect;
      this._bindVertexBuffersAttributes(vertexBuffers, effect, overrideVertexBuffers);
    }
    this._bindIndexBufferWithCache(indexBuffer);
  }
  /**
   * Unbind all instance attributes
   */
  unbindInstanceAttributes() {
    let boundBuffer;
    for (let i = 0, ul = this._currentInstanceLocations.length; i < ul; i++) {
      const instancesBuffer = this._currentInstanceBuffers[i];
      if (boundBuffer != instancesBuffer && instancesBuffer.references) {
        boundBuffer = instancesBuffer;
        this.bindArrayBuffer(instancesBuffer);
      }
      const offsetLocation = this._currentInstanceLocations[i];
      this._gl.vertexAttribDivisor(offsetLocation, 0);
    }
    this._currentInstanceBuffers.length = 0;
    this._currentInstanceLocations.length = 0;
  }
  /**
   * Release and free the memory of a vertex array object
   * @param vao defines the vertex array object to delete
   */
  releaseVertexArrayObject(vao) {
    this._gl.deleteVertexArray(vao);
  }
  /**
   * @internal
   */
  _releaseBuffer(buffer) {
    buffer.references--;
    if (buffer.references === 0) {
      this._deleteBuffer(buffer);
      return true;
    }
    return false;
  }
  _deleteBuffer(buffer) {
    this._gl.deleteBuffer(buffer.underlyingResource);
  }
  /**
   * Update the content of a webGL buffer used with instantiation and bind it to the webGL context
   * @param instancesBuffer defines the webGL buffer to update and bind
   * @param data defines the data to store in the buffer
   * @param offsetLocations defines the offsets or attributes information used to determine where data must be stored in the buffer
   */
  updateAndBindInstancesBuffer(instancesBuffer, data, offsetLocations) {
    this.bindArrayBuffer(instancesBuffer);
    if (data) {
      this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, data);
    }
    if (offsetLocations[0].index !== void 0) {
      this.bindInstancesBuffer(instancesBuffer, offsetLocations, true);
    } else {
      for (let index = 0; index < 4; index++) {
        const offsetLocation = offsetLocations[index];
        if (!this._vertexAttribArraysEnabled[offsetLocation]) {
          this._gl.enableVertexAttribArray(offsetLocation);
          this._vertexAttribArraysEnabled[offsetLocation] = true;
        }
        this._vertexAttribPointer(instancesBuffer, offsetLocation, 4, this._gl.FLOAT, false, 64, index * 16);
        this._gl.vertexAttribDivisor(offsetLocation, 1);
        this._currentInstanceLocations.push(offsetLocation);
        this._currentInstanceBuffers.push(instancesBuffer);
      }
    }
  }
  /**
   * Bind the content of a webGL buffer used with instantiation
   * @param instancesBuffer defines the webGL buffer to bind
   * @param attributesInfo defines the offsets or attributes information used to determine where data must be stored in the buffer
   * @param computeStride defines Whether to compute the strides from the info or use the default 0
   */
  bindInstancesBuffer(instancesBuffer, attributesInfo, computeStride = true) {
    this.bindArrayBuffer(instancesBuffer);
    let stride = 0;
    if (computeStride) {
      for (let i = 0; i < attributesInfo.length; i++) {
        const ai = attributesInfo[i];
        stride += ai.attributeSize * 4;
      }
    }
    for (let i = 0; i < attributesInfo.length; i++) {
      const ai = attributesInfo[i];
      if (ai.index === void 0) {
        ai.index = this._currentEffect.getAttributeLocationByName(ai.attributeName);
      }
      if (ai.index < 0) {
        continue;
      }
      if (!this._vertexAttribArraysEnabled[ai.index]) {
        this._gl.enableVertexAttribArray(ai.index);
        this._vertexAttribArraysEnabled[ai.index] = true;
      }
      this._vertexAttribPointer(instancesBuffer, ai.index, ai.attributeSize, ai.attributeType || this._gl.FLOAT, ai.normalized || false, stride, ai.offset);
      this._gl.vertexAttribDivisor(ai.index, ai.divisor === void 0 ? 1 : ai.divisor);
      this._currentInstanceLocations.push(ai.index);
      this._currentInstanceBuffers.push(instancesBuffer);
    }
  }
  /**
   * Disable the instance attribute corresponding to the name in parameter
   * @param name defines the name of the attribute to disable
   */
  disableInstanceAttributeByName(name2) {
    if (!this._currentEffect) {
      return;
    }
    const attributeLocation = this._currentEffect.getAttributeLocationByName(name2);
    this.disableInstanceAttribute(attributeLocation);
  }
  /**
   * Disable the instance attribute corresponding to the location in parameter
   * @param attributeLocation defines the attribute location of the attribute to disable
   */
  disableInstanceAttribute(attributeLocation) {
    let shouldClean = false;
    let index;
    while ((index = this._currentInstanceLocations.indexOf(attributeLocation)) !== -1) {
      this._currentInstanceLocations.splice(index, 1);
      this._currentInstanceBuffers.splice(index, 1);
      shouldClean = true;
      index = this._currentInstanceLocations.indexOf(attributeLocation);
    }
    if (shouldClean) {
      this._gl.vertexAttribDivisor(attributeLocation, 0);
      this.disableAttributeByIndex(attributeLocation);
    }
  }
  /**
   * Disable the attribute corresponding to the location in parameter
   * @param attributeLocation defines the attribute location of the attribute to disable
   */
  disableAttributeByIndex(attributeLocation) {
    this._gl.disableVertexAttribArray(attributeLocation);
    this._vertexAttribArraysEnabled[attributeLocation] = false;
    this._currentBufferPointers[attributeLocation].active = false;
  }
  /**
   * Send a draw order
   * @param useTriangles defines if triangles must be used to draw (else wireframe will be used)
   * @param indexStart defines the starting index
   * @param indexCount defines the number of index to draw
   * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
   */
  draw(useTriangles, indexStart, indexCount, instancesCount) {
    this.drawElementsType(useTriangles ? 0 : 1, indexStart, indexCount, instancesCount);
  }
  /**
   * Draw a list of points
   * @param verticesStart defines the index of first vertex to draw
   * @param verticesCount defines the count of vertices to draw
   * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
   */
  drawPointClouds(verticesStart, verticesCount, instancesCount) {
    this.drawArraysType(2, verticesStart, verticesCount, instancesCount);
  }
  /**
   * Draw a list of unindexed primitives
   * @param useTriangles defines if triangles must be used to draw (else wireframe will be used)
   * @param verticesStart defines the index of first vertex to draw
   * @param verticesCount defines the count of vertices to draw
   * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
   */
  drawUnIndexed(useTriangles, verticesStart, verticesCount, instancesCount) {
    this.drawArraysType(useTriangles ? 0 : 1, verticesStart, verticesCount, instancesCount);
  }
  /**
   * Draw a list of indexed primitives
   * @param fillMode defines the primitive to use
   * @param indexStart defines the starting index
   * @param indexCount defines the number of index to draw
   * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
   */
  drawElementsType(fillMode, indexStart, indexCount, instancesCount) {
    this.applyStates();
    this._reportDrawCall();
    const drawMode = this._drawMode(fillMode);
    const indexFormat = this._uintIndicesCurrentlySet ? this._gl.UNSIGNED_INT : this._gl.UNSIGNED_SHORT;
    const mult = this._uintIndicesCurrentlySet ? 4 : 2;
    if (instancesCount) {
      this._gl.drawElementsInstanced(drawMode, indexCount, indexFormat, indexStart * mult, instancesCount);
    } else {
      this._gl.drawElements(drawMode, indexCount, indexFormat, indexStart * mult);
    }
  }
  /**
   * Draw a list of unindexed primitives
   * @param fillMode defines the primitive to use
   * @param verticesStart defines the index of first vertex to draw
   * @param verticesCount defines the count of vertices to draw
   * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
   */
  drawArraysType(fillMode, verticesStart, verticesCount, instancesCount) {
    this.applyStates();
    this._reportDrawCall();
    const drawMode = this._drawMode(fillMode);
    if (instancesCount) {
      this._gl.drawArraysInstanced(drawMode, verticesStart, verticesCount, instancesCount);
    } else {
      this._gl.drawArrays(drawMode, verticesStart, verticesCount);
    }
  }
  _drawMode(fillMode) {
    switch (fillMode) {
      case 0:
        return this._gl.TRIANGLES;
      case 2:
        return this._gl.POINTS;
      case 1:
        return this._gl.LINES;
      case 3:
        return this._gl.POINTS;
      case 4:
        return this._gl.LINES;
      case 5:
        return this._gl.LINE_LOOP;
      case 6:
        return this._gl.LINE_STRIP;
      case 7:
        return this._gl.TRIANGLE_STRIP;
      case 8:
        return this._gl.TRIANGLE_FAN;
      default:
        return this._gl.TRIANGLES;
    }
  }
  // Shaders
  /**
   * @internal
   */
  _releaseEffect(effect) {
    if (this._compiledEffects[effect._key]) {
      delete this._compiledEffects[effect._key];
    }
    const pipelineContext = effect.getPipelineContext();
    if (pipelineContext) {
      this._deletePipelineContext(pipelineContext);
    }
  }
  /**
   * @internal
   */
  _deletePipelineContext(pipelineContext) {
    const webGLPipelineContext = pipelineContext;
    if (webGLPipelineContext && webGLPipelineContext.program) {
      webGLPipelineContext.program.__SPECTOR_rebuildProgram = null;
      resetCachedPipeline(webGLPipelineContext);
      this._gl.deleteProgram(webGLPipelineContext.program);
    }
  }
  /**
   * @internal
   */
  _getGlobalDefines(defines) {
    return _getGlobalDefines(defines, this.isNDCHalfZRange, this.useReverseDepthBuffer, this.useExactSrgbConversions);
  }
  /**
   * Create a new effect (used to store vertex/fragment shaders)
   * @param baseName defines the base name of the effect (The name of file without .fragment.fx or .vertex.fx)
   * @param attributesNamesOrOptions defines either a list of attribute names or an IEffectCreationOptions object
   * @param uniformsNamesOrEngine defines either a list of uniform names or the engine to use
   * @param samplers defines an array of string used to represent textures
   * @param defines defines the string containing the defines to use to compile the shaders
   * @param fallbacks defines the list of potential fallbacks to use if shader compilation fails
   * @param onCompiled defines a function to call when the effect creation is successful
   * @param onError defines a function to call when the effect creation has failed
   * @param indexParameters defines an object containing the index values to use to compile shaders (like the maximum number of simultaneous lights)
   * @param shaderLanguage the language the shader is written in (default: GLSL)
   * @returns the new Effect
   */
  createEffect(baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers, defines, fallbacks, onCompiled, onError, indexParameters, shaderLanguage = 0) {
    const vertex = typeof baseName === "string" ? baseName : baseName.vertexToken || baseName.vertexSource || baseName.vertexElement || baseName.vertex;
    const fragment = typeof baseName === "string" ? baseName : baseName.fragmentToken || baseName.fragmentSource || baseName.fragmentElement || baseName.fragment;
    const globalDefines = this._getGlobalDefines();
    let fullDefines = defines ?? attributesNamesOrOptions.defines ?? "";
    if (globalDefines) {
      fullDefines += globalDefines;
    }
    const name2 = vertex + "+" + fragment + "@" + fullDefines;
    if (this._compiledEffects[name2]) {
      const compiledEffect = this._compiledEffects[name2];
      if (onCompiled && compiledEffect.isReady()) {
        onCompiled(compiledEffect);
      }
      return compiledEffect;
    }
    if (this._gl) {
      getStateObject(this._gl);
    }
    const effect = new Effect(baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers, this, defines, fallbacks, onCompiled, onError, indexParameters, name2, attributesNamesOrOptions.shaderLanguage ?? shaderLanguage);
    this._compiledEffects[name2] = effect;
    return effect;
  }
  /**
   * @internal
   */
  _getShaderSource(shader2) {
    return this._gl.getShaderSource(shader2);
  }
  /**
   * Directly creates a webGL program
   * @param pipelineContext  defines the pipeline context to attach to
   * @param vertexCode defines the vertex shader code to use
   * @param fragmentCode defines the fragment shader code to use
   * @param context defines the webGL context to use (if not set, the current one will be used)
   * @param transformFeedbackVaryings defines the list of transform feedback varyings to use
   * @returns the new webGL program
   */
  createRawShaderProgram(pipelineContext, vertexCode, fragmentCode, context, transformFeedbackVaryings = null) {
    const stateObject = getStateObject(this._gl);
    stateObject._contextWasLost = this._contextWasLost;
    stateObject.validateShaderPrograms = this.validateShaderPrograms;
    return createRawShaderProgram(pipelineContext, vertexCode, fragmentCode, context || this._gl, transformFeedbackVaryings);
  }
  /**
   * Creates a webGL program
   * @param pipelineContext  defines the pipeline context to attach to
   * @param vertexCode  defines the vertex shader code to use
   * @param fragmentCode defines the fragment shader code to use
   * @param defines defines the string containing the defines to use to compile the shaders
   * @param context defines the webGL context to use (if not set, the current one will be used)
   * @param transformFeedbackVaryings defines the list of transform feedback varyings to use
   * @returns the new webGL program
   */
  createShaderProgram(pipelineContext, vertexCode, fragmentCode, defines, context, transformFeedbackVaryings = null) {
    const stateObject = getStateObject(this._gl);
    stateObject._contextWasLost = this._contextWasLost;
    stateObject.validateShaderPrograms = this.validateShaderPrograms;
    return createShaderProgram(pipelineContext, vertexCode, fragmentCode, defines, context || this._gl, transformFeedbackVaryings);
  }
  /**
   * Inline functions in shader code that are marked to be inlined
   * @param code code to inline
   * @returns inlined code
   */
  inlineShaderCode(code) {
    return code;
  }
  /**
   * Creates a new pipeline context
   * @param shaderProcessingContext defines the shader processing context used during the processing if available
   * @returns the new pipeline
   */
  createPipelineContext(shaderProcessingContext) {
    if (this._gl) {
      const stateObject = getStateObject(this._gl);
      stateObject.parallelShaderCompile = this._caps.parallelShaderCompile;
    }
    const context = createPipelineContext(this._gl, shaderProcessingContext);
    context.engine = this;
    return context;
  }
  /**
   * Creates a new material context
   * @returns the new context
   */
  createMaterialContext() {
    return void 0;
  }
  /**
   * Creates a new draw context
   * @returns the new context
   */
  createDrawContext() {
    return void 0;
  }
  _finalizePipelineContext(pipelineContext) {
    return _finalizePipelineContext(pipelineContext, this._gl, this.validateShaderPrograms);
  }
  /**
   * @internal
   */
  _preparePipelineContext(pipelineContext, vertexSourceCode, fragmentSourceCode, createAsRaw, rawVertexSourceCode, rawFragmentSourceCode, rebuildRebind, defines, transformFeedbackVaryings, key, onReady) {
    const stateObject = getStateObject(this._gl);
    stateObject._contextWasLost = this._contextWasLost;
    stateObject.validateShaderPrograms = this.validateShaderPrograms;
    stateObject._createShaderProgramInjection = this._createShaderProgram.bind(this);
    stateObject.createRawShaderProgramInjection = this.createRawShaderProgram.bind(this);
    stateObject.createShaderProgramInjection = this.createShaderProgram.bind(this);
    stateObject.loadFileInjection = this._loadFile.bind(this);
    return _preparePipelineContext(pipelineContext, vertexSourceCode, fragmentSourceCode, createAsRaw, rawVertexSourceCode, rawFragmentSourceCode, rebuildRebind, defines, transformFeedbackVaryings, key, onReady);
  }
  _createShaderProgram(pipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings = null) {
    return _createShaderProgram(pipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings);
  }
  /**
   * @internal
   */
  _isRenderingStateCompiled(pipelineContext) {
    const webGLPipelineContext = pipelineContext;
    if (this._isDisposed || webGLPipelineContext._isDisposed) {
      return false;
    }
    if (this._gl.getProgramParameter(webGLPipelineContext.program, this._caps.parallelShaderCompile.COMPLETION_STATUS_KHR)) {
      this._finalizePipelineContext(webGLPipelineContext);
      return true;
    }
    return false;
  }
  /**
   * @internal
   */
  _executeWhenRenderingStateIsCompiled(pipelineContext, action) {
    _executeWhenRenderingStateIsCompiled(pipelineContext, action);
  }
  /**
   * Gets the list of webGL uniform locations associated with a specific program based on a list of uniform names
   * @param pipelineContext defines the pipeline context to use
   * @param uniformsNames defines the list of uniform names
   * @returns an array of webGL uniform locations
   */
  getUniforms(pipelineContext, uniformsNames) {
    const results = new Array();
    const webGLPipelineContext = pipelineContext;
    for (let index = 0; index < uniformsNames.length; index++) {
      results.push(this._gl.getUniformLocation(webGLPipelineContext.program, uniformsNames[index]));
    }
    return results;
  }
  /**
   * Gets the list of active attributes for a given webGL program
   * @param pipelineContext defines the pipeline context to use
   * @param attributesNames defines the list of attribute names to get
   * @returns an array of indices indicating the offset of each attribute
   */
  getAttributes(pipelineContext, attributesNames) {
    const results = [];
    const webGLPipelineContext = pipelineContext;
    for (let index = 0; index < attributesNames.length; index++) {
      try {
        results.push(this._gl.getAttribLocation(webGLPipelineContext.program, attributesNames[index]));
      } catch (e) {
        results.push(-1);
      }
    }
    return results;
  }
  /**
   * Activates an effect, making it the current one (ie. the one used for rendering)
   * @param effect defines the effect to activate
   */
  enableEffect(effect) {
    effect = effect !== null && IsWrapper(effect) ? effect.effect : effect;
    if (!effect || effect === this._currentEffect) {
      return;
    }
    this._stencilStateComposer.stencilMaterial = void 0;
    effect = effect;
    this.bindSamplers(effect);
    this._currentEffect = effect;
    if (effect.onBind) {
      effect.onBind(effect);
    }
    if (effect._onBindObservable) {
      effect._onBindObservable.notifyObservers(effect);
    }
  }
  /**
   * Set the value of an uniform to a number (int)
   * @param uniform defines the webGL uniform location where to store the value
   * @param value defines the int number to store
   * @returns true if the value was set
   */
  setInt(uniform, value) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform1i(uniform, value);
    return true;
  }
  /**
   * Set the value of an uniform to a int2
   * @param uniform defines the webGL uniform location where to store the value
   * @param x defines the 1st component of the value
   * @param y defines the 2nd component of the value
   * @returns true if the value was set
   */
  setInt2(uniform, x, y) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform2i(uniform, x, y);
    return true;
  }
  /**
   * Set the value of an uniform to a int3
   * @param uniform defines the webGL uniform location where to store the value
   * @param x defines the 1st component of the value
   * @param y defines the 2nd component of the value
   * @param z defines the 3rd component of the value
   * @returns true if the value was set
   */
  setInt3(uniform, x, y, z) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform3i(uniform, x, y, z);
    return true;
  }
  /**
   * Set the value of an uniform to a int4
   * @param uniform defines the webGL uniform location where to store the value
   * @param x defines the 1st component of the value
   * @param y defines the 2nd component of the value
   * @param z defines the 3rd component of the value
   * @param w defines the 4th component of the value
   * @returns true if the value was set
   */
  setInt4(uniform, x, y, z, w) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform4i(uniform, x, y, z, w);
    return true;
  }
  /**
   * Set the value of an uniform to an array of int32
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of int32 to store
   * @returns true if the value was set
   */
  setIntArray(uniform, array) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform1iv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to an array of int32 (stored as vec2)
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of int32 to store
   * @returns true if the value was set
   */
  setIntArray2(uniform, array) {
    if (!uniform || array.length % 2 !== 0) {
      return false;
    }
    this._gl.uniform2iv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to an array of int32 (stored as vec3)
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of int32 to store
   * @returns true if the value was set
   */
  setIntArray3(uniform, array) {
    if (!uniform || array.length % 3 !== 0) {
      return false;
    }
    this._gl.uniform3iv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to an array of int32 (stored as vec4)
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of int32 to store
   * @returns true if the value was set
   */
  setIntArray4(uniform, array) {
    if (!uniform || array.length % 4 !== 0) {
      return false;
    }
    this._gl.uniform4iv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to a number (unsigned int)
   * @param uniform defines the webGL uniform location where to store the value
   * @param value defines the unsigned int number to store
   * @returns true if the value was set
   */
  setUInt(uniform, value) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform1ui(uniform, value);
    return true;
  }
  /**
   * Set the value of an uniform to a unsigned int2
   * @param uniform defines the webGL uniform location where to store the value
   * @param x defines the 1st component of the value
   * @param y defines the 2nd component of the value
   * @returns true if the value was set
   */
  setUInt2(uniform, x, y) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform2ui(uniform, x, y);
    return true;
  }
  /**
   * Set the value of an uniform to a unsigned int3
   * @param uniform defines the webGL uniform location where to store the value
   * @param x defines the 1st component of the value
   * @param y defines the 2nd component of the value
   * @param z defines the 3rd component of the value
   * @returns true if the value was set
   */
  setUInt3(uniform, x, y, z) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform3ui(uniform, x, y, z);
    return true;
  }
  /**
   * Set the value of an uniform to a unsigned int4
   * @param uniform defines the webGL uniform location where to store the value
   * @param x defines the 1st component of the value
   * @param y defines the 2nd component of the value
   * @param z defines the 3rd component of the value
   * @param w defines the 4th component of the value
   * @returns true if the value was set
   */
  setUInt4(uniform, x, y, z, w) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform4ui(uniform, x, y, z, w);
    return true;
  }
  /**
   * Set the value of an uniform to an array of unsigned int32
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of unsigned int32 to store
   * @returns true if the value was set
   */
  setUIntArray(uniform, array) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform1uiv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to an array of unsigned int32 (stored as vec2)
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of unsigned int32 to store
   * @returns true if the value was set
   */
  setUIntArray2(uniform, array) {
    if (!uniform || array.length % 2 !== 0) {
      return false;
    }
    this._gl.uniform2uiv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to an array of unsigned int32 (stored as vec3)
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of unsigned int32 to store
   * @returns true if the value was set
   */
  setUIntArray3(uniform, array) {
    if (!uniform || array.length % 3 !== 0) {
      return false;
    }
    this._gl.uniform3uiv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to an array of unsigned int32 (stored as vec4)
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of unsigned int32 to store
   * @returns true if the value was set
   */
  setUIntArray4(uniform, array) {
    if (!uniform || array.length % 4 !== 0) {
      return false;
    }
    this._gl.uniform4uiv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to an array of number
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of number to store
   * @returns true if the value was set
   */
  setArray(uniform, array) {
    if (!uniform) {
      return false;
    }
    if (array.length < 1) {
      return false;
    }
    this._gl.uniform1fv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to an array of number (stored as vec2)
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of number to store
   * @returns true if the value was set
   */
  setArray2(uniform, array) {
    if (!uniform || array.length % 2 !== 0) {
      return false;
    }
    this._gl.uniform2fv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to an array of number (stored as vec3)
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of number to store
   * @returns true if the value was set
   */
  setArray3(uniform, array) {
    if (!uniform || array.length % 3 !== 0) {
      return false;
    }
    this._gl.uniform3fv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to an array of number (stored as vec4)
   * @param uniform defines the webGL uniform location where to store the value
   * @param array defines the array of number to store
   * @returns true if the value was set
   */
  setArray4(uniform, array) {
    if (!uniform || array.length % 4 !== 0) {
      return false;
    }
    this._gl.uniform4fv(uniform, array);
    return true;
  }
  /**
   * Set the value of an uniform to an array of float32 (stored as matrices)
   * @param uniform defines the webGL uniform location where to store the value
   * @param matrices defines the array of float32 to store
   * @returns true if the value was set
   */
  setMatrices(uniform, matrices) {
    if (!uniform) {
      return false;
    }
    this._gl.uniformMatrix4fv(uniform, false, matrices);
    return true;
  }
  /**
   * Set the value of an uniform to a matrix (3x3)
   * @param uniform defines the webGL uniform location where to store the value
   * @param matrix defines the Float32Array representing the 3x3 matrix to store
   * @returns true if the value was set
   */
  setMatrix3x3(uniform, matrix) {
    if (!uniform) {
      return false;
    }
    this._gl.uniformMatrix3fv(uniform, false, matrix);
    return true;
  }
  /**
   * Set the value of an uniform to a matrix (2x2)
   * @param uniform defines the webGL uniform location where to store the value
   * @param matrix defines the Float32Array representing the 2x2 matrix to store
   * @returns true if the value was set
   */
  setMatrix2x2(uniform, matrix) {
    if (!uniform) {
      return false;
    }
    this._gl.uniformMatrix2fv(uniform, false, matrix);
    return true;
  }
  /**
   * Set the value of an uniform to a number (float)
   * @param uniform defines the webGL uniform location where to store the value
   * @param value defines the float number to store
   * @returns true if the value was transferred
   */
  setFloat(uniform, value) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform1f(uniform, value);
    return true;
  }
  /**
   * Set the value of an uniform to a vec2
   * @param uniform defines the webGL uniform location where to store the value
   * @param x defines the 1st component of the value
   * @param y defines the 2nd component of the value
   * @returns true if the value was set
   */
  setFloat2(uniform, x, y) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform2f(uniform, x, y);
    return true;
  }
  /**
   * Set the value of an uniform to a vec3
   * @param uniform defines the webGL uniform location where to store the value
   * @param x defines the 1st component of the value
   * @param y defines the 2nd component of the value
   * @param z defines the 3rd component of the value
   * @returns true if the value was set
   */
  setFloat3(uniform, x, y, z) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform3f(uniform, x, y, z);
    return true;
  }
  /**
   * Set the value of an uniform to a vec4
   * @param uniform defines the webGL uniform location where to store the value
   * @param x defines the 1st component of the value
   * @param y defines the 2nd component of the value
   * @param z defines the 3rd component of the value
   * @param w defines the 4th component of the value
   * @returns true if the value was set
   */
  setFloat4(uniform, x, y, z, w) {
    if (!uniform) {
      return false;
    }
    this._gl.uniform4f(uniform, x, y, z, w);
    return true;
  }
  // States
  /**
   * Apply all cached states (depth, culling, stencil and alpha)
   */
  applyStates() {
    this._depthCullingState.apply(this._gl);
    this._stencilStateComposer.apply(this._gl);
    this._alphaState.apply(this._gl);
    if (this._colorWriteChanged) {
      this._colorWriteChanged = false;
      const enable = this._colorWrite;
      this._gl.colorMask(enable, enable, enable, enable);
    }
  }
  // Textures
  /**
   * Force the entire cache to be cleared
   * You should not have to use this function unless your engine needs to share the webGL context with another engine
   * @param bruteForce defines a boolean to force clearing ALL caches (including stencil, detoh and alpha states)
   */
  wipeCaches(bruteForce) {
    if (this.preventCacheWipeBetweenFrames && !bruteForce) {
      return;
    }
    this._currentEffect = null;
    this._viewportCached.x = 0;
    this._viewportCached.y = 0;
    this._viewportCached.z = 0;
    this._viewportCached.w = 0;
    this._unbindVertexArrayObject();
    if (bruteForce) {
      this._currentProgram = null;
      this.resetTextureCache();
      this._stencilStateComposer.reset();
      this._depthCullingState.reset();
      this._depthCullingState.depthFunc = this._gl.LEQUAL;
      this._alphaState.reset();
      this._alphaMode = 1;
      this._alphaEquation = 0;
      this._colorWrite = true;
      this._colorWriteChanged = true;
      this._unpackFlipYCached = null;
      this._gl.pixelStorei(this._gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, this._gl.NONE);
      this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
      this._mustWipeVertexAttributes = true;
      this.unbindAllAttributes();
    }
    this._resetVertexBufferBinding();
    this._cachedIndexBuffer = null;
    this._cachedEffectForVertexBuffers = null;
    this.bindIndexBuffer(null);
  }
  /**
   * @internal
   */
  _getSamplingParameters(samplingMode, generateMipMaps) {
    const gl = this._gl;
    let magFilter = gl.NEAREST;
    let minFilter = gl.NEAREST;
    switch (samplingMode) {
      case 11:
        magFilter = gl.LINEAR;
        if (generateMipMaps) {
          minFilter = gl.LINEAR_MIPMAP_NEAREST;
        } else {
          minFilter = gl.LINEAR;
        }
        break;
      case 3:
        magFilter = gl.LINEAR;
        if (generateMipMaps) {
          minFilter = gl.LINEAR_MIPMAP_LINEAR;
        } else {
          minFilter = gl.LINEAR;
        }
        break;
      case 8:
        magFilter = gl.NEAREST;
        if (generateMipMaps) {
          minFilter = gl.NEAREST_MIPMAP_LINEAR;
        } else {
          minFilter = gl.NEAREST;
        }
        break;
      case 4:
        magFilter = gl.NEAREST;
        if (generateMipMaps) {
          minFilter = gl.NEAREST_MIPMAP_NEAREST;
        } else {
          minFilter = gl.NEAREST;
        }
        break;
      case 5:
        magFilter = gl.NEAREST;
        if (generateMipMaps) {
          minFilter = gl.LINEAR_MIPMAP_NEAREST;
        } else {
          minFilter = gl.LINEAR;
        }
        break;
      case 6:
        magFilter = gl.NEAREST;
        if (generateMipMaps) {
          minFilter = gl.LINEAR_MIPMAP_LINEAR;
        } else {
          minFilter = gl.LINEAR;
        }
        break;
      case 7:
        magFilter = gl.NEAREST;
        minFilter = gl.LINEAR;
        break;
      case 1:
        magFilter = gl.NEAREST;
        minFilter = gl.NEAREST;
        break;
      case 9:
        magFilter = gl.LINEAR;
        if (generateMipMaps) {
          minFilter = gl.NEAREST_MIPMAP_NEAREST;
        } else {
          minFilter = gl.NEAREST;
        }
        break;
      case 10:
        magFilter = gl.LINEAR;
        if (generateMipMaps) {
          minFilter = gl.NEAREST_MIPMAP_LINEAR;
        } else {
          minFilter = gl.NEAREST;
        }
        break;
      case 2:
        magFilter = gl.LINEAR;
        minFilter = gl.LINEAR;
        break;
      case 12:
        magFilter = gl.LINEAR;
        minFilter = gl.NEAREST;
        break;
    }
    return {
      min: minFilter,
      mag: magFilter
    };
  }
  /** @internal */
  _createTexture() {
    const texture = this._gl.createTexture();
    if (!texture) {
      throw new Error("Unable to create texture");
    }
    return texture;
  }
  /** @internal */
  _createHardwareTexture() {
    return new WebGLHardwareTexture(this._createTexture(), this._gl);
  }
  /**
   * Creates an internal texture without binding it to a framebuffer
   * @internal
   * @param size defines the size of the texture
   * @param options defines the options used to create the texture
   * @param delayGPUTextureCreation true to delay the texture creation the first time it is really needed. false to create it right away
   * @param source source type of the texture
   * @returns a new internal texture
   */
  _createInternalTexture(size, options, delayGPUTextureCreation = true, source = 0) {
    let generateMipMaps = false;
    let type = 0;
    let samplingMode = 3;
    let format = 5;
    let useSRGBBuffer = false;
    let samples = 1;
    let label;
    if (options !== void 0 && typeof options === "object") {
      generateMipMaps = !!options.generateMipMaps;
      type = options.type === void 0 ? 0 : options.type;
      samplingMode = options.samplingMode === void 0 ? 3 : options.samplingMode;
      format = options.format === void 0 ? 5 : options.format;
      useSRGBBuffer = options.useSRGBBuffer === void 0 ? false : options.useSRGBBuffer;
      samples = options.samples ?? 1;
      label = options.label;
    } else {
      generateMipMaps = !!options;
    }
    useSRGBBuffer && (useSRGBBuffer = this._caps.supportSRGBBuffers && (this.webGLVersion > 1 || this.isWebGPU));
    if (type === 1 && !this._caps.textureFloatLinearFiltering) {
      samplingMode = 1;
    } else if (type === 2 && !this._caps.textureHalfFloatLinearFiltering) {
      samplingMode = 1;
    }
    if (type === 1 && !this._caps.textureFloat) {
      type = 0;
      Logger.Warn("Float textures are not supported. Type forced to TEXTURETYPE_UNSIGNED_BYTE");
    }
    const gl = this._gl;
    const texture = new InternalTexture(this, source);
    const width = size.width || size;
    const height = size.height || size;
    const depth = size.depth || 0;
    const layers = size.layers || 0;
    const filters = this._getSamplingParameters(samplingMode, generateMipMaps);
    const target = layers !== 0 ? gl.TEXTURE_2D_ARRAY : depth !== 0 ? gl.TEXTURE_3D : gl.TEXTURE_2D;
    const sizedFormat = this._getRGBABufferInternalSizedFormat(type, format, useSRGBBuffer);
    const internalFormat = this._getInternalFormat(format);
    const textureType = this._getWebGLTextureType(type);
    this._bindTextureDirectly(target, texture);
    if (layers !== 0) {
      texture.is2DArray = true;
      gl.texImage3D(target, 0, sizedFormat, width, height, layers, 0, internalFormat, textureType, null);
    } else if (depth !== 0) {
      texture.is3D = true;
      gl.texImage3D(target, 0, sizedFormat, width, height, depth, 0, internalFormat, textureType, null);
    } else {
      gl.texImage2D(target, 0, sizedFormat, width, height, 0, internalFormat, textureType, null);
    }
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, filters.mag);
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, filters.min);
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (generateMipMaps) {
      this._gl.generateMipmap(target);
    }
    this._bindTextureDirectly(target, null);
    texture._useSRGBBuffer = useSRGBBuffer;
    texture.baseWidth = width;
    texture.baseHeight = height;
    texture.width = width;
    texture.height = height;
    texture.depth = layers;
    texture.isReady = true;
    texture.samples = samples;
    texture.generateMipMaps = generateMipMaps;
    texture.samplingMode = samplingMode;
    texture.type = type;
    texture.format = format;
    texture.label = label;
    this._internalTexturesCache.push(texture);
    return texture;
  }
  /**
   * @internal
   */
  _getUseSRGBBuffer(useSRGBBuffer, noMipmap) {
    return useSRGBBuffer && this._caps.supportSRGBBuffers && (this.webGLVersion > 1 || noMipmap);
  }
  /**
   * Usually called from Texture.ts.
   * Passed information to create a WebGLTexture
   * @param url defines a value which contains one of the following:
   * * A conventional http URL, e.g. 'http://...' or 'file://...'
   * * A base64 string of in-line texture data, e.g. 'data:image/jpg;base64,/...'
   * * An indicator that data being passed using the buffer parameter, e.g. 'data:mytexture.jpg'
   * @param noMipmap defines a boolean indicating that no mipmaps shall be generated.  Ignored for compressed textures.  They must be in the file
   * @param invertY when true, image is flipped when loaded.  You probably want true. Certain compressed textures may invert this if their default is inverted (eg. ktx)
   * @param scene needed for loading to the correct scene
   * @param samplingMode mode with should be used sample / access the texture (Default: Texture.TRILINEAR_SAMPLINGMODE)
   * @param onLoad optional callback to be called upon successful completion
   * @param onError optional callback to be called upon failure
   * @param buffer a source of a file previously fetched as either a base64 string, an ArrayBuffer (compressed or image format), HTMLImageElement (image format), or a Blob
   * @param fallback an internal argument in case the function must be called again, due to etc1 not having alpha capabilities
   * @param format internal format.  Default: RGB when extension is '.jpg' else RGBA.  Ignored for compressed textures
   * @param forcedExtension defines the extension to use to pick the right loader
   * @param mimeType defines an optional mime type
   * @param loaderOptions options to be passed to the loader
   * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
   * @param useSRGBBuffer defines if the texture must be loaded in a sRGB GPU buffer (if supported by the GPU).
   * @returns a InternalTexture for assignment back into BABYLON.Texture
   */
  createTexture(url, noMipmap, invertY, scene, samplingMode = 3, onLoad = null, onError = null, buffer = null, fallback = null, format = null, forcedExtension = null, mimeType, loaderOptions, creationFlags, useSRGBBuffer) {
    return this._createTextureBase(url, noMipmap, invertY, scene, samplingMode, onLoad, onError, (...args) => this._prepareWebGLTexture(...args, format), (potWidth, potHeight, img, extension, texture, continuationCallback) => {
      const gl = this._gl;
      const isPot = img.width === potWidth && img.height === potHeight;
      texture._creationFlags = creationFlags ?? 0;
      const tip = this._getTexImageParametersForCreateTexture(texture.format, texture._useSRGBBuffer);
      if (isPot) {
        gl.texImage2D(gl.TEXTURE_2D, 0, tip.internalFormat, tip.format, tip.type, img);
        return false;
      }
      const maxTextureSize = this._caps.maxTextureSize;
      if (img.width > maxTextureSize || img.height > maxTextureSize || !this._supportsHardwareTextureRescaling) {
        this._prepareWorkingCanvas();
        if (!this._workingCanvas || !this._workingContext) {
          return false;
        }
        this._workingCanvas.width = potWidth;
        this._workingCanvas.height = potHeight;
        this._workingContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, potWidth, potHeight);
        gl.texImage2D(gl.TEXTURE_2D, 0, tip.internalFormat, tip.format, tip.type, this._workingCanvas);
        texture.width = potWidth;
        texture.height = potHeight;
        return false;
      } else {
        const source = new InternalTexture(
          this,
          2
          /* InternalTextureSource.Temp */
        );
        this._bindTextureDirectly(gl.TEXTURE_2D, source, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, tip.internalFormat, tip.format, tip.type, img);
        this._rescaleTexture(source, texture, scene, tip.format, () => {
          this._releaseTexture(source);
          this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
          continuationCallback();
        });
      }
      return true;
    }, buffer, fallback, format, forcedExtension, mimeType, loaderOptions, useSRGBBuffer);
  }
  /**
   * Calls to the GL texImage2D and texImage3D functions require three arguments describing the pixel format of the texture.
   * createTexture derives these from the babylonFormat and useSRGBBuffer arguments and also the file extension of the URL it's working with.
   * This function encapsulates that derivation for easy unit testing.
   * @param babylonFormat Babylon's format enum, as specified in ITextureCreationOptions.
   * @param fileExtension The file extension including the dot, e.g. .jpg.
   * @param useSRGBBuffer Use SRGB not linear.
   * @returns The options to pass to texImage2D or texImage3D calls.
   * @internal
   */
  _getTexImageParametersForCreateTexture(babylonFormat, useSRGBBuffer) {
    let format, internalFormat;
    if (this.webGLVersion === 1) {
      format = this._getInternalFormat(babylonFormat, useSRGBBuffer);
      internalFormat = format;
    } else {
      format = this._getInternalFormat(babylonFormat, false);
      internalFormat = this._getRGBABufferInternalSizedFormat(0, babylonFormat, useSRGBBuffer);
    }
    return {
      internalFormat,
      format,
      type: this._gl.UNSIGNED_BYTE
    };
  }
  /**
   * @internal
   */
  _rescaleTexture(source, destination, scene, internalFormat, onComplete) {
  }
  /**
   * @internal
   */
  _unpackFlipY(value) {
    if (this._unpackFlipYCached !== value) {
      this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, value ? 1 : 0);
      if (this.enableUnpackFlipYCached) {
        this._unpackFlipYCached = value;
      }
    }
  }
  /** @internal */
  _getUnpackAlignement() {
    return this._gl.getParameter(this._gl.UNPACK_ALIGNMENT);
  }
  /** @internal */
  _getTextureTarget(texture) {
    if (texture.isCube) {
      return this._gl.TEXTURE_CUBE_MAP;
    } else if (texture.is3D) {
      return this._gl.TEXTURE_3D;
    } else if (texture.is2DArray || texture.isMultiview) {
      return this._gl.TEXTURE_2D_ARRAY;
    }
    return this._gl.TEXTURE_2D;
  }
  /**
   * Update the sampling mode of a given texture
   * @param samplingMode defines the required sampling mode
   * @param texture defines the texture to update
   * @param generateMipMaps defines whether to generate mipmaps for the texture
   */
  updateTextureSamplingMode(samplingMode, texture, generateMipMaps = false) {
    const target = this._getTextureTarget(texture);
    const filters = this._getSamplingParameters(samplingMode, texture.useMipMaps || generateMipMaps);
    this._setTextureParameterInteger(target, this._gl.TEXTURE_MAG_FILTER, filters.mag, texture);
    this._setTextureParameterInteger(target, this._gl.TEXTURE_MIN_FILTER, filters.min);
    if (generateMipMaps) {
      texture.generateMipMaps = true;
      this._gl.generateMipmap(target);
    }
    this._bindTextureDirectly(target, null);
    texture.samplingMode = samplingMode;
  }
  /**
   * Update the dimensions of a texture
   * @param texture texture to update
   * @param width new width of the texture
   * @param height new height of the texture
   * @param depth new depth of the texture
   */
  updateTextureDimensions(texture, width, height, depth = 1) {
  }
  /**
   * Update the sampling mode of a given texture
   * @param texture defines the texture to update
   * @param wrapU defines the texture wrap mode of the u coordinates
   * @param wrapV defines the texture wrap mode of the v coordinates
   * @param wrapR defines the texture wrap mode of the r coordinates
   */
  updateTextureWrappingMode(texture, wrapU, wrapV = null, wrapR = null) {
    const target = this._getTextureTarget(texture);
    if (wrapU !== null) {
      this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_S, this._getTextureWrapMode(wrapU), texture);
      texture._cachedWrapU = wrapU;
    }
    if (wrapV !== null) {
      this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_T, this._getTextureWrapMode(wrapV), texture);
      texture._cachedWrapV = wrapV;
    }
    if ((texture.is2DArray || texture.is3D) && wrapR !== null) {
      this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_R, this._getTextureWrapMode(wrapR), texture);
      texture._cachedWrapR = wrapR;
    }
    this._bindTextureDirectly(target, null);
  }
  /**
   * @internal
   */
  _uploadCompressedDataToTextureDirectly(texture, internalFormat, width, height, data, faceIndex = 0, lod = 0) {
    const gl = this._gl;
    let target = gl.TEXTURE_2D;
    if (texture.isCube) {
      target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex;
    }
    if (texture._useSRGBBuffer) {
      switch (internalFormat) {
        case 37492:
        case 36196:
          if (this._caps.etc2) {
            internalFormat = gl.COMPRESSED_SRGB8_ETC2;
          } else {
            texture._useSRGBBuffer = false;
          }
          break;
        case 37496:
          if (this._caps.etc2) {
            internalFormat = gl.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;
          } else {
            texture._useSRGBBuffer = false;
          }
          break;
        case 36492:
          internalFormat = gl.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT;
          break;
        case 37808:
          internalFormat = gl.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR;
          break;
        case 33776:
          if (this._caps.s3tc_srgb) {
            internalFormat = gl.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          } else {
            texture._useSRGBBuffer = false;
          }
          break;
        case 33777:
          if (this._caps.s3tc_srgb) {
            internalFormat = gl.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          } else {
            texture._useSRGBBuffer = false;
          }
          break;
        case 33779:
          if (this._caps.s3tc_srgb) {
            internalFormat = gl.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
          } else {
            texture._useSRGBBuffer = false;
          }
          break;
        default:
          texture._useSRGBBuffer = false;
          break;
      }
    }
    this._gl.compressedTexImage2D(target, lod, internalFormat, width, height, 0, data);
  }
  /**
   * @internal
   */
  _uploadDataToTextureDirectly(texture, imageData, faceIndex = 0, lod = 0, babylonInternalFormat, useTextureWidthAndHeight = false) {
    const gl = this._gl;
    const textureType = this._getWebGLTextureType(texture.type);
    const format = this._getInternalFormat(texture.format);
    const internalFormat = babylonInternalFormat === void 0 ? this._getRGBABufferInternalSizedFormat(texture.type, texture.format, texture._useSRGBBuffer) : this._getInternalFormat(babylonInternalFormat, texture._useSRGBBuffer);
    this._unpackFlipY(texture.invertY);
    let target = gl.TEXTURE_2D;
    if (texture.isCube) {
      target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex;
    }
    const lodMaxWidth = Math.round(Math.log(texture.width) * Math.LOG2E);
    const lodMaxHeight = Math.round(Math.log(texture.height) * Math.LOG2E);
    const width = useTextureWidthAndHeight ? texture.width : Math.pow(2, Math.max(lodMaxWidth - lod, 0));
    const height = useTextureWidthAndHeight ? texture.height : Math.pow(2, Math.max(lodMaxHeight - lod, 0));
    gl.texImage2D(target, lod, internalFormat, width, height, 0, format, textureType, imageData);
  }
  /**
   * Update a portion of an internal texture
   * @param texture defines the texture to update
   * @param imageData defines the data to store into the texture
   * @param xOffset defines the x coordinates of the update rectangle
   * @param yOffset defines the y coordinates of the update rectangle
   * @param width defines the width of the update rectangle
   * @param height defines the height of the update rectangle
   * @param faceIndex defines the face index if texture is a cube (0 by default)
   * @param lod defines the lod level to update (0 by default)
   * @param generateMipMaps defines whether to generate mipmaps or not
   */
  updateTextureData(texture, imageData, xOffset, yOffset, width, height, faceIndex = 0, lod = 0, generateMipMaps = false) {
    const gl = this._gl;
    const textureType = this._getWebGLTextureType(texture.type);
    const format = this._getInternalFormat(texture.format);
    this._unpackFlipY(texture.invertY);
    let targetForBinding = gl.TEXTURE_2D;
    let target = gl.TEXTURE_2D;
    if (texture.isCube) {
      target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex;
      targetForBinding = gl.TEXTURE_CUBE_MAP;
    }
    this._bindTextureDirectly(targetForBinding, texture, true);
    gl.texSubImage2D(target, lod, xOffset, yOffset, width, height, format, textureType, imageData);
    if (generateMipMaps) {
      this._gl.generateMipmap(target);
    }
    this._bindTextureDirectly(targetForBinding, null);
  }
  /**
   * @internal
   */
  _uploadArrayBufferViewToTexture(texture, imageData, faceIndex = 0, lod = 0) {
    const gl = this._gl;
    const bindTarget = texture.isCube ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D;
    this._bindTextureDirectly(bindTarget, texture, true);
    this._uploadDataToTextureDirectly(texture, imageData, faceIndex, lod);
    this._bindTextureDirectly(bindTarget, null, true);
  }
  _prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode) {
    const gl = this._gl;
    if (!gl) {
      return;
    }
    const filters = this._getSamplingParameters(samplingMode, !noMipmap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filters.mag);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filters.min);
    if (!noMipmap && !isCompressed) {
      gl.generateMipmap(gl.TEXTURE_2D);
    }
    this._bindTextureDirectly(gl.TEXTURE_2D, null);
    if (scene) {
      scene.removePendingData(texture);
    }
    texture.onLoadedObservable.notifyObservers(texture);
    texture.onLoadedObservable.clear();
  }
  _prepareWebGLTexture(texture, extension, scene, img, invertY, noMipmap, isCompressed, processFunction, samplingMode, format) {
    const maxTextureSize = this.getCaps().maxTextureSize;
    const potWidth = Math.min(maxTextureSize, this.needPOTTextures ? GetExponentOfTwo(img.width, maxTextureSize) : img.width);
    const potHeight = Math.min(maxTextureSize, this.needPOTTextures ? GetExponentOfTwo(img.height, maxTextureSize) : img.height);
    const gl = this._gl;
    if (!gl) {
      return;
    }
    if (!texture._hardwareTexture) {
      if (scene) {
        scene.removePendingData(texture);
      }
      return;
    }
    this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
    this._unpackFlipY(invertY === void 0 ? true : invertY ? true : false);
    texture.baseWidth = img.width;
    texture.baseHeight = img.height;
    texture.width = potWidth;
    texture.height = potHeight;
    texture.isReady = true;
    texture.type = texture.type !== -1 ? texture.type : 0;
    texture.format = texture.format !== -1 ? texture.format : format ?? (extension === ".jpg" && !texture._useSRGBBuffer ? 4 : 5);
    if (processFunction(potWidth, potHeight, img, extension, texture, () => {
      this._prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode);
    })) {
      return;
    }
    this._prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode);
  }
  /**
   * @internal
   */
  _setupFramebufferDepthAttachments(generateStencilBuffer, generateDepthBuffer, width, height, samples = 1) {
    const gl = this._gl;
    if (generateStencilBuffer && generateDepthBuffer) {
      return this._createRenderBuffer(width, height, samples, gl.DEPTH_STENCIL, gl.DEPTH24_STENCIL8, gl.DEPTH_STENCIL_ATTACHMENT);
    }
    if (generateDepthBuffer) {
      let depthFormat = gl.DEPTH_COMPONENT16;
      if (this._webGLVersion > 1) {
        depthFormat = gl.DEPTH_COMPONENT32F;
      }
      return this._createRenderBuffer(width, height, samples, depthFormat, depthFormat, gl.DEPTH_ATTACHMENT);
    }
    if (generateStencilBuffer) {
      return this._createRenderBuffer(width, height, samples, gl.STENCIL_INDEX8, gl.STENCIL_INDEX8, gl.STENCIL_ATTACHMENT);
    }
    return null;
  }
  /**
   * @internal
   */
  _createRenderBuffer(width, height, samples, internalFormat, msInternalFormat, attachment, unbindBuffer = true) {
    const gl = this._gl;
    const renderBuffer = gl.createRenderbuffer();
    return this._updateRenderBuffer(renderBuffer, width, height, samples, internalFormat, msInternalFormat, attachment, unbindBuffer);
  }
  _updateRenderBuffer(renderBuffer, width, height, samples, internalFormat, msInternalFormat, attachment, unbindBuffer = true) {
    const gl = this._gl;
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
    if (samples > 1 && gl.renderbufferStorageMultisample) {
      gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, msInternalFormat, width, height);
    } else {
      gl.renderbufferStorage(gl.RENDERBUFFER, internalFormat, width, height);
    }
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, renderBuffer);
    if (unbindBuffer) {
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }
    return renderBuffer;
  }
  /**
   * @internal
   */
  _releaseTexture(texture) {
    this._deleteTexture(texture._hardwareTexture);
    this.unbindAllTextures();
    const index = this._internalTexturesCache.indexOf(texture);
    if (index !== -1) {
      this._internalTexturesCache.splice(index, 1);
    }
    if (texture._lodTextureHigh) {
      texture._lodTextureHigh.dispose();
    }
    if (texture._lodTextureMid) {
      texture._lodTextureMid.dispose();
    }
    if (texture._lodTextureLow) {
      texture._lodTextureLow.dispose();
    }
    if (texture._irradianceTexture) {
      texture._irradianceTexture.dispose();
    }
  }
  _deleteTexture(texture) {
    texture?.release();
  }
  _setProgram(program) {
    if (this._currentProgram !== program) {
      _setProgram(program, this._gl);
      this._currentProgram = program;
    }
  }
  /**
   * Binds an effect to the webGL context
   * @param effect defines the effect to bind
   */
  bindSamplers(effect) {
    const webGLPipelineContext = effect.getPipelineContext();
    this._setProgram(webGLPipelineContext.program);
    const samplers = effect.getSamplers();
    for (let index = 0; index < samplers.length; index++) {
      const uniform = effect.getUniform(samplers[index]);
      if (uniform) {
        this._boundUniforms[index] = uniform;
      }
    }
    this._currentEffect = null;
  }
  _activateCurrentTexture() {
    if (this._currentTextureChannel !== this._activeChannel) {
      this._gl.activeTexture(this._gl.TEXTURE0 + this._activeChannel);
      this._currentTextureChannel = this._activeChannel;
    }
  }
  /**
   * @internal
   */
  _bindTextureDirectly(target, texture, forTextureDataUpdate = false, force = false) {
    let wasPreviouslyBound = false;
    const isTextureForRendering = texture && texture._associatedChannel > -1;
    if (forTextureDataUpdate && isTextureForRendering) {
      this._activeChannel = texture._associatedChannel;
    }
    const currentTextureBound = this._boundTexturesCache[this._activeChannel];
    if (currentTextureBound !== texture || force) {
      this._activateCurrentTexture();
      if (texture && texture.isMultiview) {
        Logger.Error(["_bindTextureDirectly called with a multiview texture!", target, texture]);
        throw "_bindTextureDirectly called with a multiview texture!";
      } else {
        this._gl.bindTexture(target, texture?._hardwareTexture?.underlyingResource ?? null);
      }
      this._boundTexturesCache[this._activeChannel] = texture;
      if (texture) {
        texture._associatedChannel = this._activeChannel;
      }
    } else if (forTextureDataUpdate) {
      wasPreviouslyBound = true;
      this._activateCurrentTexture();
    }
    if (isTextureForRendering && !forTextureDataUpdate) {
      this._bindSamplerUniformToChannel(texture._associatedChannel, this._activeChannel);
    }
    return wasPreviouslyBound;
  }
  /**
   * @internal
   */
  _bindTexture(channel, texture, name2) {
    if (channel === void 0) {
      return;
    }
    if (texture) {
      texture._associatedChannel = channel;
    }
    this._activeChannel = channel;
    const target = texture ? this._getTextureTarget(texture) : this._gl.TEXTURE_2D;
    this._bindTextureDirectly(target, texture);
  }
  /**
   * Unbind all textures from the webGL context
   */
  unbindAllTextures() {
    for (let channel = 0; channel < this._maxSimultaneousTextures; channel++) {
      this._activeChannel = channel;
      this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
      this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
      if (this.webGLVersion > 1) {
        this._bindTextureDirectly(this._gl.TEXTURE_3D, null);
        this._bindTextureDirectly(this._gl.TEXTURE_2D_ARRAY, null);
      }
    }
  }
  /**
   * Sets a texture to the according uniform.
   * @param channel The texture channel
   * @param uniform The uniform to set
   * @param texture The texture to apply
   * @param name The name of the uniform in the effect
   */
  setTexture(channel, uniform, texture, name2) {
    if (channel === void 0) {
      return;
    }
    if (uniform) {
      this._boundUniforms[channel] = uniform;
    }
    this._setTexture(channel, texture);
  }
  _bindSamplerUniformToChannel(sourceSlot, destination) {
    const uniform = this._boundUniforms[sourceSlot];
    if (!uniform || uniform._currentState === destination) {
      return;
    }
    this._gl.uniform1i(uniform, destination);
    uniform._currentState = destination;
  }
  _getTextureWrapMode(mode) {
    switch (mode) {
      case 1:
        return this._gl.REPEAT;
      case 0:
        return this._gl.CLAMP_TO_EDGE;
      case 2:
        return this._gl.MIRRORED_REPEAT;
    }
    return this._gl.REPEAT;
  }
  _setTexture(channel, texture, isPartOfTextureArray = false, depthStencilTexture = false, name2 = "") {
    if (!texture) {
      if (this._boundTexturesCache[channel] != null) {
        this._activeChannel = channel;
        this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
        this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
        if (this.webGLVersion > 1) {
          this._bindTextureDirectly(this._gl.TEXTURE_3D, null);
          this._bindTextureDirectly(this._gl.TEXTURE_2D_ARRAY, null);
        }
      }
      return false;
    }
    if (texture.video) {
      this._activeChannel = channel;
      const videoInternalTexture = texture.getInternalTexture();
      if (videoInternalTexture) {
        videoInternalTexture._associatedChannel = channel;
      }
      texture.update();
    } else if (texture.delayLoadState === 4) {
      texture.delayLoad();
      return false;
    }
    let internalTexture;
    if (depthStencilTexture) {
      internalTexture = texture.depthStencilTexture;
    } else if (texture.isReady()) {
      internalTexture = texture.getInternalTexture();
    } else if (texture.isCube) {
      internalTexture = this.emptyCubeTexture;
    } else if (texture.is3D) {
      internalTexture = this.emptyTexture3D;
    } else if (texture.is2DArray) {
      internalTexture = this.emptyTexture2DArray;
    } else {
      internalTexture = this.emptyTexture;
    }
    if (!isPartOfTextureArray && internalTexture) {
      internalTexture._associatedChannel = channel;
    }
    let needToBind = true;
    if (this._boundTexturesCache[channel] === internalTexture) {
      if (!isPartOfTextureArray) {
        this._bindSamplerUniformToChannel(internalTexture._associatedChannel, channel);
      }
      needToBind = false;
    }
    this._activeChannel = channel;
    const target = this._getTextureTarget(internalTexture);
    if (needToBind) {
      this._bindTextureDirectly(target, internalTexture, isPartOfTextureArray);
    }
    if (internalTexture && !internalTexture.isMultiview) {
      if (internalTexture.isCube && internalTexture._cachedCoordinatesMode !== texture.coordinatesMode) {
        internalTexture._cachedCoordinatesMode = texture.coordinatesMode;
        const textureWrapMode = texture.coordinatesMode !== 3 && texture.coordinatesMode !== 5 ? 1 : 0;
        texture.wrapU = textureWrapMode;
        texture.wrapV = textureWrapMode;
      }
      if (internalTexture._cachedWrapU !== texture.wrapU) {
        internalTexture._cachedWrapU = texture.wrapU;
        this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_S, this._getTextureWrapMode(texture.wrapU), internalTexture);
      }
      if (internalTexture._cachedWrapV !== texture.wrapV) {
        internalTexture._cachedWrapV = texture.wrapV;
        this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_T, this._getTextureWrapMode(texture.wrapV), internalTexture);
      }
      if (internalTexture.is3D && internalTexture._cachedWrapR !== texture.wrapR) {
        internalTexture._cachedWrapR = texture.wrapR;
        this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_R, this._getTextureWrapMode(texture.wrapR), internalTexture);
      }
      this._setAnisotropicLevel(target, internalTexture, texture.anisotropicFilteringLevel);
    }
    return true;
  }
  /**
   * Sets an array of texture to the webGL context
   * @param channel defines the channel where the texture array must be set
   * @param uniform defines the associated uniform location
   * @param textures defines the array of textures to bind
   * @param name name of the channel
   */
  setTextureArray(channel, uniform, textures, name2) {
    if (channel === void 0 || !uniform) {
      return;
    }
    if (!this._textureUnits || this._textureUnits.length !== textures.length) {
      this._textureUnits = new Int32Array(textures.length);
    }
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i].getInternalTexture();
      if (texture) {
        this._textureUnits[i] = channel + i;
        texture._associatedChannel = channel + i;
      } else {
        this._textureUnits[i] = -1;
      }
    }
    this._gl.uniform1iv(uniform, this._textureUnits);
    for (let index = 0; index < textures.length; index++) {
      this._setTexture(this._textureUnits[index], textures[index], true);
    }
  }
  /**
   * @internal
   */
  _setAnisotropicLevel(target, internalTexture, anisotropicFilteringLevel) {
    const anisotropicFilterExtension = this._caps.textureAnisotropicFilterExtension;
    if (internalTexture.samplingMode !== 11 && internalTexture.samplingMode !== 3 && internalTexture.samplingMode !== 2) {
      anisotropicFilteringLevel = 1;
    }
    if (anisotropicFilterExtension && internalTexture._cachedAnisotropicFilteringLevel !== anisotropicFilteringLevel) {
      this._setTextureParameterFloat(target, anisotropicFilterExtension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(anisotropicFilteringLevel, this._caps.maxAnisotropy), internalTexture);
      internalTexture._cachedAnisotropicFilteringLevel = anisotropicFilteringLevel;
    }
  }
  _setTextureParameterFloat(target, parameter, value, texture) {
    this._bindTextureDirectly(target, texture, true, true);
    this._gl.texParameterf(target, parameter, value);
  }
  _setTextureParameterInteger(target, parameter, value, texture) {
    if (texture) {
      this._bindTextureDirectly(target, texture, true, true);
    }
    this._gl.texParameteri(target, parameter, value);
  }
  /**
   * Unbind all vertex attributes from the webGL context
   */
  unbindAllAttributes() {
    if (this._mustWipeVertexAttributes) {
      this._mustWipeVertexAttributes = false;
      for (let i = 0; i < this._caps.maxVertexAttribs; i++) {
        this.disableAttributeByIndex(i);
      }
      return;
    }
    for (let i = 0, ul = this._vertexAttribArraysEnabled.length; i < ul; i++) {
      if (i >= this._caps.maxVertexAttribs || !this._vertexAttribArraysEnabled[i]) {
        continue;
      }
      this.disableAttributeByIndex(i);
    }
  }
  /**
   * Force the engine to release all cached effects. This means that next effect compilation will have to be done completely even if a similar effect was already compiled
   */
  releaseEffects() {
    const keys = Object.keys(this._compiledEffects);
    for (const name2 of keys) {
      const effect = this._compiledEffects[name2];
      effect.dispose();
    }
    this._compiledEffects = {};
  }
  /**
   * Dispose and release all associated resources
   */
  dispose() {
    if (IsWindowObjectExist()) {
      if (this._renderingCanvas) {
        if (!this._doNotHandleContextLost) {
          this._renderingCanvas.removeEventListener("webglcontextlost", this._onContextLost);
          this._renderingCanvas.removeEventListener("webglcontextrestored", this._onContextRestored);
        }
      }
    }
    super.dispose();
    if (this._dummyFramebuffer) {
      this._gl.deleteFramebuffer(this._dummyFramebuffer);
    }
    this.unbindAllAttributes();
    this._boundUniforms = {};
    this._workingCanvas = null;
    this._workingContext = null;
    this._currentBufferPointers.length = 0;
    this._currentProgram = null;
    if (this._creationOptions.loseContextOnDispose) {
      this._gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    deleteStateObject(this._gl);
  }
  /**
   * Attach a new callback raised when context lost event is fired
   * @param callback defines the callback to call
   */
  attachContextLostEvent(callback) {
    if (this._renderingCanvas) {
      this._renderingCanvas.addEventListener("webglcontextlost", callback, false);
    }
  }
  /**
   * Attach a new callback raised when context restored event is fired
   * @param callback defines the callback to call
   */
  attachContextRestoredEvent(callback) {
    if (this._renderingCanvas) {
      this._renderingCanvas.addEventListener("webglcontextrestored", callback, false);
    }
  }
  /**
   * Get the current error code of the webGL context
   * @returns the error code
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError
   */
  getError() {
    return this._gl.getError();
  }
  _canRenderToFloatFramebuffer() {
    if (this._webGLVersion > 1) {
      return this._caps.colorBufferFloat;
    }
    return this._canRenderToFramebuffer(1);
  }
  _canRenderToHalfFloatFramebuffer() {
    if (this._webGLVersion > 1) {
      return this._caps.colorBufferFloat;
    }
    return this._canRenderToFramebuffer(2);
  }
  // Thank you : http://stackoverflow.com/questions/28827511/webgl-ios-render-to-floating-point-texture
  _canRenderToFramebuffer(type) {
    const gl = this._gl;
    while (gl.getError() !== gl.NO_ERROR) {
    }
    let successful = true;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, this._getRGBABufferInternalSizedFormat(type), 1, 1, 0, gl.RGBA, this._getWebGLTextureType(type), null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    successful = successful && status === gl.FRAMEBUFFER_COMPLETE;
    successful = successful && gl.getError() === gl.NO_ERROR;
    if (successful) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      successful = successful && gl.getError() === gl.NO_ERROR;
    }
    if (successful) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      const readFormat = gl.RGBA;
      const readType = gl.UNSIGNED_BYTE;
      const buffer = new Uint8Array(4);
      gl.readPixels(0, 0, 1, 1, readFormat, readType, buffer);
      successful = successful && gl.getError() === gl.NO_ERROR;
    }
    gl.deleteTexture(texture);
    gl.deleteFramebuffer(fb);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    while (!successful && gl.getError() !== gl.NO_ERROR) {
    }
    return successful;
  }
  /**
   * @internal
   */
  _getWebGLTextureType(type) {
    if (this._webGLVersion === 1) {
      switch (type) {
        case 1:
          return this._gl.FLOAT;
        case 2:
          return this._gl.HALF_FLOAT_OES;
        case 0:
          return this._gl.UNSIGNED_BYTE;
        case 8:
          return this._gl.UNSIGNED_SHORT_4_4_4_4;
        case 9:
          return this._gl.UNSIGNED_SHORT_5_5_5_1;
        case 10:
          return this._gl.UNSIGNED_SHORT_5_6_5;
      }
      return this._gl.UNSIGNED_BYTE;
    }
    switch (type) {
      case 3:
        return this._gl.BYTE;
      case 0:
        return this._gl.UNSIGNED_BYTE;
      case 4:
        return this._gl.SHORT;
      case 5:
        return this._gl.UNSIGNED_SHORT;
      case 6:
        return this._gl.INT;
      case 7:
        return this._gl.UNSIGNED_INT;
      case 1:
        return this._gl.FLOAT;
      case 2:
        return this._gl.HALF_FLOAT;
      case 8:
        return this._gl.UNSIGNED_SHORT_4_4_4_4;
      case 9:
        return this._gl.UNSIGNED_SHORT_5_5_5_1;
      case 10:
        return this._gl.UNSIGNED_SHORT_5_6_5;
      case 11:
        return this._gl.UNSIGNED_INT_2_10_10_10_REV;
      case 12:
        return this._gl.UNSIGNED_INT_24_8;
      case 13:
        return this._gl.UNSIGNED_INT_10F_11F_11F_REV;
      case 14:
        return this._gl.UNSIGNED_INT_5_9_9_9_REV;
      case 15:
        return this._gl.FLOAT_32_UNSIGNED_INT_24_8_REV;
    }
    return this._gl.UNSIGNED_BYTE;
  }
  /**
   * @internal
   */
  _getInternalFormat(format, useSRGBBuffer = false) {
    let internalFormat = useSRGBBuffer ? this._glSRGBExtensionValues.SRGB8_ALPHA8 : this._gl.RGBA;
    switch (format) {
      case 0:
        internalFormat = this._gl.ALPHA;
        break;
      case 1:
        internalFormat = this._gl.LUMINANCE;
        break;
      case 2:
        internalFormat = this._gl.LUMINANCE_ALPHA;
        break;
      case 6:
        internalFormat = this._gl.RED;
        break;
      case 7:
        internalFormat = this._gl.RG;
        break;
      case 4:
        internalFormat = useSRGBBuffer ? this._glSRGBExtensionValues.SRGB : this._gl.RGB;
        break;
      case 5:
        internalFormat = useSRGBBuffer ? this._glSRGBExtensionValues.SRGB8_ALPHA8 : this._gl.RGBA;
        break;
    }
    if (this._webGLVersion > 1) {
      switch (format) {
        case 8:
          internalFormat = this._gl.RED_INTEGER;
          break;
        case 9:
          internalFormat = this._gl.RG_INTEGER;
          break;
        case 10:
          internalFormat = this._gl.RGB_INTEGER;
          break;
        case 11:
          internalFormat = this._gl.RGBA_INTEGER;
          break;
      }
    }
    return internalFormat;
  }
  /**
   * @internal
   */
  _getRGBABufferInternalSizedFormat(type, format, useSRGBBuffer = false) {
    if (this._webGLVersion === 1) {
      if (format !== void 0) {
        switch (format) {
          case 0:
            return this._gl.ALPHA;
          case 1:
            return this._gl.LUMINANCE;
          case 2:
            return this._gl.LUMINANCE_ALPHA;
          case 4:
            return useSRGBBuffer ? this._glSRGBExtensionValues.SRGB : this._gl.RGB;
        }
      }
      return this._gl.RGBA;
    }
    switch (type) {
      case 3:
        switch (format) {
          case 6:
            return this._gl.R8_SNORM;
          case 7:
            return this._gl.RG8_SNORM;
          case 4:
            return this._gl.RGB8_SNORM;
          case 8:
            return this._gl.R8I;
          case 9:
            return this._gl.RG8I;
          case 10:
            return this._gl.RGB8I;
          case 11:
            return this._gl.RGBA8I;
          default:
            return this._gl.RGBA8_SNORM;
        }
      case 0:
        switch (format) {
          case 6:
            return this._gl.R8;
          case 7:
            return this._gl.RG8;
          case 4:
            return useSRGBBuffer ? this._glSRGBExtensionValues.SRGB8 : this._gl.RGB8;
          case 5:
            return useSRGBBuffer ? this._glSRGBExtensionValues.SRGB8_ALPHA8 : this._gl.RGBA8;
          case 8:
            return this._gl.R8UI;
          case 9:
            return this._gl.RG8UI;
          case 10:
            return this._gl.RGB8UI;
          case 11:
            return this._gl.RGBA8UI;
          case 0:
            return this._gl.ALPHA;
          case 1:
            return this._gl.LUMINANCE;
          case 2:
            return this._gl.LUMINANCE_ALPHA;
          default:
            return this._gl.RGBA8;
        }
      case 4:
        switch (format) {
          case 8:
            return this._gl.R16I;
          case 9:
            return this._gl.RG16I;
          case 10:
            return this._gl.RGB16I;
          case 11:
            return this._gl.RGBA16I;
          default:
            return this._gl.RGBA16I;
        }
      case 5:
        switch (format) {
          case 8:
            return this._gl.R16UI;
          case 9:
            return this._gl.RG16UI;
          case 10:
            return this._gl.RGB16UI;
          case 11:
            return this._gl.RGBA16UI;
          default:
            return this._gl.RGBA16UI;
        }
      case 6:
        switch (format) {
          case 8:
            return this._gl.R32I;
          case 9:
            return this._gl.RG32I;
          case 10:
            return this._gl.RGB32I;
          case 11:
            return this._gl.RGBA32I;
          default:
            return this._gl.RGBA32I;
        }
      case 7:
        switch (format) {
          case 8:
            return this._gl.R32UI;
          case 9:
            return this._gl.RG32UI;
          case 10:
            return this._gl.RGB32UI;
          case 11:
            return this._gl.RGBA32UI;
          default:
            return this._gl.RGBA32UI;
        }
      case 1:
        switch (format) {
          case 6:
            return this._gl.R32F;
          case 7:
            return this._gl.RG32F;
          case 4:
            return this._gl.RGB32F;
          case 5:
            return this._gl.RGBA32F;
          default:
            return this._gl.RGBA32F;
        }
      case 2:
        switch (format) {
          case 6:
            return this._gl.R16F;
          case 7:
            return this._gl.RG16F;
          case 4:
            return this._gl.RGB16F;
          case 5:
            return this._gl.RGBA16F;
          default:
            return this._gl.RGBA16F;
        }
      case 10:
        return this._gl.RGB565;
      case 13:
        return this._gl.R11F_G11F_B10F;
      case 14:
        return this._gl.RGB9_E5;
      case 8:
        return this._gl.RGBA4;
      case 9:
        return this._gl.RGB5_A1;
      case 11:
        switch (format) {
          case 5:
            return this._gl.RGB10_A2;
          case 11:
            return this._gl.RGB10_A2UI;
          default:
            return this._gl.RGB10_A2;
        }
    }
    return useSRGBBuffer ? this._glSRGBExtensionValues.SRGB8_ALPHA8 : this._gl.RGBA8;
  }
  /**
   * Reads pixels from the current frame buffer. Please note that this function can be slow
   * @param x defines the x coordinate of the rectangle where pixels must be read
   * @param y defines the y coordinate of the rectangle where pixels must be read
   * @param width defines the width of the rectangle where pixels must be read
   * @param height defines the height of the rectangle where pixels must be read
   * @param hasAlpha defines whether the output should have alpha or not (defaults to true)
   * @param flushRenderer true to flush the renderer from the pending commands before reading the pixels
   * @returns a ArrayBufferView promise (Uint8Array) containing RGBA colors
   */
  readPixels(x, y, width, height, hasAlpha = true, flushRenderer = true) {
    const numChannels = hasAlpha ? 4 : 3;
    const format = hasAlpha ? this._gl.RGBA : this._gl.RGB;
    const data = new Uint8Array(height * width * numChannels);
    if (flushRenderer) {
      this.flushFramebuffer();
    }
    this._gl.readPixels(x, y, width, height, format, this._gl.UNSIGNED_BYTE, data);
    return Promise.resolve(data);
  }
  /**
   * Gets a Promise<boolean> indicating if the engine can be instantiated (ie. if a webGL context can be found)
   */
  static get IsSupportedAsync() {
    return Promise.resolve(this.isSupported());
  }
  /**
   * Gets a boolean indicating if the engine can be instantiated (ie. if a webGL context can be found)
   */
  static get IsSupported() {
    return this.isSupported();
  }
  /**
   * Gets a boolean indicating if the engine can be instantiated (ie. if a webGL context can be found)
   * @returns true if the engine can be created
   * @ignorenaming
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static isSupported() {
    if (this._HasMajorPerformanceCaveat !== null) {
      return !this._HasMajorPerformanceCaveat;
    }
    if (this._IsSupported === null) {
      try {
        const tempcanvas = AbstractEngine._CreateCanvas(1, 1);
        const gl = tempcanvas.getContext("webgl") || tempcanvas.getContext("experimental-webgl");
        this._IsSupported = gl != null && !!window.WebGLRenderingContext;
      } catch (e) {
        this._IsSupported = false;
      }
    }
    return this._IsSupported;
  }
  /**
   * Gets a boolean indicating if the engine can be instantiated on a performant device (ie. if a webGL context can be found and it does not use a slow implementation)
   */
  static get HasMajorPerformanceCaveat() {
    if (this._HasMajorPerformanceCaveat === null) {
      try {
        const tempcanvas = AbstractEngine._CreateCanvas(1, 1);
        const gl = tempcanvas.getContext("webgl", {
          failIfMajorPerformanceCaveat: true
        }) || tempcanvas.getContext("experimental-webgl", {
          failIfMajorPerformanceCaveat: true
        });
        this._HasMajorPerformanceCaveat = !gl;
      } catch (e) {
        this._HasMajorPerformanceCaveat = false;
      }
    }
    return this._HasMajorPerformanceCaveat;
  }
};
ThinEngine._TempClearColorUint32 = new Uint32Array(4);
ThinEngine._TempClearColorInt32 = new Int32Array(4);
ThinEngine.ExceptionList = [
  {
    key: "Chrome/63.0",
    capture: "63\\.0\\.3239\\.(\\d+)",
    captureConstraint: 108,
    targets: ["uniformBuffer"]
  },
  {
    key: "Firefox/58",
    capture: null,
    captureConstraint: null,
    targets: ["uniformBuffer"]
  },
  {
    key: "Firefox/59",
    capture: null,
    captureConstraint: null,
    targets: ["uniformBuffer"]
  },
  {
    key: "Chrome/72.+?Mobile",
    capture: null,
    captureConstraint: null,
    targets: ["vao"]
  },
  {
    key: "Chrome/73.+?Mobile",
    capture: null,
    captureConstraint: null,
    targets: ["vao"]
  },
  {
    key: "Chrome/74.+?Mobile",
    capture: null,
    captureConstraint: null,
    targets: ["vao"]
  },
  {
    key: "Mac OS.+Chrome/71",
    capture: null,
    captureConstraint: null,
    targets: ["vao"]
  },
  {
    key: "Mac OS.+Chrome/72",
    capture: null,
    captureConstraint: null,
    targets: ["vao"]
  },
  {
    key: "Mac OS.+Chrome",
    capture: null,
    captureConstraint: null,
    targets: ["uniformBuffer"]
  },
  {
    key: "Chrome/12\\d\\..+?Mobile",
    capture: null,
    captureConstraint: null,
    targets: ["uniformBuffer"]
  },
  // desktop osx safari 15.4
  {
    key: ".*AppleWebKit.*(15.4).*Safari",
    capture: null,
    captureConstraint: null,
    targets: ["antialias", "maxMSAASamples"]
  },
  // mobile browsers using safari 15.4 on ios
  {
    key: ".*(15.4).*AppleWebKit.*Safari",
    capture: null,
    captureConstraint: null,
    targets: ["antialias", "maxMSAASamples"]
  }
];
ThinEngine.CollisionsEpsilon = 1e-3;
ThinEngine._ConcatenateShader = _ConcatenateShader;
ThinEngine._IsSupported = null;
ThinEngine._HasMajorPerformanceCaveat = null;
ThinEngine.CeilingPOT = CeilingPOT;
ThinEngine.FloorPOT = FloorPOT;
ThinEngine.NearestPOT = NearestPOT;
ThinEngine.GetExponentOfTwo = GetExponentOfTwo;
ThinEngine.QueueNewFrame = QueueNewFrame;

// node_modules/@babylonjs/core/Engines/Extensions/engine.readTexture.js
function allocateAndCopyTypedBuffer(type, sizeOrDstBuffer, sizeInBytes = false, copyBuffer) {
  switch (type) {
    case 3: {
      const buffer2 = sizeOrDstBuffer instanceof ArrayBuffer ? new Int8Array(sizeOrDstBuffer) : new Int8Array(sizeOrDstBuffer);
      if (copyBuffer) {
        buffer2.set(new Int8Array(copyBuffer));
      }
      return buffer2;
    }
    case 0: {
      const buffer2 = sizeOrDstBuffer instanceof ArrayBuffer ? new Uint8Array(sizeOrDstBuffer) : new Uint8Array(sizeOrDstBuffer);
      if (copyBuffer) {
        buffer2.set(new Uint8Array(copyBuffer));
      }
      return buffer2;
    }
    case 4: {
      const buffer2 = sizeOrDstBuffer instanceof ArrayBuffer ? new Int16Array(sizeOrDstBuffer) : new Int16Array(sizeInBytes ? sizeOrDstBuffer / 2 : sizeOrDstBuffer);
      if (copyBuffer) {
        buffer2.set(new Int16Array(copyBuffer));
      }
      return buffer2;
    }
    case 5:
    case 8:
    case 9:
    case 10:
    case 2: {
      const buffer2 = sizeOrDstBuffer instanceof ArrayBuffer ? new Uint16Array(sizeOrDstBuffer) : new Uint16Array(sizeInBytes ? sizeOrDstBuffer / 2 : sizeOrDstBuffer);
      if (copyBuffer) {
        buffer2.set(new Uint16Array(copyBuffer));
      }
      return buffer2;
    }
    case 6: {
      const buffer2 = sizeOrDstBuffer instanceof ArrayBuffer ? new Int32Array(sizeOrDstBuffer) : new Int32Array(sizeInBytes ? sizeOrDstBuffer / 4 : sizeOrDstBuffer);
      if (copyBuffer) {
        buffer2.set(new Int32Array(copyBuffer));
      }
      return buffer2;
    }
    case 7:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15: {
      const buffer2 = sizeOrDstBuffer instanceof ArrayBuffer ? new Uint32Array(sizeOrDstBuffer) : new Uint32Array(sizeInBytes ? sizeOrDstBuffer / 4 : sizeOrDstBuffer);
      if (copyBuffer) {
        buffer2.set(new Uint32Array(copyBuffer));
      }
      return buffer2;
    }
    case 1: {
      const buffer2 = sizeOrDstBuffer instanceof ArrayBuffer ? new Float32Array(sizeOrDstBuffer) : new Float32Array(sizeInBytes ? sizeOrDstBuffer / 4 : sizeOrDstBuffer);
      if (copyBuffer) {
        buffer2.set(new Float32Array(copyBuffer));
      }
      return buffer2;
    }
  }
  const buffer = sizeOrDstBuffer instanceof ArrayBuffer ? new Uint8Array(sizeOrDstBuffer) : new Uint8Array(sizeOrDstBuffer);
  if (copyBuffer) {
    buffer.set(new Uint8Array(copyBuffer));
  }
  return buffer;
}
ThinEngine.prototype._readTexturePixelsSync = function(texture, width, height, faceIndex = -1, level = 0, buffer = null, flushRenderer = true, noDataConversion = false, x = 0, y = 0) {
  const gl = this._gl;
  if (!gl) {
    throw new Error("Engine does not have gl rendering context.");
  }
  if (!this._dummyFramebuffer) {
    const dummy = gl.createFramebuffer();
    if (!dummy) {
      throw new Error("Unable to create dummy framebuffer");
    }
    this._dummyFramebuffer = dummy;
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, this._dummyFramebuffer);
  if (faceIndex > -1) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, texture._hardwareTexture?.underlyingResource, level);
  } else {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture._hardwareTexture?.underlyingResource, level);
  }
  let readType = texture.type !== void 0 ? this._getWebGLTextureType(texture.type) : gl.UNSIGNED_BYTE;
  if (!noDataConversion) {
    switch (readType) {
      case gl.UNSIGNED_BYTE:
        if (!buffer) {
          buffer = new Uint8Array(4 * width * height);
        }
        readType = gl.UNSIGNED_BYTE;
        break;
      default:
        if (!buffer) {
          buffer = new Float32Array(4 * width * height);
        }
        readType = gl.FLOAT;
        break;
    }
  } else if (!buffer) {
    buffer = allocateAndCopyTypedBuffer(texture.type, 4 * width * height);
  }
  if (flushRenderer) {
    this.flushFramebuffer();
  }
  gl.readPixels(x, y, width, height, gl.RGBA, readType, buffer);
  gl.bindFramebuffer(gl.FRAMEBUFFER, this._currentFramebuffer);
  return buffer;
};
ThinEngine.prototype._readTexturePixels = function(texture, width, height, faceIndex = -1, level = 0, buffer = null, flushRenderer = true, noDataConversion = false, x = 0, y = 0) {
  return Promise.resolve(this._readTexturePixelsSync(texture, width, height, faceIndex, level, buffer, flushRenderer, noDataConversion, x, y));
};

// node_modules/@babylonjs/core/Materials/Textures/baseTexture.js
var BaseTexture = class _BaseTexture extends ThinTexture {
  /**
   * Define if the texture is having a usable alpha value (can be use for transparency or glossiness for instance).
   */
  set hasAlpha(value) {
    if (this._hasAlpha === value) {
      return;
    }
    this._hasAlpha = value;
    if (this._scene) {
      this._scene.markAllMaterialsAsDirty(1, (mat) => {
        return mat.hasTexture(this);
      });
    }
  }
  get hasAlpha() {
    return this._hasAlpha;
  }
  /**
   * Defines if the alpha value should be determined via the rgb values.
   * If true the luminance of the pixel might be used to find the corresponding alpha value.
   */
  set getAlphaFromRGB(value) {
    if (this._getAlphaFromRGB === value) {
      return;
    }
    this._getAlphaFromRGB = value;
    if (this._scene) {
      this._scene.markAllMaterialsAsDirty(1, (mat) => {
        return mat.hasTexture(this);
      });
    }
  }
  get getAlphaFromRGB() {
    return this._getAlphaFromRGB;
  }
  /**
   * Define the UV channel to use starting from 0 and defaulting to 0.
   * This is part of the texture as textures usually maps to one uv set.
   */
  set coordinatesIndex(value) {
    if (this._coordinatesIndex === value) {
      return;
    }
    this._coordinatesIndex = value;
    if (this._scene) {
      this._scene.markAllMaterialsAsDirty(1, (mat) => {
        return mat.hasTexture(this);
      });
    }
  }
  get coordinatesIndex() {
    return this._coordinatesIndex;
  }
  /**
   * How a texture is mapped.
   *
   * | Value | Type                                | Description |
   * | ----- | ----------------------------------- | ----------- |
   * | 0     | EXPLICIT_MODE                       |             |
   * | 1     | SPHERICAL_MODE                      |             |
   * | 2     | PLANAR_MODE                         |             |
   * | 3     | CUBIC_MODE                          |             |
   * | 4     | PROJECTION_MODE                     |             |
   * | 5     | SKYBOX_MODE                         |             |
   * | 6     | INVCUBIC_MODE                       |             |
   * | 7     | EQUIRECTANGULAR_MODE                |             |
   * | 8     | FIXED_EQUIRECTANGULAR_MODE          |             |
   * | 9     | FIXED_EQUIRECTANGULAR_MIRRORED_MODE |             |
   */
  set coordinatesMode(value) {
    if (this._coordinatesMode === value) {
      return;
    }
    this._coordinatesMode = value;
    if (this._scene) {
      this._scene.markAllMaterialsAsDirty(1, (mat) => {
        return mat.hasTexture(this);
      });
    }
  }
  get coordinatesMode() {
    return this._coordinatesMode;
  }
  /**
   * | Value | Type               | Description |
   * | ----- | ------------------ | ----------- |
   * | 0     | CLAMP_ADDRESSMODE  |             |
   * | 1     | WRAP_ADDRESSMODE   |             |
   * | 2     | MIRROR_ADDRESSMODE |             |
   */
  get wrapU() {
    return this._wrapU;
  }
  set wrapU(value) {
    this._wrapU = value;
  }
  /**
   * | Value | Type               | Description |
   * | ----- | ------------------ | ----------- |
   * | 0     | CLAMP_ADDRESSMODE  |             |
   * | 1     | WRAP_ADDRESSMODE   |             |
   * | 2     | MIRROR_ADDRESSMODE |             |
   */
  get wrapV() {
    return this._wrapV;
  }
  set wrapV(value) {
    this._wrapV = value;
  }
  /**
   * Define if the texture is a cube texture or if false a 2d texture.
   */
  get isCube() {
    if (!this._texture) {
      return this._isCube;
    }
    return this._texture.isCube;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  set isCube(value) {
    if (!this._texture) {
      this._isCube = value;
    } else {
      this._texture.isCube = value;
    }
  }
  /**
   * Define if the texture is a 3d texture (webgl 2) or if false a 2d texture.
   */
  get is3D() {
    if (!this._texture) {
      return false;
    }
    return this._texture.is3D;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  set is3D(value) {
    if (!this._texture) {
      return;
    }
    this._texture.is3D = value;
  }
  /**
   * Define if the texture is a 2d array texture (webgl 2) or if false a 2d texture.
   */
  get is2DArray() {
    if (!this._texture) {
      return false;
    }
    return this._texture.is2DArray;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  set is2DArray(value) {
    if (!this._texture) {
      return;
    }
    this._texture.is2DArray = value;
  }
  /**
   * Define if the texture contains data in gamma space (most of the png/jpg aside bump).
   * HDR texture are usually stored in linear space.
   * This only impacts the PBR and Background materials
   */
  get gammaSpace() {
    if (!this._texture) {
      return this._gammaSpace;
    } else {
      if (this._texture._gammaSpace === null) {
        this._texture._gammaSpace = this._gammaSpace;
      }
    }
    return this._texture._gammaSpace && !this._texture._useSRGBBuffer;
  }
  set gammaSpace(gamma) {
    if (!this._texture) {
      if (this._gammaSpace === gamma) {
        return;
      }
      this._gammaSpace = gamma;
    } else {
      if (this._texture._gammaSpace === gamma) {
        return;
      }
      this._texture._gammaSpace = gamma;
    }
    this.getScene()?.markAllMaterialsAsDirty(1, (mat) => {
      return mat.hasTexture(this);
    });
  }
  /**
   * Gets or sets whether or not the texture contains RGBD data.
   */
  get isRGBD() {
    return this._texture != null && this._texture._isRGBD;
  }
  set isRGBD(value) {
    if (value === this.isRGBD) {
      return;
    }
    if (this._texture) {
      this._texture._isRGBD = value;
    }
    this.getScene()?.markAllMaterialsAsDirty(1, (mat) => {
      return mat.hasTexture(this);
    });
  }
  /**
   * Are mip maps generated for this texture or not.
   */
  get noMipmap() {
    return false;
  }
  /**
   * With prefiltered texture, defined the offset used during the prefiltering steps.
   */
  get lodGenerationOffset() {
    if (this._texture) {
      return this._texture._lodGenerationOffset;
    }
    return 0;
  }
  set lodGenerationOffset(value) {
    if (this._texture) {
      this._texture._lodGenerationOffset = value;
    }
  }
  /**
   * With prefiltered texture, defined the scale used during the prefiltering steps.
   */
  get lodGenerationScale() {
    if (this._texture) {
      return this._texture._lodGenerationScale;
    }
    return 0;
  }
  set lodGenerationScale(value) {
    if (this._texture) {
      this._texture._lodGenerationScale = value;
    }
  }
  /**
   * With prefiltered texture, defined if the specular generation is based on a linear ramp.
   * By default we are using a log2 of the linear roughness helping to keep a better resolution for
   * average roughness values.
   */
  get linearSpecularLOD() {
    if (this._texture) {
      return this._texture._linearSpecularLOD;
    }
    return false;
  }
  set linearSpecularLOD(value) {
    if (this._texture) {
      this._texture._linearSpecularLOD = value;
    }
  }
  /**
   * In case a better definition than spherical harmonics is required for the diffuse part of the environment.
   * You can set the irradiance texture to rely on a texture instead of the spherical approach.
   * This texture need to have the same characteristics than its parent (Cube vs 2d, coordinates mode, Gamma/Linear, RGBD).
   */
  get irradianceTexture() {
    if (this._texture) {
      return this._texture._irradianceTexture;
    }
    return null;
  }
  set irradianceTexture(value) {
    if (this._texture) {
      this._texture._irradianceTexture = value;
    }
  }
  /**
   * Define the unique id of the texture in the scene.
   */
  get uid() {
    if (!this._uid) {
      this._uid = RandomGUID();
    }
    return this._uid;
  }
  /**
   * Return a string representation of the texture.
   * @returns the texture as a string
   */
  toString() {
    return this.name;
  }
  /**
   * Get the class name of the texture.
   * @returns "BaseTexture"
   */
  getClassName() {
    return "BaseTexture";
  }
  /**
   * Callback triggered when the texture has been disposed.
   * Kept for back compatibility, you can use the onDisposeObservable instead.
   */
  set onDispose(callback) {
    if (this._onDisposeObserver) {
      this.onDisposeObservable.remove(this._onDisposeObserver);
    }
    this._onDisposeObserver = this.onDisposeObservable.add(callback);
  }
  /**
   * Define if the texture is preventing a material to render or not.
   * If not and the texture is not ready, the engine will use a default black texture instead.
   */
  get isBlocking() {
    return true;
  }
  /**
   * Was there any loading error?
   */
  get loadingError() {
    return this._loadingError;
  }
  /**
   * If a loading error occurred this object will be populated with information about the error.
   */
  get errorObject() {
    return this._errorObject;
  }
  /**
   * Instantiates a new BaseTexture.
   * Base class of all the textures in babylon.
   * It groups all the common properties the materials, post process, lights... might need
   * in order to make a correct use of the texture.
   * @param sceneOrEngine Define the scene or engine the texture belongs to
   * @param internalTexture Define the internal texture associated with the texture
   */
  constructor(sceneOrEngine, internalTexture = null) {
    super(null);
    this.metadata = null;
    this.reservedDataStore = null;
    this._hasAlpha = false;
    this._getAlphaFromRGB = false;
    this.level = 1;
    this._coordinatesIndex = 0;
    this.optimizeUVAllocation = true;
    this._coordinatesMode = 0;
    this.wrapR = 1;
    this.anisotropicFilteringLevel = _BaseTexture.DEFAULT_ANISOTROPIC_FILTERING_LEVEL;
    this._isCube = false;
    this._gammaSpace = true;
    this.invertZ = false;
    this.lodLevelInAlpha = false;
    this.isRenderTarget = false;
    this._prefiltered = false;
    this._forceSerialize = false;
    this.animations = [];
    this.onDisposeObservable = new Observable();
    this._onDisposeObserver = null;
    this._scene = null;
    this._uid = null;
    this._parentContainer = null;
    this._loadingError = false;
    if (sceneOrEngine) {
      if (_BaseTexture._IsScene(sceneOrEngine)) {
        this._scene = sceneOrEngine;
      } else {
        this._engine = sceneOrEngine;
      }
    } else {
      this._scene = EngineStore.LastCreatedScene;
    }
    if (this._scene) {
      this.uniqueId = this._scene.getUniqueId();
      this._scene.addTexture(this);
      this._engine = this._scene.getEngine();
    }
    this._texture = internalTexture;
    this._uid = null;
  }
  /**
   * Get the scene the texture belongs to.
   * @returns the scene or null if undefined
   */
  getScene() {
    return this._scene;
  }
  /** @internal */
  _getEngine() {
    return this._engine;
  }
  /**
   * Get the texture transform matrix used to offset tile the texture for instance.
   * @returns the transformation matrix
   */
  getTextureMatrix() {
    return Matrix.IdentityReadOnly;
  }
  /**
   * Get the texture reflection matrix used to rotate/transform the reflection.
   * @returns the reflection matrix
   */
  getReflectionTextureMatrix() {
    return Matrix.IdentityReadOnly;
  }
  /**
   * Gets a suitable rotate/transform matrix when the texture is used for refraction.
   * There's a separate function from getReflectionTextureMatrix because refraction requires a special configuration of the matrix in right-handed mode.
   * @returns The refraction matrix
   */
  getRefractionTextureMatrix() {
    return this.getReflectionTextureMatrix();
  }
  /**
   * Get if the texture is ready to be consumed (either it is ready or it is not blocking)
   * @returns true if ready, not blocking or if there was an error loading the texture
   */
  isReadyOrNotBlocking() {
    return !this.isBlocking || this.isReady() || this.loadingError;
  }
  /**
   * Scales the texture if is `canRescale()`
   * @param ratio the resize factor we want to use to rescale
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scale(ratio) {
  }
  /**
   * Get if the texture can rescale.
   */
  get canRescale() {
    return false;
  }
  /**
   * @internal
   */
  _getFromCache(url, noMipmap, sampling, invertY, useSRGBBuffer, isCube) {
    const engine = this._getEngine();
    if (!engine) {
      return null;
    }
    const correctedUseSRGBBuffer = engine._getUseSRGBBuffer(!!useSRGBBuffer, noMipmap);
    const texturesCache = engine.getLoadedTexturesCache();
    for (let index = 0; index < texturesCache.length; index++) {
      const texturesCacheEntry = texturesCache[index];
      if (useSRGBBuffer === void 0 || correctedUseSRGBBuffer === texturesCacheEntry._useSRGBBuffer) {
        if (invertY === void 0 || invertY === texturesCacheEntry.invertY) {
          if (texturesCacheEntry.url === url && texturesCacheEntry.generateMipMaps === !noMipmap) {
            if (!sampling || sampling === texturesCacheEntry.samplingMode) {
              if (isCube === void 0 || isCube === texturesCacheEntry.isCube) {
                texturesCacheEntry.incrementReferences();
                return texturesCacheEntry;
              }
            }
          }
        }
      }
    }
    return null;
  }
  /** @internal */
  _rebuild(_fromContextLost = false) {
  }
  /**
   * Clones the texture.
   * @returns the cloned texture
   */
  clone() {
    return null;
  }
  /**
   * Get the texture underlying type (INT, FLOAT...)
   */
  get textureType() {
    if (!this._texture) {
      return 0;
    }
    return this._texture.type !== void 0 ? this._texture.type : 0;
  }
  /**
   * Get the texture underlying format (RGB, RGBA...)
   */
  get textureFormat() {
    if (!this._texture) {
      return 5;
    }
    return this._texture.format !== void 0 ? this._texture.format : 5;
  }
  /**
   * Indicates that textures need to be re-calculated for all materials
   */
  _markAllSubMeshesAsTexturesDirty() {
    const scene = this.getScene();
    if (!scene) {
      return;
    }
    scene.markAllMaterialsAsDirty(1);
  }
  /**
   * Reads the pixels stored in the webgl texture and returns them as an ArrayBuffer.
   * This will returns an RGBA array buffer containing either in values (0-255) or
   * float values (0-1) depending of the underlying buffer type.
   * @param faceIndex defines the face of the texture to read (in case of cube texture)
   * @param level defines the LOD level of the texture to read (in case of Mip Maps)
   * @param buffer defines a user defined buffer to fill with data (can be null)
   * @param flushRenderer true to flush the renderer from the pending commands before reading the pixels
   * @param noDataConversion false to convert the data to Uint8Array (if texture type is UNSIGNED_BYTE) or to Float32Array (if texture type is anything but UNSIGNED_BYTE). If true, the type of the generated buffer (if buffer==null) will depend on the type of the texture
   * @param x defines the region x coordinates to start reading from (default to 0)
   * @param y defines the region y coordinates to start reading from (default to 0)
   * @param width defines the region width to read from (default to the texture size at level)
   * @param height defines the region width to read from (default to the texture size at level)
   * @returns The Array buffer promise containing the pixels data.
   */
  readPixels(faceIndex = 0, level = 0, buffer = null, flushRenderer = true, noDataConversion = false, x = 0, y = 0, width = Number.MAX_VALUE, height = Number.MAX_VALUE) {
    if (!this._texture) {
      return null;
    }
    const engine = this._getEngine();
    if (!engine) {
      return null;
    }
    const size = this.getSize();
    let maxWidth = size.width;
    let maxHeight = size.height;
    if (level !== 0) {
      maxWidth = maxWidth / Math.pow(2, level);
      maxHeight = maxHeight / Math.pow(2, level);
      maxWidth = Math.round(maxWidth);
      maxHeight = Math.round(maxHeight);
    }
    width = Math.min(maxWidth, width);
    height = Math.min(maxHeight, height);
    try {
      if (this._texture.isCube) {
        return engine._readTexturePixels(this._texture, width, height, faceIndex, level, buffer, flushRenderer, noDataConversion, x, y);
      }
      return engine._readTexturePixels(this._texture, width, height, -1, level, buffer, flushRenderer, noDataConversion, x, y);
    } catch (e) {
      return null;
    }
  }
  /**
   * @internal
   */
  _readPixelsSync(faceIndex = 0, level = 0, buffer = null, flushRenderer = true, noDataConversion = false) {
    if (!this._texture) {
      return null;
    }
    const size = this.getSize();
    let width = size.width;
    let height = size.height;
    const engine = this._getEngine();
    if (!engine) {
      return null;
    }
    if (level != 0) {
      width = width / Math.pow(2, level);
      height = height / Math.pow(2, level);
      width = Math.round(width);
      height = Math.round(height);
    }
    try {
      if (this._texture.isCube) {
        return engine._readTexturePixelsSync(this._texture, width, height, faceIndex, level, buffer, flushRenderer, noDataConversion);
      }
      return engine._readTexturePixelsSync(this._texture, width, height, -1, level, buffer, flushRenderer, noDataConversion);
    } catch (e) {
      return null;
    }
  }
  /** @internal */
  get _lodTextureHigh() {
    if (this._texture) {
      return this._texture._lodTextureHigh;
    }
    return null;
  }
  /** @internal */
  get _lodTextureMid() {
    if (this._texture) {
      return this._texture._lodTextureMid;
    }
    return null;
  }
  /** @internal */
  get _lodTextureLow() {
    if (this._texture) {
      return this._texture._lodTextureLow;
    }
    return null;
  }
  /**
   * Dispose the texture and release its associated resources.
   */
  dispose() {
    if (this._scene) {
      if (this._scene.stopAnimation) {
        this._scene.stopAnimation(this);
      }
      this._scene.removePendingData(this);
      const index = this._scene.textures.indexOf(this);
      if (index >= 0) {
        this._scene.textures.splice(index, 1);
      }
      this._scene.onTextureRemovedObservable.notifyObservers(this);
      this._scene = null;
      if (this._parentContainer) {
        const index2 = this._parentContainer.textures.indexOf(this);
        if (index2 > -1) {
          this._parentContainer.textures.splice(index2, 1);
        }
        this._parentContainer = null;
      }
    }
    this.onDisposeObservable.notifyObservers(this);
    this.onDisposeObservable.clear();
    this.metadata = null;
    super.dispose();
  }
  /**
   * Serialize the texture into a JSON representation that can be parsed later on.
   * @param allowEmptyName True to force serialization even if name is empty. Default: false
   * @returns the JSON representation of the texture
   */
  serialize(allowEmptyName = false) {
    if (!this.name && !allowEmptyName) {
      return null;
    }
    const serializationObject = SerializationHelper.Serialize(this);
    SerializationHelper.AppendSerializedAnimations(this, serializationObject);
    return serializationObject;
  }
  /**
   * Helper function to be called back once a list of texture contains only ready textures.
   * @param textures Define the list of textures to wait for
   * @param callback Define the callback triggered once the entire list will be ready
   */
  static WhenAllReady(textures, callback) {
    let numRemaining = textures.length;
    if (numRemaining === 0) {
      callback();
      return;
    }
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i];
      if (texture.isReady()) {
        if (--numRemaining === 0) {
          callback();
        }
      } else {
        const onLoadObservable = texture.onLoadObservable;
        if (onLoadObservable) {
          onLoadObservable.addOnce(() => {
            if (--numRemaining === 0) {
              callback();
            }
          });
        } else {
          if (--numRemaining === 0) {
            callback();
          }
        }
      }
    }
  }
  static _IsScene(sceneOrEngine) {
    return sceneOrEngine.getClassName() === "Scene";
  }
};
BaseTexture.DEFAULT_ANISOTROPIC_FILTERING_LEVEL = 4;
__decorate([serialize()], BaseTexture.prototype, "uniqueId", void 0);
__decorate([serialize()], BaseTexture.prototype, "name", void 0);
__decorate([serialize()], BaseTexture.prototype, "metadata", void 0);
__decorate([serialize("hasAlpha")], BaseTexture.prototype, "_hasAlpha", void 0);
__decorate([serialize("getAlphaFromRGB")], BaseTexture.prototype, "_getAlphaFromRGB", void 0);
__decorate([serialize()], BaseTexture.prototype, "level", void 0);
__decorate([serialize("coordinatesIndex")], BaseTexture.prototype, "_coordinatesIndex", void 0);
__decorate([serialize()], BaseTexture.prototype, "optimizeUVAllocation", void 0);
__decorate([serialize("coordinatesMode")], BaseTexture.prototype, "_coordinatesMode", void 0);
__decorate([serialize()], BaseTexture.prototype, "wrapU", null);
__decorate([serialize()], BaseTexture.prototype, "wrapV", null);
__decorate([serialize()], BaseTexture.prototype, "wrapR", void 0);
__decorate([serialize()], BaseTexture.prototype, "anisotropicFilteringLevel", void 0);
__decorate([serialize()], BaseTexture.prototype, "isCube", null);
__decorate([serialize()], BaseTexture.prototype, "is3D", null);
__decorate([serialize()], BaseTexture.prototype, "is2DArray", null);
__decorate([serialize()], BaseTexture.prototype, "gammaSpace", null);
__decorate([serialize()], BaseTexture.prototype, "invertZ", void 0);
__decorate([serialize()], BaseTexture.prototype, "lodLevelInAlpha", void 0);
__decorate([serialize()], BaseTexture.prototype, "lodGenerationOffset", null);
__decorate([serialize()], BaseTexture.prototype, "lodGenerationScale", null);
__decorate([serialize()], BaseTexture.prototype, "linearSpecularLOD", null);
__decorate([serializeAsTexture()], BaseTexture.prototype, "irradianceTexture", null);
__decorate([serialize()], BaseTexture.prototype, "isRenderTarget", void 0);

// node_modules/@babylonjs/core/Misc/instantiationTools.js
var InstantiationTools = class {
  /**
   * Tries to instantiate a new object from a given class name
   * @param className defines the class name to instantiate
   * @returns the new object or null if the system was not able to do the instantiation
   */
  static Instantiate(className) {
    if (this.RegisteredExternalClasses && this.RegisteredExternalClasses[className]) {
      return this.RegisteredExternalClasses[className];
    }
    const internalClass = GetClass(className);
    if (internalClass) {
      return internalClass;
    }
    Logger.Warn(className + " not found, you may have missed an import.");
    const arr = className.split(".");
    let fn = window || this;
    for (let i = 0, len = arr.length; i < len; i++) {
      fn = fn[arr[i]];
    }
    if (typeof fn !== "function") {
      return null;
    }
    return fn;
  }
};
InstantiationTools.RegisteredExternalClasses = {};

// node_modules/@babylonjs/core/Maths/math.plane.js
var Plane = class _Plane {
  /**
   * Creates a Plane object according to the given floats a, b, c, d and the plane equation : ax + by + cz + d = 0
   * @param a a component of the plane
   * @param b b component of the plane
   * @param c c component of the plane
   * @param d d component of the plane
   */
  constructor(a, b, c, d) {
    this.normal = new Vector3(a, b, c);
    this.d = d;
  }
  /**
   * @returns the plane coordinates as a new array of 4 elements [a, b, c, d].
   */
  asArray() {
    return [this.normal.x, this.normal.y, this.normal.z, this.d];
  }
  // Methods
  /**
   * @returns a new plane copied from the current Plane.
   */
  clone() {
    return new _Plane(this.normal.x, this.normal.y, this.normal.z, this.d);
  }
  /**
   * @returns the string "Plane".
   */
  getClassName() {
    return "Plane";
  }
  /**
   * @returns the Plane hash code.
   */
  getHashCode() {
    let hash = this.normal.getHashCode();
    hash = hash * 397 ^ (this.d | 0);
    return hash;
  }
  /**
   * Normalize the current Plane in place.
   * @returns the updated Plane.
   */
  normalize() {
    const norm = Math.sqrt(this.normal.x * this.normal.x + this.normal.y * this.normal.y + this.normal.z * this.normal.z);
    let magnitude = 0;
    if (norm !== 0) {
      magnitude = 1 / norm;
    }
    this.normal.x *= magnitude;
    this.normal.y *= magnitude;
    this.normal.z *= magnitude;
    this.d *= magnitude;
    return this;
  }
  /**
   * Applies a transformation the plane and returns the result
   * @param transformation the transformation matrix to be applied to the plane
   * @returns a new Plane as the result of the transformation of the current Plane by the given matrix.
   */
  transform(transformation) {
    const invertedMatrix = _Plane._TmpMatrix;
    transformation.invertToRef(invertedMatrix);
    const m = invertedMatrix.m;
    const x = this.normal.x;
    const y = this.normal.y;
    const z = this.normal.z;
    const d = this.d;
    const normalX = x * m[0] + y * m[1] + z * m[2] + d * m[3];
    const normalY = x * m[4] + y * m[5] + z * m[6] + d * m[7];
    const normalZ = x * m[8] + y * m[9] + z * m[10] + d * m[11];
    const finalD = x * m[12] + y * m[13] + z * m[14] + d * m[15];
    return new _Plane(normalX, normalY, normalZ, finalD);
  }
  /**
   * Compute the dot product between the point and the plane normal
   * @param point point to calculate the dot product with
   * @returns the dot product (float) of the point coordinates and the plane normal.
   */
  dotCoordinate(point) {
    return this.normal.x * point.x + this.normal.y * point.y + this.normal.z * point.z + this.d;
  }
  /**
   * Updates the current Plane from the plane defined by the three given points.
   * @param point1 one of the points used to construct the plane
   * @param point2 one of the points used to construct the plane
   * @param point3 one of the points used to construct the plane
   * @returns the updated Plane.
   */
  copyFromPoints(point1, point2, point3) {
    const x1 = point2.x - point1.x;
    const y1 = point2.y - point1.y;
    const z1 = point2.z - point1.z;
    const x2 = point3.x - point1.x;
    const y2 = point3.y - point1.y;
    const z2 = point3.z - point1.z;
    const yz = y1 * z2 - z1 * y2;
    const xz = z1 * x2 - x1 * z2;
    const xy = x1 * y2 - y1 * x2;
    const pyth = Math.sqrt(yz * yz + xz * xz + xy * xy);
    let invPyth;
    if (pyth !== 0) {
      invPyth = 1 / pyth;
    } else {
      invPyth = 0;
    }
    this.normal.x = yz * invPyth;
    this.normal.y = xz * invPyth;
    this.normal.z = xy * invPyth;
    this.d = -(this.normal.x * point1.x + this.normal.y * point1.y + this.normal.z * point1.z);
    return this;
  }
  /**
   * Checks if the plane is facing a given direction (meaning if the plane's normal is pointing in the opposite direction of the given vector).
   * Note that for this function to work as expected you should make sure that:
   *   - direction and the plane normal are normalized
   *   - epsilon is a number just bigger than -1, something like -0.99 for eg
   * @param direction the direction to check if the plane is facing
   * @param epsilon value the dot product is compared against (returns true if dot <= epsilon)
   * @returns True if the plane is facing the given direction
   */
  isFrontFacingTo(direction, epsilon) {
    const dot = Vector3.Dot(this.normal, direction);
    return dot <= epsilon;
  }
  /**
   * Calculates the distance to a point
   * @param point point to calculate distance to
   * @returns the signed distance (float) from the given point to the Plane.
   */
  signedDistanceTo(point) {
    return Vector3.Dot(point, this.normal) + this.d;
  }
  // Statics
  /**
   * Creates a plane from an  array
   * @param array the array to create a plane from
   * @returns a new Plane from the given array.
   */
  static FromArray(array) {
    return new _Plane(array[0], array[1], array[2], array[3]);
  }
  /**
   * Creates a plane from three points
   * @param point1 point used to create the plane
   * @param point2 point used to create the plane
   * @param point3 point used to create the plane
   * @returns a new Plane defined by the three given points.
   */
  static FromPoints(point1, point2, point3) {
    const result = new _Plane(0, 0, 0, 0);
    result.copyFromPoints(point1, point2, point3);
    return result;
  }
  /**
   * Creates a plane from an origin point and a normal
   * @param origin origin of the plane to be constructed
   * @param normal normal of the plane to be constructed
   * @returns a new Plane the normal vector to this plane at the given origin point.
   */
  static FromPositionAndNormal(origin, normal) {
    const plane = new _Plane(0, 0, 0, 0);
    return this.FromPositionAndNormalToRef(origin, normal, plane);
  }
  /**
   * Updates the given Plane "result" from an origin point and a normal.
   * @param origin origin of the plane to be constructed
   * @param normal the normalized normals of the plane to be constructed
   * @param result defines the Plane where to store the result
   * @returns result input
   */
  static FromPositionAndNormalToRef(origin, normal, result) {
    result.normal.copyFrom(normal);
    result.normal.normalize();
    result.d = -origin.dot(result.normal);
    return result;
  }
  /**
   * Calculates the distance from a plane and a point
   * @param origin origin of the plane to be constructed
   * @param normal normal of the plane to be constructed
   * @param point point to calculate distance to
   * @returns the signed distance between the plane defined by the normal vector at the "origin"" point and the given other point.
   */
  static SignedDistanceToPlaneFromPositionAndNormal(origin, normal, point) {
    const d = -(normal.x * origin.x + normal.y * origin.y + normal.z * origin.z);
    return Vector3.Dot(point, normal) + d;
  }
};
Plane._TmpMatrix = Matrix.Identity();

// node_modules/@babylonjs/core/Misc/copyTools.js
function GenerateBase64StringFromPixelData(pixels, size, invertY = false) {
  const width = size.width;
  const height = size.height;
  if (pixels instanceof Float32Array) {
    let len = pixels.byteLength / pixels.BYTES_PER_ELEMENT;
    const npixels = new Uint8Array(len);
    while (--len >= 0) {
      let val = pixels[len];
      if (val < 0) {
        val = 0;
      } else if (val > 1) {
        val = 1;
      }
      npixels[len] = val * 255;
    }
    pixels = npixels;
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  const imageData = ctx.createImageData(width, height);
  const castData = imageData.data;
  castData.set(pixels);
  ctx.putImageData(imageData, 0, 0);
  if (invertY) {
    const canvas2 = document.createElement("canvas");
    canvas2.width = width;
    canvas2.height = height;
    const ctx2 = canvas2.getContext("2d");
    if (!ctx2) {
      return null;
    }
    ctx2.translate(0, height);
    ctx2.scale(1, -1);
    ctx2.drawImage(canvas, 0, 0);
    return canvas2.toDataURL("image/png");
  }
  return canvas.toDataURL("image/png");
}
function GenerateBase64StringFromTexture(texture, faceIndex = 0, level = 0) {
  const internalTexture = texture.getInternalTexture();
  if (!internalTexture) {
    return null;
  }
  const pixels = texture._readPixelsSync(faceIndex, level);
  if (!pixels) {
    return null;
  }
  return GenerateBase64StringFromPixelData(pixels, texture.getSize(), internalTexture.invertY);
}
function GenerateBase64StringFromTextureAsync(texture, faceIndex = 0, level = 0) {
  return __async(this, null, function* () {
    const internalTexture = texture.getInternalTexture();
    if (!internalTexture) {
      return null;
    }
    const pixels = yield texture.readPixels(faceIndex, level);
    if (!pixels) {
      return null;
    }
    return GenerateBase64StringFromPixelData(pixels, texture.getSize(), internalTexture.invertY);
  });
}

// node_modules/@babylonjs/core/Compat/compatibilityOptions.js
var useOpenGLOrientationForUV = false;

// node_modules/@babylonjs/core/Materials/Textures/texture.js
var Texture = class _Texture extends BaseTexture {
  /**
   * @internal
   */
  static _CreateVideoTexture(name2, src, scene, generateMipMaps = false, invertY = false, samplingMode = _Texture.TRILINEAR_SAMPLINGMODE, settings = {}, onError, format = 5) {
    throw _WarnImport("VideoTexture");
  }
  /**
   * Are mip maps generated for this texture or not.
   */
  get noMipmap() {
    return this._noMipmap;
  }
  /** Returns the texture mime type if it was defined by a loader (undefined else) */
  get mimeType() {
    return this._mimeType;
  }
  /**
   * Is the texture preventing material to render while loading.
   * If false, a default texture will be used instead of the loading one during the preparation step.
   */
  set isBlocking(value) {
    this._isBlocking = value;
  }
  get isBlocking() {
    return this._isBlocking;
  }
  /**
   * Gets a boolean indicating if the texture needs to be inverted on the y axis during loading
   */
  get invertY() {
    return this._invertY;
  }
  /**
   * Instantiates a new texture.
   * This represents a texture in babylon. It can be easily loaded from a network, base64 or html input.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction#texture
   * @param url defines the url of the picture to load as a texture
   * @param sceneOrEngine defines the scene or engine the texture will belong to
   * @param noMipmapOrOptions defines if the texture will require mip maps or not or set of all options to create the texture
   * @param invertY defines if the texture needs to be inverted on the y axis during loading
   * @param samplingMode defines the sampling mode we want for the texture while fetching from it (Texture.NEAREST_SAMPLINGMODE...)
   * @param onLoad defines a callback triggered when the texture has been loaded
   * @param onError defines a callback triggered when an error occurred during the loading session
   * @param buffer defines the buffer to load the texture from in case the texture is loaded from a buffer representation
   * @param deleteBuffer defines if the buffer we are loading the texture from should be deleted after load
   * @param format defines the format of the texture we are trying to load (Engine.TEXTUREFORMAT_RGBA...)
   * @param mimeType defines an optional mime type information
   * @param loaderOptions options to be passed to the loader
   * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
   * @param forcedExtension defines the extension to use to pick the right loader
   */
  constructor(url, sceneOrEngine, noMipmapOrOptions, invertY, samplingMode = _Texture.TRILINEAR_SAMPLINGMODE, onLoad = null, onError = null, buffer = null, deleteBuffer = false, format, mimeType, loaderOptions, creationFlags, forcedExtension) {
    super(sceneOrEngine);
    this.url = null;
    this.uOffset = 0;
    this.vOffset = 0;
    this.uScale = 1;
    this.vScale = 1;
    this.uAng = 0;
    this.vAng = 0;
    this.wAng = 0;
    this.uRotationCenter = 0.5;
    this.vRotationCenter = 0.5;
    this.wRotationCenter = 0.5;
    this.homogeneousRotationInUVTransform = false;
    this.inspectableCustomProperties = null;
    this._noMipmap = false;
    this._invertY = false;
    this._rowGenerationMatrix = null;
    this._cachedTextureMatrix = null;
    this._projectionModeMatrix = null;
    this._t0 = null;
    this._t1 = null;
    this._t2 = null;
    this._cachedUOffset = -1;
    this._cachedVOffset = -1;
    this._cachedUScale = 0;
    this._cachedVScale = 0;
    this._cachedUAng = -1;
    this._cachedVAng = -1;
    this._cachedWAng = -1;
    this._cachedReflectionProjectionMatrixId = -1;
    this._cachedURotationCenter = -1;
    this._cachedVRotationCenter = -1;
    this._cachedWRotationCenter = -1;
    this._cachedHomogeneousRotationInUVTransform = false;
    this._cachedIdentity3x2 = true;
    this._cachedReflectionTextureMatrix = null;
    this._cachedReflectionUOffset = -1;
    this._cachedReflectionVOffset = -1;
    this._cachedReflectionUScale = 0;
    this._cachedReflectionVScale = 0;
    this._cachedReflectionCoordinatesMode = -1;
    this._buffer = null;
    this._deleteBuffer = false;
    this._format = null;
    this._delayedOnLoad = null;
    this._delayedOnError = null;
    this.onLoadObservable = new Observable();
    this._isBlocking = true;
    this.name = url || "";
    this.url = url;
    let noMipmap;
    let useSRGBBuffer = false;
    let internalTexture = null;
    let gammaSpace = true;
    if (typeof noMipmapOrOptions === "object" && noMipmapOrOptions !== null) {
      noMipmap = noMipmapOrOptions.noMipmap ?? false;
      invertY = noMipmapOrOptions.invertY ?? !useOpenGLOrientationForUV;
      samplingMode = noMipmapOrOptions.samplingMode ?? _Texture.TRILINEAR_SAMPLINGMODE;
      onLoad = noMipmapOrOptions.onLoad ?? null;
      onError = noMipmapOrOptions.onError ?? null;
      buffer = noMipmapOrOptions.buffer ?? null;
      deleteBuffer = noMipmapOrOptions.deleteBuffer ?? false;
      format = noMipmapOrOptions.format;
      mimeType = noMipmapOrOptions.mimeType;
      loaderOptions = noMipmapOrOptions.loaderOptions;
      creationFlags = noMipmapOrOptions.creationFlags;
      useSRGBBuffer = noMipmapOrOptions.useSRGBBuffer ?? false;
      internalTexture = noMipmapOrOptions.internalTexture ?? null;
      gammaSpace = noMipmapOrOptions.gammaSpace ?? gammaSpace;
    } else {
      noMipmap = !!noMipmapOrOptions;
    }
    this._gammaSpace = gammaSpace;
    this._noMipmap = noMipmap;
    this._invertY = invertY === void 0 ? !useOpenGLOrientationForUV : invertY;
    this._initialSamplingMode = samplingMode;
    this._buffer = buffer;
    this._deleteBuffer = deleteBuffer;
    this._mimeType = mimeType;
    this._loaderOptions = loaderOptions;
    this._creationFlags = creationFlags;
    this._useSRGBBuffer = useSRGBBuffer;
    this._forcedExtension = forcedExtension;
    if (format) {
      this._format = format;
    }
    const scene = this.getScene();
    const engine = this._getEngine();
    if (!engine) {
      return;
    }
    engine.onBeforeTextureInitObservable.notifyObservers(this);
    const load = () => {
      if (this._texture) {
        if (this._texture._invertVScale) {
          this.vScale *= -1;
          this.vOffset += 1;
        }
        if (this._texture._cachedWrapU !== null) {
          this.wrapU = this._texture._cachedWrapU;
          this._texture._cachedWrapU = null;
        }
        if (this._texture._cachedWrapV !== null) {
          this.wrapV = this._texture._cachedWrapV;
          this._texture._cachedWrapV = null;
        }
        if (this._texture._cachedWrapR !== null) {
          this.wrapR = this._texture._cachedWrapR;
          this._texture._cachedWrapR = null;
        }
      }
      if (this.onLoadObservable.hasObservers()) {
        this.onLoadObservable.notifyObservers(this);
      }
      if (onLoad) {
        onLoad();
      }
      if (!this.isBlocking && scene) {
        scene.resetCachedMaterial();
      }
    };
    const errorHandler = (message, exception) => {
      this._loadingError = true;
      this._errorObject = {
        message,
        exception
      };
      if (onError) {
        onError(message, exception);
      }
      _Texture.OnTextureLoadErrorObservable.notifyObservers(this);
    };
    if (!this.url && !internalTexture) {
      this._delayedOnLoad = load;
      this._delayedOnError = errorHandler;
      return;
    }
    this._texture = internalTexture ?? this._getFromCache(this.url, noMipmap, samplingMode, this._invertY, useSRGBBuffer, this.isCube);
    if (!this._texture) {
      if (!scene || !scene.useDelayedTextureLoading) {
        try {
          this._texture = engine.createTexture(this.url, noMipmap, this._invertY, scene, samplingMode, load, errorHandler, this._buffer, void 0, this._format, this._forcedExtension, mimeType, loaderOptions, creationFlags, useSRGBBuffer);
        } catch (e) {
          errorHandler("error loading", e);
          throw e;
        }
        if (deleteBuffer) {
          this._buffer = null;
        }
      } else {
        this.delayLoadState = 4;
        this._delayedOnLoad = load;
        this._delayedOnError = errorHandler;
      }
    } else {
      if (this._texture.isReady) {
        TimingTools.SetImmediate(() => load());
      } else {
        const loadObserver = this._texture.onLoadedObservable.add(load);
        this._texture.onErrorObservable.add((e) => {
          errorHandler(e.message, e.exception);
          this._texture?.onLoadedObservable.remove(loadObserver);
        });
      }
    }
  }
  /**
   * Update the url (and optional buffer) of this texture if url was null during construction.
   * @param url the url of the texture
   * @param buffer the buffer of the texture (defaults to null)
   * @param onLoad callback called when the texture is loaded  (defaults to null)
   * @param forcedExtension defines the extension to use to pick the right loader
   */
  updateURL(url, buffer = null, onLoad, forcedExtension) {
    if (this.url) {
      this.releaseInternalTexture();
      this.getScene().markAllMaterialsAsDirty(1, (mat) => {
        return mat.hasTexture(this);
      });
    }
    if (!this.name || this.name.startsWith("data:")) {
      this.name = url;
    }
    this.url = url;
    this._buffer = buffer;
    this._forcedExtension = forcedExtension;
    this.delayLoadState = 4;
    if (onLoad) {
      this._delayedOnLoad = onLoad;
    }
    this.delayLoad();
  }
  /**
   * Finish the loading sequence of a texture flagged as delayed load.
   * @internal
   */
  delayLoad() {
    if (this.delayLoadState !== 4) {
      return;
    }
    const scene = this.getScene();
    if (!scene) {
      return;
    }
    this.delayLoadState = 1;
    this._texture = this._getFromCache(this.url, this._noMipmap, this.samplingMode, this._invertY, this._useSRGBBuffer, this.isCube);
    if (!this._texture) {
      this._texture = scene.getEngine().createTexture(this.url, this._noMipmap, this._invertY, scene, this.samplingMode, this._delayedOnLoad, this._delayedOnError, this._buffer, null, this._format, this._forcedExtension, this._mimeType, this._loaderOptions, this._creationFlags, this._useSRGBBuffer);
      if (this._deleteBuffer) {
        this._buffer = null;
      }
    } else {
      if (this._delayedOnLoad) {
        if (this._texture.isReady) {
          TimingTools.SetImmediate(this._delayedOnLoad);
        } else {
          this._texture.onLoadedObservable.add(this._delayedOnLoad);
        }
      }
    }
    this._delayedOnLoad = null;
    this._delayedOnError = null;
  }
  _prepareRowForTextureGeneration(x, y, z, t) {
    x *= this._cachedUScale;
    y *= this._cachedVScale;
    x -= this.uRotationCenter * this._cachedUScale;
    y -= this.vRotationCenter * this._cachedVScale;
    z -= this.wRotationCenter;
    Vector3.TransformCoordinatesFromFloatsToRef(x, y, z, this._rowGenerationMatrix, t);
    t.x += this.uRotationCenter * this._cachedUScale + this._cachedUOffset;
    t.y += this.vRotationCenter * this._cachedVScale + this._cachedVOffset;
    t.z += this.wRotationCenter;
  }
  /**
   * Get the current texture matrix which includes the requested offsetting, tiling and rotation components.
   * @param uBase The horizontal base offset multiplier (1 by default)
   * @returns the transform matrix of the texture.
   */
  getTextureMatrix(uBase = 1) {
    if (this.uOffset === this._cachedUOffset && this.vOffset === this._cachedVOffset && this.uScale * uBase === this._cachedUScale && this.vScale === this._cachedVScale && this.uAng === this._cachedUAng && this.vAng === this._cachedVAng && this.wAng === this._cachedWAng && this.uRotationCenter === this._cachedURotationCenter && this.vRotationCenter === this._cachedVRotationCenter && this.wRotationCenter === this._cachedWRotationCenter && this.homogeneousRotationInUVTransform === this._cachedHomogeneousRotationInUVTransform) {
      return this._cachedTextureMatrix;
    }
    this._cachedUOffset = this.uOffset;
    this._cachedVOffset = this.vOffset;
    this._cachedUScale = this.uScale * uBase;
    this._cachedVScale = this.vScale;
    this._cachedUAng = this.uAng;
    this._cachedVAng = this.vAng;
    this._cachedWAng = this.wAng;
    this._cachedURotationCenter = this.uRotationCenter;
    this._cachedVRotationCenter = this.vRotationCenter;
    this._cachedWRotationCenter = this.wRotationCenter;
    this._cachedHomogeneousRotationInUVTransform = this.homogeneousRotationInUVTransform;
    if (!this._cachedTextureMatrix || !this._rowGenerationMatrix) {
      this._cachedTextureMatrix = Matrix.Zero();
      this._rowGenerationMatrix = new Matrix();
      this._t0 = Vector3.Zero();
      this._t1 = Vector3.Zero();
      this._t2 = Vector3.Zero();
    }
    Matrix.RotationYawPitchRollToRef(this.vAng, this.uAng, this.wAng, this._rowGenerationMatrix);
    if (this.homogeneousRotationInUVTransform) {
      Matrix.TranslationToRef(-this._cachedURotationCenter, -this._cachedVRotationCenter, -this._cachedWRotationCenter, TmpVectors.Matrix[0]);
      Matrix.TranslationToRef(this._cachedURotationCenter, this._cachedVRotationCenter, this._cachedWRotationCenter, TmpVectors.Matrix[1]);
      Matrix.ScalingToRef(this._cachedUScale, this._cachedVScale, 0, TmpVectors.Matrix[2]);
      Matrix.TranslationToRef(this._cachedUOffset, this._cachedVOffset, 0, TmpVectors.Matrix[3]);
      TmpVectors.Matrix[0].multiplyToRef(this._rowGenerationMatrix, this._cachedTextureMatrix);
      this._cachedTextureMatrix.multiplyToRef(TmpVectors.Matrix[1], this._cachedTextureMatrix);
      this._cachedTextureMatrix.multiplyToRef(TmpVectors.Matrix[2], this._cachedTextureMatrix);
      this._cachedTextureMatrix.multiplyToRef(TmpVectors.Matrix[3], this._cachedTextureMatrix);
      this._cachedTextureMatrix.setRowFromFloats(2, this._cachedTextureMatrix.m[12], this._cachedTextureMatrix.m[13], this._cachedTextureMatrix.m[14], 1);
    } else {
      this._prepareRowForTextureGeneration(0, 0, 0, this._t0);
      this._prepareRowForTextureGeneration(1, 0, 0, this._t1);
      this._prepareRowForTextureGeneration(0, 1, 0, this._t2);
      this._t1.subtractInPlace(this._t0);
      this._t2.subtractInPlace(this._t0);
      Matrix.FromValuesToRef(this._t1.x, this._t1.y, this._t1.z, 0, this._t2.x, this._t2.y, this._t2.z, 0, this._t0.x, this._t0.y, this._t0.z, 0, 0, 0, 0, 1, this._cachedTextureMatrix);
    }
    const scene = this.getScene();
    if (!scene) {
      return this._cachedTextureMatrix;
    }
    const previousIdentity3x2 = this._cachedIdentity3x2;
    this._cachedIdentity3x2 = this._cachedTextureMatrix.isIdentityAs3x2();
    if (this.optimizeUVAllocation && previousIdentity3x2 !== this._cachedIdentity3x2) {
      scene.markAllMaterialsAsDirty(1, (mat) => {
        return mat.hasTexture(this);
      });
    }
    return this._cachedTextureMatrix;
  }
  /**
   * Get the current matrix used to apply reflection. This is useful to rotate an environment texture for instance.
   * @returns The reflection texture transform
   */
  getReflectionTextureMatrix() {
    const scene = this.getScene();
    if (!scene) {
      return this._cachedReflectionTextureMatrix;
    }
    if (this.uOffset === this._cachedReflectionUOffset && this.vOffset === this._cachedReflectionVOffset && this.uScale === this._cachedReflectionUScale && this.vScale === this._cachedReflectionVScale && this.coordinatesMode === this._cachedReflectionCoordinatesMode) {
      if (this.coordinatesMode === _Texture.PROJECTION_MODE) {
        if (this._cachedReflectionProjectionMatrixId === scene.getProjectionMatrix().updateFlag) {
          return this._cachedReflectionTextureMatrix;
        }
      } else {
        return this._cachedReflectionTextureMatrix;
      }
    }
    if (!this._cachedReflectionTextureMatrix) {
      this._cachedReflectionTextureMatrix = Matrix.Zero();
    }
    if (!this._projectionModeMatrix) {
      this._projectionModeMatrix = Matrix.Zero();
    }
    const flagMaterialsAsTextureDirty = this._cachedReflectionCoordinatesMode !== this.coordinatesMode;
    this._cachedReflectionUOffset = this.uOffset;
    this._cachedReflectionVOffset = this.vOffset;
    this._cachedReflectionUScale = this.uScale;
    this._cachedReflectionVScale = this.vScale;
    this._cachedReflectionCoordinatesMode = this.coordinatesMode;
    switch (this.coordinatesMode) {
      case _Texture.PLANAR_MODE: {
        Matrix.IdentityToRef(this._cachedReflectionTextureMatrix);
        this._cachedReflectionTextureMatrix[0] = this.uScale;
        this._cachedReflectionTextureMatrix[5] = this.vScale;
        this._cachedReflectionTextureMatrix[12] = this.uOffset;
        this._cachedReflectionTextureMatrix[13] = this.vOffset;
        break;
      }
      case _Texture.PROJECTION_MODE: {
        Matrix.FromValuesToRef(0.5, 0, 0, 0, 0, -0.5, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 1, 1, this._projectionModeMatrix);
        const projectionMatrix = scene.getProjectionMatrix();
        this._cachedReflectionProjectionMatrixId = projectionMatrix.updateFlag;
        projectionMatrix.multiplyToRef(this._projectionModeMatrix, this._cachedReflectionTextureMatrix);
        break;
      }
      default:
        Matrix.IdentityToRef(this._cachedReflectionTextureMatrix);
        break;
    }
    if (flagMaterialsAsTextureDirty) {
      scene.markAllMaterialsAsDirty(1, (mat) => {
        return mat.hasTexture(this);
      });
    }
    return this._cachedReflectionTextureMatrix;
  }
  /**
   * Clones the texture.
   * @returns the cloned texture
   */
  clone() {
    const options = {
      noMipmap: this._noMipmap,
      invertY: this._invertY,
      samplingMode: this.samplingMode,
      onLoad: void 0,
      onError: void 0,
      buffer: this._texture ? this._texture._buffer : void 0,
      deleteBuffer: this._deleteBuffer,
      format: this.textureFormat,
      mimeType: this.mimeType,
      loaderOptions: this._loaderOptions,
      creationFlags: this._creationFlags,
      useSRGBBuffer: this._useSRGBBuffer
    };
    return SerializationHelper.Clone(() => {
      return new _Texture(this._texture ? this._texture.url : null, this.getScene(), options);
    }, this);
  }
  /**
   * Serialize the texture to a JSON representation we can easily use in the respective Parse function.
   * @returns The JSON representation of the texture
   */
  serialize() {
    const savedName = this.name;
    if (!_Texture.SerializeBuffers) {
      if (this.name.startsWith("data:")) {
        this.name = "";
      }
    }
    if (this.name.startsWith("data:") && this.url === this.name) {
      this.url = "";
    }
    const serializationObject = super.serialize(_Texture._SerializeInternalTextureUniqueId);
    if (!serializationObject) {
      return null;
    }
    if (_Texture.SerializeBuffers || _Texture.ForceSerializeBuffers) {
      if (typeof this._buffer === "string" && this._buffer.substr(0, 5) === "data:") {
        serializationObject.base64String = this._buffer;
        serializationObject.name = serializationObject.name.replace("data:", "");
      } else if (this.url && this.url.startsWith("data:") && this._buffer instanceof Uint8Array) {
        serializationObject.base64String = "data:image/png;base64," + EncodeArrayBufferToBase64(this._buffer);
      } else if (_Texture.ForceSerializeBuffers || this.url && this.url.startsWith("blob:") || this._forceSerialize) {
        serializationObject.base64String = !this._engine || this._engine._features.supportSyncTextureRead ? GenerateBase64StringFromTexture(this) : GenerateBase64StringFromTextureAsync(this);
      }
    }
    serializationObject.invertY = this._invertY;
    serializationObject.samplingMode = this.samplingMode;
    serializationObject._creationFlags = this._creationFlags;
    serializationObject._useSRGBBuffer = this._useSRGBBuffer;
    if (_Texture._SerializeInternalTextureUniqueId) {
      serializationObject.internalTextureUniqueId = this._texture?.uniqueId ?? void 0;
    }
    serializationObject.noMipmap = this._noMipmap;
    this.name = savedName;
    return serializationObject;
  }
  /**
   * Get the current class name of the texture useful for serialization or dynamic coding.
   * @returns "Texture"
   */
  getClassName() {
    return "Texture";
  }
  /**
   * Dispose the texture and release its associated resources.
   */
  dispose() {
    super.dispose();
    this.onLoadObservable.clear();
    this._delayedOnLoad = null;
    this._delayedOnError = null;
    this._buffer = null;
  }
  /**
   * Parse the JSON representation of a texture in order to recreate the texture in the given scene.
   * @param parsedTexture Define the JSON representation of the texture
   * @param scene Define the scene the parsed texture should be instantiated in
   * @param rootUrl Define the root url of the parsing sequence in the case of relative dependencies
   * @returns The parsed texture if successful
   */
  static Parse(parsedTexture, scene, rootUrl) {
    if (parsedTexture.customType) {
      const customTexture = InstantiationTools.Instantiate(parsedTexture.customType);
      const parsedCustomTexture = customTexture.Parse(parsedTexture, scene, rootUrl);
      if (parsedTexture.samplingMode && parsedCustomTexture.updateSamplingMode && parsedCustomTexture._samplingMode) {
        if (parsedCustomTexture._samplingMode !== parsedTexture.samplingMode) {
          parsedCustomTexture.updateSamplingMode(parsedTexture.samplingMode);
        }
      }
      return parsedCustomTexture;
    }
    if (parsedTexture.isCube && !parsedTexture.isRenderTarget) {
      return _Texture._CubeTextureParser(parsedTexture, scene, rootUrl);
    }
    const hasInternalTextureUniqueId = parsedTexture.internalTextureUniqueId !== void 0;
    if (!parsedTexture.name && !parsedTexture.isRenderTarget && !hasInternalTextureUniqueId) {
      return null;
    }
    let internalTexture;
    if (hasInternalTextureUniqueId) {
      const cache = scene.getEngine().getLoadedTexturesCache();
      for (const texture2 of cache) {
        if (texture2.uniqueId === parsedTexture.internalTextureUniqueId) {
          internalTexture = texture2;
          break;
        }
      }
    }
    const onLoaded = (texture2) => {
      if (texture2 && texture2._texture) {
        texture2._texture._cachedWrapU = null;
        texture2._texture._cachedWrapV = null;
        texture2._texture._cachedWrapR = null;
      }
      if (parsedTexture.samplingMode) {
        const sampling = parsedTexture.samplingMode;
        if (texture2 && texture2.samplingMode !== sampling) {
          texture2.updateSamplingMode(sampling);
        }
      }
      if (texture2 && parsedTexture.animations) {
        for (let animationIndex = 0; animationIndex < parsedTexture.animations.length; animationIndex++) {
          const parsedAnimation = parsedTexture.animations[animationIndex];
          const internalClass = GetClass("BABYLON.Animation");
          if (internalClass) {
            texture2.animations.push(internalClass.Parse(parsedAnimation));
          }
        }
      }
      if (hasInternalTextureUniqueId && !internalTexture) {
        texture2?._texture?._setUniqueId(parsedTexture.internalTextureUniqueId);
      }
    };
    const texture = SerializationHelper.Parse(() => {
      let generateMipMaps = true;
      if (parsedTexture.noMipmap) {
        generateMipMaps = false;
      }
      if (parsedTexture.mirrorPlane) {
        const mirrorTexture = _Texture._CreateMirror(parsedTexture.name, parsedTexture.renderTargetSize, scene, generateMipMaps);
        mirrorTexture._waitingRenderList = parsedTexture.renderList;
        mirrorTexture.mirrorPlane = Plane.FromArray(parsedTexture.mirrorPlane);
        onLoaded(mirrorTexture);
        return mirrorTexture;
      } else if (parsedTexture.isRenderTarget) {
        let renderTargetTexture = null;
        if (parsedTexture.isCube) {
          if (scene.reflectionProbes) {
            for (let index = 0; index < scene.reflectionProbes.length; index++) {
              const probe = scene.reflectionProbes[index];
              if (probe.name === parsedTexture.name) {
                return probe.cubeTexture;
              }
            }
          }
        } else {
          renderTargetTexture = _Texture._CreateRenderTargetTexture(parsedTexture.name, parsedTexture.renderTargetSize, scene, generateMipMaps, parsedTexture._creationFlags ?? 0);
          renderTargetTexture._waitingRenderList = parsedTexture.renderList;
        }
        onLoaded(renderTargetTexture);
        return renderTargetTexture;
      } else if (parsedTexture.isVideo) {
        const texture2 = _Texture._CreateVideoTexture(rootUrl + (parsedTexture.url || parsedTexture.name), rootUrl + (parsedTexture.src || parsedTexture.url), scene, generateMipMaps, parsedTexture.invertY, parsedTexture.samplingMode, parsedTexture.settings || {});
        onLoaded(texture2);
        return texture2;
      } else {
        let texture2;
        if (parsedTexture.base64String && !internalTexture) {
          texture2 = _Texture.CreateFromBase64String(parsedTexture.base64String, parsedTexture.base64String, scene, !generateMipMaps, parsedTexture.invertY, parsedTexture.samplingMode, () => {
            onLoaded(texture2);
          }, parsedTexture._creationFlags ?? 0, parsedTexture._useSRGBBuffer ?? false);
          texture2.name = parsedTexture.name;
        } else {
          let url;
          if (parsedTexture.name && (parsedTexture.name.indexOf("://") > 0 || parsedTexture.name.startsWith("data:"))) {
            url = parsedTexture.name;
          } else {
            url = rootUrl + parsedTexture.name;
          }
          if (parsedTexture.url && (parsedTexture.url.startsWith("data:") || _Texture.UseSerializedUrlIfAny)) {
            url = parsedTexture.url;
          }
          const options = {
            noMipmap: !generateMipMaps,
            invertY: parsedTexture.invertY,
            samplingMode: parsedTexture.samplingMode,
            onLoad: () => {
              onLoaded(texture2);
            },
            internalTexture
          };
          texture2 = new _Texture(url, scene, options);
        }
        return texture2;
      }
    }, parsedTexture, scene);
    return texture;
  }
  /**
   * Creates a texture from its base 64 representation.
   * @param data Define the base64 payload without the data: prefix
   * @param name Define the name of the texture in the scene useful fo caching purpose for instance
   * @param scene Define the scene the texture should belong to
   * @param noMipmapOrOptions defines if the texture will require mip maps or not or set of all options to create the texture
   * @param invertY define if the texture needs to be inverted on the y axis during loading
   * @param samplingMode define the sampling mode we want for the texture while fetching from it (Texture.NEAREST_SAMPLINGMODE...)
   * @param onLoad define a callback triggered when the texture has been loaded
   * @param onError define a callback triggered when an error occurred during the loading session
   * @param format define the format of the texture we are trying to load (Engine.TEXTUREFORMAT_RGBA...)
   * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
   * @param forcedExtension defines the extension to use to pick the right loader
   * @returns the created texture
   */
  static CreateFromBase64String(data, name2, scene, noMipmapOrOptions, invertY, samplingMode = _Texture.TRILINEAR_SAMPLINGMODE, onLoad = null, onError = null, format = 5, creationFlags, forcedExtension) {
    return new _Texture("data:" + name2, scene, noMipmapOrOptions, invertY, samplingMode, onLoad, onError, data, false, format, void 0, void 0, creationFlags, forcedExtension);
  }
  /**
   * Creates a texture from its data: representation. (data: will be added in case only the payload has been passed in)
   * @param name Define the name of the texture in the scene useful fo caching purpose for instance
   * @param buffer define the buffer to load the texture from in case the texture is loaded from a buffer representation
   * @param scene Define the scene the texture should belong to
   * @param deleteBuffer define if the buffer we are loading the texture from should be deleted after load
   * @param noMipmapOrOptions defines if the texture will require mip maps or not or set of all options to create the texture
   * @param invertY define if the texture needs to be inverted on the y axis during loading
   * @param samplingMode define the sampling mode we want for the texture while fetching from it (Texture.NEAREST_SAMPLINGMODE...)
   * @param onLoad define a callback triggered when the texture has been loaded
   * @param onError define a callback triggered when an error occurred during the loading session
   * @param format define the format of the texture we are trying to load (Engine.TEXTUREFORMAT_RGBA...)
   * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
   * @param forcedExtension defines the extension to use to pick the right loader
   * @returns the created texture
   */
  static LoadFromDataString(name2, buffer, scene, deleteBuffer = false, noMipmapOrOptions, invertY = true, samplingMode = _Texture.TRILINEAR_SAMPLINGMODE, onLoad = null, onError = null, format = 5, creationFlags, forcedExtension) {
    if (name2.substr(0, 5) !== "data:") {
      name2 = "data:" + name2;
    }
    return new _Texture(name2, scene, noMipmapOrOptions, invertY, samplingMode, onLoad, onError, buffer, deleteBuffer, format, void 0, void 0, creationFlags, forcedExtension);
  }
};
Texture.SerializeBuffers = true;
Texture.ForceSerializeBuffers = false;
Texture.OnTextureLoadErrorObservable = new Observable();
Texture._SerializeInternalTextureUniqueId = false;
Texture._CubeTextureParser = (jsonTexture, scene, rootUrl) => {
  throw _WarnImport("CubeTexture");
};
Texture._CreateMirror = (name2, renderTargetSize, scene, generateMipMaps) => {
  throw _WarnImport("MirrorTexture");
};
Texture._CreateRenderTargetTexture = (name2, renderTargetSize, scene, generateMipMaps, creationFlags) => {
  throw _WarnImport("RenderTargetTexture");
};
Texture.NEAREST_SAMPLINGMODE = 1;
Texture.NEAREST_NEAREST_MIPLINEAR = 8;
Texture.BILINEAR_SAMPLINGMODE = 2;
Texture.LINEAR_LINEAR_MIPNEAREST = 11;
Texture.TRILINEAR_SAMPLINGMODE = 3;
Texture.LINEAR_LINEAR_MIPLINEAR = 3;
Texture.NEAREST_NEAREST_MIPNEAREST = 4;
Texture.NEAREST_LINEAR_MIPNEAREST = 5;
Texture.NEAREST_LINEAR_MIPLINEAR = 6;
Texture.NEAREST_LINEAR = 7;
Texture.NEAREST_NEAREST = 1;
Texture.LINEAR_NEAREST_MIPNEAREST = 9;
Texture.LINEAR_NEAREST_MIPLINEAR = 10;
Texture.LINEAR_LINEAR = 2;
Texture.LINEAR_NEAREST = 12;
Texture.EXPLICIT_MODE = 0;
Texture.SPHERICAL_MODE = 1;
Texture.PLANAR_MODE = 2;
Texture.CUBIC_MODE = 3;
Texture.PROJECTION_MODE = 4;
Texture.SKYBOX_MODE = 5;
Texture.INVCUBIC_MODE = 6;
Texture.EQUIRECTANGULAR_MODE = 7;
Texture.FIXED_EQUIRECTANGULAR_MODE = 8;
Texture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE = 9;
Texture.CLAMP_ADDRESSMODE = 0;
Texture.WRAP_ADDRESSMODE = 1;
Texture.MIRROR_ADDRESSMODE = 2;
Texture.UseSerializedUrlIfAny = false;
__decorate([serialize()], Texture.prototype, "url", void 0);
__decorate([serialize()], Texture.prototype, "uOffset", void 0);
__decorate([serialize()], Texture.prototype, "vOffset", void 0);
__decorate([serialize()], Texture.prototype, "uScale", void 0);
__decorate([serialize()], Texture.prototype, "vScale", void 0);
__decorate([serialize()], Texture.prototype, "uAng", void 0);
__decorate([serialize()], Texture.prototype, "vAng", void 0);
__decorate([serialize()], Texture.prototype, "wAng", void 0);
__decorate([serialize()], Texture.prototype, "uRotationCenter", void 0);
__decorate([serialize()], Texture.prototype, "vRotationCenter", void 0);
__decorate([serialize()], Texture.prototype, "wRotationCenter", void 0);
__decorate([serialize()], Texture.prototype, "homogeneousRotationInUVTransform", void 0);
__decorate([serialize()], Texture.prototype, "isBlocking", null);
RegisterClass("BABYLON.Texture", Texture);
SerializationHelper._TextureParser = Texture.Parse;

// node_modules/@babylonjs/core/Misc/uniqueIdGenerator.js
var UniqueIdGenerator = class {
  /**
   * Gets an unique (relatively to the current scene) Id
   */
  static get UniqueId() {
    const result = this._UniqueIdCounter;
    this._UniqueIdCounter++;
    return result;
  }
};
UniqueIdGenerator._UniqueIdCounter = 1;

// node_modules/@babylonjs/core/Misc/perfCounter.js
var PerfCounter = class _PerfCounter {
  /**
   * Returns the smallest value ever
   */
  get min() {
    return this._min;
  }
  /**
   * Returns the biggest value ever
   */
  get max() {
    return this._max;
  }
  /**
   * Returns the average value since the performance counter is running
   */
  get average() {
    return this._average;
  }
  /**
   * Returns the average value of the last second the counter was monitored
   */
  get lastSecAverage() {
    return this._lastSecAverage;
  }
  /**
   * Returns the current value
   */
  get current() {
    return this._current;
  }
  /**
   * Gets the accumulated total
   */
  get total() {
    return this._totalAccumulated;
  }
  /**
   * Gets the total value count
   */
  get count() {
    return this._totalValueCount;
  }
  /**
   * Creates a new counter
   */
  constructor() {
    this._startMonitoringTime = 0;
    this._min = 0;
    this._max = 0;
    this._average = 0;
    this._lastSecAverage = 0;
    this._current = 0;
    this._totalValueCount = 0;
    this._totalAccumulated = 0;
    this._lastSecAccumulated = 0;
    this._lastSecTime = 0;
    this._lastSecValueCount = 0;
  }
  /**
   * Call this method to start monitoring a new frame.
   * This scenario is typically used when you accumulate monitoring time many times for a single frame, you call this method at the start of the frame, then beginMonitoring to start recording and endMonitoring(false) to accumulated the recorded time to the PerfCounter or addCount() to accumulate a monitored count.
   */
  fetchNewFrame() {
    this._totalValueCount++;
    this._current = 0;
    this._lastSecValueCount++;
  }
  /**
   * Call this method to monitor a count of something (e.g. mesh drawn in viewport count)
   * @param newCount the count value to add to the monitored count
   * @param fetchResult true when it's the last time in the frame you add to the counter and you wish to update the statistics properties (min/max/average), false if you only want to update statistics.
   */
  addCount(newCount, fetchResult) {
    if (!_PerfCounter.Enabled) {
      return;
    }
    this._current += newCount;
    if (fetchResult) {
      this._fetchResult();
    }
  }
  /**
   * Start monitoring this performance counter
   */
  beginMonitoring() {
    if (!_PerfCounter.Enabled) {
      return;
    }
    this._startMonitoringTime = PrecisionDate.Now;
  }
  /**
   * Compute the time lapsed since the previous beginMonitoring() call.
   * @param newFrame true by default to fetch the result and monitor a new frame, if false the time monitored will be added to the current frame counter
   */
  endMonitoring(newFrame = true) {
    if (!_PerfCounter.Enabled) {
      return;
    }
    if (newFrame) {
      this.fetchNewFrame();
    }
    const currentTime = PrecisionDate.Now;
    this._current = currentTime - this._startMonitoringTime;
    if (newFrame) {
      this._fetchResult();
    }
  }
  /**
   * Call this method to end the monitoring of a frame.
   * This scenario is typically used when you accumulate monitoring time many times for a single frame, you call this method at the end of the frame, after beginMonitoring to start recording and endMonitoring(false) to accumulated the recorded time to the PerfCounter or addCount() to accumulate a monitored count.
   */
  endFrame() {
    this._fetchResult();
  }
  /** @internal */
  _fetchResult() {
    this._totalAccumulated += this._current;
    this._lastSecAccumulated += this._current;
    this._min = Math.min(this._min, this._current);
    this._max = Math.max(this._max, this._current);
    this._average = this._totalAccumulated / this._totalValueCount;
    const now = PrecisionDate.Now;
    if (now - this._lastSecTime > 1e3) {
      this._lastSecAverage = this._lastSecAccumulated / this._lastSecValueCount;
      this._lastSecTime = now;
      this._lastSecAccumulated = 0;
      this._lastSecValueCount = 0;
    }
  }
};
PerfCounter.Enabled = true;

// node_modules/@babylonjs/core/Engines/WebGPU/webgpuPerfCounter.js
var WebGPUPerfCounter = class {
  constructor() {
    this._gpuTimeInFrameId = -1;
    this.counter = new PerfCounter();
  }
  /**
   * @internal
   */
  _addDuration(currentFrameId, duration) {
    if (currentFrameId < this._gpuTimeInFrameId) {
      return;
    }
    if (this._gpuTimeInFrameId !== currentFrameId) {
      this.counter._fetchResult();
      this.counter.fetchNewFrame();
      this.counter.addCount(duration, false);
      this._gpuTimeInFrameId = currentFrameId;
    } else {
      this.counter.addCount(duration, false);
    }
  }
};

// node_modules/@babylonjs/core/Compute/computeShader.js
var ComputeShader = class _ComputeShader {
  /**
   * The options used to create the shader
   */
  get options() {
    return this._options;
  }
  /**
   * The shaderPath used to create the shader
   */
  get shaderPath() {
    return this._shaderPath;
  }
  /**
   * Instantiates a new compute shader.
   * @param name Defines the name of the compute shader in the scene
   * @param engine Defines the engine the compute shader belongs to
   * @param shaderPath Defines the route to the shader code in one of three ways:
   *  * object: \{ compute: "custom" \}, used with ShaderStore.ShadersStoreWGSL["customComputeShader"]
   *  * object: \{ computeElement: "HTMLElementId" \}, used with shader code in script tags
   *  * object: \{ computeSource: "compute shader code string" \}, where the string contains the shader code
   *  * string: try first to find the code in ShaderStore.ShadersStoreWGSL[shaderPath + "ComputeShader"]. If not, assumes it is a file with name shaderPath.compute.fx in index.html folder.
   * @param options Define the options used to create the shader
   */
  constructor(name2, engine, shaderPath, options = {}) {
    this._bindings = {};
    this._samplers = {};
    this._contextIsDirty = false;
    this.fastMode = false;
    this.onCompiled = null;
    this.onError = null;
    this.name = name2;
    this._engine = engine;
    this.uniqueId = UniqueIdGenerator.UniqueId;
    if (engine.enableGPUTimingMeasurements) {
      this.gpuTimeInFrame = new WebGPUPerfCounter();
    }
    if (!this._engine.getCaps().supportComputeShaders) {
      Logger.Error("This engine does not support compute shaders!");
      return;
    }
    if (!options.bindingsMapping) {
      Logger.Error("You must provide the binding mappings as browsers don't support reflection for wgsl shaders yet!");
      return;
    }
    this._context = engine.createComputeContext();
    this._shaderPath = shaderPath;
    this._options = __spreadValues({
      bindingsMapping: {},
      defines: []
    }, options);
  }
  /**
   * Gets the current class name of the material e.g. "ComputeShader"
   * Mainly use in serialization.
   * @returns the class name
   */
  getClassName() {
    return "ComputeShader";
  }
  /**
   * Binds a texture to the shader
   * @param name Binding name of the texture
   * @param texture Texture to bind
   * @param bindSampler Bind the sampler corresponding to the texture (default: true). The sampler will be bound just before the binding index of the texture
   */
  setTexture(name2, texture, bindSampler = true) {
    const current = this._bindings[name2];
    this._bindings[name2] = {
      type: bindSampler ? 0 : 4,
      object: texture,
      indexInGroupEntries: current?.indexInGroupEntries
    };
    this._contextIsDirty || (this._contextIsDirty = !current || current.object !== texture || current.type !== this._bindings[name2].type);
  }
  /**
   * Binds a storage texture to the shader
   * @param name Binding name of the texture
   * @param texture Texture to bind
   */
  setStorageTexture(name2, texture) {
    const current = this._bindings[name2];
    this._contextIsDirty || (this._contextIsDirty = !current || current.object !== texture);
    this._bindings[name2] = {
      type: 1,
      object: texture,
      indexInGroupEntries: current?.indexInGroupEntries
    };
  }
  /**
   * Binds an external texture to the shader
   * @param name Binding name of the texture
   * @param texture Texture to bind
   */
  setExternalTexture(name2, texture) {
    const current = this._bindings[name2];
    this._contextIsDirty || (this._contextIsDirty = !current || current.object !== texture);
    this._bindings[name2] = {
      type: 6,
      object: texture,
      indexInGroupEntries: current?.indexInGroupEntries
    };
  }
  /**
   * Binds a video texture to the shader (by binding the external texture attached to this video)
   * @param name Binding name of the texture
   * @param texture Texture to bind
   * @returns true if the video texture was successfully bound, else false. false will be returned if the current engine does not support external textures
   */
  setVideoTexture(name2, texture) {
    if (texture.externalTexture) {
      this.setExternalTexture(name2, texture.externalTexture);
      return true;
    }
    return false;
  }
  /**
   * Binds a uniform buffer to the shader
   * @param name Binding name of the buffer
   * @param buffer Buffer to bind
   */
  setUniformBuffer(name2, buffer) {
    const current = this._bindings[name2];
    this._contextIsDirty || (this._contextIsDirty = !current || current.object !== buffer);
    this._bindings[name2] = {
      type: _ComputeShader._BufferIsDataBuffer(buffer) ? 7 : 2,
      object: buffer,
      indexInGroupEntries: current?.indexInGroupEntries
    };
  }
  /**
   * Binds a storage buffer to the shader
   * @param name Binding name of the buffer
   * @param buffer Buffer to bind
   */
  setStorageBuffer(name2, buffer) {
    const current = this._bindings[name2];
    this._contextIsDirty || (this._contextIsDirty = !current || current.object !== buffer);
    this._bindings[name2] = {
      type: _ComputeShader._BufferIsDataBuffer(buffer) ? 7 : 3,
      object: buffer,
      indexInGroupEntries: current?.indexInGroupEntries
    };
  }
  /**
   * Binds a texture sampler to the shader
   * @param name Binding name of the sampler
   * @param sampler Sampler to bind
   */
  setTextureSampler(name2, sampler) {
    const current = this._bindings[name2];
    this._contextIsDirty || (this._contextIsDirty = !current || !sampler.compareSampler(current.object));
    this._bindings[name2] = {
      type: 5,
      object: sampler,
      indexInGroupEntries: current?.indexInGroupEntries
    };
  }
  /**
   * Specifies that the compute shader is ready to be executed (the compute effect and all the resources are ready)
   * @returns true if the compute shader is ready to be executed
   */
  isReady() {
    let effect = this._effect;
    for (const key in this._bindings) {
      const binding = this._bindings[key], type = binding.type, object = binding.object;
      switch (type) {
        case 0:
        case 4:
        case 1: {
          const texture = object;
          if (!texture.isReady()) {
            return false;
          }
          break;
        }
        case 6: {
          const texture = object;
          if (!texture.isReady()) {
            return false;
          }
          break;
        }
      }
    }
    const defines = [];
    const shaderName = this._shaderPath;
    if (this._options.defines) {
      for (let index = 0; index < this._options.defines.length; index++) {
        defines.push(this._options.defines[index]);
      }
    }
    const join = defines.join("\n");
    if (this._cachedDefines !== join) {
      this._cachedDefines = join;
      effect = this._engine.createComputeEffect(shaderName, {
        defines: join,
        entryPoint: this._options.entryPoint,
        onCompiled: this.onCompiled,
        onError: this.onError
      });
      this._effect = effect;
    }
    if (!effect.isReady()) {
      return false;
    }
    return true;
  }
  /**
   * Dispatches (executes) the compute shader
   * @param x Number of workgroups to execute on the X dimension
   * @param y Number of workgroups to execute on the Y dimension (default: 1)
   * @param z Number of workgroups to execute on the Z dimension (default: 1)
   * @returns True if the dispatch could be done, else false (meaning either the compute effect or at least one of the bound resources was not ready)
   */
  dispatch(x, y, z) {
    if (!this.fastMode && !this._checkContext()) {
      return false;
    }
    this._engine.computeDispatch(this._effect, this._context, this._bindings, x, y, z, this._options.bindingsMapping, this.gpuTimeInFrame);
    return true;
  }
  /**
   * Dispatches (executes) the compute shader.
   * @param buffer Buffer containing the number of workgroups to execute on the X, Y and Z dimensions
   * @param offset Offset in the buffer where the workgroup counts are stored (default: 0)
   * @returns True if the dispatch could be done, else false (meaning either the compute effect or at least one of the bound resources was not ready)
   */
  dispatchIndirect(buffer, offset = 0) {
    if (!this.fastMode && !this._checkContext()) {
      return false;
    }
    const dataBuffer = _ComputeShader._BufferIsDataBuffer(buffer) ? buffer : buffer.getBuffer();
    this._engine.computeDispatchIndirect(this._effect, this._context, this._bindings, dataBuffer, offset, this._options.bindingsMapping, this.gpuTimeInFrame);
    return true;
  }
  _checkContext() {
    if (!this.isReady()) {
      return false;
    }
    for (const key in this._bindings) {
      const binding = this._bindings[key];
      if (!this._options.bindingsMapping[key]) {
        throw new Error("ComputeShader ('" + this.name + "'): No binding mapping has been provided for the property '" + key + "'");
      }
      switch (binding.type) {
        case 0: {
          const sampler = this._samplers[key];
          const texture = binding.object;
          if (!sampler || !texture._texture || !sampler.compareSampler(texture._texture)) {
            this._samplers[key] = new TextureSampler().setParameters(texture.wrapU, texture.wrapV, texture.wrapR, texture.anisotropicFilteringLevel, texture._texture.samplingMode, texture._texture?._comparisonFunction);
            this._contextIsDirty = true;
          }
          break;
        }
        case 6: {
          this._contextIsDirty = true;
          break;
        }
        case 2: {
          const ubo = binding.object;
          if (ubo.getBuffer() !== binding.buffer) {
            binding.buffer = ubo.getBuffer();
            this._contextIsDirty = true;
          }
          break;
        }
      }
    }
    if (this._contextIsDirty) {
      this._contextIsDirty = false;
      this._context.clear();
    }
    return true;
  }
  /**
   * Waits for the compute shader to be ready and executes it
   * @param x Number of workgroups to execute on the X dimension
   * @param y Number of workgroups to execute on the Y dimension (default: 1)
   * @param z Number of workgroups to execute on the Z dimension (default: 1)
   * @param delay Delay between the retries while the shader is not ready (in milliseconds - 10 by default)
   * @returns A promise that is resolved once the shader has been sent to the GPU. Note that it does not mean that the shader execution itself is finished!
   */
  dispatchWhenReady(x, y, z, delay = 10) {
    return new Promise((resolve) => {
      const check = () => {
        if (!this.dispatch(x, y, z)) {
          setTimeout(check, delay);
        } else {
          resolve();
        }
      };
      check();
    });
  }
  /**
   * Serializes this compute shader in a JSON representation
   * @returns the serialized compute shader object
   */
  serialize() {
    const serializationObject = SerializationHelper.Serialize(this);
    serializationObject.options = this._options;
    serializationObject.shaderPath = this._shaderPath;
    serializationObject.bindings = {};
    serializationObject.textures = {};
    for (const key in this._bindings) {
      const binding = this._bindings[key];
      const object = binding.object;
      switch (binding.type) {
        case 0:
        case 4:
        case 1: {
          const serializedData = object.serialize();
          if (serializedData) {
            serializationObject.textures[key] = serializedData;
            serializationObject.bindings[key] = {
              type: binding.type
            };
          }
          break;
        }
        case 2: {
          break;
        }
      }
    }
    return serializationObject;
  }
  /**
   * Creates a compute shader from parsed compute shader data
   * @param source defines the JSON representation of the compute shader
   * @param scene defines the hosting scene
   * @param rootUrl defines the root URL to use to load textures and relative dependencies
   * @returns a new compute shader
   */
  static Parse(source, scene, rootUrl) {
    const compute = SerializationHelper.Parse(() => new _ComputeShader(source.name, scene.getEngine(), source.shaderPath, source.options), source, scene, rootUrl);
    for (const key in source.textures) {
      const binding = source.bindings[key];
      const texture = Texture.Parse(source.textures[key], scene, rootUrl);
      if (binding.type === 0) {
        compute.setTexture(key, texture);
      } else if (binding.type === 4) {
        compute.setTexture(key, texture, false);
      } else {
        compute.setStorageTexture(key, texture);
      }
    }
    return compute;
  }
  static _BufferIsDataBuffer(buffer) {
    return buffer.underlyingResource !== void 0;
  }
};
__decorate([serialize()], ComputeShader.prototype, "name", void 0);
__decorate([serialize()], ComputeShader.prototype, "fastMode", void 0);
RegisterClass("BABYLON.ComputeShader", ComputeShader);

// node_modules/@babylonjs/core/Buffers/storageBuffer.js
var StorageBuffer = class {
  /**
   * Creates a new storage buffer instance
   * @param engine The engine the buffer will be created inside
   * @param size The size of the buffer in bytes
   * @param creationFlags flags to use when creating the buffer (see undefined). The BUFFER_CREATIONFLAG_STORAGE flag will be automatically added.
   * @param label defines the label of the buffer (for debug purpose)
   */
  constructor(engine, size, creationFlags = 3, label) {
    this._engine = engine;
    this._label = label;
    this._engine._storageBuffers.push(this);
    this._create(size, creationFlags);
  }
  _create(size, creationFlags) {
    this._bufferSize = size;
    this._creationFlags = creationFlags;
    this._buffer = this._engine.createStorageBuffer(size, creationFlags, this._label);
  }
  /** @internal */
  _rebuild() {
    this._create(this._bufferSize, this._creationFlags);
  }
  /**
   * Gets underlying native buffer
   * @returns underlying native buffer
   */
  getBuffer() {
    return this._buffer;
  }
  /**
   * Updates the storage buffer
   * @param data the data used to update the storage buffer
   * @param byteOffset the byte offset of the data (optional)
   * @param byteLength the byte length of the data (optional)
   */
  update(data, byteOffset, byteLength) {
    if (!this._buffer) {
      return;
    }
    this._engine.updateStorageBuffer(this._buffer, data, byteOffset, byteLength);
  }
  /**
   * Reads data from the storage buffer
   * @param offset The offset in the storage buffer to start reading from (default: 0)
   * @param size  The number of bytes to read from the storage buffer (default: capacity of the buffer)
   * @param buffer The buffer to write the data we have read from the storage buffer to (optional)
   * @param noDelay If true, a call to flushFramebuffer will be issued so that the data can be read back immediately. This can speed up data retrieval, at the cost of a small perf penalty (default: false).
   * @returns If not undefined, returns the (promise) buffer (as provided by the 4th parameter) filled with the data, else it returns a (promise) Uint8Array with the data read from the storage buffer
   */
  read(offset, size, buffer, noDelay) {
    return this._engine.readFromStorageBuffer(this._buffer, offset, size, buffer, noDelay);
  }
  /**
   * Disposes the storage buffer
   */
  dispose() {
    const storageBuffers = this._engine._storageBuffers;
    const index = storageBuffers.indexOf(this);
    if (index !== -1) {
      storageBuffers[index] = storageBuffers[storageBuffers.length - 1];
      storageBuffers.pop();
    }
    this._engine._releaseBuffer(this._buffer);
    this._buffer = null;
  }
};

// node_modules/@babylonjs/core/Misc/deepCopier.js
var CloneValue = (source, destinationObject, shallowCopyValues) => {
  if (!source) {
    return null;
  }
  if (source.getClassName && source.getClassName() === "Mesh") {
    return null;
  }
  if (source.getClassName && (source.getClassName() === "SubMesh" || source.getClassName() === "PhysicsBody")) {
    return source.clone(destinationObject);
  } else if (source.clone) {
    return source.clone();
  } else if (Array.isArray(source)) {
    return source.slice();
  } else if (shallowCopyValues && typeof source === "object") {
    return __spreadValues({}, source);
  }
  return null;
};
function GetAllPropertyNames(obj) {
  const props = [];
  do {
    Object.getOwnPropertyNames(obj).forEach(function(prop) {
      if (props.indexOf(prop) === -1) {
        props.push(prop);
      }
    });
  } while (obj = Object.getPrototypeOf(obj));
  return props;
}
var DeepCopier = class {
  /**
   * Tries to copy an object by duplicating every property
   * @param source defines the source object
   * @param destination defines the target object
   * @param doNotCopyList defines a list of properties to avoid
   * @param mustCopyList defines a list of properties to copy (even if they start with _)
   * @param shallowCopyValues defines wether properties referencing objects (none cloneable) must be shallow copied (false by default)
   * @remarks shallowCopyValues will not instantite the copied values which makes it only usable for "JSON objects"
   */
  static DeepCopy(source, destination, doNotCopyList, mustCopyList, shallowCopyValues = false) {
    const properties = GetAllPropertyNames(source);
    for (const prop of properties) {
      if (prop[0] === "_" && (!mustCopyList || mustCopyList.indexOf(prop) === -1)) {
        continue;
      }
      if (prop.endsWith("Observable")) {
        continue;
      }
      if (doNotCopyList && doNotCopyList.indexOf(prop) !== -1) {
        continue;
      }
      const sourceValue = source[prop];
      const typeOfSourceValue = typeof sourceValue;
      if (typeOfSourceValue === "function") {
        continue;
      }
      try {
        if (typeOfSourceValue === "object") {
          if (sourceValue instanceof Uint8Array) {
            destination[prop] = Uint8Array.from(sourceValue);
          } else if (sourceValue instanceof Array) {
            destination[prop] = [];
            if (sourceValue.length > 0) {
              if (typeof sourceValue[0] == "object") {
                for (let index = 0; index < sourceValue.length; index++) {
                  const clonedValue = CloneValue(sourceValue[index], destination, shallowCopyValues);
                  if (destination[prop].indexOf(clonedValue) === -1) {
                    destination[prop].push(clonedValue);
                  }
                }
              } else {
                destination[prop] = sourceValue.slice(0);
              }
            }
          } else {
            destination[prop] = CloneValue(sourceValue, destination, shallowCopyValues);
          }
        } else {
          destination[prop] = sourceValue;
        }
      } catch (e) {
        Logger.Warn(e.message);
      }
    }
  }
};

// node_modules/@babylonjs/core/Misc/tools.js
var Tools = class _Tools {
  /**
   * Gets or sets the base URL to use to load assets
   */
  static get BaseUrl() {
    return FileToolsOptions.BaseUrl;
  }
  static set BaseUrl(value) {
    FileToolsOptions.BaseUrl = value;
  }
  /**
   * Gets or sets the clean URL function to use to load assets
   */
  static get CleanUrl() {
    return FileToolsOptions.CleanUrl;
  }
  static set CleanUrl(value) {
    FileToolsOptions.CleanUrl = value;
  }
  /**
   * This function checks whether a URL is absolute or not.
   * It will also detect data and blob URLs
   * @param url the url to check
   * @returns is the url absolute or relative
   */
  static IsAbsoluteUrl(url) {
    if (url.indexOf("//") === 0) {
      return true;
    }
    if (url.indexOf("://") === -1) {
      return false;
    }
    if (url.indexOf(".") === -1) {
      return false;
    }
    if (url.indexOf("/") === -1) {
      return false;
    }
    if (url.indexOf(":") > url.indexOf("/")) {
      return false;
    }
    if (url.indexOf("://") < url.indexOf(".")) {
      return true;
    }
    if (url.indexOf("data:") === 0 || url.indexOf("blob:") === 0) {
      return true;
    }
    return false;
  }
  /**
   * Sets the base URL to use to load scripts
   */
  static set ScriptBaseUrl(value) {
    FileToolsOptions.ScriptBaseUrl = value;
  }
  static get ScriptBaseUrl() {
    return FileToolsOptions.ScriptBaseUrl;
  }
  /**
   * Sets a preprocessing function to run on a source URL before importing it
   * Note that this function will execute AFTER the base URL is appended to the URL
   */
  static set ScriptPreprocessUrl(func) {
    FileToolsOptions.ScriptPreprocessUrl = func;
  }
  static get ScriptPreprocessUrl() {
    return FileToolsOptions.ScriptPreprocessUrl;
  }
  /**
   * Gets or sets the retry strategy to apply when an error happens while loading an asset
   */
  static get DefaultRetryStrategy() {
    return FileToolsOptions.DefaultRetryStrategy;
  }
  static set DefaultRetryStrategy(strategy) {
    FileToolsOptions.DefaultRetryStrategy = strategy;
  }
  /**
   * Default behavior for cors in the application.
   * It can be a string if the expected behavior is identical in the entire app.
   * Or a callback to be able to set it per url or on a group of them (in case of Video source for instance)
   */
  static get CorsBehavior() {
    return FileToolsOptions.CorsBehavior;
  }
  static set CorsBehavior(value) {
    FileToolsOptions.CorsBehavior = value;
  }
  /**
   * Gets or sets a global variable indicating if fallback texture must be used when a texture cannot be loaded
   * @ignorenaming
   */
  static get UseFallbackTexture() {
    return EngineStore.UseFallbackTexture;
  }
  static set UseFallbackTexture(value) {
    EngineStore.UseFallbackTexture = value;
  }
  /**
   * Use this object to register external classes like custom textures or material
   * to allow the loaders to instantiate them
   */
  static get RegisteredExternalClasses() {
    return InstantiationTools.RegisteredExternalClasses;
  }
  static set RegisteredExternalClasses(classes) {
    InstantiationTools.RegisteredExternalClasses = classes;
  }
  /**
   * Texture content used if a texture cannot loaded
   * @ignorenaming
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static get fallbackTexture() {
    return EngineStore.FallbackTexture;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static set fallbackTexture(value) {
    EngineStore.FallbackTexture = value;
  }
  /**
   * Read the content of a byte array at a specified coordinates (taking in account wrapping)
   * @param u defines the coordinate on X axis
   * @param v defines the coordinate on Y axis
   * @param width defines the width of the source data
   * @param height defines the height of the source data
   * @param pixels defines the source byte array
   * @param color defines the output color
   */
  static FetchToRef(u, v, width, height, pixels, color) {
    const wrappedU = Math.abs(u) * width % width | 0;
    const wrappedV = Math.abs(v) * height % height | 0;
    const position = (wrappedU + wrappedV * width) * 4;
    color.r = pixels[position] / 255;
    color.g = pixels[position + 1] / 255;
    color.b = pixels[position + 2] / 255;
    color.a = pixels[position + 3] / 255;
  }
  /**
   * Interpolates between a and b via alpha
   * @param a The lower value (returned when alpha = 0)
   * @param b The upper value (returned when alpha = 1)
   * @param alpha The interpolation-factor
   * @returns The mixed value
   */
  static Mix(a, b, alpha) {
    return 0;
  }
  /**
   * Tries to instantiate a new object from a given class name
   * @param className defines the class name to instantiate
   * @returns the new object or null if the system was not able to do the instantiation
   */
  static Instantiate(className) {
    return InstantiationTools.Instantiate(className);
  }
  /**
   * Polyfill for setImmediate
   * @param action defines the action to execute after the current execution block
   */
  static SetImmediate(action) {
    TimingTools.SetImmediate(action);
  }
  /**
   * Function indicating if a number is an exponent of 2
   * @param value defines the value to test
   * @returns true if the value is an exponent of 2
   */
  static IsExponentOfTwo(value) {
    return true;
  }
  /**
   * Returns the nearest 32-bit single precision float representation of a Number
   * @param value A Number.  If the parameter is of a different type, it will get converted
   * to a number or to NaN if it cannot be converted
   * @returns number
   */
  static FloatRound(value) {
    return Math.fround(value);
  }
  /**
   * Extracts the filename from a path
   * @param path defines the path to use
   * @returns the filename
   */
  static GetFilename(path) {
    const index = path.lastIndexOf("/");
    if (index < 0) {
      return path;
    }
    return path.substring(index + 1);
  }
  /**
   * Extracts the "folder" part of a path (everything before the filename).
   * @param uri The URI to extract the info from
   * @param returnUnchangedIfNoSlash Do not touch the URI if no slashes are present
   * @returns The "folder" part of the path
   */
  static GetFolderPath(uri, returnUnchangedIfNoSlash = false) {
    const index = uri.lastIndexOf("/");
    if (index < 0) {
      if (returnUnchangedIfNoSlash) {
        return uri;
      }
      return "";
    }
    return uri.substring(0, index + 1);
  }
  /**
   * Convert an angle in radians to degrees
   * @param angle defines the angle to convert
   * @returns the angle in degrees
   */
  static ToDegrees(angle) {
    return angle * 180 / Math.PI;
  }
  /**
   * Convert an angle in degrees to radians
   * @param angle defines the angle to convert
   * @returns the angle in radians
   */
  static ToRadians(angle) {
    return angle * Math.PI / 180;
  }
  /**
   * Smooth angle changes (kind of low-pass filter), in particular for device orientation "shaking"
   * Use trigonometric functions to avoid discontinuity (0/360, -180/180)
   * @param previousAngle defines last angle value, in degrees
   * @param newAngle defines new angle value, in degrees
   * @param smoothFactor defines smoothing sensitivity; min 0: no smoothing, max 1: new data ignored
   * @returns the angle in degrees
   */
  static SmoothAngleChange(previousAngle, newAngle, smoothFactor = 0.9) {
    const previousAngleRad = this.ToRadians(previousAngle);
    const newAngleRad = this.ToRadians(newAngle);
    return this.ToDegrees(Math.atan2((1 - smoothFactor) * Math.sin(newAngleRad) + smoothFactor * Math.sin(previousAngleRad), (1 - smoothFactor) * Math.cos(newAngleRad) + smoothFactor * Math.cos(previousAngleRad)));
  }
  /**
   * Returns an array if obj is not an array
   * @param obj defines the object to evaluate as an array
   * @param allowsNullUndefined defines a boolean indicating if obj is allowed to be null or undefined
   * @returns either obj directly if obj is an array or a new array containing obj
   */
  static MakeArray(obj, allowsNullUndefined) {
    if (allowsNullUndefined !== true && (obj === void 0 || obj == null)) {
      return null;
    }
    return Array.isArray(obj) ? obj : [obj];
  }
  /**
   * Gets the pointer prefix to use
   * @param engine defines the engine we are finding the prefix for
   * @returns "pointer" if touch is enabled. Else returns "mouse"
   */
  static GetPointerPrefix(engine) {
    let eventPrefix = "pointer";
    if (IsWindowObjectExist() && !window.PointerEvent) {
      eventPrefix = "mouse";
    }
    if (engine._badDesktopOS && !engine._badOS && // And not ipad pros who claim to be macs...
    !(document && "ontouchend" in document)) {
      eventPrefix = "mouse";
    }
    return eventPrefix;
  }
  /**
   * Sets the cors behavior on a dom element. This will add the required Tools.CorsBehavior to the element.
   * @param url define the url we are trying
   * @param element define the dom element where to configure the cors policy
   * @param element.crossOrigin
   */
  static SetCorsBehavior(url, element) {
    SetCorsBehavior(url, element);
  }
  /**
   * Sets the referrerPolicy behavior on a dom element.
   * @param referrerPolicy define the referrer policy to use
   * @param element define the dom element where to configure the referrer policy
   * @param element.referrerPolicy
   */
  static SetReferrerPolicyBehavior(referrerPolicy, element) {
    element.referrerPolicy = referrerPolicy;
  }
  // External files
  /**
   * Gets or sets a function used to pre-process url before using them to load assets
   */
  static get PreprocessUrl() {
    return FileToolsOptions.PreprocessUrl;
  }
  static set PreprocessUrl(processor) {
    FileToolsOptions.PreprocessUrl = processor;
  }
  /**
   * Loads an image as an HTMLImageElement.
   * @param input url string, ArrayBuffer, or Blob to load
   * @param onLoad callback called when the image successfully loads
   * @param onError callback called when the image fails to load
   * @param offlineProvider offline provider for caching
   * @param mimeType optional mime type
   * @param imageBitmapOptions optional the options to use when creating an ImageBitmap
   * @returns the HTMLImageElement of the loaded image
   */
  static LoadImage(input, onLoad, onError, offlineProvider, mimeType, imageBitmapOptions) {
    return LoadImage(input, onLoad, onError, offlineProvider, mimeType, imageBitmapOptions);
  }
  /**
   * Loads a file from a url
   * @param url url string, ArrayBuffer, or Blob to load
   * @param onSuccess callback called when the file successfully loads
   * @param onProgress callback called while file is loading (if the server supports this mode)
   * @param offlineProvider defines the offline provider for caching
   * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
   * @param onError callback called when the file fails to load
   * @returns a file request object
   */
  static LoadFile(url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError) {
    return LoadFile(url, onSuccess, onProgress, offlineProvider, useArrayBuffer, onError);
  }
  /**
   * Loads a file from a url
   * @param url the file url to load
   * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
   * @returns a promise containing an ArrayBuffer corresponding to the loaded file
   */
  static LoadFileAsync(url, useArrayBuffer = true) {
    return new Promise((resolve, reject) => {
      LoadFile(url, (data) => {
        resolve(data);
      }, void 0, void 0, useArrayBuffer, (request, exception) => {
        reject(exception);
      });
    });
  }
  /**
   * Get a script URL including preprocessing
   * @param scriptUrl the script Url to process
   * @param forceAbsoluteUrl force the script to be an absolute url (adding the current base url if necessary)
   * @returns a modified URL to use
   */
  static GetBabylonScriptURL(scriptUrl, forceAbsoluteUrl) {
    if (!scriptUrl) {
      return "";
    }
    if (_Tools.ScriptBaseUrl && scriptUrl.startsWith(_Tools._DefaultCdnUrl)) {
      const baseUrl = _Tools.ScriptBaseUrl[_Tools.ScriptBaseUrl.length - 1] === "/" ? _Tools.ScriptBaseUrl.substring(0, _Tools.ScriptBaseUrl.length - 1) : _Tools.ScriptBaseUrl;
      scriptUrl = scriptUrl.replace(_Tools._DefaultCdnUrl, baseUrl);
    }
    scriptUrl = _Tools.ScriptPreprocessUrl(scriptUrl);
    if (forceAbsoluteUrl) {
      scriptUrl = _Tools.GetAbsoluteUrl(scriptUrl);
    }
    return scriptUrl;
  }
  /**
   * This function is used internally by babylon components to load a script (identified by an url). When the url returns, the
   * content of this file is added into a new script element, attached to the DOM (body element)
   * @param scriptUrl defines the url of the script to load
   * @param onSuccess defines the callback called when the script is loaded
   * @param onError defines the callback to call if an error occurs
   * @param scriptId defines the id of the script element
   */
  static LoadBabylonScript(scriptUrl, onSuccess, onError, scriptId) {
    scriptUrl = _Tools.GetBabylonScriptURL(scriptUrl);
    _Tools.LoadScript(scriptUrl, onSuccess, onError);
  }
  /**
   * Load an asynchronous script (identified by an url). When the url returns, the
   * content of this file is added into a new script element, attached to the DOM (body element)
   * @param scriptUrl defines the url of the script to laod
   * @returns a promise request object
   */
  static LoadBabylonScriptAsync(scriptUrl) {
    scriptUrl = _Tools.GetBabylonScriptURL(scriptUrl);
    return _Tools.LoadScriptAsync(scriptUrl);
  }
  /**
   * This function is used internally by babylon components to load a script (identified by an url). When the url returns, the
   * content of this file is added into a new script element, attached to the DOM (body element)
   * @param scriptUrl defines the url of the script to load
   * @param onSuccess defines the callback called when the script is loaded
   * @param onError defines the callback to call if an error occurs
   * @param scriptId defines the id of the script element
   */
  static LoadScript(scriptUrl, onSuccess, onError, scriptId) {
    if (typeof importScripts === "function") {
      try {
        importScripts(scriptUrl);
        onSuccess();
      } catch (e) {
        onError?.(`Unable to load script '${scriptUrl}' in worker`, e);
      }
      return;
    } else if (!IsWindowObjectExist()) {
      onError?.(`Cannot load script '${scriptUrl}' outside of a window or a worker`);
      return;
    }
    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", scriptUrl);
    if (scriptId) {
      script.id = scriptId;
    }
    script.onload = () => {
      if (onSuccess) {
        onSuccess();
      }
    };
    script.onerror = (e) => {
      if (onError) {
        onError(`Unable to load script '${scriptUrl}'`, e);
      }
    };
    head.appendChild(script);
  }
  /**
   * Load an asynchronous script (identified by an url). When the url returns, the
   * content of this file is added into a new script element, attached to the DOM (body element)
   * @param scriptUrl defines the url of the script to load
   * @param scriptId defines the id of the script element
   * @returns a promise request object
   */
  static LoadScriptAsync(scriptUrl, scriptId) {
    return new Promise((resolve, reject) => {
      this.LoadScript(scriptUrl, () => {
        resolve();
      }, (message, exception) => {
        reject(exception || new Error(message));
      }, scriptId);
    });
  }
  /**
   * Loads a file from a blob
   * @param fileToLoad defines the blob to use
   * @param callback defines the callback to call when data is loaded
   * @param progressCallback defines the callback to call during loading process
   * @returns a file request object
   */
  static ReadFileAsDataURL(fileToLoad, callback, progressCallback) {
    const reader = new FileReader();
    const request = {
      onCompleteObservable: new Observable(),
      abort: () => reader.abort()
    };
    reader.onloadend = () => {
      request.onCompleteObservable.notifyObservers(request);
    };
    reader.onload = (e) => {
      callback(e.target["result"]);
    };
    reader.onprogress = progressCallback;
    reader.readAsDataURL(fileToLoad);
    return request;
  }
  /**
   * Reads a file from a File object
   * @param file defines the file to load
   * @param onSuccess defines the callback to call when data is loaded
   * @param onProgress defines the callback to call during loading process
   * @param useArrayBuffer defines a boolean indicating that data must be returned as an ArrayBuffer
   * @param onError defines the callback to call when an error occurs
   * @returns a file request object
   */
  static ReadFile(file, onSuccess, onProgress, useArrayBuffer, onError) {
    return ReadFile(file, onSuccess, onProgress, useArrayBuffer, onError);
  }
  /**
   * Creates a data url from a given string content
   * @param content defines the content to convert
   * @returns the new data url link
   */
  static FileAsURL(content) {
    const fileBlob = new Blob([content]);
    const url = window.URL;
    const link = url.createObjectURL(fileBlob);
    return link;
  }
  /**
   * Format the given number to a specific decimal format
   * @param value defines the number to format
   * @param decimals defines the number of decimals to use
   * @returns the formatted string
   */
  static Format(value, decimals = 2) {
    return value.toFixed(decimals);
  }
  /**
   * Tries to copy an object by duplicating every property
   * @param source defines the source object
   * @param destination defines the target object
   * @param doNotCopyList defines a list of properties to avoid
   * @param mustCopyList defines a list of properties to copy (even if they start with _)
   */
  static DeepCopy(source, destination, doNotCopyList, mustCopyList) {
    DeepCopier.DeepCopy(source, destination, doNotCopyList, mustCopyList);
  }
  /**
   * Gets a boolean indicating if the given object has no own property
   * @param obj defines the object to test
   * @returns true if object has no own property
   */
  static IsEmpty(obj) {
    for (const i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        return false;
      }
    }
    return true;
  }
  /**
   * Function used to register events at window level
   * @param windowElement defines the Window object to use
   * @param events defines the events to register
   */
  static RegisterTopRootEvents(windowElement, events) {
    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      windowElement.addEventListener(event.name, event.handler, false);
      try {
        if (window.parent) {
          window.parent.addEventListener(event.name, event.handler, false);
        }
      } catch (e) {
      }
    }
  }
  /**
   * Function used to unregister events from window level
   * @param windowElement defines the Window object to use
   * @param events defines the events to unregister
   */
  static UnregisterTopRootEvents(windowElement, events) {
    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      windowElement.removeEventListener(event.name, event.handler);
      try {
        if (windowElement.parent) {
          windowElement.parent.removeEventListener(event.name, event.handler);
        }
      } catch (e) {
      }
    }
  }
  /**
   * Dumps the current bound framebuffer
   * @param width defines the rendering width
   * @param height defines the rendering height
   * @param engine defines the hosting engine
   * @param successCallback defines the callback triggered once the data are available
   * @param mimeType defines the mime type of the result
   * @param fileName defines the filename to download. If present, the result will automatically be downloaded
   * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
   * @returns a void promise
   */
  static DumpFramebuffer(width, height, engine, successCallback, mimeType = "image/png", fileName, quality) {
    return __async(this, null, function* () {
      throw _WarnImport("DumpTools");
    });
  }
  /**
   * Dumps an array buffer
   * @param width defines the rendering width
   * @param height defines the rendering height
   * @param data the data array
   * @param successCallback defines the callback triggered once the data are available
   * @param mimeType defines the mime type of the result
   * @param fileName defines the filename to download. If present, the result will automatically be downloaded
   * @param invertY true to invert the picture in the Y dimension
   * @param toArrayBuffer true to convert the data to an ArrayBuffer (encoded as `mimeType`) instead of a base64 string
   * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
   */
  static DumpData(width, height, data, successCallback, mimeType = "image/png", fileName, invertY = false, toArrayBuffer = false, quality) {
    throw _WarnImport("DumpTools");
  }
  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Dumps an array buffer
   * @param width defines the rendering width
   * @param height defines the rendering height
   * @param data the data array
   * @param mimeType defines the mime type of the result
   * @param fileName defines the filename to download. If present, the result will automatically be downloaded
   * @param invertY true to invert the picture in the Y dimension
   * @param toArrayBuffer true to convert the data to an ArrayBuffer (encoded as `mimeType`) instead of a base64 string
   * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
   * @returns a promise that resolve to the final data
   */
  static DumpDataAsync(width, height, data, mimeType = "image/png", fileName, invertY = false, toArrayBuffer = false, quality) {
    throw _WarnImport("DumpTools");
  }
  static _IsOffScreenCanvas(canvas) {
    return canvas.convertToBlob !== void 0;
  }
  /**
   * Converts the canvas data to blob.
   * This acts as a polyfill for browsers not supporting the to blob function.
   * @param canvas Defines the canvas to extract the data from (can be an offscreen canvas)
   * @param successCallback Defines the callback triggered once the data are available
   * @param mimeType Defines the mime type of the result
   * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
   */
  static ToBlob(canvas, successCallback, mimeType = "image/png", quality) {
    if (!_Tools._IsOffScreenCanvas(canvas) && !canvas.toBlob) {
      canvas.toBlob = function(callback, type, quality2) {
        setTimeout(() => {
          const binStr = atob(this.toDataURL(type, quality2).split(",")[1]), len = binStr.length, arr = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }
          callback(new Blob([arr]));
        });
      };
    }
    if (_Tools._IsOffScreenCanvas(canvas)) {
      canvas.convertToBlob({
        type: mimeType,
        quality
      }).then((blob) => successCallback(blob));
    } else {
      canvas.toBlob(function(blob) {
        successCallback(blob);
      }, mimeType, quality);
    }
  }
  /**
   * Download a Blob object
   * @param blob the Blob object
   * @param fileName the file name to download
   */
  static DownloadBlob(blob, fileName) {
    if ("download" in document.createElement("a")) {
      if (!fileName) {
        const date = /* @__PURE__ */ new Date();
        const stringDate = (date.getFullYear() + "-" + (date.getMonth() + 1)).slice(2) + "-" + date.getDate() + "_" + date.getHours() + "-" + ("0" + date.getMinutes()).slice(-2);
        fileName = "screenshot_" + stringDate + ".png";
      }
      _Tools.Download(blob, fileName);
    } else {
      if (blob && typeof URL !== "undefined") {
        const url = URL.createObjectURL(blob);
        const newWindow = window.open("");
        if (!newWindow) {
          return;
        }
        const img = newWindow.document.createElement("img");
        img.onload = function() {
          URL.revokeObjectURL(url);
        };
        img.src = url;
        newWindow.document.body.appendChild(img);
      }
    }
  }
  /**
   * Encodes the canvas data to base 64, or automatically downloads the result if `fileName` is defined.
   * @param canvas The canvas to get the data from, which can be an offscreen canvas.
   * @param successCallback The callback which is triggered once the data is available. If `fileName` is defined, the callback will be invoked after the download occurs, and the `data` argument will be an empty string.
   * @param mimeType The mime type of the result.
   * @param fileName The name of the file to download. If defined, the result will automatically be downloaded. If not defined, and `successCallback` is also not defined, the result will automatically be downloaded with an auto-generated file name.
   * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
   */
  static EncodeScreenshotCanvasData(canvas, successCallback, mimeType = "image/png", fileName, quality) {
    if (typeof fileName === "string" || !successCallback) {
      this.ToBlob(canvas, function(blob) {
        if (blob) {
          _Tools.DownloadBlob(blob, fileName);
        }
        if (successCallback) {
          successCallback("");
        }
      }, mimeType, quality);
    } else if (successCallback) {
      if (_Tools._IsOffScreenCanvas(canvas)) {
        canvas.convertToBlob({
          type: mimeType,
          quality
        }).then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            successCallback(base64data);
          };
        });
        return;
      }
      const base64Image = canvas.toDataURL(mimeType, quality);
      successCallback(base64Image);
    }
  }
  /**
   * Downloads a blob in the browser
   * @param blob defines the blob to download
   * @param fileName defines the name of the downloaded file
   */
  static Download(blob, fileName) {
    if (typeof URL === "undefined") {
      return;
    }
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    a.addEventListener("click", () => {
      if (a.parentElement) {
        a.parentElement.removeChild(a);
      }
    });
    a.click();
    window.URL.revokeObjectURL(url);
  }
  /**
   * Will return the right value of the noPreventDefault variable
   * Needed to keep backwards compatibility to the old API.
   *
   * @param args arguments passed to the attachControl function
   * @returns the correct value for noPreventDefault
   */
  static BackCompatCameraNoPreventDefault(args) {
    if (typeof args[0] === "boolean") {
      return args[0];
    } else if (typeof args[1] === "boolean") {
      return args[1];
    }
    return false;
  }
  /**
   * Captures a screenshot of the current rendering
   * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
   * @param engine defines the rendering engine
   * @param camera defines the source camera
   * @param size This parameter can be set to a single number or to an object with the
   * following (optional) properties: precision, width, height. If a single number is passed,
   * it will be used for both width and height. If an object is passed, the screenshot size
   * will be derived from the parameters. The precision property is a multiplier allowing
   * rendering at a higher or lower resolution
   * @param successCallback defines the callback receives a single parameter which contains the
   * screenshot as a string of base64-encoded characters. This string can be assigned to the
   * src parameter of an <img> to display it
   * @param mimeType defines the MIME type of the screenshot image (default: image/png).
   * Check your browser for supported MIME types
   * @param forceDownload force the system to download the image even if a successCallback is provided
   * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static CreateScreenshot(engine, camera, size, successCallback, mimeType = "image/png", forceDownload = false, quality) {
    throw _WarnImport("ScreenshotTools");
  }
  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Captures a screenshot of the current rendering
   * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
   * @param engine defines the rendering engine
   * @param camera defines the source camera
   * @param size This parameter can be set to a single number or to an object with the
   * following (optional) properties: precision, width, height. If a single number is passed,
   * it will be used for both width and height. If an object is passed, the screenshot size
   * will be derived from the parameters. The precision property is a multiplier allowing
   * rendering at a higher or lower resolution
   * @param mimeType defines the MIME type of the screenshot image (default: image/png).
   * Check your browser for supported MIME types
   * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
   * @returns screenshot as a string of base64-encoded characters. This string can be assigned
   * to the src parameter of an <img> to display it
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static CreateScreenshotAsync(engine, camera, size, mimeType = "image/png", quality) {
    throw _WarnImport("ScreenshotTools");
  }
  /**
   * Generates an image screenshot from the specified camera.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
   * @param engine The engine to use for rendering
   * @param camera The camera to use for rendering
   * @param size This parameter can be set to a single number or to an object with the
   * following (optional) properties: precision, width, height. If a single number is passed,
   * it will be used for both width and height. If an object is passed, the screenshot size
   * will be derived from the parameters. The precision property is a multiplier allowing
   * rendering at a higher or lower resolution
   * @param successCallback The callback receives a single parameter which contains the
   * screenshot as a string of base64-encoded characters. This string can be assigned to the
   * src parameter of an <img> to display it
   * @param mimeType The MIME type of the screenshot image (default: image/png).
   * Check your browser for supported MIME types
   * @param samples Texture samples (default: 1)
   * @param antialiasing Whether antialiasing should be turned on or not (default: false)
   * @param fileName A name for for the downloaded file.
   * @param renderSprites Whether the sprites should be rendered or not (default: false)
   * @param enableStencilBuffer Whether the stencil buffer should be enabled or not (default: false)
   * @param useLayerMask if the camera's layer mask should be used to filter what should be rendered (default: true)
   * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static CreateScreenshotUsingRenderTarget(engine, camera, size, successCallback, mimeType = "image/png", samples = 1, antialiasing = false, fileName, renderSprites = false, enableStencilBuffer = false, useLayerMask = true, quality) {
    throw _WarnImport("ScreenshotTools");
  }
  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Generates an image screenshot from the specified camera.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/renderToPNG
   * @param engine The engine to use for rendering
   * @param camera The camera to use for rendering
   * @param size This parameter can be set to a single number or to an object with the
   * following (optional) properties: precision, width, height. If a single number is passed,
   * it will be used for both width and height. If an object is passed, the screenshot size
   * will be derived from the parameters. The precision property is a multiplier allowing
   * rendering at a higher or lower resolution
   * @param mimeType The MIME type of the screenshot image (default: image/png).
   * Check your browser for supported MIME types
   * @param samples Texture samples (default: 1)
   * @param antialiasing Whether antialiasing should be turned on or not (default: false)
   * @param fileName A name for for the downloaded file.
   * @returns screenshot as a string of base64-encoded characters. This string can be assigned
   * @param renderSprites Whether the sprites should be rendered or not (default: false)
   * @param enableStencilBuffer Whether the stencil buffer should be enabled or not (default: false)
   * @param useLayerMask if the camera's layer mask should be used to filter what should be rendered (default: true)
   * @param quality The quality of the image if lossy mimeType is used (e.g. image/jpeg, image/webp). See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob | HTMLCanvasElement.toBlob()}'s `quality` parameter.
   * to the src parameter of an <img> to display it
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static CreateScreenshotUsingRenderTargetAsync(engine, camera, size, mimeType = "image/png", samples = 1, antialiasing = false, fileName, renderSprites = false, enableStencilBuffer = false, useLayerMask = true, quality) {
    throw _WarnImport("ScreenshotTools");
  }
  /**
   * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
   * Be aware Math.random() could cause collisions, but:
   * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
   * @returns a pseudo random id
   */
  static RandomId() {
    return RandomGUID();
  }
  /**
   * Test if the given uri is a base64 string
   * @deprecated Please use FileTools.IsBase64DataUrl instead.
   * @param uri The uri to test
   * @returns True if the uri is a base64 string or false otherwise
   */
  static IsBase64(uri) {
    return IsBase64DataUrl(uri);
  }
  /**
   * Decode the given base64 uri.
   * @deprecated Please use FileTools.DecodeBase64UrlToBinary instead.
   * @param uri The uri to decode
   * @returns The decoded base64 data.
   */
  static DecodeBase64(uri) {
    return DecodeBase64UrlToBinary(uri);
  }
  /**
   * Gets a value indicating the number of loading errors
   * @ignorenaming
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static get errorsCount() {
    return Logger.errorsCount;
  }
  /**
   * Log a message to the console
   * @param message defines the message to log
   */
  static Log(message) {
    Logger.Log(message);
  }
  /**
   * Write a warning message to the console
   * @param message defines the message to log
   */
  static Warn(message) {
    Logger.Warn(message);
  }
  /**
   * Write an error message to the console
   * @param message defines the message to log
   */
  static Error(message) {
    Logger.Error(message);
  }
  /**
   * Gets current log cache (list of logs)
   */
  static get LogCache() {
    return Logger.LogCache;
  }
  /**
   * Clears the log cache
   */
  static ClearLogCache() {
    Logger.ClearLogCache();
  }
  /**
   * Sets the current log level (MessageLogLevel / WarningLogLevel / ErrorLogLevel)
   */
  static set LogLevels(level) {
    Logger.LogLevels = level;
  }
  /**
   * Sets the current performance log level
   */
  static set PerformanceLogLevel(level) {
    if ((level & _Tools.PerformanceUserMarkLogLevel) === _Tools.PerformanceUserMarkLogLevel) {
      _Tools.StartPerformanceCounter = _Tools._StartUserMark;
      _Tools.EndPerformanceCounter = _Tools._EndUserMark;
      return;
    }
    if ((level & _Tools.PerformanceConsoleLogLevel) === _Tools.PerformanceConsoleLogLevel) {
      _Tools.StartPerformanceCounter = _Tools._StartPerformanceConsole;
      _Tools.EndPerformanceCounter = _Tools._EndPerformanceConsole;
      return;
    }
    _Tools.StartPerformanceCounter = _Tools._StartPerformanceCounterDisabled;
    _Tools.EndPerformanceCounter = _Tools._EndPerformanceCounterDisabled;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static _StartPerformanceCounterDisabled(counterName, condition) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static _EndPerformanceCounterDisabled(counterName, condition) {
  }
  static _StartUserMark(counterName, condition = true) {
    if (!_Tools._Performance) {
      if (!IsWindowObjectExist()) {
        return;
      }
      _Tools._Performance = window.performance;
    }
    if (!condition || !_Tools._Performance.mark) {
      return;
    }
    _Tools._Performance.mark(counterName + "-Begin");
  }
  static _EndUserMark(counterName, condition = true) {
    if (!condition || !_Tools._Performance.mark) {
      return;
    }
    _Tools._Performance.mark(counterName + "-End");
    _Tools._Performance.measure(counterName, counterName + "-Begin", counterName + "-End");
  }
  static _StartPerformanceConsole(counterName, condition = true) {
    if (!condition) {
      return;
    }
    _Tools._StartUserMark(counterName, condition);
    if (console.time) {
      console.time(counterName);
    }
  }
  static _EndPerformanceConsole(counterName, condition = true) {
    if (!condition) {
      return;
    }
    _Tools._EndUserMark(counterName, condition);
    console.timeEnd(counterName);
  }
  /**
   * Gets either window.performance.now() if supported or Date.now() else
   */
  static get Now() {
    return PrecisionDate.Now;
  }
  /**
   * This method will return the name of the class used to create the instance of the given object.
   * It will works only on Javascript basic data types (number, string, ...) and instance of class declared with the @className decorator.
   * @param object the object to get the class name from
   * @param isType defines if the object is actually a type
   * @returns the name of the class, will be "object" for a custom data type not using the @className decorator
   */
  static GetClassName(object, isType = false) {
    let name2 = null;
    if (!isType && object.getClassName) {
      name2 = object.getClassName();
    } else {
      if (object instanceof Object) {
        const classObj = isType ? object : Object.getPrototypeOf(object);
        name2 = classObj.constructor["__bjsclassName__"];
      }
      if (!name2) {
        name2 = typeof object;
      }
    }
    return name2;
  }
  /**
   * Gets the first element of an array satisfying a given predicate
   * @param array defines the array to browse
   * @param predicate defines the predicate to use
   * @returns null if not found or the element
   */
  static First(array, predicate) {
    for (const el of array) {
      if (predicate(el)) {
        return el;
      }
    }
    return null;
  }
  /**
   * This method will return the name of the full name of the class, including its owning module (if any).
   * It will works only on Javascript basic data types (number, string, ...) and instance of class declared with the @className decorator or implementing a method getClassName():string (in which case the module won't be specified).
   * @param object the object to get the class name from
   * @param isType defines if the object is actually a type
   * @returns a string that can have two forms: "moduleName.className" if module was specified when the class' Name was registered or "className" if there was not module specified.
   * @ignorenaming
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static getFullClassName(object, isType = false) {
    let className = null;
    let moduleName = null;
    if (!isType && object.getClassName) {
      className = object.getClassName();
    } else {
      if (object instanceof Object) {
        const classObj = isType ? object : Object.getPrototypeOf(object);
        className = classObj.constructor["__bjsclassName__"];
        moduleName = classObj.constructor["__bjsmoduleName__"];
      }
      if (!className) {
        className = typeof object;
      }
    }
    if (!className) {
      return null;
    }
    return (moduleName != null ? moduleName + "." : "") + className;
  }
  /**
   * Returns a promise that resolves after the given amount of time.
   * @param delay Number of milliseconds to delay
   * @returns Promise that resolves after the given amount of time
   */
  static DelayAsync(delay) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  }
  /**
   * Utility function to detect if the current user agent is Safari
   * @returns whether or not the current user agent is safari
   */
  static IsSafari() {
    if (!IsNavigatorAvailable()) {
      return false;
    }
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }
};
Tools.UseCustomRequestHeaders = false;
Tools.CustomRequestHeaders = WebRequest.CustomRequestHeaders;
Tools.GetDOMTextContent = GetDOMTextContent;
Tools._DefaultCdnUrl = "https://cdn.babylonjs.com";
Tools.GetAbsoluteUrl = typeof document === "object" ? (url) => {
  const a = document.createElement("a");
  a.href = url;
  return a.href;
} : typeof URL === "function" && typeof location === "object" ? (url) => new URL(url, location.origin).href : () => {
  throw new Error("Unable to get absolute URL. Override BABYLON.Tools.GetAbsoluteUrl to a custom implementation for the current context.");
};
Tools.NoneLogLevel = Logger.NoneLogLevel;
Tools.MessageLogLevel = Logger.MessageLogLevel;
Tools.WarningLogLevel = Logger.WarningLogLevel;
Tools.ErrorLogLevel = Logger.ErrorLogLevel;
Tools.AllLogLevel = Logger.AllLogLevel;
Tools.IsWindowObjectExist = IsWindowObjectExist;
Tools.PerformanceNoneLogLevel = 0;
Tools.PerformanceUserMarkLogLevel = 1;
Tools.PerformanceConsoleLogLevel = 2;
Tools.StartPerformanceCounter = Tools._StartPerformanceCounterDisabled;
Tools.EndPerformanceCounter = Tools._EndPerformanceCounterDisabled;
var AsyncLoop = class _AsyncLoop {
  /**
   * Constructor.
   * @param iterations the number of iterations.
   * @param func the function to run each iteration
   * @param successCallback the callback that will be called upon successful execution
   * @param offset starting offset.
   */
  constructor(iterations, func, successCallback, offset = 0) {
    this.iterations = iterations;
    this.index = offset - 1;
    this._done = false;
    this._fn = func;
    this._successCallback = successCallback;
  }
  /**
   * Execute the next iteration. Must be called after the last iteration was finished.
   */
  executeNext() {
    if (!this._done) {
      if (this.index + 1 < this.iterations) {
        ++this.index;
        this._fn(this);
      } else {
        this.breakLoop();
      }
    }
  }
  /**
   * Break the loop and run the success callback.
   */
  breakLoop() {
    this._done = true;
    this._successCallback();
  }
  /**
   * Create and run an async loop.
   * @param iterations the number of iterations.
   * @param fn the function to run each iteration
   * @param successCallback the callback that will be called upon successful execution
   * @param offset starting offset.
   * @returns the created async loop object
   */
  static Run(iterations, fn, successCallback, offset = 0) {
    const loop = new _AsyncLoop(iterations, fn, successCallback, offset);
    loop.executeNext();
    return loop;
  }
  /**
   * A for-loop that will run a given number of iterations synchronous and the rest async.
   * @param iterations total number of iterations
   * @param syncedIterations number of synchronous iterations in each async iteration.
   * @param fn the function to call each iteration.
   * @param callback a success call back that will be called when iterating stops.
   * @param breakFunction a break condition (optional)
   * @param timeout timeout settings for the setTimeout function. default - 0.
   * @returns the created async loop object
   */
  static SyncAsyncForLoop(iterations, syncedIterations, fn, callback, breakFunction, timeout = 0) {
    return _AsyncLoop.Run(Math.ceil(iterations / syncedIterations), (loop) => {
      if (breakFunction && breakFunction()) {
        loop.breakLoop();
      } else {
        setTimeout(() => {
          for (let i = 0; i < syncedIterations; ++i) {
            const iteration = loop.index * syncedIterations + i;
            if (iteration >= iterations) {
              break;
            }
            fn(iteration);
            if (breakFunction && breakFunction()) {
              loop.breakLoop();
              break;
            }
          }
          loop.executeNext();
        }, timeout);
      }
    }, callback);
  }
};
Tools.Mix = Mix;
Tools.IsExponentOfTwo = IsExponentOfTwo;
EngineStore.FallbackTexture = "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBmRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAAQAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQubmV0IDQuMC41AP/bAEMABAIDAwMCBAMDAwQEBAQFCQYFBQUFCwgIBgkNCw0NDQsMDA4QFBEODxMPDAwSGBITFRYXFxcOERkbGRYaFBYXFv/bAEMBBAQEBQUFCgYGChYPDA8WFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFv/AABEIAQABAAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APH6KKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76CiiigD5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BQooooA+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/voKKKKAPl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76CiiigD5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BQooooA+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/voKKKKAPl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FCiiigD6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++gooooA+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gUKKKKAPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76Pl+iiivuj+BT6gooor4U/vo+X6KKK+6P4FPqCiiivhT++j5fooor7o/gU+oKKKK+FP76P//Z";

// node_modules/@babylonjs/core/Engines/Extensions/engine.uniformBuffer.js
ThinEngine.prototype.createUniformBuffer = function(elements, _label) {
  const ubo = this._gl.createBuffer();
  if (!ubo) {
    throw new Error("Unable to create uniform buffer");
  }
  const result = new WebGLDataBuffer(ubo);
  this.bindUniformBuffer(result);
  if (elements instanceof Float32Array) {
    this._gl.bufferData(this._gl.UNIFORM_BUFFER, elements, this._gl.STATIC_DRAW);
  } else {
    this._gl.bufferData(this._gl.UNIFORM_BUFFER, new Float32Array(elements), this._gl.STATIC_DRAW);
  }
  this.bindUniformBuffer(null);
  result.references = 1;
  return result;
};
ThinEngine.prototype.createDynamicUniformBuffer = function(elements, _label) {
  const ubo = this._gl.createBuffer();
  if (!ubo) {
    throw new Error("Unable to create dynamic uniform buffer");
  }
  const result = new WebGLDataBuffer(ubo);
  this.bindUniformBuffer(result);
  if (elements instanceof Float32Array) {
    this._gl.bufferData(this._gl.UNIFORM_BUFFER, elements, this._gl.DYNAMIC_DRAW);
  } else {
    this._gl.bufferData(this._gl.UNIFORM_BUFFER, new Float32Array(elements), this._gl.DYNAMIC_DRAW);
  }
  this.bindUniformBuffer(null);
  result.references = 1;
  return result;
};
ThinEngine.prototype.updateUniformBuffer = function(uniformBuffer, elements, offset, count) {
  this.bindUniformBuffer(uniformBuffer);
  if (offset === void 0) {
    offset = 0;
  }
  if (count === void 0) {
    if (elements instanceof Float32Array) {
      this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, offset, elements);
    } else {
      this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, offset, new Float32Array(elements));
    }
  } else {
    if (elements instanceof Float32Array) {
      this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, 0, elements.subarray(offset, offset + count));
    } else {
      this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, 0, new Float32Array(elements).subarray(offset, offset + count));
    }
  }
  this.bindUniformBuffer(null);
};
ThinEngine.prototype.bindUniformBuffer = function(buffer) {
  this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, buffer ? buffer.underlyingResource : null);
};
ThinEngine.prototype.bindUniformBufferBase = function(buffer, location2, name2) {
  this._gl.bindBufferBase(this._gl.UNIFORM_BUFFER, location2, buffer ? buffer.underlyingResource : null);
};
ThinEngine.prototype.bindUniformBlock = function(pipelineContext, blockName, index) {
  const program = pipelineContext.program;
  const uniformLocation = this._gl.getUniformBlockIndex(program, blockName);
  if (uniformLocation !== 4294967295) {
    this._gl.uniformBlockBinding(program, uniformLocation, index);
  }
};

// node_modules/@babylonjs/core/Materials/uniformBuffer.js
var UniformBuffer = class _UniformBuffer {
  /**
   * Instantiates a new Uniform buffer objects.
   *
   * Handles blocks of uniform on the GPU.
   *
   * If WebGL 2 is not available, this class falls back on traditional setUniformXXX calls.
   *
   * For more information, please refer to :
   * @see https://www.khronos.org/opengl/wiki/Uniform_Buffer_Object
   * @param engine Define the engine the buffer is associated with
   * @param data Define the data contained in the buffer
   * @param dynamic Define if the buffer is updatable
   * @param name to assign to the buffer (debugging purpose)
   * @param forceNoUniformBuffer define that this object must not rely on UBO objects
   */
  constructor(engine, data, dynamic, name2, forceNoUniformBuffer = false) {
    this._valueCache = {};
    this._engine = engine;
    this._noUBO = !engine.supportsUniformBuffers || forceNoUniformBuffer;
    this._dynamic = dynamic;
    this._name = name2 ?? "no-name";
    this._data = data || [];
    this._uniformLocations = {};
    this._uniformSizes = {};
    this._uniformArraySizes = {};
    this._uniformLocationPointer = 0;
    this._needSync = false;
    if (this._engine._features.trackUbosInFrame) {
      this._buffers = [];
      this._bufferIndex = -1;
      this._createBufferOnWrite = false;
      this._currentFrameId = 0;
    }
    if (this._noUBO) {
      this.updateMatrix3x3 = this._updateMatrix3x3ForEffect;
      this.updateMatrix2x2 = this._updateMatrix2x2ForEffect;
      this.updateFloat = this._updateFloatForEffect;
      this.updateFloat2 = this._updateFloat2ForEffect;
      this.updateFloat3 = this._updateFloat3ForEffect;
      this.updateFloat4 = this._updateFloat4ForEffect;
      this.updateFloatArray = this._updateFloatArrayForEffect;
      this.updateArray = this._updateArrayForEffect;
      this.updateIntArray = this._updateIntArrayForEffect;
      this.updateUIntArray = this._updateUIntArrayForEffect;
      this.updateMatrix = this._updateMatrixForEffect;
      this.updateMatrices = this._updateMatricesForEffect;
      this.updateVector3 = this._updateVector3ForEffect;
      this.updateVector4 = this._updateVector4ForEffect;
      this.updateColor3 = this._updateColor3ForEffect;
      this.updateColor4 = this._updateColor4ForEffect;
      this.updateDirectColor4 = this._updateDirectColor4ForEffect;
      this.updateInt = this._updateIntForEffect;
      this.updateInt2 = this._updateInt2ForEffect;
      this.updateInt3 = this._updateInt3ForEffect;
      this.updateInt4 = this._updateInt4ForEffect;
      this.updateUInt = this._updateUIntForEffect;
      this.updateUInt2 = this._updateUInt2ForEffect;
      this.updateUInt3 = this._updateUInt3ForEffect;
      this.updateUInt4 = this._updateUInt4ForEffect;
    } else {
      this._engine._uniformBuffers.push(this);
      this.updateMatrix3x3 = this._updateMatrix3x3ForUniform;
      this.updateMatrix2x2 = this._updateMatrix2x2ForUniform;
      this.updateFloat = this._updateFloatForUniform;
      this.updateFloat2 = this._updateFloat2ForUniform;
      this.updateFloat3 = this._updateFloat3ForUniform;
      this.updateFloat4 = this._updateFloat4ForUniform;
      this.updateFloatArray = this._updateFloatArrayForUniform;
      this.updateArray = this._updateArrayForUniform;
      this.updateIntArray = this._updateIntArrayForUniform;
      this.updateUIntArray = this._updateUIntArrayForUniform;
      this.updateMatrix = this._updateMatrixForUniform;
      this.updateMatrices = this._updateMatricesForUniform;
      this.updateVector3 = this._updateVector3ForUniform;
      this.updateVector4 = this._updateVector4ForUniform;
      this.updateColor3 = this._updateColor3ForUniform;
      this.updateColor4 = this._updateColor4ForUniform;
      this.updateDirectColor4 = this._updateDirectColor4ForUniform;
      this.updateInt = this._updateIntForUniform;
      this.updateInt2 = this._updateInt2ForUniform;
      this.updateInt3 = this._updateInt3ForUniform;
      this.updateInt4 = this._updateInt4ForUniform;
      this.updateUInt = this._updateUIntForUniform;
      this.updateUInt2 = this._updateUInt2ForUniform;
      this.updateUInt3 = this._updateUInt3ForUniform;
      this.updateUInt4 = this._updateUInt4ForUniform;
    }
  }
  /**
   * Indicates if the buffer is using the WebGL2 UBO implementation,
   * or just falling back on setUniformXXX calls.
   */
  get useUbo() {
    return !this._noUBO;
  }
  /**
   * Indicates if the WebGL underlying uniform buffer is in sync
   * with the javascript cache data.
   */
  get isSync() {
    return !this._needSync;
  }
  /**
   * Indicates if the WebGL underlying uniform buffer is dynamic.
   * Also, a dynamic UniformBuffer will disable cache verification and always
   * update the underlying WebGL uniform buffer to the GPU.
   * @returns if Dynamic, otherwise false
   */
  isDynamic() {
    return this._dynamic !== void 0;
  }
  /**
   * The data cache on JS side.
   * @returns the underlying data as a float array
   */
  getData() {
    return this._bufferData;
  }
  /**
   * The underlying WebGL Uniform buffer.
   * @returns the webgl buffer
   */
  getBuffer() {
    return this._buffer;
  }
  /**
   * std140 layout specifies how to align data within an UBO structure.
   * See https://khronos.org/registry/OpenGL/specs/gl/glspec45.core.pdf#page=159
   * for specs.
   * @param size
   */
  _fillAlignment(size) {
    let alignment;
    if (size <= 2) {
      alignment = size;
    } else {
      alignment = 4;
    }
    if (this._uniformLocationPointer % alignment !== 0) {
      const oldPointer = this._uniformLocationPointer;
      this._uniformLocationPointer += alignment - this._uniformLocationPointer % alignment;
      const diff = this._uniformLocationPointer - oldPointer;
      for (let i = 0; i < diff; i++) {
        this._data.push(0);
      }
    }
  }
  /**
   * Adds an uniform in the buffer.
   * Warning : the subsequents calls of this function must be in the same order as declared in the shader
   * for the layout to be correct ! The addUniform function only handles types like float, vec2, vec3, vec4, mat4,
   * meaning size=1,2,3,4 or 16. It does not handle struct types.
   * @param name Name of the uniform, as used in the uniform block in the shader.
   * @param size Data size, or data directly.
   * @param arraySize The number of elements in the array, 0 if not an array.
   */
  addUniform(name2, size, arraySize = 0) {
    if (this._noUBO) {
      return;
    }
    if (this._uniformLocations[name2] !== void 0) {
      return;
    }
    let data;
    if (arraySize > 0) {
      if (size instanceof Array) {
        throw "addUniform should not be use with Array in UBO: " + name2;
      }
      this._fillAlignment(4);
      this._uniformArraySizes[name2] = {
        strideSize: size,
        arraySize
      };
      if (size == 16) {
        size = size * arraySize;
      } else {
        const perElementPadding = 4 - size;
        const totalPadding = perElementPadding * arraySize;
        size = size * arraySize + totalPadding;
      }
      data = [];
      for (let i = 0; i < size; i++) {
        data.push(0);
      }
    } else {
      if (size instanceof Array) {
        data = size;
        size = data.length;
      } else {
        size = size;
        data = [];
        for (let i = 0; i < size; i++) {
          data.push(0);
        }
      }
      this._fillAlignment(size);
    }
    this._uniformSizes[name2] = size;
    this._uniformLocations[name2] = this._uniformLocationPointer;
    this._uniformLocationPointer += size;
    for (let i = 0; i < size; i++) {
      this._data.push(data[i]);
    }
    this._needSync = true;
  }
  /**
   * Adds a Matrix 4x4 to the uniform buffer.
   * @param name Name of the uniform, as used in the uniform block in the shader.
   * @param mat A 4x4 matrix.
   */
  addMatrix(name2, mat) {
    this.addUniform(name2, Array.prototype.slice.call(mat.asArray()));
  }
  /**
   * Adds a vec2 to the uniform buffer.
   * @param name Name of the uniform, as used in the uniform block in the shader.
   * @param x Define the x component value of the vec2
   * @param y Define the y component value of the vec2
   */
  addFloat2(name2, x, y) {
    const temp = [x, y];
    this.addUniform(name2, temp);
  }
  /**
   * Adds a vec3 to the uniform buffer.
   * @param name Name of the uniform, as used in the uniform block in the shader.
   * @param x Define the x component value of the vec3
   * @param y Define the y component value of the vec3
   * @param z Define the z component value of the vec3
   */
  addFloat3(name2, x, y, z) {
    const temp = [x, y, z];
    this.addUniform(name2, temp);
  }
  /**
   * Adds a vec3 to the uniform buffer.
   * @param name Name of the uniform, as used in the uniform block in the shader.
   * @param color Define the vec3 from a Color
   */
  addColor3(name2, color) {
    const temp = [color.r, color.g, color.b];
    this.addUniform(name2, temp);
  }
  /**
   * Adds a vec4 to the uniform buffer.
   * @param name Name of the uniform, as used in the uniform block in the shader.
   * @param color Define the rgb components from a Color
   * @param alpha Define the a component of the vec4
   */
  addColor4(name2, color, alpha) {
    const temp = [color.r, color.g, color.b, alpha];
    this.addUniform(name2, temp);
  }
  /**
   * Adds a vec3 to the uniform buffer.
   * @param name Name of the uniform, as used in the uniform block in the shader.
   * @param vector Define the vec3 components from a Vector
   */
  addVector3(name2, vector) {
    const temp = [vector.x, vector.y, vector.z];
    this.addUniform(name2, temp);
  }
  /**
   * Adds a Matrix 3x3 to the uniform buffer.
   * @param name Name of the uniform, as used in the uniform block in the shader.
   */
  addMatrix3x3(name2) {
    this.addUniform(name2, 12);
  }
  /**
   * Adds a Matrix 2x2 to the uniform buffer.
   * @param name Name of the uniform, as used in the uniform block in the shader.
   */
  addMatrix2x2(name2) {
    this.addUniform(name2, 8);
  }
  /**
   * Effectively creates the WebGL Uniform Buffer, once layout is completed with `addUniform`.
   */
  create() {
    if (this._noUBO) {
      return;
    }
    if (this._buffer) {
      return;
    }
    this._fillAlignment(4);
    this._bufferData = new Float32Array(this._data);
    this._rebuild();
    this._needSync = true;
  }
  // The result of this method is used for debugging purpose, as part of the buffer name
  // It is meant to more easily know what this buffer is about when debugging
  // Some buffers can have a lot of uniforms (several dozens), so the method only returns the first 10 of them
  // (should be enough to understand what the buffer is for)
  _getNames() {
    const names = [];
    let i = 0;
    for (const name2 in this._uniformLocations) {
      names.push(name2);
      if (++i === 10) {
        break;
      }
    }
    return names.join(",");
  }
  /** @internal */
  _rebuild() {
    if (this._noUBO || !this._bufferData) {
      return;
    }
    if (this._dynamic) {
      this._buffer = this._engine.createDynamicUniformBuffer(this._bufferData, this._name + "_UniformList:" + this._getNames());
    } else {
      this._buffer = this._engine.createUniformBuffer(this._bufferData, this._name + "_UniformList:" + this._getNames());
    }
    if (this._engine._features.trackUbosInFrame) {
      this._buffers.push([this._buffer, this._engine._features.checkUbosContentBeforeUpload ? this._bufferData.slice() : void 0]);
      this._bufferIndex = this._buffers.length - 1;
      this._createBufferOnWrite = false;
    }
  }
  /** @internal */
  _rebuildAfterContextLost() {
    if (this._engine._features.trackUbosInFrame) {
      this._buffers = [];
      this._currentFrameId = 0;
    }
    this._rebuild();
  }
  /** @internal */
  get _numBuffers() {
    return this._buffers.length;
  }
  /** @internal */
  get _indexBuffer() {
    return this._bufferIndex;
  }
  /** Gets the name of this buffer */
  get name() {
    return this._name;
  }
  /** Gets the current effect */
  get currentEffect() {
    return this._currentEffect;
  }
  _buffersEqual(buf1, buf2) {
    for (let i = 0; i < buf1.length; ++i) {
      if (buf1[i] !== buf2[i]) {
        return false;
      }
    }
    return true;
  }
  _copyBuffer(src, dst) {
    for (let i = 0; i < src.length; ++i) {
      dst[i] = src[i];
    }
  }
  /**
   * Updates the WebGL Uniform Buffer on the GPU.
   * If the `dynamic` flag is set to true, no cache comparison is done.
   * Otherwise, the buffer will be updated only if the cache differs.
   */
  update() {
    if (this._noUBO) {
      return;
    }
    this.bindUniformBuffer();
    if (!this._buffer) {
      this.create();
      return;
    }
    if (!this._dynamic && !this._needSync) {
      this._createBufferOnWrite = this._engine._features.trackUbosInFrame;
      return;
    }
    if (this._buffers && this._buffers.length > 1 && this._buffers[this._bufferIndex][1]) {
      if (this._buffersEqual(this._bufferData, this._buffers[this._bufferIndex][1])) {
        this._needSync = false;
        this._createBufferOnWrite = this._engine._features.trackUbosInFrame;
        return;
      } else {
        this._copyBuffer(this._bufferData, this._buffers[this._bufferIndex][1]);
      }
    }
    this._engine.updateUniformBuffer(this._buffer, this._bufferData);
    if (this._engine._features._collectUbosUpdatedInFrame) {
      if (!_UniformBuffer._UpdatedUbosInFrame[this._name]) {
        _UniformBuffer._UpdatedUbosInFrame[this._name] = 0;
      }
      _UniformBuffer._UpdatedUbosInFrame[this._name]++;
    }
    this._needSync = false;
    this._createBufferOnWrite = this._engine._features.trackUbosInFrame;
  }
  _createNewBuffer() {
    if (this._bufferIndex + 1 < this._buffers.length) {
      this._bufferIndex++;
      this._buffer = this._buffers[this._bufferIndex][0];
      this._createBufferOnWrite = false;
      this._needSync = true;
    } else {
      this._rebuild();
    }
  }
  _checkNewFrame() {
    if (this._engine._features.trackUbosInFrame && this._currentFrameId !== this._engine.frameId) {
      this._currentFrameId = this._engine.frameId;
      this._createBufferOnWrite = false;
      if (this._buffers && this._buffers.length > 0) {
        this._needSync = this._bufferIndex !== 0;
        this._bufferIndex = 0;
        this._buffer = this._buffers[this._bufferIndex][0];
      } else {
        this._bufferIndex = -1;
      }
    }
  }
  /**
   * Updates the value of an uniform. The `update` method must be called afterwards to make it effective in the GPU.
   * @param uniformName Define the name of the uniform, as used in the uniform block in the shader.
   * @param data Define the flattened data
   * @param size Define the size of the data.
   */
  updateUniform(uniformName, data, size) {
    this._checkNewFrame();
    let location2 = this._uniformLocations[uniformName];
    if (location2 === void 0) {
      if (this._buffer) {
        Logger.Error("Cannot add an uniform after UBO has been created. uniformName=" + uniformName);
        return;
      }
      this.addUniform(uniformName, size);
      location2 = this._uniformLocations[uniformName];
    }
    if (!this._buffer) {
      this.create();
    }
    if (!this._dynamic) {
      let changed = false;
      for (let i = 0; i < size; i++) {
        if (size === 16 && !this._engine._features.uniformBufferHardCheckMatrix || this._bufferData[location2 + i] !== Math.fround(data[i])) {
          changed = true;
          if (this._createBufferOnWrite) {
            this._createNewBuffer();
          }
          this._bufferData[location2 + i] = data[i];
        }
      }
      this._needSync = this._needSync || changed;
    } else {
      for (let i = 0; i < size; i++) {
        this._bufferData[location2 + i] = data[i];
      }
    }
  }
  /**
   * Updates the value of an uniform. The `update` method must be called afterwards to make it effective in the GPU.
   * @param uniformName Define the name of the uniform, as used in the uniform block in the shader.
   * @param data Define the flattened data
   * @param size Define the size of the data.
   */
  updateUniformArray(uniformName, data, size) {
    this._checkNewFrame();
    const location2 = this._uniformLocations[uniformName];
    if (location2 === void 0) {
      Logger.Error("Cannot add an uniform Array dynamically. Please, add it using addUniform and make sure that uniform buffers are supported by the current engine.");
      return;
    }
    if (!this._buffer) {
      this.create();
    }
    const arraySizes = this._uniformArraySizes[uniformName];
    if (!this._dynamic) {
      let changed = false;
      let countToFour = 0;
      let baseStride = 0;
      for (let i = 0; i < size; i++) {
        if (this._bufferData[location2 + baseStride * 4 + countToFour] !== Tools.FloatRound(data[i])) {
          changed = true;
          if (this._createBufferOnWrite) {
            this._createNewBuffer();
          }
          this._bufferData[location2 + baseStride * 4 + countToFour] = data[i];
        }
        countToFour++;
        if (countToFour === arraySizes.strideSize) {
          for (; countToFour < 4; countToFour++) {
            this._bufferData[location2 + baseStride * 4 + countToFour] = 0;
          }
          countToFour = 0;
          baseStride++;
        }
      }
      this._needSync = this._needSync || changed;
    } else {
      for (let i = 0; i < size; i++) {
        this._bufferData[location2 + i] = data[i];
      }
    }
  }
  _cacheMatrix(name2, matrix) {
    this._checkNewFrame();
    const cache = this._valueCache[name2];
    const flag = matrix.updateFlag;
    if (cache !== void 0 && cache === flag) {
      return false;
    }
    this._valueCache[name2] = flag;
    return true;
  }
  // Update methods
  _updateMatrix3x3ForUniform(name2, matrix) {
    for (let i = 0; i < 3; i++) {
      _UniformBuffer._TempBuffer[i * 4] = matrix[i * 3];
      _UniformBuffer._TempBuffer[i * 4 + 1] = matrix[i * 3 + 1];
      _UniformBuffer._TempBuffer[i * 4 + 2] = matrix[i * 3 + 2];
      _UniformBuffer._TempBuffer[i * 4 + 3] = 0;
    }
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 12);
  }
  _updateMatrix3x3ForEffect(name2, matrix) {
    this._currentEffect.setMatrix3x3(name2, matrix);
  }
  _updateMatrix2x2ForEffect(name2, matrix) {
    this._currentEffect.setMatrix2x2(name2, matrix);
  }
  _updateMatrix2x2ForUniform(name2, matrix) {
    for (let i = 0; i < 2; i++) {
      _UniformBuffer._TempBuffer[i * 4] = matrix[i * 2];
      _UniformBuffer._TempBuffer[i * 4 + 1] = matrix[i * 2 + 1];
      _UniformBuffer._TempBuffer[i * 4 + 2] = 0;
      _UniformBuffer._TempBuffer[i * 4 + 3] = 0;
    }
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 8);
  }
  _updateFloatForEffect(name2, x) {
    this._currentEffect.setFloat(name2, x);
  }
  _updateFloatForUniform(name2, x) {
    _UniformBuffer._TempBuffer[0] = x;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 1);
  }
  _updateFloat2ForEffect(name2, x, y, suffix = "") {
    this._currentEffect.setFloat2(name2 + suffix, x, y);
  }
  _updateFloat2ForUniform(name2, x, y) {
    _UniformBuffer._TempBuffer[0] = x;
    _UniformBuffer._TempBuffer[1] = y;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 2);
  }
  _updateFloat3ForEffect(name2, x, y, z, suffix = "") {
    this._currentEffect.setFloat3(name2 + suffix, x, y, z);
  }
  _updateFloat3ForUniform(name2, x, y, z) {
    _UniformBuffer._TempBuffer[0] = x;
    _UniformBuffer._TempBuffer[1] = y;
    _UniformBuffer._TempBuffer[2] = z;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 3);
  }
  _updateFloat4ForEffect(name2, x, y, z, w, suffix = "") {
    this._currentEffect.setFloat4(name2 + suffix, x, y, z, w);
  }
  _updateFloat4ForUniform(name2, x, y, z, w) {
    _UniformBuffer._TempBuffer[0] = x;
    _UniformBuffer._TempBuffer[1] = y;
    _UniformBuffer._TempBuffer[2] = z;
    _UniformBuffer._TempBuffer[3] = w;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 4);
  }
  _updateFloatArrayForEffect(name2, array) {
    this._currentEffect.setFloatArray(name2, array);
  }
  _updateFloatArrayForUniform(name2, array) {
    this.updateUniformArray(name2, array, array.length);
  }
  _updateArrayForEffect(name2, array) {
    this._currentEffect.setArray(name2, array);
  }
  _updateArrayForUniform(name2, array) {
    this.updateUniformArray(name2, array, array.length);
  }
  _updateIntArrayForEffect(name2, array) {
    this._currentEffect.setIntArray(name2, array);
  }
  _updateIntArrayForUniform(name2, array) {
    _UniformBuffer._TempBufferInt32View.set(array);
    this.updateUniformArray(name2, _UniformBuffer._TempBuffer, array.length);
  }
  _updateUIntArrayForEffect(name2, array) {
    this._currentEffect.setUIntArray(name2, array);
  }
  _updateUIntArrayForUniform(name2, array) {
    _UniformBuffer._TempBufferUInt32View.set(array);
    this.updateUniformArray(name2, _UniformBuffer._TempBuffer, array.length);
  }
  _updateMatrixForEffect(name2, mat) {
    this._currentEffect.setMatrix(name2, mat);
  }
  _updateMatrixForUniform(name2, mat) {
    if (this._cacheMatrix(name2, mat)) {
      this.updateUniform(name2, mat.asArray(), 16);
    }
  }
  _updateMatricesForEffect(name2, mat) {
    this._currentEffect.setMatrices(name2, mat);
  }
  _updateMatricesForUniform(name2, mat) {
    this.updateUniform(name2, mat, mat.length);
  }
  _updateVector3ForEffect(name2, vector) {
    this._currentEffect.setVector3(name2, vector);
  }
  _updateVector3ForUniform(name2, vector) {
    _UniformBuffer._TempBuffer[0] = vector.x;
    _UniformBuffer._TempBuffer[1] = vector.y;
    _UniformBuffer._TempBuffer[2] = vector.z;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 3);
  }
  _updateVector4ForEffect(name2, vector) {
    this._currentEffect.setVector4(name2, vector);
  }
  _updateVector4ForUniform(name2, vector) {
    _UniformBuffer._TempBuffer[0] = vector.x;
    _UniformBuffer._TempBuffer[1] = vector.y;
    _UniformBuffer._TempBuffer[2] = vector.z;
    _UniformBuffer._TempBuffer[3] = vector.w;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 4);
  }
  _updateColor3ForEffect(name2, color, suffix = "") {
    this._currentEffect.setColor3(name2 + suffix, color);
  }
  _updateColor3ForUniform(name2, color) {
    _UniformBuffer._TempBuffer[0] = color.r;
    _UniformBuffer._TempBuffer[1] = color.g;
    _UniformBuffer._TempBuffer[2] = color.b;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 3);
  }
  _updateColor4ForEffect(name2, color, alpha, suffix = "") {
    this._currentEffect.setColor4(name2 + suffix, color, alpha);
  }
  _updateDirectColor4ForEffect(name2, color, suffix = "") {
    this._currentEffect.setDirectColor4(name2 + suffix, color);
  }
  _updateColor4ForUniform(name2, color, alpha) {
    _UniformBuffer._TempBuffer[0] = color.r;
    _UniformBuffer._TempBuffer[1] = color.g;
    _UniformBuffer._TempBuffer[2] = color.b;
    _UniformBuffer._TempBuffer[3] = alpha;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 4);
  }
  _updateDirectColor4ForUniform(name2, color) {
    _UniformBuffer._TempBuffer[0] = color.r;
    _UniformBuffer._TempBuffer[1] = color.g;
    _UniformBuffer._TempBuffer[2] = color.b;
    _UniformBuffer._TempBuffer[3] = color.a;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 4);
  }
  _updateIntForEffect(name2, x, suffix = "") {
    this._currentEffect.setInt(name2 + suffix, x);
  }
  _updateIntForUniform(name2, x) {
    _UniformBuffer._TempBufferInt32View[0] = x;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 1);
  }
  _updateInt2ForEffect(name2, x, y, suffix = "") {
    this._currentEffect.setInt2(name2 + suffix, x, y);
  }
  _updateInt2ForUniform(name2, x, y) {
    _UniformBuffer._TempBufferInt32View[0] = x;
    _UniformBuffer._TempBufferInt32View[1] = y;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 2);
  }
  _updateInt3ForEffect(name2, x, y, z, suffix = "") {
    this._currentEffect.setInt3(name2 + suffix, x, y, z);
  }
  _updateInt3ForUniform(name2, x, y, z) {
    _UniformBuffer._TempBufferInt32View[0] = x;
    _UniformBuffer._TempBufferInt32View[1] = y;
    _UniformBuffer._TempBufferInt32View[2] = z;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 3);
  }
  _updateInt4ForEffect(name2, x, y, z, w, suffix = "") {
    this._currentEffect.setInt4(name2 + suffix, x, y, z, w);
  }
  _updateInt4ForUniform(name2, x, y, z, w) {
    _UniformBuffer._TempBufferInt32View[0] = x;
    _UniformBuffer._TempBufferInt32View[1] = y;
    _UniformBuffer._TempBufferInt32View[2] = z;
    _UniformBuffer._TempBufferInt32View[3] = w;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 4);
  }
  _updateUIntForEffect(name2, x, suffix = "") {
    this._currentEffect.setUInt(name2 + suffix, x);
  }
  _updateUIntForUniform(name2, x) {
    _UniformBuffer._TempBufferUInt32View[0] = x;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 1);
  }
  _updateUInt2ForEffect(name2, x, y, suffix = "") {
    this._currentEffect.setUInt2(name2 + suffix, x, y);
  }
  _updateUInt2ForUniform(name2, x, y) {
    _UniformBuffer._TempBufferUInt32View[0] = x;
    _UniformBuffer._TempBufferUInt32View[1] = y;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 2);
  }
  _updateUInt3ForEffect(name2, x, y, z, suffix = "") {
    this._currentEffect.setUInt3(name2 + suffix, x, y, z);
  }
  _updateUInt3ForUniform(name2, x, y, z) {
    _UniformBuffer._TempBufferUInt32View[0] = x;
    _UniformBuffer._TempBufferUInt32View[1] = y;
    _UniformBuffer._TempBufferUInt32View[2] = z;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 3);
  }
  _updateUInt4ForEffect(name2, x, y, z, w, suffix = "") {
    this._currentEffect.setUInt4(name2 + suffix, x, y, z, w);
  }
  _updateUInt4ForUniform(name2, x, y, z, w) {
    _UniformBuffer._TempBufferUInt32View[0] = x;
    _UniformBuffer._TempBufferUInt32View[1] = y;
    _UniformBuffer._TempBufferUInt32View[2] = z;
    _UniformBuffer._TempBufferUInt32View[3] = w;
    this.updateUniform(name2, _UniformBuffer._TempBuffer, 4);
  }
  /**
   * Sets a sampler uniform on the effect.
   * @param name Define the name of the sampler.
   * @param texture Define the texture to set in the sampler
   */
  setTexture(name2, texture) {
    this._currentEffect.setTexture(name2, texture);
  }
  /**
   * Sets a sampler uniform on the effect.
   * @param name Define the name of the sampler.
   * @param texture Define the (internal) texture to set in the sampler
   */
  bindTexture(name2, texture) {
    this._currentEffect._bindTexture(name2, texture);
  }
  /**
   * Directly updates the value of the uniform in the cache AND on the GPU.
   * @param uniformName Define the name of the uniform, as used in the uniform block in the shader.
   * @param data Define the flattened data
   */
  updateUniformDirectly(uniformName, data) {
    this.updateUniform(uniformName, data, data.length);
    this.update();
  }
  /**
   * Associates an effect to this uniform buffer
   * @param effect Define the effect to associate the buffer to
   * @param name Name of the uniform block in the shader.
   */
  bindToEffect(effect, name2) {
    this._currentEffect = effect;
    this._currentEffectName = name2;
  }
  /**
   * Binds the current (GPU) buffer to the effect
   */
  bindUniformBuffer() {
    if (!this._noUBO && this._buffer && this._currentEffect) {
      this._currentEffect.bindUniformBuffer(this._buffer, this._currentEffectName);
    }
  }
  /**
   * Dissociates the current effect from this uniform buffer
   */
  unbindEffect() {
    this._currentEffect = void 0;
    this._currentEffectName = void 0;
  }
  /**
   * Sets the current state of the class (_bufferIndex, _buffer) to point to the data buffer passed in parameter if this buffer is one of the buffers handled by the class (meaning if it can be found in the _buffers array)
   * This method is meant to be able to update a buffer at any time: just call setDataBuffer to set the class in the right state, call some updateXXX methods and then call udpate() => that will update the GPU buffer on the graphic card
   * @param dataBuffer buffer to look for
   * @returns true if the buffer has been found and the class internal state points to it, else false
   */
  setDataBuffer(dataBuffer) {
    if (!this._buffers) {
      return this._buffer === dataBuffer;
    }
    for (let b = 0; b < this._buffers.length; ++b) {
      const buffer = this._buffers[b];
      if (buffer[0] === dataBuffer) {
        this._bufferIndex = b;
        this._buffer = dataBuffer;
        this._createBufferOnWrite = false;
        this._currentEffect = void 0;
        return true;
      }
    }
    return false;
  }
  /**
   * Disposes the uniform buffer.
   */
  dispose() {
    if (this._noUBO) {
      return;
    }
    const uniformBuffers = this._engine._uniformBuffers;
    const index = uniformBuffers.indexOf(this);
    if (index !== -1) {
      uniformBuffers[index] = uniformBuffers[uniformBuffers.length - 1];
      uniformBuffers.pop();
    }
    if (this._engine._features.trackUbosInFrame && this._buffers) {
      for (let i = 0; i < this._buffers.length; ++i) {
        const buffer = this._buffers[i][0];
        this._engine._releaseBuffer(buffer);
      }
    } else if (this._buffer && this._engine._releaseBuffer(this._buffer)) {
      this._buffer = null;
    }
  }
};
UniformBuffer._UpdatedUbosInFrame = {};
UniformBuffer._MAX_UNIFORM_SIZE = 256;
UniformBuffer._TempBuffer = new Float32Array(UniformBuffer._MAX_UNIFORM_SIZE);
UniformBuffer._TempBufferInt32View = new Int32Array(UniformBuffer._TempBuffer.buffer);
UniformBuffer._TempBufferUInt32View = new Uint32Array(UniformBuffer._TempBuffer.buffer);

// node_modules/@babylonjs/core/ShadersWGSL/boundingInfo.compute.js
var name = "boundingInfoComputeShader";
var shader = `struct Results {minX : atomic<i32>,
minY : atomic<i32>,
minZ : atomic<i32>,
maxX : atomic<i32>,
maxY : atomic<i32>,
maxZ : atomic<i32>,
dummy1 : i32,
dummy2 : i32,};fn floatToBits(value: f32)->i32 {return bitcast<i32>(value);}
fn bitsToFloat(value: i32)->f32 {return bitcast<f32>(value);}
fn atomicMinFloat(atomicVar: ptr<storage,atomic<i32>,read_write>,value: f32) {let intValue=floatToBits(value);loop {let oldIntValue=atomicLoad(atomicVar);let oldValue=bitsToFloat(oldIntValue);if (value>=oldValue) {break;}
if (atomicCompareExchangeWeak(atomicVar,oldIntValue,intValue).old_value==oldIntValue) {break;}}}
fn atomicMaxFloat(atomicVar: ptr<storage,atomic<i32>,read_write>,value: f32) {let intValue=floatToBits(value);loop {let oldIntValue=atomicLoad(atomicVar);let oldValue=bitsToFloat(oldIntValue);if (value<=oldValue) {break;}
if (atomicCompareExchangeWeak(atomicVar,oldIntValue,intValue).old_value==oldIntValue) {break;}}}
fn readMatrixFromRawSampler(smp : texture_2d<f32>,index : f32)->mat4x4<f32>
{let offset=i32(index) *4; 
let m0=textureLoad(smp,vec2<i32>(offset+0,0),0);let m1=textureLoad(smp,vec2<i32>(offset+1,0),0);let m2=textureLoad(smp,vec2<i32>(offset+2,0),0);let m3=textureLoad(smp,vec2<i32>(offset+3,0),0);return mat4x4<f32>(m0,m1,m2,m3);}
const identity=mat4x4f(
vec4f(1.0,0.0,0.0,0.0),
vec4f(0.0,1.0,0.0,0.0),
vec4f(0.0,0.0,1.0,0.0),
vec4f(0.0,0.0,0.0,1.0)
);struct Settings {morphTargetTextureInfo: vec3f,
morphTargetCount: i32,
indexResult : u32,};@group(0) @binding(0) var<storage,read> positionBuffer : array<f32>;@group(0) @binding(1) var<storage,read_write> resultBuffer : array<Results>;@group(0) @binding(7) var<uniform> settings : Settings;
#if NUM_BONE_INFLUENCERS>0
@group(0) @binding(2) var boneSampler : texture_2d<f32>;@group(0) @binding(3) var<storage,read> indexBuffer : array<vec4f>;@group(0) @binding(4) var<storage,read> weightBuffer : array<vec4f>;
#if NUM_BONE_INFLUENCERS>4
@group(0) @binding(5) var<storage,read> indexExtraBuffer : array<vec4f>;@group(0) @binding(6) var<storage,read> weightExtraBuffer : array<vec4f>;
#endif
#endif
#ifdef MORPHTARGETS
@group(0) @binding(8) var morphTargets : texture_2d_array<f32>;@group(0) @binding(9) var<storage,read> morphTargetInfluences : array<f32>;@group(0) @binding(10) var<storage,read> morphTargetTextureIndices : array<f32>;
#endif
#ifdef MORPHTARGETS
fn readVector3FromRawSampler(targetIndex : i32,vertexIndex : u32)->vec3f
{ 
let vertexID=f32(vertexIndex)*settings.morphTargetTextureInfo.x;let y=floor(vertexID/settings.morphTargetTextureInfo.y);let x=vertexID-y*settings.morphTargetTextureInfo.y;let textureUV=vec2<i32>(i32(x),i32(y));return textureLoad(morphTargets,textureUV,i32(morphTargetTextureIndices[targetIndex]),0).xyz;}
#endif
@compute @workgroup_size(256,1,1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {let index=global_id.x;if (index>=arrayLength(&positionBuffer)/3) {return;}
let position=vec3f(positionBuffer[index*3],positionBuffer[index*3+1],positionBuffer[index*3+2]);var finalWorld=identity;var positionUpdated=position;
#if NUM_BONE_INFLUENCERS>0
var influence : mat4x4<f32>;let matricesIndices=indexBuffer[index];let matricesWeights=weightBuffer[index];influence=readMatrixFromRawSampler(boneSampler,matricesIndices[0])*matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
influence=influence+readMatrixFromRawSampler(boneSampler,matricesIndices[1])*matricesWeights[1];
#endif 
#if NUM_BONE_INFLUENCERS>2
influence=influence+readMatrixFromRawSampler(boneSampler,matricesIndices[2])*matricesWeights[2];
#endif 
#if NUM_BONE_INFLUENCERS>3
influence=influence+readMatrixFromRawSampler(boneSampler,matricesIndices[3])*matricesWeights[3];
#endif 
#if NUM_BONE_INFLUENCERS>4
let matricesIndicesExtra=indexExtraBuffer[index];let matricesWeightsExtra=weightExtraBuffer[index];influence=influence+readMatrixFromRawSampler(boneSampler,matricesIndicesExtra.x)*matricesWeightsExtra.x;
#if NUM_BONE_INFLUENCERS>5
influence=influence+readMatrixFromRawSampler(boneSampler,matricesIndicesExtra.y)*matricesWeightsExtra.y;
#endif 
#if NUM_BONE_INFLUENCERS>6
influence=influence+readMatrixFromRawSampler(boneSampler,matricesIndicesExtra.z)*matricesWeightsExtra.z;
#endif 
#if NUM_BONE_INFLUENCERS>7
influence=influence+readMatrixFromRawSampler(boneSampler,matricesIndicesExtra.w)*matricesWeightsExtra.w;
#endif 
#endif 
finalWorld=finalWorld*influence;
#endif
#ifdef MORPHTARGETS
for (var i=0; i<NUM_MORPH_INFLUENCERS; i=i+1) {if (i>=settings.morphTargetCount) {break;}
positionUpdated=positionUpdated+(readVector3FromRawSampler(i,index)-position)*morphTargetInfluences[i];}
#endif
var worldPos=finalWorld*vec4f(positionUpdated.x,positionUpdated.y,positionUpdated.z,1.0);atomicMinFloat(&resultBuffer[settings.indexResult].minX,worldPos.x);atomicMinFloat(&resultBuffer[settings.indexResult].minY,worldPos.y);atomicMinFloat(&resultBuffer[settings.indexResult].minZ,worldPos.z);atomicMaxFloat(&resultBuffer[settings.indexResult].maxX,worldPos.x);atomicMaxFloat(&resultBuffer[settings.indexResult].maxY,worldPos.y);atomicMaxFloat(&resultBuffer[settings.indexResult].maxZ,worldPos.z);}
`;
ShaderStore.ShadersStoreWGSL[name] = shader;

// node_modules/@babylonjs/core/Culling/Helper/computeShaderBoundingHelper.js
var ComputeShaderBoundingHelper = class {
  /**
   * Creates a new ComputeShaderBoundingHelper
   * @param engine defines the engine to use
   */
  constructor(engine) {
    this._computeShadersCache = {};
    this._positionBuffers = {};
    this._indexBuffers = {};
    this._weightBuffers = {};
    this._indexExtraBuffers = {};
    this._weightExtraBuffers = {};
    this._morphTargetInfluenceBuffers = {};
    this._morphTargetTextureIndexBuffers = {};
    this._ubos = [];
    this._uboIndex = 0;
    this._processedMeshes = [];
    this._computeShaders = [];
    this._uniqueComputeShaders = /* @__PURE__ */ new Set();
    this._resultBuffers = [];
    this._engine = engine;
  }
  _getComputeShader(defines, hasBones, hasMorphs) {
    let computeShader;
    const join = defines.join("\n");
    if (!this._computeShadersCache[join]) {
      const bindingsMapping = {
        positionBuffer: {
          group: 0,
          binding: 0
        },
        resultBuffer: {
          group: 0,
          binding: 1
        },
        settings: {
          group: 0,
          binding: 7
        }
      };
      if (hasBones) {
        bindingsMapping.boneSampler = {
          group: 0,
          binding: 2
        };
        bindingsMapping.indexBuffer = {
          group: 0,
          binding: 3
        };
        bindingsMapping.weightBuffer = {
          group: 0,
          binding: 4
        };
        bindingsMapping.indexExtraBuffer = {
          group: 0,
          binding: 5
        };
        bindingsMapping.weightExtraBuffer = {
          group: 0,
          binding: 6
        };
      }
      if (hasMorphs) {
        bindingsMapping.morphTargets = {
          group: 0,
          binding: 8
        };
        bindingsMapping.morphTargetInfluences = {
          group: 0,
          binding: 9
        };
        bindingsMapping.morphTargetTextureIndices = {
          group: 0,
          binding: 10
        };
      }
      computeShader = new ComputeShader(`boundingInfoCompute${hasBones ? "_bones" : ""}${hasMorphs ? "_morphs" : ""}`, this._engine, "boundingInfo", {
        bindingsMapping,
        defines
      });
      this._computeShadersCache[join] = computeShader;
    } else {
      computeShader = this._computeShadersCache[join];
    }
    return computeShader;
  }
  _getUBO() {
    if (this._uboIndex >= this._ubos.length) {
      const ubo = new UniformBuffer(this._engine);
      ubo.addFloat3("morphTargetTextureInfo", 0, 0, 0);
      ubo.addUniform("morphTargetCount", 1);
      ubo.addUniform("indexResult", 1);
      this._ubos.push(ubo);
    }
    return this._ubos[this._uboIndex++];
  }
  _extractDataAndLink(computeShader, mesh, kind, stride, name2, storageUnit) {
    let buffer;
    const vertexCount = mesh.getTotalVertices();
    if (!storageUnit[mesh.uniqueId]) {
      const dataArray = mesh.getVertexBuffer(kind)?.getFloatData(vertexCount);
      buffer = new StorageBuffer(this._engine, Float32Array.BYTES_PER_ELEMENT * vertexCount * stride);
      buffer.update(dataArray);
      storageUnit[mesh.uniqueId] = buffer;
    } else {
      buffer = storageUnit[mesh.uniqueId];
    }
    computeShader.setStorageBuffer(name2, buffer);
  }
  _prepareStorage(computeShader, name2, id, storageUnit, numInfluencers, data) {
    let buffer;
    if (!storageUnit[id]) {
      buffer = new StorageBuffer(this._engine, Float32Array.BYTES_PER_ELEMENT * numInfluencers);
      storageUnit[id] = buffer;
    } else {
      buffer = storageUnit[id];
    }
    buffer.update(data);
    computeShader.setStorageBuffer(name2, buffer);
  }
  /** @internal */
  processAsync(meshes) {
    return __async(this, null, function* () {
      yield this.registerMeshListAsync(meshes);
      this.processMeshList();
      yield this.fetchResultsForMeshListAsync();
    });
  }
  /** @internal */
  registerMeshListAsync(meshes) {
    this._disposeForMeshList();
    if (!Array.isArray(meshes)) {
      meshes = [meshes];
    }
    let maxNumInfluencers = 0;
    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      const vertexCount = mesh.getTotalVertices();
      if (vertexCount === 0 || !mesh.getVertexBuffer || !mesh.getVertexBuffer(VertexBuffer.PositionKind)) {
        continue;
      }
      this._processedMeshes.push(mesh);
      const manager = mesh.morphTargetManager;
      if (manager) {
        maxNumInfluencers = Math.max(maxNumInfluencers, manager.numTargets);
      }
    }
    for (let i = 0; i < this._processedMeshes.length; i++) {
      const mesh = this._processedMeshes[i];
      let defines = [""];
      let hasBones = false;
      if (mesh && mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
        defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
        hasBones = true;
      }
      const computeShaderWithoutMorph = this._getComputeShader(defines, hasBones, false);
      this._uniqueComputeShaders.add(computeShaderWithoutMorph);
      const manager = mesh.morphTargetManager;
      if (manager) {
        defines = defines.slice();
        defines.push("#define MORPHTARGETS");
        defines.push("#define NUM_MORPH_INFLUENCERS " + maxNumInfluencers);
        const computeShaderWithMorph = this._getComputeShader(defines, hasBones, true);
        this._uniqueComputeShaders.add(computeShaderWithMorph);
        this._computeShaders.push([computeShaderWithoutMorph, computeShaderWithMorph]);
      } else {
        this._computeShaders.push([computeShaderWithoutMorph, computeShaderWithoutMorph]);
      }
      const ubo = this._getUBO();
      ubo.updateUInt("indexResult", i);
      ubo.update();
    }
    return new Promise((resolve) => {
      const check = () => {
        const iterator = this._uniqueComputeShaders.keys();
        for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
          const computeShader = key.value;
          if (!computeShader.isReady()) {
            setTimeout(check, 10);
            return;
          }
        }
        resolve();
      };
      check();
    });
  }
  /** @internal */
  processMeshList() {
    if (this._processedMeshes.length === 0) {
      return;
    }
    this._uboIndex = 0;
    const resultDataSize = 8 * this._processedMeshes.length;
    const resultData = new Float32Array(resultDataSize);
    const resultBuffer = new StorageBuffer(this._engine, Float32Array.BYTES_PER_ELEMENT * resultDataSize);
    this._resultBuffers.push(resultBuffer);
    for (let i = 0; i < this._processedMeshes.length; i++) {
      resultData[i * 8 + 0] = Number.POSITIVE_INFINITY;
      resultData[i * 8 + 1] = Number.POSITIVE_INFINITY;
      resultData[i * 8 + 2] = Number.POSITIVE_INFINITY;
      resultData[i * 8 + 3] = Number.NEGATIVE_INFINITY;
      resultData[i * 8 + 4] = Number.NEGATIVE_INFINITY;
      resultData[i * 8 + 5] = Number.NEGATIVE_INFINITY;
    }
    resultBuffer.update(resultData);
    for (let i = 0; i < this._processedMeshes.length; i++) {
      const mesh = this._processedMeshes[i];
      const vertexCount = mesh.getTotalVertices();
      const [computeShaderWithoutMorph, computeShaderWithMorph] = this._computeShaders[i];
      const manager = mesh.morphTargetManager;
      const hasMorphs = manager && manager.numInfluencers > 0;
      const computeShader = hasMorphs ? computeShaderWithMorph : computeShaderWithoutMorph;
      this._extractDataAndLink(computeShader, mesh, VertexBuffer.PositionKind, 3, "positionBuffer", this._positionBuffers);
      if (mesh && mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton && mesh.skeleton.useTextureToStoreBoneMatrices) {
        this._extractDataAndLink(computeShader, mesh, VertexBuffer.MatricesIndicesKind, 4, "indexBuffer", this._indexBuffers);
        this._extractDataAndLink(computeShader, mesh, VertexBuffer.MatricesWeightsKind, 4, "weightBuffer", this._weightBuffers);
        const boneSampler = mesh.skeleton.getTransformMatrixTexture(mesh);
        computeShader.setTexture("boneSampler", boneSampler, false);
        if (mesh.numBoneInfluencers > 4) {
          this._extractDataAndLink(computeShader, mesh, VertexBuffer.MatricesIndicesExtraKind, 4, "indexExtraBuffer", this._indexExtraBuffers);
          this._extractDataAndLink(computeShader, mesh, VertexBuffer.MatricesWeightsExtraKind, 4, "weightExtraBuffer", this._weightExtraBuffers);
        }
      }
      const ubo = this._getUBO();
      if (hasMorphs) {
        const morphTargets = manager._targetStoreTexture;
        computeShader.setTexture("morphTargets", morphTargets, false);
        this._prepareStorage(computeShader, "morphTargetInfluences", mesh.uniqueId, this._morphTargetInfluenceBuffers, manager.numInfluencers, manager.influences);
        this._prepareStorage(computeShader, "morphTargetTextureIndices", mesh.uniqueId, this._morphTargetTextureIndexBuffers, manager.numInfluencers, manager._morphTargetTextureIndices);
        ubo.updateFloat3("morphTargetTextureInfo", manager._textureVertexStride, manager._textureWidth, manager._textureHeight);
        ubo.updateInt("morphTargetCount", manager.numInfluencers);
        ubo.update();
      }
      computeShader.setStorageBuffer("resultBuffer", resultBuffer);
      computeShader.setUniformBuffer("settings", ubo);
      computeShader.dispatch(Math.ceil(vertexCount / 256));
      this._engine.flushFramebuffer();
    }
  }
  /** @internal */
  fetchResultsForMeshListAsync() {
    return new Promise((resolve) => {
      const buffers = [];
      let size = 0;
      for (let i = 0; i < this._resultBuffers.length; i++) {
        const buffer = this._resultBuffers[i].getBuffer();
        buffers.push(buffer);
        size += buffer.capacity;
      }
      const resultData = new Float32Array(size / Float32Array.BYTES_PER_ELEMENT);
      const minimum = Vector3.Zero();
      const maximum = Vector3.Zero();
      const minmax = {
        minimum,
        maximum
      };
      this._engine.readFromMultipleStorageBuffers(buffers, 0, void 0, resultData, true).then(() => {
        let resultDataOffset = 0;
        for (let j = 0; j < this._resultBuffers.length; j++) {
          for (let i = 0; i < this._processedMeshes.length; i++) {
            const mesh = this._processedMeshes[i];
            Vector3.FromArrayToRef(resultData, resultDataOffset + i * 8, minimum);
            Vector3.FromArrayToRef(resultData, resultDataOffset + i * 8 + 3, maximum);
            if (j > 0) {
              minimum.minimizeInPlace(mesh.getBoundingInfo().minimum);
              maximum.maximizeInPlace(mesh.getBoundingInfo().maximum);
            }
            mesh._refreshBoundingInfoDirect(minmax);
            if (i === 0) {
            }
          }
          resultDataOffset += 8 * this._processedMeshes.length;
        }
        for (const resultBuffer of this._resultBuffers) {
          resultBuffer.dispose();
        }
        this._resultBuffers = [];
        this._uboIndex = 0;
        resolve();
      });
    });
  }
  _disposeCache(storageUnit) {
    for (const key in storageUnit) {
      storageUnit[key].dispose();
    }
  }
  _disposeForMeshList() {
    for (const resultBuffer of this._resultBuffers) {
      resultBuffer.dispose();
    }
    this._resultBuffers = [];
    this._processedMeshes = [];
    this._computeShaders = [];
    this._uniqueComputeShaders = /* @__PURE__ */ new Set();
  }
  /** @internal */
  dispose() {
    this._disposeCache(this._positionBuffers);
    this._positionBuffers = {};
    this._disposeCache(this._indexBuffers);
    this._indexBuffers = {};
    this._disposeCache(this._weightBuffers);
    this._weightBuffers = {};
    this._disposeCache(this._morphTargetInfluenceBuffers);
    this._morphTargetInfluenceBuffers = {};
    this._disposeCache(this._morphTargetTextureIndexBuffers);
    this._morphTargetTextureIndexBuffers = {};
    for (const ubo of this._ubos) {
      ubo.dispose();
    }
    this._ubos = [];
    this._computeShadersCache = {};
    this._engine = void 0;
    this._disposeForMeshList();
  }
};

export {
  DeepCopier,
  _WarnImport,
  Tags,
  SerializationHelper,
  Size,
  WebRequest,
  IsWindowObjectExist,
  IsNavigatorAvailable,
  IsDocumentAvailable,
  GetDOMTextContent,
  PrecisionDate,
  ErrorCodes,
  RuntimeError,
  Initialize,
  Process,
  PreProcess,
  Finalize,
  _ProcessIncludes,
  TimingTools,
  resetCachedPipeline,
  Effect,
  DepthCullingState,
  StencilStateComposer,
  InternalTexture,
  AbstractEngine,
  LoadImage,
  ReadFile,
  LoadFile,
  RequestFile,
  IsBase64DataUrl,
  RandomGUID,
  IsExponentOfTwo,
  Mix,
  NearestPOT,
  FloorPOT,
  GetExponentOfTwo,
  Tools,
  AsyncLoop,
  IsWrapper,
  WebGLDataBuffer,
  WebGLHardwareTexture,
  ThinEngine,
  UniformBuffer,
  PerfCounter,
  Plane,
  UniqueIdGenerator,
  useOpenGLOrientationForUV,
  allocateAndCopyTypedBuffer,
  ThinTexture,
  BaseTexture,
  Texture,
  StorageBuffer,
  WebGPUPerfCounter,
  ComputeShader,
  ComputeShaderBoundingHelper
};
//# sourceMappingURL=chunk-W2XACF5U.js.map
