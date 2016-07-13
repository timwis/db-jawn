/**
 * Generic database client
 * Like a "base class" for database clients. Some methods will
 * work across all clients (via Knex.js) and do not need to be
 * extended. Some methods do not have Knex.js support and thus
 * must be hard-coded for each client.
 */
const knex = require('knex')

module.exports = class Databse {
  constructor () {
    this.connection = knex({})
  }

  getValidTypes () {
    throw new Error('getValidTypes method not implemented')
  }

  getTables () {
    throw new Error('getTables method not implemented')
  }

  createTable (table) {
    return this.connection.schema.createTable(table, () => {})
  }

  deleteTable (table) {
    return this.connection.schema.dropTable(table)
  }

  getSchema (table) {
    return this.connection(table).columnInfo()
  }

  getPrimaryKey (table) {
    throw new Error('getPrimaryKey method not implemented')
  }

  insertColumn (table, payload) {
    const bindings = Object.assign({}, payload, {table})
    const sql = [`
      ALTER TABLE :table:
      ADD COLUMN :name: ${payload.type}`
    ]
    if (payload.maxLength) sql.push(`(${+payload.maxLength})`)
    if (payload.nullable === 'false') sql.push('NOT NULL')
    if (payload.defaultValue) sql.push('DEFAULT :defaultValue')
    // defaultValue doesn't seem to work as a binding, so this is a hacky workaround
    return this.connection.raw(this.connection.raw(sql.join(' '), bindings).toString())
  }

  updateColumn (table, column, changes) {
    throw new Error('updateColumn method not implemented')
  }

  renameColumn (table, column, newName) {
    const query = this.connection.schema.table(table, (t) => {
      t.renameColumn(column, newName)
    })
    return query
  }

  deleteColumn (table, column) {
    return this.connection.schema.table(table, (t) => {
      t.dropColumn(column)
    })
  }

  getRows (table, limit, offset) {
    return this.connection.select().from(table).limit(limit).offset(offset)
  }

  getRowCount (table) {
    return this.connection.count().from(table)
      .then((results) => results.length > 0 ? results[0].count : null)
  }

  updateRow (table, payload, conditions) {
    return this.connection(table).where(conditions).update(payload).limit(1)
  }

  insertRow (table, payload) {
    return this.connection(table).insert(payload, '*')
  }

  deleteRow (table, conditions) {
    return this.connection(table).where(conditions).del().limit(1)
  }

  query (sql) {
    return this.connection.raw(sql)
  }
}
