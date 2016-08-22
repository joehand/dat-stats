const http = require('http')
const hyperdrive = require('hyperdrive')
const serve = require('hyperdrive-http')
const swarm = require('hyperdrive-archive-swarm')
const memdb = require('memdb')
const stats = require('./router')

const drive = hyperdrive(memdb())

// a remote dat
const archive = drive.createArchive('68da22cc822a92f9d68bb7d72b0327d7dd6d7fc598eeb8f568fc5e6cdbefbbae')

http.createServer(stats(archive)).listen(10000) // stats ui hosted at http://localhost:10000
http.createServer(serve(archive)).listen(8000)  // file hosted at http://localhost:8000/sintel.mp4

swarm(archive)