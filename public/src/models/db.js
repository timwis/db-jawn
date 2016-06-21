const knex = require('knex')

const queries = require('../queries')

const model = {
  namespace: 'db',
  state: {
    config: {
      host: '',
      user: '',
      password: '',
      database: '',
      ssl: false
    },
    connection: null,
    tables: [],
    fetchedTables: false,
    isCreatingTable: false
  },
  reducers: {
    config: (action, state) => ({
      config: action.payload,
      connection: knex({ client: 'pg', connection: action.payload }), // stored in state because it creates connection pools
      tables: [],
      fetchedTables: false
    }),
    receiveTableList: (action, state) => {
      return { tables: action.payload, fetchedTables: true }
    },
    receiveNewTable: (action, state) => {
      const newTables = [...state.tables, action.name]
      return { tables: newTables }
    },
    setCreatingTable: (action, state) => {
      return { isCreatingTable: action.value }
    },
    receiveTableDeletion: (action, state) => {
      const newTables = [
        ...state.tables.slice(0, action.index),
        ...state.tables.slice(action.index + 1)
      ]
      return { tables: newTables }
    }
  },
  effects: {
    getTableList: (action, state, send) => {
      queries.getTables(state.connection)
      .then((response) => {
        const tables = response.rows.map((table) => table.tablename)
        send('db:receiveTableList', { payload: tables })
      })
    },
    createTable: (action, state, send) => {
      const name = action.name
      queries.createTable(state.connection, name)
      .then((response) => {
        send('db:receiveNewTable', {name})
      })
    },
    deleteTable: (action, state, send) => {
      const index = action.index
      const name = state.tables[index]
      queries.deleteTable(state.connection, name)
      .then((response) => {
        send('db:receiveTableDeletion', {index})
      })
    }
  }
}

// Allow specifying default connection details in a file for development
if (process.env.NODE_ENV === 'development') {
  const initialCredentials = require('../config')
  model.state.config = initialCredentials
  model.state.connection = knex({ client: 'pg', connection: initialCredentials })
}

module.exports = model
