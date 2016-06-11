const view = require('choo').view
const {zipObject} = require('lodash')
/**
 * Data Grid
 * Options:
 * - fields (Array of strings or array of objects with key/title properties, required)
 * - rows (Array of objects, required)
 */
module.exports = (opts = {}) => {
  const noop = () => {}
  const {
    fields,
    rows,
    selectedRowIndex,
    onSelectRow = noop,
    onUpdateRow = noop,
    onInsertRow = noop } = opts
  const newRowIndex = rows.length // (highest index plus one - a bit hacky)
  const fieldKeys = fields.map((field) => field.key || field)
  const changesObserved = {} // stores any changes made to the selected row

  return view`
    <table class="table table-bordered table-hover table-sm">

      ${fields.length ? view`
        <thead>
          <tr>
            <th></th>
            ${fields.map((field) => view`<th>${field.title || field.key || field}</th>`)}
          </tr>
        </thead>` : ''}

      ${rows.length ? view`
        <tbody>
          ${rows.map((row, index) => selectedRowIndex === index
            ? editableRow(index, row)
            : displayRow(index, row))}
          ${selectedRowIndex === newRowIndex
            ? editableRow(newRowIndex)
            : blankRow(newRowIndex)}
        </tbody>` : ''}

    </table>`

  function editableRow (index, rowData) {
    // cache row element reference for use in oninput
    const rowEl = view`
      <tr class="table-info">
        <td>${saveEditButton(index)}</td>
        ${fields.map((field) => view`
          <td contenteditable="true"
            oninput=${(e) => onInput(e.target, field, rowEl)}>
            ${rowData[field.key || field]}
          </td>`)}
      </tr>`
    return rowEl
  }

  function displayRow (index, rowData) {
    return view`
      <tr>
        <td>${editButton(index)}</td>
        ${fields.map((field) => view`
          <td>${rowData[field.key || field]}</td>`)}
      </tr>`
  }

  function blankRow (index) {
    return view`
      <tr>
        <td colspan="${fields.length + 1}"
          onclick=${(e) => onSelectRow(index)}>
          Click to add a new row
        </td>
      </tr>`
  }

  function onInput (el, field, row) {
    changesObserved[field.key || field] = el.innerText
    if (typeof field.validate === 'function') {
      const rowData = getRowData(row)
      const isValid = field.validate(el.innerText, rowData)
      el.classList.toggle('invalid', !isValid)
    }
  }

  function editButton (index) {
    return view`
      <i class="fa fa-edit" onclick=${(e) => {
        onSelectRow(index)
      }}></i>`
  }

  function saveEditButton (index) {
    return view`
      <i class="fa fa-save" onclick=${(e) => {
        const row = e.target.closest('tr')
        const isNewRow = index >= rows.length
        if (isRowValid(row)) {
          onSelectRow(null)
          isNewRow ? onInsertRow(changesObserved) : onUpdateRow(index, changesObserved)
        } else {
          console.warn('Cannot save because of validation errors')
        }
      }}></i>`
  }

  function getRowData (row) {
    const rowValues = Array.from(row.children).map((child) => child.innerText).slice(1) // first column is edit button
    return zipObject(fieldKeys, rowValues)
  }

  function isRowValid (row) {
    return Array.from(row.children).slice(1).every((child) => !child.classList.contains('invalid'))
  }
}
