const choo = require('choo')
const getFormData = require('get-form-data')

const Dropdown = require('../components/dropdown')

module.exports = (params, state, send) => {
  const onSubmit = (e) => {
    const payload = getFormData(e.target)
    send('db:config', {payload})
    window.location.hash = 'tables'
    e.preventDefault()
  }

  const config = state.db.config

  const dropdown = Dropdown({
    items: [{ value: 'pg', label: 'Postgres' }],
    selected: config.clientType,
    attributes: { id: 'clientType', class: 'form-control' }
  })

  return choo.view`
    <div>
      <h1>Connect</h1>
      <form onsubmit=${onSubmit}>
        <fieldset class="form-group">
          <label for="clientType">Client</label>
          ${dropdown}
        </fieldset>

        <fieldset class="form-group">
          <label for="host">Host</label>
          <input value="${config.host}" id="host" placeholder="localhost" class="form-control">
        </fieldset>

        <fieldset class="form-group">
          <label for="user">User</label>
          <input value="${config.user}" id="user" placeholder="root" class="form-control">
        </fieldset>

        <fieldset class="form-group">
          <label for="password">Password</label>
          <input value="${config.password}" id="password" type="password" class="form-control">
        </fieldset>

        <fieldset class="form-group">
          <label for="database">Database name</label>
          <input value="${config.database}" id="database" placeholder="my_db" class="form-control">
        </fieldset>

        <div class="checkbox">
          <label>
            <input type="checkbox" id="ssl" checked="${config.ssl ? 'true' : 'false'}"> Use SSL
          </label>
        </div>

        <button type="submit" class="btn btn-primary">Save</button>
      </form>
    </div>`
}
