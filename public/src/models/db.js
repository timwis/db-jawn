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
      rows: [],
      selectedRowIndex: null
    }
  },
  reducers: {
    config: (action, state) => ({
      config: action.payload,
      instance: knex({ client: 'pg', connection: action.payload }), // stored in state because it creates connection pools
      tables: [],
      fetchedTables: false,
      selectedTable: model.state.selectedTable // reset to default
    }),
    receiveTables: (action, state) => ({ tables: action.payload, fetchedTables: true }),
    receiveTable: (action, state) => ({ selectedTable: action.payload }),
    setSelectedRow: (action, state) => {
      const update = {selectedRowIndex: action.index}
      return { selectedTable: Object.assign({}, state.selectedTable, update) }
    },
    receiveRowUpdate: (action, state) => {
      const newRows = state.selectedTable.rows.slice()
      Object.assign(newRows[action.index], action.payload)
      return { selectedTable: Object.assign({}, state.selectedTable, {rows: newRows}) }
    }
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
          name: table,
          selectedRowIndex: null
        }

        // Map fields object to an array
        for (let field in fieldsResults) {
          fieldsResults[field].name = field
          payload.fields.push(fieldsResults[field])
        }

        send('db:receiveTable', {payload})
      })
      .catch(() => console.error('error fetching table', arguments))
    },
    updateRow: (action, state, send) => {
      const { table, index, payload } = action
      const primaryKey = state.selectedTable.primaryKey
      const row = state.selectedTable.rows[index]
      const conditions = {[primaryKey]: row[primaryKey]}
      state.instance(table).where(conditions).update(payload)
      .then((results) => results > 0 && send('db:receiveRowUpdate', { table, index, payload }))
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
