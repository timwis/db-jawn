const dataGrid = require('./data-grid')

module.exports = (params, state, send) => {
  const table = params.name
  const connection = state.db.connection
  if (table && connection && state.table.name !== table) {
    send('table:getTable', { connection, table })
  }

  const validTypes = ['integer', 'text', 'character varying']
  const columns = [
    {
      key: 'name',
      title: 'Name',
      validate: (value, row) => value.length > 0
    },
    {
      key: 'type',
      title: 'Type',
      validate: (value, row) => validTypes.includes(value)
    },
    {
      key: 'maxLength',
      title: 'Length',
      validate: (value, row) => value.length === 0 || (!isNaN(value) && row.type.length > 0)
    },
    {
      key: 'nullable',
      title: 'Null',
      validate: (value, row) => value.length === 0 || ['true', 'false'].includes(value)
    },
    {
      key: 'defaultValue',
      title: 'Default',
      validate: (value, row) => value.length > 0 || row.nullable !== 'false'
    }
  ]

  return dataGrid({
    fields: columns,
    rows: state.table.fields,
    selectedRowIndex: state.table.selectedRowIndex,
    onSelectRow: (index) => send('table:setSelectedRow', {index}),
    onUpdateRow: (index, payload) => send('table:updateField', {connection, index, payload}),
    onInsertRow: (payload) => send('table:insertField', {connection, payload}),
    onDeleteRow: (index) => send('table:deleteField', {connection, index})
  })
}
