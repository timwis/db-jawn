import { combineReducers } from 'redux'

import {
  RECEIVE_TABLES, RECEIVE_ROWS,
  RECEIVE_SCHEMA, RECEIVE_ROW_UPDATES,
  RECEIVE_NEW_ROW
} from '../actions'

function tables (state = [], action) {
  switch (action.type) {
    case RECEIVE_TABLES:
      return action.tables
    default:
      return state
  }
}

// stub
function database (state = {}, action) {
  return state
}

function rows (state = [], action) {
  switch (action.type) {
    case RECEIVE_ROWS:
      return action.rows
    case RECEIVE_ROW_UPDATES: {
      const {rowIndex, updates} = action
      const rowsCopy = state.slice()
      rowsCopy[rowIndex] = Object.assign({}, rowsCopy[rowIndex], updates)
      return rowsCopy
    }
    case RECEIVE_NEW_ROW: {
      const {contents} = action
      const rowsCopy = state.slice()
      rowsCopy.unshift(contents)
      return rowsCopy
    }
    default:
      return state
  }
}

function schema (state = {}, action) {
  switch (action.type) {
    case RECEIVE_SCHEMA:
      return action.schema
    default:
      return state
  }
}

const rootReducer = combineReducers({
  tables,
  database,
  rows,
  schema
})

export default rootReducer
