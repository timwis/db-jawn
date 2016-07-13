const choo = require('choo')

const layouts = {
  root: require('./layouts/root'),
  database: require('./layouts/database')
}
const dbLayout = (view, id) => layouts.root(layouts.database(view, id))
const views = {
  connect: require('./views/connect'),
  tableRows: require('./views/table-rows'),
  tableSchema: require('./views/table-schema'),
  tableOptions: require('./views/table-options'),
  query: require('./views/query')
}

const app = choo({
  onError: (err, state, createSend) => {
    console.error(err)
    const send = createSend('error')
    send('app:alert', err)
  }
})

app.model(require('./models/app'))
app.model(require('./models/db'))
app.model(require('./models/table'))
app.model(require('./models/query'))

app.router((route) => [
  route('/', layouts.root(views.connect)),
  route('/tables', dbLayout(), [
    route('/:name', dbLayout(views.tableRows, 'rows'), [
      route('/schema', dbLayout(views.tableSchema, 'schema')),
      route('/options', dbLayout(views.tableOptions, 'options')),
      route('/query', dbLayout(views.query, 'query'))
    ])
  ])
])

const tree = app.start({hash: true})
document.body.appendChild(tree)
