const html = require('choo').view

module.exports = (params, state, send) => {
  if (state.db.connection && !state.db.fetchedTables) {
    send('db:getTableList')
  }

  return html`
    <div class="list-group">
      ${state.db.tables.map(tableItem)}
      ${addTableItem()}
    </div>`

  function tableItem (name, index) {
    const isActive = params.name === name
    return html`
      <a href="#tables/${name}" class="list-group-item ${isActive && 'active'}">
        ${name}
      </a>`
  }

  function addTableItem () {
    const tableName = html`<input type="text" class="form-control" placeholder="Table name">`
    return state.db.isCreatingTable
    ? html`
      <button type="button" class="list-group-item">
        <form onsubmit=${(e) => {
          send('db:setCreatingTable', { value: false })
          send('db:createTable', { name: tableName.value })
          e.preventDefault()
        }}>
          <div class="input-group">
            ${tableName}
            <span class="input-group-btn">
              <button class="btn btn-secondary" type="submit">
                <i class="fa fa-save"></i>
              </button>
            </span>
          </div>
        </form>
      </button>
    `
    : html`
      <button type="button" class="list-group-item" onclick=${() => {
        send('db:setCreatingTable', { value: true })
      }}>
        <i class="fa fa-plus"></i>
        Add table
      </button>`
  }
}
