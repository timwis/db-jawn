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

test('db model: effects: getTableList', (t) => {
  t.plan(2)
  const state = {
    client: {
      getTables: () => Promise.resolve({
        rows: [
          { tablename: 'foo' },
          { tablename: 'bar' }
        ]
      })
    }
  }
  const send = (event, data) => {
    t.equal(event, 'db:receiveTableList', 'calls correct reducer')
    t.deepEqual(data.payload, ['foo', 'bar'], 'table names were plucked')
  }
  db.effects.getTableList({}, state, send)
})

test('db model: effects: createTable', (t) => {
  t.plan(2)
  const state = {
    client: {
      createTable: (name) => Promise.resolve()
    }
  }
  const tableName = 'users'
  const send = (event, data) => {
    t.equal(event, 'db:receiveNewTable', 'calls correct reducer')
    t.equal(data.name, tableName, 'passes on table name')
  }
  db.effects.createTable({ name: tableName }, state, send)
})

test('db model: effects: deleteTable', (t) => {
  t.plan(2)
  const state = {
    tables: ['foo', 'bar', 'baz'],
    client: {
      deleteTable: (name) => Promise.resolve()
    }
  }
  const tableName = 'bar'
  const send = (event, data) => {
    t.equal(event, 'db:receiveTableDeletion', 'calls correct reducer')
    t.equal(data.index, 1, 'finds table index')
  }
  db.effects.deleteTable({ name: tableName }, state, send)
})
