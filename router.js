const serverRouter = require('server-router')
const browserify = require('browserify')
const bankai = require('bankai')()
const hyperServer = require('hypercore-stats-server')

module.exports = function (archive) {
  const router = serverRouter('/404')

  const html = bankai.html({})
  router.on('/', (req, res) => html(req, res).pipe(res))

  const css = bankai.css()
  router.on('/bundle.css', (req, res) => css(req, res).pipe(res))
  const js = bankai.js(browserify, require.resolve('./client.js'))
  router.on('/bundle.js', (req, res) => js(req, res).pipe(res))

  router.on('/events', (req, res) => hyperServer(archive, res))

  router.on('/404', (req, res) => {
    res.statusCode = 404
    res.end('{ "message": "the server is confused" }')
  })

  return router
}
