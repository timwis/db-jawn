const queries = require('../queries')

module.exports = {
  namespace: 'table',
  state: {
    name: '',
    primaryKey: '',
    fields: [],
    rows: [],
    selectedRowIndex: null
  },
  reducers: {
    receiveTable: (action, state) => {
      return action.payload
    },
    setSelectedRow: (action, state) => {
      return { selectedRowIndex: action.index }
    },
    receiveRowUpdate: (action, state) => {
      const newRows = state.rows.slice()
      Object.assign(newRows[action.index], action.payload)
      return { rows: newRows }
    },
    receiveNewRow: (action, state) => {
      const newRows = [ ...state.rows, action.payload ]
      return { rows: newRows }
    },
    receiveFieldUpdate: (action, state) => {
      const newFields = state.fields.slice()
      Object.assign(newFields[action.index], action.payload)
      return { fields: newFields }
    },
    receiveNewField: (action, state) => {
      const newFields = [ ...state.fields, action.payload ]
      return { fields: newFields }
    }
  },
  effects: {
    getTable: (action, state, send) => {
      const { instance, table } = action
      Promise.all([
        instance(table).columnInfo(),
        instance.raw(queries.getPrimaryKey(table)),
        instance.raw(queries.getRows(table))
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
        return payload
      })
      .then((payload) => send('table:receiveTable', {payload}))
    },
    updateRow: (action, state, send) => {
      const { instance, index, payload } = action
      if (Object.keys(payload).length) {
        const primaryKey = state.primaryKey
        const row = state.rows[index]
        const conditions = {[primaryKey]: row[primaryKey]}
        instance(state.name).where(conditions).update(payload)
        .then((results) => {
          if (results > 0) send('table:receiveRowUpdate', { index, payload })
        })
      }
    },
    insertRow: (action, state, send) => {
      const { instance, payload } = action
      if (Object.keys(payload).length) {
        instance(state.name).insert(payload, '*')
        .then((results) => {
          if (results.length > 0) send('table:receiveNewRow', { payload: results[0] })
        })
      }
    },
    updateField: (action, state, send) => {
      const { instance, index, payload } = action
      if (Object.keys(payload).length) {
        const column = state.fields[index].name
        const sql = queries.updateField(state.name, column, payload)
        instance.raw(sql)
        .then((results) => {
          send('table:receiveFieldUpdate', { index, payload })
        })
      }
    },
    insertField: (action, state, send) => {
      const { instance, payload } = action
      if (Object.keys(payload).length) {
        const sql = queries.insertField(state.name, payload)
        instance.raw(sql)
        .then((results) => instance(state.name).columnInfo())
        .then((fieldsResults) => {
          const newField = fieldsResults[payload.name] || {}
          newField.name = payload.name // not included by default in knex field object
          send('table:receiveNewField', { payload: newField })
        })
      }
    }
  }
}
