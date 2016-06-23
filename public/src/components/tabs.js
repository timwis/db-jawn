const html = require('choo').view

/**
 * Create a tabs component
 * @param {[Object]} items Tab item objects with key, label, and href properties
 * @param {string} activeKey The key from `items` to show as active
 */
module.exports = (items, activeKey) => {
  return html`
    <ul class="nav nav-tabs">
      ${items.map((item) => html`
        <li class="nav-item">
          <a class="nav-link ${activeKey === item.key ? 'active' : ''}" href="${item.href}">${item.label}</a>
        </li>`)}
    </ul>`
}
