import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import { reducer as text } from './features/text-card/reducer'

const reducer = combineReducers({
  text,
})

export const store = createStore(reducer, applyMiddleware(thunk))
