import { useReducer } from "react"

function uuid() {
  return "" + Math.random() // since this doesn't really matter
}

type Point = {
  id: string,
  x: number,
  y: number
}

type AppState = {
  [id: string]: Point
}

function getInitialState(): AppState {
  const id1 = uuid()
  const id2 = uuid()

  return {
    [id1]: {
      id: id1,
      x: 10,
      y: 10
    },
    [id2]: {
      id: id2,
      x: 100,
      y: 100
    }
  }
}

type Move = {
  type: "move",
  deltaX: number,
  deltaY: number
}

type Add = {
  type: "add",
  x: number,
  y: number
}

type AppActions = (Move | Add) & {
  id: string
}

const circlesReducer: React.Reducer<AppState, AppActions> = (state, action) => {
  switch (action.type) {
    case "move": {
      const { deltaX, deltaY, id } = action
      const base = state[id]
      return {
        ...state,
        [id]: {
          ...base,
          x: base.x + deltaX,
          y: base.y + deltaY
        }
      }
    }
    case "add": {
      const { id, x, y } = action
      return {
        ...state,
        [id]: { id, x, y }
      }
    }
    default:
      return state
  }
}

{
  // In this exercise a React reducer must be typed correctly

  // First, define the type of `AppState`, and make sure it is returned from getInitialState

  // Then, define the possible action types correctly

  const [state, dispatch] = useReducer(circlesReducer, getInitialState())

  // OK
  const x: number = state["xyz"].x

  dispatch({
    type: "move",
    id: "xyz",
    deltaX: 3,
    deltaY: 2
  })

  // Also verify: action parameters inside the reducer should be correctly inferred!

  // Not OK! Following statements should all fail:
  const y: string = state["xyz"].x

  dispatch({
    type: "move",
    id: "xyz",
    deltaX: "3",
    deltaY: 2
  })
  
  dispatch({
    type: "add",
  })

  dispatch({
    type: "test",
  })
}