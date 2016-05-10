import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import DevTools from '../containers/dev-tools'
import rootReducer from '../reducers'

function configureStore (initialState) {
  let enhancer = applyMiddleware(thunk)
  if (process.env.NODE_ENV !== 'production') {
    enhancer = compose(enhancer, DevTools.instrument())
  }
  return createStore(rootReducer, initialState, enhancer)
}

export default configureStore
