// node_modules/@babylonjs/core/Maths/math.constants.js
var ToGammaSpace = 1 / 2.2;
var ToLinearSpace = 2.2;
var PHI = (1 + Math.sqrt(5)) / 2;
var Epsilon = 1e-3;

// node_modules/@babylonjs/core/Misc/arrayTools.js
function BuildArray(size, itemBuilder) {
  const a = [];
  for (let i = 0; i < size; ++i) {
    a.push(itemBuilder());
  }
  return a;
}
function BuildTuple(size, itemBuilder) {
  return BuildArray(size, itemBuilder);
}
function _observeArrayfunction(object, functionName, callback) {
  const oldFunction = object[functionName];
  if (typeof oldFunction !== "function") {
    return null;
  }
  const newFunction = function() {
    const previousLength = object.length;
    const returnValue = newFunction.previous.apply(object, arguments);
    callback(functionName, previousLength);
    return returnValue;
  };
  oldFunction.next = newFunction;
  newFunction.previous = oldFunction;
  object[functionName] = newFunction;
  return () => {
    const previous = newFunction.previous;
    if (!previous) {
      return;
    }
    const next = newFunction.next;
    if (next) {
      previous.next = next;
      next.previous = previous;
    } else {
      previous.next = void 0;
      object[functionName] = previous;
    }
    newFunction.next = void 0;
    newFunction.previous = void 0;
  };
}
var observedArrayFunctions = ["push", "splice", "pop", "shift", "unshift"];
function _ObserveArray(array, callback) {
  const unObserveFunctions = observedArrayFunctions.map((name) => {
    return _observeArrayfunction(array, name, callback);
  });
  return () => {
    unObserveFunctions.forEach((unObserveFunction) => {
      unObserveFunction?.();
    });
  };
}

// node_modules/@babylonjs/core/Misc/typeStore.js
var _RegisteredTypes = {};
function RegisterClass(className, type) {
  _RegisteredTypes[className] = type;
}
function GetClass(fqdn) {
  return _RegisteredTypes[fqdn];
}

// node_modules/@babylonjs/core/Engines/performanceConfigurator.js
var PerformanceConfigurator = class _PerformanceConfigurator {
  /**
   * @internal
   */
  static SetMatrixPrecision(use64bits) {
    _PerformanceConfigurator.MatrixTrackPrecisionChange = false;
    if (use64bits && !_PerformanceConfigurator.MatrixUse64Bits) {
      if (_PerformanceConfigurator.MatrixTrackedMatrices) {
        for (let m = 0; m < _PerformanceConfigurator.MatrixTrackedMatrices.length; ++m) {
          const matrix = _PerformanceConfigurator.MatrixTrackedMatrices[m];
          const values = matrix._m;
          matrix._m = new Array(16);
          for (let i = 0; i < 16; ++i) {
            matrix._m[i] = values[i];
          }
        }
      }
    }
    _PerformanceConfigurator.MatrixUse64Bits = use64bits;
    _PerformanceConfigurator.MatrixCurrentType = _PerformanceConfigurator.MatrixUse64Bits ? Array : Float32Array;
    _PerformanceConfigurator.MatrixTrackedMatrices = null;
  }
};
PerformanceConfigurator.MatrixUse64Bits = false;
PerformanceConfigurator.MatrixTrackPrecisionChange = true;
PerformanceConfigurator.MatrixCurrentType = Float32Array;
PerformanceConfigurator.MatrixTrackedMatrices = [];

// node_modules/@babylonjs/core/Misc/observable.js
var EventState = class {
  /**
   * Create a new EventState
   * @param mask defines the mask associated with this state
   * @param skipNextObservers defines a flag which will instruct the observable to skip following observers when set to true
   * @param target defines the original target of the state
   * @param currentTarget defines the current target of the state
   */
  constructor(mask, skipNextObservers = false, target, currentTarget) {
    this.initialize(mask, skipNextObservers, target, currentTarget);
  }
  /**
   * Initialize the current event state
   * @param mask defines the mask associated with this state
   * @param skipNextObservers defines a flag which will instruct the observable to skip following observers when set to true
   * @param target defines the original target of the state
   * @param currentTarget defines the current target of the state
   * @returns the current event state
   */
  initialize(mask, skipNextObservers = false, target, currentTarget) {
    this.mask = mask;
    this.skipNextObservers = skipNextObservers;
    this.target = target;
    this.currentTarget = currentTarget;
    return this;
  }
};
var Observer = class {
  /**
   * Creates a new observer
   * @param callback defines the callback to call when the observer is notified
   * @param mask defines the mask of the observer (used to filter notifications)
   * @param scope defines the current scope used to restore the JS context
   */
  constructor(callback, mask, scope = null) {
    this.callback = callback;
    this.mask = mask;
    this.scope = scope;
    this._willBeUnregistered = false;
    this.unregisterOnNextCall = false;
    this._remove = null;
  }
  /**
   * Remove the observer from its observable
   * This can be used instead of using the observable's remove function.
   */
  remove() {
    if (this._remove) {
      this._remove();
    }
  }
};
var Observable = class _Observable {
  /**
   * Create an observable from a Promise.
   * @param promise a promise to observe for fulfillment.
   * @param onErrorObservable an observable to notify if a promise was rejected.
   * @returns the new Observable
   */
  static FromPromise(promise, onErrorObservable) {
    const observable = new _Observable();
    promise.then((ret) => {
      observable.notifyObservers(ret);
    }).catch((err) => {
      if (onErrorObservable) {
        onErrorObservable.notifyObservers(err);
      } else {
        throw err;
      }
    });
    return observable;
  }
  /**
   * Gets the list of observers
   * Note that observers that were recently deleted may still be present in the list because they are only really deleted on the next javascript tick!
   */
  get observers() {
    return this._observers;
  }
  /**
   * Creates a new observable
   * @param onObserverAdded defines a callback to call when a new observer is added
   * @param notifyIfTriggered If set to true the observable will notify when an observer was added if the observable was already triggered.
   */
  constructor(onObserverAdded, notifyIfTriggered = false) {
    this.notifyIfTriggered = notifyIfTriggered;
    this._observers = new Array();
    this._numObserversMarkedAsDeleted = 0;
    this._hasNotified = false;
    this._eventState = new EventState(0);
    if (onObserverAdded) {
      this._onObserverAdded = onObserverAdded;
    }
  }
  add(callback, mask = -1, insertFirst = false, scope = null, unregisterOnFirstCall = false) {
    if (!callback) {
      return null;
    }
    const observer = new Observer(callback, mask, scope);
    observer.unregisterOnNextCall = unregisterOnFirstCall;
    if (insertFirst) {
      this._observers.unshift(observer);
    } else {
      this._observers.push(observer);
    }
    if (this._onObserverAdded) {
      this._onObserverAdded(observer);
    }
    if (this._hasNotified && this.notifyIfTriggered) {
      if (this._lastNotifiedValue !== void 0) {
        this.notifyObserver(observer, this._lastNotifiedValue);
      }
    }
    observer._remove = () => {
      this.remove(observer);
    };
    return observer;
  }
  addOnce(callback) {
    return this.add(callback, void 0, void 0, void 0, true);
  }
  /**
   * Remove an Observer from the Observable object
   * @param observer the instance of the Observer to remove
   * @returns false if it doesn't belong to this Observable
   */
  remove(observer) {
    if (!observer) {
      return false;
    }
    observer._remove = null;
    const index = this._observers.indexOf(observer);
    if (index !== -1) {
      this._deferUnregister(observer);
      return true;
    }
    return false;
  }
  /**
   * Remove a callback from the Observable object
   * @param callback the callback to remove
   * @param scope optional scope. If used only the callbacks with this scope will be removed
   * @returns false if it doesn't belong to this Observable
   */
  removeCallback(callback, scope) {
    for (let index = 0; index < this._observers.length; index++) {
      const observer = this._observers[index];
      if (observer._willBeUnregistered) {
        continue;
      }
      if (observer.callback === callback && (!scope || scope === observer.scope)) {
        this._deferUnregister(observer);
        return true;
      }
    }
    return false;
  }
  /**
   * @internal
   */
  _deferUnregister(observer) {
    if (observer._willBeUnregistered) {
      return;
    }
    this._numObserversMarkedAsDeleted++;
    observer.unregisterOnNextCall = false;
    observer._willBeUnregistered = true;
    setTimeout(() => {
      this._remove(observer);
    }, 0);
  }
  // This should only be called when not iterating over _observers to avoid callback skipping.
  // Removes an observer from the _observer Array.
  _remove(observer, updateCounter = true) {
    if (!observer) {
      return false;
    }
    const index = this._observers.indexOf(observer);
    if (index !== -1) {
      if (updateCounter) {
        this._numObserversMarkedAsDeleted--;
      }
      this._observers.splice(index, 1);
      return true;
    }
    return false;
  }
  /**
   * Moves the observable to the top of the observer list making it get called first when notified
   * @param observer the observer to move
   */
  makeObserverTopPriority(observer) {
    this._remove(observer, false);
    this._observers.unshift(observer);
  }
  /**
   * Moves the observable to the bottom of the observer list making it get called last when notified
   * @param observer the observer to move
   */
  makeObserverBottomPriority(observer) {
    this._remove(observer, false);
    this._observers.push(observer);
  }
  /**
   * Notify all Observers by calling their respective callback with the given data
   * Will return true if all observers were executed, false if an observer set skipNextObservers to true, then prevent the subsequent ones to execute
   * @param eventData defines the data to send to all observers
   * @param mask defines the mask of the current notification (observers with incompatible mask (ie mask & observer.mask === 0) will not be notified)
   * @param target defines the original target of the state
   * @param currentTarget defines the current target of the state
   * @param userInfo defines any user info to send to observers
   * @returns false if the complete observer chain was not processed (because one observer set the skipNextObservers to true)
   */
  notifyObservers(eventData, mask = -1, target, currentTarget, userInfo) {
    if (this.notifyIfTriggered) {
      this._hasNotified = true;
      this._lastNotifiedValue = eventData;
    }
    if (!this._observers.length) {
      return true;
    }
    const state = this._eventState;
    state.mask = mask;
    state.target = target;
    state.currentTarget = currentTarget;
    state.skipNextObservers = false;
    state.lastReturnValue = eventData;
    state.userInfo = userInfo;
    for (const obs of this._observers) {
      if (obs._willBeUnregistered) {
        continue;
      }
      if (obs.mask & mask) {
        if (obs.unregisterOnNextCall) {
          this._deferUnregister(obs);
        }
        if (obs.scope) {
          state.lastReturnValue = obs.callback.apply(obs.scope, [eventData, state]);
        } else {
          state.lastReturnValue = obs.callback(eventData, state);
        }
      }
      if (state.skipNextObservers) {
        return false;
      }
    }
    return true;
  }
  /**
   * Notify a specific observer
   * @param observer defines the observer to notify
   * @param eventData defines the data to be sent to each callback
   * @param mask is used to filter observers defaults to -1
   */
  notifyObserver(observer, eventData, mask = -1) {
    if (this.notifyIfTriggered) {
      this._hasNotified = true;
      this._lastNotifiedValue = eventData;
    }
    if (observer._willBeUnregistered) {
      return;
    }
    const state = this._eventState;
    state.mask = mask;
    state.skipNextObservers = false;
    if (observer.unregisterOnNextCall) {
      this._deferUnregister(observer);
    }
    observer.callback(eventData, state);
  }
  /**
   * Gets a boolean indicating if the observable has at least one observer
   * @returns true is the Observable has at least one Observer registered
   */
  hasObservers() {
    return this._observers.length - this._numObserversMarkedAsDeleted > 0;
  }
  /**
   * Clear the list of observers
   */
  clear() {
    while (this._observers.length) {
      const o = this._observers.pop();
      if (o) {
        o._remove = null;
      }
    }
    this._onObserverAdded = null;
    this._numObserversMarkedAsDeleted = 0;
    this.cleanLastNotifiedState();
  }
  /**
   * Clean the last notified state - both the internal last value and the has-notified flag
   */
  cleanLastNotifiedState() {
    this._hasNotified = false;
    this._lastNotifiedValue = void 0;
  }
  /**
   * Clone the current observable
   * @returns a new observable
   */
  clone() {
    const result = new _Observable();
    result._observers = this._observers.slice(0);
    return result;
  }
  /**
   * Does this observable handles observer registered with a given mask
   * @param mask defines the mask to be tested
   * @returns whether or not one observer registered with the given mask is handled
   **/
  hasSpecificMask(mask = -1) {
    for (const obs of this._observers) {
      if (obs.mask & mask || obs.mask === mask) {
        return true;
      }
    }
    return false;
  }
};

// node_modules/@babylonjs/core/Engines/engineStore.js
var EngineStore = class {
  /**
   * Gets the latest created engine
   */
  static get LastCreatedEngine() {
    if (this.Instances.length === 0) {
      return null;
    }
    return this.Instances[this.Instances.length - 1];
  }
  /**
   * Gets the latest created scene
   */
  static get LastCreatedScene() {
    return this._LastCreatedScene;
  }
};
EngineStore.Instances = [];
EngineStore.OnEnginesDisposedObservable = new Observable();
EngineStore._LastCreatedScene = null;
EngineStore.UseFallbackTexture = true;
EngineStore.FallbackTexture = "";

// node_modules/@babylonjs/core/Maths/math.scalar.functions.js
function WithinEpsilon(a, b, epsilon = 1401298e-51) {
  return Math.abs(a - b) <= epsilon;
}
function RandomRange(min, max) {
  if (min === max) {
    return min;
  }
  return Math.random() * (max - min) + min;
}
function Lerp(start, end, amount) {
  return start + (end - start) * amount;
}
function Clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}
function NormalizeRadians(angle) {
  angle -= Math.PI * 2 * Math.floor((angle + Math.PI) / (Math.PI * 2));
  return angle;
}
function ToHex(i) {
  const str = i.toString(16);
  if (i <= 15) {
    return ("0" + str).toUpperCase();
  }
  return str.toUpperCase();
}

// node_modules/@babylonjs/core/Maths/math.vector.js
var _ExtractAsInt = (value) => {
  return parseInt(value.toString().replace(/\W/g, ""));
};
var Vector2 = class _Vector2 {
  /**
   * Creates a new Vector2 from the given x and y coordinates
   * @param x defines the first coordinate
   * @param y defines the second coordinate
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  /**
   * Gets a string with the Vector2 coordinates
   * @returns a string with the Vector2 coordinates
   */
  toString() {
    return `{X: ${this.x} Y: ${this.y}}`;
  }
  /**
   * Gets class name
   * @returns the string "Vector2"
   */
  getClassName() {
    return "Vector2";
  }
  /**
   * Gets current vector hash code
   * @returns the Vector2 hash code as a number
   */
  getHashCode() {
    const x = _ExtractAsInt(this.x);
    const y = _ExtractAsInt(this.y);
    let hash = x;
    hash = hash * 397 ^ y;
    return hash;
  }
  // Operators
  /**
   * Sets the Vector2 coordinates in the given array or Float32Array from the given index.
   * Example Playground https://playground.babylonjs.com/#QYBWV4#15
   * @param array defines the source array
   * @param index defines the offset in source array
   * @returns the current Vector2
   */
  toArray(array, index = 0) {
    array[index] = this.x;
    array[index + 1] = this.y;
    return this;
  }
  /**
   * Update the current vector from an array
   * Example Playground https://playground.babylonjs.com/#QYBWV4#39
   * @param array defines the destination array
   * @param offset defines the offset in the destination array
   * @returns the current Vector2
   */
  fromArray(array, offset = 0) {
    _Vector2.FromArrayToRef(array, offset, this);
    return this;
  }
  /**
   * Copy the current vector to an array
   * Example Playground https://playground.babylonjs.com/#QYBWV4#40
   * @returns a new array with 2 elements: the Vector2 coordinates.
   */
  asArray() {
    return [this.x, this.y];
  }
  /**
   * Sets the Vector2 coordinates with the given Vector2 coordinates
   * Example Playground https://playground.babylonjs.com/#QYBWV4#24
   * @param source defines the source Vector2
   * @returns the current updated Vector2
   */
  copyFrom(source) {
    this.x = source.x;
    this.y = source.y;
    return this;
  }
  /**
   * Sets the Vector2 coordinates with the given floats
   * Example Playground https://playground.babylonjs.com/#QYBWV4#25
   * @param x defines the first coordinate
   * @param y defines the second coordinate
   * @returns the current updated Vector2
   */
  copyFromFloats(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  /**
   * Sets the Vector2 coordinates with the given floats
   * Example Playground https://playground.babylonjs.com/#QYBWV4#62
   * @param x defines the first coordinate
   * @param y defines the second coordinate
   * @returns the current updated Vector2
   */
  set(x, y) {
    return this.copyFromFloats(x, y);
  }
  /**
   * Copies the given float to the current Vector2 coordinates
   * @param v defines the x and y coordinates of the operand
   * @returns the current updated Vector2
   */
  setAll(v) {
    return this.copyFromFloats(v, v);
  }
  /**
   * Add another vector with the current one
   * Example Playground https://playground.babylonjs.com/#QYBWV4#11
   * @param otherVector defines the other vector
   * @returns a new Vector2 set with the addition of the current Vector2 and the given one coordinates
   */
  add(otherVector) {
    return new _Vector2(this.x + otherVector.x, this.y + otherVector.y);
  }
  /**
   * Sets the "result" coordinates with the addition of the current Vector2 and the given one coordinates
   * Example Playground https://playground.babylonjs.com/#QYBWV4#12
   * @param otherVector defines the other vector
   * @param result defines the target vector
   * @returns result input
   */
  addToRef(otherVector, result) {
    result.x = this.x + otherVector.x;
    result.y = this.y + otherVector.y;
    return result;
  }
  /**
   * Set the Vector2 coordinates by adding the given Vector2 coordinates
   * Example Playground https://playground.babylonjs.com/#QYBWV4#13
   * @param otherVector defines the other vector
   * @returns the current updated Vector2
   */
  addInPlace(otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
    return this;
  }
  /**
   * Adds the given coordinates to the current Vector2
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @returns the current updated Vector2
   */
  addInPlaceFromFloats(x, y) {
    this.x += x;
    this.y += y;
    return this;
  }
  /**
   * Gets a new Vector2 by adding the current Vector2 coordinates to the given Vector3 x, y coordinates
   * Example Playground https://playground.babylonjs.com/#QYBWV4#14
   * @param otherVector defines the other vector
   * @returns a new Vector2
   */
  addVector3(otherVector) {
    return new _Vector2(this.x + otherVector.x, this.y + otherVector.y);
  }
  /**
   * Gets a new Vector2 set with the subtracted coordinates of the given one from the current Vector2
   * Example Playground https://playground.babylonjs.com/#QYBWV4#61
   * @param otherVector defines the other vector
   * @returns a new Vector2
   */
  subtract(otherVector) {
    return new _Vector2(this.x - otherVector.x, this.y - otherVector.y);
  }
  /**
   * Sets the "result" coordinates with the subtraction of the given one from the current Vector2 coordinates.
   * Example Playground https://playground.babylonjs.com/#QYBWV4#63
   * @param otherVector defines the other vector
   * @param result defines the target vector
   * @returns result input
   */
  subtractToRef(otherVector, result) {
    result.x = this.x - otherVector.x;
    result.y = this.y - otherVector.y;
    return result;
  }
  /**
   * Sets the current Vector2 coordinates by subtracting from it the given one coordinates
   * Example Playground https://playground.babylonjs.com/#QYBWV4#88
   * @param otherVector defines the other vector
   * @returns the current updated Vector2
   */
  subtractInPlace(otherVector) {
    this.x -= otherVector.x;
    this.y -= otherVector.y;
    return this;
  }
  /**
   * Multiplies in place the current Vector2 coordinates by the given ones
   * Example Playground https://playground.babylonjs.com/#QYBWV4#43
   * @param otherVector defines the other vector
   * @returns the current updated Vector2
   */
  multiplyInPlace(otherVector) {
    this.x *= otherVector.x;
    this.y *= otherVector.y;
    return this;
  }
  /**
   * Returns a new Vector2 set with the multiplication of the current Vector2 and the given one coordinates
   * Example Playground https://playground.babylonjs.com/#QYBWV4#42
   * @param otherVector defines the other vector
   * @returns a new Vector2
   */
  multiply(otherVector) {
    return new _Vector2(this.x * otherVector.x, this.y * otherVector.y);
  }
  /**
   * Sets "result" coordinates with the multiplication of the current Vector2 and the given one coordinates
   * Example Playground https://playground.babylonjs.com/#QYBWV4#44
   * @param otherVector defines the other vector
   * @param result defines the target vector
   * @returns result input
   */
  multiplyToRef(otherVector, result) {
    result.x = this.x * otherVector.x;
    result.y = this.y * otherVector.y;
    return result;
  }
  /**
   * Gets a new Vector2 set with the Vector2 coordinates multiplied by the given floats
   * Example Playground https://playground.babylonjs.com/#QYBWV4#89
   * @param x defines the first coordinate
   * @param y defines the second coordinate
   * @returns a new Vector2
   */
  multiplyByFloats(x, y) {
    return new _Vector2(this.x * x, this.y * y);
  }
  /**
   * Returns a new Vector2 set with the Vector2 coordinates divided by the given one coordinates
   * Example Playground https://playground.babylonjs.com/#QYBWV4#27
   * @param otherVector defines the other vector
   * @returns a new Vector2
   */
  divide(otherVector) {
    return new _Vector2(this.x / otherVector.x, this.y / otherVector.y);
  }
  /**
   * Sets the "result" coordinates with the Vector2 divided by the given one coordinates
   * Example Playground https://playground.babylonjs.com/#QYBWV4#30
   * @param otherVector defines the other vector
   * @param result defines the target vector
   * @returns result input
   */
  divideToRef(otherVector, result) {
    result.x = this.x / otherVector.x;
    result.y = this.y / otherVector.y;
    return result;
  }
  /**
   * Divides the current Vector2 coordinates by the given ones
   * Example Playground https://playground.babylonjs.com/#QYBWV4#28
   * @param otherVector defines the other vector
   * @returns the current updated Vector2
   */
  divideInPlace(otherVector) {
    this.x = this.x / otherVector.x;
    this.y = this.y / otherVector.y;
    return this;
  }
  /**
   * Updates the current Vector2 with the minimal coordinate values between its and the given vector ones
   * @param other defines the second operand
   * @returns the current updated Vector2
   */
  minimizeInPlace(other) {
    return this.minimizeInPlaceFromFloats(other.x, other.y);
  }
  /**
   * Updates the current Vector2 with the maximal coordinate values between its and the given vector ones.
   * @param other defines the second operand
   * @returns the current updated Vector2
   */
  maximizeInPlace(other) {
    return this.maximizeInPlaceFromFloats(other.x, other.y);
  }
  /**
   * Updates the current Vector2 with the minimal coordinate values between its and the given coordinates
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @returns the current updated Vector2
   */
  minimizeInPlaceFromFloats(x, y) {
    this.x = Math.min(x, this.x);
    this.y = Math.min(y, this.y);
    return this;
  }
  /**
   * Updates the current Vector2 with the maximal coordinate values between its and the given coordinates.
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @returns the current updated Vector2
   */
  maximizeInPlaceFromFloats(x, y) {
    this.x = Math.max(x, this.x);
    this.y = Math.max(y, this.y);
    return this;
  }
  /**
   * Returns a new Vector2 set with the subtraction of the given floats from the current Vector2 coordinates
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @returns the resulting Vector2
   */
  subtractFromFloats(x, y) {
    return new _Vector2(this.x - x, this.y - y);
  }
  /**
   * Subtracts the given floats from the current Vector2 coordinates and set the given vector "result" with this result
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param result defines the Vector2 object where to store the result
   * @returns the result
   */
  subtractFromFloatsToRef(x, y, result) {
    result.x = this.x - x;
    result.y = this.y - y;
    return result;
  }
  /**
   * Gets a new Vector2 with current Vector2 negated coordinates
   * @returns a new Vector2
   */
  negate() {
    return new _Vector2(-this.x, -this.y);
  }
  /**
   * Negate this vector in place
   * Example Playground https://playground.babylonjs.com/#QYBWV4#23
   * @returns this
   */
  negateInPlace() {
    this.x *= -1;
    this.y *= -1;
    return this;
  }
  /**
   * Negate the current Vector2 and stores the result in the given vector "result" coordinates
   * Example Playground https://playground.babylonjs.com/#QYBWV4#41
   * @param result defines the Vector3 object where to store the result
   * @returns the result
   */
  negateToRef(result) {
    result.x = -this.x;
    result.y = -this.y;
    return result;
  }
  /**
   * Multiply the Vector2 coordinates by
   * Example Playground https://playground.babylonjs.com/#QYBWV4#59
   * @param scale defines the scaling factor
   * @returns the current updated Vector2
   */
  scaleInPlace(scale) {
    this.x *= scale;
    this.y *= scale;
    return this;
  }
  /**
   * Returns a new Vector2 scaled by "scale" from the current Vector2
   * Example Playground https://playground.babylonjs.com/#QYBWV4#52
   * @param scale defines the scaling factor
   * @returns a new Vector2
   */
  scale(scale) {
    return new _Vector2(this.x * scale, this.y * scale);
  }
  /**
   * Scale the current Vector2 values by a factor to a given Vector2
   * Example Playground https://playground.babylonjs.com/#QYBWV4#57
   * @param scale defines the scale factor
   * @param result defines the Vector2 object where to store the result
   * @returns result input
   */
  scaleToRef(scale, result) {
    result.x = this.x * scale;
    result.y = this.y * scale;
    return result;
  }
  /**
   * Scale the current Vector2 values by a factor and add the result to a given Vector2
   * Example Playground https://playground.babylonjs.com/#QYBWV4#58
   * @param scale defines the scale factor
   * @param result defines the Vector2 object where to store the result
   * @returns result input
   */
  scaleAndAddToRef(scale, result) {
    result.x += this.x * scale;
    result.y += this.y * scale;
    return result;
  }
  /**
   * Gets a boolean if two vectors are equals
   * Example Playground https://playground.babylonjs.com/#QYBWV4#31
   * @param otherVector defines the other vector
   * @returns true if the given vector coordinates strictly equal the current Vector2 ones
   */
  equals(otherVector) {
    return otherVector && this.x === otherVector.x && this.y === otherVector.y;
  }
  /**
   * Gets a boolean if two vectors are equals (using an epsilon value)
   * Example Playground https://playground.babylonjs.com/#QYBWV4#32
   * @param otherVector defines the other vector
   * @param epsilon defines the minimal distance to consider equality
   * @returns true if the given vector coordinates are close to the current ones by a distance of epsilon.
   */
  equalsWithEpsilon(otherVector, epsilon = Epsilon) {
    return otherVector && WithinEpsilon(this.x, otherVector.x, epsilon) && WithinEpsilon(this.y, otherVector.y, epsilon);
  }
  /**
   * Returns true if the current Vector2 coordinates equals the given floats
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @returns true if both vectors are equal
   */
  equalsToFloats(x, y) {
    return this.x === x && this.y === y;
  }
  /**
   * Gets a new Vector2 from current Vector2 floored values
   * Example Playground https://playground.babylonjs.com/#QYBWV4#35
   * eg (1.2, 2.31) returns (1, 2)
   * @returns a new Vector2
   */
  floor() {
    return new _Vector2(Math.floor(this.x), Math.floor(this.y));
  }
  /**
   * Gets the current Vector2's floored values and stores them in result
   * @param result the Vector2 to store the result in
   * @returns the result Vector2
   */
  floorToRef(result) {
    result.x = Math.floor(this.x);
    result.y = Math.floor(this.y);
    return result;
  }
  /**
   * Gets a new Vector2 from current Vector2 fractional values
   * Example Playground https://playground.babylonjs.com/#QYBWV4#34
   * eg (1.2, 2.31) returns (0.2, 0.31)
   * @returns a new Vector2
   */
  fract() {
    return new _Vector2(this.x - Math.floor(this.x), this.y - Math.floor(this.y));
  }
  /**
   * Gets the current Vector2's fractional values and stores them in result
   * @param result the Vector2 to store the result in
   * @returns the result Vector2
   */
  fractToRef(result) {
    result.x = this.x - Math.floor(this.x);
    result.y = this.y - Math.floor(this.y);
    return result;
  }
  /**
   * Rotate the current vector into a given result vector
   * Example Playground https://playground.babylonjs.com/#QYBWV4#49
   * @param angle defines the rotation angle
   * @param result defines the result vector where to store the rotated vector
   * @returns result input
   */
  rotateToRef(angle, result) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = cos * this.x - sin * this.y;
    const y = sin * this.x + cos * this.y;
    result.x = x;
    result.y = y;
    return result;
  }
  // Properties
  /**
   * Gets the length of the vector
   * @returns the vector length (float)
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * Gets the vector squared length
   * @returns the vector squared length (float)
   */
  lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }
  // Methods
  /**
   * Normalize the vector
   * Example Playground https://playground.babylonjs.com/#QYBWV4#48
   * @returns the current updated Vector2
   */
  normalize() {
    return this.normalizeFromLength(this.length());
  }
  /**
   * Normalize the current Vector2 with the given input length.
   * Please note that this is an in place operation.
   * @param len the length of the vector
   * @returns the current updated Vector2
   */
  normalizeFromLength(len) {
    if (len === 0 || len === 1) {
      return this;
    }
    return this.scaleInPlace(1 / len);
  }
  /**
   * Normalize the current Vector2 to a new vector
   * @returns the new Vector2
   */
  normalizeToNew() {
    const normalized = new _Vector2();
    this.normalizeToRef(normalized);
    return normalized;
  }
  /**
   * Normalize the current Vector2 to the reference
   * @param result define the Vector to update
   * @returns the updated Vector2
   */
  normalizeToRef(result) {
    const len = this.length();
    if (len === 0) {
      result.x = this.x;
      result.y = this.y;
    }
    return this.scaleToRef(1 / len, result);
  }
  /**
   * Gets a new Vector2 copied from the Vector2
   * Example Playground https://playground.babylonjs.com/#QYBWV4#20
   * @returns a new Vector2
   */
  clone() {
    return new _Vector2(this.x, this.y);
  }
  /**
   * Gets the dot product of the current vector and the vector "otherVector"
   * @param otherVector defines second vector
   * @returns the dot product (float)
   */
  dot(otherVector) {
    return this.x * otherVector.x + this.y * otherVector.y;
  }
  // Statics
  /**
   * Gets a new Vector2(0, 0)
   * @returns a new Vector2
   */
  static Zero() {
    return new _Vector2(0, 0);
  }
  /**
   * Gets a new Vector2(1, 1)
   * @returns a new Vector2
   */
  static One() {
    return new _Vector2(1, 1);
  }
  /**
   * Returns a new Vector2 with random values between min and max
   * @param min the minimum random value
   * @param max the maximum random value
   * @returns a Vector2 with random values between min and max
   */
  static Random(min = 0, max = 1) {
    return new _Vector2(RandomRange(min, max), RandomRange(min, max));
  }
  /**
   * Sets a Vector2 with random values between min and max
   * @param min the minimum random value
   * @param max the maximum random value
   * @param ref the ref to store the values in
   * @returns the ref with random values between min and max
   */
  static RandomToRef(min = 0, max = 1, ref) {
    return ref.copyFromFloats(RandomRange(min, max), RandomRange(min, max));
  }
  /**
   * Gets a zero Vector2 that must not be updated
   */
  static get ZeroReadOnly() {
    return _Vector2._ZeroReadOnly;
  }
  /**
   * Gets a new Vector2 set from the given index element of the given array
   * Example Playground https://playground.babylonjs.com/#QYBWV4#79
   * @param array defines the data source
   * @param offset defines the offset in the data source
   * @returns a new Vector2
   */
  static FromArray(array, offset = 0) {
    return new _Vector2(array[offset], array[offset + 1]);
  }
  /**
   * Sets "result" from the given index element of the given array
   * Example Playground https://playground.babylonjs.com/#QYBWV4#80
   * @param array defines the data source
   * @param offset defines the offset in the data source
   * @param result defines the target vector
   * @returns result input
   */
  static FromArrayToRef(array, offset, result) {
    result.x = array[offset];
    result.y = array[offset + 1];
    return result;
  }
  /**
   * Sets the given vector "result" with the given floats.
   * @param x defines the x coordinate of the source
   * @param y defines the y coordinate of the source
   * @param result defines the Vector2 where to store the result
   * @returns the result vector
   */
  static FromFloatsToRef(x, y, result) {
    result.copyFromFloats(x, y);
    return result;
  }
  /**
   * Gets a new Vector2 located for "amount" (float) on the CatmullRom spline defined by the given four Vector2
   * Example Playground https://playground.babylonjs.com/#QYBWV4#65
   * @param value1 defines 1st point of control
   * @param value2 defines 2nd point of control
   * @param value3 defines 3rd point of control
   * @param value4 defines 4th point of control
   * @param amount defines the interpolation factor
   * @returns a new Vector2
   */
  static CatmullRom(value1, value2, value3, value4, amount) {
    const squared = amount * amount;
    const cubed = amount * squared;
    const x = 0.5 * (2 * value2.x + (-value1.x + value3.x) * amount + (2 * value1.x - 5 * value2.x + 4 * value3.x - value4.x) * squared + (-value1.x + 3 * value2.x - 3 * value3.x + value4.x) * cubed);
    const y = 0.5 * (2 * value2.y + (-value1.y + value3.y) * amount + (2 * value1.y - 5 * value2.y + 4 * value3.y - value4.y) * squared + (-value1.y + 3 * value2.y - 3 * value3.y + value4.y) * cubed);
    return new _Vector2(x, y);
  }
  /**
   * Sets reference with same the coordinates than "value" ones if the vector "value" is in the square defined by "min" and "max".
   * If a coordinate of "value" is lower than "min" coordinates, the returned Vector2 is given this "min" coordinate.
   * If a coordinate of "value" is greater than "max" coordinates, the returned Vector2 is given this "max" coordinate
   * @param value defines the value to clamp
   * @param min defines the lower limit
   * @param max defines the upper limit
   * @param ref the reference
   * @returns the reference
   */
  static ClampToRef(value, min, max, ref) {
    ref.x = Clamp(value.x, min.x, max.x);
    ref.y = Clamp(value.y, min.y, max.y);
    return ref;
  }
  /**
   * Returns a new Vector2 set with same the coordinates than "value" ones if the vector "value" is in the square defined by "min" and "max".
   * If a coordinate of "value" is lower than "min" coordinates, the returned Vector2 is given this "min" coordinate.
   * If a coordinate of "value" is greater than "max" coordinates, the returned Vector2 is given this "max" coordinate
   * Example Playground https://playground.babylonjs.com/#QYBWV4#76
   * @param value defines the value to clamp
   * @param min defines the lower limit
   * @param max defines the upper limit
   * @returns a new Vector2
   */
  static Clamp(value, min, max) {
    const x = Clamp(value.x, min.x, max.x);
    const y = Clamp(value.y, min.y, max.y);
    return new _Vector2(x, y);
  }
  /**
   * Returns a new Vector2 located for "amount" (float) on the Hermite spline defined by the vectors "value1", "value2", "tangent1", "tangent2"
   * Example Playground https://playground.babylonjs.com/#QYBWV4#81
   * @param value1 defines the 1st control point
   * @param tangent1 defines the outgoing tangent
   * @param value2 defines the 2nd control point
   * @param tangent2 defines the incoming tangent
   * @param amount defines the interpolation factor
   * @returns a new Vector2
   */
  static Hermite(value1, tangent1, value2, tangent2, amount) {
    const squared = amount * amount;
    const cubed = amount * squared;
    const part1 = 2 * cubed - 3 * squared + 1;
    const part2 = -2 * cubed + 3 * squared;
    const part3 = cubed - 2 * squared + amount;
    const part4 = cubed - squared;
    const x = value1.x * part1 + value2.x * part2 + tangent1.x * part3 + tangent2.x * part4;
    const y = value1.y * part1 + value2.y * part2 + tangent1.y * part3 + tangent2.y * part4;
    return new _Vector2(x, y);
  }
  /**
   * Returns a new Vector2 which is the 1st derivative of the Hermite spline defined by the vectors "value1", "value2", "tangent1", "tangent2".
   * Example Playground https://playground.babylonjs.com/#QYBWV4#82
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param time define where the derivative must be done
   * @returns 1st derivative
   */
  static Hermite1stDerivative(value1, tangent1, value2, tangent2, time) {
    return this.Hermite1stDerivativeToRef(value1, tangent1, value2, tangent2, time, new _Vector2());
  }
  /**
   * Returns a new Vector2 which is the 1st derivative of the Hermite spline defined by the vectors "value1", "value2", "tangent1", "tangent2".
   * Example Playground https://playground.babylonjs.com/#QYBWV4#83
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param time define where the derivative must be done
   * @param result define where the derivative will be stored
   * @returns result input
   */
  static Hermite1stDerivativeToRef(value1, tangent1, value2, tangent2, time, result) {
    const t2 = time * time;
    result.x = (t2 - time) * 6 * value1.x + (3 * t2 - 4 * time + 1) * tangent1.x + (-t2 + time) * 6 * value2.x + (3 * t2 - 2 * time) * tangent2.x;
    result.y = (t2 - time) * 6 * value1.y + (3 * t2 - 4 * time + 1) * tangent1.y + (-t2 + time) * 6 * value2.y + (3 * t2 - 2 * time) * tangent2.y;
    return result;
  }
  /**
   * Returns a new Vector2 located for "amount" (float) on the linear interpolation between the vector "start" adn the vector "end".
   * Example Playground https://playground.babylonjs.com/#QYBWV4#84
   * @param start defines the start vector
   * @param end defines the end vector
   * @param amount defines the interpolation factor
   * @returns a new Vector2
   */
  static Lerp(start, end, amount) {
    return _Vector2.LerpToRef(start, end, amount, new _Vector2());
  }
  /**
   * Sets the given vector "result" with the result of the linear interpolation from the vector "start" for "amount" to the vector "end"
   * @param start defines the start value
   * @param end defines the end value
   * @param amount max defines amount between both (between 0 and 1)
   * @param result defines the Vector2 where to store the result
   * @returns result input
   */
  static LerpToRef(start, end, amount, result) {
    result.x = start.x + (end.x - start.x) * amount;
    result.y = start.y + (end.y - start.y) * amount;
    return result;
  }
  /**
   * Gets the dot product of the vector "left" and the vector "right"
   * Example Playground https://playground.babylonjs.com/#QYBWV4#90
   * @param left defines first vector
   * @param right defines second vector
   * @returns the dot product (float)
   */
  static Dot(left, right) {
    return left.x * right.x + left.y * right.y;
  }
  /**
   * Returns a new Vector2 equal to the normalized given vector
   * Example Playground https://playground.babylonjs.com/#QYBWV4#46
   * @param vector defines the vector to normalize
   * @returns a new Vector2
   */
  static Normalize(vector) {
    return _Vector2.NormalizeToRef(vector, new _Vector2());
  }
  /**
   * Normalize a given vector into a second one
   * Example Playground https://playground.babylonjs.com/#QYBWV4#50
   * @param vector defines the vector to normalize
   * @param result defines the vector where to store the result
   * @returns result input
   */
  static NormalizeToRef(vector, result) {
    vector.normalizeToRef(result);
    return result;
  }
  /**
   * Gets a new Vector2 set with the minimal coordinate values from the "left" and "right" vectors
   * Example Playground https://playground.babylonjs.com/#QYBWV4#86
   * @param left defines 1st vector
   * @param right defines 2nd vector
   * @returns a new Vector2
   */
  static Minimize(left, right) {
    const x = left.x < right.x ? left.x : right.x;
    const y = left.y < right.y ? left.y : right.y;
    return new _Vector2(x, y);
  }
  /**
   * Gets a new Vector2 set with the maximal coordinate values from the "left" and "right" vectors
   * Example Playground https://playground.babylonjs.com/#QYBWV4#86
   * @param left defines 1st vector
   * @param right defines 2nd vector
   * @returns a new Vector2
   */
  static Maximize(left, right) {
    const x = left.x > right.x ? left.x : right.x;
    const y = left.y > right.y ? left.y : right.y;
    return new _Vector2(x, y);
  }
  /**
   * Gets a new Vector2 set with the transformed coordinates of the given vector by the given transformation matrix
   * Example Playground https://playground.babylonjs.com/#QYBWV4#17
   * @param vector defines the vector to transform
   * @param transformation defines the matrix to apply
   * @returns a new Vector2
   */
  static Transform(vector, transformation) {
    return _Vector2.TransformToRef(vector, transformation, new _Vector2());
  }
  /**
   * Transforms the given vector coordinates by the given transformation matrix and stores the result in the vector "result" coordinates
   * Example Playground https://playground.babylonjs.com/#QYBWV4#19
   * @param vector defines the vector to transform
   * @param transformation defines the matrix to apply
   * @param result defines the target vector
   * @returns result input
   */
  static TransformToRef(vector, transformation, result) {
    const m = transformation.m;
    const x = vector.x * m[0] + vector.y * m[4] + m[12];
    const y = vector.x * m[1] + vector.y * m[5] + m[13];
    result.x = x;
    result.y = y;
    return result;
  }
  /**
   * Determines if a given vector is included in a triangle
   * Example Playground https://playground.babylonjs.com/#QYBWV4#87
   * @param p defines the vector to test
   * @param p0 defines 1st triangle point
   * @param p1 defines 2nd triangle point
   * @param p2 defines 3rd triangle point
   * @returns true if the point "p" is in the triangle defined by the vectors "p0", "p1", "p2"
   */
  static PointInTriangle(p, p0, p1, p2) {
    const a = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    const sign = a < 0 ? -1 : 1;
    const s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
    const t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;
    return s > 0 && t > 0 && s + t < 2 * a * sign;
  }
  /**
   * Gets the distance between the vectors "value1" and "value2"
   * Example Playground https://playground.babylonjs.com/#QYBWV4#71
   * @param value1 defines first vector
   * @param value2 defines second vector
   * @returns the distance between vectors
   */
  static Distance(value1, value2) {
    return Math.sqrt(_Vector2.DistanceSquared(value1, value2));
  }
  /**
   * Returns the squared distance between the vectors "value1" and "value2"
   * Example Playground https://playground.babylonjs.com/#QYBWV4#72
   * @param value1 defines first vector
   * @param value2 defines second vector
   * @returns the squared distance between vectors
   */
  static DistanceSquared(value1, value2) {
    const x = value1.x - value2.x;
    const y = value1.y - value2.y;
    return x * x + y * y;
  }
  /**
   * Gets a new Vector2 located at the center of the vectors "value1" and "value2"
   * Example Playground https://playground.babylonjs.com/#QYBWV4#86
   * Example Playground https://playground.babylonjs.com/#QYBWV4#66
   * @param value1 defines first vector
   * @param value2 defines second vector
   * @returns a new Vector2
   */
  static Center(value1, value2) {
    return _Vector2.CenterToRef(value1, value2, new _Vector2());
  }
  /**
   * Gets the center of the vectors "value1" and "value2" and stores the result in the vector "ref"
   * Example Playground https://playground.babylonjs.com/#QYBWV4#66
   * @param value1 defines first vector
   * @param value2 defines second vector
   * @param ref defines third vector
   * @returns ref
   */
  static CenterToRef(value1, value2, ref) {
    return ref.copyFromFloats((value1.x + value2.x) / 2, (value1.y + value2.y) / 2);
  }
  /**
   * Gets the shortest distance (float) between the point "p" and the segment defined by the two points "segA" and "segB".
   * Example Playground https://playground.babylonjs.com/#QYBWV4#77
   * @param p defines the middle point
   * @param segA defines one point of the segment
   * @param segB defines the other point of the segment
   * @returns the shortest distance
   */
  static DistanceOfPointFromSegment(p, segA, segB) {
    const l2 = _Vector2.DistanceSquared(segA, segB);
    if (l2 === 0) {
      return _Vector2.Distance(p, segA);
    }
    const v = segB.subtract(segA);
    const t = Math.max(0, Math.min(1, _Vector2.Dot(p.subtract(segA), v) / l2));
    const proj = segA.add(v.multiplyByFloats(t, t));
    return _Vector2.Distance(p, proj);
  }
};
Vector2._ZeroReadOnly = Vector2.Zero();
Object.defineProperties(Vector2.prototype, {
  dimension: {
    value: [2]
  },
  rank: {
    value: 1
  }
});
var Vector3 = class _Vector3 {
  /** Gets or sets the x coordinate */
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
    this._isDirty = true;
  }
  /** Gets or sets the y coordinate */
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
    this._isDirty = true;
  }
  /** Gets or sets the z coordinate */
  get z() {
    return this._z;
  }
  set z(value) {
    this._z = value;
    this._isDirty = true;
  }
  /**
   * Creates a new Vector3 object from the given x, y, z (floats) coordinates.
   * @param x defines the first coordinates (on X axis)
   * @param y defines the second coordinates (on Y axis)
   * @param z defines the third coordinates (on Z axis)
   */
  constructor(x = 0, y = 0, z = 0) {
    this._isDirty = true;
    this._x = x;
    this._y = y;
    this._z = z;
  }
  /**
   * Creates a string representation of the Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#67
   * @returns a string with the Vector3 coordinates.
   */
  toString() {
    return `{X: ${this._x} Y: ${this._y} Z: ${this._z}}`;
  }
  /**
   * Gets the class name
   * @returns the string "Vector3"
   */
  getClassName() {
    return "Vector3";
  }
  /**
   * Creates the Vector3 hash code
   * @returns a number which tends to be unique between Vector3 instances
   */
  getHashCode() {
    const x = _ExtractAsInt(this._x);
    const y = _ExtractAsInt(this._y);
    const z = _ExtractAsInt(this._z);
    let hash = x;
    hash = hash * 397 ^ y;
    hash = hash * 397 ^ z;
    return hash;
  }
  // Operators
  /**
   * Creates an array containing three elements : the coordinates of the Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#10
   * @returns a new array of numbers
   */
  asArray() {
    return [this._x, this._y, this._z];
  }
  /**
   * Populates the given array or Float32Array from the given index with the successive coordinates of the Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#65
   * @param array defines the destination array
   * @param index defines the offset in the destination array
   * @returns the current Vector3
   */
  toArray(array, index = 0) {
    array[index] = this._x;
    array[index + 1] = this._y;
    array[index + 2] = this._z;
    return this;
  }
  /**
   * Update the current vector from an array
   * Example Playground https://playground.babylonjs.com/#R1F8YU#24
   * @param array defines the destination array
   * @param offset defines the offset in the destination array
   * @returns the current Vector3
   */
  fromArray(array, offset = 0) {
    _Vector3.FromArrayToRef(array, offset, this);
    return this;
  }
  /**
   * Converts the current Vector3 into a quaternion (considering that the Vector3 contains Euler angles representation of a rotation)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#66
   * @returns a new Quaternion object, computed from the Vector3 coordinates
   */
  toQuaternion() {
    return Quaternion.RotationYawPitchRoll(this._y, this._x, this._z);
  }
  /**
   * Adds the given vector to the current Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#4
   * @param otherVector defines the second operand
   * @returns the current updated Vector3
   */
  addInPlace(otherVector) {
    this._x += otherVector._x;
    this._y += otherVector._y;
    this._z += otherVector._z;
    this._isDirty = true;
    return this;
  }
  /**
   * Adds the given coordinates to the current Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#5
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @returns the current updated Vector3
   */
  addInPlaceFromFloats(x, y, z) {
    this._x += x;
    this._y += y;
    this._z += z;
    this._isDirty = true;
    return this;
  }
  /**
   * Gets a new Vector3, result of the addition the current Vector3 and the given vector
   * Example Playground https://playground.babylonjs.com/#R1F8YU#3
   * @param otherVector defines the second operand
   * @returns the resulting Vector3
   */
  add(otherVector) {
    return new _Vector3(this._x + otherVector._x, this._y + otherVector._y, this._z + otherVector._z);
  }
  /**
   * Adds the current Vector3 to the given one and stores the result in the vector "result"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#6
   * @param otherVector defines the second operand
   * @param result defines the Vector3 object where to store the result
   * @returns the result
   */
  addToRef(otherVector, result) {
    result._x = this._x + otherVector._x;
    result._y = this._y + otherVector._y;
    result._z = this._z + otherVector._z;
    result._isDirty = true;
    return result;
  }
  /**
   * Subtract the given vector from the current Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#61
   * @param otherVector defines the second operand
   * @returns the current updated Vector3
   */
  subtractInPlace(otherVector) {
    this._x -= otherVector._x;
    this._y -= otherVector._y;
    this._z -= otherVector._z;
    this._isDirty = true;
    return this;
  }
  /**
   * Returns a new Vector3, result of the subtraction of the given vector from the current Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#60
   * @param otherVector defines the second operand
   * @returns the resulting Vector3
   */
  subtract(otherVector) {
    return new _Vector3(this._x - otherVector._x, this._y - otherVector._y, this._z - otherVector._z);
  }
  /**
   * Subtracts the given vector from the current Vector3 and stores the result in the vector "result".
   * Example Playground https://playground.babylonjs.com/#R1F8YU#63
   * @param otherVector defines the second operand
   * @param result defines the Vector3 object where to store the result
   * @returns the result
   */
  subtractToRef(otherVector, result) {
    return this.subtractFromFloatsToRef(otherVector._x, otherVector._y, otherVector._z, result);
  }
  /**
   * Returns a new Vector3 set with the subtraction of the given floats from the current Vector3 coordinates
   * Example Playground https://playground.babylonjs.com/#R1F8YU#62
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @returns the resulting Vector3
   */
  subtractFromFloats(x, y, z) {
    return new _Vector3(this._x - x, this._y - y, this._z - z);
  }
  /**
   * Subtracts the given floats from the current Vector3 coordinates and set the given vector "result" with this result
   * Example Playground https://playground.babylonjs.com/#R1F8YU#64
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @param result defines the Vector3 object where to store the result
   * @returns the result
   */
  subtractFromFloatsToRef(x, y, z, result) {
    result._x = this._x - x;
    result._y = this._y - y;
    result._z = this._z - z;
    result._isDirty = true;
    return result;
  }
  /**
   * Gets a new Vector3 set with the current Vector3 negated coordinates
   * Example Playground https://playground.babylonjs.com/#R1F8YU#35
   * @returns a new Vector3
   */
  negate() {
    return new _Vector3(-this._x, -this._y, -this._z);
  }
  /**
   * Negate this vector in place
   * Example Playground https://playground.babylonjs.com/#R1F8YU#36
   * @returns this
   */
  negateInPlace() {
    this._x *= -1;
    this._y *= -1;
    this._z *= -1;
    this._isDirty = true;
    return this;
  }
  /**
   * Negate the current Vector3 and stores the result in the given vector "result" coordinates
   * Example Playground https://playground.babylonjs.com/#R1F8YU#37
   * @param result defines the Vector3 object where to store the result
   * @returns the result
   */
  negateToRef(result) {
    result._x = this._x * -1;
    result._y = this._y * -1;
    result._z = this._z * -1;
    result._isDirty = true;
    return result;
  }
  /**
   * Multiplies the Vector3 coordinates by the float "scale"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#56
   * @param scale defines the multiplier factor
   * @returns the current updated Vector3
   */
  scaleInPlace(scale) {
    this._x *= scale;
    this._y *= scale;
    this._z *= scale;
    this._isDirty = true;
    return this;
  }
  /**
   * Returns a new Vector3 set with the current Vector3 coordinates multiplied by the float "scale"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#53
   * @param scale defines the multiplier factor
   * @returns a new Vector3
   */
  scale(scale) {
    return new _Vector3(this._x * scale, this._y * scale, this._z * scale);
  }
  /**
   * Multiplies the current Vector3 coordinates by the float "scale" and stores the result in the given vector "result" coordinates
   * Example Playground https://playground.babylonjs.com/#R1F8YU#57
   * @param scale defines the multiplier factor
   * @param result defines the Vector3 object where to store the result
   * @returns the result
   */
  scaleToRef(scale, result) {
    result._x = this._x * scale;
    result._y = this._y * scale;
    result._z = this._z * scale;
    result._isDirty = true;
    return result;
  }
  /**
   * Creates a vector normal (perpendicular) to the current Vector3 and stores the result in the given vector
   * Out of the infinite possibilities the normal chosen is the one formed by rotating the current vector
   * 90 degrees about an axis which lies perpendicular to the current vector
   * and its projection on the xz plane. In the case of a current vector in the xz plane
   * the normal is calculated to be along the y axis.
   * Example Playground https://playground.babylonjs.com/#R1F8YU#230
   * Example Playground https://playground.babylonjs.com/#R1F8YU#231
   * @param result defines the Vector3 object where to store the resultant normal
   * @returns the result
   */
  getNormalToRef(result) {
    const radius = this.length();
    let theta = Math.acos(this.y / radius);
    const phi = Math.atan2(this.z, this.x);
    if (theta > Math.PI / 2) {
      theta -= Math.PI / 2;
    } else {
      theta += Math.PI / 2;
    }
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.cos(theta);
    const z = radius * Math.sin(theta) * Math.sin(phi);
    result.set(x, y, z);
    return result;
  }
  /**
   * Rotates the vector using the given unit quaternion and stores the new vector in result
   * Example Playground https://playground.babylonjs.com/#R1F8YU#9
   * @param q the unit quaternion representing the rotation
   * @param result the output vector
   * @returns the result
   */
  applyRotationQuaternionToRef(q, result) {
    const vx = this._x, vy = this._y, vz = this._z;
    const qx = q._x, qy = q._y, qz = q._z, qw = q._w;
    const tx = 2 * (qy * vz - qz * vy);
    const ty = 2 * (qz * vx - qx * vz);
    const tz = 2 * (qx * vy - qy * vx);
    result._x = vx + qw * tx + qy * tz - qz * ty;
    result._y = vy + qw * ty + qz * tx - qx * tz;
    result._z = vz + qw * tz + qx * ty - qy * tx;
    result._isDirty = true;
    return result;
  }
  /**
   * Rotates the vector in place using the given unit quaternion
   * Example Playground https://playground.babylonjs.com/#R1F8YU#8
   * @param q the unit quaternion representing the rotation
   * @returns the current updated Vector3
   */
  applyRotationQuaternionInPlace(q) {
    return this.applyRotationQuaternionToRef(q, this);
  }
  /**
   * Rotates the vector using the given unit quaternion and returns the new vector
   * Example Playground https://playground.babylonjs.com/#R1F8YU#7
   * @param q the unit quaternion representing the rotation
   * @returns a new Vector3
   */
  applyRotationQuaternion(q) {
    return this.applyRotationQuaternionToRef(q, new _Vector3());
  }
  /**
   * Scale the current Vector3 values by a factor and add the result to a given Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#55
   * @param scale defines the scale factor
   * @param result defines the Vector3 object where to store the result
   * @returns result input
   */
  scaleAndAddToRef(scale, result) {
    result._x += this._x * scale;
    result._y += this._y * scale;
    result._z += this._z * scale;
    result._isDirty = true;
    return result;
  }
  /**
   * Projects the current point Vector3 to a plane along a ray starting from a specified origin and passing through the current point Vector3.
   * Example Playground https://playground.babylonjs.com/#R1F8YU#48
   * @param plane defines the plane to project to
   * @param origin defines the origin of the projection ray
   * @returns the projected vector3
   */
  projectOnPlane(plane, origin) {
    return this.projectOnPlaneToRef(plane, origin, new _Vector3());
  }
  /**
   * Projects the current point Vector3 to a plane along a ray starting from a specified origin and passing through the current point Vector3.
   * Example Playground https://playground.babylonjs.com/#R1F8YU#49
   * @param plane defines the plane to project to
   * @param origin defines the origin of the projection ray
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  projectOnPlaneToRef(plane, origin, result) {
    const n = plane.normal;
    const d = plane.d;
    const V = MathTmp.Vector3[0];
    this.subtractToRef(origin, V);
    V.normalize();
    const denom = _Vector3.Dot(V, n);
    if (Math.abs(denom) < 1e-10) {
      result.setAll(Infinity);
    } else {
      const t = -(_Vector3.Dot(origin, n) + d) / denom;
      const scaledV = V.scaleInPlace(t);
      origin.addToRef(scaledV, result);
    }
    return result;
  }
  /**
   * Returns true if the current Vector3 and the given vector coordinates are strictly equal
   * Example Playground https://playground.babylonjs.com/#R1F8YU#19
   * @param otherVector defines the second operand
   * @returns true if both vectors are equals
   */
  equals(otherVector) {
    return otherVector && this._x === otherVector._x && this._y === otherVector._y && this._z === otherVector._z;
  }
  /**
   * Returns true if the current Vector3 and the given vector coordinates are distant less than epsilon
   * Example Playground https://playground.babylonjs.com/#R1F8YU#21
   * @param otherVector defines the second operand
   * @param epsilon defines the minimal distance to define values as equals
   * @returns true if both vectors are distant less than epsilon
   */
  equalsWithEpsilon(otherVector, epsilon = Epsilon) {
    return otherVector && WithinEpsilon(this._x, otherVector._x, epsilon) && WithinEpsilon(this._y, otherVector._y, epsilon) && WithinEpsilon(this._z, otherVector._z, epsilon);
  }
  /**
   * Returns true if the current Vector3 coordinates equals the given floats
   * Example Playground https://playground.babylonjs.com/#R1F8YU#20
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @returns true if both vectors are equal
   */
  equalsToFloats(x, y, z) {
    return this._x === x && this._y === y && this._z === z;
  }
  /**
   * Multiplies the current Vector3 coordinates by the given ones
   * Example Playground https://playground.babylonjs.com/#R1F8YU#32
   * @param otherVector defines the second operand
   * @returns the current updated Vector3
   */
  multiplyInPlace(otherVector) {
    this._x *= otherVector._x;
    this._y *= otherVector._y;
    this._z *= otherVector._z;
    this._isDirty = true;
    return this;
  }
  /**
   * Returns a new Vector3, result of the multiplication of the current Vector3 by the given vector
   * Example Playground https://playground.babylonjs.com/#R1F8YU#31
   * @param otherVector defines the second operand
   * @returns the new Vector3
   */
  multiply(otherVector) {
    return this.multiplyByFloats(otherVector._x, otherVector._y, otherVector._z);
  }
  /**
   * Multiplies the current Vector3 by the given one and stores the result in the given vector "result"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#33
   * @param otherVector defines the second operand
   * @param result defines the Vector3 object where to store the result
   * @returns the result
   */
  multiplyToRef(otherVector, result) {
    result._x = this._x * otherVector._x;
    result._y = this._y * otherVector._y;
    result._z = this._z * otherVector._z;
    result._isDirty = true;
    return result;
  }
  /**
   * Returns a new Vector3 set with the result of the multiplication of the current Vector3 coordinates by the given floats
   * Example Playground https://playground.babylonjs.com/#R1F8YU#34
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @returns the new Vector3
   */
  multiplyByFloats(x, y, z) {
    return new _Vector3(this._x * x, this._y * y, this._z * z);
  }
  /**
   * Returns a new Vector3 set with the result of the division of the current Vector3 coordinates by the given ones
   * Example Playground https://playground.babylonjs.com/#R1F8YU#16
   * @param otherVector defines the second operand
   * @returns the new Vector3
   */
  divide(otherVector) {
    return new _Vector3(this._x / otherVector._x, this._y / otherVector._y, this._z / otherVector._z);
  }
  /**
   * Divides the current Vector3 coordinates by the given ones and stores the result in the given vector "result"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#18
   * @param otherVector defines the second operand
   * @param result defines the Vector3 object where to store the result
   * @returns the result
   */
  divideToRef(otherVector, result) {
    result._x = this._x / otherVector._x;
    result._y = this._y / otherVector._y;
    result._z = this._z / otherVector._z;
    result._isDirty = true;
    return result;
  }
  /**
   * Divides the current Vector3 coordinates by the given ones.
   * Example Playground https://playground.babylonjs.com/#R1F8YU#17
   * @param otherVector defines the second operand
   * @returns the current updated Vector3
   */
  divideInPlace(otherVector) {
    this._x = this._x / otherVector._x;
    this._y = this._y / otherVector._y;
    this._z = this._z / otherVector._z;
    this._isDirty = true;
    return this;
  }
  /**
   * Updates the current Vector3 with the minimal coordinate values between its and the given vector ones
   * Example Playground https://playground.babylonjs.com/#R1F8YU#29
   * @param other defines the second operand
   * @returns the current updated Vector3
   */
  minimizeInPlace(other) {
    return this.minimizeInPlaceFromFloats(other._x, other._y, other._z);
  }
  /**
   * Updates the current Vector3 with the maximal coordinate values between its and the given vector ones.
   * Example Playground https://playground.babylonjs.com/#R1F8YU#27
   * @param other defines the second operand
   * @returns the current updated Vector3
   */
  maximizeInPlace(other) {
    return this.maximizeInPlaceFromFloats(other._x, other._y, other._z);
  }
  /**
   * Updates the current Vector3 with the minimal coordinate values between its and the given coordinates
   * Example Playground https://playground.babylonjs.com/#R1F8YU#30
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @returns the current updated Vector3
   */
  minimizeInPlaceFromFloats(x, y, z) {
    if (x < this._x) {
      this.x = x;
    }
    if (y < this._y) {
      this.y = y;
    }
    if (z < this._z) {
      this.z = z;
    }
    return this;
  }
  /**
   * Updates the current Vector3 with the maximal coordinate values between its and the given coordinates.
   * Example Playground https://playground.babylonjs.com/#R1F8YU#28
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @returns the current updated Vector3
   */
  maximizeInPlaceFromFloats(x, y, z) {
    if (x > this._x) {
      this.x = x;
    }
    if (y > this._y) {
      this.y = y;
    }
    if (z > this._z) {
      this.z = z;
    }
    return this;
  }
  /**
   * Due to float precision, scale of a mesh could be uniform but float values are off by a small fraction
   * Check if is non uniform within a certain amount of decimal places to account for this
   * @param epsilon the amount the values can differ
   * @returns if the vector is non uniform to a certain number of decimal places
   */
  isNonUniformWithinEpsilon(epsilon) {
    const absX = Math.abs(this._x);
    const absY = Math.abs(this._y);
    if (!WithinEpsilon(absX, absY, epsilon)) {
      return true;
    }
    const absZ = Math.abs(this._z);
    if (!WithinEpsilon(absX, absZ, epsilon)) {
      return true;
    }
    if (!WithinEpsilon(absY, absZ, epsilon)) {
      return true;
    }
    return false;
  }
  /**
   * Gets a boolean indicating that the vector is non uniform meaning x, y or z are not all the same
   */
  get isNonUniform() {
    const absX = Math.abs(this._x);
    const absY = Math.abs(this._y);
    if (absX !== absY) {
      return true;
    }
    const absZ = Math.abs(this._z);
    if (absX !== absZ) {
      return true;
    }
    return false;
  }
  /**
   * Gets the current Vector3's floored values and stores them in result
   * @param result the vector to store the result in
   * @returns the result vector
   */
  floorToRef(result) {
    result._x = Math.floor(this._x);
    result._y = Math.floor(this._y);
    result._z = Math.floor(this._z);
    result._isDirty = true;
    return result;
  }
  /**
   * Gets a new Vector3 from current Vector3 floored values
   * Example Playground https://playground.babylonjs.com/#R1F8YU#22
   * @returns a new Vector3
   */
  floor() {
    return new _Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
  }
  /**
   * Gets the current Vector3's fractional values and stores them in result
   * @param result the vector to store the result in
   * @returns the result vector
   */
  fractToRef(result) {
    result._x = this.x - Math.floor(this._x);
    result._y = this.y - Math.floor(this._y);
    result._z = this.z - Math.floor(this._z);
    result._isDirty = true;
    return result;
  }
  /**
   * Gets a new Vector3 from current Vector3 fractional values
   * Example Playground https://playground.babylonjs.com/#R1F8YU#23
   * @returns a new Vector3
   */
  fract() {
    return new _Vector3(this.x - Math.floor(this._x), this.y - Math.floor(this._y), this.z - Math.floor(this._z));
  }
  // Properties
  /**
   * Gets the length of the Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#25
   * @returns the length of the Vector3
   */
  length() {
    return Math.sqrt(this.lengthSquared());
  }
  /**
   * Gets the squared length of the Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#26
   * @returns squared length of the Vector3
   */
  lengthSquared() {
    return this._x * this._x + this._y * this._y + this._z * this._z;
  }
  /**
   * Gets a boolean indicating if the vector contains a zero in one of its components
   * Example Playground https://playground.babylonjs.com/#R1F8YU#1
   */
  get hasAZeroComponent() {
    return this._x * this._y * this._z === 0;
  }
  /**
   * Normalize the current Vector3.
   * Please note that this is an in place operation.
   * Example Playground https://playground.babylonjs.com/#R1F8YU#122
   * @returns the current updated Vector3
   */
  normalize() {
    return this.normalizeFromLength(this.length());
  }
  /**
   * Reorders the x y z properties of the vector in place
   * Example Playground https://playground.babylonjs.com/#R1F8YU#44
   * @param order new ordering of the properties (eg. for vector 1,2,3 with "ZYX" will produce 3,2,1)
   * @returns the current updated vector
   */
  reorderInPlace(order) {
    order = order.toLowerCase();
    if (order === "xyz") {
      return this;
    }
    const tem = MathTmp.Vector3[0].copyFrom(this);
    this.x = tem[order[0]];
    this.y = tem[order[1]];
    this.z = tem[order[2]];
    return this;
  }
  /**
   * Rotates the vector around 0,0,0 by a quaternion
   * Example Playground https://playground.babylonjs.com/#R1F8YU#47
   * @param quaternion the rotation quaternion
   * @param result vector to store the result
   * @returns the resulting vector
   */
  rotateByQuaternionToRef(quaternion, result) {
    quaternion.toRotationMatrix(MathTmp.Matrix[0]);
    _Vector3.TransformCoordinatesToRef(this, MathTmp.Matrix[0], result);
    return result;
  }
  /**
   * Rotates a vector around a given point
   * Example Playground https://playground.babylonjs.com/#R1F8YU#46
   * @param quaternion the rotation quaternion
   * @param point the point to rotate around
   * @param result vector to store the result
   * @returns the resulting vector
   */
  rotateByQuaternionAroundPointToRef(quaternion, point, result) {
    this.subtractToRef(point, MathTmp.Vector3[0]);
    MathTmp.Vector3[0].rotateByQuaternionToRef(quaternion, MathTmp.Vector3[0]);
    point.addToRef(MathTmp.Vector3[0], result);
    return result;
  }
  /**
   * Returns a new Vector3 as the cross product of the current vector and the "other" one
   * The cross product is then orthogonal to both current and "other"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#14
   * @param other defines the right operand
   * @returns the cross product
   */
  cross(other) {
    return _Vector3.CrossToRef(this, other, new _Vector3());
  }
  /**
   * Normalize the current Vector3 with the given input length.
   * Please note that this is an in place operation.
   * Example Playground https://playground.babylonjs.com/#R1F8YU#123
   * @param len the length of the vector
   * @returns the current updated Vector3
   */
  normalizeFromLength(len) {
    if (len === 0 || len === 1) {
      return this;
    }
    return this.scaleInPlace(1 / len);
  }
  /**
   * Normalize the current Vector3 to a new vector
   * Example Playground https://playground.babylonjs.com/#R1F8YU#124
   * @returns the new Vector3
   */
  normalizeToNew() {
    return this.normalizeToRef(new _Vector3());
  }
  /**
   * Normalize the current Vector3 to the reference
   * Example Playground https://playground.babylonjs.com/#R1F8YU#125
   * @param result define the Vector3 to update
   * @returns the updated Vector3
   */
  normalizeToRef(result) {
    const len = this.length();
    if (len === 0 || len === 1) {
      result._x = this._x;
      result._y = this._y;
      result._z = this._z;
      result._isDirty = true;
      return result;
    }
    return this.scaleToRef(1 / len, result);
  }
  /**
   * Creates a new Vector3 copied from the current Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#11
   * @returns the new Vector3
   */
  clone() {
    return new _Vector3(this._x, this._y, this._z);
  }
  /**
   * Copies the given vector coordinates to the current Vector3 ones
   * Example Playground https://playground.babylonjs.com/#R1F8YU#12
   * @param source defines the source Vector3
   * @returns the current updated Vector3
   */
  copyFrom(source) {
    return this.copyFromFloats(source._x, source._y, source._z);
  }
  /**
   * Copies the given floats to the current Vector3 coordinates
   * Example Playground https://playground.babylonjs.com/#R1F8YU#13
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @returns the current updated Vector3
   */
  copyFromFloats(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._isDirty = true;
    return this;
  }
  /**
   * Copies the given floats to the current Vector3 coordinates
   * Example Playground https://playground.babylonjs.com/#R1F8YU#58
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @returns the current updated Vector3
   */
  set(x, y, z) {
    return this.copyFromFloats(x, y, z);
  }
  /**
   * Copies the given float to the current Vector3 coordinates
   * Example Playground https://playground.babylonjs.com/#R1F8YU#59
   * @param v defines the x, y and z coordinates of the operand
   * @returns the current updated Vector3
   */
  setAll(v) {
    this._x = this._y = this._z = v;
    this._isDirty = true;
    return this;
  }
  // Statics
  /**
   * Get the clip factor between two vectors
   * Example Playground https://playground.babylonjs.com/#R1F8YU#126
   * @param vector0 defines the first operand
   * @param vector1 defines the second operand
   * @param axis defines the axis to use
   * @param size defines the size along the axis
   * @returns the clip factor
   */
  static GetClipFactor(vector0, vector1, axis, size) {
    const d0 = _Vector3.Dot(vector0, axis);
    const d1 = _Vector3.Dot(vector1, axis);
    return (d0 - size) / (d0 - d1);
  }
  /**
   * Get angle between two vectors
   * Example Playground https://playground.babylonjs.com/#R1F8YU#86
   * @param vector0 the starting point
   * @param vector1 the ending point
   * @param normal direction of the normal
   * @returns the angle between vector0 and vector1
   */
  static GetAngleBetweenVectors(vector0, vector1, normal) {
    const v0 = vector0.normalizeToRef(MathTmp.Vector3[1]);
    const v1 = vector1.normalizeToRef(MathTmp.Vector3[2]);
    let dot = _Vector3.Dot(v0, v1);
    dot = Clamp(dot, -1, 1);
    const angle = Math.acos(dot);
    const n = MathTmp.Vector3[3];
    _Vector3.CrossToRef(v0, v1, n);
    if (_Vector3.Dot(n, normal) > 0) {
      return isNaN(angle) ? 0 : angle;
    }
    return isNaN(angle) ? -Math.PI : -Math.acos(dot);
  }
  /**
   * Get angle between two vectors projected on a plane
   * Example Playground https://playground.babylonjs.com/#R1F8YU#87
   * Expectation compute time: 0.01 ms (median) and 0.02 ms (percentile 95%)
   * @param vector0 angle between vector0 and vector1
   * @param vector1 angle between vector0 and vector1
   * @param normal Normal of the projection plane
   * @returns the angle in radians (float) between vector0 and vector1 projected on the plane with the specified normal
   */
  static GetAngleBetweenVectorsOnPlane(vector0, vector1, normal) {
    MathTmp.Vector3[0].copyFrom(vector0);
    const v0 = MathTmp.Vector3[0];
    MathTmp.Vector3[1].copyFrom(vector1);
    const v1 = MathTmp.Vector3[1];
    MathTmp.Vector3[2].copyFrom(normal);
    const vNormal = MathTmp.Vector3[2];
    const right = MathTmp.Vector3[3];
    const forward = MathTmp.Vector3[4];
    v0.normalize();
    v1.normalize();
    vNormal.normalize();
    _Vector3.CrossToRef(vNormal, v0, right);
    _Vector3.CrossToRef(right, vNormal, forward);
    const angle = Math.atan2(_Vector3.Dot(v1, right), _Vector3.Dot(v1, forward));
    return NormalizeRadians(angle);
  }
  /**
   * Gets the rotation that aligns the roll axis (Y) to the line joining the start point to the target point and stores it in the ref Vector3
   * Example PG https://playground.babylonjs.com/#R1F8YU#189
   * @param start the starting point
   * @param target the target point
   * @param ref the vector3 to store the result
   * @returns ref in the form (pitch, yaw, 0)
   */
  static PitchYawRollToMoveBetweenPointsToRef(start, target, ref) {
    const diff = TmpVectors.Vector3[0];
    target.subtractToRef(start, diff);
    ref._y = Math.atan2(diff.x, diff.z) || 0;
    ref._x = Math.atan2(Math.sqrt(diff.x ** 2 + diff.z ** 2), diff.y) || 0;
    ref._z = 0;
    ref._isDirty = true;
    return ref;
  }
  /**
   * Gets the rotation that aligns the roll axis (Y) to the line joining the start point to the target point
   * Example PG https://playground.babylonjs.com/#R1F8YU#188
   * @param start the starting point
   * @param target the target point
   * @returns the rotation in the form (pitch, yaw, 0)
   */
  static PitchYawRollToMoveBetweenPoints(start, target) {
    const ref = _Vector3.Zero();
    return _Vector3.PitchYawRollToMoveBetweenPointsToRef(start, target, ref);
  }
  /**
   * Slerp between two vectors. See also `SmoothToRef`
   * Slerp is a spherical linear interpolation
   * giving a slow in and out effect
   * Example Playground 1 https://playground.babylonjs.com/#R1F8YU#108
   * Example Playground 2 https://playground.babylonjs.com/#R1F8YU#109
   * @param vector0 Start vector
   * @param vector1 End vector
   * @param slerp amount (will be clamped between 0 and 1)
   * @param result The slerped vector
   * @returns The slerped vector
   */
  static SlerpToRef(vector0, vector1, slerp, result) {
    slerp = Clamp(slerp, 0, 1);
    const vector0Dir = MathTmp.Vector3[0];
    const vector1Dir = MathTmp.Vector3[1];
    vector0Dir.copyFrom(vector0);
    const vector0Length = vector0Dir.length();
    vector0Dir.normalizeFromLength(vector0Length);
    vector1Dir.copyFrom(vector1);
    const vector1Length = vector1Dir.length();
    vector1Dir.normalizeFromLength(vector1Length);
    const dot = _Vector3.Dot(vector0Dir, vector1Dir);
    let scale0;
    let scale1;
    if (dot < 1 - Epsilon) {
      const omega = Math.acos(dot);
      const invSin = 1 / Math.sin(omega);
      scale0 = Math.sin((1 - slerp) * omega) * invSin;
      scale1 = Math.sin(slerp * omega) * invSin;
    } else {
      scale0 = 1 - slerp;
      scale1 = slerp;
    }
    vector0Dir.scaleInPlace(scale0);
    vector1Dir.scaleInPlace(scale1);
    result.copyFrom(vector0Dir).addInPlace(vector1Dir);
    result.scaleInPlace(Lerp(vector0Length, vector1Length, slerp));
    return result;
  }
  /**
   * Smooth interpolation between two vectors using Slerp
   * Example Playground https://playground.babylonjs.com/#R1F8YU#110
   * @param source source vector
   * @param goal goal vector
   * @param deltaTime current interpolation frame
   * @param lerpTime total interpolation time
   * @param result the smoothed vector
   * @returns the smoothed vector
   */
  static SmoothToRef(source, goal, deltaTime, lerpTime, result) {
    _Vector3.SlerpToRef(source, goal, lerpTime === 0 ? 1 : deltaTime / lerpTime, result);
    return result;
  }
  /**
   * Returns a new Vector3 set from the index "offset" of the given array
   * Example Playground https://playground.babylonjs.com/#R1F8YU#83
   * @param array defines the source array
   * @param offset defines the offset in the source array
   * @returns the new Vector3
   */
  static FromArray(array, offset = 0) {
    return new _Vector3(array[offset], array[offset + 1], array[offset + 2]);
  }
  /**
   * Returns a new Vector3 set from the index "offset" of the given Float32Array
   * @param array defines the source array
   * @param offset defines the offset in the source array
   * @returns the new Vector3
   * @deprecated Please use FromArray instead.
   */
  static FromFloatArray(array, offset) {
    return _Vector3.FromArray(array, offset);
  }
  /**
   * Sets the given vector "result" with the element values from the index "offset" of the given array
   * Example Playground https://playground.babylonjs.com/#R1F8YU#84
   * @param array defines the source array
   * @param offset defines the offset in the source array
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  static FromArrayToRef(array, offset, result) {
    result._x = array[offset];
    result._y = array[offset + 1];
    result._z = array[offset + 2];
    result._isDirty = true;
    return result;
  }
  /**
   * Sets the given vector "result" with the element values from the index "offset" of the given Float32Array
   * @param array defines the source array
   * @param offset defines the offset in the source array
   * @param result defines the Vector3 where to store the result
   * @deprecated Please use FromArrayToRef instead.
   * @returns result input
   */
  static FromFloatArrayToRef(array, offset, result) {
    return _Vector3.FromArrayToRef(array, offset, result);
  }
  /**
   * Sets the given vector "result" with the given floats.
   * Example Playground https://playground.babylonjs.com/#R1F8YU#85
   * @param x defines the x coordinate of the source
   * @param y defines the y coordinate of the source
   * @param z defines the z coordinate of the source
   * @param result defines the Vector3 where to store the result
   * @returns the result vector
   */
  static FromFloatsToRef(x, y, z, result) {
    result.copyFromFloats(x, y, z);
    return result;
  }
  /**
   * Returns a new Vector3 set to (0.0, 0.0, 0.0)
   * @returns a new empty Vector3
   */
  static Zero() {
    return new _Vector3(0, 0, 0);
  }
  /**
   * Returns a new Vector3 set to (1.0, 1.0, 1.0)
   * @returns a new Vector3
   */
  static One() {
    return new _Vector3(1, 1, 1);
  }
  /**
   * Returns a new Vector3 set to (0.0, 1.0, 0.0)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#71
   * @returns a new up Vector3
   */
  static Up() {
    return new _Vector3(0, 1, 0);
  }
  /**
   * Gets an up Vector3 that must not be updated
   */
  static get UpReadOnly() {
    return _Vector3._UpReadOnly;
  }
  /**
   * Gets a down Vector3 that must not be updated
   */
  static get DownReadOnly() {
    return _Vector3._DownReadOnly;
  }
  /**
   * Gets a right Vector3 that must not be updated
   */
  static get RightReadOnly() {
    return _Vector3._RightReadOnly;
  }
  /**
   * Gets a left Vector3 that must not be updated
   */
  static get LeftReadOnly() {
    return _Vector3._LeftReadOnly;
  }
  /**
   * Gets a forward Vector3 that must not be updated
   */
  static get LeftHandedForwardReadOnly() {
    return _Vector3._LeftHandedForwardReadOnly;
  }
  /**
   * Gets a forward Vector3 that must not be updated
   */
  static get RightHandedForwardReadOnly() {
    return _Vector3._RightHandedForwardReadOnly;
  }
  /**
   * Gets a backward Vector3 that must not be updated
   */
  static get LeftHandedBackwardReadOnly() {
    return _Vector3._LeftHandedBackwardReadOnly;
  }
  /**
   * Gets a backward Vector3 that must not be updated
   */
  static get RightHandedBackwardReadOnly() {
    return _Vector3._RightHandedBackwardReadOnly;
  }
  /**
   * Gets a zero Vector3 that must not be updated
   */
  static get ZeroReadOnly() {
    return _Vector3._ZeroReadOnly;
  }
  /**
   * Gets a one Vector3 that must not be updated
   */
  static get OneReadOnly() {
    return _Vector3._OneReadOnly;
  }
  /**
   * Returns a new Vector3 set to (0.0, -1.0, 0.0)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#71
   * @returns a new down Vector3
   */
  static Down() {
    return new _Vector3(0, -1, 0);
  }
  /**
   * Returns a new Vector3 set to (0.0, 0.0, 1.0)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#71
   * @param rightHandedSystem is the scene right-handed (negative z)
   * @returns a new forward Vector3
   */
  static Forward(rightHandedSystem = false) {
    return new _Vector3(0, 0, rightHandedSystem ? -1 : 1);
  }
  /**
   * Returns a new Vector3 set to (0.0, 0.0, -1.0)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#71
   * @param rightHandedSystem is the scene right-handed (negative-z)
   * @returns a new Backward Vector3
   */
  static Backward(rightHandedSystem = false) {
    return new _Vector3(0, 0, rightHandedSystem ? 1 : -1);
  }
  /**
   * Returns a new Vector3 set to (1.0, 0.0, 0.0)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#71
   * @returns a new right Vector3
   */
  static Right() {
    return new _Vector3(1, 0, 0);
  }
  /**
   * Returns a new Vector3 set to (-1.0, 0.0, 0.0)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#71
   * @returns a new left Vector3
   */
  static Left() {
    return new _Vector3(-1, 0, 0);
  }
  /**
   * Returns a new Vector3 with random values between min and max
   * @param min the minimum random value
   * @param max the maximum random value
   * @returns a Vector3 with random values between min and max
   */
  static Random(min = 0, max = 1) {
    return new _Vector3(RandomRange(min, max), RandomRange(min, max), RandomRange(min, max));
  }
  /**
   * Sets a Vector3 with random values between min and max
   * @param min the minimum random value
   * @param max the maximum random value
   * @param ref the ref to store the values in
   * @returns the ref with random values between min and max
   */
  static RandomToRef(min = 0, max = 1, ref) {
    return ref.copyFromFloats(RandomRange(min, max), RandomRange(min, max), RandomRange(min, max));
  }
  /**
   * Returns a new Vector3 set with the result of the transformation by the given matrix of the given vector.
   * This method computes transformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#111
   * @param vector defines the Vector3 to transform
   * @param transformation defines the transformation matrix
   * @returns the transformed Vector3
   */
  static TransformCoordinates(vector, transformation) {
    const result = _Vector3.Zero();
    _Vector3.TransformCoordinatesToRef(vector, transformation, result);
    return result;
  }
  /**
   * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given vector
   * This method computes transformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#113
   * @param vector defines the Vector3 to transform
   * @param transformation defines the transformation matrix
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  static TransformCoordinatesToRef(vector, transformation, result) {
    _Vector3.TransformCoordinatesFromFloatsToRef(vector._x, vector._y, vector._z, transformation, result);
    return result;
  }
  /**
   * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given floats (x, y, z)
   * This method computes transformed coordinates only, not transformed direction vectors
   * Example Playground https://playground.babylonjs.com/#R1F8YU#115
   * @param x define the x coordinate of the source vector
   * @param y define the y coordinate of the source vector
   * @param z define the z coordinate of the source vector
   * @param transformation defines the transformation matrix
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  static TransformCoordinatesFromFloatsToRef(x, y, z, transformation, result) {
    const m = transformation.m;
    const rx = x * m[0] + y * m[4] + z * m[8] + m[12];
    const ry = x * m[1] + y * m[5] + z * m[9] + m[13];
    const rz = x * m[2] + y * m[6] + z * m[10] + m[14];
    const rw = 1 / (x * m[3] + y * m[7] + z * m[11] + m[15]);
    result._x = rx * rw;
    result._y = ry * rw;
    result._z = rz * rw;
    result._isDirty = true;
    return result;
  }
  /**
   * Returns a new Vector3 set with the result of the normal transformation by the given matrix of the given vector
   * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#112
   * @param vector defines the Vector3 to transform
   * @param transformation defines the transformation matrix
   * @returns the new Vector3
   */
  static TransformNormal(vector, transformation) {
    const result = _Vector3.Zero();
    _Vector3.TransformNormalToRef(vector, transformation, result);
    return result;
  }
  /**
   * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given vector
   * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#114
   * @param vector defines the Vector3 to transform
   * @param transformation defines the transformation matrix
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  static TransformNormalToRef(vector, transformation, result) {
    this.TransformNormalFromFloatsToRef(vector._x, vector._y, vector._z, transformation, result);
    return result;
  }
  /**
   * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given floats (x, y, z)
   * This methods computes transformed normalized direction vectors only (ie. it does not apply translation)
   * Example Playground https://playground.babylonjs.com/#R1F8YU#116
   * @param x define the x coordinate of the source vector
   * @param y define the y coordinate of the source vector
   * @param z define the z coordinate of the source vector
   * @param transformation defines the transformation matrix
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  static TransformNormalFromFloatsToRef(x, y, z, transformation, result) {
    const m = transformation.m;
    result._x = x * m[0] + y * m[4] + z * m[8];
    result._y = x * m[1] + y * m[5] + z * m[9];
    result._z = x * m[2] + y * m[6] + z * m[10];
    result._isDirty = true;
    return result;
  }
  /**
   * Returns a new Vector3 located for "amount" on the CatmullRom interpolation spline defined by the vectors "value1", "value2", "value3", "value4"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#69
   * @param value1 defines the first control point
   * @param value2 defines the second control point
   * @param value3 defines the third control point
   * @param value4 defines the fourth control point
   * @param amount defines the amount on the spline to use
   * @returns the new Vector3
   */
  static CatmullRom(value1, value2, value3, value4, amount) {
    const squared = amount * amount;
    const cubed = amount * squared;
    const x = 0.5 * (2 * value2._x + (-value1._x + value3._x) * amount + (2 * value1._x - 5 * value2._x + 4 * value3._x - value4._x) * squared + (-value1._x + 3 * value2._x - 3 * value3._x + value4._x) * cubed);
    const y = 0.5 * (2 * value2._y + (-value1._y + value3._y) * amount + (2 * value1._y - 5 * value2._y + 4 * value3._y - value4._y) * squared + (-value1._y + 3 * value2._y - 3 * value3._y + value4._y) * cubed);
    const z = 0.5 * (2 * value2._z + (-value1._z + value3._z) * amount + (2 * value1._z - 5 * value2._z + 4 * value3._z - value4._z) * squared + (-value1._z + 3 * value2._z - 3 * value3._z + value4._z) * cubed);
    return new _Vector3(x, y, z);
  }
  /**
   * Returns a new Vector3 set with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
   * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
   * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
   * Example Playground https://playground.babylonjs.com/#R1F8YU#76
   * @param value defines the current value
   * @param min defines the lower range value
   * @param max defines the upper range value
   * @returns the new Vector3
   */
  static Clamp(value, min, max) {
    const result = new _Vector3();
    _Vector3.ClampToRef(value, min, max, result);
    return result;
  }
  /**
   * Sets the given vector "result" with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
   * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
   * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
   * Example Playground https://playground.babylonjs.com/#R1F8YU#77
   * @param value defines the current value
   * @param min defines the lower range value
   * @param max defines the upper range value
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  static ClampToRef(value, min, max, result) {
    let x = value._x;
    x = x > max._x ? max._x : x;
    x = x < min._x ? min._x : x;
    let y = value._y;
    y = y > max._y ? max._y : y;
    y = y < min._y ? min._y : y;
    let z = value._z;
    z = z > max._z ? max._z : z;
    z = z < min._z ? min._z : z;
    result.copyFromFloats(x, y, z);
    return result;
  }
  /**
   * Checks if a given vector is inside a specific range
   * Example Playground https://playground.babylonjs.com/#R1F8YU#75
   * @param v defines the vector to test
   * @param min defines the minimum range
   * @param max defines the maximum range
   */
  static CheckExtends(v, min, max) {
    min.minimizeInPlace(v);
    max.maximizeInPlace(v);
  }
  /**
   * Returns a new Vector3 located for "amount" (float) on the Hermite interpolation spline defined by the vectors "value1", "tangent1", "value2", "tangent2"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#89
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent vector
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent vector
   * @param amount defines the amount on the interpolation spline (between 0 and 1)
   * @returns the new Vector3
   */
  static Hermite(value1, tangent1, value2, tangent2, amount) {
    const squared = amount * amount;
    const cubed = amount * squared;
    const part1 = 2 * cubed - 3 * squared + 1;
    const part2 = -2 * cubed + 3 * squared;
    const part3 = cubed - 2 * squared + amount;
    const part4 = cubed - squared;
    const x = value1._x * part1 + value2._x * part2 + tangent1._x * part3 + tangent2._x * part4;
    const y = value1._y * part1 + value2._y * part2 + tangent1._y * part3 + tangent2._y * part4;
    const z = value1._z * part1 + value2._z * part2 + tangent1._z * part3 + tangent2._z * part4;
    return new _Vector3(x, y, z);
  }
  /**
   * Returns a new Vector3 which is the 1st derivative of the Hermite spline defined by the vectors "value1", "value2", "tangent1", "tangent2".
   * Example Playground https://playground.babylonjs.com/#R1F8YU#90
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param time define where the derivative must be done
   * @returns 1st derivative
   */
  static Hermite1stDerivative(value1, tangent1, value2, tangent2, time) {
    const result = new _Vector3();
    this.Hermite1stDerivativeToRef(value1, tangent1, value2, tangent2, time, result);
    return result;
  }
  /**
   * Update a Vector3 with the 1st derivative of the Hermite spline defined by the vectors "value1", "value2", "tangent1", "tangent2".
   * Example Playground https://playground.babylonjs.com/#R1F8YU#91
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param time define where the derivative must be done
   * @param result define where to store the derivative
   * @returns result input
   */
  static Hermite1stDerivativeToRef(value1, tangent1, value2, tangent2, time, result) {
    const t2 = time * time;
    result._x = (t2 - time) * 6 * value1._x + (3 * t2 - 4 * time + 1) * tangent1._x + (-t2 + time) * 6 * value2._x + (3 * t2 - 2 * time) * tangent2._x;
    result._y = (t2 - time) * 6 * value1._y + (3 * t2 - 4 * time + 1) * tangent1._y + (-t2 + time) * 6 * value2._y + (3 * t2 - 2 * time) * tangent2._y;
    result._z = (t2 - time) * 6 * value1._z + (3 * t2 - 4 * time + 1) * tangent1._z + (-t2 + time) * 6 * value2._z + (3 * t2 - 2 * time) * tangent2._z;
    result._isDirty = true;
    return result;
  }
  /**
   * Returns a new Vector3 located for "amount" (float) on the linear interpolation between the vectors "start" and "end"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#95
   * @param start defines the start value
   * @param end defines the end value
   * @param amount max defines amount between both (between 0 and 1)
   * @returns the new Vector3
   */
  static Lerp(start, end, amount) {
    const result = new _Vector3(0, 0, 0);
    _Vector3.LerpToRef(start, end, amount, result);
    return result;
  }
  /**
   * Sets the given vector "result" with the result of the linear interpolation from the vector "start" for "amount" to the vector "end"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#93
   * @param start defines the start value
   * @param end defines the end value
   * @param amount max defines amount between both (between 0 and 1)
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  static LerpToRef(start, end, amount, result) {
    result._x = start._x + (end._x - start._x) * amount;
    result._y = start._y + (end._y - start._y) * amount;
    result._z = start._z + (end._z - start._z) * amount;
    result._isDirty = true;
    return result;
  }
  /**
   * Returns the dot product (float) between the vectors "left" and "right"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#82
   * @param left defines the left operand
   * @param right defines the right operand
   * @returns the dot product
   */
  static Dot(left, right) {
    return left._x * right._x + left._y * right._y + left._z * right._z;
  }
  /**
   * Returns the dot product (float) between the current vectors and "otherVector"
   * @param otherVector defines the right operand
   * @returns the dot product
   */
  dot(otherVector) {
    return this._x * otherVector._x + this._y * otherVector._y + this._z * otherVector._z;
  }
  /**
   * Returns a new Vector3 as the cross product of the vectors "left" and "right"
   * The cross product is then orthogonal to both "left" and "right"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#15
   * @param left defines the left operand
   * @param right defines the right operand
   * @returns the cross product
   */
  static Cross(left, right) {
    const result = new _Vector3();
    _Vector3.CrossToRef(left, right, result);
    return result;
  }
  /**
   * Sets the given vector "result" with the cross product of "left" and "right"
   * The cross product is then orthogonal to both "left" and "right"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#78
   * @param left defines the left operand
   * @param right defines the right operand
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  static CrossToRef(left, right, result) {
    const x = left._y * right._z - left._z * right._y;
    const y = left._z * right._x - left._x * right._z;
    const z = left._x * right._y - left._y * right._x;
    result.copyFromFloats(x, y, z);
    return result;
  }
  /**
   * Returns a new Vector3 as the normalization of the given vector
   * Example Playground https://playground.babylonjs.com/#R1F8YU#98
   * @param vector defines the Vector3 to normalize
   * @returns the new Vector3
   */
  static Normalize(vector) {
    const result = _Vector3.Zero();
    _Vector3.NormalizeToRef(vector, result);
    return result;
  }
  /**
   * Sets the given vector "result" with the normalization of the given first vector
   * Example Playground https://playground.babylonjs.com/#R1F8YU#98
   * @param vector defines the Vector3 to normalize
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  static NormalizeToRef(vector, result) {
    vector.normalizeToRef(result);
    return result;
  }
  /**
   * Project a Vector3 onto screen space
   * Example Playground https://playground.babylonjs.com/#R1F8YU#101
   * @param vector defines the Vector3 to project
   * @param world defines the world matrix to use
   * @param transform defines the transform (view x projection) matrix to use
   * @param viewport defines the screen viewport to use
   * @returns the new Vector3
   */
  static Project(vector, world, transform, viewport) {
    const result = new _Vector3();
    _Vector3.ProjectToRef(vector, world, transform, viewport, result);
    return result;
  }
  /**
   * Project a Vector3 onto screen space to reference
   * Example Playground https://playground.babylonjs.com/#R1F8YU#102
   * @param vector defines the Vector3 to project
   * @param world defines the world matrix to use
   * @param transform defines the transform (view x projection) matrix to use
   * @param viewport defines the screen viewport to use
   * @param result the vector in which the screen space will be stored
   * @returns result input
   */
  static ProjectToRef(vector, world, transform, viewport, result) {
    const cw = viewport.width;
    const ch = viewport.height;
    const cx = viewport.x;
    const cy = viewport.y;
    const viewportMatrix = MathTmp.Matrix[1];
    const isNDCHalfZRange = EngineStore.LastCreatedEngine?.isNDCHalfZRange;
    const zScale = isNDCHalfZRange ? 1 : 0.5;
    const zOffset = isNDCHalfZRange ? 0 : 0.5;
    Matrix.FromValuesToRef(cw / 2, 0, 0, 0, 0, -ch / 2, 0, 0, 0, 0, zScale, 0, cx + cw / 2, ch / 2 + cy, zOffset, 1, viewportMatrix);
    const matrix = MathTmp.Matrix[0];
    world.multiplyToRef(transform, matrix);
    matrix.multiplyToRef(viewportMatrix, matrix);
    _Vector3.TransformCoordinatesToRef(vector, matrix, result);
    return result;
  }
  /**
   * Reflects a vector off the plane defined by a normalized normal
   * @param inDirection defines the vector direction
   * @param normal defines the normal - Must be normalized
   * @returns the resulting vector
   */
  static Reflect(inDirection, normal) {
    return this.ReflectToRef(inDirection, normal, new _Vector3());
  }
  /**
   * Reflects a vector off the plane defined by a normalized normal to reference
   * @param inDirection defines the vector direction
   * @param normal defines the normal - Must be normalized
   * @param ref defines the Vector3 where to store the result
   * @returns the resulting vector
   */
  static ReflectToRef(inDirection, normal, ref) {
    const tmp = TmpVectors.Vector3[0];
    tmp.copyFrom(normal).scaleInPlace(2 * _Vector3.Dot(inDirection, normal));
    return ref.copyFrom(inDirection).subtractInPlace(tmp);
  }
  /**
   * @internal
   */
  static _UnprojectFromInvertedMatrixToRef(source, matrix, result) {
    _Vector3.TransformCoordinatesToRef(source, matrix, result);
    const m = matrix.m;
    const num = source._x * m[3] + source._y * m[7] + source._z * m[11] + m[15];
    if (WithinEpsilon(num, 1)) {
      result.scaleInPlace(1 / num);
    }
    return result;
  }
  /**
   * Unproject from screen space to object space
   * Example Playground https://playground.babylonjs.com/#R1F8YU#121
   * @param source defines the screen space Vector3 to use
   * @param viewportWidth defines the current width of the viewport
   * @param viewportHeight defines the current height of the viewport
   * @param world defines the world matrix to use (can be set to Identity to go to world space)
   * @param transform defines the transform (view x projection) matrix to use
   * @returns the new Vector3
   */
  static UnprojectFromTransform(source, viewportWidth, viewportHeight, world, transform) {
    return this.Unproject(source, viewportWidth, viewportHeight, world, transform, Matrix.IdentityReadOnly);
  }
  /**
   * Unproject from screen space to object space
   * Example Playground https://playground.babylonjs.com/#R1F8YU#117
   * @param source defines the screen space Vector3 to use
   * @param viewportWidth defines the current width of the viewport
   * @param viewportHeight defines the current height of the viewport
   * @param world defines the world matrix to use (can be set to Identity to go to world space)
   * @param view defines the view matrix to use
   * @param projection defines the projection matrix to use
   * @returns the new Vector3
   */
  static Unproject(source, viewportWidth, viewportHeight, world, view, projection) {
    const result = new _Vector3();
    _Vector3.UnprojectToRef(source, viewportWidth, viewportHeight, world, view, projection, result);
    return result;
  }
  /**
   * Unproject from screen space to object space
   * Example Playground https://playground.babylonjs.com/#R1F8YU#119
   * @param source defines the screen space Vector3 to use
   * @param viewportWidth defines the current width of the viewport
   * @param viewportHeight defines the current height of the viewport
   * @param world defines the world matrix to use (can be set to Identity to go to world space)
   * @param view defines the view matrix to use
   * @param projection defines the projection matrix to use
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  static UnprojectToRef(source, viewportWidth, viewportHeight, world, view, projection, result) {
    _Vector3.UnprojectFloatsToRef(source._x, source._y, source._z, viewportWidth, viewportHeight, world, view, projection, result);
    return result;
  }
  /**
   * Unproject from screen space to object space
   * Example Playground https://playground.babylonjs.com/#R1F8YU#120
   * @param sourceX defines the screen space x coordinate to use
   * @param sourceY defines the screen space y coordinate to use
   * @param sourceZ defines the screen space z coordinate to use
   * @param viewportWidth defines the current width of the viewport
   * @param viewportHeight defines the current height of the viewport
   * @param world defines the world matrix to use (can be set to Identity to go to world space)
   * @param view defines the view matrix to use
   * @param projection defines the projection matrix to use
   * @param result defines the Vector3 where to store the result
   * @returns result input
   */
  static UnprojectFloatsToRef(sourceX, sourceY, sourceZ, viewportWidth, viewportHeight, world, view, projection, result) {
    const matrix = MathTmp.Matrix[0];
    world.multiplyToRef(view, matrix);
    matrix.multiplyToRef(projection, matrix);
    matrix.invert();
    const screenSource = MathTmp.Vector3[0];
    screenSource.x = sourceX / viewportWidth * 2 - 1;
    screenSource.y = -(sourceY / viewportHeight * 2 - 1);
    if (EngineStore.LastCreatedEngine?.isNDCHalfZRange) {
      screenSource.z = sourceZ;
    } else {
      screenSource.z = 2 * sourceZ - 1;
    }
    _Vector3._UnprojectFromInvertedMatrixToRef(screenSource, matrix, result);
    return result;
  }
  /**
   * Gets the minimal coordinate values between two Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#97
   * @param left defines the first operand
   * @param right defines the second operand
   * @returns the new Vector3
   */
  static Minimize(left, right) {
    const min = new _Vector3();
    min.copyFrom(left);
    min.minimizeInPlace(right);
    return min;
  }
  /**
   * Gets the maximal coordinate values between two Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#96
   * @param left defines the first operand
   * @param right defines the second operand
   * @returns the new Vector3
   */
  static Maximize(left, right) {
    const max = new _Vector3();
    max.copyFrom(left);
    max.maximizeInPlace(right);
    return max;
  }
  /**
   * Returns the distance between the vectors "value1" and "value2"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#81
   * @param value1 defines the first operand
   * @param value2 defines the second operand
   * @returns the distance
   */
  static Distance(value1, value2) {
    return Math.sqrt(_Vector3.DistanceSquared(value1, value2));
  }
  /**
   * Returns the squared distance between the vectors "value1" and "value2"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#80
   * @param value1 defines the first operand
   * @param value2 defines the second operand
   * @returns the squared distance
   */
  static DistanceSquared(value1, value2) {
    const x = value1._x - value2._x;
    const y = value1._y - value2._y;
    const z = value1._z - value2._z;
    return x * x + y * y + z * z;
  }
  /**
   * Projects "vector" on the triangle determined by its extremities "p0", "p1" and "p2", stores the result in "ref"
   * and returns the distance to the projected point.
   * Example Playground https://playground.babylonjs.com/#R1F8YU#104
   * From http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.104.4264&rep=rep1&type=pdf
   *
   * @param vector the vector to get distance from
   * @param p0 extremity of the triangle
   * @param p1 extremity of the triangle
   * @param p2 extremity of the triangle
   * @param ref variable to store the result to
   * @returns The distance between "ref" and "vector"
   */
  static ProjectOnTriangleToRef(vector, p0, p1, p2, ref) {
    const p1p0 = MathTmp.Vector3[0];
    const p2p0 = MathTmp.Vector3[1];
    const p2p1 = MathTmp.Vector3[2];
    const normal = MathTmp.Vector3[3];
    const vectorp0 = MathTmp.Vector3[4];
    p1.subtractToRef(p0, p1p0);
    p2.subtractToRef(p0, p2p0);
    p2.subtractToRef(p1, p2p1);
    const p1p0L = p1p0.length();
    const p2p0L = p2p0.length();
    const p2p1L = p2p1.length();
    if (p1p0L < Epsilon || p2p0L < Epsilon || p2p1L < Epsilon) {
      ref.copyFrom(p0);
      return _Vector3.Distance(vector, p0);
    }
    vector.subtractToRef(p0, vectorp0);
    _Vector3.CrossToRef(p1p0, p2p0, normal);
    const nl = normal.length();
    if (nl < Epsilon) {
      ref.copyFrom(p0);
      return _Vector3.Distance(vector, p0);
    }
    normal.normalizeFromLength(nl);
    let l = vectorp0.length();
    if (l < Epsilon) {
      ref.copyFrom(p0);
      return 0;
    }
    vectorp0.normalizeFromLength(l);
    const cosA = _Vector3.Dot(normal, vectorp0);
    const projVector = MathTmp.Vector3[5];
    const proj = MathTmp.Vector3[6];
    projVector.copyFrom(normal).scaleInPlace(-l * cosA);
    proj.copyFrom(vector).addInPlace(projVector);
    const v0 = MathTmp.Vector3[4];
    const v1 = MathTmp.Vector3[5];
    const v2 = MathTmp.Vector3[7];
    const tmp = MathTmp.Vector3[8];
    v0.copyFrom(p1p0).scaleInPlace(1 / p1p0L);
    tmp.copyFrom(p2p0).scaleInPlace(1 / p2p0L);
    v0.addInPlace(tmp).scaleInPlace(-1);
    v1.copyFrom(p1p0).scaleInPlace(-1 / p1p0L);
    tmp.copyFrom(p2p1).scaleInPlace(1 / p2p1L);
    v1.addInPlace(tmp).scaleInPlace(-1);
    v2.copyFrom(p2p1).scaleInPlace(-1 / p2p1L);
    tmp.copyFrom(p2p0).scaleInPlace(-1 / p2p0L);
    v2.addInPlace(tmp).scaleInPlace(-1);
    const projP = MathTmp.Vector3[9];
    let dot;
    projP.copyFrom(proj).subtractInPlace(p0);
    _Vector3.CrossToRef(v0, projP, tmp);
    dot = _Vector3.Dot(tmp, normal);
    const s0 = dot;
    projP.copyFrom(proj).subtractInPlace(p1);
    _Vector3.CrossToRef(v1, projP, tmp);
    dot = _Vector3.Dot(tmp, normal);
    const s1 = dot;
    projP.copyFrom(proj).subtractInPlace(p2);
    _Vector3.CrossToRef(v2, projP, tmp);
    dot = _Vector3.Dot(tmp, normal);
    const s2 = dot;
    const edge = MathTmp.Vector3[10];
    let e0, e1;
    if (s0 > 0 && s1 < 0) {
      edge.copyFrom(p1p0);
      e0 = p0;
      e1 = p1;
    } else if (s1 > 0 && s2 < 0) {
      edge.copyFrom(p2p1);
      e0 = p1;
      e1 = p2;
    } else {
      edge.copyFrom(p2p0).scaleInPlace(-1);
      e0 = p2;
      e1 = p0;
    }
    const tmp2 = MathTmp.Vector3[9];
    const tmp3 = MathTmp.Vector3[4];
    e0.subtractToRef(proj, tmp);
    e1.subtractToRef(proj, tmp2);
    _Vector3.CrossToRef(tmp, tmp2, tmp3);
    const isOutside = _Vector3.Dot(tmp3, normal) < 0;
    if (!isOutside) {
      ref.copyFrom(proj);
      return Math.abs(l * cosA);
    }
    const r = MathTmp.Vector3[5];
    _Vector3.CrossToRef(edge, tmp3, r);
    r.normalize();
    const e0proj = MathTmp.Vector3[9];
    e0proj.copyFrom(e0).subtractInPlace(proj);
    const e0projL = e0proj.length();
    if (e0projL < Epsilon) {
      ref.copyFrom(e0);
      return _Vector3.Distance(vector, e0);
    }
    e0proj.normalizeFromLength(e0projL);
    const cosG = _Vector3.Dot(r, e0proj);
    const triProj = MathTmp.Vector3[7];
    triProj.copyFrom(proj).addInPlace(r.scaleInPlace(e0projL * cosG));
    tmp.copyFrom(triProj).subtractInPlace(e0);
    l = edge.length();
    edge.normalizeFromLength(l);
    let t = _Vector3.Dot(tmp, edge) / Math.max(l, Epsilon);
    t = Clamp(t, 0, 1);
    triProj.copyFrom(e0).addInPlace(edge.scaleInPlace(t * l));
    ref.copyFrom(triProj);
    return _Vector3.Distance(vector, triProj);
  }
  /**
   * Returns a new Vector3 located at the center between "value1" and "value2"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#72
   * @param value1 defines the first operand
   * @param value2 defines the second operand
   * @returns the new Vector3
   */
  static Center(value1, value2) {
    return _Vector3.CenterToRef(value1, value2, _Vector3.Zero());
  }
  /**
   * Gets the center of the vectors "value1" and "value2" and stores the result in the vector "ref"
   * Example Playground https://playground.babylonjs.com/#R1F8YU#73
   * @param value1 defines first vector
   * @param value2 defines second vector
   * @param ref defines third vector
   * @returns ref
   */
  static CenterToRef(value1, value2, ref) {
    return ref.copyFromFloats((value1._x + value2._x) / 2, (value1._y + value2._y) / 2, (value1._z + value2._z) / 2);
  }
  /**
   * Given three orthogonal normalized left-handed oriented Vector3 axis in space (target system),
   * RotationFromAxis() returns the rotation Euler angles (ex : rotation.x, rotation.y, rotation.z) to apply
   * to something in order to rotate it from its local system to the given target system
   * Note: axis1, axis2 and axis3 are normalized during this operation
   * Example Playground https://playground.babylonjs.com/#R1F8YU#106
   * @param axis1 defines the first axis
   * @param axis2 defines the second axis
   * @param axis3 defines the third axis
   * @returns a new Vector3
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/target_align
   */
  static RotationFromAxis(axis1, axis2, axis3) {
    const rotation = new _Vector3();
    _Vector3.RotationFromAxisToRef(axis1, axis2, axis3, rotation);
    return rotation;
  }
  /**
   * The same than RotationFromAxis but updates the given ref Vector3 parameter instead of returning a new Vector3
   * Example Playground https://playground.babylonjs.com/#R1F8YU#107
   * @param axis1 defines the first axis
   * @param axis2 defines the second axis
   * @param axis3 defines the third axis
   * @param ref defines the Vector3 where to store the result
   * @returns result input
   */
  static RotationFromAxisToRef(axis1, axis2, axis3, ref) {
    const quat = MathTmp.Quaternion[0];
    Quaternion.RotationQuaternionFromAxisToRef(axis1, axis2, axis3, quat);
    quat.toEulerAnglesToRef(ref);
    return ref;
  }
};
Vector3._UpReadOnly = Vector3.Up();
Vector3._DownReadOnly = Vector3.Down();
Vector3._LeftHandedForwardReadOnly = Vector3.Forward(false);
Vector3._RightHandedForwardReadOnly = Vector3.Forward(true);
Vector3._LeftHandedBackwardReadOnly = Vector3.Backward(false);
Vector3._RightHandedBackwardReadOnly = Vector3.Backward(true);
Vector3._RightReadOnly = Vector3.Right();
Vector3._LeftReadOnly = Vector3.Left();
Vector3._ZeroReadOnly = Vector3.Zero();
Vector3._OneReadOnly = Vector3.One();
Object.defineProperties(Vector3.prototype, {
  dimension: {
    value: [3]
  },
  rank: {
    value: 1
  }
});
var Vector4 = class _Vector4 {
  /**
   * Creates a Vector4 object from the given floats.
   * @param x x value of the vector
   * @param y y value of the vector
   * @param z z value of the vector
   * @param w w value of the vector
   */
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  /**
   * Returns the string with the Vector4 coordinates.
   * @returns a string containing all the vector values
   */
  toString() {
    return `{X: ${this.x} Y: ${this.y} Z: ${this.z} W: ${this.w}}`;
  }
  /**
   * Returns the string "Vector4".
   * @returns "Vector4"
   */
  getClassName() {
    return "Vector4";
  }
  /**
   * Returns the Vector4 hash code.
   * @returns a unique hash code
   */
  getHashCode() {
    const x = _ExtractAsInt(this.x);
    const y = _ExtractAsInt(this.y);
    const z = _ExtractAsInt(this.z);
    const w = _ExtractAsInt(this.w);
    let hash = x;
    hash = hash * 397 ^ y;
    hash = hash * 397 ^ z;
    hash = hash * 397 ^ w;
    return hash;
  }
  // Operators
  /**
   * Returns a new array populated with 4 elements : the Vector4 coordinates.
   * @returns the resulting array
   */
  asArray() {
    return [this.x, this.y, this.z, this.w];
  }
  /**
   * Populates the given array from the given index with the Vector4 coordinates.
   * @param array array to populate
   * @param index index of the array to start at (default: 0)
   * @returns the Vector4.
   */
  toArray(array, index) {
    if (index === void 0) {
      index = 0;
    }
    array[index] = this.x;
    array[index + 1] = this.y;
    array[index + 2] = this.z;
    array[index + 3] = this.w;
    return this;
  }
  /**
   * Update the current vector from an array
   * @param array defines the destination array
   * @param offset defines the offset in the destination array
   * @returns the current Vector3
   */
  fromArray(array, offset = 0) {
    _Vector4.FromArrayToRef(array, offset, this);
    return this;
  }
  /**
   * Adds the given vector to the current Vector4.
   * @param otherVector the vector to add
   * @returns the updated Vector4.
   */
  addInPlace(otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
    this.z += otherVector.z;
    this.w += otherVector.w;
    return this;
  }
  /**
   * Adds the given coordinates to the current Vector4
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @param w defines the w coordinate of the operand
   * @returns the current updated Vector4
   */
  addInPlaceFromFloats(x, y, z, w) {
    this.x += x;
    this.y += y;
    this.z += z;
    this.w += w;
    return this;
  }
  /**
   * Returns a new Vector4 as the result of the addition of the current Vector4 and the given one.
   * @param otherVector the vector to add
   * @returns the resulting vector
   */
  add(otherVector) {
    return new _Vector4(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z, this.w + otherVector.w);
  }
  /**
   * Updates the given vector "result" with the result of the addition of the current Vector4 and the given one.
   * @param otherVector the vector to add
   * @param result the vector to store the result
   * @returns result input
   */
  addToRef(otherVector, result) {
    result.x = this.x + otherVector.x;
    result.y = this.y + otherVector.y;
    result.z = this.z + otherVector.z;
    result.w = this.w + otherVector.w;
    return result;
  }
  /**
   * Subtract in place the given vector from the current Vector4.
   * @param otherVector the vector to subtract
   * @returns the updated Vector4.
   */
  subtractInPlace(otherVector) {
    this.x -= otherVector.x;
    this.y -= otherVector.y;
    this.z -= otherVector.z;
    this.w -= otherVector.w;
    return this;
  }
  /**
   * Returns a new Vector4 with the result of the subtraction of the given vector from the current Vector4.
   * @param otherVector the vector to add
   * @returns the new vector with the result
   */
  subtract(otherVector) {
    return new _Vector4(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z, this.w - otherVector.w);
  }
  /**
   * Sets the given vector "result" with the result of the subtraction of the given vector from the current Vector4.
   * @param otherVector the vector to subtract
   * @param result the vector to store the result
   * @returns result input
   */
  subtractToRef(otherVector, result) {
    result.x = this.x - otherVector.x;
    result.y = this.y - otherVector.y;
    result.z = this.z - otherVector.z;
    result.w = this.w - otherVector.w;
    return result;
  }
  /**
   * Returns a new Vector4 set with the result of the subtraction of the given floats from the current Vector4 coordinates.
   * @param x value to subtract
   * @param y value to subtract
   * @param z value to subtract
   * @param w value to subtract
   * @returns new vector containing the result
   */
  subtractFromFloats(x, y, z, w) {
    return new _Vector4(this.x - x, this.y - y, this.z - z, this.w - w);
  }
  /**
   * Sets the given vector "result" set with the result of the subtraction of the given floats from the current Vector4 coordinates.
   * @param x value to subtract
   * @param y value to subtract
   * @param z value to subtract
   * @param w value to subtract
   * @param result the vector to store the result in
   * @returns result input
   */
  subtractFromFloatsToRef(x, y, z, w, result) {
    result.x = this.x - x;
    result.y = this.y - y;
    result.z = this.z - z;
    result.w = this.w - w;
    return result;
  }
  /**
   * Returns a new Vector4 set with the current Vector4 negated coordinates.
   * @returns a new vector with the negated values
   */
  negate() {
    return new _Vector4(-this.x, -this.y, -this.z, -this.w);
  }
  /**
   * Negate this vector in place
   * @returns this
   */
  negateInPlace() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    this.w *= -1;
    return this;
  }
  /**
   * Negate the current Vector4 and stores the result in the given vector "result" coordinates
   * @param result defines the Vector3 object where to store the result
   * @returns the result
   */
  negateToRef(result) {
    result.x = -this.x;
    result.y = -this.y;
    result.z = -this.z;
    result.w = -this.w;
    return result;
  }
  /**
   * Multiplies the current Vector4 coordinates by scale (float).
   * @param scale the number to scale with
   * @returns the updated Vector4.
   */
  scaleInPlace(scale) {
    this.x *= scale;
    this.y *= scale;
    this.z *= scale;
    this.w *= scale;
    return this;
  }
  /**
   * Returns a new Vector4 set with the current Vector4 coordinates multiplied by scale (float).
   * @param scale the number to scale with
   * @returns a new vector with the result
   */
  scale(scale) {
    return new _Vector4(this.x * scale, this.y * scale, this.z * scale, this.w * scale);
  }
  /**
   * Sets the given vector "result" with the current Vector4 coordinates multiplied by scale (float).
   * @param scale the number to scale with
   * @param result a vector to store the result in
   * @returns result input
   */
  scaleToRef(scale, result) {
    result.x = this.x * scale;
    result.y = this.y * scale;
    result.z = this.z * scale;
    result.w = this.w * scale;
    return result;
  }
  /**
   * Scale the current Vector4 values by a factor and add the result to a given Vector4
   * @param scale defines the scale factor
   * @param result defines the Vector4 object where to store the result
   * @returns result input
   */
  scaleAndAddToRef(scale, result) {
    result.x += this.x * scale;
    result.y += this.y * scale;
    result.z += this.z * scale;
    result.w += this.w * scale;
    return result;
  }
  /**
   * Boolean : True if the current Vector4 coordinates are stricly equal to the given ones.
   * @param otherVector the vector to compare against
   * @returns true if they are equal
   */
  equals(otherVector) {
    return otherVector && this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z && this.w === otherVector.w;
  }
  /**
   * Boolean : True if the current Vector4 coordinates are each beneath the distance "epsilon" from the given vector ones.
   * @param otherVector vector to compare against
   * @param epsilon (Default: very small number)
   * @returns true if they are equal
   */
  equalsWithEpsilon(otherVector, epsilon = Epsilon) {
    return otherVector && WithinEpsilon(this.x, otherVector.x, epsilon) && WithinEpsilon(this.y, otherVector.y, epsilon) && WithinEpsilon(this.z, otherVector.z, epsilon) && WithinEpsilon(this.w, otherVector.w, epsilon);
  }
  /**
   * Boolean : True if the given floats are strictly equal to the current Vector4 coordinates.
   * @param x x value to compare against
   * @param y y value to compare against
   * @param z z value to compare against
   * @param w w value to compare against
   * @returns true if equal
   */
  equalsToFloats(x, y, z, w) {
    return this.x === x && this.y === y && this.z === z && this.w === w;
  }
  /**
   * Multiplies in place the current Vector4 by the given one.
   * @param otherVector vector to multiple with
   * @returns the updated Vector4.
   */
  multiplyInPlace(otherVector) {
    this.x *= otherVector.x;
    this.y *= otherVector.y;
    this.z *= otherVector.z;
    this.w *= otherVector.w;
    return this;
  }
  /**
   * Returns a new Vector4 set with the multiplication result of the current Vector4 and the given one.
   * @param otherVector vector to multiple with
   * @returns resulting new vector
   */
  multiply(otherVector) {
    return new _Vector4(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z, this.w * otherVector.w);
  }
  /**
   * Updates the given vector "result" with the multiplication result of the current Vector4 and the given one.
   * @param otherVector vector to multiple with
   * @param result vector to store the result
   * @returns result input
   */
  multiplyToRef(otherVector, result) {
    result.x = this.x * otherVector.x;
    result.y = this.y * otherVector.y;
    result.z = this.z * otherVector.z;
    result.w = this.w * otherVector.w;
    return result;
  }
  /**
   * Returns a new Vector4 set with the multiplication result of the given floats and the current Vector4 coordinates.
   * @param x x value multiply with
   * @param y y value multiply with
   * @param z z value multiply with
   * @param w w value multiply with
   * @returns resulting new vector
   */
  multiplyByFloats(x, y, z, w) {
    return new _Vector4(this.x * x, this.y * y, this.z * z, this.w * w);
  }
  /**
   * Returns a new Vector4 set with the division result of the current Vector4 by the given one.
   * @param otherVector vector to devide with
   * @returns resulting new vector
   */
  divide(otherVector) {
    return new _Vector4(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z, this.w / otherVector.w);
  }
  /**
   * Updates the given vector "result" with the division result of the current Vector4 by the given one.
   * @param otherVector vector to devide with
   * @param result vector to store the result
   * @returns result input
   */
  divideToRef(otherVector, result) {
    result.x = this.x / otherVector.x;
    result.y = this.y / otherVector.y;
    result.z = this.z / otherVector.z;
    result.w = this.w / otherVector.w;
    return result;
  }
  /**
   * Divides the current Vector3 coordinates by the given ones.
   * @param otherVector vector to devide with
   * @returns the updated Vector3.
   */
  divideInPlace(otherVector) {
    return this.divideToRef(otherVector, this);
  }
  /**
   * Updates the Vector4 coordinates with the minimum values between its own and the given vector ones
   * @param other defines the second operand
   * @returns the current updated Vector4
   */
  minimizeInPlace(other) {
    if (other.x < this.x) {
      this.x = other.x;
    }
    if (other.y < this.y) {
      this.y = other.y;
    }
    if (other.z < this.z) {
      this.z = other.z;
    }
    if (other.w < this.w) {
      this.w = other.w;
    }
    return this;
  }
  /**
   * Updates the Vector4 coordinates with the maximum values between its own and the given vector ones
   * @param other defines the second operand
   * @returns the current updated Vector4
   */
  maximizeInPlace(other) {
    if (other.x > this.x) {
      this.x = other.x;
    }
    if (other.y > this.y) {
      this.y = other.y;
    }
    if (other.z > this.z) {
      this.z = other.z;
    }
    if (other.w > this.w) {
      this.w = other.w;
    }
    return this;
  }
  /**
   * Updates the current Vector4 with the minimal coordinate values between its and the given coordinates
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @param w defines the w coordinate of the operand
   * @returns the current updated Vector4
   */
  minimizeInPlaceFromFloats(x, y, z, w) {
    this.x = Math.min(x, this.x);
    this.y = Math.min(y, this.y);
    this.z = Math.min(z, this.z);
    this.w = Math.min(w, this.w);
    return this;
  }
  /**
   * Updates the current Vector4 with the maximal coordinate values between its and the given coordinates.
   * @param x defines the x coordinate of the operand
   * @param y defines the y coordinate of the operand
   * @param z defines the z coordinate of the operand
   * @param w defines the w coordinate of the operand
   * @returns the current updated Vector4
   */
  maximizeInPlaceFromFloats(x, y, z, w) {
    this.x = Math.max(x, this.x);
    this.y = Math.max(y, this.y);
    this.z = Math.max(z, this.z);
    this.w = Math.max(w, this.w);
    return this;
  }
  /**
   * Gets the current Vector4's floored values and stores them in result
   * @param result the vector to store the result in
   * @returns the result vector
   */
  floorToRef(result) {
    result.x = Math.floor(this.x);
    result.y = Math.floor(this.y);
    result.z = Math.floor(this.z);
    result.w = Math.floor(this.w);
    return result;
  }
  /**
   * Gets a new Vector4 from current Vector4 floored values
   * @returns a new Vector4
   */
  floor() {
    return new _Vector4(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z), Math.floor(this.w));
  }
  /**
   * Gets the current Vector4's fractional values and stores them in result
   * @param result the vector to store the result in
   * @returns the result vector
   */
  fractToRef(result) {
    result.x = this.x - Math.floor(this.x);
    result.y = this.y - Math.floor(this.y);
    result.z = this.z - Math.floor(this.z);
    result.w = this.w - Math.floor(this.w);
    return result;
  }
  /**
   * Gets a new Vector4 from current Vector4 fractional values
   * @returns a new Vector4
   */
  fract() {
    return new _Vector4(this.x - Math.floor(this.x), this.y - Math.floor(this.y), this.z - Math.floor(this.z), this.w - Math.floor(this.w));
  }
  // Properties
  /**
   * Returns the Vector4 length (float).
   * @returns the length
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  /**
   * Returns the Vector4 squared length (float).
   * @returns the length squared
   */
  lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  // Methods
  /**
   * Normalizes in place the Vector4.
   * @returns the updated Vector4.
   */
  normalize() {
    return this.normalizeFromLength(this.length());
  }
  /**
   * Normalize the current Vector4 with the given input length.
   * Please note that this is an in place operation.
   * @param len the length of the vector
   * @returns the current updated Vector4
   */
  normalizeFromLength(len) {
    if (len === 0 || len === 1) {
      return this;
    }
    return this.scaleInPlace(1 / len);
  }
  /**
   * Normalize the current Vector4 to a new vector
   * @returns the new Vector4
   */
  normalizeToNew() {
    return this.normalizeToRef(new _Vector4());
  }
  /**
   * Normalize the current Vector4 to the reference
   * @param reference define the Vector4 to update
   * @returns the updated Vector4
   */
  normalizeToRef(reference) {
    const len = this.length();
    if (len === 0 || len === 1) {
      reference.x = this.x;
      reference.y = this.y;
      reference.z = this.z;
      reference.w = this.w;
      return reference;
    }
    return this.scaleToRef(1 / len, reference);
  }
  /**
   * Returns a new Vector3 from the Vector4 (x, y, z) coordinates.
   * @returns this converted to a new vector3
   */
  toVector3() {
    return new Vector3(this.x, this.y, this.z);
  }
  /**
   * Returns a new Vector4 copied from the current one.
   * @returns the new cloned vector
   */
  clone() {
    return new _Vector4(this.x, this.y, this.z, this.w);
  }
  /**
   * Updates the current Vector4 with the given one coordinates.
   * @param source the source vector to copy from
   * @returns the updated Vector4.
   */
  copyFrom(source) {
    this.x = source.x;
    this.y = source.y;
    this.z = source.z;
    this.w = source.w;
    return this;
  }
  /**
   * Updates the current Vector4 coordinates with the given floats.
   * @param x float to copy from
   * @param y float to copy from
   * @param z float to copy from
   * @param w float to copy from
   * @returns the updated Vector4.
   */
  copyFromFloats(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
  /**
   * Updates the current Vector4 coordinates with the given floats.
   * @param x float to set from
   * @param y float to set from
   * @param z float to set from
   * @param w float to set from
   * @returns the updated Vector4.
   */
  set(x, y, z, w) {
    return this.copyFromFloats(x, y, z, w);
  }
  /**
   * Copies the given float to the current Vector4 coordinates
   * @param v defines the x, y, z and w coordinates of the operand
   * @returns the current updated Vector4
   */
  setAll(v) {
    this.x = this.y = this.z = this.w = v;
    return this;
  }
  /**
   * Returns the dot product (float) between the current vectors and "otherVector"
   * @param otherVector defines the right operand
   * @returns the dot product
   */
  dot(otherVector) {
    return this.x * otherVector.x + this.y * otherVector.y + this.z * otherVector.z + this.w * otherVector.w;
  }
  // Statics
  /**
   * Returns a new Vector4 set from the starting index of the given array.
   * @param array the array to pull values from
   * @param offset the offset into the array to start at
   * @returns the new vector
   */
  static FromArray(array, offset) {
    if (!offset) {
      offset = 0;
    }
    return new _Vector4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
  }
  /**
   * Updates the given vector "result" from the starting index of the given array.
   * @param array the array to pull values from
   * @param offset the offset into the array to start at
   * @param result the vector to store the result in
   * @returns result input
   */
  static FromArrayToRef(array, offset, result) {
    result.x = array[offset];
    result.y = array[offset + 1];
    result.z = array[offset + 2];
    result.w = array[offset + 3];
    return result;
  }
  /**
   * Updates the given vector "result" from the starting index of the given Float32Array.
   * @param array the array to pull values from
   * @param offset the offset into the array to start at
   * @param result the vector to store the result in
   * @returns result input
   */
  static FromFloatArrayToRef(array, offset, result) {
    _Vector4.FromArrayToRef(array, offset, result);
    return result;
  }
  /**
   * Updates the given vector "result" coordinates from the given floats.
   * @param x float to set from
   * @param y float to set from
   * @param z float to set from
   * @param w float to set from
   * @param result the vector to the floats in
   * @returns result input
   */
  static FromFloatsToRef(x, y, z, w, result) {
    result.x = x;
    result.y = y;
    result.z = z;
    result.w = w;
    return result;
  }
  /**
   * Returns a new Vector4 set to (0.0, 0.0, 0.0, 0.0)
   * @returns the new vector
   */
  static Zero() {
    return new _Vector4(0, 0, 0, 0);
  }
  /**
   * Returns a new Vector4 set to (1.0, 1.0, 1.0, 1.0)
   * @returns the new vector
   */
  static One() {
    return new _Vector4(1, 1, 1, 1);
  }
  /**
   * Returns a new Vector4 with random values between min and max
   * @param min the minimum random value
   * @param max the maximum random value
   * @returns a Vector4 with random values between min and max
   */
  static Random(min = 0, max = 1) {
    return new _Vector4(RandomRange(min, max), RandomRange(min, max), RandomRange(min, max), RandomRange(min, max));
  }
  /**
   * Sets a Vector4 with random values between min and max
   * @param min the minimum random value
   * @param max the maximum random value
   * @param ref the ref to store the values in
   * @returns the ref with random values between min and max
   */
  static RandomToRef(min = 0, max = 1, ref) {
    ref.x = RandomRange(min, max);
    ref.y = RandomRange(min, max);
    ref.z = RandomRange(min, max);
    ref.w = RandomRange(min, max);
    return ref;
  }
  /**
   * Returns a new Vector4 set with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
   * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
   * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
   * @param value defines the current value
   * @param min defines the lower range value
   * @param max defines the upper range value
   * @returns the new Vector4
   */
  static Clamp(value, min, max) {
    return _Vector4.ClampToRef(value, min, max, new _Vector4());
  }
  /**
   * Sets the given vector "result" with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max"
   * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
   * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
   * @param value defines the current value
   * @param min defines the lower range value
   * @param max defines the upper range value
   * @param result defines the Vector4 where to store the result
   * @returns result input
   */
  static ClampToRef(value, min, max, result) {
    result.x = Clamp(value.x, min.x, max.x);
    result.y = Clamp(value.y, min.y, max.y);
    result.z = Clamp(value.z, min.z, max.z);
    result.w = Clamp(value.w, min.w, max.w);
    return result;
  }
  /**
   * Checks if a given vector is inside a specific range
   * Example Playground https://playground.babylonjs.com/#R1F8YU#75
   * @param v defines the vector to test
   * @param min defines the minimum range
   * @param max defines the maximum range
   */
  static CheckExtends(v, min, max) {
    min.minimizeInPlace(v);
    max.maximizeInPlace(v);
  }
  /**
   * Gets a zero Vector4 that must not be updated
   */
  static get ZeroReadOnly() {
    return _Vector4._ZeroReadOnly;
  }
  /**
   * Returns a new normalized Vector4 from the given one.
   * @param vector the vector to normalize
   * @returns the vector
   */
  static Normalize(vector) {
    return _Vector4.NormalizeToRef(vector, new _Vector4());
  }
  /**
   * Updates the given vector "result" from the normalization of the given one.
   * @param vector the vector to normalize
   * @param result the vector to store the result in
   * @returns result input
   */
  static NormalizeToRef(vector, result) {
    vector.normalizeToRef(result);
    return result;
  }
  /**
   * Returns a vector with the minimum values from the left and right vectors
   * @param left left vector to minimize
   * @param right right vector to minimize
   * @returns a new vector with the minimum of the left and right vector values
   */
  static Minimize(left, right) {
    const min = new _Vector4();
    min.copyFrom(left);
    min.minimizeInPlace(right);
    return min;
  }
  /**
   * Returns a vector with the maximum values from the left and right vectors
   * @param left left vector to maximize
   * @param right right vector to maximize
   * @returns a new vector with the maximum of the left and right vector values
   */
  static Maximize(left, right) {
    const max = new _Vector4();
    max.copyFrom(left);
    max.maximizeInPlace(right);
    return max;
  }
  /**
   * Returns the distance (float) between the vectors "value1" and "value2".
   * @param value1 value to calulate the distance between
   * @param value2 value to calulate the distance between
   * @returns the distance between the two vectors
   */
  static Distance(value1, value2) {
    return Math.sqrt(_Vector4.DistanceSquared(value1, value2));
  }
  /**
   * Returns the squared distance (float) between the vectors "value1" and "value2".
   * @param value1 value to calulate the distance between
   * @param value2 value to calulate the distance between
   * @returns the distance between the two vectors squared
   */
  static DistanceSquared(value1, value2) {
    const x = value1.x - value2.x;
    const y = value1.y - value2.y;
    const z = value1.z - value2.z;
    const w = value1.w - value2.w;
    return x * x + y * y + z * z + w * w;
  }
  /**
   * Returns a new Vector4 located at the center between the vectors "value1" and "value2".
   * @param value1 value to calulate the center between
   * @param value2 value to calulate the center between
   * @returns the center between the two vectors
   */
  static Center(value1, value2) {
    return _Vector4.CenterToRef(value1, value2, new _Vector4());
  }
  /**
   * Gets the center of the vectors "value1" and "value2" and stores the result in the vector "ref"
   * @param value1 defines first vector
   * @param value2 defines second vector
   * @param ref defines third vector
   * @returns ref
   */
  static CenterToRef(value1, value2, ref) {
    ref.x = (value1.x + value2.x) / 2;
    ref.y = (value1.y + value2.y) / 2;
    ref.z = (value1.z + value2.z) / 2;
    ref.w = (value1.w + value2.w) / 2;
    return ref;
  }
  /**
   * Returns a new Vector4 set with the result of the transformation by the given matrix of the given vector.
   * This method computes tranformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
   * The difference with Vector3.TransformCoordinates is that the w component is not used to divide the other coordinates but is returned in the w coordinate instead
   * @param vector defines the Vector3 to transform
   * @param transformation defines the transformation matrix
   * @returns the transformed Vector4
   */
  static TransformCoordinates(vector, transformation) {
    return _Vector4.TransformCoordinatesToRef(vector, transformation, new _Vector4());
  }
  /**
   * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given vector
   * This method computes tranformed coordinates only, not transformed direction vectors (ie. it takes translation in account)
   * The difference with Vector3.TransformCoordinatesToRef is that the w component is not used to divide the other coordinates but is returned in the w coordinate instead
   * @param vector defines the Vector3 to transform
   * @param transformation defines the transformation matrix
   * @param result defines the Vector4 where to store the result
   * @returns result input
   */
  static TransformCoordinatesToRef(vector, transformation, result) {
    _Vector4.TransformCoordinatesFromFloatsToRef(vector._x, vector._y, vector._z, transformation, result);
    return result;
  }
  /**
   * Sets the given vector "result" coordinates with the result of the transformation by the given matrix of the given floats (x, y, z)
   * This method computes tranformed coordinates only, not transformed direction vectors
   * The difference with Vector3.TransformCoordinatesFromFloatsToRef is that the w component is not used to divide the other coordinates but is returned in the w coordinate instead
   * @param x define the x coordinate of the source vector
   * @param y define the y coordinate of the source vector
   * @param z define the z coordinate of the source vector
   * @param transformation defines the transformation matrix
   * @param result defines the Vector4 where to store the result
   * @returns result input
   */
  static TransformCoordinatesFromFloatsToRef(x, y, z, transformation, result) {
    const m = transformation.m;
    const rx = x * m[0] + y * m[4] + z * m[8] + m[12];
    const ry = x * m[1] + y * m[5] + z * m[9] + m[13];
    const rz = x * m[2] + y * m[6] + z * m[10] + m[14];
    const rw = x * m[3] + y * m[7] + z * m[11] + m[15];
    result.x = rx;
    result.y = ry;
    result.z = rz;
    result.w = rw;
    return result;
  }
  /**
   * Returns a new Vector4 set with the result of the normal transformation by the given matrix of the given vector.
   * This methods computes transformed normalized direction vectors only.
   * @param vector the vector to transform
   * @param transformation the transformation matrix to apply
   * @returns the new vector
   */
  static TransformNormal(vector, transformation) {
    return _Vector4.TransformNormalToRef(vector, transformation, new _Vector4());
  }
  /**
   * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given vector.
   * This methods computes transformed normalized direction vectors only.
   * @param vector the vector to transform
   * @param transformation the transformation matrix to apply
   * @param result the vector to store the result in
   * @returns result input
   */
  static TransformNormalToRef(vector, transformation, result) {
    const m = transformation.m;
    const x = vector.x * m[0] + vector.y * m[4] + vector.z * m[8];
    const y = vector.x * m[1] + vector.y * m[5] + vector.z * m[9];
    const z = vector.x * m[2] + vector.y * m[6] + vector.z * m[10];
    result.x = x;
    result.y = y;
    result.z = z;
    result.w = vector.w;
    return result;
  }
  /**
   * Sets the given vector "result" with the result of the normal transformation by the given matrix of the given floats (x, y, z, w).
   * This methods computes transformed normalized direction vectors only.
   * @param x value to transform
   * @param y value to transform
   * @param z value to transform
   * @param w value to transform
   * @param transformation the transformation matrix to apply
   * @param result the vector to store the results in
   * @returns result input
   */
  static TransformNormalFromFloatsToRef(x, y, z, w, transformation, result) {
    const m = transformation.m;
    result.x = x * m[0] + y * m[4] + z * m[8];
    result.y = x * m[1] + y * m[5] + z * m[9];
    result.z = x * m[2] + y * m[6] + z * m[10];
    result.w = w;
    return result;
  }
  /**
   * Creates a new Vector4 from a Vector3
   * @param source defines the source data
   * @param w defines the 4th component (default is 0)
   * @returns a new Vector4
   */
  static FromVector3(source, w = 0) {
    return new _Vector4(source._x, source._y, source._z, w);
  }
  /**
   * Returns the dot product (float) between the vectors "left" and "right"
   * @param left defines the left operand
   * @param right defines the right operand
   * @returns the dot product
   */
  static Dot(left, right) {
    return left.x * right.x + left.y * right.y + left.z * right.z + left.w * right.w;
  }
};
Vector4._ZeroReadOnly = Vector4.Zero();
Object.defineProperties(Vector4.prototype, {
  dimension: {
    value: [4]
  },
  rank: {
    value: 1
  }
});
var Quaternion = class _Quaternion {
  /** Gets or sets the x coordinate */
  get x() {
    return this._x;
  }
  set x(value) {
    this._x = value;
    this._isDirty = true;
  }
  /** Gets or sets the y coordinate */
  get y() {
    return this._y;
  }
  set y(value) {
    this._y = value;
    this._isDirty = true;
  }
  /** Gets or sets the z coordinate */
  get z() {
    return this._z;
  }
  set z(value) {
    this._z = value;
    this._isDirty = true;
  }
  /** Gets or sets the w coordinate */
  get w() {
    return this._w;
  }
  set w(value) {
    this._w = value;
    this._isDirty = true;
  }
  /**
   * Creates a new Quaternion from the given floats
   * @param x defines the first component (0 by default)
   * @param y defines the second component (0 by default)
   * @param z defines the third component (0 by default)
   * @param w defines the fourth component (1.0 by default)
   */
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this._isDirty = true;
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }
  /**
   * Gets a string representation for the current quaternion
   * @returns a string with the Quaternion coordinates
   */
  toString() {
    return `{X: ${this._x} Y: ${this._y} Z: ${this._z} W: ${this._w}}`;
  }
  /**
   * Gets the class name of the quaternion
   * @returns the string "Quaternion"
   */
  getClassName() {
    return "Quaternion";
  }
  /**
   * Gets a hash code for this quaternion
   * @returns the quaternion hash code
   */
  getHashCode() {
    const x = _ExtractAsInt(this._x);
    const y = _ExtractAsInt(this._y);
    const z = _ExtractAsInt(this._z);
    const w = _ExtractAsInt(this._w);
    let hash = x;
    hash = hash * 397 ^ y;
    hash = hash * 397 ^ z;
    hash = hash * 397 ^ w;
    return hash;
  }
  /**
   * Copy the quaternion to an array
   * Example Playground https://playground.babylonjs.com/#L49EJ7#13
   * @returns a new array populated with 4 elements from the quaternion coordinates
   */
  asArray() {
    return [this._x, this._y, this._z, this._w];
  }
  /**
   * Stores from the starting index in the given array the Quaternion successive values
   * Example Playground https://playground.babylonjs.com/#L49EJ7#59
   * @param array defines the array where to store the x,y,z,w components
   * @param index defines an optional index in the target array to define where to start storing values
   * @returns the current Quaternion object
   */
  toArray(array, index = 0) {
    array[index] = this._x;
    array[index + 1] = this._y;
    array[index + 2] = this._z;
    array[index + 3] = this._w;
    return this;
  }
  fromArray(array, index = 0) {
    return _Quaternion.FromArrayToRef(array, index, this);
  }
  /**
   * Check if two quaternions are equals
   * Example Playground https://playground.babylonjs.com/#L49EJ7#38
   * @param otherQuaternion defines the second operand
   * @returns true if the current quaternion and the given one coordinates are strictly equals
   */
  equals(otherQuaternion) {
    return otherQuaternion && this._x === otherQuaternion._x && this._y === otherQuaternion._y && this._z === otherQuaternion._z && this._w === otherQuaternion._w;
  }
  /**
   * Gets a boolean if two quaternions are equals (using an epsilon value)
   * Example Playground https://playground.babylonjs.com/#L49EJ7#37
   * @param otherQuaternion defines the other quaternion
   * @param epsilon defines the minimal distance to consider equality
   * @returns true if the given quaternion coordinates are close to the current ones by a distance of epsilon.
   */
  equalsWithEpsilon(otherQuaternion, epsilon = Epsilon) {
    return otherQuaternion && WithinEpsilon(this._x, otherQuaternion._x, epsilon) && WithinEpsilon(this._y, otherQuaternion._y, epsilon) && WithinEpsilon(this._z, otherQuaternion._z, epsilon) && WithinEpsilon(this._w, otherQuaternion._w, epsilon);
  }
  /**
   * Clone the current quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#12
   * @returns a new quaternion copied from the current one
   */
  clone() {
    return new _Quaternion(this._x, this._y, this._z, this._w);
  }
  /**
   * Copy a quaternion to the current one
   * Example Playground https://playground.babylonjs.com/#L49EJ7#86
   * @param other defines the other quaternion
   * @returns the updated current quaternion
   */
  copyFrom(other) {
    this._x = other._x;
    this._y = other._y;
    this._z = other._z;
    this._w = other._w;
    this._isDirty = true;
    return this;
  }
  /**
   * Updates the current quaternion with the given float coordinates
   * Example Playground https://playground.babylonjs.com/#L49EJ7#87
   * @param x defines the x coordinate
   * @param y defines the y coordinate
   * @param z defines the z coordinate
   * @param w defines the w coordinate
   * @returns the updated current quaternion
   */
  copyFromFloats(x, y, z, w) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
    this._isDirty = true;
    return this;
  }
  /**
   * Updates the current quaternion from the given float coordinates
   * Example Playground https://playground.babylonjs.com/#L49EJ7#56
   * @param x defines the x coordinate
   * @param y defines the y coordinate
   * @param z defines the z coordinate
   * @param w defines the w coordinate
   * @returns the updated current quaternion
   */
  set(x, y, z, w) {
    return this.copyFromFloats(x, y, z, w);
  }
  setAll(value) {
    return this.copyFromFloats(value, value, value, value);
  }
  /**
   * Adds two quaternions
   * Example Playground https://playground.babylonjs.com/#L49EJ7#10
   * @param other defines the second operand
   * @returns a new quaternion as the addition result of the given one and the current quaternion
   */
  add(other) {
    return new _Quaternion(this._x + other._x, this._y + other._y, this._z + other._z, this._w + other._w);
  }
  /**
   * Add a quaternion to the current one
   * Example Playground https://playground.babylonjs.com/#L49EJ7#11
   * @param other defines the quaternion to add
   * @returns the current quaternion
   */
  addInPlace(other) {
    this._x += other._x;
    this._y += other._y;
    this._z += other._z;
    this._w += other._w;
    this._isDirty = true;
    return this;
  }
  addToRef(other, result) {
    result._x = this._x + other._x;
    result._y = this._y + other._y;
    result._z = this._z + other._z;
    result._w = this._w + other._w;
    result._isDirty = true;
    return result;
  }
  addInPlaceFromFloats(x, y, z, w) {
    this._x += x;
    this._y += y;
    this._z += z;
    this._w += w;
    this._isDirty = true;
    return this;
  }
  subtractToRef(other, result) {
    result._x = this._x - other._x;
    result._y = this._y - other._y;
    result._z = this._z - other._z;
    result._w = this._w - other._w;
    result._isDirty = true;
    return result;
  }
  subtractFromFloats(x, y, z, w) {
    return this.subtractFromFloatsToRef(x, y, z, w, new _Quaternion());
  }
  subtractFromFloatsToRef(x, y, z, w, result) {
    result._x = this._x - x;
    result._y = this._y - y;
    result._z = this._z - z;
    result._w = this._w - w;
    result._isDirty = true;
    return result;
  }
  /**
   * Subtract two quaternions
   * Example Playground https://playground.babylonjs.com/#L49EJ7#57
   * @param other defines the second operand
   * @returns a new quaternion as the subtraction result of the given one from the current one
   */
  subtract(other) {
    return new _Quaternion(this._x - other._x, this._y - other._y, this._z - other._z, this._w - other._w);
  }
  /**
   * Subtract a quaternion to the current one
   * Example Playground https://playground.babylonjs.com/#L49EJ7#58
   * @param other defines the quaternion to subtract
   * @returns the current quaternion
   */
  subtractInPlace(other) {
    this._x -= other._x;
    this._y -= other._y;
    this._z -= other._z;
    this._w -= other._w;
    this._isDirty = true;
    return this;
  }
  /**
   * Multiplies the current quaternion by a scale factor
   * Example Playground https://playground.babylonjs.com/#L49EJ7#88
   * @param value defines the scale factor
   * @returns a new quaternion set by multiplying the current quaternion coordinates by the float "scale"
   */
  scale(value) {
    return new _Quaternion(this._x * value, this._y * value, this._z * value, this._w * value);
  }
  /**
   * Scale the current quaternion values by a factor and stores the result to a given quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#89
   * @param scale defines the scale factor
   * @param result defines the Quaternion object where to store the result
   * @returns result input
   */
  scaleToRef(scale, result) {
    result._x = this._x * scale;
    result._y = this._y * scale;
    result._z = this._z * scale;
    result._w = this._w * scale;
    result._isDirty = true;
    return result;
  }
  /**
   * Multiplies in place the current quaternion by a scale factor
   * Example Playground https://playground.babylonjs.com/#L49EJ7#90
   * @param value defines the scale factor
   * @returns the current modified quaternion
   */
  scaleInPlace(value) {
    this._x *= value;
    this._y *= value;
    this._z *= value;
    this._w *= value;
    this._isDirty = true;
    return this;
  }
  /**
   * Scale the current quaternion values by a factor and add the result to a given quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#91
   * @param scale defines the scale factor
   * @param result defines the Quaternion object where to store the result
   * @returns result input
   */
  scaleAndAddToRef(scale, result) {
    result._x += this._x * scale;
    result._y += this._y * scale;
    result._z += this._z * scale;
    result._w += this._w * scale;
    result._isDirty = true;
    return result;
  }
  /**
   * Multiplies two quaternions
   * Example Playground https://playground.babylonjs.com/#L49EJ7#43
   * @param q1 defines the second operand
   * @returns a new quaternion set as the multiplication result of the current one with the given one "q1"
   */
  multiply(q1) {
    const result = new _Quaternion(0, 0, 0, 1);
    this.multiplyToRef(q1, result);
    return result;
  }
  /**
   * Sets the given "result" as the multiplication result of the current one with the given one "q1"
   * Example Playground https://playground.babylonjs.com/#L49EJ7#45
   * @param q1 defines the second operand
   * @param result defines the target quaternion
   * @returns the current quaternion
   */
  multiplyToRef(q1, result) {
    const x = this._x * q1._w + this._y * q1._z - this._z * q1._y + this._w * q1._x;
    const y = -this._x * q1._z + this._y * q1._w + this._z * q1._x + this._w * q1._y;
    const z = this._x * q1._y - this._y * q1._x + this._z * q1._w + this._w * q1._z;
    const w = -this._x * q1._x - this._y * q1._y - this._z * q1._z + this._w * q1._w;
    result.copyFromFloats(x, y, z, w);
    return result;
  }
  /**
   * Updates the current quaternion with the multiplication of itself with the given one "q1"
   * Example Playground https://playground.babylonjs.com/#L49EJ7#46
   * @param other defines the second operand
   * @returns the currentupdated quaternion
   */
  multiplyInPlace(other) {
    return this.multiplyToRef(other, this);
  }
  multiplyByFloats(x, y, z, w) {
    this._x *= x;
    this._y *= y;
    this._z *= z;
    this._w *= w;
    this._isDirty = true;
    return this;
  }
  /**
   * @internal
   * Do not use
   */
  divide(_other) {
    throw new ReferenceError("Can not divide a quaternion");
  }
  /**
   * @internal
   * Do not use
   */
  divideToRef(_other, _result) {
    throw new ReferenceError("Can not divide a quaternion");
  }
  /**
   * @internal
   * Do not use
   */
  divideInPlace(_other) {
    throw new ReferenceError("Can not divide a quaternion");
  }
  /**
   * @internal
   * Do not use
   */
  minimizeInPlace() {
    throw new ReferenceError("Can not minimize a quaternion");
  }
  /**
   * @internal
   * Do not use
   */
  minimizeInPlaceFromFloats() {
    throw new ReferenceError("Can not minimize a quaternion");
  }
  /**
   * @internal
   * Do not use
   */
  maximizeInPlace() {
    throw new ReferenceError("Can not maximize a quaternion");
  }
  /**
   * @internal
   * Do not use
   */
  maximizeInPlaceFromFloats() {
    throw new ReferenceError("Can not maximize a quaternion");
  }
  negate() {
    return this.negateToRef(new _Quaternion());
  }
  negateInPlace() {
    this._x = -this._x;
    this._y = -this._y;
    this._z = -this._z;
    this._w = -this._w;
    this._isDirty = true;
    return this;
  }
  negateToRef(result) {
    result._x = -this._x;
    result._y = -this._y;
    result._z = -this._z;
    result._w = -this._w;
    result._isDirty = true;
    return result;
  }
  equalsToFloats(x, y, z, w) {
    return this._x === x && this._y === y && this._z === z && this._w === w;
  }
  /**
   * @internal
   * Do not use
   */
  floorToRef(_result) {
    throw new ReferenceError("Can not floor a quaternion");
  }
  /**
   * @internal
   * Do not use
   */
  floor() {
    throw new ReferenceError("Can not floor a quaternion");
  }
  /**
   * @internal
   * Do not use
   */
  fractToRef(_result) {
    throw new ReferenceError("Can not fract a quaternion");
  }
  /**
   * @internal
   * Do not use
   */
  fract() {
    throw new ReferenceError("Can not fract a quaternion");
  }
  /**
   * Conjugates the current quaternion and stores the result in the given quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#81
   * @param ref defines the target quaternion
   * @returns result input
   */
  conjugateToRef(ref) {
    ref.copyFromFloats(-this._x, -this._y, -this._z, this._w);
    return ref;
  }
  /**
   * Conjugates in place the current quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#82
   * @returns the current updated quaternion
   */
  conjugateInPlace() {
    this._x *= -1;
    this._y *= -1;
    this._z *= -1;
    this._isDirty = true;
    return this;
  }
  /**
   * Conjugates (1-q) the current quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#83
   * @returns a new quaternion
   */
  conjugate() {
    return new _Quaternion(-this._x, -this._y, -this._z, this._w);
  }
  /**
   * Returns the inverse of the current quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#84
   * @returns a new quaternion
   */
  invert() {
    const conjugate = this.conjugate();
    const lengthSquared = this.lengthSquared();
    if (lengthSquared == 0 || lengthSquared == 1) {
      return conjugate;
    }
    conjugate.scaleInPlace(1 / lengthSquared);
    return conjugate;
  }
  /**
   * Invert in place the current quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#85
   * @returns this quaternion
   */
  invertInPlace() {
    this.conjugateInPlace();
    const lengthSquared = this.lengthSquared();
    if (lengthSquared == 0 || lengthSquared == 1) {
      return this;
    }
    this.scaleInPlace(1 / lengthSquared);
    return this;
  }
  /**
   * Gets squared length of current quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#29
   * @returns the quaternion length (float)
   */
  lengthSquared() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  /**
   * Gets length of current quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#28
   * @returns the quaternion length (float)
   */
  length() {
    return Math.sqrt(this.lengthSquared());
  }
  /**
   * Normalize in place the current quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#54
   * @returns the current updated quaternion
   */
  normalize() {
    return this.normalizeFromLength(this.length());
  }
  /**
   * Normalize the current quaternion with the given input length.
   * Please note that this is an in place operation.
   * @param len the length of the quaternion
   * @returns the current updated Quaternion
   */
  normalizeFromLength(len) {
    if (len === 0 || len === 1) {
      return this;
    }
    return this.scaleInPlace(1 / len);
  }
  /**
   * Normalize a copy of the current quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#55
   * @returns the normalized quaternion
   */
  normalizeToNew() {
    const normalized = new _Quaternion(0, 0, 0, 1);
    this.normalizeToRef(normalized);
    return normalized;
  }
  /**
   * Normalize the current Quaternion to the reference
   * @param reference define the Quaternion to update
   * @returns the updated Quaternion
   */
  normalizeToRef(reference) {
    const len = this.length();
    if (len === 0 || len === 1) {
      return reference.copyFromFloats(this._x, this._y, this._z, this._w);
    }
    return this.scaleToRef(1 / len, reference);
  }
  /**
   * Returns a new Vector3 set with the Euler angles translated from the current quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#32
   * @returns a new Vector3 containing the Euler angles
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/rotation_conventions
   */
  toEulerAngles() {
    const result = Vector3.Zero();
    this.toEulerAnglesToRef(result);
    return result;
  }
  /**
   * Sets the given vector3 "result" with the Euler angles translated from the current quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#31
   * @param result defines the vector which will be filled with the Euler angles
   * @returns result input
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/rotation_conventions
   */
  toEulerAnglesToRef(result) {
    const qz = this._z;
    const qx = this._x;
    const qy = this._y;
    const qw = this._w;
    const zAxisY = qy * qz - qx * qw;
    const limit = 0.4999999;
    if (zAxisY < -limit) {
      result._y = 2 * Math.atan2(qy, qw);
      result._x = Math.PI / 2;
      result._z = 0;
      result._isDirty = true;
    } else if (zAxisY > limit) {
      result._y = 2 * Math.atan2(qy, qw);
      result._x = -Math.PI / 2;
      result._z = 0;
      result._isDirty = true;
    } else {
      const sqw = qw * qw;
      const sqz = qz * qz;
      const sqx = qx * qx;
      const sqy = qy * qy;
      result._z = Math.atan2(2 * (qx * qy + qz * qw), -sqz - sqx + sqy + sqw);
      result._x = Math.asin(-2 * zAxisY);
      result._y = Math.atan2(2 * (qz * qx + qy * qw), sqz - sqx - sqy + sqw);
      result._isDirty = true;
    }
    return result;
  }
  /**
   * Sets the given vector3 "result" with the Alpha, Beta, Gamma Euler angles translated from the current quaternion
   * @param result defines the vector which will be filled with the Euler angles
   * @returns result input
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/rotation_conventions
   */
  toAlphaBetaGammaToRef(result) {
    const qz = this._z;
    const qx = this._x;
    const qy = this._y;
    const qw = this._w;
    const sinHalfBeta = Math.sqrt(qx * qx + qy * qy);
    const cosHalfBeta = Math.sqrt(qz * qz + qw * qw);
    const beta = 2 * Math.atan2(sinHalfBeta, cosHalfBeta);
    const gammaPlusAlpha = 2 * Math.atan2(qz, qw);
    const gammaMinusAlpha = 2 * Math.atan2(qy, qx);
    const gamma = (gammaPlusAlpha + gammaMinusAlpha) / 2;
    const alpha = (gammaPlusAlpha - gammaMinusAlpha) / 2;
    result.set(alpha, beta, gamma);
    return result;
  }
  /**
   * Updates the given rotation matrix with the current quaternion values
   * Example Playground https://playground.babylonjs.com/#L49EJ7#67
   * @param result defines the target matrix
   * @returns the updated matrix with the rotation
   */
  toRotationMatrix(result) {
    Matrix.FromQuaternionToRef(this, result);
    return result;
  }
  /**
   * Updates the current quaternion from the given rotation matrix values
   * Example Playground https://playground.babylonjs.com/#L49EJ7#41
   * @param matrix defines the source matrix
   * @returns the current updated quaternion
   */
  fromRotationMatrix(matrix) {
    _Quaternion.FromRotationMatrixToRef(matrix, this);
    return this;
  }
  /**
   * Returns the dot product (float) between the current quaternions and "other"
   * @param other defines the right operand
   * @returns the dot product
   */
  dot(other) {
    return this._x * other._x + this._y * other._y + this._z * other._z + this._w * other._w;
  }
  // Statics
  /**
   * Creates a new quaternion from a rotation matrix
   * Example Playground https://playground.babylonjs.com/#L49EJ7#101
   * @param matrix defines the source matrix
   * @returns a new quaternion created from the given rotation matrix values
   */
  static FromRotationMatrix(matrix) {
    const result = new _Quaternion();
    _Quaternion.FromRotationMatrixToRef(matrix, result);
    return result;
  }
  /**
   * Updates the given quaternion with the given rotation matrix values
   * Example Playground https://playground.babylonjs.com/#L49EJ7#102
   * @param matrix defines the source matrix
   * @param result defines the target quaternion
   * @returns result input
   */
  static FromRotationMatrixToRef(matrix, result) {
    const data = matrix.m;
    const m11 = data[0], m12 = data[4], m13 = data[8];
    const m21 = data[1], m22 = data[5], m23 = data[9];
    const m31 = data[2], m32 = data[6], m33 = data[10];
    const trace = m11 + m22 + m33;
    let s;
    if (trace > 0) {
      s = 0.5 / Math.sqrt(trace + 1);
      result._w = 0.25 / s;
      result._x = (m32 - m23) * s;
      result._y = (m13 - m31) * s;
      result._z = (m21 - m12) * s;
      result._isDirty = true;
    } else if (m11 > m22 && m11 > m33) {
      s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      result._w = (m32 - m23) / s;
      result._x = 0.25 * s;
      result._y = (m12 + m21) / s;
      result._z = (m13 + m31) / s;
      result._isDirty = true;
    } else if (m22 > m33) {
      s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      result._w = (m13 - m31) / s;
      result._x = (m12 + m21) / s;
      result._y = 0.25 * s;
      result._z = (m23 + m32) / s;
      result._isDirty = true;
    } else {
      s = 2 * Math.sqrt(1 + m33 - m11 - m22);
      result._w = (m21 - m12) / s;
      result._x = (m13 + m31) / s;
      result._y = (m23 + m32) / s;
      result._z = 0.25 * s;
      result._isDirty = true;
    }
    return result;
  }
  /**
   * Returns the dot product (float) between the quaternions "left" and "right"
   * Example Playground https://playground.babylonjs.com/#L49EJ7#61
   * @param left defines the left operand
   * @param right defines the right operand
   * @returns the dot product
   */
  static Dot(left, right) {
    return left._x * right._x + left._y * right._y + left._z * right._z + left._w * right._w;
  }
  /**
   * Checks if the orientations of two rotation quaternions are close to each other
   * Example Playground https://playground.babylonjs.com/#L49EJ7#60
   * @param quat0 defines the first quaternion to check
   * @param quat1 defines the second quaternion to check
   * @param epsilon defines closeness, 0 same orientation, 1 PI apart, default 0.1
   * @returns true if the two quaternions are close to each other within epsilon
   */
  static AreClose(quat0, quat1, epsilon = 0.1) {
    const dot = _Quaternion.Dot(quat0, quat1);
    return 1 - dot * dot <= epsilon;
  }
  /**
   * Smooth interpolation between two quaternions using Slerp
   * Example Playground https://playground.babylonjs.com/#L49EJ7#93
   * @param source source quaternion
   * @param goal goal quaternion
   * @param deltaTime current interpolation frame
   * @param lerpTime total interpolation time
   * @param result the smoothed quaternion
   * @returns the smoothed quaternion
   */
  static SmoothToRef(source, goal, deltaTime, lerpTime, result) {
    let slerp = lerpTime === 0 ? 1 : deltaTime / lerpTime;
    slerp = Clamp(slerp, 0, 1);
    _Quaternion.SlerpToRef(source, goal, slerp, result);
    return result;
  }
  /**
   * Creates an empty quaternion
   * @returns a new quaternion set to (0.0, 0.0, 0.0)
   */
  static Zero() {
    return new _Quaternion(0, 0, 0, 0);
  }
  /**
   * Inverse a given quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#103
   * @param q defines the source quaternion
   * @returns a new quaternion as the inverted current quaternion
   */
  static Inverse(q) {
    return new _Quaternion(-q._x, -q._y, -q._z, q._w);
  }
  /**
   * Inverse a given quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#104
   * @param q defines the source quaternion
   * @param result the quaternion the result will be stored in
   * @returns the result quaternion
   */
  static InverseToRef(q, result) {
    result.set(-q._x, -q._y, -q._z, q._w);
    return result;
  }
  /**
   * Creates an identity quaternion
   * @returns the identity quaternion
   */
  static Identity() {
    return new _Quaternion(0, 0, 0, 1);
  }
  /**
   * Gets a boolean indicating if the given quaternion is identity
   * @param quaternion defines the quaternion to check
   * @returns true if the quaternion is identity
   */
  static IsIdentity(quaternion) {
    return quaternion && quaternion._x === 0 && quaternion._y === 0 && quaternion._z === 0 && quaternion._w === 1;
  }
  /**
   * Creates a quaternion from a rotation around an axis
   * Example Playground https://playground.babylonjs.com/#L49EJ7#72
   * @param axis defines the axis to use
   * @param angle defines the angle to use
   * @returns a new quaternion created from the given axis (Vector3) and angle in radians (float)
   */
  static RotationAxis(axis, angle) {
    return _Quaternion.RotationAxisToRef(axis, angle, new _Quaternion());
  }
  /**
   * Creates a rotation around an axis and stores it into the given quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#73
   * @param axis defines the axis to use
   * @param angle defines the angle to use
   * @param result defines the target quaternion
   * @returns the target quaternion
   */
  static RotationAxisToRef(axis, angle, result) {
    result._w = Math.cos(angle / 2);
    const sinByLength = Math.sin(angle / 2) / axis.length();
    result._x = axis._x * sinByLength;
    result._y = axis._y * sinByLength;
    result._z = axis._z * sinByLength;
    result._isDirty = true;
    return result;
  }
  /**
   * Creates a new quaternion from data stored into an array
   * Example Playground https://playground.babylonjs.com/#L49EJ7#63
   * @param array defines the data source
   * @param offset defines the offset in the source array where the data starts
   * @returns a new quaternion
   */
  static FromArray(array, offset) {
    if (!offset) {
      offset = 0;
    }
    return new _Quaternion(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
  }
  /**
   * Updates the given quaternion "result" from the starting index of the given array.
   * Example Playground https://playground.babylonjs.com/#L49EJ7#64
   * @param array the array to pull values from
   * @param offset the offset into the array to start at
   * @param result the quaternion to store the result in
   * @returns result input
   */
  static FromArrayToRef(array, offset, result) {
    result._x = array[offset];
    result._y = array[offset + 1];
    result._z = array[offset + 2];
    result._w = array[offset + 3];
    result._isDirty = true;
    return result;
  }
  /**
   * Sets the given quaternion "result" with the given floats.
   * @param x defines the x coordinate of the source
   * @param y defines the y coordinate of the source
   * @param z defines the z coordinate of the source
   * @param w defines the w coordinate of the source
   * @param result defines the quaternion where to store the result
   * @returns the result quaternion
   */
  static FromFloatsToRef(x, y, z, w, result) {
    result.copyFromFloats(x, y, z, w);
    return result;
  }
  /**
   * Create a quaternion from Euler rotation angles
   * Example Playground https://playground.babylonjs.com/#L49EJ7#33
   * @param x Pitch
   * @param y Yaw
   * @param z Roll
   * @returns the new Quaternion
   */
  static FromEulerAngles(x, y, z) {
    const q = new _Quaternion();
    _Quaternion.RotationYawPitchRollToRef(y, x, z, q);
    return q;
  }
  /**
   * Updates a quaternion from Euler rotation angles
   * Example Playground https://playground.babylonjs.com/#L49EJ7#34
   * @param x Pitch
   * @param y Yaw
   * @param z Roll
   * @param result the quaternion to store the result
   * @returns the updated quaternion
   */
  static FromEulerAnglesToRef(x, y, z, result) {
    _Quaternion.RotationYawPitchRollToRef(y, x, z, result);
    return result;
  }
  /**
   * Create a quaternion from Euler rotation vector
   * Example Playground https://playground.babylonjs.com/#L49EJ7#35
   * @param vec the Euler vector (x Pitch, y Yaw, z Roll)
   * @returns the new Quaternion
   */
  static FromEulerVector(vec) {
    const q = new _Quaternion();
    _Quaternion.RotationYawPitchRollToRef(vec._y, vec._x, vec._z, q);
    return q;
  }
  /**
   * Updates a quaternion from Euler rotation vector
   * Example Playground https://playground.babylonjs.com/#L49EJ7#36
   * @param vec the Euler vector (x Pitch, y Yaw, z Roll)
   * @param result the quaternion to store the result
   * @returns the updated quaternion
   */
  static FromEulerVectorToRef(vec, result) {
    _Quaternion.RotationYawPitchRollToRef(vec._y, vec._x, vec._z, result);
    return result;
  }
  /**
   * Updates a quaternion so that it rotates vector vecFrom to vector vecTo
   * Example Playground - https://playground.babylonjs.com/#L49EJ7#70
   * @param vecFrom defines the direction vector from which to rotate
   * @param vecTo defines the direction vector to which to rotate
   * @param result the quaternion to store the result
   * @param epsilon defines the minimal dot value to define vecs as opposite. Default: `BABYLON.Epsilon`
   * @returns the updated quaternion
   */
  static FromUnitVectorsToRef(vecFrom, vecTo, result, epsilon = Epsilon) {
    const r = Vector3.Dot(vecFrom, vecTo) + 1;
    if (r < epsilon) {
      if (Math.abs(vecFrom.x) > Math.abs(vecFrom.z)) {
        result.set(-vecFrom.y, vecFrom.x, 0, 0);
      } else {
        result.set(0, -vecFrom.z, vecFrom.y, 0);
      }
    } else {
      Vector3.CrossToRef(vecFrom, vecTo, TmpVectors.Vector3[0]);
      result.set(TmpVectors.Vector3[0].x, TmpVectors.Vector3[0].y, TmpVectors.Vector3[0].z, r);
    }
    return result.normalize();
  }
  /**
   * Creates a new quaternion from the given Euler float angles (y, x, z)
   * Example Playground https://playground.babylonjs.com/#L49EJ7#77
   * @param yaw defines the rotation around Y axis
   * @param pitch defines the rotation around X axis
   * @param roll defines the rotation around Z axis
   * @returns the new quaternion
   */
  static RotationYawPitchRoll(yaw, pitch, roll) {
    const q = new _Quaternion();
    _Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, q);
    return q;
  }
  /**
   * Creates a new rotation from the given Euler float angles (y, x, z) and stores it in the target quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#78
   * @param yaw defines the rotation around Y axis
   * @param pitch defines the rotation around X axis
   * @param roll defines the rotation around Z axis
   * @param result defines the target quaternion
   * @returns result input
   */
  static RotationYawPitchRollToRef(yaw, pitch, roll, result) {
    const halfRoll = roll * 0.5;
    const halfPitch = pitch * 0.5;
    const halfYaw = yaw * 0.5;
    const sinRoll = Math.sin(halfRoll);
    const cosRoll = Math.cos(halfRoll);
    const sinPitch = Math.sin(halfPitch);
    const cosPitch = Math.cos(halfPitch);
    const sinYaw = Math.sin(halfYaw);
    const cosYaw = Math.cos(halfYaw);
    result._x = cosYaw * sinPitch * cosRoll + sinYaw * cosPitch * sinRoll;
    result._y = sinYaw * cosPitch * cosRoll - cosYaw * sinPitch * sinRoll;
    result._z = cosYaw * cosPitch * sinRoll - sinYaw * sinPitch * cosRoll;
    result._w = cosYaw * cosPitch * cosRoll + sinYaw * sinPitch * sinRoll;
    result._isDirty = true;
    return result;
  }
  /**
   * Creates a new quaternion from the given Euler float angles expressed in z-x-z orientation
   * Example Playground https://playground.babylonjs.com/#L49EJ7#68
   * @param alpha defines the rotation around first axis
   * @param beta defines the rotation around second axis
   * @param gamma defines the rotation around third axis
   * @returns the new quaternion
   */
  static RotationAlphaBetaGamma(alpha, beta, gamma) {
    const result = new _Quaternion();
    _Quaternion.RotationAlphaBetaGammaToRef(alpha, beta, gamma, result);
    return result;
  }
  /**
   * Creates a new quaternion from the given Euler float angles expressed in z-x-z orientation and stores it in the target quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#69
   * @param alpha defines the rotation around first axis
   * @param beta defines the rotation around second axis
   * @param gamma defines the rotation around third axis
   * @param result defines the target quaternion
   * @returns result input
   */
  static RotationAlphaBetaGammaToRef(alpha, beta, gamma, result) {
    const halfGammaPlusAlpha = (gamma + alpha) * 0.5;
    const halfGammaMinusAlpha = (gamma - alpha) * 0.5;
    const halfBeta = beta * 0.5;
    result._x = Math.cos(halfGammaMinusAlpha) * Math.sin(halfBeta);
    result._y = Math.sin(halfGammaMinusAlpha) * Math.sin(halfBeta);
    result._z = Math.sin(halfGammaPlusAlpha) * Math.cos(halfBeta);
    result._w = Math.cos(halfGammaPlusAlpha) * Math.cos(halfBeta);
    result._isDirty = true;
    return result;
  }
  /**
   * Creates a new quaternion containing the rotation value to reach the target (axis1, axis2, axis3) orientation as a rotated XYZ system (axis1, axis2 and axis3 are normalized during this operation)
   * Example Playground https://playground.babylonjs.com/#L49EJ7#75
   * @param axis1 defines the first axis
   * @param axis2 defines the second axis
   * @param axis3 defines the third axis
   * @returns the new quaternion
   */
  static RotationQuaternionFromAxis(axis1, axis2, axis3) {
    const quat = new _Quaternion(0, 0, 0, 0);
    _Quaternion.RotationQuaternionFromAxisToRef(axis1, axis2, axis3, quat);
    return quat;
  }
  /**
   * Creates a rotation value to reach the target (axis1, axis2, axis3) orientation as a rotated XYZ system (axis1, axis2 and axis3 are normalized during this operation) and stores it in the target quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#76
   * @param axis1 defines the first axis
   * @param axis2 defines the second axis
   * @param axis3 defines the third axis
   * @param ref defines the target quaternion
   * @returns result input
   */
  static RotationQuaternionFromAxisToRef(axis1, axis2, axis3, ref) {
    const rotMat = MathTmp.Matrix[0];
    Matrix.FromXYZAxesToRef(axis1.normalize(), axis2.normalize(), axis3.normalize(), rotMat);
    _Quaternion.FromRotationMatrixToRef(rotMat, ref);
    return ref;
  }
  /**
   * Creates a new rotation value to orient an object to look towards the given forward direction, the up direction being oriented like "up".
   * This function works in left handed mode
   * Example Playground https://playground.babylonjs.com/#L49EJ7#96
   * @param forward defines the forward direction - Must be normalized and orthogonal to up.
   * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
   * @returns A new quaternion oriented toward the specified forward and up.
   */
  static FromLookDirectionLH(forward, up) {
    const quat = new _Quaternion();
    _Quaternion.FromLookDirectionLHToRef(forward, up, quat);
    return quat;
  }
  /**
   * Creates a new rotation value to orient an object to look towards the given forward direction with the up direction being oriented like "up", and stores it in the target quaternion.
   * This function works in left handed mode
   * Example Playground https://playground.babylonjs.com/#L49EJ7#97
   * @param forward defines the forward direction - Must be normalized and orthogonal to up.
   * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
   * @param ref defines the target quaternion.
   * @returns result input
   */
  static FromLookDirectionLHToRef(forward, up, ref) {
    const rotMat = MathTmp.Matrix[0];
    Matrix.LookDirectionLHToRef(forward, up, rotMat);
    _Quaternion.FromRotationMatrixToRef(rotMat, ref);
    return ref;
  }
  /**
   * Creates a new rotation value to orient an object to look towards the given forward direction, the up direction being oriented like "up".
   * This function works in right handed mode
   * Example Playground https://playground.babylonjs.com/#L49EJ7#98
   * @param forward defines the forward direction - Must be normalized and orthogonal to up.
   * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
   * @returns A new quaternion oriented toward the specified forward and up.
   */
  static FromLookDirectionRH(forward, up) {
    const quat = new _Quaternion();
    _Quaternion.FromLookDirectionRHToRef(forward, up, quat);
    return quat;
  }
  /**
   * Creates a new rotation value to orient an object to look towards the given forward direction with the up direction being oriented like "up", and stores it in the target quaternion.
   * This function works in right handed mode
   * Example Playground https://playground.babylonjs.com/#L49EJ7#105
   * @param forward defines the forward direction - Must be normalized and orthogonal to up.
   * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
   * @param ref defines the target quaternion.
   * @returns result input
   */
  static FromLookDirectionRHToRef(forward, up, ref) {
    const rotMat = MathTmp.Matrix[0];
    Matrix.LookDirectionRHToRef(forward, up, rotMat);
    return _Quaternion.FromRotationMatrixToRef(rotMat, ref);
  }
  /**
   * Interpolates between two quaternions
   * Example Playground https://playground.babylonjs.com/#L49EJ7#79
   * @param left defines first quaternion
   * @param right defines second quaternion
   * @param amount defines the gradient to use
   * @returns the new interpolated quaternion
   */
  static Slerp(left, right, amount) {
    const result = _Quaternion.Identity();
    _Quaternion.SlerpToRef(left, right, amount, result);
    return result;
  }
  /**
   * Interpolates between two quaternions and stores it into a target quaternion
   * Example Playground https://playground.babylonjs.com/#L49EJ7#92
   * @param left defines first quaternion
   * @param right defines second quaternion
   * @param amount defines the gradient to use
   * @param result defines the target quaternion
   * @returns result input
   */
  static SlerpToRef(left, right, amount, result) {
    let num2;
    let num3;
    let num4 = left._x * right._x + left._y * right._y + left._z * right._z + left._w * right._w;
    let flag = false;
    if (num4 < 0) {
      flag = true;
      num4 = -num4;
    }
    if (num4 > 0.999999) {
      num3 = 1 - amount;
      num2 = flag ? -amount : amount;
    } else {
      const num5 = Math.acos(num4);
      const num6 = 1 / Math.sin(num5);
      num3 = Math.sin((1 - amount) * num5) * num6;
      num2 = flag ? -Math.sin(amount * num5) * num6 : Math.sin(amount * num5) * num6;
    }
    result._x = num3 * left._x + num2 * right._x;
    result._y = num3 * left._y + num2 * right._y;
    result._z = num3 * left._z + num2 * right._z;
    result._w = num3 * left._w + num2 * right._w;
    result._isDirty = true;
    return result;
  }
  /**
   * Interpolate between two quaternions using Hermite interpolation
   * Example Playground https://playground.babylonjs.com/#L49EJ7#47
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/drawCurves#hermite-quaternion-spline
   * @param value1 defines first quaternion
   * @param tangent1 defines the incoming tangent
   * @param value2 defines second quaternion
   * @param tangent2 defines the outgoing tangent
   * @param amount defines the target quaternion
   * @returns the new interpolated quaternion
   */
  static Hermite(value1, tangent1, value2, tangent2, amount) {
    const squared = amount * amount;
    const cubed = amount * squared;
    const part1 = 2 * cubed - 3 * squared + 1;
    const part2 = -2 * cubed + 3 * squared;
    const part3 = cubed - 2 * squared + amount;
    const part4 = cubed - squared;
    const x = value1._x * part1 + value2._x * part2 + tangent1._x * part3 + tangent2._x * part4;
    const y = value1._y * part1 + value2._y * part2 + tangent1._y * part3 + tangent2._y * part4;
    const z = value1._z * part1 + value2._z * part2 + tangent1._z * part3 + tangent2._z * part4;
    const w = value1._w * part1 + value2._w * part2 + tangent1._w * part3 + tangent2._w * part4;
    return new _Quaternion(x, y, z, w);
  }
  /**
   * Returns a new Quaternion which is the 1st derivative of the Hermite spline defined by the quaternions "value1", "value2", "tangent1", "tangent2".
   * Example Playground https://playground.babylonjs.com/#L49EJ7#48
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param time define where the derivative must be done
   * @returns 1st derivative
   */
  static Hermite1stDerivative(value1, tangent1, value2, tangent2, time) {
    const result = new _Quaternion();
    this.Hermite1stDerivativeToRef(value1, tangent1, value2, tangent2, time, result);
    return result;
  }
  /**
   * Update a Quaternion with the 1st derivative of the Hermite spline defined by the quaternions "value1", "value2", "tangent1", "tangent2".
   * Example Playground https://playground.babylonjs.com/#L49EJ7#49
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param time define where the derivative must be done
   * @param result define where to store the derivative
   * @returns result input
   */
  static Hermite1stDerivativeToRef(value1, tangent1, value2, tangent2, time, result) {
    const t2 = time * time;
    result._x = (t2 - time) * 6 * value1._x + (3 * t2 - 4 * time + 1) * tangent1._x + (-t2 + time) * 6 * value2._x + (3 * t2 - 2 * time) * tangent2._x;
    result._y = (t2 - time) * 6 * value1._y + (3 * t2 - 4 * time + 1) * tangent1._y + (-t2 + time) * 6 * value2._y + (3 * t2 - 2 * time) * tangent2._y;
    result._z = (t2 - time) * 6 * value1._z + (3 * t2 - 4 * time + 1) * tangent1._z + (-t2 + time) * 6 * value2._z + (3 * t2 - 2 * time) * tangent2._z;
    result._w = (t2 - time) * 6 * value1._w + (3 * t2 - 4 * time + 1) * tangent1._w + (-t2 + time) * 6 * value2._w + (3 * t2 - 2 * time) * tangent2._w;
    result._isDirty = true;
    return result;
  }
  /**
   * Returns a new Quaternion as the normalization of the given Quaternion
   * @param quat defines the Quaternion to normalize
   * @returns the new Quaternion
   */
  static Normalize(quat) {
    const result = _Quaternion.Zero();
    _Quaternion.NormalizeToRef(quat, result);
    return result;
  }
  /**
   * Sets the given Quaternion "result" with the normalization of the given first Quaternion
   * @param quat defines the Quaternion to normalize
   * @param result defines the Quaternion where to store the result
   * @returns result input
   */
  static NormalizeToRef(quat, result) {
    quat.normalizeToRef(result);
    return result;
  }
  /**
   * Returns a new Quaternion set with the coordinates of "value", if the quaternion "value" is in the cube defined by the quaternions "min" and "max"
   * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
   * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
   * @param value defines the current value
   * @param min defines the lower range value
   * @param max defines the upper range value
   * @returns the new Quaternion
   */
  static Clamp(value, min, max) {
    const result = new _Quaternion();
    _Quaternion.ClampToRef(value, min, max, result);
    return result;
  }
  /**
   * Sets the given quaternion "result" with the coordinates of "value", if the quaternion "value" is in the cube defined by the quaternions "min" and "max"
   * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one
   * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one
   * @param value defines the current value
   * @param min defines the lower range value
   * @param max defines the upper range value
   * @param result defines the Quaternion where to store the result
   * @returns result input
   */
  static ClampToRef(value, min, max, result) {
    return result.copyFromFloats(Clamp(value.x, min.x, max.x), Clamp(value.y, min.y, max.y), Clamp(value.z, min.z, max.z), Clamp(value.w, min.w, max.w));
  }
  /**
   * Returns a new Quaternion with random values between min and max
   * @param min the minimum random value
   * @param max the maximum random value
   * @returns a Quaternion with random values between min and max
   */
  static Random(min = 0, max = 1) {
    return new _Quaternion(RandomRange(min, max), RandomRange(min, max), RandomRange(min, max), RandomRange(min, max));
  }
  /**
   * Sets a Quaternion with random values between min and max
   * @param min the minimum random value
   * @param max the maximum random value
   * @param ref the ref to store the values in
   * @returns the ref with random values between min and max
   */
  static RandomToRef(min = 0, max = 1, ref) {
    return ref.copyFromFloats(RandomRange(min, max), RandomRange(min, max), RandomRange(min, max), RandomRange(min, max));
  }
  /**
   * Do not use
   * @internal
   */
  static Minimize() {
    throw new ReferenceError("Quaternion.Minimize does not make sense");
  }
  /**
   * Do not use
   * @internal
   */
  static Maximize() {
    throw new ReferenceError("Quaternion.Maximize does not make sense");
  }
  /**
   * Returns the distance (float) between the quaternions "value1" and "value2".
   * @param value1 value to calulate the distance between
   * @param value2 value to calulate the distance between
   * @returns the distance between the two quaternions
   */
  static Distance(value1, value2) {
    return Math.sqrt(_Quaternion.DistanceSquared(value1, value2));
  }
  /**
   * Returns the squared distance (float) between the quaternions "value1" and "value2".
   * @param value1 value to calulate the distance between
   * @param value2 value to calulate the distance between
   * @returns the distance between the two quaternions squared
   */
  static DistanceSquared(value1, value2) {
    const x = value1.x - value2.x;
    const y = value1.y - value2.y;
    const z = value1.z - value2.z;
    const w = value1.w - value2.w;
    return x * x + y * y + z * z + w * w;
  }
  /**
   * Returns a new Quaternion located at the center between the quaternions "value1" and "value2".
   * @param value1 value to calulate the center between
   * @param value2 value to calulate the center between
   * @returns the center between the two quaternions
   */
  static Center(value1, value2) {
    return _Quaternion.CenterToRef(value1, value2, _Quaternion.Zero());
  }
  /**
   * Gets the center of the quaternions "value1" and "value2" and stores the result in the quaternion "ref"
   * @param value1 defines first quaternion
   * @param value2 defines second quaternion
   * @param ref defines third quaternion
   * @returns ref
   */
  static CenterToRef(value1, value2, ref) {
    return ref.copyFromFloats((value1.x + value2.x) / 2, (value1.y + value2.y) / 2, (value1.z + value2.z) / 2, (value1.w + value2.w) / 2);
  }
};
Object.defineProperties(Quaternion.prototype, {
  dimension: {
    value: [4]
  },
  rank: {
    value: 1
  }
});
var Matrix = class _Matrix {
  /**
   * Gets the precision of matrix computations
   */
  static get Use64Bits() {
    return PerformanceConfigurator.MatrixUse64Bits;
  }
  /**
   * Gets the internal data of the matrix
   */
  get m() {
    return this._m;
  }
  /**
   * Update the updateFlag to indicate that the matrix has been updated
   */
  markAsUpdated() {
    this.updateFlag = _Matrix._UpdateFlagSeed++;
    this._isIdentity = false;
    this._isIdentity3x2 = false;
    this._isIdentityDirty = true;
    this._isIdentity3x2Dirty = true;
  }
  _updateIdentityStatus(isIdentity, isIdentityDirty = false, isIdentity3x2 = false, isIdentity3x2Dirty = true) {
    this._isIdentity = isIdentity;
    this._isIdentity3x2 = isIdentity || isIdentity3x2;
    this._isIdentityDirty = this._isIdentity ? false : isIdentityDirty;
    this._isIdentity3x2Dirty = this._isIdentity3x2 ? false : isIdentity3x2Dirty;
  }
  /**
   * Creates an empty matrix (filled with zeros)
   */
  constructor() {
    this._isIdentity = false;
    this._isIdentityDirty = true;
    this._isIdentity3x2 = true;
    this._isIdentity3x2Dirty = true;
    this.updateFlag = -1;
    if (PerformanceConfigurator.MatrixTrackPrecisionChange) {
      PerformanceConfigurator.MatrixTrackedMatrices.push(this);
    }
    this._m = new PerformanceConfigurator.MatrixCurrentType(16);
    this.markAsUpdated();
  }
  // Properties
  /**
   * Check if the current matrix is identity
   * @returns true is the matrix is the identity matrix
   */
  isIdentity() {
    if (this._isIdentityDirty) {
      this._isIdentityDirty = false;
      const m = this._m;
      this._isIdentity = m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 0 && m[4] === 0 && m[5] === 1 && m[6] === 0 && m[7] === 0 && m[8] === 0 && m[9] === 0 && m[10] === 1 && m[11] === 0 && m[12] === 0 && m[13] === 0 && m[14] === 0 && m[15] === 1;
    }
    return this._isIdentity;
  }
  /**
   * Check if the current matrix is identity as a texture matrix (3x2 store in 4x4)
   * @returns true is the matrix is the identity matrix
   */
  isIdentityAs3x2() {
    if (this._isIdentity3x2Dirty) {
      this._isIdentity3x2Dirty = false;
      if (this._m[0] !== 1 || this._m[5] !== 1 || this._m[15] !== 1) {
        this._isIdentity3x2 = false;
      } else if (this._m[1] !== 0 || this._m[2] !== 0 || this._m[3] !== 0 || this._m[4] !== 0 || this._m[6] !== 0 || this._m[7] !== 0 || this._m[8] !== 0 || this._m[9] !== 0 || this._m[10] !== 0 || this._m[11] !== 0 || this._m[12] !== 0 || this._m[13] !== 0 || this._m[14] !== 0) {
        this._isIdentity3x2 = false;
      } else {
        this._isIdentity3x2 = true;
      }
    }
    return this._isIdentity3x2;
  }
  /**
   * Gets the determinant of the matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#34
   * @returns the matrix determinant
   */
  determinant() {
    if (this._isIdentity === true) {
      return 1;
    }
    const m = this._m;
    const m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3];
    const m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7];
    const m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11];
    const m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
    const det_22_33 = m22 * m33 - m32 * m23;
    const det_21_33 = m21 * m33 - m31 * m23;
    const det_21_32 = m21 * m32 - m31 * m22;
    const det_20_33 = m20 * m33 - m30 * m23;
    const det_20_32 = m20 * m32 - m22 * m30;
    const det_20_31 = m20 * m31 - m30 * m21;
    const cofact_00 = +(m11 * det_22_33 - m12 * det_21_33 + m13 * det_21_32);
    const cofact_01 = -(m10 * det_22_33 - m12 * det_20_33 + m13 * det_20_32);
    const cofact_02 = +(m10 * det_21_33 - m11 * det_20_33 + m13 * det_20_31);
    const cofact_03 = -(m10 * det_21_32 - m11 * det_20_32 + m12 * det_20_31);
    return m00 * cofact_00 + m01 * cofact_01 + m02 * cofact_02 + m03 * cofact_03;
  }
  // Methods
  /**
   * Gets a string with the Matrix values
   * @returns a string with the Matrix values
   */
  toString() {
    return `{${this.m[0]}, ${this.m[1]}, ${this.m[2]}, ${this.m[3]}
${this.m[4]}, ${this.m[5]}, ${this.m[6]}, ${this.m[7]}
${this.m[8]}, ${this.m[9]}, ${this.m[10]}, ${this.m[11]}
${this.m[12]}, ${this.m[13]}, ${this.m[14]}, ${this.m[15]}}`;
  }
  toArray(array = null, index = 0) {
    if (!array) {
      return this._m;
    }
    const m = this._m;
    for (let i = 0; i < 16; i++) {
      array[index + i] = m[i];
    }
    return this;
  }
  /**
   * Returns the matrix as a Float32Array or Array<number>
   * Example Playground - https://playground.babylonjs.com/#AV9X17#114
   * @returns the matrix underlying array.
   */
  asArray() {
    return this._m;
  }
  fromArray(array, index = 0) {
    return _Matrix.FromArrayToRef(array, index, this);
  }
  copyFromFloats(...floats) {
    return _Matrix.FromArrayToRef(floats, 0, this);
  }
  set(...values) {
    const m = this._m;
    for (let i = 0; i < 16; i++) {
      m[i] = values[i];
    }
    this.markAsUpdated();
    return this;
  }
  setAll(value) {
    const m = this._m;
    for (let i = 0; i < 16; i++) {
      m[i] = value;
    }
    this.markAsUpdated();
    return this;
  }
  /**
   * Inverts the current matrix in place
   * Example Playground - https://playground.babylonjs.com/#AV9X17#118
   * @returns the current inverted matrix
   */
  invert() {
    this.invertToRef(this);
    return this;
  }
  /**
   * Sets all the matrix elements to zero
   * @returns the current matrix
   */
  reset() {
    _Matrix.FromValuesToRef(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, this);
    this._updateIdentityStatus(false);
    return this;
  }
  /**
   * Adds the current matrix with a second one
   * Example Playground - https://playground.babylonjs.com/#AV9X17#44
   * @param other defines the matrix to add
   * @returns a new matrix as the addition of the current matrix and the given one
   */
  add(other) {
    const result = new _Matrix();
    this.addToRef(other, result);
    return result;
  }
  /**
   * Sets the given matrix "result" to the addition of the current matrix and the given one
   * Example Playground - https://playground.babylonjs.com/#AV9X17#45
   * @param other defines the matrix to add
   * @param result defines the target matrix
   * @returns result input
   */
  addToRef(other, result) {
    const m = this._m;
    const resultM = result._m;
    const otherM = other.m;
    for (let index = 0; index < 16; index++) {
      resultM[index] = m[index] + otherM[index];
    }
    result.markAsUpdated();
    return result;
  }
  /**
   * Adds in place the given matrix to the current matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#46
   * @param other defines the second operand
   * @returns the current updated matrix
   */
  addToSelf(other) {
    const m = this._m;
    const otherM = other.m;
    m[0] += otherM[0];
    m[1] += otherM[1];
    m[2] += otherM[2];
    m[3] += otherM[3];
    m[4] += otherM[4];
    m[5] += otherM[5];
    m[6] += otherM[6];
    m[7] += otherM[7];
    m[8] += otherM[8];
    m[9] += otherM[9];
    m[10] += otherM[10];
    m[11] += otherM[11];
    m[12] += otherM[12];
    m[13] += otherM[13];
    m[14] += otherM[14];
    m[15] += otherM[15];
    this.markAsUpdated();
    return this;
  }
  addInPlace(other) {
    const m = this._m, otherM = other.m;
    for (let i = 0; i < 16; i++) {
      m[i] += otherM[i];
    }
    this.markAsUpdated();
    return this;
  }
  addInPlaceFromFloats(...floats) {
    const m = this._m;
    for (let i = 0; i < 16; i++) {
      m[i] += floats[i];
    }
    this.markAsUpdated();
    return this;
  }
  subtract(other) {
    const m = this._m, otherM = other.m;
    for (let i = 0; i < 16; i++) {
      m[i] -= otherM[i];
    }
    this.markAsUpdated();
    return this;
  }
  subtractToRef(other, result) {
    const m = this._m, otherM = other.m, resultM = result._m;
    for (let i = 0; i < 16; i++) {
      resultM[i] = m[i] - otherM[i];
    }
    result.markAsUpdated();
    return result;
  }
  subtractInPlace(other) {
    const m = this._m, otherM = other.m;
    for (let i = 0; i < 16; i++) {
      m[i] -= otherM[i];
    }
    this.markAsUpdated();
    return this;
  }
  subtractFromFloats(...floats) {
    return this.subtractFromFloatsToRef(...floats, new _Matrix());
  }
  subtractFromFloatsToRef(...args) {
    const result = args.pop(), m = this._m, resultM = result._m, values = args;
    for (let i = 0; i < 16; i++) {
      resultM[i] = m[i] - values[i];
    }
    result.markAsUpdated();
    return result;
  }
  /**
   * Sets the given matrix to the current inverted Matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#119
   * @param other defines the target matrix
   * @returns result input
   */
  invertToRef(other) {
    if (this._isIdentity === true) {
      _Matrix.IdentityToRef(other);
      return other;
    }
    const m = this._m;
    const m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3];
    const m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7];
    const m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11];
    const m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
    const det_22_33 = m22 * m33 - m32 * m23;
    const det_21_33 = m21 * m33 - m31 * m23;
    const det_21_32 = m21 * m32 - m31 * m22;
    const det_20_33 = m20 * m33 - m30 * m23;
    const det_20_32 = m20 * m32 - m22 * m30;
    const det_20_31 = m20 * m31 - m30 * m21;
    const cofact_00 = +(m11 * det_22_33 - m12 * det_21_33 + m13 * det_21_32);
    const cofact_01 = -(m10 * det_22_33 - m12 * det_20_33 + m13 * det_20_32);
    const cofact_02 = +(m10 * det_21_33 - m11 * det_20_33 + m13 * det_20_31);
    const cofact_03 = -(m10 * det_21_32 - m11 * det_20_32 + m12 * det_20_31);
    const det = m00 * cofact_00 + m01 * cofact_01 + m02 * cofact_02 + m03 * cofact_03;
    if (det === 0) {
      other.copyFrom(this);
      return other;
    }
    const detInv = 1 / det;
    const det_12_33 = m12 * m33 - m32 * m13;
    const det_11_33 = m11 * m33 - m31 * m13;
    const det_11_32 = m11 * m32 - m31 * m12;
    const det_10_33 = m10 * m33 - m30 * m13;
    const det_10_32 = m10 * m32 - m30 * m12;
    const det_10_31 = m10 * m31 - m30 * m11;
    const det_12_23 = m12 * m23 - m22 * m13;
    const det_11_23 = m11 * m23 - m21 * m13;
    const det_11_22 = m11 * m22 - m21 * m12;
    const det_10_23 = m10 * m23 - m20 * m13;
    const det_10_22 = m10 * m22 - m20 * m12;
    const det_10_21 = m10 * m21 - m20 * m11;
    const cofact_10 = -(m01 * det_22_33 - m02 * det_21_33 + m03 * det_21_32);
    const cofact_11 = +(m00 * det_22_33 - m02 * det_20_33 + m03 * det_20_32);
    const cofact_12 = -(m00 * det_21_33 - m01 * det_20_33 + m03 * det_20_31);
    const cofact_13 = +(m00 * det_21_32 - m01 * det_20_32 + m02 * det_20_31);
    const cofact_20 = +(m01 * det_12_33 - m02 * det_11_33 + m03 * det_11_32);
    const cofact_21 = -(m00 * det_12_33 - m02 * det_10_33 + m03 * det_10_32);
    const cofact_22 = +(m00 * det_11_33 - m01 * det_10_33 + m03 * det_10_31);
    const cofact_23 = -(m00 * det_11_32 - m01 * det_10_32 + m02 * det_10_31);
    const cofact_30 = -(m01 * det_12_23 - m02 * det_11_23 + m03 * det_11_22);
    const cofact_31 = +(m00 * det_12_23 - m02 * det_10_23 + m03 * det_10_22);
    const cofact_32 = -(m00 * det_11_23 - m01 * det_10_23 + m03 * det_10_21);
    const cofact_33 = +(m00 * det_11_22 - m01 * det_10_22 + m02 * det_10_21);
    _Matrix.FromValuesToRef(cofact_00 * detInv, cofact_10 * detInv, cofact_20 * detInv, cofact_30 * detInv, cofact_01 * detInv, cofact_11 * detInv, cofact_21 * detInv, cofact_31 * detInv, cofact_02 * detInv, cofact_12 * detInv, cofact_22 * detInv, cofact_32 * detInv, cofact_03 * detInv, cofact_13 * detInv, cofact_23 * detInv, cofact_33 * detInv, other);
    return other;
  }
  /**
   * add a value at the specified position in the current Matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#47
   * @param index the index of the value within the matrix. between 0 and 15.
   * @param value the value to be added
   * @returns the current updated matrix
   */
  addAtIndex(index, value) {
    this._m[index] += value;
    this.markAsUpdated();
    return this;
  }
  /**
   * mutiply the specified position in the current Matrix by a value
   * @param index the index of the value within the matrix. between 0 and 15.
   * @param value the value to be added
   * @returns the current updated matrix
   */
  multiplyAtIndex(index, value) {
    this._m[index] *= value;
    this.markAsUpdated();
    return this;
  }
  /**
   * Inserts the translation vector (using 3 floats) in the current matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#120
   * @param x defines the 1st component of the translation
   * @param y defines the 2nd component of the translation
   * @param z defines the 3rd component of the translation
   * @returns the current updated matrix
   */
  setTranslationFromFloats(x, y, z) {
    this._m[12] = x;
    this._m[13] = y;
    this._m[14] = z;
    this.markAsUpdated();
    return this;
  }
  /**
   * Adds the translation vector (using 3 floats) in the current matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#20
   * Example Playground - https://playground.babylonjs.com/#AV9X17#48
   * @param x defines the 1st component of the translation
   * @param y defines the 2nd component of the translation
   * @param z defines the 3rd component of the translation
   * @returns the current updated matrix
   */
  addTranslationFromFloats(x, y, z) {
    this._m[12] += x;
    this._m[13] += y;
    this._m[14] += z;
    this.markAsUpdated();
    return this;
  }
  /**
   * Inserts the translation vector in the current matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#121
   * @param vector3 defines the translation to insert
   * @returns the current updated matrix
   */
  setTranslation(vector3) {
    return this.setTranslationFromFloats(vector3._x, vector3._y, vector3._z);
  }
  /**
   * Gets the translation value of the current matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#122
   * @returns a new Vector3 as the extracted translation from the matrix
   */
  getTranslation() {
    return new Vector3(this._m[12], this._m[13], this._m[14]);
  }
  /**
   * Fill a Vector3 with the extracted translation from the matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#123
   * @param result defines the Vector3 where to store the translation
   * @returns the current matrix
   */
  getTranslationToRef(result) {
    result.x = this._m[12];
    result.y = this._m[13];
    result.z = this._m[14];
    return result;
  }
  /**
   * Remove rotation and scaling part from the matrix
   * @returns the updated matrix
   */
  removeRotationAndScaling() {
    const m = this.m;
    _Matrix.FromValuesToRef(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, m[12], m[13], m[14], m[15], this);
    this._updateIdentityStatus(m[12] === 0 && m[13] === 0 && m[14] === 0 && m[15] === 1);
    return this;
  }
  /**
   * Copy the current matrix from the given one
   * Example Playground - https://playground.babylonjs.com/#AV9X17#21
   * @param other defines the source matrix
   * @returns the current updated matrix
   */
  copyFrom(other) {
    other.copyToArray(this._m);
    const o = other;
    this.updateFlag = o.updateFlag;
    this._updateIdentityStatus(o._isIdentity, o._isIdentityDirty, o._isIdentity3x2, o._isIdentity3x2Dirty);
    return this;
  }
  /**
   * Populates the given array from the starting index with the current matrix values
   * @param array defines the target array
   * @param offset defines the offset in the target array where to start storing values
   * @returns the current matrix
   */
  copyToArray(array, offset = 0) {
    const source = this._m;
    array[offset] = source[0];
    array[offset + 1] = source[1];
    array[offset + 2] = source[2];
    array[offset + 3] = source[3];
    array[offset + 4] = source[4];
    array[offset + 5] = source[5];
    array[offset + 6] = source[6];
    array[offset + 7] = source[7];
    array[offset + 8] = source[8];
    array[offset + 9] = source[9];
    array[offset + 10] = source[10];
    array[offset + 11] = source[11];
    array[offset + 12] = source[12];
    array[offset + 13] = source[13];
    array[offset + 14] = source[14];
    array[offset + 15] = source[15];
    return this;
  }
  /**
   * Multiply two matrices
   * Example Playground - https://playground.babylonjs.com/#AV9X17#15
   * A.multiply(B) means apply B to A so result is B x A
   * @param other defines the second operand
   * @returns a new matrix set with the multiplication result of the current Matrix and the given one
   */
  multiply(other) {
    const result = new _Matrix();
    this.multiplyToRef(other, result);
    return result;
  }
  /**
   * This method performs component-by-component in-place multiplication, rather than true matrix multiplication.
   * Use multiply or multiplyToRef for matrix multiplication.
   * @param other defines the second operand
   * @returns the current updated matrix
   */
  multiplyInPlace(other) {
    const m = this._m, otherM = other.m;
    for (let i = 0; i < 16; i++) {
      m[i] *= otherM[i];
    }
    this.markAsUpdated();
    return this;
  }
  /**
   * This method performs a component-by-component multiplication of the current matrix with the array of transmitted numbers.
   * Use multiply or multiplyToRef for matrix multiplication.
   * @param floats defines the array of numbers to multiply the matrix by
   * @returns the current updated matrix
   */
  multiplyByFloats(...floats) {
    const m = this._m;
    for (let i = 0; i < 16; i++) {
      m[i] *= floats[i];
    }
    this.markAsUpdated();
    return this;
  }
  /**
   * Multiples the current matrix by the given floats and stores them in the given ref
   * @param args The floats and ref
   * @returns The updated ref
   */
  multiplyByFloatsToRef(...args) {
    const result = args.pop(), m = this._m, resultM = result._m, values = args;
    for (let i = 0; i < 16; i++) {
      resultM[i] = m[i] * values[i];
    }
    result.markAsUpdated();
    return result;
  }
  /**
   * Sets the given matrix "result" with the multiplication result of the current Matrix and the given one
   * A.multiplyToRef(B, R) means apply B to A and store in R and R = B x A
   * Example Playground - https://playground.babylonjs.com/#AV9X17#16
   * @param other defines the second operand
   * @param result defines the matrix where to store the multiplication
   * @returns result input
   */
  multiplyToRef(other, result) {
    if (this._isIdentity) {
      result.copyFrom(other);
      return result;
    }
    if (other._isIdentity) {
      result.copyFrom(this);
      return result;
    }
    this.multiplyToArray(other, result._m, 0);
    result.markAsUpdated();
    return result;
  }
  /**
   * Sets the Float32Array "result" from the given index "offset" with the multiplication of the current matrix and the given one
   * @param other defines the second operand
   * @param result defines the array where to store the multiplication
   * @param offset defines the offset in the target array where to start storing values
   * @returns the current matrix
   */
  multiplyToArray(other, result, offset) {
    const m = this._m;
    const otherM = other.m;
    const tm0 = m[0], tm1 = m[1], tm2 = m[2], tm3 = m[3];
    const tm4 = m[4], tm5 = m[5], tm6 = m[6], tm7 = m[7];
    const tm8 = m[8], tm9 = m[9], tm10 = m[10], tm11 = m[11];
    const tm12 = m[12], tm13 = m[13], tm14 = m[14], tm15 = m[15];
    const om0 = otherM[0], om1 = otherM[1], om2 = otherM[2], om3 = otherM[3];
    const om4 = otherM[4], om5 = otherM[5], om6 = otherM[6], om7 = otherM[7];
    const om8 = otherM[8], om9 = otherM[9], om10 = otherM[10], om11 = otherM[11];
    const om12 = otherM[12], om13 = otherM[13], om14 = otherM[14], om15 = otherM[15];
    result[offset] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12;
    result[offset + 1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13;
    result[offset + 2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14;
    result[offset + 3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15;
    result[offset + 4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12;
    result[offset + 5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13;
    result[offset + 6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14;
    result[offset + 7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15;
    result[offset + 8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12;
    result[offset + 9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13;
    result[offset + 10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14;
    result[offset + 11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15;
    result[offset + 12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12;
    result[offset + 13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13;
    result[offset + 14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14;
    result[offset + 15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15;
    return this;
  }
  divide(other) {
    return this.divideToRef(other, new _Matrix());
  }
  divideToRef(other, result) {
    const m = this._m, otherM = other.m, resultM = result._m;
    for (let i = 0; i < 16; i++) {
      resultM[i] = m[i] / otherM[i];
    }
    result.markAsUpdated();
    return result;
  }
  divideInPlace(other) {
    const m = this._m, otherM = other.m;
    for (let i = 0; i < 16; i++) {
      m[i] /= otherM[i];
    }
    this.markAsUpdated();
    return this;
  }
  minimizeInPlace(other) {
    const m = this._m, otherM = other.m;
    for (let i = 0; i < 16; i++) {
      m[i] = Math.min(m[i], otherM[i]);
    }
    this.markAsUpdated();
    return this;
  }
  minimizeInPlaceFromFloats(...floats) {
    const m = this._m;
    for (let i = 0; i < 16; i++) {
      m[i] = Math.min(m[i], floats[i]);
    }
    this.markAsUpdated();
    return this;
  }
  maximizeInPlace(other) {
    const m = this._m, otherM = other.m;
    for (let i = 0; i < 16; i++) {
      m[i] = Math.min(m[i], otherM[i]);
    }
    this.markAsUpdated();
    return this;
  }
  maximizeInPlaceFromFloats(...floats) {
    const m = this._m;
    for (let i = 0; i < 16; i++) {
      m[i] = Math.min(m[i], floats[i]);
    }
    this.markAsUpdated();
    return this;
  }
  negate() {
    return this.negateToRef(new _Matrix());
  }
  negateInPlace() {
    const m = this._m;
    for (let i = 0; i < 16; i++) {
      m[i] = -m[i];
    }
    this.markAsUpdated();
    return this;
  }
  negateToRef(result) {
    const m = this._m, resultM = result._m;
    for (let i = 0; i < 16; i++) {
      resultM[i] = -m[i];
    }
    result.markAsUpdated();
    return result;
  }
  /**
   * Check equality between this matrix and a second one
   * @param value defines the second matrix to compare
   * @returns true is the current matrix and the given one values are strictly equal
   */
  equals(value) {
    const other = value;
    if (!other) {
      return false;
    }
    if (this._isIdentity || other._isIdentity) {
      if (!this._isIdentityDirty && !other._isIdentityDirty) {
        return this._isIdentity && other._isIdentity;
      }
    }
    const m = this.m;
    const om = other.m;
    return m[0] === om[0] && m[1] === om[1] && m[2] === om[2] && m[3] === om[3] && m[4] === om[4] && m[5] === om[5] && m[6] === om[6] && m[7] === om[7] && m[8] === om[8] && m[9] === om[9] && m[10] === om[10] && m[11] === om[11] && m[12] === om[12] && m[13] === om[13] && m[14] === om[14] && m[15] === om[15];
  }
  equalsWithEpsilon(other, epsilon = 0) {
    const m = this._m, otherM = other.m;
    for (let i = 0; i < 16; i++) {
      if (!WithinEpsilon(m[i], otherM[i], epsilon)) {
        return false;
      }
    }
    return true;
  }
  equalsToFloats(...floats) {
    const m = this._m;
    for (let i = 0; i < 16; i++) {
      if (m[i] != floats[i]) {
        return false;
      }
    }
    return true;
  }
  floor() {
    return this.floorToRef(new _Matrix());
  }
  floorToRef(result) {
    const m = this._m, resultM = result._m;
    for (let i = 0; i < 16; i++) {
      resultM[i] = Math.floor(m[i]);
    }
    result.markAsUpdated();
    return result;
  }
  fract() {
    return this.fractToRef(new _Matrix());
  }
  fractToRef(result) {
    const m = this._m, resultM = result._m;
    for (let i = 0; i < 16; i++) {
      resultM[i] = m[i] - Math.floor(m[i]);
    }
    result.markAsUpdated();
    return result;
  }
  /**
   * Clone the current matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#18
   * @returns a new matrix from the current matrix
   */
  clone() {
    const matrix = new _Matrix();
    matrix.copyFrom(this);
    return matrix;
  }
  /**
   * Returns the name of the current matrix class
   * @returns the string "Matrix"
   */
  getClassName() {
    return "Matrix";
  }
  /**
   * Gets the hash code of the current matrix
   * @returns the hash code
   */
  getHashCode() {
    let hash = _ExtractAsInt(this._m[0]);
    for (let i = 1; i < 16; i++) {
      hash = hash * 397 ^ _ExtractAsInt(this._m[i]);
    }
    return hash;
  }
  /**
   * Decomposes the current Matrix into a translation, rotation and scaling components of the provided node
   * Example Playground - https://playground.babylonjs.com/#AV9X17#13
   * @param node the node to decompose the matrix to
   * @returns true if operation was successful
   */
  decomposeToTransformNode(node) {
    node.rotationQuaternion = node.rotationQuaternion || new Quaternion();
    return this.decompose(node.scaling, node.rotationQuaternion, node.position);
  }
  /**
   * Decomposes the current Matrix into a translation, rotation and scaling components
   * Example Playground - https://playground.babylonjs.com/#AV9X17#12
   * @param scale defines the scale vector3 given as a reference to update
   * @param rotation defines the rotation quaternion given as a reference to update
   * @param translation defines the translation vector3 given as a reference to update
   * @param preserveScalingNode Use scaling sign coming from this node. Otherwise scaling sign might change.
   * @param useAbsoluteScaling Use scaling sign coming from this absoluteScaling when true or scaling otherwise.
   * @returns true if operation was successful
   */
  decompose(scale, rotation, translation, preserveScalingNode, useAbsoluteScaling = true) {
    if (this._isIdentity) {
      if (translation) {
        translation.setAll(0);
      }
      if (scale) {
        scale.setAll(1);
      }
      if (rotation) {
        rotation.copyFromFloats(0, 0, 0, 1);
      }
      return true;
    }
    const m = this._m;
    if (translation) {
      translation.copyFromFloats(m[12], m[13], m[14]);
    }
    scale = scale || MathTmp.Vector3[0];
    scale.x = Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
    scale.y = Math.sqrt(m[4] * m[4] + m[5] * m[5] + m[6] * m[6]);
    scale.z = Math.sqrt(m[8] * m[8] + m[9] * m[9] + m[10] * m[10]);
    if (preserveScalingNode) {
      const signX = (useAbsoluteScaling ? preserveScalingNode.absoluteScaling.x : preserveScalingNode.scaling.x) < 0 ? -1 : 1;
      const signY = (useAbsoluteScaling ? preserveScalingNode.absoluteScaling.y : preserveScalingNode.scaling.y) < 0 ? -1 : 1;
      const signZ = (useAbsoluteScaling ? preserveScalingNode.absoluteScaling.z : preserveScalingNode.scaling.z) < 0 ? -1 : 1;
      scale.x *= signX;
      scale.y *= signY;
      scale.z *= signZ;
    } else {
      if (this.determinant() <= 0) {
        scale.y *= -1;
      }
    }
    if (scale._x === 0 || scale._y === 0 || scale._z === 0) {
      if (rotation) {
        rotation.copyFromFloats(0, 0, 0, 1);
      }
      return false;
    }
    if (rotation) {
      const sx = 1 / scale._x, sy = 1 / scale._y, sz = 1 / scale._z;
      _Matrix.FromValuesToRef(m[0] * sx, m[1] * sx, m[2] * sx, 0, m[4] * sy, m[5] * sy, m[6] * sy, 0, m[8] * sz, m[9] * sz, m[10] * sz, 0, 0, 0, 0, 1, MathTmp.Matrix[0]);
      Quaternion.FromRotationMatrixToRef(MathTmp.Matrix[0], rotation);
    }
    return true;
  }
  /**
   * Gets specific row of the matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#36
   * @param index defines the number of the row to get
   * @returns the index-th row of the current matrix as a new Vector4
   */
  getRow(index) {
    if (index < 0 || index > 3) {
      return null;
    }
    const i = index * 4;
    return new Vector4(this._m[i + 0], this._m[i + 1], this._m[i + 2], this._m[i + 3]);
  }
  /**
   * Gets specific row of the matrix to ref
   * Example Playground - https://playground.babylonjs.com/#AV9X17#36
   * @param index defines the number of the row to get
   * @param rowVector vector to store the index-th row of the current matrix
   * @returns result input
   */
  getRowToRef(index, rowVector) {
    if (index >= 0 && index <= 3) {
      const i = index * 4;
      rowVector.x = this._m[i + 0];
      rowVector.y = this._m[i + 1];
      rowVector.z = this._m[i + 2];
      rowVector.w = this._m[i + 3];
    }
    return rowVector;
  }
  /**
   * Sets the index-th row of the current matrix to the vector4 values
   * Example Playground - https://playground.babylonjs.com/#AV9X17#36
   * @param index defines the number of the row to set
   * @param row defines the target vector4
   * @returns the updated current matrix
   */
  setRow(index, row) {
    return this.setRowFromFloats(index, row.x, row.y, row.z, row.w);
  }
  /**
   * Compute the transpose of the matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#40
   * @returns the new transposed matrix
   */
  transpose() {
    const result = new _Matrix();
    _Matrix.TransposeToRef(this, result);
    return result;
  }
  /**
   * Compute the transpose of the matrix and store it in a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#41
   * @param result defines the target matrix
   * @returns result input
   */
  transposeToRef(result) {
    _Matrix.TransposeToRef(this, result);
    return result;
  }
  /**
   * Sets the index-th row of the current matrix with the given 4 x float values
   * Example Playground - https://playground.babylonjs.com/#AV9X17#36
   * @param index defines the row index
   * @param x defines the x component to set
   * @param y defines the y component to set
   * @param z defines the z component to set
   * @param w defines the w component to set
   * @returns the updated current matrix
   */
  setRowFromFloats(index, x, y, z, w) {
    if (index < 0 || index > 3) {
      return this;
    }
    const i = index * 4;
    this._m[i + 0] = x;
    this._m[i + 1] = y;
    this._m[i + 2] = z;
    this._m[i + 3] = w;
    this.markAsUpdated();
    return this;
  }
  /**
   * Compute a new matrix set with the current matrix values multiplied by scale (float)
   * @param scale defines the scale factor
   * @returns a new matrix
   */
  scale(scale) {
    const result = new _Matrix();
    this.scaleToRef(scale, result);
    return result;
  }
  /**
   * Scale the current matrix values by a factor to a given result matrix
   * @param scale defines the scale factor
   * @param result defines the matrix to store the result
   * @returns result input
   */
  scaleToRef(scale, result) {
    for (let index = 0; index < 16; index++) {
      result._m[index] = this._m[index] * scale;
    }
    result.markAsUpdated();
    return result;
  }
  /**
   * Scale the current matrix values by a factor and add the result to a given matrix
   * @param scale defines the scale factor
   * @param result defines the Matrix to store the result
   * @returns result input
   */
  scaleAndAddToRef(scale, result) {
    for (let index = 0; index < 16; index++) {
      result._m[index] += this._m[index] * scale;
    }
    result.markAsUpdated();
    return result;
  }
  scaleInPlace(scale) {
    const m = this._m;
    for (let i = 0; i < 16; i++) {
      m[i] *= scale;
    }
    this.markAsUpdated();
    return this;
  }
  /**
   * Writes to the given matrix a normal matrix, computed from this one (using values from identity matrix for fourth row and column).
   * Example Playground - https://playground.babylonjs.com/#AV9X17#17
   * @param ref matrix to store the result
   * @returns the reference matrix
   */
  toNormalMatrix(ref) {
    const tmp = MathTmp.Matrix[0];
    this.invertToRef(tmp);
    tmp.transposeToRef(ref);
    const m = ref._m;
    _Matrix.FromValuesToRef(m[0], m[1], m[2], 0, m[4], m[5], m[6], 0, m[8], m[9], m[10], 0, 0, 0, 0, 1, ref);
    return ref;
  }
  /**
   * Gets only rotation part of the current matrix
   * @returns a new matrix sets to the extracted rotation matrix from the current one
   */
  getRotationMatrix() {
    const result = new _Matrix();
    this.getRotationMatrixToRef(result);
    return result;
  }
  /**
   * Extracts the rotation matrix from the current one and sets it as the given "result"
   * @param result defines the target matrix to store data to
   * @returns result input
   */
  getRotationMatrixToRef(result) {
    const scale = MathTmp.Vector3[0];
    if (!this.decompose(scale)) {
      _Matrix.IdentityToRef(result);
      return result;
    }
    const m = this._m;
    const sx = 1 / scale._x, sy = 1 / scale._y, sz = 1 / scale._z;
    _Matrix.FromValuesToRef(m[0] * sx, m[1] * sx, m[2] * sx, 0, m[4] * sy, m[5] * sy, m[6] * sy, 0, m[8] * sz, m[9] * sz, m[10] * sz, 0, 0, 0, 0, 1, result);
    return result;
  }
  /**
   * Toggles model matrix from being right handed to left handed in place and vice versa
   * @returns the current updated matrix
   */
  toggleModelMatrixHandInPlace() {
    const m = this._m;
    m[2] *= -1;
    m[6] *= -1;
    m[8] *= -1;
    m[9] *= -1;
    m[14] *= -1;
    this.markAsUpdated();
    return this;
  }
  /**
   * Toggles projection matrix from being right handed to left handed in place and vice versa
   * @returns the current updated matrix
   */
  toggleProjectionMatrixHandInPlace() {
    const m = this._m;
    m[8] *= -1;
    m[9] *= -1;
    m[10] *= -1;
    m[11] *= -1;
    this.markAsUpdated();
    return this;
  }
  // Statics
  /**
   * Creates a matrix from an array
   * Example Playground - https://playground.babylonjs.com/#AV9X17#42
   * @param array defines the source array
   * @param offset defines an offset in the source array
   * @returns a new Matrix set from the starting index of the given array
   */
  static FromArray(array, offset = 0) {
    const result = new _Matrix();
    _Matrix.FromArrayToRef(array, offset, result);
    return result;
  }
  /**
   * Copy the content of an array into a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#43
   * @param array defines the source array
   * @param offset defines an offset in the source array
   * @param result defines the target matrix
   * @returns result input
   */
  static FromArrayToRef(array, offset, result) {
    for (let index = 0; index < 16; index++) {
      result._m[index] = array[index + offset];
    }
    result.markAsUpdated();
    return result;
  }
  /**
   * Stores an array into a matrix after having multiplied each component by a given factor
   * Example Playground - https://playground.babylonjs.com/#AV9X17#50
   * @param array defines the source array
   * @param offset defines the offset in the source array
   * @param scale defines the scaling factor
   * @param result defines the target matrix
   * @returns result input
   */
  static FromFloat32ArrayToRefScaled(array, offset, scale, result) {
    result._m[0] = array[0 + offset] * scale;
    result._m[1] = array[1 + offset] * scale;
    result._m[2] = array[2 + offset] * scale;
    result._m[3] = array[3 + offset] * scale;
    result._m[4] = array[4 + offset] * scale;
    result._m[5] = array[5 + offset] * scale;
    result._m[6] = array[6 + offset] * scale;
    result._m[7] = array[7 + offset] * scale;
    result._m[8] = array[8 + offset] * scale;
    result._m[9] = array[9 + offset] * scale;
    result._m[10] = array[10 + offset] * scale;
    result._m[11] = array[11 + offset] * scale;
    result._m[12] = array[12 + offset] * scale;
    result._m[13] = array[13 + offset] * scale;
    result._m[14] = array[14 + offset] * scale;
    result._m[15] = array[15 + offset] * scale;
    result.markAsUpdated();
    return result;
  }
  /**
   * Gets an identity matrix that must not be updated
   */
  static get IdentityReadOnly() {
    return _Matrix._IdentityReadOnly;
  }
  /**
   * Stores a list of values (16) inside a given matrix
   * @param initialM11 defines 1st value of 1st row
   * @param initialM12 defines 2nd value of 1st row
   * @param initialM13 defines 3rd value of 1st row
   * @param initialM14 defines 4th value of 1st row
   * @param initialM21 defines 1st value of 2nd row
   * @param initialM22 defines 2nd value of 2nd row
   * @param initialM23 defines 3rd value of 2nd row
   * @param initialM24 defines 4th value of 2nd row
   * @param initialM31 defines 1st value of 3rd row
   * @param initialM32 defines 2nd value of 3rd row
   * @param initialM33 defines 3rd value of 3rd row
   * @param initialM34 defines 4th value of 3rd row
   * @param initialM41 defines 1st value of 4th row
   * @param initialM42 defines 2nd value of 4th row
   * @param initialM43 defines 3rd value of 4th row
   * @param initialM44 defines 4th value of 4th row
   * @param result defines the target matrix
   */
  static FromValuesToRef(initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44, result) {
    const m = result._m;
    m[0] = initialM11;
    m[1] = initialM12;
    m[2] = initialM13;
    m[3] = initialM14;
    m[4] = initialM21;
    m[5] = initialM22;
    m[6] = initialM23;
    m[7] = initialM24;
    m[8] = initialM31;
    m[9] = initialM32;
    m[10] = initialM33;
    m[11] = initialM34;
    m[12] = initialM41;
    m[13] = initialM42;
    m[14] = initialM43;
    m[15] = initialM44;
    result.markAsUpdated();
  }
  /**
   * Creates new matrix from a list of values (16)
   * @param initialM11 defines 1st value of 1st row
   * @param initialM12 defines 2nd value of 1st row
   * @param initialM13 defines 3rd value of 1st row
   * @param initialM14 defines 4th value of 1st row
   * @param initialM21 defines 1st value of 2nd row
   * @param initialM22 defines 2nd value of 2nd row
   * @param initialM23 defines 3rd value of 2nd row
   * @param initialM24 defines 4th value of 2nd row
   * @param initialM31 defines 1st value of 3rd row
   * @param initialM32 defines 2nd value of 3rd row
   * @param initialM33 defines 3rd value of 3rd row
   * @param initialM34 defines 4th value of 3rd row
   * @param initialM41 defines 1st value of 4th row
   * @param initialM42 defines 2nd value of 4th row
   * @param initialM43 defines 3rd value of 4th row
   * @param initialM44 defines 4th value of 4th row
   * @returns the new matrix
   */
  static FromValues(initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44) {
    const result = new _Matrix();
    const m = result._m;
    m[0] = initialM11;
    m[1] = initialM12;
    m[2] = initialM13;
    m[3] = initialM14;
    m[4] = initialM21;
    m[5] = initialM22;
    m[6] = initialM23;
    m[7] = initialM24;
    m[8] = initialM31;
    m[9] = initialM32;
    m[10] = initialM33;
    m[11] = initialM34;
    m[12] = initialM41;
    m[13] = initialM42;
    m[14] = initialM43;
    m[15] = initialM44;
    result.markAsUpdated();
    return result;
  }
  /**
   * Creates a new matrix composed by merging scale (vector3), rotation (quaternion) and translation (vector3)
   * Example Playground - https://playground.babylonjs.com/#AV9X17#24
   * @param scale defines the scale vector3
   * @param rotation defines the rotation quaternion
   * @param translation defines the translation vector3
   * @returns a new matrix
   */
  static Compose(scale, rotation, translation) {
    const result = new _Matrix();
    _Matrix.ComposeToRef(scale, rotation, translation, result);
    return result;
  }
  /**
   * Sets a matrix to a value composed by merging scale (vector3), rotation (quaternion) and translation (vector3)
   * Example Playground - https://playground.babylonjs.com/#AV9X17#25
   * @param scale defines the scale vector3
   * @param rotation defines the rotation quaternion
   * @param translation defines the translation vector3
   * @param result defines the target matrix
   * @returns result input
   */
  static ComposeToRef(scale, rotation, translation, result) {
    const m = result._m;
    const x = rotation._x, y = rotation._y, z = rotation._z, w = rotation._w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;
    const sx = scale._x, sy = scale._y, sz = scale._z;
    m[0] = (1 - (yy + zz)) * sx;
    m[1] = (xy + wz) * sx;
    m[2] = (xz - wy) * sx;
    m[3] = 0;
    m[4] = (xy - wz) * sy;
    m[5] = (1 - (xx + zz)) * sy;
    m[6] = (yz + wx) * sy;
    m[7] = 0;
    m[8] = (xz + wy) * sz;
    m[9] = (yz - wx) * sz;
    m[10] = (1 - (xx + yy)) * sz;
    m[11] = 0;
    m[12] = translation._x;
    m[13] = translation._y;
    m[14] = translation._z;
    m[15] = 1;
    result.markAsUpdated();
    return result;
  }
  /**
   * Creates a new identity matrix
   * @returns a new identity matrix
   */
  static Identity() {
    const identity = _Matrix.FromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    identity._updateIdentityStatus(true);
    return identity;
  }
  /**
   * Creates a new identity matrix and stores the result in a given matrix
   * @param result defines the target matrix
   * @returns result input
   */
  static IdentityToRef(result) {
    _Matrix.FromValuesToRef(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, result);
    result._updateIdentityStatus(true);
    return result;
  }
  /**
   * Creates a new zero matrix
   * @returns a new zero matrix
   */
  static Zero() {
    const zero = _Matrix.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    zero._updateIdentityStatus(false);
    return zero;
  }
  /**
   * Creates a new rotation matrix for "angle" radians around the X axis
   * Example Playground - https://playground.babylonjs.com/#AV9X17#97
   * @param angle defines the angle (in radians) to use
   * @returns the new matrix
   */
  static RotationX(angle) {
    const result = new _Matrix();
    _Matrix.RotationXToRef(angle, result);
    return result;
  }
  /**
   * Creates a new matrix as the invert of a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#124
   * @param source defines the source matrix
   * @returns the new matrix
   */
  static Invert(source) {
    const result = new _Matrix();
    source.invertToRef(result);
    return result;
  }
  /**
   * Creates a new rotation matrix for "angle" radians around the X axis and stores it in a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#98
   * @param angle defines the angle (in radians) to use
   * @param result defines the target matrix
   * @returns result input
   */
  static RotationXToRef(angle, result) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    _Matrix.FromValuesToRef(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, result);
    result._updateIdentityStatus(c === 1 && s === 0);
    return result;
  }
  /**
   * Creates a new rotation matrix for "angle" radians around the Y axis
   * Example Playground - https://playground.babylonjs.com/#AV9X17#99
   * @param angle defines the angle (in radians) to use
   * @returns the new matrix
   */
  static RotationY(angle) {
    const result = new _Matrix();
    _Matrix.RotationYToRef(angle, result);
    return result;
  }
  /**
   * Creates a new rotation matrix for "angle" radians around the Y axis and stores it in a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#100
   * @param angle defines the angle (in radians) to use
   * @param result defines the target matrix
   * @returns result input
   */
  static RotationYToRef(angle, result) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    _Matrix.FromValuesToRef(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1, result);
    result._updateIdentityStatus(c === 1 && s === 0);
    return result;
  }
  /**
   * Creates a new rotation matrix for "angle" radians around the Z axis
   * Example Playground - https://playground.babylonjs.com/#AV9X17#101
   * @param angle defines the angle (in radians) to use
   * @returns the new matrix
   */
  static RotationZ(angle) {
    const result = new _Matrix();
    _Matrix.RotationZToRef(angle, result);
    return result;
  }
  /**
   * Creates a new rotation matrix for "angle" radians around the Z axis and stores it in a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#102
   * @param angle defines the angle (in radians) to use
   * @param result defines the target matrix
   * @returns result input
   */
  static RotationZToRef(angle, result) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    _Matrix.FromValuesToRef(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, result);
    result._updateIdentityStatus(c === 1 && s === 0);
    return result;
  }
  /**
   * Creates a new rotation matrix for "angle" radians around the given axis
   * Example Playground - https://playground.babylonjs.com/#AV9X17#96
   * @param axis defines the axis to use
   * @param angle defines the angle (in radians) to use
   * @returns the new matrix
   */
  static RotationAxis(axis, angle) {
    const result = new _Matrix();
    _Matrix.RotationAxisToRef(axis, angle, result);
    return result;
  }
  /**
   * Creates a new rotation matrix for "angle" radians around the given axis and stores it in a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#94
   * @param axis defines the axis to use
   * @param angle defines the angle (in radians) to use
   * @param result defines the target matrix
   * @returns result input
   */
  static RotationAxisToRef(axis, angle, result) {
    const s = Math.sin(-angle);
    const c = Math.cos(-angle);
    const c1 = 1 - c;
    axis.normalize();
    const m = result._m;
    m[0] = axis._x * axis._x * c1 + c;
    m[1] = axis._x * axis._y * c1 - axis._z * s;
    m[2] = axis._x * axis._z * c1 + axis._y * s;
    m[3] = 0;
    m[4] = axis._y * axis._x * c1 + axis._z * s;
    m[5] = axis._y * axis._y * c1 + c;
    m[6] = axis._y * axis._z * c1 - axis._x * s;
    m[7] = 0;
    m[8] = axis._z * axis._x * c1 - axis._y * s;
    m[9] = axis._z * axis._y * c1 + axis._x * s;
    m[10] = axis._z * axis._z * c1 + c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    result.markAsUpdated();
    return result;
  }
  /**
   * Takes normalised vectors and returns a rotation matrix to align "from" with "to".
   * Taken from http://www.iquilezles.org/www/articles/noacos/noacos.htm
   * Example Playground - https://playground.babylonjs.com/#AV9X17#93
   * @param from defines the vector to align
   * @param to defines the vector to align to
   * @param result defines the target matrix
   * @param useYAxisForCoplanar defines a boolean indicating that we should favor Y axis for coplanar vectors (default is false)
   * @returns result input
   */
  static RotationAlignToRef(from, to, result, useYAxisForCoplanar = false) {
    const c = Vector3.Dot(to, from);
    const m = result._m;
    if (c < -1 + Epsilon) {
      m[0] = -1;
      m[1] = 0;
      m[2] = 0;
      m[3] = 0;
      m[4] = 0;
      m[5] = useYAxisForCoplanar ? 1 : -1;
      m[6] = 0;
      m[7] = 0;
      m[8] = 0;
      m[9] = 0;
      m[10] = useYAxisForCoplanar ? -1 : 1;
      m[11] = 0;
    } else {
      const v = Vector3.Cross(to, from);
      const k = 1 / (1 + c);
      m[0] = v._x * v._x * k + c;
      m[1] = v._y * v._x * k - v._z;
      m[2] = v._z * v._x * k + v._y;
      m[3] = 0;
      m[4] = v._x * v._y * k + v._z;
      m[5] = v._y * v._y * k + c;
      m[6] = v._z * v._y * k - v._x;
      m[7] = 0;
      m[8] = v._x * v._z * k - v._y;
      m[9] = v._y * v._z * k + v._x;
      m[10] = v._z * v._z * k + c;
      m[11] = 0;
    }
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    result.markAsUpdated();
    return result;
  }
  /**
   * Creates a rotation matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#103
   * Example Playground - https://playground.babylonjs.com/#AV9X17#105
   * @param yaw defines the yaw angle in radians (Y axis)
   * @param pitch defines the pitch angle in radians (X axis)
   * @param roll defines the roll angle in radians (Z axis)
   * @returns the new rotation matrix
   */
  static RotationYawPitchRoll(yaw, pitch, roll) {
    const result = new _Matrix();
    _Matrix.RotationYawPitchRollToRef(yaw, pitch, roll, result);
    return result;
  }
  /**
   * Creates a rotation matrix and stores it in a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#104
   * @param yaw defines the yaw angle in radians (Y axis)
   * @param pitch defines the pitch angle in radians (X axis)
   * @param roll defines the roll angle in radians (Z axis)
   * @param result defines the target matrix
   * @returns result input
   */
  static RotationYawPitchRollToRef(yaw, pitch, roll, result) {
    Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, MathTmp.Quaternion[0]);
    MathTmp.Quaternion[0].toRotationMatrix(result);
    return result;
  }
  /**
   * Creates a scaling matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#107
   * @param x defines the scale factor on X axis
   * @param y defines the scale factor on Y axis
   * @param z defines the scale factor on Z axis
   * @returns the new matrix
   */
  static Scaling(x, y, z) {
    const result = new _Matrix();
    _Matrix.ScalingToRef(x, y, z, result);
    return result;
  }
  /**
   * Creates a scaling matrix and stores it in a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#108
   * @param x defines the scale factor on X axis
   * @param y defines the scale factor on Y axis
   * @param z defines the scale factor on Z axis
   * @param result defines the target matrix
   * @returns result input
   */
  static ScalingToRef(x, y, z, result) {
    _Matrix.FromValuesToRef(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1, result);
    result._updateIdentityStatus(x === 1 && y === 1 && z === 1);
    return result;
  }
  /**
   * Creates a translation matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#109
   * @param x defines the translation on X axis
   * @param y defines the translation on Y axis
   * @param z defines the translationon Z axis
   * @returns the new matrix
   */
  static Translation(x, y, z) {
    const result = new _Matrix();
    _Matrix.TranslationToRef(x, y, z, result);
    return result;
  }
  /**
   * Creates a translation matrix and stores it in a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#110
   * @param x defines the translation on X axis
   * @param y defines the translation on Y axis
   * @param z defines the translationon Z axis
   * @param result defines the target matrix
   * @returns result input
   */
  static TranslationToRef(x, y, z, result) {
    _Matrix.FromValuesToRef(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1, result);
    result._updateIdentityStatus(x === 0 && y === 0 && z === 0);
    return result;
  }
  /**
   * Returns a new Matrix whose values are the interpolated values for "gradient" (float) between the ones of the matrices "startValue" and "endValue".
   * Example Playground - https://playground.babylonjs.com/#AV9X17#55
   * @param startValue defines the start value
   * @param endValue defines the end value
   * @param gradient defines the gradient factor
   * @returns the new matrix
   */
  static Lerp(startValue, endValue, gradient) {
    const result = new _Matrix();
    _Matrix.LerpToRef(startValue, endValue, gradient, result);
    return result;
  }
  /**
   * Set the given matrix "result" as the interpolated values for "gradient" (float) between the ones of the matrices "startValue" and "endValue".
   * Example Playground - https://playground.babylonjs.com/#AV9X17#54
   * @param startValue defines the start value
   * @param endValue defines the end value
   * @param gradient defines the gradient factor
   * @param result defines the Matrix object where to store data
   * @returns result input
   */
  static LerpToRef(startValue, endValue, gradient, result) {
    const resultM = result._m;
    const startM = startValue.m;
    const endM = endValue.m;
    for (let index = 0; index < 16; index++) {
      resultM[index] = startM[index] * (1 - gradient) + endM[index] * gradient;
    }
    result.markAsUpdated();
    return result;
  }
  /**
   * Builds a new matrix whose values are computed by:
   * * decomposing the "startValue" and "endValue" matrices into their respective scale, rotation and translation matrices
   * * interpolating for "gradient" (float) the values between each of these decomposed matrices between the start and the end
   * * recomposing a new matrix from these 3 interpolated scale, rotation and translation matrices
   * Example Playground - https://playground.babylonjs.com/#AV9X17#22
   * Example Playground - https://playground.babylonjs.com/#AV9X17#51
   * @param startValue defines the first matrix
   * @param endValue defines the second matrix
   * @param gradient defines the gradient between the two matrices
   * @returns the new matrix
   */
  static DecomposeLerp(startValue, endValue, gradient) {
    const result = new _Matrix();
    _Matrix.DecomposeLerpToRef(startValue, endValue, gradient, result);
    return result;
  }
  /**
   * Update a matrix to values which are computed by:
   * * decomposing the "startValue" and "endValue" matrices into their respective scale, rotation and translation matrices
   * * interpolating for "gradient" (float) the values between each of these decomposed matrices between the start and the end
   * * recomposing a new matrix from these 3 interpolated scale, rotation and translation matrices
   * Example Playground - https://playground.babylonjs.com/#AV9X17#23
   * Example Playground - https://playground.babylonjs.com/#AV9X17#53
   * @param startValue defines the first matrix
   * @param endValue defines the second matrix
   * @param gradient defines the gradient between the two matrices
   * @param result defines the target matrix
   * @returns result input
   */
  static DecomposeLerpToRef(startValue, endValue, gradient, result) {
    const startScale = MathTmp.Vector3[0];
    const startRotation = MathTmp.Quaternion[0];
    const startTranslation = MathTmp.Vector3[1];
    startValue.decompose(startScale, startRotation, startTranslation);
    const endScale = MathTmp.Vector3[2];
    const endRotation = MathTmp.Quaternion[1];
    const endTranslation = MathTmp.Vector3[3];
    endValue.decompose(endScale, endRotation, endTranslation);
    const resultScale = MathTmp.Vector3[4];
    Vector3.LerpToRef(startScale, endScale, gradient, resultScale);
    const resultRotation = MathTmp.Quaternion[2];
    Quaternion.SlerpToRef(startRotation, endRotation, gradient, resultRotation);
    const resultTranslation = MathTmp.Vector3[5];
    Vector3.LerpToRef(startTranslation, endTranslation, gradient, resultTranslation);
    _Matrix.ComposeToRef(resultScale, resultRotation, resultTranslation, result);
    return result;
  }
  /**
   * Creates a new matrix that transforms vertices from world space to camera space. It takes three vectors as arguments that together describe the position and orientation of the camera.
   * This function generates a matrix suitable for a left handed coordinate system
   * Example Playground - https://playground.babylonjs.com/#AV9X17#58
   * Example Playground - https://playground.babylonjs.com/#AV9X17#59
   * @param eye defines the final position of the entity
   * @param target defines where the entity should look at
   * @param up defines the up vector for the entity
   * @returns the new matrix
   */
  static LookAtLH(eye, target, up) {
    const result = new _Matrix();
    _Matrix.LookAtLHToRef(eye, target, up, result);
    return result;
  }
  /**
   * Sets the given "result" Matrix to a matrix that transforms vertices from world space to camera space. It takes three vectors as arguments that together describe the position and orientation of the camera.
   * This function generates a matrix suitable for a left handed coordinate system
   * Example Playground - https://playground.babylonjs.com/#AV9X17#60
   * Example Playground - https://playground.babylonjs.com/#AV9X17#61
   * @param eye defines the final position of the entity
   * @param target defines where the entity should look at
   * @param up defines the up vector for the entity
   * @param result defines the target matrix
   * @returns result input
   */
  static LookAtLHToRef(eye, target, up, result) {
    const xAxis = MathTmp.Vector3[0];
    const yAxis = MathTmp.Vector3[1];
    const zAxis = MathTmp.Vector3[2];
    target.subtractToRef(eye, zAxis);
    zAxis.normalize();
    Vector3.CrossToRef(up, zAxis, xAxis);
    const xSquareLength = xAxis.lengthSquared();
    if (xSquareLength === 0) {
      xAxis.x = 1;
    } else {
      xAxis.normalizeFromLength(Math.sqrt(xSquareLength));
    }
    Vector3.CrossToRef(zAxis, xAxis, yAxis);
    yAxis.normalize();
    const ex = -Vector3.Dot(xAxis, eye);
    const ey = -Vector3.Dot(yAxis, eye);
    const ez = -Vector3.Dot(zAxis, eye);
    _Matrix.FromValuesToRef(xAxis._x, yAxis._x, zAxis._x, 0, xAxis._y, yAxis._y, zAxis._y, 0, xAxis._z, yAxis._z, zAxis._z, 0, ex, ey, ez, 1, result);
    return result;
  }
  /**
   * Creates a new matrix that transforms vertices from world space to camera space. It takes three vectors as arguments that together describe the position and orientation of the camera.
   * This function generates a matrix suitable for a right handed coordinate system
   * Example Playground - https://playground.babylonjs.com/#AV9X17#62
   * Example Playground - https://playground.babylonjs.com/#AV9X17#63
   * @param eye defines the final position of the entity
   * @param target defines where the entity should look at
   * @param up defines the up vector for the entity
   * @returns the new matrix
   */
  static LookAtRH(eye, target, up) {
    const result = new _Matrix();
    _Matrix.LookAtRHToRef(eye, target, up, result);
    return result;
  }
  /**
   * Sets the given "result" Matrix to a matrix that transforms vertices from world space to camera space. It takes three vectors as arguments that together describe the position and orientation of the camera.
   * This function generates a matrix suitable for a right handed coordinate system
   * Example Playground - https://playground.babylonjs.com/#AV9X17#64
   * Example Playground - https://playground.babylonjs.com/#AV9X17#65
   * @param eye defines the final position of the entity
   * @param target defines where the entity should look at
   * @param up defines the up vector for the entity
   * @param result defines the target matrix
   * @returns result input
   */
  static LookAtRHToRef(eye, target, up, result) {
    const xAxis = MathTmp.Vector3[0];
    const yAxis = MathTmp.Vector3[1];
    const zAxis = MathTmp.Vector3[2];
    eye.subtractToRef(target, zAxis);
    zAxis.normalize();
    Vector3.CrossToRef(up, zAxis, xAxis);
    const xSquareLength = xAxis.lengthSquared();
    if (xSquareLength === 0) {
      xAxis.x = 1;
    } else {
      xAxis.normalizeFromLength(Math.sqrt(xSquareLength));
    }
    Vector3.CrossToRef(zAxis, xAxis, yAxis);
    yAxis.normalize();
    const ex = -Vector3.Dot(xAxis, eye);
    const ey = -Vector3.Dot(yAxis, eye);
    const ez = -Vector3.Dot(zAxis, eye);
    _Matrix.FromValuesToRef(xAxis._x, yAxis._x, zAxis._x, 0, xAxis._y, yAxis._y, zAxis._y, 0, xAxis._z, yAxis._z, zAxis._z, 0, ex, ey, ez, 1, result);
    return result;
  }
  /**
   * Creates a new matrix that transforms vertices from world space to camera space. It takes two vectors as arguments that together describe the orientation of the camera. The position is assumed to be at the origin (0,0,0)
   * This function generates a matrix suitable for a left handed coordinate system
   * Example Playground - https://playground.babylonjs.com/#AV9X17#66
   * @param forward defines the forward direction - Must be normalized and orthogonal to up.
   * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
   * @returns the new matrix
   */
  static LookDirectionLH(forward, up) {
    const result = new _Matrix();
    _Matrix.LookDirectionLHToRef(forward, up, result);
    return result;
  }
  /**
   * Sets the given "result" Matrix to a matrix that transforms vertices from world space to camera space. It takes two vectors as arguments that together describe the orientation of the camera. The position is assumed to be at the origin (0,0,0)
   * This function generates a matrix suitable for a left handed coordinate system
   * Example Playground - https://playground.babylonjs.com/#AV9X17#67
   * @param forward defines the forward direction - Must be normalized and orthogonal to up.
   * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
   * @param result defines the target matrix
   * @returns result input
   */
  static LookDirectionLHToRef(forward, up, result) {
    const back = MathTmp.Vector3[0];
    back.copyFrom(forward);
    back.scaleInPlace(-1);
    const left = MathTmp.Vector3[1];
    Vector3.CrossToRef(up, back, left);
    _Matrix.FromValuesToRef(left._x, left._y, left._z, 0, up._x, up._y, up._z, 0, back._x, back._y, back._z, 0, 0, 0, 0, 1, result);
    return result;
  }
  /**
   * Creates a new matrix that transforms vertices from world space to camera space. It takes two vectors as arguments that together describe the orientation of the camera. The position is assumed to be at the origin (0,0,0)
   * This function generates a matrix suitable for a right handed coordinate system
   * Example Playground - https://playground.babylonjs.com/#AV9X17#68
   * @param forward defines the forward direction - Must be normalized and orthogonal to up.
   * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
   * @returns the new matrix
   */
  static LookDirectionRH(forward, up) {
    const result = new _Matrix();
    _Matrix.LookDirectionRHToRef(forward, up, result);
    return result;
  }
  /**
   * Sets the given "result" Matrix to a matrix that transforms vertices from world space to camera space. It takes two vectors as arguments that together describe the orientation of the camera. The position is assumed to be at the origin (0,0,0)
   * This function generates a matrix suitable for a right handed coordinate system
   * Example Playground - https://playground.babylonjs.com/#AV9X17#69
   * @param forward defines the forward direction - Must be normalized and orthogonal to up.
   * @param up defines the up vector for the entity - Must be normalized and orthogonal to forward.
   * @param result defines the target matrix
   * @returns result input
   */
  static LookDirectionRHToRef(forward, up, result) {
    const right = MathTmp.Vector3[2];
    Vector3.CrossToRef(up, forward, right);
    _Matrix.FromValuesToRef(right._x, right._y, right._z, 0, up._x, up._y, up._z, 0, forward._x, forward._y, forward._z, 0, 0, 0, 0, 1, result);
    return result;
  }
  /**
   * Create a left-handed orthographic projection matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#70
   * @param width defines the viewport width
   * @param height defines the viewport height
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @returns a new matrix as a left-handed orthographic projection matrix
   */
  static OrthoLH(width, height, znear, zfar, halfZRange) {
    const matrix = new _Matrix();
    _Matrix.OrthoLHToRef(width, height, znear, zfar, matrix, halfZRange);
    return matrix;
  }
  /**
   * Store a left-handed orthographic projection to a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#71
   * @param width defines the viewport width
   * @param height defines the viewport height
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane
   * @param result defines the target matrix
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @returns result input
   */
  static OrthoLHToRef(width, height, znear, zfar, result, halfZRange) {
    const n = znear;
    const f = zfar;
    const a = 2 / width;
    const b = 2 / height;
    const c = 2 / (f - n);
    const d = -(f + n) / (f - n);
    _Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 0, 0, 0, d, 1, result);
    if (halfZRange) {
      result.multiplyToRef(mtxConvertNDCToHalfZRange, result);
    }
    result._updateIdentityStatus(a === 1 && b === 1 && c === 1 && d === 0);
    return result;
  }
  /**
   * Create a left-handed orthographic projection matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#72
   * @param left defines the viewport left coordinate
   * @param right defines the viewport right coordinate
   * @param bottom defines the viewport bottom coordinate
   * @param top defines the viewport top coordinate
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @returns a new matrix as a left-handed orthographic projection matrix
   */
  static OrthoOffCenterLH(left, right, bottom, top, znear, zfar, halfZRange) {
    const matrix = new _Matrix();
    _Matrix.OrthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, matrix, halfZRange);
    return matrix;
  }
  /**
   * Stores a left-handed orthographic projection into a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#73
   * @param left defines the viewport left coordinate
   * @param right defines the viewport right coordinate
   * @param bottom defines the viewport bottom coordinate
   * @param top defines the viewport top coordinate
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane
   * @param result defines the target matrix
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @returns result input
   */
  static OrthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, result, halfZRange) {
    const n = znear;
    const f = zfar;
    const a = 2 / (right - left);
    const b = 2 / (top - bottom);
    const c = 2 / (f - n);
    const d = -(f + n) / (f - n);
    const i0 = (left + right) / (left - right);
    const i1 = (top + bottom) / (bottom - top);
    _Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 0, i0, i1, d, 1, result);
    if (halfZRange) {
      result.multiplyToRef(mtxConvertNDCToHalfZRange, result);
    }
    result.markAsUpdated();
    return result;
  }
  /**
   * Stores a left-handed oblique projection into a given matrix
   * @param left defines the viewport left coordinate
   * @param right defines the viewport right coordinate
   * @param bottom defines the viewport bottom coordinate
   * @param top defines the viewport top coordinate
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane
   * @param length Length of the shear
   * @param angle Angle (along X/Y Plane) to apply shear
   * @param distance Distance from shear point
   * @param result defines the target matrix
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @returns result input
   */
  static ObliqueOffCenterLHToRef(left, right, bottom, top, znear, zfar, length, angle, distance, result, halfZRange) {
    const a = -length * Math.cos(angle);
    const b = -length * Math.sin(angle);
    _Matrix.TranslationToRef(0, 0, -distance, MathTmp.Matrix[1]);
    _Matrix.FromValuesToRef(1, 0, 0, 0, 0, 1, 0, 0, a, b, 1, 0, 0, 0, 0, 1, MathTmp.Matrix[0]);
    MathTmp.Matrix[1].multiplyToRef(MathTmp.Matrix[0], MathTmp.Matrix[0]);
    _Matrix.TranslationToRef(0, 0, distance, MathTmp.Matrix[1]);
    MathTmp.Matrix[0].multiplyToRef(MathTmp.Matrix[1], MathTmp.Matrix[0]);
    _Matrix.OrthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, result, halfZRange);
    MathTmp.Matrix[0].multiplyToRef(result, result);
    return result;
  }
  /**
   * Creates a right-handed orthographic projection matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#76
   * @param left defines the viewport left coordinate
   * @param right defines the viewport right coordinate
   * @param bottom defines the viewport bottom coordinate
   * @param top defines the viewport top coordinate
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @returns a new matrix as a right-handed orthographic projection matrix
   */
  static OrthoOffCenterRH(left, right, bottom, top, znear, zfar, halfZRange) {
    const matrix = new _Matrix();
    _Matrix.OrthoOffCenterRHToRef(left, right, bottom, top, znear, zfar, matrix, halfZRange);
    return matrix;
  }
  /**
   * Stores a right-handed orthographic projection into a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#77
   * @param left defines the viewport left coordinate
   * @param right defines the viewport right coordinate
   * @param bottom defines the viewport bottom coordinate
   * @param top defines the viewport top coordinate
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane
   * @param result defines the target matrix
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @returns result input
   */
  static OrthoOffCenterRHToRef(left, right, bottom, top, znear, zfar, result, halfZRange) {
    _Matrix.OrthoOffCenterLHToRef(left, right, bottom, top, znear, zfar, result, halfZRange);
    result._m[10] *= -1;
    return result;
  }
  /**
   * Stores a right-handed oblique projection into a given matrix
   * @param left defines the viewport left coordinate
   * @param right defines the viewport right coordinate
   * @param bottom defines the viewport bottom coordinate
   * @param top defines the viewport top coordinate
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane
   * @param length Length of the shear
   * @param angle Angle (along X/Y Plane) to apply shear
   * @param distance Distance from shear point
   * @param result defines the target matrix
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @returns result input
   */
  static ObliqueOffCenterRHToRef(left, right, bottom, top, znear, zfar, length, angle, distance, result, halfZRange) {
    const a = length * Math.cos(angle);
    const b = length * Math.sin(angle);
    _Matrix.TranslationToRef(0, 0, distance, MathTmp.Matrix[1]);
    _Matrix.FromValuesToRef(1, 0, 0, 0, 0, 1, 0, 0, a, b, 1, 0, 0, 0, 0, 1, MathTmp.Matrix[0]);
    MathTmp.Matrix[1].multiplyToRef(MathTmp.Matrix[0], MathTmp.Matrix[0]);
    _Matrix.TranslationToRef(0, 0, -distance, MathTmp.Matrix[1]);
    MathTmp.Matrix[0].multiplyToRef(MathTmp.Matrix[1], MathTmp.Matrix[0]);
    _Matrix.OrthoOffCenterRHToRef(left, right, bottom, top, znear, zfar, result, halfZRange);
    MathTmp.Matrix[0].multiplyToRef(result, result);
    return result;
  }
  /**
   * Creates a left-handed perspective projection matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#85
   * @param width defines the viewport width
   * @param height defines the viewport height
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
   * @returns a new matrix as a left-handed perspective projection matrix
   */
  static PerspectiveLH(width, height, znear, zfar, halfZRange, projectionPlaneTilt = 0) {
    const matrix = new _Matrix();
    const n = znear;
    const f = zfar;
    const a = 2 * n / width;
    const b = 2 * n / height;
    const c = (f + n) / (f - n);
    const d = -2 * f * n / (f - n);
    const rot = Math.tan(projectionPlaneTilt);
    _Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, rot, 0, 0, c, 1, 0, 0, d, 0, matrix);
    if (halfZRange) {
      matrix.multiplyToRef(mtxConvertNDCToHalfZRange, matrix);
    }
    matrix._updateIdentityStatus(false);
    return matrix;
  }
  /**
   * Creates a left-handed perspective projection matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#78
   * @param fov defines the horizontal field of view
   * @param aspect defines the aspect ratio
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane. If 0, assume we are in "infinite zfar" mode
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
   * @param reverseDepthBufferMode true to indicate that we are in a reverse depth buffer mode (meaning znear and zfar have been inverted when calling the function)
   * @returns a new matrix as a left-handed perspective projection matrix
   */
  static PerspectiveFovLH(fov, aspect, znear, zfar, halfZRange, projectionPlaneTilt = 0, reverseDepthBufferMode = false) {
    const matrix = new _Matrix();
    _Matrix.PerspectiveFovLHToRef(fov, aspect, znear, zfar, matrix, true, halfZRange, projectionPlaneTilt, reverseDepthBufferMode);
    return matrix;
  }
  /**
   * Stores a left-handed perspective projection into a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#81
   * @param fov defines the horizontal field of view
   * @param aspect defines the aspect ratio
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane. If 0, assume we are in "infinite zfar" mode
   * @param result defines the target matrix
   * @param isVerticalFovFixed defines it the fov is vertically fixed (default) or horizontally
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
   * @param reverseDepthBufferMode true to indicate that we are in a reverse depth buffer mode (meaning znear and zfar have been inverted when calling the function)
   * @returns result input
   */
  static PerspectiveFovLHToRef(fov, aspect, znear, zfar, result, isVerticalFovFixed = true, halfZRange, projectionPlaneTilt = 0, reverseDepthBufferMode = false) {
    const n = znear;
    const f = zfar;
    const t = 1 / Math.tan(fov * 0.5);
    const a = isVerticalFovFixed ? t / aspect : t;
    const b = isVerticalFovFixed ? t : t * aspect;
    const c = reverseDepthBufferMode && n === 0 ? -1 : f !== 0 ? (f + n) / (f - n) : 1;
    const d = reverseDepthBufferMode && n === 0 ? 2 * f : f !== 0 ? -2 * f * n / (f - n) : -2 * n;
    const rot = Math.tan(projectionPlaneTilt);
    _Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, rot, 0, 0, c, 1, 0, 0, d, 0, result);
    if (halfZRange) {
      result.multiplyToRef(mtxConvertNDCToHalfZRange, result);
    }
    result._updateIdentityStatus(false);
    return result;
  }
  /**
   * Stores a left-handed perspective projection into a given matrix with depth reversed
   * Example Playground - https://playground.babylonjs.com/#AV9X17#89
   * @param fov defines the horizontal field of view
   * @param aspect defines the aspect ratio
   * @param znear defines the near clip plane
   * @param zfar not used as infinity is used as far clip
   * @param result defines the target matrix
   * @param isVerticalFovFixed defines it the fov is vertically fixed (default) or horizontally
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
   * @returns result input
   */
  static PerspectiveFovReverseLHToRef(fov, aspect, znear, zfar, result, isVerticalFovFixed = true, halfZRange, projectionPlaneTilt = 0) {
    const t = 1 / Math.tan(fov * 0.5);
    const a = isVerticalFovFixed ? t / aspect : t;
    const b = isVerticalFovFixed ? t : t * aspect;
    const rot = Math.tan(projectionPlaneTilt);
    _Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, rot, 0, 0, -znear, 1, 0, 0, 1, 0, result);
    if (halfZRange) {
      result.multiplyToRef(mtxConvertNDCToHalfZRange, result);
    }
    result._updateIdentityStatus(false);
    return result;
  }
  /**
   * Creates a right-handed perspective projection matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#83
   * @param fov defines the horizontal field of view
   * @param aspect defines the aspect ratio
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane. If 0, assume we are in "infinite zfar" mode
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
   * @param reverseDepthBufferMode true to indicate that we are in a reverse depth buffer mode (meaning znear and zfar have been inverted when calling the function)
   * @returns a new matrix as a right-handed perspective projection matrix
   */
  static PerspectiveFovRH(fov, aspect, znear, zfar, halfZRange, projectionPlaneTilt = 0, reverseDepthBufferMode = false) {
    const matrix = new _Matrix();
    _Matrix.PerspectiveFovRHToRef(fov, aspect, znear, zfar, matrix, true, halfZRange, projectionPlaneTilt, reverseDepthBufferMode);
    return matrix;
  }
  /**
   * Stores a right-handed perspective projection into a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#84
   * @param fov defines the horizontal field of view
   * @param aspect defines the aspect ratio
   * @param znear defines the near clip plane
   * @param zfar defines the far clip plane. If 0, assume we are in "infinite zfar" mode
   * @param result defines the target matrix
   * @param isVerticalFovFixed defines it the fov is vertically fixed (default) or horizontally
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
   * @param reverseDepthBufferMode true to indicate that we are in a reverse depth buffer mode (meaning znear and zfar have been inverted when calling the function)
   * @returns result input
   */
  static PerspectiveFovRHToRef(fov, aspect, znear, zfar, result, isVerticalFovFixed = true, halfZRange, projectionPlaneTilt = 0, reverseDepthBufferMode = false) {
    const n = znear;
    const f = zfar;
    const t = 1 / Math.tan(fov * 0.5);
    const a = isVerticalFovFixed ? t / aspect : t;
    const b = isVerticalFovFixed ? t : t * aspect;
    const c = reverseDepthBufferMode && n === 0 ? 1 : f !== 0 ? -(f + n) / (f - n) : -1;
    const d = reverseDepthBufferMode && n === 0 ? 2 * f : f !== 0 ? -2 * f * n / (f - n) : -2 * n;
    const rot = Math.tan(projectionPlaneTilt);
    _Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, rot, 0, 0, c, -1, 0, 0, d, 0, result);
    if (halfZRange) {
      result.multiplyToRef(mtxConvertNDCToHalfZRange, result);
    }
    result._updateIdentityStatus(false);
    return result;
  }
  /**
   * Stores a right-handed perspective projection into a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#90
   * @param fov defines the horizontal field of view
   * @param aspect defines the aspect ratio
   * @param znear defines the near clip plane
   * @param zfar not used as infinity is used as far clip
   * @param result defines the target matrix
   * @param isVerticalFovFixed defines it the fov is vertically fixed (default) or horizontally
   * @param halfZRange true to generate NDC coordinates between 0 and 1 instead of -1 and 1 (default: false)
   * @param projectionPlaneTilt optional tilt angle of the projection plane around the X axis (horizontal)
   * @returns result input
   */
  static PerspectiveFovReverseRHToRef(fov, aspect, znear, zfar, result, isVerticalFovFixed = true, halfZRange, projectionPlaneTilt = 0) {
    const t = 1 / Math.tan(fov * 0.5);
    const a = isVerticalFovFixed ? t / aspect : t;
    const b = isVerticalFovFixed ? t : t * aspect;
    const rot = Math.tan(projectionPlaneTilt);
    _Matrix.FromValuesToRef(a, 0, 0, 0, 0, b, 0, rot, 0, 0, -znear, -1, 0, 0, -1, 0, result);
    if (halfZRange) {
      result.multiplyToRef(mtxConvertNDCToHalfZRange, result);
    }
    result._updateIdentityStatus(false);
    return result;
  }
  /**
   * Computes a complete transformation matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#113
   * @param viewport defines the viewport to use
   * @param world defines the world matrix
   * @param view defines the view matrix
   * @param projection defines the projection matrix
   * @param zmin defines the near clip plane
   * @param zmax defines the far clip plane
   * @returns the transformation matrix
   */
  static GetFinalMatrix(viewport, world, view, projection, zmin, zmax) {
    const cw = viewport.width;
    const ch = viewport.height;
    const cx = viewport.x;
    const cy = viewport.y;
    const viewportMatrix = _Matrix.FromValues(cw / 2, 0, 0, 0, 0, -ch / 2, 0, 0, 0, 0, zmax - zmin, 0, cx + cw / 2, ch / 2 + cy, zmin, 1);
    const matrix = new _Matrix();
    world.multiplyToRef(view, matrix);
    matrix.multiplyToRef(projection, matrix);
    return matrix.multiplyToRef(viewportMatrix, matrix);
  }
  /**
   * Extracts a 2x2 matrix from a given matrix and store the result in a Float32Array
   * @param matrix defines the matrix to use
   * @returns a new Float32Array array with 4 elements : the 2x2 matrix extracted from the given matrix
   */
  static GetAsMatrix2x2(matrix) {
    const m = matrix.m;
    const arr = [m[0], m[1], m[4], m[5]];
    return PerformanceConfigurator.MatrixUse64Bits ? arr : new Float32Array(arr);
  }
  /**
   * Extracts a 3x3 matrix from a given matrix and store the result in a Float32Array
   * @param matrix defines the matrix to use
   * @returns a new Float32Array array with 9 elements : the 3x3 matrix extracted from the given matrix
   */
  static GetAsMatrix3x3(matrix) {
    const m = matrix.m;
    const arr = [m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]];
    return PerformanceConfigurator.MatrixUse64Bits ? arr : new Float32Array(arr);
  }
  /**
   * Compute the transpose of a given matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#111
   * @param matrix defines the matrix to transpose
   * @returns the new matrix
   */
  static Transpose(matrix) {
    const result = new _Matrix();
    _Matrix.TransposeToRef(matrix, result);
    return result;
  }
  /**
   * Compute the transpose of a matrix and store it in a target matrix
   * Example Playground - https://playground.babylonjs.com/#AV9X17#112
   * @param matrix defines the matrix to transpose
   * @param result defines the target matrix
   * @returns result input
   */
  static TransposeToRef(matrix, result) {
    const mm = matrix.m;
    const rm0 = mm[0];
    const rm1 = mm[4];
    const rm2 = mm[8];
    const rm3 = mm[12];
    const rm4 = mm[1];
    const rm5 = mm[5];
    const rm6 = mm[9];
    const rm7 = mm[13];
    const rm8 = mm[2];
    const rm9 = mm[6];
    const rm10 = mm[10];
    const rm11 = mm[14];
    const rm12 = mm[3];
    const rm13 = mm[7];
    const rm14 = mm[11];
    const rm15 = mm[15];
    const rm = result._m;
    rm[0] = rm0;
    rm[1] = rm1;
    rm[2] = rm2;
    rm[3] = rm3;
    rm[4] = rm4;
    rm[5] = rm5;
    rm[6] = rm6;
    rm[7] = rm7;
    rm[8] = rm8;
    rm[9] = rm9;
    rm[10] = rm10;
    rm[11] = rm11;
    rm[12] = rm12;
    rm[13] = rm13;
    rm[14] = rm14;
    rm[15] = rm15;
    result.markAsUpdated();
    result._updateIdentityStatus(matrix._isIdentity, matrix._isIdentityDirty);
    return result;
  }
  /**
   * Computes a reflection matrix from a plane
   * Example Playground - https://playground.babylonjs.com/#AV9X17#87
   * @param plane defines the reflection plane
   * @returns a new matrix
   */
  static Reflection(plane) {
    const matrix = new _Matrix();
    _Matrix.ReflectionToRef(plane, matrix);
    return matrix;
  }
  /**
   * Computes a reflection matrix from a plane
   * Example Playground - https://playground.babylonjs.com/#AV9X17#88
   * @param plane defines the reflection plane
   * @param result defines the target matrix
   * @returns result input
   */
  static ReflectionToRef(plane, result) {
    plane.normalize();
    const x = plane.normal.x;
    const y = plane.normal.y;
    const z = plane.normal.z;
    const temp = -2 * x;
    const temp2 = -2 * y;
    const temp3 = -2 * z;
    _Matrix.FromValuesToRef(temp * x + 1, temp2 * x, temp3 * x, 0, temp * y, temp2 * y + 1, temp3 * y, 0, temp * z, temp2 * z, temp3 * z + 1, 0, temp * plane.d, temp2 * plane.d, temp3 * plane.d, 1, result);
    return result;
  }
  /**
   * Sets the given matrix as a rotation matrix composed from the 3 left handed axes
   * @param xaxis defines the value of the 1st axis
   * @param yaxis defines the value of the 2nd axis
   * @param zaxis defines the value of the 3rd axis
   * @param result defines the target matrix
   * @returns result input
   */
  static FromXYZAxesToRef(xaxis, yaxis, zaxis, result) {
    _Matrix.FromValuesToRef(xaxis._x, xaxis._y, xaxis._z, 0, yaxis._x, yaxis._y, yaxis._z, 0, zaxis._x, zaxis._y, zaxis._z, 0, 0, 0, 0, 1, result);
    return result;
  }
  /**
   * Creates a rotation matrix from a quaternion and stores it in a target matrix
   * @param quat defines the quaternion to use
   * @param result defines the target matrix
   * @returns result input
   */
  static FromQuaternionToRef(quat, result) {
    const xx = quat._x * quat._x;
    const yy = quat._y * quat._y;
    const zz = quat._z * quat._z;
    const xy = quat._x * quat._y;
    const zw = quat._z * quat._w;
    const zx = quat._z * quat._x;
    const yw = quat._y * quat._w;
    const yz = quat._y * quat._z;
    const xw = quat._x * quat._w;
    result._m[0] = 1 - 2 * (yy + zz);
    result._m[1] = 2 * (xy + zw);
    result._m[2] = 2 * (zx - yw);
    result._m[3] = 0;
    result._m[4] = 2 * (xy - zw);
    result._m[5] = 1 - 2 * (zz + xx);
    result._m[6] = 2 * (yz + xw);
    result._m[7] = 0;
    result._m[8] = 2 * (zx + yw);
    result._m[9] = 2 * (yz - xw);
    result._m[10] = 1 - 2 * (yy + xx);
    result._m[11] = 0;
    result._m[12] = 0;
    result._m[13] = 0;
    result._m[14] = 0;
    result._m[15] = 1;
    result.markAsUpdated();
    return result;
  }
};
Matrix._UpdateFlagSeed = 0;
Matrix._IdentityReadOnly = Matrix.Identity();
Object.defineProperties(Matrix.prototype, {
  dimension: {
    value: [4, 4]
  },
  rank: {
    value: 2
  }
});
var MathTmp = class {
};
MathTmp.Vector3 = BuildTuple(11, Vector3.Zero);
MathTmp.Matrix = BuildTuple(2, Matrix.Identity);
MathTmp.Quaternion = BuildTuple(3, Quaternion.Zero);
var TmpVectors = class {
};
TmpVectors.Vector2 = BuildTuple(3, Vector2.Zero);
TmpVectors.Vector3 = BuildTuple(13, Vector3.Zero);
TmpVectors.Vector4 = BuildTuple(3, Vector4.Zero);
TmpVectors.Quaternion = BuildTuple(3, Quaternion.Zero);
TmpVectors.Matrix = BuildTuple(8, Matrix.Identity);
RegisterClass("BABYLON.Vector2", Vector2);
RegisterClass("BABYLON.Vector3", Vector3);
RegisterClass("BABYLON.Vector4", Vector4);
RegisterClass("BABYLON.Matrix", Matrix);
var mtxConvertNDCToHalfZRange = Matrix.FromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0.5, 0, 0, 0, 0.5, 1);

// node_modules/@babylonjs/core/Buffers/dataBuffer.js
var DataBuffer = class _DataBuffer {
  /**
   * Gets the underlying buffer
   */
  get underlyingResource() {
    return null;
  }
  /**
   * Constructs the buffer
   */
  constructor() {
    this.references = 0;
    this.capacity = 0;
    this.is32Bits = false;
    this.uniqueId = _DataBuffer._Counter++;
  }
};
DataBuffer._Counter = 0;

// node_modules/@babylonjs/core/Misc/logger.js
var Logger = class _Logger {
  static _CheckLimit(message, limit) {
    let entry = _Logger._LogLimitOutputs[message];
    if (!entry) {
      entry = {
        limit,
        current: 1
      };
      _Logger._LogLimitOutputs[message] = entry;
    } else {
      entry.current++;
    }
    return entry.current <= entry.limit;
  }
  static _GenerateLimitMessage(message, level = 1) {
    const entry = _Logger._LogLimitOutputs[message];
    if (!entry || !_Logger.MessageLimitReached) {
      return;
    }
    const type = this._Levels[level];
    if (entry.current === entry.limit) {
      _Logger[type.name](_Logger.MessageLimitReached.replace(/%LIMIT%/g, "" + entry.limit).replace(/%TYPE%/g, type.name ?? ""));
    }
  }
  static _AddLogEntry(entry) {
    _Logger._LogCache = entry + _Logger._LogCache;
    if (_Logger.OnNewCacheEntry) {
      _Logger.OnNewCacheEntry(entry);
    }
  }
  static _FormatMessage(message) {
    const padStr = (i) => i < 10 ? "0" + i : "" + i;
    const date = /* @__PURE__ */ new Date();
    return "[" + padStr(date.getHours()) + ":" + padStr(date.getMinutes()) + ":" + padStr(date.getSeconds()) + "]: " + message;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static _LogDisabled(message, limit) {
  }
  static _LogEnabled(level = 1, message, limit) {
    const msg = Array.isArray(message) ? message[0] : message;
    if (limit !== void 0 && !_Logger._CheckLimit(msg, limit)) {
      return;
    }
    const formattedMessage = _Logger._FormatMessage(msg);
    const type = this._Levels[level];
    const optionals = Array.isArray(message) ? message.slice(1) : [];
    type.logFunc && type.logFunc("BJS - " + formattedMessage, ...optionals);
    const entry = `<div style='color:${type.color}'>${formattedMessage}</div><br>`;
    _Logger._AddLogEntry(entry);
    _Logger._GenerateLimitMessage(msg, level);
  }
  /**
   * Gets current log cache (list of logs)
   */
  static get LogCache() {
    return _Logger._LogCache;
  }
  /**
   * Clears the log cache
   */
  static ClearLogCache() {
    _Logger._LogCache = "";
    _Logger._LogLimitOutputs = {};
    _Logger.errorsCount = 0;
  }
  /**
   * Sets the current log level (MessageLogLevel / WarningLogLevel / ErrorLogLevel)
   */
  static set LogLevels(level) {
    _Logger.Log = _Logger._LogDisabled;
    _Logger.Warn = _Logger._LogDisabled;
    _Logger.Error = _Logger._LogDisabled;
    [_Logger.MessageLogLevel, _Logger.WarningLogLevel, _Logger.ErrorLogLevel].forEach((l) => {
      if ((level & l) === l) {
        const type = this._Levels[l];
        _Logger[type.name] = _Logger._LogEnabled.bind(_Logger, l);
      }
    });
  }
};
Logger.NoneLogLevel = 0;
Logger.MessageLogLevel = 1;
Logger.WarningLogLevel = 2;
Logger.ErrorLogLevel = 4;
Logger.AllLogLevel = 7;
Logger.MessageLimitReached = "Too many %TYPE%s (%LIMIT%), no more %TYPE%s will be reported for this message.";
Logger._LogCache = "";
Logger._LogLimitOutputs = {};
Logger._Levels = [{}, {
  color: "white",
  logFunc: console.log,
  name: "Log"
}, {
  color: "orange",
  logFunc: console.warn,
  name: "Warn"
}, {}, {
  color: "red",
  logFunc: console.error,
  name: "Error"
}];
Logger.errorsCount = 0;
Logger.Log = Logger._LogEnabled.bind(Logger, Logger.MessageLogLevel);
Logger.Warn = Logger._LogEnabled.bind(Logger, Logger.WarningLogLevel);
Logger.Error = Logger._LogEnabled.bind(Logger, Logger.ErrorLogLevel);

// node_modules/@babylonjs/core/Buffers/buffer.js
var Buffer = class {
  /**
   * Gets a boolean indicating if the Buffer is disposed
   */
  get isDisposed() {
    return this._isDisposed;
  }
  /**
   * Constructor
   * @param engine the engine
   * @param data the data to use for this buffer
   * @param updatable whether the data is updatable
   * @param stride the stride (optional)
   * @param postponeInternalCreation whether to postpone creating the internal WebGL buffer (optional)
   * @param instanced whether the buffer is instanced (optional)
   * @param useBytes set to true if the stride in in bytes (optional)
   * @param divisor sets an optional divisor for instances (1 by default)
   * @param label defines the label of the buffer (for debug purpose)
   */
  constructor(engine, data, updatable, stride = 0, postponeInternalCreation = false, instanced = false, useBytes = false, divisor, label) {
    this._isAlreadyOwned = false;
    this._isDisposed = false;
    if (engine && engine.getScene) {
      this._engine = engine.getScene().getEngine();
    } else {
      this._engine = engine;
    }
    this._updatable = updatable;
    this._instanced = instanced;
    this._divisor = divisor || 1;
    this._label = label;
    if (data instanceof DataBuffer) {
      this._data = null;
      this._buffer = data;
    } else {
      this._data = data;
      this._buffer = null;
    }
    this.byteStride = useBytes ? stride : stride * Float32Array.BYTES_PER_ELEMENT;
    if (!postponeInternalCreation) {
      this.create();
    }
  }
  /**
   * Create a new VertexBuffer based on the current buffer
   * @param kind defines the vertex buffer kind (position, normal, etc.)
   * @param offset defines offset in the buffer (0 by default)
   * @param size defines the size in floats of attributes (position is 3 for instance)
   * @param stride defines the stride size in floats in the buffer (the offset to apply to reach next value when data is interleaved)
   * @param instanced defines if the vertex buffer contains indexed data
   * @param useBytes defines if the offset and stride are in bytes     *
   * @param divisor sets an optional divisor for instances (1 by default)
   * @returns the new vertex buffer
   */
  createVertexBuffer(kind, offset, size, stride, instanced, useBytes = false, divisor) {
    const byteOffset = useBytes ? offset : offset * Float32Array.BYTES_PER_ELEMENT;
    const byteStride = stride ? useBytes ? stride : stride * Float32Array.BYTES_PER_ELEMENT : this.byteStride;
    return new VertexBuffer(this._engine, this, kind, this._updatable, true, byteStride, instanced === void 0 ? this._instanced : instanced, byteOffset, size, void 0, void 0, true, this._divisor || divisor);
  }
  // Properties
  /**
   * Gets a boolean indicating if the Buffer is updatable?
   * @returns true if the buffer is updatable
   */
  isUpdatable() {
    return this._updatable;
  }
  /**
   * Gets current buffer's data
   * @returns a DataArray or null
   */
  getData() {
    return this._data;
  }
  /**
   * Gets underlying native buffer
   * @returns underlying native buffer
   */
  getBuffer() {
    return this._buffer;
  }
  /**
   * Gets the stride in float32 units (i.e. byte stride / 4).
   * May not be an integer if the byte stride is not divisible by 4.
   * @returns the stride in float32 units
   * @deprecated Please use byteStride instead.
   */
  getStrideSize() {
    return this.byteStride / Float32Array.BYTES_PER_ELEMENT;
  }
  // Methods
  /**
   * Store data into the buffer. Creates the buffer if not used already.
   * If the buffer was already used, it will be updated only if it is updatable, otherwise it will do nothing.
   * @param data defines the data to store
   */
  create(data = null) {
    if (!data && this._buffer) {
      return;
    }
    data = data || this._data;
    if (!data) {
      return;
    }
    if (!this._buffer) {
      if (this._updatable) {
        this._buffer = this._engine.createDynamicVertexBuffer(data, this._label);
        this._data = data;
      } else {
        this._buffer = this._engine.createVertexBuffer(data, void 0, this._label);
      }
    } else if (this._updatable) {
      this._engine.updateDynamicVertexBuffer(this._buffer, data);
      this._data = data;
    }
  }
  /** @internal */
  _rebuild() {
    if (!this._data) {
      if (!this._buffer) {
        return;
      }
      if (this._buffer.capacity > 0) {
        if (this._updatable) {
          this._buffer = this._engine.createDynamicVertexBuffer(this._buffer.capacity, this._label);
        } else {
          this._buffer = this._engine.createVertexBuffer(this._buffer.capacity, void 0, this._label);
        }
        return;
      }
      Logger.Warn(`Missing data for buffer "${this._label}" ${this._buffer ? "(uniqueId: " + this._buffer.uniqueId + ")" : ""}. Buffer reconstruction failed.`);
      this._buffer = null;
    } else {
      this._buffer = null;
      this.create(this._data);
    }
  }
  /**
   * Update current buffer data
   * @param data defines the data to store
   */
  update(data) {
    this.create(data);
  }
  /**
   * Updates the data directly.
   * @param data the new data
   * @param offset the new offset
   * @param vertexCount the vertex count (optional)
   * @param useBytes set to true if the offset is in bytes
   */
  updateDirectly(data, offset, vertexCount, useBytes = false) {
    if (!this._buffer) {
      return;
    }
    if (this._updatable) {
      this._engine.updateDynamicVertexBuffer(this._buffer, data, useBytes ? offset : offset * Float32Array.BYTES_PER_ELEMENT, vertexCount ? vertexCount * this.byteStride : void 0);
      if (offset === 0 && vertexCount === void 0) {
        this._data = data;
      } else {
        this._data = null;
      }
    }
  }
  /** @internal */
  _increaseReferences() {
    if (!this._buffer) {
      return;
    }
    if (!this._isAlreadyOwned) {
      this._isAlreadyOwned = true;
      return;
    }
    this._buffer.references++;
  }
  /**
   * Release all resources
   */
  dispose() {
    if (!this._buffer) {
      return;
    }
    if (this._engine._releaseBuffer(this._buffer)) {
      this._isDisposed = true;
      this._data = null;
      this._buffer = null;
    }
  }
};
var VertexBuffer = class _VertexBuffer {
  /**
   * Gets a boolean indicating if the Buffer is disposed
   */
  get isDisposed() {
    return this._isDisposed;
  }
  /**
   * Gets or sets the instance divisor when in instanced mode
   */
  get instanceDivisor() {
    return this._instanceDivisor;
  }
  set instanceDivisor(value) {
    const isInstanced = value != 0;
    this._instanceDivisor = value;
    if (isInstanced !== this._instanced) {
      this._instanced = isInstanced;
      this._computeHashCode();
    }
  }
  /**
   * Gets the max possible amount of vertices stored within the current vertex buffer.
   * We do not have the end offset or count so this will be too big for concatenated vertex buffers.
   * @internal
   */
  get _maxVerticesCount() {
    const data = this.getData();
    if (!data) {
      return 0;
    }
    if (Array.isArray(data)) {
      return data.length / (this.byteStride / 4) - this.byteOffset / 4;
    }
    return (data.byteLength - this.byteOffset) / this.byteStride;
  }
  /** @internal */
  constructor(engine, data, kind, updatableOrOptions, postponeInternalCreation, stride, instanced, offset, size, type, normalized = false, useBytes = false, divisor = 1, takeBufferOwnership = false) {
    this._isDisposed = false;
    let updatable = false;
    this.engine = engine;
    if (typeof updatableOrOptions === "object" && updatableOrOptions !== null) {
      updatable = updatableOrOptions.updatable ?? false;
      postponeInternalCreation = updatableOrOptions.postponeInternalCreation;
      stride = updatableOrOptions.stride;
      instanced = updatableOrOptions.instanced;
      offset = updatableOrOptions.offset;
      size = updatableOrOptions.size;
      type = updatableOrOptions.type;
      normalized = updatableOrOptions.normalized ?? false;
      useBytes = updatableOrOptions.useBytes ?? false;
      divisor = updatableOrOptions.divisor ?? 1;
      takeBufferOwnership = updatableOrOptions.takeBufferOwnership ?? false;
      this._label = updatableOrOptions.label;
    } else {
      updatable = !!updatableOrOptions;
    }
    if (data instanceof Buffer) {
      this._buffer = data;
      this._ownsBuffer = takeBufferOwnership;
    } else {
      this._buffer = new Buffer(engine, data, updatable, stride, postponeInternalCreation, instanced, useBytes, divisor, this._label);
      this._ownsBuffer = true;
    }
    this.uniqueId = _VertexBuffer._Counter++;
    this._kind = kind;
    if (type === void 0) {
      const vertexData = this.getData();
      this.type = vertexData ? _VertexBuffer.GetDataType(vertexData) : _VertexBuffer.FLOAT;
    } else {
      this.type = type;
    }
    const typeByteLength = _VertexBuffer.GetTypeByteLength(this.type);
    if (useBytes) {
      this._size = size || (stride ? stride / typeByteLength : _VertexBuffer.DeduceStride(kind));
      this.byteStride = stride || this._buffer.byteStride || this._size * typeByteLength;
      this.byteOffset = offset || 0;
    } else {
      this._size = size || stride || _VertexBuffer.DeduceStride(kind);
      this.byteStride = stride ? stride * typeByteLength : this._buffer.byteStride || this._size * typeByteLength;
      this.byteOffset = (offset || 0) * typeByteLength;
    }
    this.normalized = normalized;
    this._instanced = instanced !== void 0 ? instanced : false;
    this._instanceDivisor = instanced ? divisor : 0;
    this._alignBuffer();
    this._computeHashCode();
  }
  _computeHashCode() {
    this.hashCode = (this.type - 5120 << 0) + ((this.normalized ? 1 : 0) << 3) + (this._size << 4) + ((this._instanced ? 1 : 0) << 6) + /* keep 5 bits free */
    (this.byteStride << 12);
  }
  /** @internal */
  _rebuild() {
    this._buffer?._rebuild();
  }
  /**
   * Returns the kind of the VertexBuffer (string)
   * @returns a string
   */
  getKind() {
    return this._kind;
  }
  // Properties
  /**
   * Gets a boolean indicating if the VertexBuffer is updatable?
   * @returns true if the buffer is updatable
   */
  isUpdatable() {
    return this._buffer.isUpdatable();
  }
  /**
   * Gets current buffer's data
   * @returns a DataArray or null
   */
  getData() {
    return this._buffer.getData();
  }
  /**
   * Gets current buffer's data as a float array. Float data is constructed if the vertex buffer data cannot be returned directly.
   * @param totalVertices number of vertices in the buffer to take into account
   * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
   * @returns a float array containing vertex data
   */
  getFloatData(totalVertices, forceCopy) {
    const data = this.getData();
    if (!data) {
      return null;
    }
    return _VertexBuffer.GetFloatData(data, this._size, this.type, this.byteOffset, this.byteStride, this.normalized, totalVertices, forceCopy);
  }
  /**
   * Gets underlying native buffer
   * @returns underlying native buffer
   */
  getBuffer() {
    return this._buffer.getBuffer();
  }
  /**
   * Gets the Buffer instance that wraps the native GPU buffer
   * @returns the wrapper buffer
   */
  getWrapperBuffer() {
    return this._buffer;
  }
  /**
   * Gets the stride in float32 units (i.e. byte stride / 4).
   * May not be an integer if the byte stride is not divisible by 4.
   * @returns the stride in float32 units
   * @deprecated Please use byteStride instead.
   */
  getStrideSize() {
    return this.byteStride / _VertexBuffer.GetTypeByteLength(this.type);
  }
  /**
   * Returns the offset as a multiple of the type byte length.
   * @returns the offset in bytes
   * @deprecated Please use byteOffset instead.
   */
  getOffset() {
    return this.byteOffset / _VertexBuffer.GetTypeByteLength(this.type);
  }
  /**
   * Returns the number of components or the byte size per vertex attribute
   * @param sizeInBytes If true, returns the size in bytes or else the size in number of components of the vertex attribute (default: false)
   * @returns the number of components
   */
  getSize(sizeInBytes = false) {
    return sizeInBytes ? this._size * _VertexBuffer.GetTypeByteLength(this.type) : this._size;
  }
  /**
   * Gets a boolean indicating is the internal buffer of the VertexBuffer is instanced
   * @returns true if this buffer is instanced
   */
  getIsInstanced() {
    return this._instanced;
  }
  /**
   * Returns the instancing divisor, zero for non-instanced (integer).
   * @returns a number
   */
  getInstanceDivisor() {
    return this._instanceDivisor;
  }
  // Methods
  /**
   * Store data into the buffer. If the buffer was already used it will be either recreated or updated depending on isUpdatable property
   * @param data defines the data to store
   */
  create(data) {
    this._buffer.create(data);
    this._alignBuffer();
  }
  /**
   * Updates the underlying buffer according to the passed numeric array or Float32Array.
   * This function will create a new buffer if the current one is not updatable
   * @param data defines the data to store
   */
  update(data) {
    this._buffer.update(data);
    this._alignBuffer();
  }
  /**
   * Updates directly the underlying WebGLBuffer according to the passed numeric array or Float32Array.
   * Returns the directly updated WebGLBuffer.
   * @param data the new data
   * @param offset the new offset
   * @param useBytes set to true if the offset is in bytes
   */
  updateDirectly(data, offset, useBytes = false) {
    this._buffer.updateDirectly(data, offset, void 0, useBytes);
    this._alignBuffer();
  }
  /**
   * Disposes the VertexBuffer and the underlying WebGLBuffer.
   */
  dispose() {
    if (this._ownsBuffer) {
      this._buffer.dispose();
    }
    this._isDisposed = true;
  }
  /**
   * Enumerates each value of this vertex buffer as numbers.
   * @param count the number of values to enumerate
   * @param callback the callback function called for each value
   */
  forEach(count, callback) {
    _VertexBuffer.ForEach(this._buffer.getData(), this.byteOffset, this.byteStride, this._size, this.type, count, this.normalized, callback);
  }
  /** @internal */
  _alignBuffer() {
  }
  /**
   * Deduces the stride given a kind.
   * @param kind The kind string to deduce
   * @returns The deduced stride
   */
  static DeduceStride(kind) {
    switch (kind) {
      case _VertexBuffer.UVKind:
      case _VertexBuffer.UV2Kind:
      case _VertexBuffer.UV3Kind:
      case _VertexBuffer.UV4Kind:
      case _VertexBuffer.UV5Kind:
      case _VertexBuffer.UV6Kind:
        return 2;
      case _VertexBuffer.NormalKind:
      case _VertexBuffer.PositionKind:
        return 3;
      case _VertexBuffer.ColorKind:
      case _VertexBuffer.ColorInstanceKind:
      case _VertexBuffer.MatricesIndicesKind:
      case _VertexBuffer.MatricesIndicesExtraKind:
      case _VertexBuffer.MatricesWeightsKind:
      case _VertexBuffer.MatricesWeightsExtraKind:
      case _VertexBuffer.TangentKind:
        return 4;
      default:
        throw new Error("Invalid kind '" + kind + "'");
    }
  }
  /**
   * Gets the vertex buffer type of the given data array.
   * @param data the data array
   * @returns the vertex buffer type
   */
  static GetDataType(data) {
    if (data instanceof Int8Array) {
      return _VertexBuffer.BYTE;
    } else if (data instanceof Uint8Array) {
      return _VertexBuffer.UNSIGNED_BYTE;
    } else if (data instanceof Int16Array) {
      return _VertexBuffer.SHORT;
    } else if (data instanceof Uint16Array) {
      return _VertexBuffer.UNSIGNED_SHORT;
    } else if (data instanceof Int32Array) {
      return _VertexBuffer.INT;
    } else if (data instanceof Uint32Array) {
      return _VertexBuffer.UNSIGNED_INT;
    } else {
      return _VertexBuffer.FLOAT;
    }
  }
  /**
   * Gets the byte length of the given type.
   * @param type the type
   * @returns the number of bytes
   */
  static GetTypeByteLength(type) {
    switch (type) {
      case _VertexBuffer.BYTE:
      case _VertexBuffer.UNSIGNED_BYTE:
        return 1;
      case _VertexBuffer.SHORT:
      case _VertexBuffer.UNSIGNED_SHORT:
        return 2;
      case _VertexBuffer.INT:
      case _VertexBuffer.UNSIGNED_INT:
      case _VertexBuffer.FLOAT:
        return 4;
      default:
        throw new Error(`Invalid type '${type}'`);
    }
  }
  /**
   * Enumerates each value of the given parameters as numbers.
   * @param data the data to enumerate
   * @param byteOffset the byte offset of the data
   * @param byteStride the byte stride of the data
   * @param componentCount the number of components per element
   * @param componentType the type of the component
   * @param count the number of values to enumerate
   * @param normalized whether the data is normalized
   * @param callback the callback function called for each value
   */
  static ForEach(data, byteOffset, byteStride, componentCount, componentType, count, normalized, callback) {
    if (data instanceof Array) {
      let offset = byteOffset / 4;
      const stride = byteStride / 4;
      for (let index = 0; index < count; index += componentCount) {
        for (let componentIndex = 0; componentIndex < componentCount; componentIndex++) {
          callback(data[offset + componentIndex], index + componentIndex);
        }
        offset += stride;
      }
    } else {
      const dataView = data instanceof ArrayBuffer ? new DataView(data) : new DataView(data.buffer, data.byteOffset, data.byteLength);
      const componentByteLength = _VertexBuffer.GetTypeByteLength(componentType);
      for (let index = 0; index < count; index += componentCount) {
        let componentByteOffset = byteOffset;
        for (let componentIndex = 0; componentIndex < componentCount; componentIndex++) {
          const value = _VertexBuffer._GetFloatValue(dataView, componentType, componentByteOffset, normalized);
          callback(value, index + componentIndex);
          componentByteOffset += componentByteLength;
        }
        byteOffset += byteStride;
      }
    }
  }
  static _GetFloatValue(dataView, type, byteOffset, normalized) {
    switch (type) {
      case _VertexBuffer.BYTE: {
        let value = dataView.getInt8(byteOffset);
        if (normalized) {
          value = Math.max(value / 127, -1);
        }
        return value;
      }
      case _VertexBuffer.UNSIGNED_BYTE: {
        let value = dataView.getUint8(byteOffset);
        if (normalized) {
          value = value / 255;
        }
        return value;
      }
      case _VertexBuffer.SHORT: {
        let value = dataView.getInt16(byteOffset, true);
        if (normalized) {
          value = Math.max(value / 32767, -1);
        }
        return value;
      }
      case _VertexBuffer.UNSIGNED_SHORT: {
        let value = dataView.getUint16(byteOffset, true);
        if (normalized) {
          value = value / 65535;
        }
        return value;
      }
      case _VertexBuffer.INT: {
        return dataView.getInt32(byteOffset, true);
      }
      case _VertexBuffer.UNSIGNED_INT: {
        return dataView.getUint32(byteOffset, true);
      }
      case _VertexBuffer.FLOAT: {
        return dataView.getFloat32(byteOffset, true);
      }
      default: {
        throw new Error(`Invalid component type ${type}`);
      }
    }
  }
  /**
   * Gets the given data array as a float array. Float data is constructed if the data array cannot be returned directly.
   * @param data the input data array
   * @param size the number of components
   * @param type the component type
   * @param byteOffset the byte offset of the data
   * @param byteStride the byte stride of the data
   * @param normalized whether the data is normalized
   * @param totalVertices number of vertices in the buffer to take into account
   * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
   * @returns a float array containing vertex data
   */
  static GetFloatData(data, size, type, byteOffset, byteStride, normalized, totalVertices, forceCopy) {
    const tightlyPackedByteStride = size * _VertexBuffer.GetTypeByteLength(type);
    const count = totalVertices * size;
    if (type !== _VertexBuffer.FLOAT || byteStride !== tightlyPackedByteStride) {
      const copy = new Float32Array(count);
      _VertexBuffer.ForEach(data, byteOffset, byteStride, size, type, count, normalized, (value, index) => copy[index] = value);
      return copy;
    }
    if (!(data instanceof Array || data instanceof Float32Array) || byteOffset !== 0 || data.length !== count) {
      if (data instanceof Array) {
        const offset = byteOffset / 4;
        return data.slice(offset, offset + count);
      } else if (data instanceof ArrayBuffer) {
        return new Float32Array(data, byteOffset, count);
      } else {
        const offset = data.byteOffset + byteOffset;
        if ((offset & 3) !== 0) {
          Logger.Warn("Float array must be aligned to 4-bytes border");
          forceCopy = true;
        }
        if (forceCopy) {
          const result = new Uint8Array(count * Float32Array.BYTES_PER_ELEMENT);
          const source = new Uint8Array(data.buffer, offset, result.length);
          result.set(source);
          return new Float32Array(result.buffer);
        } else {
          return new Float32Array(data.buffer, offset, count);
        }
      }
    }
    if (forceCopy) {
      return data.slice();
    }
    return data;
  }
};
VertexBuffer._Counter = 0;
VertexBuffer.BYTE = 5120;
VertexBuffer.UNSIGNED_BYTE = 5121;
VertexBuffer.SHORT = 5122;
VertexBuffer.UNSIGNED_SHORT = 5123;
VertexBuffer.INT = 5124;
VertexBuffer.UNSIGNED_INT = 5125;
VertexBuffer.FLOAT = 5126;
VertexBuffer.PositionKind = `position`;
VertexBuffer.NormalKind = `normal`;
VertexBuffer.TangentKind = `tangent`;
VertexBuffer.UVKind = `uv`;
VertexBuffer.UV2Kind = `uv2`;
VertexBuffer.UV3Kind = `uv3`;
VertexBuffer.UV4Kind = `uv4`;
VertexBuffer.UV5Kind = `uv5`;
VertexBuffer.UV6Kind = `uv6`;
VertexBuffer.ColorKind = `color`;
VertexBuffer.ColorInstanceKind = `instanceColor`;
VertexBuffer.MatricesIndicesKind = `matricesIndices`;
VertexBuffer.MatricesWeightsKind = `matricesWeights`;
VertexBuffer.MatricesIndicesExtraKind = `matricesIndicesExtra`;
VertexBuffer.MatricesWeightsExtraKind = `matricesWeightsExtra`;

// node_modules/@babylonjs/core/Maths/math.scalar.js
var Scalar = class _Scalar {
  /**
   * Returns -1 if value is negative and +1 is value is positive.
   * @param value the value
   * @returns the value itself if it's equal to zero.
   */
  static Sign(value) {
    value = +value;
    if (value === 0 || isNaN(value)) {
      return value;
    }
    return value > 0 ? 1 : -1;
  }
  /**
   * the log2 of value.
   * @param value the value to compute log2 of
   * @returns the log2 of value.
   */
  static Log2(value) {
    return Math.log(value) * Math.LOG2E;
  }
  /**
   * the floor part of a log2 value.
   * @param value the value to compute log2 of
   * @returns the log2 of value.
   */
  static ILog2(value) {
    if (Math.log2) {
      return Math.floor(Math.log2(value));
    }
    if (value < 0) {
      return NaN;
    } else if (value === 0) {
      return -Infinity;
    }
    let n = 0;
    if (value < 1) {
      while (value < 1) {
        n++;
        value = value * 2;
      }
      n = -n;
    } else if (value > 1) {
      while (value > 1) {
        n++;
        value = Math.floor(value / 2);
      }
    }
    return n;
  }
  /**
   * Loops the value, so that it is never larger than length and never smaller than 0.
   *
   * This is similar to the modulo operator but it works with floating point numbers.
   * For example, using 3.0 for t and 2.5 for length, the result would be 0.5.
   * With t = 5 and length = 2.5, the result would be 0.0.
   * Note, however, that the behaviour is not defined for negative numbers as it is for the modulo operator
   * @param value the value
   * @param length the length
   * @returns the looped value
   */
  static Repeat(value, length) {
    return value - Math.floor(value / length) * length;
  }
  /**
   * Normalize the value between 0.0 and 1.0 using min and max values
   * @param value value to normalize
   * @param min max to normalize between
   * @param max min to normalize between
   * @returns the normalized value
   */
  static Normalize(value, min, max) {
    return (value - min) / (max - min);
  }
  /**
   * Denormalize the value from 0.0 and 1.0 using min and max values
   * @param normalized value to denormalize
   * @param min max to denormalize between
   * @param max min to denormalize between
   * @returns the denormalized value
   */
  static Denormalize(normalized, min, max) {
    return normalized * (max - min) + min;
  }
  /**
   * Calculates the shortest difference between two given angles given in degrees.
   * @param current current angle in degrees
   * @param target target angle in degrees
   * @returns the delta
   */
  static DeltaAngle(current, target) {
    let num = _Scalar.Repeat(target - current, 360);
    if (num > 180) {
      num -= 360;
    }
    return num;
  }
  /**
   * PingPongs the value t, so that it is never larger than length and never smaller than 0.
   * @param tx value
   * @param length length
   * @returns The returned value will move back and forth between 0 and length
   */
  static PingPong(tx, length) {
    const t = _Scalar.Repeat(tx, length * 2);
    return length - Math.abs(t - length);
  }
  /**
   * Interpolates between min and max with smoothing at the limits.
   *
   * This function interpolates between min and max in a similar way to Lerp. However, the interpolation will gradually speed up
   * from the start and slow down toward the end. This is useful for creating natural-looking animation, fading and other transitions.
   * @param from from
   * @param to to
   * @param tx value
   * @returns the smooth stepped value
   */
  static SmoothStep(from, to, tx) {
    let t = _Scalar.Clamp(tx);
    t = -2 * t * t * t + 3 * t * t;
    return to * t + from * (1 - t);
  }
  /**
   * Moves a value current towards target.
   *
   * This is essentially the same as Mathf.Lerp but instead the function will ensure that the speed never exceeds maxDelta.
   * Negative values of maxDelta pushes the value away from target.
   * @param current current value
   * @param target target value
   * @param maxDelta max distance to move
   * @returns resulting value
   */
  static MoveTowards(current, target, maxDelta) {
    let result = 0;
    if (Math.abs(target - current) <= maxDelta) {
      result = target;
    } else {
      result = current + _Scalar.Sign(target - current) * maxDelta;
    }
    return result;
  }
  /**
   * Same as MoveTowards but makes sure the values interpolate correctly when they wrap around 360 degrees.
   *
   * Variables current and target are assumed to be in degrees. For optimization reasons, negative values of maxDelta
   *  are not supported and may cause oscillation. To push current away from a target angle, add 180 to that angle instead.
   * @param current current value
   * @param target target value
   * @param maxDelta max distance to move
   * @returns resulting angle
   */
  static MoveTowardsAngle(current, target, maxDelta) {
    const num = _Scalar.DeltaAngle(current, target);
    let result = 0;
    if (-maxDelta < num && num < maxDelta) {
      result = target;
    } else {
      target = current + num;
      result = _Scalar.MoveTowards(current, target, maxDelta);
    }
    return result;
  }
  /**
   * Same as Lerp but makes sure the values interpolate correctly when they wrap around 360 degrees.
   * The parameter t is clamped to the range [0, 1]. Variables a and b are assumed to be in degrees.
   * @param start start value
   * @param end target value
   * @param amount amount to lerp between
   * @returns the lerped value
   */
  static LerpAngle(start, end, amount) {
    let num = _Scalar.Repeat(end - start, 360);
    if (num > 180) {
      num -= 360;
    }
    return start + num * Clamp(amount);
  }
  /**
   * Calculates the linear parameter t that produces the interpolant value within the range [a, b].
   * @param a start value
   * @param b target value
   * @param value value between a and b
   * @returns the inverseLerp value
   */
  static InverseLerp(a, b, value) {
    let result = 0;
    if (a != b) {
      result = Clamp((value - a) / (b - a));
    } else {
      result = 0;
    }
    return result;
  }
  /**
   * Returns a new scalar located for "amount" (float) on the Hermite spline defined by the scalars "value1", "value3", "tangent1", "tangent2".
   * @see http://mathworld.wolfram.com/HermitePolynomial.html
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param amount defines the amount on the interpolation spline (between 0 and 1)
   * @returns hermite result
   */
  static Hermite(value1, tangent1, value2, tangent2, amount) {
    const squared = amount * amount;
    const cubed = amount * squared;
    const part1 = 2 * cubed - 3 * squared + 1;
    const part2 = -2 * cubed + 3 * squared;
    const part3 = cubed - 2 * squared + amount;
    const part4 = cubed - squared;
    return value1 * part1 + value2 * part2 + tangent1 * part3 + tangent2 * part4;
  }
  /**
   * Returns a new scalar which is the 1st derivative of the Hermite spline defined by the scalars "value1", "value2", "tangent1", "tangent2".
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param time define where the derivative must be done
   * @returns 1st derivative
   */
  static Hermite1stDerivative(value1, tangent1, value2, tangent2, time) {
    const t2 = time * time;
    return (t2 - time) * 6 * value1 + (3 * t2 - 4 * time + 1) * tangent1 + (-t2 + time) * 6 * value2 + (3 * t2 - 2 * time) * tangent2;
  }
  /**
   * This function returns percentage of a number in a given range.
   *
   * RangeToPercent(40,20,60) will return 0.5 (50%)
   * RangeToPercent(34,0,100) will return 0.34 (34%)
   * @param number to convert to percentage
   * @param min min range
   * @param max max range
   * @returns the percentage
   */
  static RangeToPercent(number, min, max) {
    return (number - min) / (max - min);
  }
  /**
   * This function returns number that corresponds to the percentage in a given range.
   *
   * PercentToRange(0.34,0,100) will return 34.
   * @param percent to convert to number
   * @param min min range
   * @param max max range
   * @returns the number
   */
  static PercentToRange(percent, min, max) {
    return (max - min) * percent + min;
  }
  /**
   * Returns the highest common factor of two integers.
   * @param a first parameter
   * @param b second parameter
   * @returns HCF of a and b
   */
  static HCF(a, b) {
    const r = a % b;
    if (r === 0) {
      return b;
    }
    return _Scalar.HCF(b, r);
  }
};
Scalar.TwoPi = Math.PI * 2;
Scalar.WithinEpsilon = WithinEpsilon;
Scalar.ToHex = ToHex;
Scalar.Clamp = Clamp;
Scalar.Lerp = Lerp;
Scalar.RandomRange = RandomRange;
Scalar.NormalizeRadians = NormalizeRadians;

// node_modules/@babylonjs/core/Maths/math.color.js
function colorChannelToLinearSpace(color) {
  return Math.pow(color, ToLinearSpace);
}
function colorChannelToLinearSpaceExact(color) {
  if (color <= 0.04045) {
    return 0.0773993808 * color;
  }
  return Math.pow(0.947867299 * (color + 0.055), 2.4);
}
function colorChannelToGammaSpace(color) {
  return Math.pow(color, ToGammaSpace);
}
function colorChannelToGammaSpaceExact(color) {
  if (color <= 31308e-7) {
    return 12.92 * color;
  }
  return 1.055 * Math.pow(color, 0.41666) - 0.055;
}
var Color3 = class _Color3 {
  /**
   * Creates a new Color3 object from red, green, blue values, all between 0 and 1
   * @param r defines the red component (between 0 and 1, default is 0)
   * @param g defines the green component (between 0 and 1, default is 0)
   * @param b defines the blue component (between 0 and 1, default is 0)
   */
  constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  /**
   * Creates a string with the Color3 current values
   * @returns the string representation of the Color3 object
   */
  toString() {
    return "{R: " + this.r + " G:" + this.g + " B:" + this.b + "}";
  }
  /**
   * Returns the string "Color3"
   * @returns "Color3"
   */
  getClassName() {
    return "Color3";
  }
  /**
   * Compute the Color3 hash code
   * @returns an unique number that can be used to hash Color3 objects
   */
  getHashCode() {
    let hash = this.r * 255 | 0;
    hash = hash * 397 ^ (this.g * 255 | 0);
    hash = hash * 397 ^ (this.b * 255 | 0);
    return hash;
  }
  // Operators
  /**
   * Stores in the given array from the given starting index the red, green, blue values as successive elements
   * @param array defines the array where to store the r,g,b components
   * @param index defines an optional index in the target array to define where to start storing values
   * @returns the current Color3 object
   */
  toArray(array, index = 0) {
    array[index] = this.r;
    array[index + 1] = this.g;
    array[index + 2] = this.b;
    return this;
  }
  /**
   * Update the current color with values stored in an array from the starting index of the given array
   * @param array defines the source array
   * @param offset defines an offset in the source array
   * @returns the current Color3 object
   */
  fromArray(array, offset = 0) {
    _Color3.FromArrayToRef(array, offset, this);
    return this;
  }
  /**
   * Returns a new Color4 object from the current Color3 and the given alpha
   * @param alpha defines the alpha component on the new Color4 object (default is 1)
   * @returns a new Color4 object
   */
  toColor4(alpha = 1) {
    return new Color4(this.r, this.g, this.b, alpha);
  }
  /**
   * Returns a new array populated with 3 numeric elements : red, green and blue values
   * @returns the new array
   */
  asArray() {
    return [this.r, this.g, this.b];
  }
  /**
   * Returns the luminance value
   * @returns a float value
   */
  toLuminance() {
    return this.r * 0.3 + this.g * 0.59 + this.b * 0.11;
  }
  /**
   * Multiply each Color3 rgb values by the given Color3 rgb values in a new Color3 object
   * @param otherColor defines the second operand
   * @returns the new Color3 object
   */
  multiply(otherColor) {
    return new _Color3(this.r * otherColor.r, this.g * otherColor.g, this.b * otherColor.b);
  }
  /**
   * Multiply the rgb values of the Color3 and the given Color3 and stores the result in the object "result"
   * @param otherColor defines the second operand
   * @param result defines the Color3 object where to store the result
   * @returns the result Color3
   */
  multiplyToRef(otherColor, result) {
    result.r = this.r * otherColor.r;
    result.g = this.g * otherColor.g;
    result.b = this.b * otherColor.b;
    return result;
  }
  /**
   * Multiplies the current Color3 coordinates by the given ones
   * @param otherColor defines the second operand
   * @returns the current updated Color3
   */
  multiplyInPlace(otherColor) {
    this.r *= otherColor.r;
    this.g *= otherColor.g;
    this.b *= otherColor.b;
    return this;
  }
  /**
   * Returns a new Color3 set with the result of the multiplication of the current Color3 coordinates by the given floats
   * @param r defines the r coordinate of the operand
   * @param g defines the g coordinate of the operand
   * @param b defines the b coordinate of the operand
   * @returns the new Color3
   */
  multiplyByFloats(r, g, b) {
    return new _Color3(this.r * r, this.g * g, this.b * b);
  }
  /**
   * @internal
   * Do not use
   */
  divide(_other) {
    throw new ReferenceError("Can not divide a color");
  }
  /**
   * @internal
   * Do not use
   */
  divideToRef(_other, _result) {
    throw new ReferenceError("Can not divide a color");
  }
  /**
   * @internal
   * Do not use
   */
  divideInPlace(_other) {
    throw new ReferenceError("Can not divide a color");
  }
  /**
   * Updates the current Color3 with the minimal coordinate values between its and the given color ones
   * @param other defines the second operand
   * @returns the current updated Color3
   */
  minimizeInPlace(other) {
    return this.minimizeInPlaceFromFloats(other.r, other.g, other.b);
  }
  /**
   * Updates the current Color3 with the maximal coordinate values between its and the given color ones.
   * @param other defines the second operand
   * @returns the current updated Color3
   */
  maximizeInPlace(other) {
    return this.maximizeInPlaceFromFloats(other.r, other.g, other.b);
  }
  /**
   * Updates the current Color3 with the minimal coordinate values between its and the given coordinates
   * @param r defines the r coordinate of the operand
   * @param g defines the g coordinate of the operand
   * @param b defines the b coordinate of the operand
   * @returns the current updated Color3
   */
  minimizeInPlaceFromFloats(r, g, b) {
    this.r = Math.min(r, this.r);
    this.g = Math.min(g, this.g);
    this.b = Math.min(b, this.b);
    return this;
  }
  /**
   * Updates the current Color3 with the maximal coordinate values between its and the given coordinates.
   * @param r defines the r coordinate of the operand
   * @param g defines the g coordinate of the operand
   * @param b defines the b coordinate of the operand
   * @returns the current updated Color3
   */
  maximizeInPlaceFromFloats(r, g, b) {
    this.r = Math.max(r, this.r);
    this.g = Math.max(g, this.g);
    this.b = Math.max(b, this.b);
    return this;
  }
  /**
   * @internal
   * Do not use
   */
  floorToRef(_result) {
    throw new ReferenceError("Can not floor a color");
  }
  /**
   * @internal
   * Do not use
   */
  floor() {
    throw new ReferenceError("Can not floor a color");
  }
  /**
   * @internal
   * Do not use
   */
  fractToRef(_result) {
    throw new ReferenceError("Can not fract a color");
  }
  /**
   * @internal
   * Do not use
   */
  fract() {
    throw new ReferenceError("Can not fract a color");
  }
  /**
   * Determines equality between Color3 objects
   * @param otherColor defines the second operand
   * @returns true if the rgb values are equal to the given ones
   */
  equals(otherColor) {
    return otherColor && this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b;
  }
  /**
   * Alias for equalsToFloats
   * @param r red color component
   * @param g green color component
   * @param b blue color component
   * @returns boolean
   */
  equalsFloats(r, g, b) {
    return this.equalsToFloats(r, g, b);
  }
  /**
   * Determines equality between the current Color3 object and a set of r,b,g values
   * @param r defines the red component to check
   * @param g defines the green component to check
   * @param b defines the blue component to check
   * @returns true if the rgb values are equal to the given ones
   */
  equalsToFloats(r, g, b) {
    return this.r === r && this.g === g && this.b === b;
  }
  /**
   * Returns true if the current Color3 and the given color coordinates are distant less than epsilon
   * @param otherColor defines the second operand
   * @param epsilon defines the minimal distance to define values as equals
   * @returns true if both colors are distant less than epsilon
   */
  equalsWithEpsilon(otherColor, epsilon = Epsilon) {
    return Scalar.WithinEpsilon(this.r, otherColor.r, epsilon) && Scalar.WithinEpsilon(this.g, otherColor.g, epsilon) && Scalar.WithinEpsilon(this.b, otherColor.b, epsilon);
  }
  /**
   * @internal
   * Do not use
   */
  negate() {
    throw new ReferenceError("Can not negate a color");
  }
  /**
   * @internal
   * Do not use
   */
  negateInPlace() {
    throw new ReferenceError("Can not negate a color");
  }
  /**
   * @internal
   * Do not use
   */
  negateToRef(_result) {
    throw new ReferenceError("Can not negate a color");
  }
  /**
   * Creates a new Color3 with the current Color3 values multiplied by scale
   * @param scale defines the scaling factor to apply
   * @returns a new Color3 object
   */
  scale(scale) {
    return new _Color3(this.r * scale, this.g * scale, this.b * scale);
  }
  /**
   * Multiplies the Color3 values by the float "scale"
   * @param scale defines the scaling factor to apply
   * @returns the current updated Color3
   */
  scaleInPlace(scale) {
    this.r *= scale;
    this.g *= scale;
    this.b *= scale;
    return this;
  }
  /**
   * Multiplies the rgb values by scale and stores the result into "result"
   * @param scale defines the scaling factor
   * @param result defines the Color3 object where to store the result
   * @returns the result Color3
   */
  scaleToRef(scale, result) {
    result.r = this.r * scale;
    result.g = this.g * scale;
    result.b = this.b * scale;
    return result;
  }
  /**
   * Scale the current Color3 values by a factor and add the result to a given Color3
   * @param scale defines the scale factor
   * @param result defines color to store the result into
   * @returns the result Color3
   */
  scaleAndAddToRef(scale, result) {
    result.r += this.r * scale;
    result.g += this.g * scale;
    result.b += this.b * scale;
    return result;
  }
  /**
   * Clamps the rgb values by the min and max values and stores the result into "result"
   * @param min defines minimum clamping value (default is 0)
   * @param max defines maximum clamping value (default is 1)
   * @param result defines color to store the result into
   * @returns the result Color3
   */
  clampToRef(min = 0, max = 1, result) {
    result.r = Clamp(this.r, min, max);
    result.g = Clamp(this.g, min, max);
    result.b = Clamp(this.b, min, max);
    return result;
  }
  /**
   * Creates a new Color3 set with the added values of the current Color3 and of the given one
   * @param otherColor defines the second operand
   * @returns the new Color3
   */
  add(otherColor) {
    return new _Color3(this.r + otherColor.r, this.g + otherColor.g, this.b + otherColor.b);
  }
  /**
   * Adds the given color to the current Color3
   * @param otherColor defines the second operand
   * @returns the current updated Color3
   */
  addInPlace(otherColor) {
    this.r += otherColor.r;
    this.g += otherColor.g;
    this.b += otherColor.b;
    return this;
  }
  /**
   * Adds the given coordinates to the current Color3
   * @param r defines the r coordinate of the operand
   * @param g defines the g coordinate of the operand
   * @param b defines the b coordinate of the operand
   * @returns the current updated Color3
   */
  addInPlaceFromFloats(r, g, b) {
    this.r += r;
    this.g += g;
    this.b += b;
    return this;
  }
  /**
   * Stores the result of the addition of the current Color3 and given one rgb values into "result"
   * @param otherColor defines the second operand
   * @param result defines Color3 object to store the result into
   * @returns the unmodified current Color3
   */
  addToRef(otherColor, result) {
    result.r = this.r + otherColor.r;
    result.g = this.g + otherColor.g;
    result.b = this.b + otherColor.b;
    return result;
  }
  /**
   * Returns a new Color3 set with the subtracted values of the given one from the current Color3
   * @param otherColor defines the second operand
   * @returns the new Color3
   */
  subtract(otherColor) {
    return new _Color3(this.r - otherColor.r, this.g - otherColor.g, this.b - otherColor.b);
  }
  /**
   * Stores the result of the subtraction of given one from the current Color3 rgb values into "result"
   * @param otherColor defines the second operand
   * @param result defines Color3 object to store the result into
   * @returns the unmodified current Color3
   */
  subtractToRef(otherColor, result) {
    result.r = this.r - otherColor.r;
    result.g = this.g - otherColor.g;
    result.b = this.b - otherColor.b;
    return result;
  }
  /**
   * Subtract the given color from the current Color3
   * @param otherColor defines the second operand
   * @returns the current updated Color3
   */
  subtractInPlace(otherColor) {
    this.r -= otherColor.r;
    this.g -= otherColor.g;
    this.b -= otherColor.b;
    return this;
  }
  /**
   * Returns a new Color3 set with the subtraction of the given floats from the current Color3 coordinates
   * @param r defines the r coordinate of the operand
   * @param g defines the g coordinate of the operand
   * @param b defines the b coordinate of the operand
   * @returns the resulting Color3
   */
  subtractFromFloats(r, g, b) {
    return new _Color3(this.r - r, this.g - g, this.b - b);
  }
  /**
   * Subtracts the given floats from the current Color3 coordinates and set the given color "result" with this result
   * @param r defines the r coordinate of the operand
   * @param g defines the g coordinate of the operand
   * @param b defines the b coordinate of the operand
   * @param result defines the Color3 object where to store the result
   * @returns the result
   */
  subtractFromFloatsToRef(r, g, b, result) {
    result.r = this.r - r;
    result.g = this.g - g;
    result.b = this.b - b;
    return result;
  }
  /**
   * Copy the current object
   * @returns a new Color3 copied the current one
   */
  clone() {
    return new _Color3(this.r, this.g, this.b);
  }
  /**
   * Copies the rgb values from the source in the current Color3
   * @param source defines the source Color3 object
   * @returns the updated Color3 object
   */
  copyFrom(source) {
    this.r = source.r;
    this.g = source.g;
    this.b = source.b;
    return this;
  }
  /**
   * Updates the Color3 rgb values from the given floats
   * @param r defines the red component to read from
   * @param g defines the green component to read from
   * @param b defines the blue component to read from
   * @returns the current Color3 object
   */
  copyFromFloats(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }
  /**
   * Updates the Color3 rgb values from the given floats
   * @param r defines the red component to read from
   * @param g defines the green component to read from
   * @param b defines the blue component to read from
   * @returns the current Color3 object
   */
  set(r, g, b) {
    return this.copyFromFloats(r, g, b);
  }
  /**
   * Copies the given float to the current Color3 coordinates
   * @param v defines the r, g and b coordinates of the operand
   * @returns the current updated Color3
   */
  setAll(v) {
    this.r = this.g = this.b = v;
    return this;
  }
  /**
   * Compute the Color3 hexadecimal code as a string
   * @returns a string containing the hexadecimal representation of the Color3 object
   */
  toHexString() {
    const intR = Math.round(this.r * 255);
    const intG = Math.round(this.g * 255);
    const intB = Math.round(this.b * 255);
    return "#" + ToHex(intR) + ToHex(intG) + ToHex(intB);
  }
  /**
   * Converts current color in rgb space to HSV values
   * @returns a new color3 representing the HSV values
   */
  toHSV() {
    return this.toHSVToRef(new _Color3());
  }
  /**
   * Converts current color in rgb space to HSV values
   * @param result defines the Color3 where to store the HSV values
   * @returns the updated result
   */
  toHSVToRef(result) {
    const r = this.r;
    const g = this.g;
    const b = this.b;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const v = max;
    const dm = max - min;
    if (max !== 0) {
      s = dm / max;
    }
    if (max != min) {
      if (max == r) {
        h = (g - b) / dm;
        if (g < b) {
          h += 6;
        }
      } else if (max == g) {
        h = (b - r) / dm + 2;
      } else if (max == b) {
        h = (r - g) / dm + 4;
      }
      h *= 60;
    }
    result.r = h;
    result.g = s;
    result.b = v;
    return result;
  }
  /**
   * Computes a new Color3 converted from the current one to linear space
   * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
   * @returns a new Color3 object
   */
  toLinearSpace(exact = false) {
    const convertedColor = new _Color3();
    this.toLinearSpaceToRef(convertedColor, exact);
    return convertedColor;
  }
  /**
   * Converts the Color3 values to linear space and stores the result in "convertedColor"
   * @param convertedColor defines the Color3 object where to store the linear space version
   * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
   * @returns the unmodified Color3
   */
  toLinearSpaceToRef(convertedColor, exact = false) {
    if (exact) {
      convertedColor.r = colorChannelToLinearSpaceExact(this.r);
      convertedColor.g = colorChannelToLinearSpaceExact(this.g);
      convertedColor.b = colorChannelToLinearSpaceExact(this.b);
    } else {
      convertedColor.r = colorChannelToLinearSpace(this.r);
      convertedColor.g = colorChannelToLinearSpace(this.g);
      convertedColor.b = colorChannelToLinearSpace(this.b);
    }
    return this;
  }
  /**
   * Computes a new Color3 converted from the current one to gamma space
   * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
   * @returns a new Color3 object
   */
  toGammaSpace(exact = false) {
    const convertedColor = new _Color3();
    this.toGammaSpaceToRef(convertedColor, exact);
    return convertedColor;
  }
  /**
   * Converts the Color3 values to gamma space and stores the result in "convertedColor"
   * @param convertedColor defines the Color3 object where to store the gamma space version
   * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
   * @returns the unmodified Color3
   */
  toGammaSpaceToRef(convertedColor, exact = false) {
    if (exact) {
      convertedColor.r = colorChannelToGammaSpaceExact(this.r);
      convertedColor.g = colorChannelToGammaSpaceExact(this.g);
      convertedColor.b = colorChannelToGammaSpaceExact(this.b);
    } else {
      convertedColor.r = colorChannelToGammaSpace(this.r);
      convertedColor.g = colorChannelToGammaSpace(this.g);
      convertedColor.b = colorChannelToGammaSpace(this.b);
    }
    return this;
  }
  /**
   * Converts Hue, saturation and value to a Color3 (RGB)
   * @param hue defines the hue (value between 0 and 360)
   * @param saturation defines the saturation (value between 0 and 1)
   * @param value defines the value (value between 0 and 1)
   * @param result defines the Color3 where to store the RGB values
   * @returns the updated result
   */
  static HSVtoRGBToRef(hue, saturation, value, result) {
    const chroma = value * saturation;
    const h = hue / 60;
    const x = chroma * (1 - Math.abs(h % 2 - 1));
    let r = 0;
    let g = 0;
    let b = 0;
    if (h >= 0 && h <= 1) {
      r = chroma;
      g = x;
    } else if (h >= 1 && h <= 2) {
      r = x;
      g = chroma;
    } else if (h >= 2 && h <= 3) {
      g = chroma;
      b = x;
    } else if (h >= 3 && h <= 4) {
      g = x;
      b = chroma;
    } else if (h >= 4 && h <= 5) {
      r = x;
      b = chroma;
    } else if (h >= 5 && h <= 6) {
      r = chroma;
      b = x;
    }
    const m = value - chroma;
    result.r = r + m;
    result.g = g + m;
    result.b = b + m;
    return result;
  }
  /**
   * Converts Hue, saturation and value to a new Color3 (RGB)
   * @param hue defines the hue (value between 0 and 360)
   * @param saturation defines the saturation (value between 0 and 1)
   * @param value defines the value (value between 0 and 1)
   * @returns a new Color3 object
   */
  static FromHSV(hue, saturation, value) {
    const result = new _Color3(0, 0, 0);
    _Color3.HSVtoRGBToRef(hue, saturation, value, result);
    return result;
  }
  /**
   * Creates a new Color3 from the string containing valid hexadecimal values
   * @param hex defines a string containing valid hexadecimal values
   * @returns a new Color3 object
   */
  static FromHexString(hex) {
    if (hex.substring(0, 1) !== "#" || hex.length !== 7) {
      return new _Color3(0, 0, 0);
    }
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return _Color3.FromInts(r, g, b);
  }
  /**
   * Creates a new Color3 from the starting index of the given array
   * @param array defines the source array
   * @param offset defines an offset in the source array
   * @returns a new Color3 object
   */
  static FromArray(array, offset = 0) {
    return new _Color3(array[offset], array[offset + 1], array[offset + 2]);
  }
  /**
   * Creates a new Color3 from the starting index element of the given array
   * @param array defines the source array to read from
   * @param offset defines the offset in the source array
   * @param result defines the target Color3 object
   */
  static FromArrayToRef(array, offset = 0, result) {
    result.r = array[offset];
    result.g = array[offset + 1];
    result.b = array[offset + 2];
  }
  /**
   * Creates a new Color3 from integer values (\< 256)
   * @param r defines the red component to read from (value between 0 and 255)
   * @param g defines the green component to read from (value between 0 and 255)
   * @param b defines the blue component to read from (value between 0 and 255)
   * @returns a new Color3 object
   */
  static FromInts(r, g, b) {
    return new _Color3(r / 255, g / 255, b / 255);
  }
  /**
   * Creates a new Color3 with values linearly interpolated of "amount" between the start Color3 and the end Color3
   * @param start defines the start Color3 value
   * @param end defines the end Color3 value
   * @param amount defines the gradient value between start and end
   * @returns a new Color3 object
   */
  static Lerp(start, end, amount) {
    const result = new _Color3(0, 0, 0);
    _Color3.LerpToRef(start, end, amount, result);
    return result;
  }
  /**
   * Creates a new Color3 with values linearly interpolated of "amount" between the start Color3 and the end Color3
   * @param left defines the start value
   * @param right defines the end value
   * @param amount defines the gradient factor
   * @param result defines the Color3 object where to store the result
   */
  static LerpToRef(left, right, amount, result) {
    result.r = left.r + (right.r - left.r) * amount;
    result.g = left.g + (right.g - left.g) * amount;
    result.b = left.b + (right.b - left.b) * amount;
  }
  /**
   * Returns a new Color3 located for "amount" (float) on the Hermite interpolation spline defined by the vectors "value1", "tangent1", "value2", "tangent2"
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent Color3
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent Color3
   * @param amount defines the amount on the interpolation spline (between 0 and 1)
   * @returns the new Color3
   */
  static Hermite(value1, tangent1, value2, tangent2, amount) {
    const squared = amount * amount;
    const cubed = amount * squared;
    const part1 = 2 * cubed - 3 * squared + 1;
    const part2 = -2 * cubed + 3 * squared;
    const part3 = cubed - 2 * squared + amount;
    const part4 = cubed - squared;
    const r = value1.r * part1 + value2.r * part2 + tangent1.r * part3 + tangent2.r * part4;
    const g = value1.g * part1 + value2.g * part2 + tangent1.g * part3 + tangent2.g * part4;
    const b = value1.b * part1 + value2.b * part2 + tangent1.b * part3 + tangent2.b * part4;
    return new _Color3(r, g, b);
  }
  /**
   * Returns a new Color3 which is the 1st derivative of the Hermite spline defined by the colors "value1", "value2", "tangent1", "tangent2".
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param time define where the derivative must be done
   * @returns 1st derivative
   */
  static Hermite1stDerivative(value1, tangent1, value2, tangent2, time) {
    const result = _Color3.Black();
    this.Hermite1stDerivativeToRef(value1, tangent1, value2, tangent2, time, result);
    return result;
  }
  /**
   * Returns a new Color3 which is the 1st derivative of the Hermite spline defined by the colors "value1", "value2", "tangent1", "tangent2".
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param time define where the derivative must be done
   * @param result define where to store the derivative
   */
  static Hermite1stDerivativeToRef(value1, tangent1, value2, tangent2, time, result) {
    const t2 = time * time;
    result.r = (t2 - time) * 6 * value1.r + (3 * t2 - 4 * time + 1) * tangent1.r + (-t2 + time) * 6 * value2.r + (3 * t2 - 2 * time) * tangent2.r;
    result.g = (t2 - time) * 6 * value1.g + (3 * t2 - 4 * time + 1) * tangent1.g + (-t2 + time) * 6 * value2.g + (3 * t2 - 2 * time) * tangent2.g;
    result.b = (t2 - time) * 6 * value1.b + (3 * t2 - 4 * time + 1) * tangent1.b + (-t2 + time) * 6 * value2.b + (3 * t2 - 2 * time) * tangent2.b;
  }
  /**
   * Returns a Color3 value containing a red color
   * @returns a new Color3 object
   */
  static Red() {
    return new _Color3(1, 0, 0);
  }
  /**
   * Returns a Color3 value containing a green color
   * @returns a new Color3 object
   */
  static Green() {
    return new _Color3(0, 1, 0);
  }
  /**
   * Returns a Color3 value containing a blue color
   * @returns a new Color3 object
   */
  static Blue() {
    return new _Color3(0, 0, 1);
  }
  /**
   * Returns a Color3 value containing a black color
   * @returns a new Color3 object
   */
  static Black() {
    return new _Color3(0, 0, 0);
  }
  /**
   * Gets a Color3 value containing a black color that must not be updated
   */
  static get BlackReadOnly() {
    return _Color3._BlackReadOnly;
  }
  /**
   * Returns a Color3 value containing a white color
   * @returns a new Color3 object
   */
  static White() {
    return new _Color3(1, 1, 1);
  }
  /**
   * Returns a Color3 value containing a purple color
   * @returns a new Color3 object
   */
  static Purple() {
    return new _Color3(0.5, 0, 0.5);
  }
  /**
   * Returns a Color3 value containing a magenta color
   * @returns a new Color3 object
   */
  static Magenta() {
    return new _Color3(1, 0, 1);
  }
  /**
   * Returns a Color3 value containing a yellow color
   * @returns a new Color3 object
   */
  static Yellow() {
    return new _Color3(1, 1, 0);
  }
  /**
   * Returns a Color3 value containing a gray color
   * @returns a new Color3 object
   */
  static Gray() {
    return new _Color3(0.5, 0.5, 0.5);
  }
  /**
   * Returns a Color3 value containing a teal color
   * @returns a new Color3 object
   */
  static Teal() {
    return new _Color3(0, 1, 1);
  }
  /**
   * Returns a Color3 value containing a random color
   * @returns a new Color3 object
   */
  static Random() {
    return new _Color3(Math.random(), Math.random(), Math.random());
  }
};
Color3._BlackReadOnly = Color3.Black();
Object.defineProperties(Color3.prototype, {
  dimension: {
    value: [3]
  },
  rank: {
    value: 1
  }
});
var Color4 = class _Color4 {
  /**
   * Creates a new Color4 object from red, green, blue values, all between 0 and 1
   * @param r defines the red component (between 0 and 1, default is 0)
   * @param g defines the green component (between 0 and 1, default is 0)
   * @param b defines the blue component (between 0 and 1, default is 0)
   * @param a defines the alpha component (between 0 and 1, default is 1)
   */
  constructor(r = 0, g = 0, b = 0, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
  // Operators
  /**
   * Creates a new array populated with 4 numeric elements : red, green, blue, alpha values
   * @returns the new array
   */
  asArray() {
    return [this.r, this.g, this.b, this.a];
  }
  /**
   * Stores from the starting index in the given array the Color4 successive values
   * @param array defines the array where to store the r,g,b components
   * @param index defines an optional index in the target array to define where to start storing values
   * @returns the current Color4 object
   */
  toArray(array, index = 0) {
    array[index] = this.r;
    array[index + 1] = this.g;
    array[index + 2] = this.b;
    array[index + 3] = this.a;
    return this;
  }
  /**
   * Update the current color with values stored in an array from the starting index of the given array
   * @param array defines the source array
   * @param offset defines an offset in the source array
   * @returns the current Color4 object
   */
  fromArray(array, offset = 0) {
    this.r = array[offset];
    this.g = array[offset + 1];
    this.b = array[offset + 2];
    this.a = array[offset + 3];
    return this;
  }
  /**
   * Determines equality between Color4 objects
   * @param otherColor defines the second operand
   * @returns true if the rgba values are equal to the given ones
   */
  equals(otherColor) {
    return otherColor && this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b && this.a === otherColor.a;
  }
  /**
   * Creates a new Color4 set with the added values of the current Color4 and of the given one
   * @param otherColor defines the second operand
   * @returns a new Color4 object
   */
  add(otherColor) {
    return new _Color4(this.r + otherColor.r, this.g + otherColor.g, this.b + otherColor.b, this.a + otherColor.a);
  }
  /**
   * Updates the given color "result" with the result of the addition of the current Color4 and the given one.
   * @param otherColor the color to add
   * @param result the color to store the result
   * @returns result input
   */
  addToRef(otherColor, result) {
    result.r = this.r + otherColor.r;
    result.g = this.g + otherColor.g;
    result.b = this.b + otherColor.b;
    result.a = this.a + otherColor.a;
    return result;
  }
  /**
   * Adds in place the given Color4 values to the current Color4 object
   * @param otherColor defines the second operand
   * @returns the current updated Color4 object
   */
  addInPlace(otherColor) {
    this.r += otherColor.r;
    this.g += otherColor.g;
    this.b += otherColor.b;
    this.a += otherColor.a;
    return this;
  }
  /**
   * Adds the given coordinates to the current Color4
   * @param r defines the r coordinate of the operand
   * @param g defines the g coordinate of the operand
   * @param b defines the b coordinate of the operand
   * @param a defines the a coordinate of the operand
   * @returns the current updated Color4
   */
  addInPlaceFromFloats(r, g, b, a) {
    this.r += r;
    this.g += g;
    this.b += b;
    this.a += a;
    return this;
  }
  /**
   * Creates a new Color4 set with the subtracted values of the given one from the current Color4
   * @param otherColor defines the second operand
   * @returns a new Color4 object
   */
  subtract(otherColor) {
    return new _Color4(this.r - otherColor.r, this.g - otherColor.g, this.b - otherColor.b, this.a - otherColor.a);
  }
  /**
   * Subtracts the given ones from the current Color4 values and stores the results in "result"
   * @param otherColor defines the second operand
   * @param result defines the Color4 object where to store the result
   * @returns the result Color4 object
   */
  subtractToRef(otherColor, result) {
    result.r = this.r - otherColor.r;
    result.g = this.g - otherColor.g;
    result.b = this.b - otherColor.b;
    result.a = this.a - otherColor.a;
    return result;
  }
  /**
   * Subtract in place the given color from the current Color4.
   * @param otherColor the color to subtract
   * @returns the updated Color4.
   */
  subtractInPlace(otherColor) {
    this.r -= otherColor.r;
    this.g -= otherColor.g;
    this.b -= otherColor.b;
    this.a -= otherColor.a;
    return this;
  }
  /**
   * Returns a new Color4 set with the result of the subtraction of the given floats from the current Color4 coordinates.
   * @param r value to subtract
   * @param g value to subtract
   * @param b value to subtract
   * @param a value to subtract
   * @returns new color containing the result
   */
  subtractFromFloats(r, g, b, a) {
    return new _Color4(this.r - r, this.g - g, this.b - b, this.a - a);
  }
  /**
   * Sets the given color "result" set with the result of the subtraction of the given floats from the current Color4 coordinates.
   * @param r value to subtract
   * @param g value to subtract
   * @param b value to subtract
   * @param a value to subtract
   * @param result the color to store the result in
   * @returns result input
   */
  subtractFromFloatsToRef(r, g, b, a, result) {
    result.r = this.r - r;
    result.g = this.g - g;
    result.b = this.b - b;
    result.a = this.a - a;
    return result;
  }
  /**
   * Creates a new Color4 with the current Color4 values multiplied by scale
   * @param scale defines the scaling factor to apply
   * @returns a new Color4 object
   */
  scale(scale) {
    return new _Color4(this.r * scale, this.g * scale, this.b * scale, this.a * scale);
  }
  /**
   * Multiplies the Color4 values by the float "scale"
   * @param scale defines the scaling factor to apply
   * @returns the current updated Color4
   */
  scaleInPlace(scale) {
    this.r *= scale;
    this.g *= scale;
    this.b *= scale;
    this.a *= scale;
    return this;
  }
  /**
   * Multiplies the current Color4 values by scale and stores the result in "result"
   * @param scale defines the scaling factor to apply
   * @param result defines the Color4 object where to store the result
   * @returns the result Color4
   */
  scaleToRef(scale, result) {
    result.r = this.r * scale;
    result.g = this.g * scale;
    result.b = this.b * scale;
    result.a = this.a * scale;
    return result;
  }
  /**
   * Scale the current Color4 values by a factor and add the result to a given Color4
   * @param scale defines the scale factor
   * @param result defines the Color4 object where to store the result
   * @returns the result Color4
   */
  scaleAndAddToRef(scale, result) {
    result.r += this.r * scale;
    result.g += this.g * scale;
    result.b += this.b * scale;
    result.a += this.a * scale;
    return result;
  }
  /**
   * Clamps the rgb values by the min and max values and stores the result into "result"
   * @param min defines minimum clamping value (default is 0)
   * @param max defines maximum clamping value (default is 1)
   * @param result defines color to store the result into.
   * @returns the result Color4
   */
  clampToRef(min = 0, max = 1, result) {
    result.r = Clamp(this.r, min, max);
    result.g = Clamp(this.g, min, max);
    result.b = Clamp(this.b, min, max);
    result.a = Clamp(this.a, min, max);
    return result;
  }
  /**
   * Multiply an Color4 value by another and return a new Color4 object
   * @param color defines the Color4 value to multiply by
   * @returns a new Color4 object
   */
  multiply(color) {
    return new _Color4(this.r * color.r, this.g * color.g, this.b * color.b, this.a * color.a);
  }
  /**
   * Multiply a Color4 value by another and push the result in a reference value
   * @param color defines the Color4 value to multiply by
   * @param result defines the Color4 to fill the result in
   * @returns the result Color4
   */
  multiplyToRef(color, result) {
    result.r = this.r * color.r;
    result.g = this.g * color.g;
    result.b = this.b * color.b;
    result.a = this.a * color.a;
    return result;
  }
  /**
   * Multiplies in place the current Color4 by the given one.
   * @param otherColor color to multiple with
   * @returns the updated Color4.
   */
  multiplyInPlace(otherColor) {
    this.r *= otherColor.r;
    this.g *= otherColor.g;
    this.b *= otherColor.b;
    this.a *= otherColor.a;
    return this;
  }
  /**
   * Returns a new Color4 set with the multiplication result of the given floats and the current Color4 coordinates.
   * @param r value multiply with
   * @param g value multiply with
   * @param b value multiply with
   * @param a value multiply with
   * @returns resulting new color
   */
  multiplyByFloats(r, g, b, a) {
    return new _Color4(this.r * r, this.g * g, this.b * b, this.a * a);
  }
  /**
   * @internal
   * Do not use
   */
  divide(_other) {
    throw new ReferenceError("Can not divide a color");
  }
  /**
   * @internal
   * Do not use
   */
  divideToRef(_other, _result) {
    throw new ReferenceError("Can not divide a color");
  }
  /**
   * @internal
   * Do not use
   */
  divideInPlace(_other) {
    throw new ReferenceError("Can not divide a color");
  }
  /**
   * Updates the Color4 coordinates with the minimum values between its own and the given color ones
   * @param other defines the second operand
   * @returns the current updated Color4
   */
  minimizeInPlace(other) {
    this.r = Math.min(this.r, other.r);
    this.g = Math.min(this.g, other.g);
    this.b = Math.min(this.b, other.b);
    this.a = Math.min(this.a, other.a);
    return this;
  }
  /**
   * Updates the Color4 coordinates with the maximum values between its own and the given color ones
   * @param other defines the second operand
   * @returns the current updated Color4
   */
  maximizeInPlace(other) {
    this.r = Math.max(this.r, other.r);
    this.g = Math.max(this.g, other.g);
    this.b = Math.max(this.b, other.b);
    this.a = Math.max(this.a, other.a);
    return this;
  }
  /**
   * Updates the current Color4 with the minimal coordinate values between its and the given coordinates
   * @param r defines the r coordinate of the operand
   * @param g defines the g coordinate of the operand
   * @param b defines the b coordinate of the operand
   * @param a defines the a coordinate of the operand
   * @returns the current updated Color4
   */
  minimizeInPlaceFromFloats(r, g, b, a) {
    this.r = Math.min(r, this.r);
    this.g = Math.min(g, this.g);
    this.b = Math.min(b, this.b);
    this.a = Math.min(a, this.a);
    return this;
  }
  /**
   * Updates the current Color4 with the maximal coordinate values between its and the given coordinates.
   * @param r defines the r coordinate of the operand
   * @param g defines the g coordinate of the operand
   * @param b defines the b coordinate of the operand
   * @param a defines the a coordinate of the operand
   * @returns the current updated Color4
   */
  maximizeInPlaceFromFloats(r, g, b, a) {
    this.r = Math.max(r, this.r);
    this.g = Math.max(g, this.g);
    this.b = Math.max(b, this.b);
    this.a = Math.max(a, this.a);
    return this;
  }
  /**
   * @internal
   * Do not use
   */
  floorToRef(_result) {
    throw new ReferenceError("Can not floor a color");
  }
  /**
   * @internal
   * Do not use
   */
  floor() {
    throw new ReferenceError("Can not floor a color");
  }
  /**
   * @internal
   * Do not use
   */
  fractToRef(_result) {
    throw new ReferenceError("Can not fract a color");
  }
  /**
   * @internal
   * Do not use
   */
  fract() {
    throw new ReferenceError("Can not fract a color");
  }
  /**
   * @internal
   * Do not use
   */
  negate() {
    throw new ReferenceError("Can not negate a color");
  }
  /**
   * @internal
   * Do not use
   */
  negateInPlace() {
    throw new ReferenceError("Can not negate a color");
  }
  /**
   * @internal
   * Do not use
   */
  negateToRef(_result) {
    throw new ReferenceError("Can not negate a color");
  }
  /**
   * Boolean : True if the current Color4 coordinates are each beneath the distance "epsilon" from the given color ones.
   * @param otherColor color to compare against
   * @param epsilon (Default: very small number)
   * @returns true if they are equal
   */
  equalsWithEpsilon(otherColor, epsilon = Epsilon) {
    return Scalar.WithinEpsilon(this.r, otherColor.r, epsilon) && Scalar.WithinEpsilon(this.g, otherColor.g, epsilon) && Scalar.WithinEpsilon(this.b, otherColor.b, epsilon) && Scalar.WithinEpsilon(this.a, otherColor.a, epsilon);
  }
  /**
   * Boolean : True if the given floats are strictly equal to the current Color4 coordinates.
   * @param x x value to compare against
   * @param y y value to compare against
   * @param z z value to compare against
   * @param w w value to compare against
   * @returns true if equal
   */
  equalsToFloats(x, y, z, w) {
    return this.r === x && this.g === y && this.b === z && this.a === w;
  }
  /**
   * Creates a string with the Color4 current values
   * @returns the string representation of the Color4 object
   */
  toString() {
    return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
  }
  /**
   * Returns the string "Color4"
   * @returns "Color4"
   */
  getClassName() {
    return "Color4";
  }
  /**
   * Compute the Color4 hash code
   * @returns an unique number that can be used to hash Color4 objects
   */
  getHashCode() {
    let hash = this.r * 255 | 0;
    hash = hash * 397 ^ (this.g * 255 | 0);
    hash = hash * 397 ^ (this.b * 255 | 0);
    hash = hash * 397 ^ (this.a * 255 | 0);
    return hash;
  }
  /**
   * Creates a new Color4 copied from the current one
   * @returns a new Color4 object
   */
  clone() {
    const result = new _Color4();
    return result.copyFrom(this);
  }
  /**
   * Copies the given Color4 values into the current one
   * @param source defines the source Color4 object
   * @returns the current updated Color4 object
   */
  copyFrom(source) {
    this.r = source.r;
    this.g = source.g;
    this.b = source.b;
    this.a = source.a;
    return this;
  }
  /**
   * Copies the given float values into the current one
   * @param r defines the red component to read from
   * @param g defines the green component to read from
   * @param b defines the blue component to read from
   * @param a defines the alpha component to read from
   * @returns the current updated Color4 object
   */
  copyFromFloats(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this;
  }
  /**
   * Copies the given float values into the current one
   * @param r defines the red component to read from
   * @param g defines the green component to read from
   * @param b defines the blue component to read from
   * @param a defines the alpha component to read from
   * @returns the current updated Color4 object
   */
  set(r, g, b, a) {
    return this.copyFromFloats(r, g, b, a);
  }
  /**
   * Copies the given float to the current Vector4 coordinates
   * @param v defines the r, g, b, and a coordinates of the operand
   * @returns the current updated Vector4
   */
  setAll(v) {
    this.r = this.g = this.b = this.a = v;
    return this;
  }
  /**
   * Compute the Color4 hexadecimal code as a string
   * @param returnAsColor3 defines if the string should only contains RGB values (off by default)
   * @returns a string containing the hexadecimal representation of the Color4 object
   */
  toHexString(returnAsColor3 = false) {
    const intR = Math.round(this.r * 255);
    const intG = Math.round(this.g * 255);
    const intB = Math.round(this.b * 255);
    if (returnAsColor3) {
      return "#" + ToHex(intR) + ToHex(intG) + ToHex(intB);
    }
    const intA = Math.round(this.a * 255);
    return "#" + ToHex(intR) + ToHex(intG) + ToHex(intB) + ToHex(intA);
  }
  /**
   * Computes a new Color4 converted from the current one to linear space
   * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
   * @returns a new Color4 object
   */
  toLinearSpace(exact = false) {
    const convertedColor = new _Color4();
    this.toLinearSpaceToRef(convertedColor, exact);
    return convertedColor;
  }
  /**
   * Converts the Color4 values to linear space and stores the result in "convertedColor"
   * @param convertedColor defines the Color4 object where to store the linear space version
   * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
   * @returns the unmodified Color4
   */
  toLinearSpaceToRef(convertedColor, exact = false) {
    if (exact) {
      convertedColor.r = colorChannelToLinearSpaceExact(this.r);
      convertedColor.g = colorChannelToLinearSpaceExact(this.g);
      convertedColor.b = colorChannelToLinearSpaceExact(this.b);
    } else {
      convertedColor.r = colorChannelToLinearSpace(this.r);
      convertedColor.g = colorChannelToLinearSpace(this.g);
      convertedColor.b = colorChannelToLinearSpace(this.b);
    }
    convertedColor.a = this.a;
    return this;
  }
  /**
   * Computes a new Color4 converted from the current one to gamma space
   * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
   * @returns a new Color4 object
   */
  toGammaSpace(exact = false) {
    const convertedColor = new _Color4();
    this.toGammaSpaceToRef(convertedColor, exact);
    return convertedColor;
  }
  /**
   * Converts the Color4 values to gamma space and stores the result in "convertedColor"
   * @param convertedColor defines the Color4 object where to store the gamma space version
   * @param exact defines if the conversion will be done in an exact way which is slower but more accurate (default is false)
   * @returns the unmodified Color4
   */
  toGammaSpaceToRef(convertedColor, exact = false) {
    if (exact) {
      convertedColor.r = colorChannelToGammaSpaceExact(this.r);
      convertedColor.g = colorChannelToGammaSpaceExact(this.g);
      convertedColor.b = colorChannelToGammaSpaceExact(this.b);
    } else {
      convertedColor.r = colorChannelToGammaSpace(this.r);
      convertedColor.g = colorChannelToGammaSpace(this.g);
      convertedColor.b = colorChannelToGammaSpace(this.b);
    }
    convertedColor.a = this.a;
    return this;
  }
  // Statics
  /**
   * Creates a new Color4 from the string containing valid hexadecimal values.
   *
   * A valid hex string is either in the format #RRGGBB or #RRGGBBAA.
   *
   * When a hex string without alpha is passed, the resulting Color4 has
   * its alpha value set to 1.0.
   *
   * An invalid string results in a Color with all its channels set to 0.0,
   * i.e. "transparent black".
   *
   * @param hex defines a string containing valid hexadecimal values
   * @returns a new Color4 object
   */
  static FromHexString(hex) {
    if (hex.substring(0, 1) !== "#" || hex.length !== 9 && hex.length !== 7) {
      return new _Color4(0, 0, 0, 0);
    }
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const a = hex.length === 9 ? parseInt(hex.substring(7, 9), 16) : 255;
    return _Color4.FromInts(r, g, b, a);
  }
  /**
   * Creates a new Color4 object set with the linearly interpolated values of "amount" between the left Color4 object and the right Color4 object
   * @param left defines the start value
   * @param right defines the end value
   * @param amount defines the gradient factor
   * @returns a new Color4 object
   */
  static Lerp(left, right, amount) {
    return _Color4.LerpToRef(left, right, amount, new _Color4());
  }
  /**
   * Set the given "result" with the linearly interpolated values of "amount" between the left Color4 object and the right Color4 object
   * @param left defines the start value
   * @param right defines the end value
   * @param amount defines the gradient factor
   * @param result defines the Color4 object where to store data
   * @returns the updated result
   */
  static LerpToRef(left, right, amount, result) {
    result.r = left.r + (right.r - left.r) * amount;
    result.g = left.g + (right.g - left.g) * amount;
    result.b = left.b + (right.b - left.b) * amount;
    result.a = left.a + (right.a - left.a) * amount;
    return result;
  }
  /**
   * Interpolate between two Color4 using Hermite interpolation
   * @param value1 defines first Color4
   * @param tangent1 defines the incoming tangent
   * @param value2 defines second Color4
   * @param tangent2 defines the outgoing tangent
   * @param amount defines the target Color4
   * @returns the new interpolated Color4
   */
  static Hermite(value1, tangent1, value2, tangent2, amount) {
    const squared = amount * amount;
    const cubed = amount * squared;
    const part1 = 2 * cubed - 3 * squared + 1;
    const part2 = -2 * cubed + 3 * squared;
    const part3 = cubed - 2 * squared + amount;
    const part4 = cubed - squared;
    const r = value1.r * part1 + value2.r * part2 + tangent1.r * part3 + tangent2.r * part4;
    const g = value1.g * part1 + value2.g * part2 + tangent1.g * part3 + tangent2.g * part4;
    const b = value1.b * part1 + value2.b * part2 + tangent1.b * part3 + tangent2.b * part4;
    const a = value1.a * part1 + value2.a * part2 + tangent1.a * part3 + tangent2.a * part4;
    return new _Color4(r, g, b, a);
  }
  /**
   * Returns a new Color4 which is the 1st derivative of the Hermite spline defined by the colors "value1", "value2", "tangent1", "tangent2".
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param time define where the derivative must be done
   * @returns 1st derivative
   */
  static Hermite1stDerivative(value1, tangent1, value2, tangent2, time) {
    const result = new _Color4();
    this.Hermite1stDerivativeToRef(value1, tangent1, value2, tangent2, time, result);
    return result;
  }
  /**
   * Update a Color4 with the 1st derivative of the Hermite spline defined by the colors "value1", "value2", "tangent1", "tangent2".
   * @param value1 defines the first control point
   * @param tangent1 defines the first tangent
   * @param value2 defines the second control point
   * @param tangent2 defines the second tangent
   * @param time define where the derivative must be done
   * @param result define where to store the derivative
   */
  static Hermite1stDerivativeToRef(value1, tangent1, value2, tangent2, time, result) {
    const t2 = time * time;
    result.r = (t2 - time) * 6 * value1.r + (3 * t2 - 4 * time + 1) * tangent1.r + (-t2 + time) * 6 * value2.r + (3 * t2 - 2 * time) * tangent2.r;
    result.g = (t2 - time) * 6 * value1.g + (3 * t2 - 4 * time + 1) * tangent1.g + (-t2 + time) * 6 * value2.g + (3 * t2 - 2 * time) * tangent2.g;
    result.b = (t2 - time) * 6 * value1.b + (3 * t2 - 4 * time + 1) * tangent1.b + (-t2 + time) * 6 * value2.b + (3 * t2 - 2 * time) * tangent2.b;
    result.a = (t2 - time) * 6 * value1.a + (3 * t2 - 4 * time + 1) * tangent1.a + (-t2 + time) * 6 * value2.a + (3 * t2 - 2 * time) * tangent2.a;
  }
  /**
   * Creates a new Color4 from a Color3 and an alpha value
   * @param color3 defines the source Color3 to read from
   * @param alpha defines the alpha component (1.0 by default)
   * @returns a new Color4 object
   */
  static FromColor3(color3, alpha = 1) {
    return new _Color4(color3.r, color3.g, color3.b, alpha);
  }
  /**
   * Creates a new Color4 from the starting index element of the given array
   * @param array defines the source array to read from
   * @param offset defines the offset in the source array
   * @returns a new Color4 object
   */
  static FromArray(array, offset = 0) {
    return new _Color4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
  }
  /**
   * Creates a new Color4 from the starting index element of the given array
   * @param array defines the source array to read from
   * @param offset defines the offset in the source array
   * @param result defines the target Color4 object
   */
  static FromArrayToRef(array, offset = 0, result) {
    result.r = array[offset];
    result.g = array[offset + 1];
    result.b = array[offset + 2];
    result.a = array[offset + 3];
  }
  /**
   * Creates a new Color3 from integer values (less than 256)
   * @param r defines the red component to read from (value between 0 and 255)
   * @param g defines the green component to read from (value between 0 and 255)
   * @param b defines the blue component to read from (value between 0 and 255)
   * @param a defines the alpha component to read from (value between 0 and 255)
   * @returns a new Color3 object
   */
  static FromInts(r, g, b, a) {
    return new _Color4(r / 255, g / 255, b / 255, a / 255);
  }
  /**
   * Check the content of a given array and convert it to an array containing RGBA data
   * If the original array was already containing count * 4 values then it is returned directly
   * @param colors defines the array to check
   * @param count defines the number of RGBA data to expect
   * @returns an array containing count * 4 values (RGBA)
   */
  static CheckColors4(colors, count) {
    if (colors.length === count * 3) {
      const colors4 = [];
      for (let index = 0; index < colors.length; index += 3) {
        const newIndex = index / 3 * 4;
        colors4[newIndex] = colors[index];
        colors4[newIndex + 1] = colors[index + 1];
        colors4[newIndex + 2] = colors[index + 2];
        colors4[newIndex + 3] = 1;
      }
      return colors4;
    }
    return colors;
  }
};
Object.defineProperties(Color4.prototype, {
  dimension: {
    value: [4]
  },
  rank: {
    value: 1
  }
});
var TmpColors = class {
};
TmpColors.Color3 = BuildArray(3, Color3.Black);
TmpColors.Color4 = BuildArray(3, () => new Color4(0, 0, 0, 0));
RegisterClass("BABYLON.Color3", Color3);
RegisterClass("BABYLON.Color4", Color4);

// node_modules/@babylonjs/core/tslib.es6.js
function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

// node_modules/@babylonjs/core/Misc/decorators.functions.js
var __mergedStore = {};
var __decoratorInitialStore = {};
function GetDirectStore(target) {
  const classKey = target.getClassName();
  if (!__decoratorInitialStore[classKey]) {
    __decoratorInitialStore[classKey] = {};
  }
  return __decoratorInitialStore[classKey];
}
function GetMergedStore(target) {
  const classKey = target.getClassName();
  if (__mergedStore[classKey]) {
    return __mergedStore[classKey];
  }
  __mergedStore[classKey] = {};
  const store = __mergedStore[classKey];
  let currentTarget = target;
  let currentKey = classKey;
  while (currentKey) {
    const initialStore = __decoratorInitialStore[currentKey];
    for (const property in initialStore) {
      store[property] = initialStore[property];
    }
    let parent;
    let done = false;
    do {
      parent = Object.getPrototypeOf(currentTarget);
      if (!parent.getClassName) {
        done = true;
        break;
      }
      if (parent.getClassName() !== currentKey) {
        break;
      }
      currentTarget = parent;
    } while (parent);
    if (done) {
      break;
    }
    currentKey = parent.getClassName();
    currentTarget = parent;
  }
  return store;
}

// node_modules/@babylonjs/core/Misc/decorators.js
function generateSerializableMember(type, sourceName) {
  return (target, propertyKey) => {
    const classStore = GetDirectStore(target);
    if (!classStore[propertyKey]) {
      classStore[propertyKey] = {
        type,
        sourceName
      };
    }
  };
}
function generateExpandMember(setCallback, targetKey = null) {
  return (target, propertyKey) => {
    const key = targetKey || "_" + propertyKey;
    Object.defineProperty(target, propertyKey, {
      get: function() {
        return this[key];
      },
      set: function(value) {
        if (typeof this.equals === "function") {
          if (this.equals(value)) {
            return;
          }
        }
        if (this[key] === value) {
          return;
        }
        this[key] = value;
        target[setCallback].apply(this);
      },
      enumerable: true,
      configurable: true
    });
  };
}
function expandToProperty(callback, targetKey = null) {
  return generateExpandMember(callback, targetKey);
}
function serialize(sourceName) {
  return generateSerializableMember(0, sourceName);
}
function serializeAsTexture(sourceName) {
  return generateSerializableMember(1, sourceName);
}
function serializeAsColor3(sourceName) {
  return generateSerializableMember(2, sourceName);
}
function serializeAsFresnelParameters(sourceName) {
  return generateSerializableMember(3, sourceName);
}
function serializeAsVector2(sourceName) {
  return generateSerializableMember(4, sourceName);
}
function serializeAsVector3(sourceName) {
  return generateSerializableMember(5, sourceName);
}
function serializeAsMeshReference(sourceName) {
  return generateSerializableMember(6, sourceName);
}
function serializeAsColorCurves(sourceName) {
  return generateSerializableMember(7, sourceName);
}
function serializeAsColor4(sourceName) {
  return generateSerializableMember(8, sourceName);
}
function serializeAsImageProcessingConfiguration(sourceName) {
  return generateSerializableMember(9, sourceName);
}
function serializeAsQuaternion(sourceName) {
  return generateSerializableMember(10, sourceName);
}
function serializeAsMatrix(sourceName) {
  return generateSerializableMember(12, sourceName);
}
function serializeAsCameraReference(sourceName) {
  return generateSerializableMember(11, sourceName);
}
function nativeOverride(target, propertyKey, descriptor, predicate) {
  const jsFunc = descriptor.value;
  descriptor.value = (...params) => {
    let func = jsFunc;
    if (typeof _native !== "undefined" && _native[propertyKey]) {
      const nativeFunc = _native[propertyKey];
      if (predicate) {
        func = (...params2) => predicate(...params2) ? nativeFunc(...params2) : jsFunc(...params2);
      } else {
        func = nativeFunc;
      }
    }
    target[propertyKey] = func;
    return func(...params);
  };
}
nativeOverride.filter = function(predicate) {
  return (target, propertyKey, descriptor) => nativeOverride(target, propertyKey, descriptor, predicate);
};

export {
  RegisterClass,
  GetClass,
  EventState,
  Observable,
  ToGammaSpace,
  ToLinearSpace,
  Epsilon,
  BuildArray,
  _ObserveArray,
  PerformanceConfigurator,
  EngineStore,
  RandomRange,
  Lerp,
  Clamp,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix,
  TmpVectors,
  Scalar,
  Color3,
  Color4,
  TmpColors,
  Logger,
  __decorate,
  GetMergedStore,
  expandToProperty,
  serialize,
  serializeAsTexture,
  serializeAsColor3,
  serializeAsFresnelParameters,
  serializeAsVector2,
  serializeAsVector3,
  serializeAsMeshReference,
  serializeAsColorCurves,
  serializeAsColor4,
  serializeAsImageProcessingConfiguration,
  serializeAsQuaternion,
  serializeAsMatrix,
  serializeAsCameraReference,
  nativeOverride,
  DataBuffer,
  Buffer,
  VertexBuffer
};
//# sourceMappingURL=chunk-P4ROUPGK.js.map
