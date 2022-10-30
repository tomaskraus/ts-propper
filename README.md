![build](https://github.com/tomaskraus/ts-propper/actions/workflows/node.js.yml/badge.svg)
[![codecov](https://codecov.io/gh/tomaskraus/ts-propper/branch/main/graph/badge.svg?token=A1UMZ094D6)](https://codecov.io/gh/tomaskraus/ts-propper)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

# ts-propper

Simplified Lenses for TypeScript.
For those who find the traditional (otherwise great) [Functional Lenses][1] implementation too overwhelming to start with.  
Unlike traditional Lenses, Propper's syntax is more object-oriented.

- Easy to use.
- Typed. With `d.ts` for Javascript.
- Object-oriented & Functional programming friendly.
- Immutable.
- Well tested.
- 100% code coverage.

In a short, _Lens_ is basically a property accessor. Can read and manipulate the property it points (focuses) to.  
With immutability in mind.

### With Lenses, you can:

- **View** object's property value.
- **Set** object's property value.
- **Evaluate** object's property value by calling a function over it.
- Set object's property value by calling a function **over** the property.

Think of Lens as a "better getter/setter" layer that helps other code to not use the object's internal structure.

### Why use Lenses

- **Immutable**. Instead modifying object's property, lens create a deep copy of that object, with new property value.
- Prevents property access logic duplication, whenever a property is used. If an object structure design is changed, the only things to be modified are Lenses for that object.

## Installation

```bash
$ npm install ts-propper
```

## Usage

Typescript / ES module:

```ts
import P from 'ts-propper';
```

Javascript / CommonJS:

```js
const P = require('ts-propper').default;
```

## Example

Let's create some type and its instances first:

```ts
// Circle type:
type Circle = {
  r: number; //radius
  center: [x: number, y: number];
  common: {
    color: string;
    id: string;
  };
};

// Create some instances:
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
```

For every property of Circle type, we can create a Lens.
That Lens then serves for an arbitrary number of Circle instances.

```ts
import P from 'ts-propper';

// Radius lens of a Circle type and its subtypes:
//   Radius property has a name "r" and is of a type "number"
const radiusProp = P.newInstance<Circle, number>('r');

// get radius property of some Circle object
const r1 = radiusProp.view(circ1);
console.log('r1:', r1);
//=> r1: 5
const r2 = radiusProp.view(circ2);
console.log('r2:', r2);
//=> r2: 4
```

We can also create a lens for an arbitrarily nested property of the object, using a dot notation:

```ts
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
```

We can specify (possibly nested) path using an array of keys.  
Also, using array in a Lens creation, we can address a property inaccessible by a dot notation.

```ts
const colorProp2 = P.newInstance<Circle, string>(['common', 'color']);

// get the color
const c2 = colorProp2.view(circ1);
console.log('color:', c2);
//=> color: #00ff00
```

We cannot create a Lens without telling its property name:

```ts
const noProp = P.newInstance<Circle, number>('');
//raises Error

const noProp2 = P.newInstance<Circle, number>([]);
//raises Error
```

Lens methods do not modify the object, they return its deep copy.

The **set** method returns a deep copy of an object, with its property set to a new value:

```ts
const greenCircle = colorProp.set('green')(circ1);

console.log('new obj color:', colorProp.view(greenCircle));
//=> new obj color: "green"
console.log('old obj color:', colorProp.view(circ1));
//=> old obj color: "#00ff00"
```

The syntax of Propper's methods is functional friendly.

```ts
//   Here, we set the same color to all circles, with ease:
const darkCircles = [circ1, circ2].map(colorProp.set('black'));
```

The **over** method applies a function to the property:

```ts
const twoTimesBiggerCircle = radiusProp.over(x => 2 * x)(circ1);
```

The **evaluate** method just computes a result from the property value:

```ts
const isValueBig = (x: number): boolean => x >= 10;

console.log('big radius:', radiusProp.evaluate(isValueBig)(circ1));
//=> big radius: false
```

## Property presence check

Before accessing the object's property, Propper checks object's property for the presence. Continues if "property value !== undefined", or throws an error.

This strict property presence checking behavior is not as powerful as allowing Propper to create new property of some object, on the fly. This behavior is a design decision, for two reasons:

1. Removes sort of spelling errors: no magically-created unwanted new properties.
2. It is easier to implement (and understand) in a type safe way in TypeScript.

## On Strictness

You can define a Propper of unknown property of an Object:

```ts
const unknownProp = P.newInstance<Circle, number>('notThere');
```

The **view** methot of this Propper instance just returns _undefined_:

```ts
console.log('unknownProp value:', unknownProp.view(circ1));
//=> unknownProp value: undefined
```

However, Propper's other methods raise an Error:

```ts
unknownProp.set('something')(circ1);
// Error: Property with key path [notThere] not found at the object.
```

### Less restrictive Propper

This Propper will work on all Objects having an 'r' property at the top-level, of type 'number':

```ts
const justRProp = P.newInstance<{r: number}, number>('r');

console.log(justRProp.view({r: 2}));
//=> 2

console.log(justRProp.set(100)(circ1).r);
//=> 100
```

## Other Resources

- A short explanation of lenses:  
  [On Lenses in Javascript](https://dev.to/devinholloway/functional-lenses-in-javascript-with-ramda-4li7)
- Javascript lenses library:  
  [partial.lenses][1]
- TypeScript lenses library:  
  [monocle-ts](https://github.com/gcanti/monocle-ts)

---

[1]: https://github.com/calmm-js/partial.lenses#readme 'partial.lenses'
