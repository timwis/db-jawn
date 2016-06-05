const choo = require('choo')

module.exports = (params, state, send) => {
  return choo.view`
    <div class="list-group">
      ${state.db.tables.map(tableItem)}
    </div>`

  function tableItem (name) {
    const isActive = params.name === name
    return choo.view`
      <a href="#tables/${name}" class="list-group-item ${isActive && 'active'}">
        ${name}
      </a>`
  }
}
