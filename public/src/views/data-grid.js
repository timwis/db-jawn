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
          ${rows.map(tableRow)}
          ${blankTableRow()}
        </tbody>` : ''}

    </table>`

  // Creates a <tr> with <td>s for use in the data table
  // If the row index is the one that's selected (according to the state),
  // highlight it, make it editable, and listen to typing on it
  function tableRow (row, index) {
    if (selectedRowIndex === index) {
      return view`
        <tr class="table-info">
          <td>${saveEditButton(index)}</td>
          ${fieldKeys.map((field) => view`
            <td contenteditable="true"
              oninput=${(e) => changesObserved[field] = e.target.innerText}>
              ${row[field]}
            </td>`)}
        </tr>`
    } else {
      return view`
        <tr>
          <td>${editButton(index)}</td>
          ${fieldKeys.map((field) => view`
            <td>${row[field]}</td>`)}
        </tr>`
    }
  }

  // Creates an "Click here to add a new row" row for use in the data table
  // When you click on the row, it turns into an empty row that is selected/fillable
  function blankTableRow () {
    const newRowIndex = rows.length // (highest index plus one - a bit hacky)

    if (selectedRowIndex === newRowIndex) {
      return view`
        <tr class="table-info">
          <td>${saveNewRowButton()}</td>
          ${fieldKeys.map((field) => view`
            <td contenteditable="true"
              oninput=${(e) => changesObserved[field] = e.target.innerText}>
            </td>`)}
        </tr>`
    } else {
      return view`
        <tr>
          <td colspan="${fields.length + 1}"
            onclick=${(e) => onSelectRow(newRowIndex)}>
            Click to add a new row
          </td>
        </tr>`
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
        const rowData = getRowData(row)
        if (validate(rowData)) {
          onSelectRow(null)
          onUpdateRow(index, changesObserved)
        } else {
          console.warn('Row data is not valid', rowData)
        }
      }}></i>`
  }

  function saveNewRowButton () {
    return view`
      <i class="fa fa-save" onclick=${(e) => {
        const row = e.target.closest('tr')
        const rowData = getRowData(row)
        if (validate(rowData)) {
          onSelectRow(null)
          onInsertRow(changesObserved)
        } else {
          console.warn('Row data is not valid', rowData)
        }
      }}></i>`
  }

  function getRowData (row) {
    const rowValues = Array.from(row.children).map((child) => child.innerText).slice(1) // first column is edit button
    return zipObject(fieldKeys, rowValues)
  }

  function validate (rowData) {
    return fields.filter((field) => typeof field.validate === 'function')
      .every((field) => field.validate(rowData[field.key], rowData))
  }
}
