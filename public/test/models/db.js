const test = require('tape')
require('jsdom-global')()

const db = require('../../src/models/db')

test('db model: reducers: receiveNewTable', (t) => {
  t.plan(1)
  const state = { tables: ['foo', 'bar'] }
  const action = { name: 'baz' }
  const result = db.reducers.receiveNewTable(action, state)
  t.equal(result.tables[2], 'baz', 'new table appended to end')
})

test('db model: reducers: receiveTableDeletion', (t) => {
  t.plan(1)
  const state = { tables: ['foo', 'bar', 'baz'] }
  const action = { index: 1 }
  const result = db.reducers.receiveTableDeletion(action, state)
  t.equal(result.tables.length, 2)
})
