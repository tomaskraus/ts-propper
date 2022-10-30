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
    evaluate<T extends TObj, TResult>(fn: (x: TProp, index?: number) => TResult): (y: T, index?: number) => TResult;
    /**
     * Creates a deep copy of object, with its access-property value computed by a provided function, applied to the original object's access property.
     *
     * @param fn - Callback function for access-property manipulation. In a form compatible with JS array.map callback (with optional index parameter).
     * @returns - Function (closure), which accepts an object. In a form compatible with JS array.map callback (with optional index parameter). Function returns a deep copy of that object, with new access-property value.
     * @throws - Error, if the object does not contain a property named after IPropper instance's access-property.
     *
     */
    over<T extends TObj>(fn: (x: TProp, index?: number) => TProp): (y: T, index?: number) => T;
}
export default class Propper<TObj extends object, TProp> implements IPropper<TObj, TProp> {
    private accessPropPathStr;
    private accessPropPathElems;
    private constructor();
    /**
     * Returns a new Propper instance.
     * @typeParam TObj - Object type in which we want to access a property.
     * @typeParam TProp - Type of property we ant to access.
     * @param accessPropPath - Name of a property we want to access. Use dot notation to name a nested property.
     * @returns New Propper instance.
     */
    static newInstance<TObj extends object, TProp>(accessPropPath: string): Propper<TObj, TProp>;
    view: <T extends TObj>(obj: T) => TProp | undefined;
    private getAssertedAccessProp;
    set<T extends TObj>(value: TProp): (obj: T) => T;
    evaluate<T extends TObj, TResult>(fn: (x: TProp, index?: number) => TResult): (y: T, index?: number) => TResult;
    over<T extends TObj>(fn: (x: TProp, index?: number) => TProp): (obj: T, index?: number) => T;
}
export {};
