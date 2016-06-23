const choo = require('choo')
const views = {
  connect: require('./views/connect'),
  databaseLayout: require('./views/database-layout')
}

const app = choo()

app.model(require('./models/db'))
app.model(require('./models/table'))

app.router((route) => [
  route('/', views.connect),
  route('/tables', views.databaseLayout(), [
    route('/:name', views.databaseLayout('rows'), [
      route('/schema', views.databaseLayout('schema')),
      route('/options', views.databaseLayout('options'))
    ])
  ])
])

const tree = app.start({hash: true})
document.getElementById('main').appendChild(tree)
