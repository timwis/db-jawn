module.exports = {
  getTables: (connection) => connection.raw(`
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname='public'
    ORDER BY tablename`),

  createTable: (connection, table) => {
    return connection.schema.createTable(table, () => {})
  },

  deleteTable: (connection, table) => {
    return connection.schema.dropTable(table)
  },

  getSchema: (connection, table) => {
    return connection(table).columnInfo()
  },

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

  insertField: (instance, table, payload) => {
    const sql = [`
      ALTER TABLE ${table}
      ADD COLUMN ${payload.name} ${payload.type}`
    ]
    if (payload.maxLength) sql.push(`(${payload.maxLength})`)
    if (payload.nullable === 'false') sql.push(`NOT NULL`)
    if (payload.defaultValue) sql.push(`DEFAULT '${payload.defaultValue}'`)
    return instance.raw(sql.join(' '))
  },

  updateField: (instance, table, column, changes) => {
    const sql = [
      `ALTER TABLE ${table}`
    ]
    if (changes.name) sql.push(`RENAME COLUMN ${column} TO ${changes.name}`)
    if (changes.type) sql.push(`ALTER COLUMN ${column} TYPE ${changes.type}` + (changes.maxLength ? ` (${changes.maxLength})` : ''))
    if (changes.defaultValue !== undefined) {
      if (changes.defaultValue === '') sql.push(`ALTER COLUMN ${column} DROP DEFAULT`)
      else sql.push(`ALTER COLUMN ${column} SET DEFAULT ${changes.defaultValue}`)
    }
    if (changes.nullable == 'true') sql.push(`ALTER COLUMN ${column} SET NOT NULL`)
    if (changes.nullable == 'false') sql.push(`ALTER COLUMN ${column} DROP NOT NULL`)

    return instance.raw(sql.join('\n'))
  },

  deleteField: (instance, table, column) => {
    return instance.schema.table(table, (t) => {
      t.dropColumn(column)
    })
  },

  getRows: (connection, table) => {
    return connection.select().from(table)
  },

  updateRow: (connection, table, payload, conditions) => {
    return connection(table).where(conditions).update(payload).limit(1)
  },

  insertRow: (connection, table, payload) => {
    return connection(table).insert(payload, '*')
  },

  deleteRow: (connection, table, conditions) => {
    return connection(table).where(conditions).del()
  }
}
