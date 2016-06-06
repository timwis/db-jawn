const choo = require('choo')
const getFormData = require('get-form-data')

module.exports = (params, state, send) => {
  const onSubmit = (e) => {
    const payload = getFormData(e.target)
    send('db:config', {payload})
    window.location.hash = 'tables'
    e.preventDefault()
  }

  const config = state.db.config
  return choo.view`
    <div>
      <h1>Connect</h1>
      <form onsubmit=${onSubmit}>
        <fieldset class="form-group">
          <label for="hostname">Hostname</label>
          <input value="${config.hostname}" id="hostname" placeholder="localhost" class="form-control">
        </fieldset>

        <fieldset class="form-group">
          <label for="username">Username</label>
          <input value="${config.username}" id="username" placeholder="root" class="form-control">
        </fieldset>

        <fieldset class="form-group">
          <label for="password">Password</label>
          <input value="${config.password}" id="password" type="password" class="form-control">
        </fieldset>

        <fieldset class="form-group">
          <label for="database">Database name</label>
          <input value="${config.database}" id="database" placeholder="my_db" class="form-control">
        </fieldset>

        <button type="submit" class="btn btn-primary">Save</button>
      </form>
    </div>`
}
