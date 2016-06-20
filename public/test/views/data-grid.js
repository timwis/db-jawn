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
