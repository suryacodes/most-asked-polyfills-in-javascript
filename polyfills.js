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




