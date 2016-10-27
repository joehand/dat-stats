const spawn = require('child_process').spawn

run()
function run () {
  console.log(`Demo starting ${new Date()}`)
  const server = spawn('node', ['server.js'])
  server.on('close', (code) => {
    console.log(`Demo over ${new Date()}\n`)
    run()
  })
}
