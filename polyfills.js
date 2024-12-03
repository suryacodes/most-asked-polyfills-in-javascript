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
