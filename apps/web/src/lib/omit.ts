/**
 *
 The function removes a property with the specified name from the object and returns the modified object.
 const object = {
  name: 'John',
  age: 30,
  gender: 'male'
};

const modifiedObject = omit(object, 'age');
console.log(modifiedObject); // { name: 'John', gender: 'male' }

 * @param object - Object to remove properties from
 * @param name - Name of property to remove
 * @returns object with property removed
 */
const omit = (object: Record<string, any>, name: string) => {
  delete object[name];
  return object;
};

export default omit;
