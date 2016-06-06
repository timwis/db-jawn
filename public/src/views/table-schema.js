const choo = require('choo')

module.exports = (params, state, send) => {
  if (params.name && state.db.instance && state.db.selectedTable.name !== params.name) {
    send('db:getTable', { name: params.name })
  }

  const fields = state.db.selectedTable.fields
  return choo.view`
    <table class="table table-striped table-sm">
      <thead>
        <th>Name</th>
        <th>Type</th>
        <th>Length</th>
        <th>Null</th>
        <th>Default</th>
      </thead>
      <tbody>
      ${fields.map((field) => choo.view`
        <tr>
          <td>${field.name}</td>
          <td>${field.type}</td>
          <td>${field.maxLength}</td>
          <td>${field.nullable}</td>
          <td>${field.defaultValue}</td>
        </tr>`)}
      </tbody>
    </table>`
}
