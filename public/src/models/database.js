import knex from 'knex'

class Database {
  constructor (config) {
    this.knex = knex({
      client: 'pg',
      connection: config
    })
  }

  query (sql) {
    return this.knex.raw(sql)
  }

  listTables () {
    return this.query(`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public' ORDER BY tablename`)
  }

  describe (table) {
    return Promise.all([
      this.knex(table).columnInfo(),
      this._getPrimaryKey(table)
    ]).then((results) => {
      const fields = []
      for (let field in results[0]) {
        fields.push(Object.assign(results[0][field], {name: field}))
      }
      return {
        fields,
        primaryKey: results[1].rows[0].attname
      }
    })
  }

  update (table, values, conditions) {
    const statement = this.knex(table)
    if (conditions) statement.where(conditions)
    return statement.update(values)
  }

  insert (table, values) {
    return this.knex(table).insert(values, '*')
  }

  updateColumn (table, column, changes) {
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

    return this.query(sql.join('\n'))
  }

  insertColumn (table, column) {
    return this.query(`ALTER TABLE ${table} ADD COLUMN ${column} text`)
  }

  _getPrimaryKey (table) {
    const sql = `
      SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS data_type
      FROM   pg_index i
      JOIN   pg_attribute a ON a.attrelid = i.indrelid
                          AND a.attnum = ANY(i.indkey)
      WHERE  i.indrelid = '${table}'::regclass
      AND    i.indisprimary;`
    return this.query(sql)
  }

  getRows (table) {
    return this.query(`SELECT * FROM ${table}`)
  }
}

export default Database
