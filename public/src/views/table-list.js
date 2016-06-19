const html = require('choo').view
const notie = require('notie')

module.exports = (params, state, send) => {
  if (state.db.instance && !state.db.fetchedTables) {
    send('db:getTableList')
  }

  return html`
    <div class="list-group">
      ${state.db.tables.map(tableItem)}
      ${addTableItem()}
    </div>`

  function tableItem (name, index) {
    const isActive = state.table.name === name
    return html`
      <a href="#tables/${name}" class="list-group-item ${isActive && 'active'}">
        ${name}
        <span class="pull-xs-right">
          <a href="#tables/${name}/schema"><i class="fa fa-pencil"></i></a>
          <a href="#" onclick=${(e) => {
            notie.confirm(`Delete table ${name}?`, 'Yes, delete', 'Cancel', () => send('db:deleteTable', {index}))
            e.preventDefault()
          }}><i class="fa fa-trash"></i></a>
        </span>
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
