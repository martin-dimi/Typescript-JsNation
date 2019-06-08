{
  type NotArray<T> = T extends any[] ? never : T
  type EmptyObject<T> = keyof T extends never ? never : T

  /* Make sure empty objects are not allowed 
    Hint: use 'never', 'keyof' and '&' to 'include' impossible types
  */
  function printKeys<T>(object: T & NotArray<T> & EmptyObject<T>) {
    console.log(Object.keys(object).join(", "))
  }

  // OK
  {
    printKeys({ a: 1, b: 2})
    printKeys({ c: "test"})
  }

  // Arrays are not OK:
  {
    printKeys([])
    printKeys([1, 2, 3])
  }

  // Now, make sure, empty objects are not accepted either:
  //  Hint: use 'never', 'keyof' and '&' to 'include' impossible types
  {
    printKeys(null)
    printKeys({})
  }

}
