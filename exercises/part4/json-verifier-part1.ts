{
  type JsonTypeChecker<T> = (val: T) => val is T

  type MapLikeObject<T> = { [key: string]: T }

  // Probably we need more types...

  const json = {
    // These need param & return types...
    string(val: unknown): val is string {
      return typeof val === "string"
    },
    
    boolean(val: unknown): val is boolean {
      return typeof val === "boolean"
    },
    
    number(val: unknown): val is number {
      return typeof val === "number"
    },
    
    null(val: unknown): val is null {
      return val === null
    },

    undefined(val: unknown): val is undefined {
      return val === undefined
    },

  // make sure to eliminate the any's!
    or<A, B>(itemTypeA: JsonTypeChecker<A>, itemTypeB: JsonTypeChecker<B>): JsonTypeChecker<A|B> {
      return function(val: any): val is A|B {
        return itemTypeA(val) || itemTypeB(val)
      }
    },

    array(itemType: JsonTypeChecker<any>) {
      return function(val: any) {
        return Array.isArray(val) && val.every(itemType)
      }
    },

    map(itemType: any): JsonTypeChecker<MapLikeObject<any>> {
      return function(val: any) {
        return val && typeof val === "object" && Object.keys(val).every(key => itemType(val[key]))
      }
    },

    object(shape: any) {
      return function(val: any) {
        return (
          // it's an object?
          val && typeof val === "object" && 
          // all types in shape are satisfied
          Object.keys(shape).every(key => shape[key](val[key])) &&
          // no properties in val that aren't defined in shape?
          Object.keys(val).every(key => key in shape)
        )
      }
    }
  }

  // TIP: make sure first positive test passes, then first negative (see below), then second positive, second negative, etc...
  // once json.array and json.number are properly typed etc, the utility types `numberArray` and `todoType` should pass as well..

  const numberArray = json.array(json.number)

  const todoType = json.object({
    id: json.number,
    title: json.string,
    author: json.or(json.undefined, json.object({
      name: json.string
    }))
  })

  // should all pass
  {
    json.string("test")
    json.boolean(false)
    json.number(3)

    const z: any = null
    if (json.number(z)) console.log(z * 3) // works because inferred type of z is number

    json.null(null)
    json.undefined(undefined)

    json.or(json.null, json.string)("test")
    json.or(json.null, json.string)(null)

    numberArray([1, 2, 3])
    numberArray([])

    json.map(json.number)({ "noa": 7, "veria": 5 })

    todoType({
      id: 1,
      title: "Teach TypeScript",
      author: undefined
    })

    todoType({
      id: 1,
      title: "Teach TypeScript",
      author: {
        name: "Michel"
      }
    })

    json.map(todoType)({
      "task1": {
        id: 1,
        title: "Teach TypeScript",
        author: undefined
      }
    })

    const x: any = null
    if (todoType(x)) {
      // at this point we are 100% sure x entirely matches the shape of a Todo!
      const { id, title } = x // inferred types for id and title should be number / string!
      console.log(`${title}: ${id * 2}`)
    }
  }

  // should all fail
  {
    const z: any = null
    if (json.string(z)) console.log(z * 3) // fails because inferred type of z is string

    json.null(undefined)
    json.undefined(null)

    json.or(json.null, json.string)(3)

    const numberArray = json.array(json.number)
    numberArray(json.number)(["4"])
    numberArray(json.number)(null)

    json.map(json.number)({ "noa": 7, "veria": false })
    json.map(json.number)("nonsense")

    todoType({
      id: 1,
      // missing title
      author: undefined
    })

    todoType({
      id: 1,
      title: "Teach TypeScript",
      author: {
        name: "Michel",
        age: 34 // undefined attribute
      }
    })

    json.map(todoType)({
      "task1": {
        id: 1,
        title: "Teach TypeScript",
        author: undefined
      },
      "task2": null // invalid todo
    })

    const x: any = null
    if (todoType(x)) {
      const { title, description } = x // description does not exists
      console.log(`${description}: ${title * 2}`) // strings cannot be multiplied
    }
  }
}
