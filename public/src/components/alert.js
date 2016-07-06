const html = require('choo/html')
const noop = () => {}

/**
 * Creates an alert component
 * @param {string} msg Message to display
 * @param {string} [type] Bootstrap conext class [success|warning|danger|info] default: danger
 * @callback [onDismiss] Function to call when alert is dismissed
 */
module.exports = ({ msg, type = 'danger', onDismiss = {} }) => {
  return html`
  <div class="global-alert alert alert-${type}" role="alert">
    ${msg}
    ${onDismiss !== noop
      ? html`
        <button onclick=${onDismiss} type="button" class="close" aria-label="Close">
          <span aria-hidden="true">x</span>
        </button>`
      : ''}
  </div>`
}
