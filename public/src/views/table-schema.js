const dataGrid = require('./data-grid')

module.exports = (params, state, send) => {
  const table = params.name
  const instance = state.db.instance
  if (table && instance && state.table.name !== table) {
    send('table:getTable', { instance, table })
  }

  const validTypes = ['integer', 'text', 'character varying']
  const columns = [
    {key: 'name', title: 'Name', validate: (value, row) => value.length > 0},
    {key: 'type', title: 'Type', validate: (value, row) => validTypes.includes(value)},
    {key: 'maxLength', title: 'Length', validate: (value, row) => value.length === 0 || !isNaN(value)},
    {key: 'nullable', title: 'Null'},
    {key: 'defaultValue', title: 'Default'}
  ]

  return dataGrid({
    fields: columns,
    rows: state.table.fields,
    selectedRowIndex: state.table.selectedRowIndex,
    onSelectRow: (index) => send('table:setSelectedRow', {index})
    // onUpdateRow: (index, payload) => send('table:updateRow', {index, table, payload}),
    // onInsertRow: (payload) => send('table:insertRow', {table, payload})
  })
}
