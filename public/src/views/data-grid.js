const view = require('choo').view
const {zipObject} = require('lodash')
/**
 * Data Grid
 * Options:
 * - fields (Array of strings or array of objects with key/title properties, required)
 * - rows (Array of objects, required)
 */
const noop = () => {}

module.exports = ({ fields, rows, selectedRowIndex, onSelectRow = noop,
                    onUpdateRow = noop, onInsertRow = noop }) => {
  const newRowIndex = rows.length // (highest index plus one - a bit hacky)
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

  function editableRow (index, rowData = {}) {
    return view`
      <tr class="table-info">
        <td>${saveEditButton(index)}</td>
        ${fields.map((field) => view`
          <td contenteditable="${field.editable === false ? 'false' : 'true'}"
            oninput=${(e) => onInput(e.target, field)}>${rowData[field.key || field]}</td>`)}
      </tr>`
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

  function onInput (el, field) {
    changesObserved[field.key || field] = el.innerText
    if (typeof field.validate === 'function') {
      const row = el.closest('tr')
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
    const rowValues = Array.from(row.children).slice(1).map((child) => child.innerText) // first column is edit button
    const fieldKeys = fields.map((field) => field.key || field)
    return zipObject(fieldKeys, rowValues)
  }

  // Confirm every field is valid. Can't just check for .invalid classes because
  // user may not have typed anything in a field at all, which wouldn't have run validation
  function isRowValid (row) {
    const rowData = getRowData(row)
    return fields.filter((field) => typeof field.validate === 'function')
      .every((field) => field.validate(rowData[field.key || field], rowData))
  }
}
