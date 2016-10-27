const http = require('http')
const hyperdrive = require('hyperdrive')
const serve = require('hyperdrive-http')
const swarm = require('hyperdrive-archive-swarm')
const memdb = require('memdb')
const stats = require('./router')

// a remote dat
const link = 'dea7aa5a6934aaed6d1fa7c97788018fc55780c20d46ae028a5db77639a63248'

run()

function run () {
  const db = memdb()
  const drive = hyperdrive(db)
  const archive = drive.createArchive(link)

  archive.open(() => {
    archive.content.once('download-finished', () => {
      process.exit(0)
    })
  })

  http.createServer(stats(archive)).listen(10000) // stats ui hosted at http://localhost:10000
  http.createServer(serve(archive)).listen(8000)  // file hosted at http://localhost:8000/sintel.mp4

  const sw = swarm(archive)
}