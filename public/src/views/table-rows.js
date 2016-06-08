const choo = require('choo')

module.exports = (params, state, send) => {
  const tableName = params.name
  if (tableName && state.db.instance && state.db.selectedTable.name !== params.name) {
    send('db:getTable', { name: tableName })
  }

  const fields = state.db.selectedTable.fields
  const rows = state.db.selectedTable.rows
  const selectedRowIndex = state.db.selectedTable.selectedRowIndex
  const newRowIndex = state.db.selectedTable.rows.length // (highest index plus one - a bit hacky)
  const changesObserved = {}

  return choo.view`
    <table class="table table-bordered table-hover table-sm">

      ${fields.length ? choo.view`
        <thead>
          <tr>
            <th></th>
            ${fields.map((field) => choo.view`<th>${field.name}</th>`)}
          </tr>
        </thead>` : ''}

      ${rows.length ? choo.view`
        <tbody>
          ${rows.map((row, index) => choo.view`
            <tr class="${selectedRowIndex === index ? 'table-info' : ''}">
                <td>${selectedRowIndex === index ? saveEditButton(index) : editButton(index)}</td>
              ${fields.map((field) => choo.view`
                <td contenteditable="${selectedRowIndex === index ? 'true' : 'false'}"
                  oninput=${(e) => changesObserved[field.name] = e.target.innerText}>
                  ${row[field.name]}
                </td>`)}
            </tr>`)}

            <tr class="${selectedRowIndex === newRowIndex ? 'table-info' : ''}">
              <td>${selectedRowIndex === newRowIndex ? saveNewRowButton() : editButton(newRowIndex)}</td>
              ${fields.map((field) => choo.view`
                <td contenteditable="${selectedRowIndex === newRowIndex ? 'true' : 'false'}"
                  oninput=${(e) => changesObserved[field.name] = e.target.innerText}></td>`)}
            </tr>
        </tbody>` : ''}

    </table>`

  function editButton (index) {
    return choo.view`<i class="fa fa-edit" onclick=${(e) => send('db:setSelectedRow', {index})}></i>`
  }

  function saveEditButton (index) {
    return choo.view`
      <i class="fa fa-save" onclick=${(e) => {
        send('db:setSelectedRow', {index: null})
        send('db:updateRow', {index, table: tableName, payload: changesObserved})
      }}></i>`
  }

  function saveNewRowButton () {
    return choo.view`
      <i class="fa fa-save" onclick=${(e) => {
        send('db:setSelectedRow', {index: null})
        send('db:insertRow', {table: tableName, payload: changesObserved})
      }}></i>`
  }
}
