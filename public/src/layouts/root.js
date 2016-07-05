const html = require('choo').view

const Alert = require('../components/alert')

module.exports = (view) => (params, state, send) => {
  const alert = state.app.alert.msg ? Alert({
    msg: state.app.alert.msg,
    onDismiss: (e) => send('app:clearAlert')
  }) : ''
  return html`
    <div>
      ${alert}
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
