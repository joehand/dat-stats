const ess = require('event-source-stream')
const speedometer = require('speedometer')

module.exports = createModel()

function createModel () {
  const stream = ess('/events')

  const _uploadSpeed = speedometer()
  const _downloadSpeed = speedometer()

  return {
    namespace: 'archive',
    state: {
      key: '',
      feeds: [],
      peers: [],
      peersFound: [],
      display: 'grid',
      uploadSpeed: 0,
      downloadSpeed: 0
    },
    reducers: {
      toggle: (data, state) => {
        if (state.display === 'grid') return ({display: 'peers'})
        return ({display: 'grid'})
      },
      key: (data, state) => {
        return ({ key: data.key })
      },
      feed: (data, state) => {
        return ({feeds: state.feeds.concat(data)})
      },
      update: (data, state) => {
        // TODO: not sure how this would work with pixel-grid
        return ({})
      },
      download: (data, state) => {
        const speed = _downloadSpeed(data.bytes)
        return ({
          feeds: state.feeds.map(feed => {
            if (feed.name === data.name) feed.blocks[data.index] = true
            return feed
          }),
          downloadSpeed: speed
        })
      },
      upload: (data, state) => {
        const speed = _uploadSpeed(data.bytes)
        if (data.name !== 'content') return ({
          uploadSpeed: speed
        })
        if (state.peersFound.indexOf(data.peer) > -1) {
          return ({
            peers: state.peers.map(peer => {
              if (peer.id === data.peer) peer.blocks = data.peerBlocks
              return peer
            }),
            uploadSpeed: speed
          })
        } else {
          const peer = {
            id: data.peer,
            blocks: data.peerBlocks
          }
          return ({
            peers: state.peers.concat(peer),
            peersFound: state.peersFound.concat(data.peer),
            uploadSpeed: speed
          })
        }
      },
      peer: (data, state) => {
        if (data.peer && data.name === 'content' && state.peersFound.indexOf(data.peer) === -1) {
          return ({
            peersFound: state.peersFound.concat(data.peer),
            peers: state.peers.concat({
              id: data.peer,
              blocks: data.peerBlocks
            })
          })
        }
        return ({})
      }
    },
    subscriptions: [
      (send, done) => {
        stream.on('data', function(event) {
          const data = JSON.parse(event)
          const cb = (err) => {
            if (err) return done(err)
          }
          switch (data.type) {
            case 'key': return send('archive:key', data, cb)
            case 'peer-update': return send('archive:peer', data, cb)
            case 'feed': return send('archive:feed', data, cb)
            case 'update': return send('archive:update', data, cb)
            case 'download': return send('archive:download', data, cb)
            case 'upload': return send('archive:upload', data, cb)
          }
        })
      }
    ]
  }
}
