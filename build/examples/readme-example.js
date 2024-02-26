"use strict";
// Let's create some type and its instance first:
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Create some data:
const circ1 = {
    r: 5,
    center: [1, 2],
    common: { color: '#00ff00', id: 'circle-1' },
};
const circ2 = {
    r: 4,
    center: [1, 1],
    common: { color: '#ff0000', id: 'circle-2' },
};
//
// For every property of Circle type, we can create a propper.
// That propper then serves for an arbitrary number of Circle instances.
const index_1 = __importDefault(require("../src/index"));
// Radius propper of a Circle type and its subtypes:
//   Radius property has a name "r" and is of a type "number"
const radiusPropper = (0, index_1.default)('r');
// get radius
const r1 = radiusPropper.view(circ1);
console.log('r1:', r1);
//=> r1: 5
const r2 = radiusPropper.view(circ2);
console.log('r2:', r2);
//=> r2: 4
// We can also create a propper for an arbitrarily nested property of the object, using a dot notation:
const colorPropper = (0, index_1.default)('common.color');
// get the color
const c = colorPropper.view(circ1);
console.log('color:', c);
//=> color: #00ff00
// It also works for array item property:
//   Center point x-coord propper
const centerXPropper = (0, index_1.default)('center.0');
console.log('cent x:', centerXPropper.view(circ1));
//=> cent x: 1
// Note: traditional Lenses use a functional composition to access a nested property.
// We can specify (possibly nested) path using an array of keys.
// Also, using array in a propper creation, we can address a property inaccessible by a dot notation.
const colorPropper2 = (0, index_1.default)(['common', 'color']);
// get the color
const c2 = colorPropper2.view(circ1);
console.log('color:', c2);
//=> color: #00ff00
// We cannot create a propper without telling its property name:
/// const noPropp = P.newInstance<Circle, number>('');
/// const noProp2 = P.newInstance<Circle, number>([]);
//----------------------------------------------
// Not so strict radius propper.
//   Does not require whole Circle structure.
const radiusLoosePropper = (0, index_1.default)('r');
// Can access a Circle object, as it is a subtype of { r: number }
console.log('r loose:', radiusLoosePropper.view(circ1));
//=> r loose: 6
console.log('r loose, another object:', radiusLoosePropper.view({ r: 10 }));
//=> r loose, another object: 10
//----------------------------------------------------
// Propper's methods do not modify the object, they return its deep copy.
// Here, the "set" method returns a deep copy of an object, with its property set to a new value:
const greenCircle = colorPropper.set('green')(circ1);
console.log('new obj color:', colorPropper.view(greenCircle));
//=> new obj color: "green"
console.log('old obj color:', colorPropper.view(circ1));
//=> old obj color: "#00ff00"
// More circles:
const circles = [
    { r: 5, center: [1, 2], common: { color: '#00ff00', id: 'circle-1' } },
    { r: 4, center: [1, 1], common: { color: '#ff0000', id: 'circle-2' } },
    { r: 6, center: [2, 2], common: { color: '#black', id: 'circle-3' } },
];
// console.log("circles:", circles);
//=> circles: [
//   { r: 10, center: [ 1, 2 ], common: { color: "#00ff00", id: "circle-1"} },
//   { r: 4, center: [ 1, 1 ], common: { color: "#ff0000", id: "circle-2"} },
//   { r: 6, center: [ 2, 2 ], common: { color: "#black", id: "circle-3"} }
// ]
// The syntax of Propper's methods is functional friendly.
//   Here, we set the same color to all circles, with ease:
const darkCircles = [circ1, circ2].map(colorPropper.set('black'));
console.log('dark circles:', darkCircles);
// The "over" method applies a function to the property:
const twoTimesBiggerCircle = radiusPropper.over(x => 2 * x)(circ1);
console.log(twoTimesBiggerCircle);
const twoTimesBiggerCircles = circles.map(radiusPropper.over(x => 2 * x));
console.log('twoTimesBiggerCircles: ', twoTimesBiggerCircles);
//=> twoTimesBiggerCircles: [
//   { r: 10, center: [1, 2], common: { color: "#00ff00", id: "circle-1" } },
//   { r: 8,vcenter: [1, 1], common: { color: "#ff0000", id: "circle-2" } },
//   { r: 12, center: [2, 2], common: { color: "#black", id: "circle-3" } }
// ];
const isValueBig = (x) => x >= 10;
// The "evaluate" methods just computes a result from the property value:
console.log('big radius:', radiusPropper.evaluate(isValueBig)(circ1));
//=> big radius: false
// You can define a Propper of unknown property of an Object:
const unknownPropper = (0, index_1.default)('notThere');
// The view methot of this Propper instance just returns undefined:
console.log('unknownPropper value:', unknownPropper.view(circ1));
//=> unknownPropper value: undefined
// However, Propper's other methods raise an Error:
// unknownPropper.set('something')(circ1);
// Error: Property with key path [notThere] not found at the object.
// unknownPropper.set('hoo')({notThere: ''});
// This Propper will work on all Object having an 'r' property at the top-level, of type 'number'
const justRPropper = (0, index_1.default)('r');
console.log(justRPropper.view({ r: 2 }));
//=> 2
console.log(justRPropper.set(100)(circ1).r);
//=> 100
// -------------------------------------------------------------
// Use that function:
// const onlyBigCircles = twoTimesBiggerCircles.filter(
//   radiusPropper.evaluate(isValueBig)
// );
// console.log('onlyBigCircles:', onlyBigCircles);
// //=> onlyBigCircles: [
// //   { r: 10, enter: [ 1, 2 ], common: { color: '#00ff00', id: 'circle-1' } },
// //   { r: 12, center: [ 2, 2 ], common: { color: '#black', id: 'circle-3' } }
// // ]
// // The same result, without the use of Propper:
// const onlyBigCircles2 = twoTimesBiggerCircles.filter(
//   (c: Circle) => isValueBig(c.r) // Without use of Propper, this line should be edited every time Circle type radius name or place is changed.
// );
// console.log('onlyBigCircles2:', onlyBigCircles2);
//# sourceMappingURL=readme-example.js.map