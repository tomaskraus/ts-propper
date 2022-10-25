import P from '../src/index';

// Circle type:
type Circle = {
  r: number; // radius
  center: [x: number, y: number];
  common: {
    color: string;
    id: string;
  };
};

// Create some data:
const circ1: Circle = {
  r: 5,
  center: [1, 2],
  common: {color: '#00ff00', id: 'circle-1'},
};

const circ2: Circle = {
  r: 4,
  center: [1, 1],
  common: {color: '#ff0000', id: 'circle-2'},
};
//

// For every property of Circle type, we can create a Lens.
// That Lens then serves for an arbitrary number of Circle instances.

// Radius lens of a Circle type and its subtypes:
//   Radius property has a name "r" and is of a type "number"
const radiusProp = P.newInstance<Circle, number>('r');

// get radius
const r1 = radiusProp.view(circ1);
console.log('r1:', r1);
//=> r1: 5
const r2 = radiusProp.view(circ2);
console.log('r2:', r2);
//=> r2: 4

// We can also create a lens for an arbitrarily nested property of the object, using a dot notation:
const colorProp = P.newInstance<Circle, string>('common.color');

// get the color
const c = colorProp.view(circ1);
console.log('color:', c);
//=> color: #00ff00

// It also works for array item property:
//   Center point x-coord lens
const centerXProp = P.newInstance<Circle, number>('center.0');
console.log('cent x:', centerXProp.view(circ1));
//=> cent x: 1

// Note: traditional Lenses use a functional composition to access a nested property.

//----------------------------------------------

// Because;

// Not so strict radius propper.
//   Does not require whole Circle structure.
const radiusLooseProp = P.newInstance<{r: number}, number>('r');

// Can access a Circle object, as it is a subtype of { r: number }
console.log('r loose:', radiusLooseProp.view(circ1));
//=> r loose: 6
console.log('r loose, another object:', radiusLooseProp.view({r: 10}));
//=> r loose, another object: 10
//----------------------------------------------------

// Lens methods do not modify the object, they return its deep copy.
// Here, the "set" method returns a deep copy of an object, with its property set to a new value:
const greenCircle = colorProp.set('green')(circ1);

console.log('new obj color:', colorProp.view(greenCircle));
//=> new obj color: "green"
console.log('old obj color:', colorProp.view(circ1));
//=> old obj color: "#00ff00"

// More circles:
const circles: Circle[] = [
  {r: 5, center: [1, 2], common: {color: '#00ff00', id: 'circle-1'}},
  {r: 4, center: [1, 1], common: {color: '#ff0000', id: 'circle-2'}},
  {r: 6, center: [2, 2], common: {color: '#black', id: 'circle-3'}},
];
// console.log("circles:", circles);
//=> circles: [
//   { r: 10, center: [ 1, 2 ], common: { color: "#00ff00", id: "circle-1"} },
//   { r: 4, center: [ 1, 1 ], common: { color: "#ff0000", id: "circle-2"} },
//   { r: 6, center: [ 2, 2 ], common: { color: "#black", id: "circle-3"} }
// ]

// The syntax of Propper's methods is functional friendly.
//   Here, we set the same color to all circles, with ease:
const darkCircles = [circ1, circ2].map(colorProp.set('black'));

console.log('dark circles:', darkCircles);

// The "over" method applies a function to the property:
const twoTimesBiggerCircle = radiusProp.over(x => 2 * x)(circ1);

console.log(twoTimesBiggerCircle);

const twoTimesBiggerCircles = circles.map(radiusProp.over(x => 2 * x));
console.log('twoTimesBiggerCircles: ', twoTimesBiggerCircles);
//=> twoTimesBiggerCircles: [
//   { r: 10, center: [1, 2], common: { color: "#00ff00", id: "circle-1" } },
//   { r: 8,vcenter: [1, 1], common: { color: "#ff0000", id: "circle-2" } },
//   { r: 12, center: [2, 2], common: { color: "#black", id: "circle-3" } }
// ];

const isValueBig = (x: number): boolean => x >= 10;

// The "evaluate" methods just computes a result from the property value:
console.log('big radius:', radiusProp.evaluate(isValueBig)(circ1));
//=> big radius: false

// Use that function:
const onlyBigCircles = twoTimesBiggerCircles.filter(
  radiusProp.evaluate(isValueBig)
);
console.log('onlyBigCircles:', onlyBigCircles);
//=> onlyBigCircles: [
//   { r: 10, enter: [ 1, 2 ], common: { color: '#00ff00', id: 'circle-1' } },
//   { r: 12, center: [ 2, 2 ], common: { color: '#black', id: 'circle-3' } }
// ]

// The same result, without the use of Propper:
const onlyBigCircles2 = twoTimesBiggerCircles.filter(
  (c: Circle) => isValueBig(c.r) // Without use of Propper, this line should be edited every time Circle type radius name or place is changed.
);
console.log('onlyBigCircles2:', onlyBigCircles2);
