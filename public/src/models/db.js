const knex = require('knex')

const queries = require('../queries')

const model = {
  namespace: 'db',
  state: {
    config: {
      hostname: '',
      username: '',
      password: '',
      database: ''
    },
    instance: null,
    tables: [],
    fetchedTables: false
  },
  reducers: {
    config: (action, state) => ({
      config: action.payload,
      instance: knex({ client: 'pg', connection: action.payload }), // stored in state because it creates connection pools
      tables: [],
      fetchedTables: false
    }),
    receiveTableList: (action, state) => {
      return { tables: action.payload, fetchedTables: true }
    }
  },
  effects: {
    getTableList: (action, state, send) => {
      state.instance.raw(queries.getTables())
      .then((response) => {
        const tables = response.rows.map((table) => table.tablename)
        send('db:receiveTableList', { payload: tables })
      })
    }
  }
}

// Allow specifying default connection details in a file for development
if (process.env.NODE_ENV === 'development') {
  const initialCredentials = require('../config')
  model.state.config = initialCredentials
  model.state.instance = knex({ client: 'pg', connection: initialCredentials })
}

module.exports = model
