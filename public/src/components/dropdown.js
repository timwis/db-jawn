const html = require('choo').view

/**
 * Create a <select> element
 * @param {string[]|Object[]} items List of value strings or objects with value and label properties
 * @param {string} selected Value of selected item
 * @param {Object} attributes Object of attributes to apply to <select> element
 */
module.exports = ({ items = [], selected, attributes = {} }) => {
  return html`
    <select ${attributes}>
      ${items.map((item) => {
        const optAttributes = {
          value: item.value || item
        }
        if (selected && selected === optAttributes.value) {
          optAttributes.selected = 'selected'
        }
        const label = item.label || item

        return html`<option ${optAttributes}>${label}</option>`
      })}
    </select>`
}
