const html = require('choo').view
const notie = require('notie')

module.exports = (view) => (params, state, send) => {
  if (state.app.alert.msg) {
    const alert = state.app.alert
    notie.alert(alert.type, alert.msg, alert.duration)
    send('app:clearAlert')
  }
  return html`
    <div>
      <nav class="navbar navbar-light bg-faded">
        <a class="navbar-brand" href="#">Dataface</a>
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#">Connect</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#tables">Tables</a>
          </li>
        </ul>
      </nav>
      <div id="main" class="container-fluid">
        ${view(params, state, send)}
      </div>
    </div>`
}
