const html = require('choo/html')
const {zipObject} = require('lodash')
const noop = () => {}

/**
 * Create an editable data grid component
 * @param {Object[]|string[]} columns Column names as strings or column objects
 * @param {Object[]} rows Row objects containing each column as a property
 * @param {number} selectedRowIndex Index of selected (currently editing) row in rows array
 * @callback [onSelectRow] Function to execute when user selects a row (index)
 * @callback [onUpdateRow] Function to execute when a row is updated by the user (index, payload)
 * @callback [onInsertRow] Function to execute when a new row is saved by the user (payload)
 * @callback [onDeleteRow] Function to execute when user deletes a row (index)
 */
module.exports = ({ columns, rows, selectedRowIndex,
                    onSelectRow = noop, onUpdateRow = noop, onInsertRow = noop, onDeleteRow = noop }) => {
  const newRowIndex = rows.length // (highest index plus one - a bit hacky)
  const changesObserved = {} // stores any changes made to the selected row

  return html`
    <div class="data-grid">
      <table class="table table-bordered table-hover table-sm">

        ${columns.length ? html`
          <thead>
            <tr>
              <th colspan="2"></th>
              ${columns.map((column) => html`<th>${column.title || column.key || column}</th>`)}
            </tr>
          </thead>` : ''}

          <tbody>
            ${rows.length ? html`
              ${rows.map((row, index) => selectedRowIndex === index
                ? editableRow(index, row)
                : displayRow(index, row))}` : ''}
            ${columns.length ? html`
              ${selectedRowIndex === newRowIndex
                ? editableRow(newRowIndex)
                : blankRow(newRowIndex)}` : ''}
          </tbody>

      </table>
    </div>`

  function editableRow (index, rowData = {}) {
    return html`
      <tr class="table-info selected">
        <td class="edit-button">${saveEditButton(index)}</td>
        <td class="delete-button">${deleteButton(index)}</td>
        ${columns.map((column) => html`
          <td contenteditable="${column.editable === false ? 'false' : 'true'}"
            oninput=${(e) => onInput(e.target, column)}>${rowData[column.key || column]}</td>`)}
      </tr>`
  }

  function displayRow (index, rowData) {
    return html`
      <tr>
        <td class="edit-button">${editButton(index)}</td>
        <td class="delete-button">${deleteButton(index)}</td>
        ${columns.map((column) => html`
          <td>${rowData[column.key || column]}</td>`)}
      </tr>`
  }

  function blankRow (index) {
    return html`
      <tr>
        <td colspan="${columns.length + 2}"
          onclick=${(e) => onSelectRow(index)}>
          Click to add a new row
        </td>
      </tr>`
  }

  function onInput (el, column) {
    changesObserved[column.key || column] = el.innerText
    if (typeof column.validate === 'function') {
      const row = el.closest('tr')
      const rowData = getRowData(row)
      const isValid = column.validate(el.innerText, rowData)
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
        const isNewRow = index >= rows.length
        isNewRow ? onSelectRow(null) : onDeleteRow(index)
      }}`
  }

  function getRowData (row) {
    const rowValues = Array.from(row.children).slice(2).map((child) => child.innerText) // first 2 columns are controls
    const columnKeys = columns.map((column) => column.key || column)
    return zipObject(columnKeys, rowValues)
  }

  // Confirm every column is valid. Can't just check for .invalid classes because
  // user may not have typed anything in a column at all, which wouldn't have run validation
  function isRowValid (row) {
    const rowData = getRowData(row)
    return columns.filter((column) => typeof column.validate === 'function')
      .every((column) => column.validate(rowData[column.key || column], rowData))
  }
}
