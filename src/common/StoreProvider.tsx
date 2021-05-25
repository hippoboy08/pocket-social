import { createContext, Dispatch, useContext, useReducer } from 'react'
import Pocket from '../AppTypes'

type ContextProps = [
  typeof initialState,
  Dispatch<{ type: Action; payload?: any }>
]
const StoreContext = createContext<ContextProps>([] as unknown as ContextProps)

const initialState = {
  records: [] as Pocket.Record[],
  userProfile: {} as Pocket.UserProfile
}

export enum Action {
  /** User Actions */
  FETCH_PUBLIC_PROFILE = 'FETCH_PUBLIC_PROFILE',
  UPDATE_PROFILE = 'UPDATE_PROFILE',

  /** Records Actions */
  ADD_RECORD = 'ADD_RECORD',
  UPDATE_RECORD = 'UPDATE_RECORD',
  FETCH_RECORDS = 'FETCH_RECORDS',
}

const reducer = (
  state = initialState,
  action: { type: Action; payload?: any }
) => {
  switch (action.type) {
    /** User Actions */
    case Action.FETCH_PUBLIC_PROFILE: {
      return {
        ...state,
        ...action.payload
      }
    }
    case Action.UPDATE_PROFILE: {
      return {
        ...state,
        userProfile: action.payload
      }
    }

    /** Records Actions */
    case Action.ADD_RECORD: {
      return {
        ...state,
        records: [...state.records, action.payload as Pocket.Record],
      }
    }
    case Action.UPDATE_RECORD: {
      return {
        ...state,
        records: [
          ...state.records.filter((r) => r.id !== action.payload.id),
          action.payload as Pocket.Record,
        ],
      }
    }
    case Action.FETCH_RECORDS: {
      return { ...state, records: [...action.payload] as Pocket.Record[] }
    }

    default:
      return state
  }
}
interface Props {
  children: React.ReactNode
}
const StoreProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const storeContext = useContext(StoreContext)
  if (storeContext == null) {
    throw new Error('useStore() called outside of a StoreProvider?')
  }
  return storeContext
}
export default StoreProvider
