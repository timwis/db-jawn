const html = require('choo').view
const notie = require('notie')

const DataGrid = require('../components/data-grid')
const Pagination = require('../components/pagination')

module.exports = (params, state, send) => {
  const table = params.name
  const client = state.db.client
  if (table && client && state.table.name !== table) {
    send('table:getTable', { client, table })
  }

  const { columns, rows, primaryKey, selectedRowIndex, offset, limit, rowCount } = state.table
  const columnsObject = columns.map((column) => ({ key: column.name, editable: (column.name !== primaryKey) }))

  const dataGrid = DataGrid({
    columns: columnsObject,
    rows,
    selectedRowIndex,
    onSelectRow: (index) => send('table:setSelectedRow', {index}),
    onUpdateRow: (index, payload) => send('table:updateRow', {client, index, payload}),
    onInsertRow: (payload) => send('table:insertRow', {client, payload}),
    onDeleteRow: (index) => {
      notie.confirm('Delete this row?', 'Yes, delete', 'Cancel', () => send('table:deleteRow', {client, index}))
    }
  })

  const pagination = Pagination({
    offset,
    limit,
    total: rowCount,
    onPaginate: (newOffset) => send('table:paginate', {client, table, newOffset})
  })

  return html`
    <div>
      ${dataGrid}
      <small>
        Showing ${offset} - ${Math.min(rowCount, offset + limit)}
        of ${rowCount} rows
      </small>
      ${pagination}
    </div>`
}
