import Database from '../models/postgres'

export const RECEIVE_TABLES = 'RECEIVE_TABLES'

export function getTables (dbConfig) {
  return (dispatch) => {
    const db = new Database(dbConfig)
    return db.listTables().then((response) => {
      return dispatch({
        type: RECEIVE_TABLES,
        tables: response.rows
      })
    })
  }
}

export const RECEIVE_ROWS = 'RECEIVE_ROWS'

export function getRows (dbConfig, tableName) {
  return (dispatch) => {
    const db = new Database(dbConfig)
    return db.getRows(tableName).then((response) => {
      return dispatch({
        type: RECEIVE_ROWS,
        rows: response.rows
      })
    })
  }
}

export const RECEIVE_SCHEMA = 'RECEIVE_SCHEMA'

export function getSchema (dbConfig, tableName) {
  return (dispatch) => {
    const db = new Database(dbConfig)
    return db.describe(tableName).then((response) => {
      return dispatch({
        type: RECEIVE_SCHEMA,
        schema: response
      })
    })
  }
}

export const RECEIVE_ROW_UPDATES = 'RECEIVE_ROW_UPDATES'

export function updateRow (dbConfig, tableName, updates, conditions, rowIndex) {
  return (dispatch) => {
    const db = new Database(dbConfig)
    return db.update(tableName, updates, conditions).then((response) => {
      return dispatch({
        type: RECEIVE_ROW_UPDATES,
        rowIndex,
        updates
      })
    })
  }
}

export const RECEIVE_NEW_ROW = 'RECEIVE_NEW_ROW'

export function insertRow (dbConfig, tableName, contents) {
  return (dispatch) => {
    const db = new Database(dbConfig)
    return db.insert(tableName, contents).then((response) => {
      return dispatch({
        type: RECEIVE_NEW_ROW,
        contents: response[0]
      })
    })
  }
}

// TODO
export function updateColumn (dbConfig, tableName, column, updates, rowIndex) {
  console.log('updateColumn', arguments)
}

export const RECEIVE_DB_CONFIG = 'RECEIVE_DB_CONFIG'

export function saveDbConfig (dbConfig) {
  return {
    type: RECEIVE_DB_CONFIG,
    config: dbConfig
  }
}
