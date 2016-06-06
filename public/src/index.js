const choo = require('choo')
const views = {
  connect: require('./views/connect'),
  databaseLayout: require('./views/database-layout')
}

const app = choo()

app.model(require('./models/db'))

app.router((route) => [
  route('/', views.connect),
  route('/tables', views.databaseLayout, [
    route('/:name', views.databaseLayout)
  ])
])

const tree = app.start({hash: true})
document.getElementById('main').appendChild(tree)
