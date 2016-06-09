// const choo = require('choo')

const dataGrid = require('./data-grid')

module.exports = (params, state, send) => {
  const table = params.name
  if (table && state.db.instance && state.db.selectedTable.name !== params.name) {
    send('db:getTable', { name: table })
  }

  const { fields, rows, selectedRowIndex } = state.db.selectedTable

  return dataGrid({
    fields: fields.map((field) => field.name),
    rows,
    selectedRowIndex,
    onSelectRow: (index) => send('db:setSelectedRow', {index}),
    onUpdateRow: (index, payload) => send('db:updateRow', {index, table, payload}),
    onInsertRow: (payload) => send('db:insertRow', {table, payload})
  })
}
