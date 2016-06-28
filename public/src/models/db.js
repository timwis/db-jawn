const clients = {
  pg: require('../clients/postgres')
}

const model = {
  namespace: 'db',
  state: {
    config: {
      clientType: '',
      host: '',
      user: '',
      password: '',
      database: '',
      ssl: false
    },
    client: null,
    tables: [],
    fetchedTables: false,
    isCreatingTable: false
  },
  reducers: {
    config: (action, state) => {
      const Client = clients[action.payload.clientType]
      return {
        config: action.payload,
        client: new Client(action.payload), // stored in state because knex.js creates connection pools
        tables: [],
        fetchedTables: false
      }
    },
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
      state.client.getTables()
      .then((response) => {
        const tables = response.rows.map((table) => table.tablename)
        send('db:receiveTableList', { payload: tables })
      })
    },
    createTable: (action, state, send) => {
      const name = action.name
      state.client.createTable(name)
      .then((response) => {
        send('db:receiveNewTable', {name})
      })
    },
    deleteTable: (action, state, send) => {
      const name = action.name
      const index = state.tables.findIndex((table) => table === name)
      state.client.deleteTable(name)
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
  model.state.client = new clients.pg(initialCredentials) // eslint-disable-line
}

module.exports = model
