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
    receiveRowDeletion: (action, state) => {
      const newRows = [
        ...state.rows.slice(0, action.index),
        ...state.rows.slice(action.index + 1)
      ]
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
    },
    receiveFieldDeletion: (action, state) => {
      const newFields = [
        ...state.fields.slice(0, action.index),
        ...state.fields.slice(action.index + 1)
      ]
      return { fields: newFields }
    }
  },
  effects: {
    getTable: (action, state, send) => {
      const { connection, table } = action
      Promise.all([
        queries.getSchema(connection, table),
        queries.getPrimaryKey(connection, table),
        queries.getRows(connection, table)
      ])
      .then((results) => {
        const [fieldsResults, primaryKey, rows] = results
        const payload = {
          primaryKey,
          fields: [],
          rows,
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
      const { connection, index, payload } = action
      if (Object.keys(payload).length) {
        const primaryKey = state.primaryKey
        const row = state.rows[index]
        const conditions = {[primaryKey]: row[primaryKey]}
        queries.updateRow(connection, state.name, payload, conditions)
        .then((results) => {
          if (results > 0) send('table:receiveRowUpdate', { index, payload })
        })
      }
    },
    insertRow: (action, state, send) => {
      const { connection, payload } = action
      if (Object.keys(payload).length) {
        queries.insertRow(connection, state.name, payload)
        .then((results) => {
          if (results.length > 0) send('table:receiveNewRow', { payload: results[0] })
        })
      }
    },
    deleteRow: (action, state, send) => {
      const { connection, index } = action
      const primaryKey = state.primaryKey
      const row = state.rows[index]
      const conditions = {[primaryKey]: row[primaryKey]}
      queries.deleteRow(connection, state.name, conditions)
      .then((deletedCount) => {
        if (deletedCount > 0) send('table:receiveRowDeletion', {index})
      })
    },
    updateField: (action, state, send) => {
      const { connection, index, payload } = action
      if (Object.keys(payload).length) {
        const column = state.fields[index].name
        queries.updateField(connection, state.name, column, payload)
        .then((results) => {
          send('table:receiveFieldUpdate', { index, payload })
        })
      }
    },
    insertField: (action, state, send) => {
      const { connection, payload } = action
      if (Object.keys(payload).length) {
        queries.insertField(connection, state.name, payload)
        .then((results) => queries.getSchema(connection, state.name))
        .then((fieldsResults) => {
          const newField = fieldsResults[payload.name] || {}
          newField.name = payload.name // not included by default in knex field object
          send('table:receiveNewField', { payload: newField })
        })
      }
    },
    deleteField: (action, state, send) => {
      const { connection, index } = action
      const field = state.fields[index]
      queries.deleteField(connection, state.name, field.name)
      .then((results) => {
        send('table:receiveFieldDeletion', {index})
      })
    }
  }
}
