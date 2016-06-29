const test = require('tape')

const table = require('../../src/models/table')

test('table model: effects: getTable', (t) => {
  t.plan(5)
  const client = {
    getSchema: (table) => Promise.resolve({
      id: { dataType: 'int' },
      name: { dataType: 'string' }
    }),
    getPrimaryKey: (table) => Promise.resolve('id'),
    getRows: (table, limit, offset) => Promise.resolve([
      { id: 1, name: 'George' },
      { id: 2, name: 'John' }
    ]),
    getRowCount: (table) => Promise.resolve('2')
  }
  const expectedColumns = [
    { name: 'id', dataType: 'int' },
    { name: 'name', dataType: 'string' }
  ]
  const tableName = 'users'
  const action = { client, table: tableName }
  const send = (event, data) => {
    t.equal(event, 'table:receiveTable', 'calls correct reducer')
    t.deepEqual(data.payload.columns, expectedColumns, 'mapped columns to array')
    t.equal(data.payload.rows.length, 2, 'correct number of items in rows array')
    t.equal(data.payload.rowCount, 2, 'rowCount converted to number')
    t.equal(data.payload.primaryKey, 'id', 'primary key correct')
  }
  table.effects.getTable(action, {}, send)
})
