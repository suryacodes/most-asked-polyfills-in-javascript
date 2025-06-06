//call
Function.prototype.myCall = function (context, ...args) {
    context = context || globalThis;
    const fnSymbol = Symbol();
    context[fnSymbol] = this;
    const result = context[fnSymbol](...args);
    delete context[fnSymbol];
    return result;
};


//bind
Function.prototype.myBind = function (context, ...args) {
    const self = this;
    return function (...newArgs) {
        return self.apply(context, [...args, ...newArgs]);
    };
};


//apply
Function.prototype.myApply = function (context, args) {
    context = context || globalThis;
    const fnSymbol = Symbol();
    context[fnSymbol] = this;
    const result = context[fnSymbol](...(args || []));
    delete context[fnSymbol];
    return result;
};

//map
Array.prototype.myMap = function (callback, thisArg) {
    let newArr = [];
    for (let i = 0; i < this.length; i++) {
        newArr.push(callback.call(thisArg, this[i], i, this));
    }
    return newArr;
};

//filter
Array.prototype.myFilter = function(callback) {
  let arr = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      arr.push(this[i]);
    }
  }
  return arr;
};


//reduce
Array.prototype.myReduce = function (callback, initialVal) {
    // If initialVal is provided, use it; otherwise, take the first element of the array
    let result = initialVal !== undefined ? initialVal : this[0];
    let startIndex = initialVal !== undefined ? 0 : 1;

    for (let index = startIndex; index < this.length; index++) {
        result = callback(result, this[index], index, this);
    }
    return result;
};


//forEach
Array.prototype.myForEach = function(callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this);
  }
};



// Debounce function
function debounce(fn, delay) {
  let timeoutId;

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const debouncedFunction = debounce(function (num) {
  console.log("Debounced function called", num);
}, 2000);

debouncedFunction(1);
debouncedFunction(2);
debouncedFunction(3);



// Throttle function
const throttle = (func, delay) => {
  let isCalled = false;
  return function (...args) {
    if (!isCalled) {
      func(...args);
      isCalled = true;
      setTimeout(() => {
        isCalled = false;
      }, delay);
    }
  };
};


const throttleFunction = throttle(function (num) {
  console.log("Throttle function called", num);
}, 2000);

throttleFunction(1); // This will execute immediately
throttleFunction(2); // Ignored
throttleFunction(3); // Ignored

setTimeout(() => throttleFunction(4), 1900); // Ignored 
setTimeout(() => throttleFunction(5), 5000); // Executed 


//Memoize
function myMemoize(callback) {
  const cache = {};

  return (...args) => {
    const key = JSON.stringify(args); 

    if (cache[key] !== undefined) {
      return cache[key];
    }

    cache[key] = callback(...args); 
    return cache[key];
  };
}

const expensiveFunc = (num1, num2) => {
  let output = 1;
  for (let i = 0; i <= 10000000; i++) {
    output += i;
  }
  return num1 + num2 + output;
};

const memoizeFunc = myMemoize(expensiveFunc);

console.time("First call");
console.log(memoizeFunc(1, 2));
console.timeEnd("First call");

console.time("Second call");
console.log(memoizeFunc(1, 2));
console.timeEnd("Second call");


//LRUCache 
class LRUCache {
  constructor(limit) {
    this.limit = limit;
    this.cache = new Map();
  }

  set(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    if (this.cache.size === this.limit) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
}


// setTimeout
function createSetTimout() {
  let timerId = 0;
  let timerMap = {};

  const setTimeoutPoly = (callback, delay) => {
    timerId += 1;
    const currentId = timerId;
    timerMap[currentId] = true;
    const startTime = Date.now();

    function triggerCallBack() {
      if (!timerMap[currentId]) return;

      const now = Date.now();
      if (now - startTime >= delay) {
        callback();
        delete timerMap[currentId];
      } else {
        setImmediate(triggerCallBack);
      }
    }

    setImmediate(triggerCallBack);
    return currentId;
  };

  const clearTimeOut = (id) => {
    delete timerMap[id];
  };

  return { setTimeoutPoly, clearTimeOut };
}


//setInterval
function createSetInterval() {
  let timerId = 0;
  let timerMap = {};

  const setIntervalPoly = (callback, delay) => {
    timerId += 1;
    const currentId = timerId;
    timerMap[currentId] = true;

    let nextTime = Date.now() + delay;

    function triggerCallBack() {
      if (!timerMap[currentId]) return;

      const now = Date.now();
      if (now >= nextTime) {
        callback();
        nextTime += delay;
      }
      setImmediate(triggerCallBack);
    }

    setImmediate(triggerCallBack);
    return currentId;
  };

  const clearInterval = (id) => {
    delete timerMap[id];
  };

  return { setIntervalPoly, clearInterval };
}

//deep clone
function deepClone(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj);
    }
    
    if (hash.has(obj)) {
      return hash.get(obj);
    }
    
    const result = Array.isArray(obj) ? [] : {};
    hash.set(obj, result);
    
    Object.entries(obj).forEach(([key, value]) => {
      result[key] = deepClone(value, hash);
    });
    
    return result;
}

//Promise
function CustomPromise(executor) {
  let fulfilled = false;
  let rejected = false;
  let resolvedData = null;
  let rejectedErr = null;
  let thenHandlers = [];
  let catchHandler = null;

  const resolve = (data) => {
    if (fulfilled || rejected) return; 
    fulfilled = true;
    resolvedData = data;

    queueMicrotask(() => {
      let result = resolvedData;
      try {
        for (const handler of thenHandlers) {
          result = handler(result);
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const reject = (err) => {
    if (fulfilled || rejected) return; 
    rejected = true;
    rejectedErr = err;

    queueMicrotask(() => {
      if (catchHandler) {
        catchHandler(rejectedErr);
      }
    });
  };

  this.then = (callbackFn) => {
    return new CustomPromise((resolveNext, rejectNext) => {
      const handler = (data) => {
        try {
          const result = callbackFn(data);
          if (result instanceof CustomPromise) {
            result.then(resolveNext).catch(rejectNext);
          } else {
            resolveNext(result);
          }
        } catch (err) {
          rejectNext(err);
        }
      };

      if (fulfilled) {
        queueMicrotask(() => handler(resolvedData));
      } else if (!rejected) {
        thenHandlers.push(handler);
      }
    });
  };

  this.catch = (callbackFn) => {
    return new CustomPromise((resolveNext, rejectNext) => {
      const handler = (err) => {
        try {
          const result = callbackFn(err);
          resolveNext(result);
        } catch (e) {
          rejectNext(e);
        }
      };

      if (rejected) {
        queueMicrotask(() => handler(rejectedErr));
      } else {
        catchHandler = handler;
      }
    });
  };

  try {
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }
}

