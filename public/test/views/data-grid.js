const test = require('tape')
require('jsdom-global')()

const dataGrid = require('../../src/views/data-grid')

test('data grid: displays rows and blank row', (t) => {
  t.plan(1)
  const fields = ['firstName', 'lastName']
  const rows = [
    { firstName: 'George', lastName: 'Washington' },
    { firstName: 'John', lastName: 'Adams' },
    { firstName: 'Thomas', lastName: 'Jefferson' }
  ]
  const tree = dataGrid({
    fields,
    rows
  })
  t.equal(tree.querySelector('tbody').children.length, rows.length + 1) // blank row at end
})
