/**
 * Postgres database client
 * Extends the base client, database.js to provide postgres-specific
 * queries for certain methods. Inherits the rest.
 */
const knex = require('knex')

const Database = require('./database')
const validTypes = require('./valid-types/postgres-types')

module.exports = class Postgres extends Database {
  constructor (config) {
    super(config)
    this.connection = knex({ client: 'pg', connection: config })
  }

  getValidTypes () {
    return validTypes
  }

  getTables () {
    return this.connection.raw(`
      SELECT tablename
      FROM pg_catalog.pg_tables
      WHERE schemaname='public'
      ORDER BY tablename`)
  }

  getPrimaryKey (table) {
    return this.connection.raw(`
      SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type
      FROM pg_index i
      JOIN pg_attribute a
        ON a.attrelid = i.indrelid
        AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = ?::regclass
        AND i.indisprimary`, table)
      .then((results) => results.rows.length > 0 ? results.rows[0].attname : null)
  }

  updateColumn (table, column, changes) {
    const alterations = []

    if (changes.type) {
      alterations.push(`ALTER COLUMN :column: TYPE ${changes.type} ${changes.maxLength ? `(${+changes.maxLength})` : ''}`)
    }

    if (changes.defaultValue !== undefined) {
      if (changes.defaultValue === '') alterations.push('ALTER COLUMN :column: DROP DEFAULT')
      else alterations.push('ALTER COLUMN :column: SET DEFAULT :defaultValue')
    }

    if (changes.nullable === 'false') {
      alterations.push('ALTER COLUMN :column: SET NOT NULL')
    } else if (changes.nullable === 'true') {
      alterations.push('ALTER COLUMN :column: DROP NOT NULL')
    }

    if (alterations.length) {
      const sql = 'ALTER TABLE :table: ' + alterations.join(', ')
      const bindings = Object.assign({}, changes, { table, column })
      // defaultValue doesn't seem to work as a binding, so this is a hacky workaround
      return this.connection.raw(this.connection.raw(sql, bindings).toString())
    } else {
      // noop
      return Promise.resolve()
    }
  }
}
