const html = require('choo').view
const noop = () => {}

/**
 * Create a pagination component
 * @param {number} offset Current pagination offset
 * @param {number} limit Pagination limit
 * @param {number} total Number of total records
 * @callback [onPaginate] Function to execute when a paginate button is clicked (newOffset)
 */
module.exports = ({ offset, limit, total, onPaginate = noop }) => {
  return html`
    <nav>
      <ul class="pager">
        ${arrowButton('previous')}
        ${arrowButton('next')}
      </ul>
    </nav>`

  function arrowButton (dir) {
    const label = dir === 'previous' ? 'Previous' : 'Next'

    const newOffset = dir === 'previous'
      ? offset - limit
      : offset + limit

    const disabled = newOffset < 0 || newOffset >= total

    return html`
      <li class="${disabled ? 'disabled' : ''}">
        <a href="#" onclick=${(e) => {
          if (!disabled) onPaginate(newOffset)
          e.preventDefault()
        }}>
          ${label}
        </a>
      </li>`
  }
}
