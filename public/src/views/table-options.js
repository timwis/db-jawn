const html = require('choo').view
const notie = require('notie')

module.exports = (params, state, send) => html`
  <div>
    <button type="button" class="btn btn-danger" onclick=${(e) => {
      notie.confirm(`Delete table ${params.name}?`, 'Yes, delete', 'Cancel', () => {
        send('db:deleteTable', { name: params.name })
        window.location.hash = 'tables'
      })
    }}>
      Delete table "${params.name}"
    </button>
  </div>`
