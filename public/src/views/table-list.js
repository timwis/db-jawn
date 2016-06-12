const choo = require('choo')

module.exports = (params, state, send) => {
  if (state.db.instance && !state.db.fetchedTables) {
    send('db:getTableList')
  }

  return choo.view`
    <div class="list-group">
      ${state.db.tables.map(tableItem)}
    </div>`

  function tableItem (name) {
    const isActive = state.table.name === name
    return choo.view`
      <a href="#tables/${name}" class="list-group-item ${isActive && 'active'}">
        ${name}
        <span class="pull-xs-right">
          <a href="#tables/${name}/schema"><i class="fa fa-edit"></i></a>
        </span>
      </a>`
  }
}
