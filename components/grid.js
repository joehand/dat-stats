const html = require('choo/html')
const widget = require('cache-element/widget')
const pixels = require('pixel-grid')

module.exports = widget(function createEl (update) {
  let data = null
  let grid = null

  update((newData) => {
    data = newData
    if (grid) grid.update(gridifyBlocks(data))
  })

  return html`
    <div class="grid-wrapper">
      <div class="grid" onload=${onload}></div>
    </div>
  `

  function onload (el) {
    const size = data.length > 200 ? 8 : 12
    const pad = 1
    let cols = Math.floor(1106 / (size + pad))
    const rows = Math.floor(data.length / cols) + 1
    if (rows === 1) cols = data.length

    grid = pixels(gridifyBlocks(data), {
      size: size,
      padding: pad,
      columns: cols,
      rows: rows,
      background: [.91, .92, .93],
      formatted: true
    })

    el.appendChild(grid.canvas)
  }

  function gridifyBlocks (blocks) {
    const gridData = []
    // const end = blocks.length > 1000 ? 1000 : blocks.length
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i]) gridData.push([.207, .705, .310])
      else gridData.push([.91, .92, .93])
    }
    return gridData
  }
})
