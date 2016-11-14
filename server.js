const http = require('http')
const hyperdrive = require('hyperdrive')
const serve = require('hyperdrive-http')
const swarm = require('hyperdrive-archive-swarm')
const memdb = require('memdb')
const stats = require('./router')

const drive = hyperdrive(memdb())

// a remote dat
const archive = drive.createArchive('cc2f0ca624b44a962c15bd24ca07ab3785df618d7a65f27059bebcc004eb6ff8')

http.createServer(stats(archive)).listen(10000) // stats ui hosted at http://localhost:10000
http.createServer(serve(archive)).listen(8000) // file hosted at http://localhost:8000/sintel.mp4

swarm(archive)
