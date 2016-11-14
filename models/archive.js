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
      uploadSpeed: 0,
      downloadSpeed: 0
    },
    reducers: {
      key: (data, state) => {
        return ({ key: data.key })
      },
      feed: (data, state) => {
        return ({feeds: state.feeds.concat(data)})
      },
      update: (data, state) => {
        // TODO: not sure how this would work with pixel-grid
        console.info('feed update')
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
        return ({
          uploadSpeed: _uploadSpeed(data.bytes)
        })
      }
    },
    subscriptions: [
      (send, done) => {
        stream.on('data', function (event) {
          const data = JSON.parse(event)
          const cb = (err) => {
            if (err) return done(err)
          }
          switch (data.type) {
            case 'key':
              return send('archive:key', data, cb)
            case 'feed':
              return send('archive:feed', data, cb)
            case 'update':
              return send('archive:update', data, cb)
            case 'download':
              return send('archive:download', data, cb)
            case 'upload':
              return send('archive:upload', data, cb)
          }
        })
      }
    ]
  }
}
