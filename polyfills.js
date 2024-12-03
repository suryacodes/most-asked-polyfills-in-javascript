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


