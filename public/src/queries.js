module.exports = {
  getTables: () => `
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname='public'
    ORDER BY tablename`,

  getPrimaryKey: (table) => `
    SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type
    FROM pg_index i
    JOIN pg_attribute a
      ON a.attrelid = i.indrelid
      AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = '${table}'::regclass
      AND i.indisprimary`,

  getRows: (table) => `
    SELECT *
    FROM ${table}`,

  insertField: (table, payload) => {
    const sql = [`
      ALTER TABLE ${table}
      ADD COLUMN ${payload.name} ${payload.type}`
    ]
    if (payload.maxLength) sql.push(`(${payload.maxLength})`)
    if (payload.nullable === 'false') sql.push(`NOT NULL`)
    if (payload.defaultValue) sql.push(`DEFAULT '${payload.defaultValue}'`)
    return sql.join(' ')
  },

  updateField: (table, column, changes) => {
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

    return sql.join('\n')
  }
}
