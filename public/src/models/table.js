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
    receiveTable: (data, state) => {
      return Object.assign({}, data.payload, { selectedRowIndex: null, offset: 0 })
    },
    receiveRows: (data, state) => {
      return { rows: data.rows }
    },
    setOffset: (data, state) => {
      return { offset: data.newOffset }
    },
    setSelectedRow: (data, state) => {
      return { selectedRowIndex: data.index }
    },
    receiveRowUpdate: (data, state) => {
      const newRows = state.rows.slice()
      Object.assign(newRows[data.index], data.payload)
      return { rows: newRows }
    },
    receiveRowDeletion: (data, state) => {
      const newRows = [
        ...state.rows.slice(0, data.index),
        ...state.rows.slice(data.index + 1)
      ]
      return { rows: newRows, rowCount: state.rowCount - 1 }
    },
    receiveNewRow: (data, state) => {
      const newRows = [ ...state.rows, data.payload ]
      return { rows: newRows, rowCount: state.rowCount + 1 }
    },
    receiveColumnUpdate: (data, state) => {
      const newColumns = state.columns.slice()
      Object.assign(newColumns[data.index], data.payload)
      return { columns: newColumns }
    },
    receiveNewColumn: (data, state) => {
      const newColumns = [ ...state.columns, data.payload ]
      return { columns: newColumns }
    },
    receiveColumnDeletion: (data, state) => {
      const newColumns = [
        ...state.columns.slice(0, data.index),
        ...state.columns.slice(data.index + 1)
      ]
      return { columns: newColumns }
    }
  },
  effects: {
    getTable: (data, state, send, done) => {
      const { client, table } = data
      Promise.all([
        client.getSchema(table),
        client.getPrimaryKey(table),
        client.getRows(table, state.limit, 0),
        client.getRowCount(table)
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
      .then((payload) => send('table:receiveTable', {payload}, done))
    },
    paginate: (data, state, send, done) => {
      const { client, table, newOffset } = data
      client.getRows(table, state.limit, newOffset)
      .then((rows) => {
        send('table:receiveRows', {rows}, () => {
          send('table:setOffset', {newOffset}, done)
        })
      })
    },
    updateRow: (data, state, send, done) => {
      const { client, index, payload } = data
      if (Object.keys(payload).length) {
        const row = state.rows[index]
        const primaryKey = state.primaryKey

        // If primary key exists, use it as the condition;
        // otherwise, use every value of row
        const conditions = primaryKey
          ? {[primaryKey]: row[primaryKey]}
          : row

        client.updateRow(state.name, payload, conditions)
        .then((results) => {
          if (results > 0) send('table:receiveRowUpdate', { index, payload }, done)
        })
      }
    },
    insertRow: (data, state, send, done) => {
      const { client, payload } = data
      if (Object.keys(payload).length) {
        client.insertRow(state.name, payload)
        .then((results) => {
          if (results.length > 0) send('table:receiveNewRow', { payload: results[0] }, done)
        })
      }
    },
    deleteRow: (data, state, send, done) => {
      const { client, index } = data
      const row = state.rows[index]
      const primaryKey = state.primaryKey

      // If primary key exists, use it as the condition;
      // otherwise, use every value of row
      const conditions = primaryKey
        ? {[primaryKey]: row[primaryKey]}
        : row

      client.deleteRow(state.name, conditions)
      .then((deletedCount) => {
        if (deletedCount > 0) send('table:receiveRowDeletion', {index}, done)
      })
    },
    updateColumn: (data, state, send, done) => {
      const { client, index, payload } = data
      if (Object.keys(payload).length) {
        const column = state.columns[index].name
        const query = client.updateColumn(state.name, column, payload)

        // Column renaming should be run *after* alterations because alterations use original name
        if (payload.name) {
          query.then(() => client.renameColumn(state.name, column, payload.name))
        }

        query.then((results) => {
          send('table:receiveColumnUpdate', { index, payload }, done)
        })
      }
    },
    insertColumn: (data, state, send, done) => {
      const { client, payload } = data
      if (Object.keys(payload).length) {
        client.insertColumn(state.name, payload)
        .then((results) => client.getSchema(state.name))
        .then((columnsResults) => {
          const newColumn = columnsResults[payload.name] || {}
          newColumn.name = payload.name // not included by default in knex column object
          send('table:receiveNewColumn', { payload: newColumn }, done)
        })
      }
    },
    deleteColumn: (data, state, send, done) => {
      const { client, index } = data
      const column = state.columns[index]
      client.deleteColumn(state.name, column.name)
      .then((results) => {
        send('table:receiveColumnDeletion', {index}, done)
      })
    }
  }
}
