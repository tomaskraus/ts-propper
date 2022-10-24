"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dlv_1 = __importDefault(require("dlv"));
const klona_1 = require("klona");
class Propper {
    constructor(accessPropPath) {
        this.view = (obj) => {
            const res = (0, dlv_1.default)(obj, this.accessPropPathElems);
            return res;
        };
        this.getAssertedAccessProp = (obj) => {
            const p = this.view(obj);
            if (typeof p === 'undefined') {
                throw new Error(`Property with key path [${this.accessPropPath}] not found at the object.`);
            }
            return p;
        };
        this.accessPropPath = accessPropPath;
        this.accessPropPathElems = accessPropPath.split('.');
    }
    static newInstance(accessPropPath) {
        return new Propper(accessPropPath);
    }
    set(value) {
        return (obj) => {
            this.getAssertedAccessProp(obj); // just an assertion
            // const newObj = { ...obj }; // we don't want a shallow copy
            const newObj = (0, klona_1.klona)(obj);
            const parentProp = (0, dlv_1.default)(newObj, this.accessPropPathElems.slice(0, -1));
            const endPropName = this.accessPropPathElems[this.accessPropPathElems.length - 1];
            parentProp[endPropName] = value;
            return newObj;
        };
    }
    evaluate(fn) {
        return (obj, index) => {
            const x = this.getAssertedAccessProp(obj);
            return fn(x, index);
        };
    }
    over(fn) {
        return (obj, index) => {
            const x = this.getAssertedAccessProp(obj);
            return this.set(fn(x, index))(obj);
        };
    }
}
exports.default = Propper;
//# sourceMappingURL=index.js.map