// const choo = require('choo')

const dataGrid = require('./data-grid')

module.exports = (params, state, send) => {
  const table = params.name
  const instance = state.db.instance
  if (table && instance && state.table.name !== table) {
    send('table:getTable', { instance, table })
  }

  const { fields, rows, primaryKey, selectedRowIndex } = state.table
  const fieldsObject = fields.map((field) => ({ key: field.name, editable: (field.name !== primaryKey) }))

  return dataGrid({
    fields: fieldsObject,
    rows,
    selectedRowIndex,
    onSelectRow: (index) => send('table:setSelectedRow', {index}),
    onUpdateRow: (index, payload) => send('table:updateRow', {instance, index, payload}),
    onInsertRow: (payload) => send('table:insertRow', {instance, payload})
  })
}
