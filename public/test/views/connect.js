const test = require('tape')
require('jsdom-global')()

const connect = require('../../src/views/connect')

test('connect view sends form values as payload on submit', (t) => {
  t.plan(1)
  const state = { db: { config: {} } }
  const sample = {
    clientType: 'pg',
    host: 'localhost',
    user: 'root',
    password: 'lolol',
    database: 'cake'
  }
  const send = (type, data) => {
    t.deepEqual(data.payload, sample, 'payload matches form values')
  }
  const tree = connect(state, null, send)
  tree.querySelector('#clientType').value = sample.clientType
  tree.querySelector('#host').value = sample.host
  tree.querySelector('#user').value = sample.user
  tree.querySelector('#password').value = sample.password
  tree.querySelector('#database').value = sample.database
  tree.querySelector('form').dispatchEvent(new window.Event('submit'))
})
