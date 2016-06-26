const notie = require('notie')

const dataGrid = require('../components/data-grid')
const client = require('../clients/postgres')

module.exports = (params, state, send) => {
  const table = params.name
  const connection = state.db.connection
  if (table && connection && state.table.name !== table) {
    send('table:getTable', { connection, table })
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      validate: (value, row) => value.length > 0
    },
    {
      key: 'type',
      title: 'Type',
      validate: (value, row) => client.validTypes.includes(value)
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
    columns: columns,
    rows: state.table.columns,
    selectedRowIndex: state.table.selectedRowIndex,
    onSelectRow: (index) => send('table:setSelectedRow', {index}),
    onUpdateRow: (index, payload) => send('table:updateColumn', {connection, index, payload}),
    onInsertRow: (payload) => send('table:insertColumn', {connection, payload}),
    onDeleteRow: (index) => {
      const columnName = state.table.columns[index].name
      notie.confirm(`Delete column ${columnName}?`, 'Yes, delete', 'Cancel', () => send('table:deleteColumn', {connection, index}))
    }
  })
}
