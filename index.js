const choo = require('choo')
const css = require('sheetify')

const app = choo()

app.model(require('./models/archive'))

app.router((route) => [
  route('/', require('./components/archive'))
])

css('./style.css', { global: true })

const tree = app.start()
document.body.appendChild(tree)
