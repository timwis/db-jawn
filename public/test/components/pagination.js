const test = require('tape')

const Pagination = require('../../src/components/pagination')

test('pagination: first page', (t) => {
  t.plan(2)
  const tree = Pagination({
    offset: 0,
    limit: 10,
    total: 20
  })
  t.true(tree.querySelector('li:first-child').classList.contains('disabled'), 'first button is disabled')
  t.false(tree.querySelector('li:last-child').classList.contains('disabled'), 'last button is not disabled')
})

test('pagination: last page', (t) => {
  t.plan(2)
  const tree = Pagination({
    offset: 10,
    limit: 10,
    total: 20
  })
  t.false(tree.querySelector('li:first-child').classList.contains('disabled'), 'first button is not disabled')
  t.true(tree.querySelector('li:last-child').classList.contains('disabled'), 'last button is disabled')
})
