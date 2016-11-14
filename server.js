const http = require('http')
const hyperdrive = require('hyperdrive')
const serve = require('hyperdrive-http')
const swarm = require('hyperdrive-archive-swarm')
const memdb = require('memdb')
const minimist = require('minimist')
const stats = require('./router')

const argv = minimist(process.argv.slice(2), {
  default: {
    statsPort: 10000,
    drivePort: 8000
  }
})

if (!argv._[0]) throw new Error('link required')
const link = argv._[0]

const statsPort = argv.statsPort
const drivePort = argv.drivePort

const drive = hyperdrive(memdb())

// a remote dat
const archive = drive.createArchive(link)

http.createServer(stats(archive)).listen(statsPort)
http.createServer(serve(archive)).listen(drivePort)
swarm(archive)

console.log(`Serving stats at http://localhost:${statsPort}/`)
console.log(`Serving files at http://localhost:${drivePort}/`)
