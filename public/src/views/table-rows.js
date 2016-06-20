// const choo = require('choo')

const dataGrid = require('./data-grid')

module.exports = (params, state, send) => {
  const table = params.name
  const connection = state.db.connection
  if (table && connection && state.table.name !== table) {
    send('table:getTable', { connection, table })
  }

  const { fields, rows, primaryKey, selectedRowIndex } = state.table
  const fieldsObject = fields.map((field) => ({ key: field.name, editable: (field.name !== primaryKey) }))

  return dataGrid({
    fields: fieldsObject,
    rows,
    selectedRowIndex,
    onSelectRow: (index) => send('table:setSelectedRow', {index}),
    onUpdateRow: (index, payload) => send('table:updateRow', {connection, index, payload}),
    onInsertRow: (payload) => send('table:insertRow', {connection, payload}),
    onDeleteRow: (index) => send('table:deleteRow', {connection, index})
  })
}
