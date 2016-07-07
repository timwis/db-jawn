const test = require('tape')
require('jsdom-global')()

const dataGrid = require('../../src/components/data-grid')

test('data grid: displays rows and blank row', (t) => {
  t.plan(2)
  const columns = ['firstName', 'lastName']
  const rows = [
    { firstName: 'George', lastName: 'Washington' },
    { firstName: 'John', lastName: 'Adams' },
    { firstName: 'Thomas', lastName: 'Jefferson' }
  ]
  const tree = dataGrid({
    columns,
    rows
  })
  // +1 to account for blank row at end
  const tableRows = tree.querySelector('tbody').children
  t.equal(tableRows.length, rows.length + 1, 'display all rows')

  const expectedColSpan = columns.length + 2
  const blankRowColumn = tree.querySelector('tbody tr:last-child td')
  t.equal(+blankRowColumn.getAttribute('colspan'), expectedColSpan, 'last row spans all columns')
})

test('data grid: clicking edit sets row to edit mode', (t) => {
  t.plan(2)
  const columns = ['firstName', 'lastName']
  const rows = [
    { firstName: 'George', lastName: 'Washington' },
    { firstName: 'John', lastName: 'Adams' },
    { firstName: 'Thomas', lastName: 'Jefferson' }
  ]
  const treeWithoutSelection = dataGrid({
    columns,
    rows,
    onSelectRow: (index) => t.equal(index, 1, 'set selectedRowIndex to 1')
  })
  const targetRow = treeWithoutSelection.querySelectorAll('tbody tr')[1]
  targetRow.querySelector('.fa-pencil').dispatchEvent(new window.Event('click'))

  const treeWithSelection = dataGrid({ columns, rows, selectedRowIndex: 1 })

  const selectedRow = treeWithSelection.querySelectorAll('tbody tr')[1]
  t.ok(selectedRow.classList.contains('selected'), 'row has selected class')
})

test('data grid: clicking blank row fires selected event on new row index', (t) => {
  t.plan(1)
  const columns = ['firstName', 'lastName']
  const rows = [
    { firstName: 'George', lastName: 'Washington' },
    { firstName: 'John', lastName: 'Adams' },
    { firstName: 'Thomas', lastName: 'Jefferson' }
  ]
  const tree = dataGrid({
    columns,
    rows,
    onSelectRow: (index) => t.equal(index, rows.length, 'set selected row to rows.length + 1')
  })

  const blankRow = tree.querySelector('tbody tr:last-child td')
  blankRow.dispatchEvent(new window.Event('click'))
})

test('data grid: pre-save validation marks invalid cells', (t) => {
  t.plan(1)
  const columns = [
    { key: 'name' },
    {
      key: 'email',
      validate: (value, row) => '@'.indexOf(value) !== -1 // value.includes('@') is preferrable but tests fail somehow
    }
  ]
  const rows = [{ name: 'foo', email: 'bar' }]
  const tree = dataGrid({
    columns,
    rows,
    selectedRowIndex: 0
  })
  tree.querySelector('tr.selected td:first-child .fa-save').dispatchEvent(new window.MouseEvent('click', {view: window, bubbles: true, cancelable: true}))
  t.ok(tree.querySelector('tr.selected td:last-child').classList.contains('invalid'), 'marks email cell invalid')
})
