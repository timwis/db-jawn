const html = require('choo').view
const {zipObject} = require('lodash')
const noop = () => {}

/**
 * Create an editable data grid component
 * @param {Object[]|string[]} fields Field names as strings or field objects
 * @param {Object[]} rows Row objects containing each field as a property
 * @param {number} selectedRowIndex Index of selected (currently editing) row in rows array
 * @callback [onSelectRow] Function to execute when user selects a row (index)
 * @callback [onUpdateRow] Function to execute when a row is updated by the user (index, payload)
 * @callback [onInsertRow] Function to execute when a new row is saved by the user (payload)
 * @callback [onDeleteRow] Function to execute when user deletes a row (index)
 */
module.exports = ({ fields, rows, selectedRowIndex,
                    onSelectRow = noop, onUpdateRow = noop, onInsertRow = noop, onDeleteRow = noop }) => {
  const newRowIndex = rows.length // (highest index plus one - a bit hacky)
  const changesObserved = {} // stores any changes made to the selected row

  return html`
    <div class="data-grid">
      <table class="table table-bordered table-hover table-sm">

        ${fields.length ? html`
          <thead>
            <tr>
              <th colspan="2"></th>
              ${fields.map((field) => html`<th>${field.title || field.key || field}</th>`)}
            </tr>
          </thead>` : ''}

        ${rows.length ? html`
          <tbody>
            ${rows.map((row, index) => selectedRowIndex === index
              ? editableRow(index, row)
              : displayRow(index, row))}
            ${selectedRowIndex === newRowIndex
              ? editableRow(newRowIndex)
              : blankRow(newRowIndex)}
          </tbody>` : ''}

      </table>
    </div>`

  function editableRow (index, rowData = {}) {
    return html`
      <tr class="table-info">
        <td>${saveEditButton(index)}</td>
        <td>${deleteButton(index)}</td>
        ${fields.map((field) => html`
          <td contenteditable="${field.editable === false ? 'false' : 'true'}"
            oninput=${(e) => onInput(e.target, field)}>${rowData[field.key || field]}</td>`)}
      </tr>`
  }

  function displayRow (index, rowData) {
    return html`
      <tr>
        <td>${editButton(index)}</td>
        <td>${deleteButton(index)}</td>
        ${fields.map((field) => html`
          <td>${rowData[field.key || field]}</td>`)}
      </tr>`
  }

  function blankRow (index) {
    return html`
      <tr>
        <td colspan="${fields.length + 2}"
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
    return html`
      <i class="fa fa-pencil" onclick=${(e) => {
        onSelectRow(index)
      }}></i>`
  }

  function saveEditButton (index) {
    return html`
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

  function deleteButton (index) {
    return html`
      <i class="fa fa-trash" onclick=${(e) => {
        onDeleteRow(index)
      }}`
  }

  function getRowData (row) {
    const rowValues = Array.from(row.children).slice(2).map((child) => child.innerText) // first 2 columns are controls
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
