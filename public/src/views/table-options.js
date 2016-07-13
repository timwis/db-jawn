const html = require('choo/html')
const notie = require('notie')

module.exports = (state, prev, send) => {
  const table = state.params.name
  return html`
    <div>
      <button type="button" class="btn btn-danger" onclick=${(e) => {
        notie.confirm(`Delete table ${table}?`, 'Yes, delete', 'Cancel', () => {
          send('db:deleteTable', { name: table })
        })
      }}>
        Delete table "${table}"
      </button>
    </div>`
}
