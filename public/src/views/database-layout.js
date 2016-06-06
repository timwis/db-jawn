const choo = require('choo')

const tableList = require('./table-list')
const tableRows = require('./table-rows')

module.exports = (params, state, send) => choo.view`
  <div>
    <h2>${state.db.config.database}</h2>
    <div class="row">
      <div class="col-md-3">
        ${tableList(params, state, send)}
      </div>
      <div class="col-md-9">
        ${tableRows(params, state, send)}
      </div>
    </div>
  </div>`
