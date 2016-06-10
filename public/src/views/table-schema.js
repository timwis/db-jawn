const dataGrid = require('./data-grid')

module.exports = (params, state, send) => {
  const table = params.name
  if (table && state.db.instance && state.db.selectedTable.name !== params.name) {
    send('db:getTable', { name: table })
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
    rows: state.db.selectedTable.fields,
    selectedRowIndex: state.db.selectedTable.selectedRowIndex,
    onSelectRow: (index) => send('db:setSelectedRow', {index})
    // onUpdateRow: (index, payload) => send('db:updateRow', {index, table, payload}),
    // onInsertRow: (payload) => send('db:insertRow', {table, payload})
  })
}
