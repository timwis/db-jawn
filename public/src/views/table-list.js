const choo = require('choo')

module.exports = (params, state, send) => {
  if (state.db.instance && !state.db.fetchedTables) {
    send('db:getTables')
  }

  return choo.view`
    <div class="list-group">
      ${state.db.tables.map(tableItem)}
    </div>`

  function tableItem (name) {
    const isActive = state.db.selectedTable.name === name
    return choo.view`
      <a href="#tables/${name}" class="list-group-item ${isActive && 'active'}">
        ${name}
      </a>`
  }
}
