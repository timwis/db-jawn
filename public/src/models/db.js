const knex = require('knex')

const queries = require('./queries')

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
    fetchedTables: false,
    selectedTable: {
      name: '',
      primaryKey: '',
      fields: [],
      rows: []
    }
  },
  reducers: {
    config: (action, state) => ({
      config: action.payload,
      instance: knex({ client: 'pg', connection: action.payload }),
      tables: [],
      fetchedTables: false,
      selectedTable: model.state.selectedTable // reset to default
    }),
    receiveTables: (action, state) => ({ tables: action.payload, fetchedTables: true }),
    receiveTable: (action, state) => ({ selectedTable: action.payload })
  },
  effects: {
    getTables: (action, state, send) => {
      state.instance.raw(queries.getTables())
      .then((response) => {
        const tables = response.rows.map((table) => table.tablename)
        send('db:receiveTables', { payload: tables })
      })
    },
    getTable: (action, state, send) => {
      const table = action.name
      Promise.all([
        state.instance(table).columnInfo(),
        state.instance.raw(queries.getPrimaryKey(table)),
        state.instance.raw(queries.getRows(table))
      ])
      .then((results) => {
        const [fieldsResults, primaryKeyResults, rowsResults] = results
        const payload = {
          primaryKey: primaryKeyResults.rows.length > 0 && primaryKeyResults.rows[0].attname,
          fields: [],
          rows: rowsResults.rows,
          name: table
        }

        // Map fields object to an array
        for (let field in fieldsResults) {
          fieldsResults[field].name = field
          payload.fields.push(fieldsResults[field])
        }

        send('db:receiveTable', {payload})
      })
      .catch(() => console.error('error fetching table', arguments))
    }
  }
}

module.exports = model
