import delve from 'dlv';
import {klona} from 'klona';

/**
 * Object property accessor, typed. Can read/manipulate one property of an object (access-property).
 * IPropper instance contains a name and a type of the property we want to access on some object.
 *
 * - Every IPropper instance can access/manipulate one access-property.
 * - One IPropper instance serves many objects, i.e. is not bound to particular object instance.
 *
 * @param TObj - Type of object with access-property.
 * @param TProp - Type of access-property value.
 *
 * Where is IPropper's access-property name? It is in the IPropper's implementation, in its constructor method.
 */
interface IPropper<TObj extends object, TProp> {
  /**
   * Returns given object's access-property value.
   *
   * @param obj - An object whose access-property we want to read.
   * @returns - Value of access-property. Undefined, if the object does not contain a property named after IPropper instance's access-property.
   */
  view<T extends TObj>(obj: T): TProp | undefined;

  /**
   * Creates a deep copy of object, with its access-property new value.
   *
   * @param value - Value of new object's access-property.
   * @returns - Function (closure) with one object parameter. Function returns a deep copy of that object, with new access-property value.
   * @throws - Error, if the object does not contain a property named after IPropper instance's access-property.
   *
   */
  set<T extends TObj>(value: TProp): (obj: T) => T;

  /**
   * Value computed by a provided function, after that function is applied to the original object's access property.
   *
   * @param fn - Callback function for access-property manipulation. In a form compatible with JS array.map callback (with optional index parameter).
   * @returns - Function (closure), which accepts an object. In a form compatible with JS array.map callback (with optional index parameter). Function returns evaluated access-property value.
   * @throws - Error, if the object does not contain a property named after IPropper instance's access-property.
   *
   */
  evaluate<T extends TObj, TResult>(
    fn: (x: TProp, index?: number) => TResult
  ): (y: T, index?: number) => TResult;

  /**
   * Creates a deep copy of object, with its access-property value computed by a provided function, applied to the original object's access property.
   *
   * @param fn - Callback function for access-property manipulation. In a form compatible with JS array.map callback (with optional index parameter).
   * @returns - Function (closure), which accepts an object. In a form compatible with JS array.map callback (with optional index parameter). Function returns a deep copy of that object, with new access-property value.
   * @throws - Error, if the object does not contain a property named after IPropper instance's access-property.
   *
   */
  over<T extends TObj>(
    fn: (x: TProp, index?: number) => TProp
  ): (y: T, index?: number) => T;
}

class Propper<TObj extends object, TProp> implements IPropper<TObj, TProp> {
  private accessPropPathStr: string;
  private accessPropPathElems: string[];

  // TODO: add array string option
  // TODO: add empty accessPropPath check
  private constructor(accessPropPath: string | string[]) {
    if (typeof accessPropPath === 'string') {
      this.accessPropPathStr = accessPropPath;
      this.accessPropPathElems = accessPropPath.split('.');
    } else {
      this.accessPropPathStr = accessPropPath.join('.');
      this.accessPropPathElems = accessPropPath;
    }
    if (this.accessPropPathStr === '') {
      throw new Error('Property path not specified!');
    }
  }

  /**
   * Returns a new Propper instance.
   * @typeParam TObj - Object type in which we want to access a property.
   * @typeParam TProp - Type of property we ant to access.
   * @param accessPropPath - Name of a property we want to access. Use dot notation (or array of keys) to specify a nested property.
   * @returns New Propper instance.
   */
  static createPropper<TObj extends object, TProp>(
    accessPropPath: string | string[]
  ) {
    return new Propper<TObj, TProp>(accessPropPath);
  }

  view = <T extends TObj>(obj: T): TProp | undefined => {
    const res = delve(obj, this.accessPropPathElems);
    return res as TProp;
  };

  private getAssertedAccessProp = (obj: TObj): TProp => {
    const p: TProp | undefined = this.view(obj);
    if (typeof p === 'undefined') {
      throw new Error(
        `Property with key path [${this.accessPropPathStr}] not found at the object.`
      );
    }
    return p;
  };

  set<T extends TObj>(value: TProp) {
    return (obj: T): T => {
      this.getAssertedAccessProp(obj); // just an assertion
      // const newObj = { ...obj }; // we don't want a shallow copy
      const newObj = klona(obj);
      const parentProp = delve(newObj, this.accessPropPathElems.slice(0, -1));
      const endPropName =
        this.accessPropPathElems[this.accessPropPathElems.length - 1];
      parentProp[endPropName] = value;
      return newObj;
    };
  }

  evaluate<T extends TObj, TResult>(
    fn: (x: TProp, index?: number) => TResult
  ): (y: T, index?: number) => TResult {
    return (obj: T, index?: number) => {
      const x = this.getAssertedAccessProp(obj);
      return fn(x, index);
    };
  }

  over<T extends TObj>(fn: (x: TProp, index?: number) => TProp) {
    return (obj: T, index?: number): T => {
      const x = this.getAssertedAccessProp(obj);
      return this.set<T>(fn(x, index))(obj);
    };
  }
}

export default Propper.createPropper;
