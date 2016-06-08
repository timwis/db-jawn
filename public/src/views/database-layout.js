const choo = require('choo')

const tableList = require('./table-list')
const tableRows = require('./table-rows')
const tableSchema = require('./table-schema')

module.exports = (variant) => (params, state, send) => choo.view`
  <div>
    <h2>${state.db.config.database}</h2>
    <div class="row">
      <div class="col-md-3">
        ${tableList(params, state, send)}
      </div>
      <div class="col-md-9">
        ${variant === 'schema'
          ? tableSchema(params, state, send)
          : tableRows(params, state, send)}
      </div>
    </div>
  </div>`