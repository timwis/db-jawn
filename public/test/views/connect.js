/* global Event */
const test = require('tape')
require('jsdom-global')()

const connect = require('../../src/views/connect')

test('connect view sends form values as payload on submit', (t) => {
  t.plan(1)
  const state = { db: { config: {} } }
  const sample = {
    hostname: 'localhost',
    username: 'root',
    password: 'lolol',
    database: 'cake'
  }
  const send = (type, action) => {
    t.deepEqual(action.payload, sample, 'payload matches form values')
  }
  const tree = connect(null, state, send)
  tree.querySelector('#hostname').value = sample.hostname
  tree.querySelector('#username').value = sample.username
  tree.querySelector('#password').value = sample.password
  tree.querySelector('#database').value = sample.database
  tree.querySelector('form').dispatchEvent(new Event('submit'))
})
