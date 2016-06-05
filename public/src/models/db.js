const knex = require('knex')

module.exports = {
  namespace: 'db',
  state: {
    config: {
      hostname: '',
      username: '',
      password: '',
      database: ''
    },
    instance: null,
    tables: [],
    selectedTable: {}
  },
  reducers: {
    config: (action, state) => ({
      config: action.payload,
      instance: knex({ client: 'pg', connection: action.payload })
    }),
    clearTables: (action, state) => ({ tables: [] }),
    receiveTables: (action, state) => ({ tables: action.payload })
  },
  effects: {
    getTables: (action, state, send) => {
      state.instance.raw(`
        SELECT tablename
        FROM pg_catalog.pg_tables
        WHERE schemaname='public'
        ORDER BY tablename`)
      .then((response) => {
        const tables = response.rows.map((table) => table.tablename)
        send('db:receiveTables', { payload: tables })
      })
    }
  }
}
