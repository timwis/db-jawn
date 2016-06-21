const queries = require('../queries')

module.exports = {
  namespace: 'table',
  state: {
    name: '',
    primaryKey: '',
    columns: [],
    rows: [],
    selectedRowIndex: null,
    rowCount: 0,
    limit: 50,
    offset: 0
  },
  reducers: {
    receiveTable: (action, state) => {
      return Object.assign({}, action.payload, { selectedRowIndex: null, offset: 0 })
    },
    receiveRows: (action, state) => {
      return { rows: action.rows }
    },
    setOffset: (action, state) => {
      return { offset: action.newOffset }
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
      return { rows: newRows, rowCount: state.rowCount - 1 }
    },
    receiveNewRow: (action, state) => {
      const newRows = [ ...state.rows, action.payload ]
      return { rows: newRows, rowCount: state.rowCount + 1 }
    },
    receiveColumnUpdate: (action, state) => {
      const newColumns = state.columns.slice()
      Object.assign(newColumns[action.index], action.payload)
      return { columns: newColumns }
    },
    receiveNewColumn: (action, state) => {
      const newColumns = [ ...state.columns, action.payload ]
      return { columns: newColumns }
    },
    receiveColumnDeletion: (action, state) => {
      const newColumns = [
        ...state.columns.slice(0, action.index),
        ...state.columns.slice(action.index + 1)
      ]
      return { columns: newColumns }
    }
  },
  effects: {
    getTable: (action, state, send) => {
      const { connection, table } = action
      Promise.all([
        queries.getSchema(connection, table),
        queries.getPrimaryKey(connection, table),
        queries.getRows(connection, table, state.limit, 0),
        queries.getRowCount(connection, table)
      ])
      .then((results) => {
        const [columnsResults, primaryKey, rows, rowCount] = results
        const payload = {
          primaryKey,
          columns: [],
          rows,
          name: table,
          rowCount: +rowCount
        }

        // Map columns object to an array
        for (let column in columnsResults) {
          columnsResults[column].name = column
          payload.columns.push(columnsResults[column])
        }
        return payload
      })
      .then((payload) => send('table:receiveTable', {payload}))
    },
    paginate: (action, state, send) => {
      const { connection, table, newOffset } = action
      queries.getRows(connection, table, state.limit, newOffset)
      .then((rows) => {
        send('table:receiveRows', {rows})
        send('table:setOffset', {newOffset})
      })
    },
    updateRow: (action, state, send) => {
      const { connection, index, payload } = action
      if (Object.keys(payload).length) {
        const row = state.rows[index]
        const primaryKey = state.primaryKey

        // If primary key exists, use it as the condition;
        // otherwise, use every value of row
        const conditions = primaryKey
          ? {[primaryKey]: row[primaryKey]}
          : row

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
      const row = state.rows[index]
      const primaryKey = state.primaryKey

      // If primary key exists, use it as the condition;
      // otherwise, use every value of row
      const conditions = primaryKey
        ? {[primaryKey]: row[primaryKey]}
        : row

      queries.deleteRow(connection, state.name, conditions)
      .then((deletedCount) => {
        if (deletedCount > 0) send('table:receiveRowDeletion', {index})
      })
    },
    updateColumn: (action, state, send) => {
      const { connection, index, payload } = action
      if (Object.keys(payload).length) {
        const column = state.columns[index].name
        const query = queries.updateColumn(connection, state.name, column, payload)

        // Column renaming should be run *after* alterations because alterations use original name
        if (payload.name) {
          query.then(() => queries.renameColumn(connection, state.name, column, payload.name))
        }

        query.then((results) => {
          send('table:receiveColumnUpdate', { index, payload })
        })
      }
    },
    insertColumn: (action, state, send) => {
      const { connection, payload } = action
      if (Object.keys(payload).length) {
        queries.insertColumn(connection, state.name, payload)
        .then((results) => queries.getSchema(connection, state.name))
        .then((columnsResults) => {
          const newColumn = columnsResults[payload.name] || {}
          newColumn.name = payload.name // not included by default in knex column object
          send('table:receiveNewColumn', { payload: newColumn })
        })
      }
    },
    deleteColumn: (action, state, send) => {
      const { connection, index } = action
      const column = state.columns[index]
      queries.deleteColumn(connection, state.name, column.name)
      .then((results) => {
        send('table:receiveColumnDeletion', {index})
      })
    }
  }
}
