const html = require('choo').view

const Tabs = require('../components/tabs')
const tableList = require('./table-list')
const tableRows = require('./table-rows')
const tableSchema = require('./table-schema')
const tableOptions = require('./table-options')

module.exports = (variant) => (params, state, send) => {
  const table = params.name
  const tabItems = [
    { key: 'rows', label: 'Rows', href: `#tables/${params.name}` },
    { key: 'schema', label: 'Schema', href: `#tables/${params.name}/schema` },
    { key: 'options', label: 'Options', href: `#tables/${params.name}/options` }
  ]

  let subView
  switch (variant) {
    case 'schema': subView = tableSchema; break
    case 'options': subView = tableOptions; break
    default: subView = tableRows
  }
  return html`
    <div>
      <h2>${state.db.config.database}</h2>
      <div class="row">
        <div class="${table ? 'col-md-3' : 'col-md-12'}">
          ${tableList(params, state, send)}
        </div>
        ${table ? html`
          <div class="col-md-9">
            <div class="database-tabs">
              ${Tabs(tabItems, variant)}
            </div>
            <div class="database-table">
              ${subView(params, state, send)}
            </div>
          </div>` : ''}
      </div>
    </div>`
}
