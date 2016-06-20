const dataGrid = require('../components/data-grid')

module.exports = (params, state, send) => {
  const table = params.name
  const connection = state.db.connection
  if (table && connection && state.table.name !== table) {
    send('table:getTable', { connection, table })
  }

  const { columns, rows, primaryKey, selectedRowIndex } = state.table
  const columnsObject = columns.map((column) => ({ key: column.name, editable: (column.name !== primaryKey) }))

  return dataGrid({
    columns: columnsObject,
    rows,
    selectedRowIndex,
    onSelectRow: (index) => send('table:setSelectedRow', {index}),
    onUpdateRow: (index, payload) => send('table:updateRow', {connection, index, payload}),
    onInsertRow: (payload) => send('table:insertRow', {connection, payload}),
    onDeleteRow: (index) => send('table:deleteRow', {connection, index})
  })
}
