const serverRouter = require('server-router')
const bankai = require('bankai')
const hyperServer = require('hypercore-stats-server')

module.exports = function (archive) {
  const assets = bankai(require.resolve('./index.js'))

  const router = serverRouter([
    ['/', (req, res) => assets.html(req, res).pipe(res)],
    ['/bundle.css', (req, res) => assets.css(req, res).pipe(res)],
    ['/bundle.js', (req, res) => assets.js(req, res).pipe(res)],
    ['/events', (req, res) => hyperServer(archive, res)]
  ])

  return router
}
