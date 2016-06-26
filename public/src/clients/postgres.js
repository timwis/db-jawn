/**
 * Postgres database client
 * Extends the base client, database.js to provide postgres-specific
 * queries for certain methods. Inherits the rest.
 */
const database = require('./database')

const postgres = {
  validTypes: [
    'bigint',
    'bigserial',
    'bit',
    'bit varying',
    'bool',
    'boolean',
    'box',
    'bytea',
    'char',
    'character',
    'character varying',
    'cidr',
    'circle',
    'date',
    'decimal',
    'double precision',
    'float4',
    'float8',
    'inet',
    'int, int4',
    'int2',
    'int8',
    'integer',
    'interval',
    'json',
    'line',
    'lseg',
    'macaddr',
    'money',
    'numeric',
    'path',
    'point',
    'polygon',
    'real',
    'serial',
    'serial2',
    'serial4',
    'serial8',
    'smallint',
    'smallserial',
    'text',
    'time without time zone',
    'time with time zone',
    'time',
    'timestamp without time zone',
    'timestamp with time zone',
    'timestamp',
    'timestamptz',
    'timetz',
    'tsquery',
    'tsvector',
    'txid_snapshot',
    'uuid',
    'varbit',
    'varchar',
    'xml'
  ],

  getTables: (connection) => connection.raw(`
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname='public'
    ORDER BY tablename`),

  getPrimaryKey: (connection, table) => {
    return connection.raw(`
      SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type
      FROM pg_index i
      JOIN pg_attribute a
        ON a.attrelid = i.indrelid
        AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = ?::regclass
        AND i.indisprimary`, table)
      .then((results) => results.rows.length > 0 ? results.rows[0].attname : null)
  },

  updateColumn: (connection, table, column, changes) => {
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
      return connection.raw(connection.raw(sql, bindings).toString())
    } else {
      // noop
      return Promise.resolve()
    }
  }
}

// Similar to class extends, but pure prototypal inheritance
module.exports = Object.assign(Object.create(database), postgres)
