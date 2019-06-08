{
  // Give React's useState hook the correct types
  // https://reactjs.org/docs/hooks-state.html

  function useState<S>(initial: S | (() => S)): 
  [S, ( s : S | ((curState: S) => S )) => void]
   {
    throw new Error("Not implemented") // ignore this line
   }

  // Should pass 
  {
    const [val, updater] = useState(3)
    // val has the type of the initial value
    const x: number = val
    // updater can be called with the same type
    updater(4)
  }
  {
    // initializer can be a function that produces the initial value
    const [val, updater] = useState(() => 3)
    const x: number = val
    updater(4)
    // updater can be a function that takes the current state to produce the next state
    updater(num => num * 2)
  }
  // Should have compile error:
  {
    const [val, updater] = useState(3)
    // value is not a boolean but a number
    const x: boolean = val
  }
  {
    const [val, updater] = useState(3)
    // wrong type, "test" is not a number
    updater("test")
  }
  {
    // useState returns a fixed-length tuple
    const [a, b, c] = useState(3)
  }
}