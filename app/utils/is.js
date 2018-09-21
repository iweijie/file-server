let toString = Object.prototype.toString;

let isNaN = Number.isNaN || function (p) {
    return typeof p === "number" && p !== p
}
let isNumber = (p) => {
    if (isNaN(p)) return false;
    return toString.call(p) === "[object Number]"
}
let isString = (p) => {
    return toString.call(p) === "[object String]"
}
let isBoolean = (p) => {
    return toString.call(p) === "[object Boolean]"
}
let isUndefined = (p) => {
    return toString.call(p) === "[object Undefined]"
}
let isNull = (p) => {
    return toString.call(p) === "[object Null]"
}
let isSymbol = (p) => {
    return toString.call(p) === "[object Symbol]"
}
let isObject = (p) => {
    return toString.call(p) === "[object Object]"
}
let isArray = (p) => {
    return toString.call(p) === "[object Array]"
}
let isFunction = (p) => {
    return toString.call(p) === "[object Function]"
}
module.exports = {
    isNaN,
    isNumber,
    isString,
    isBoolean,
    isUndefined,
    isNull,
    isSymbol,
    isObject,
    isArray,
    isFunction
}