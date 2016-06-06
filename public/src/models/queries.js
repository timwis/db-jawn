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
    FROM ${table}`
}
