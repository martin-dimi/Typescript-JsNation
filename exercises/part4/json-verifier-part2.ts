{
  type JsonTypeChecker<T> = (val: T) => val is T
  
  type MapLikeObject<T> = { [key: string]: T }

  type JsonObjectType = {
    [key: string]: JsonTypeChecker<any>
  }

  type ExtractObjectShape<T extends JsonObjectType> = {
    [K in keyof T]: T[K] extends JsonTypeChecker<infer X> ? X : never
  }

  const json = {
    null(val: null): val is null {
      return val === null
    },

    undefined(val: undefined): val is undefined {
      return val === undefined
    },

    string(val: string): val is string {
      return typeof val === "string"
    },

    boolean(val: boolean): val is boolean {
      return typeof val === "boolean"
    },

    number(val: number): val is number {
      return typeof val === "number"
    },

    or<A, B>(itemTypeA: JsonTypeChecker<A>, itemTypeB: JsonTypeChecker<B>): JsonTypeChecker<A | B> {
      return function(val: any): val is A | B {
        return itemTypeA(val) || itemTypeB(val)
      }
    },

    array<T>(itemType: JsonTypeChecker<T>): JsonTypeChecker<T[]> {
      return function(val): val is T[] {
        return Array.isArray(val) && val.every(itemType)
      }
    },

    map<T>(itemType: JsonTypeChecker<T>): JsonTypeChecker<MapLikeObject<T>> {
      return function(val): val is MapLikeObject<T> {
        return val && typeof val === "object" && Object.keys(val).every(key => itemType(val[key]))
      }
    },

    object<T extends JsonObjectType>(shape: T): JsonTypeChecker<ExtractObjectShape<T>> {
      return function(val): val is ExtractObjectShape<T> {
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

  // Determine the type of this function
  function inferTypeCheckerFromExample(val: any) {
    // N.B, this will never infer 'map's or 'or's!
    switch (typeof val) {
      case "string": return json.string
      case "number": return json.number
      case "boolean": return json.boolean
      case "undefined": return json.undefined
      case "object": {
        if (val === null) return json.null
        if (Array.isArray(val)) {
          if (val.length !== 1) throw new Error("To infer type of array, it should have exactly one argument")
          return json.array(inferTypeCheckerFromExample(val[0]))
        }
        // Object shape
        const shape: JsonObjectType = {}
        Object.keys(val).forEach(key => {
          shape[key] = inferTypeCheckerFromExample(val[key])
        })
        return json.object(shape)
      }
    }
    throw new Error("Can't infer type from " + JSON.stringify(val))
  }

  const todoType = inferTypeCheckerFromExample({
    id: 3,
    title: "Test inferrence",
    author: {
      name: "Michel"
    }
  })

  todoType({
    id: 2,
    title: "Cool!",
    author: {
      name: "Some dude"
    }
  })

  // Fails:
  todoType({
    id: "wrong", // Error: Fails
    title: "Ok",
    author: {
      // Error: Missing name
    }
  })
}
