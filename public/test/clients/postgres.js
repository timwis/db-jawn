const test = require('tape')

const Client = require('../../src/clients/postgres')
const client = new Client()

test('postgres: create table', (t) => {
  t.plan(1)
  const query = client.createTable('users')
  const expected = 'create table "users" ()'
  t.equal(query.toString(), expected)
})

test('postgres: insert column', (t) => {
  t.plan(1)
  const payload = {
    name: 'bio',
    type: 'character varying',
    maxLength: '24',
    nullable: 'false',
    defaultValue: 'n/a'
  }
  const query = client.insertColumn('users', payload)
  const expected = `
    ALTER TABLE "users"
    ADD COLUMN "bio" character varying (24) NOT NULL DEFAULT \'n/a\'`
  t.equal(trimQuery(query.toString()), trimQuery(expected), 'query matches')
})

test('postgres: update column', (t) => {
  t.plan(1)
  const changes = {
    type: 'character varying',
    maxLength: '24',
    defaultValue: '',
    nullable: 'true'
  }
  const query = client.updateColumn('users', 'bio', changes)
  const expected = `
    ALTER TABLE "users"
    ALTER COLUMN "bio" TYPE character varying (24),
    ALTER COLUMN "bio" DROP DEFAULT,
    ALTER COLUMN "bio" DROP NOT NULL`
  t.equal(trimQuery(query.toString()), trimQuery(expected), 'query matches')
})

test('postgres: rename column', (t) => {
  t.plan(1)
  const query = client.renameColumn('users', 'bio', 'biography')
  const expected = `
    alter table "users"
    rename "bio" to "biography"`
  t.equal(query.toString(), trimQuery(expected), 'query matches')
})

test('postgres: pagination', (t) => {
  t.plan(1)
  const query = client.getRows('users', 10, 20)
  const expected = 'select * from "users" limit \'10\' offset \'20\''
  t.equal(query.toString(), expected, 'includes limit and offset when provided')
})

function trimQuery (sql) {
  return sql.trim().replace(/ +(?= )/g, '').replace(/\n/g, '')
}
