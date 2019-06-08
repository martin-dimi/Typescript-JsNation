{
  // Write the type for assign with 2, 3, 4, 5 arguments
  function assign<A, B>(a: A|B, b: B|B): A&B
  function assign<A, B, C>(a: A, b: B, c:C): A&B&C
  function assign<A, B, C, D>(a: A, b: B, c:C, d:D): A&B&C&D
  function assign<A, B, C, D, E>(a: A, b: B, c:C, d:D, e:E): A&B&C&D&E
  function assign(): any{
    throw "Not implemented" // ignore this line
  }

  {

    const x1 = assign({ a: 1, b: 2}, { b: 2, c: false}, { e: 3 })

    // Ok
    const x = assign({ a: 1, b: 2}, { b: 2, c: false}, { e: 3 })

    x.a = 3
    x.b = 3
    x.c = false
    x.e = 2

    assign({ a: 1, b: 2}, { b: 2, c: false}, { e: 3 }, {}, { z: true })

    // Not ok
    assign({ x: 0 })
    x.d = 1
    x.c = "test"
  }
}