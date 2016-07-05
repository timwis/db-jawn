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
    client: null, // stored in state because knex.js creates connection pools
    tables: [],
    fetchedTables: false,
    isCreatingTable: false
  },
  reducers: {
    receiveConnection: (action, state) => {
      return Object.assign(action, {
        tables: [],
        fetchedTables: false
      })
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
    connect: (action, state, send) => {
      const Client = clients[action.payload.clientType]
      const client = new Client(action.payload)
      send('db:receiveConnection', { client, config: action.payload })
    },
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
