const html = require('choo/html')

const Tabs = require('../components/tabs')
const tableList = require('../views/table-list')

module.exports = (view, id) => (state, prev, send) => {
  const table = state.params.name
  const tabItems = [
    { key: 'rows', label: 'Rows', href: `#tables/${table}` },
    { key: 'schema', label: 'Schema', href: `#tables/${table}/schema` },
    { key: 'query', label: 'Query', href: `#tables/${table}/query` },
    { key: 'options', label: 'Options', href: `#tables/${table}/options` }
  ]

  return html`
    <div>
      <h2>${state.db.config.database}</h2>
      <div class="row">
        <div class="${table ? 'col-md-3' : 'col-md-12'}">
          ${tableList(state, prev, send)}
        </div>
        ${table ? html`
          <div class="col-md-9">
            <div class="database-tabs">
              ${Tabs(tabItems, id)}
            </div>
            <div class="database-table">
              ${view(state, prev, send)}
            </div>
          </div>` : ''}
      </div>
    </div>`
}
