const html = require('choo/html')
const getFormData = require('get-form-data')

const dataGrid = require('../components/data-grid')
const alert = require('../components/alert')

module.exports = (state, prev, send) => {
  const table = state.params.name
  const client = state.db.client

  let display
  if (state.query.error) {
    display = alert({ msg: state.query.error })
  } else if (state.query.result.rows.length) {
    const columns = state.query.result.fields.map((field) => field.name)
    display = dataGrid({
      columns,
      rows: state.query.result.rows
    })
  } else if (state.query.result.command) {
    msg = `${state.query.result.command} ${state.query.result.rowCount}`
    display = alert({ msg, type: 'success' })
  }

  return html`
    <div>
      <form onsubmit=${onsubmit}>
        <textarea id="sql" class="form-control" rows="4">select * from ${table}</textarea>
        <button type="submit" class="btn btn-primary">Query</button>
      </form>
      ${display}
    </div>`
  
  function onsubmit (e) {
    const formData = getFormData(e.target)
    const sql = formData.sql
    send('query:execute', { client, sql })
    e.preventDefault()
  }
}
