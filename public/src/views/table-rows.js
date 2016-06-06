const choo = require('choo')

module.exports = (params, state, send) => {
  if (params.name && state.db.instance && state.db.selectedTable.name !== params.name) {
    send('db:getTable', { name: params.name })
  }

  const fields = state.db.selectedTable.fields
  const rows = state.db.selectedTable.rows
  return choo.view`
    <table class="table table-striped table-sm">
      ${fields.length ? choo.view`
        <thead>
          <tr>
            ${fields.map((field) => choo.view`<th>${field.name}</th>`)}
          </tr>
        </thead>` : ''}
      ${rows.length ? choo.view`
        <tbody>
          ${rows.map((row) => choo.view`
            <tr>
              ${fields.map((field) => choo.view`<td>${row[field.name]}</td>`)}
            </tr>`)}
        </tbody>` : ''}
    </table>`
}
