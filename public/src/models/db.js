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
    receiveConnection: (data, state) => {
      return Object.assign(data, {
        tables: [],
        fetchedTables: false
      })
    },
    receiveTableList: (data, state) => {
      return { tables: data.payload, fetchedTables: true }
    },
    receiveNewTable: (data, state) => {
      const newTables = [...state.tables, data.name]
      return { tables: newTables }
    },
    setCreatingTable: (data, state) => {
      return { isCreatingTable: data.value }
    },
    receiveTableDeletion: (data, state) => {
      const newTables = [
        ...state.tables.slice(0, data.index),
        ...state.tables.slice(data.index + 1)
      ]
      return { tables: newTables }
    }
  },
  effects: {
    connect: (data, state, send, done) => {
      const Client = clients[data.payload.clientType]
      const client = new Client(data.payload)
      send('db:receiveConnection', { client, config: data.payload }, done)
    },
    getTableList: (data, state, send, done) => {
      state.client.getTables()
      .then((response) => {
        const tables = response.rows.map((table) => table.tablename)
        send('db:receiveTableList', { payload: tables }, done)
      })
    },
    createTable: (data, state, send, done) => {
      const name = data.name
      state.client.createTable(name)
      .then((response) => {
        send('db:receiveNewTable', {name}, done)
      })
    },
    deleteTable: (data, state, send, done) => {
      const name = data.name
      const index = state.tables.findIndex((table) => table === name)
      state.client.deleteTable(name)
      .then((response) => {
        send('db:receiveTableDeletion', {index}, done)
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
