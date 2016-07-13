module.exports = {
  namespace: 'query',
  state: {
    result: {
      fields: [],
      rows: [],
      command: null
    },
    error: null
  },
  reducers: {
    receiveResult: (data, state) => {
      return { result: data }
    },
    // When executing a custom query, errors are more a part
    // of the process than other application errors, so we'll
    // contain them in local state for view-specific rendering
    receiveError: (data, state) => {
      return { error: data }
    }
  },
  effects: {
    execute: (data, state, send, done) => {
      const { client, sql } = data
      client.query(sql)
      .then((results) => {
        console.log(results)
        send('query:receiveResult', results, done)
      })
      .catch((err) => {
        send('query:receiveError', err.message, done)
      })
    }
  }
}
