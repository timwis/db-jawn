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

  insertColumn: (connection, table, payload) => {
    const bindings = Object.assign({}, payload, {table})
    const sql = [`
      ALTER TABLE :table:
      ADD COLUMN :name: ${payload.type}`
    ]
    if (payload.maxLength) sql.push(`(${+payload.maxLength})`)
    if (payload.nullable === 'false') sql.push('NOT NULL')
    if (payload.defaultValue) sql.push('DEFAULT :defaultValue')
    return connection.raw(sql.join(' '), bindings)
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
  },

  renameColumn: (connection, table, column, newName) => {
    const query = connection.schema.table(table, (t) => {
      t.renameColumn(column, newName)
    })
    return query
  },

  deleteColumn: (connection, table, column) => {
    return connection.schema.table(table, (t) => {
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
