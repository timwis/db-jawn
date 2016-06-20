const test = require('tape')
const knex = require('knex')({ client: 'pg' })

const queries = require('../src/queries')

test('queries: create table', (t) => {
  t.plan(1)
  const query = queries.createTable(knex, 'users')
  const expected = 'create table "users" ()'
  t.equal(query.toString(), expected)
})

test('queries: insert column', (t) => {
  t.plan(1)
  const payload = {
    name: 'bio',
    type: 'character varying',
    maxLength: '24',
    nullable: 'false',
    defaultValue: 'n/a'
  }
  const query = queries.insertColumn(knex, 'users', payload)
  const expected = `
    ALTER TABLE "users"
    ADD COLUMN "bio" character varying (24) NOT NULL DEFAULT \'n/a\'`
  t.equal(trimQuery(query.toString()), trimQuery(expected), 'query matches')
})

test('queries: update column', (t) => {
  t.plan(1)
  const changes = {
    type: 'character varying',
    maxLength: '24',
    defaultValue: '',
    nullable: 'true'
  }
  const query = queries.updateColumn(knex, 'users', 'bio', changes)
  const expected = `
    ALTER TABLE "users"
    ALTER COLUMN "bio" TYPE character varying (24),
    ALTER COLUMN "bio" DROP DEFAULT,
    ALTER COLUMN "bio" DROP NOT NULL`
  t.equal(trimQuery(query.toString()), trimQuery(expected), 'query matches')
})

test('queries: rename column', (t) => {
  t.plan(1)
  const query = queries.renameColumn(knex, 'users', 'bio', 'biography')
  const expected = `
    alter table "users"
    rename "bio" to "biography"`
  t.equal(query.toString(), trimQuery(expected), 'query matches')
})

function trimQuery (sql) {
  return sql.trim().replace(/ +(?= )/g, '').replace(/\n/g, '')
}
