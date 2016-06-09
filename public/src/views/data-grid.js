const view = require('choo').view
/**
 * Data Grid
 * Options:
 * - fields (Array of strings, required)
 * - rows (Array of objects, required)
 */
module.exports = (opts = {}) => {
  const { fields, rows, selectedRowIndex,
    onSelectRow, onUpdateRow, onInsertRow } = opts

  const changesObserved = {} // stores any changes made to the selected row

  return view`
    <table class="table table-bordered table-hover table-sm">

      ${fields.length ? view`
        <thead>
          <tr>
            <th></th>
            ${fields.map((field) => view`<th>${field}</th>`)}
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
          ${fields.map((field) => view`
            <td contenteditable="true"
              oninput=${(e) => changesObserved[field] = e.target.innerText}>
              ${row[field]}
            </td>`)}
        </tr>`
    } else {
      return view`
        <tr>
          <td>${editButton(index)}</td>
          ${fields.map((field) => view`
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
          ${fields.map((field) => view`
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
        onSelectRow(null)
        onUpdateRow(index, changesObserved)
      }}></i>`
  }

  function saveNewRowButton () {
    return view`
      <i class="fa fa-save" onclick=${(e) => {
        onSelectRow(null)
        onInsertRow(changesObserved)
      }}></i>`
  }
}
