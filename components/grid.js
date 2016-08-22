const html = require('choo/html')
const pixels = require('pixel-grid')

module.exports = function createGridView (data) {
  var el = html`<div class="grid"></div>`
  var grid = createGrid(el, data)

  return {
    grid: grid,
    createEl: function gridView () {
      return html`<div class="grid-wrapper">${el}</div>`
    }
  }
}

function createGrid (el, data) {
  const size = data.length > 200 ? 8 : 12
  const pad = 1
  let cols = Math.floor(1106 / (size + pad))
  const rows = Math.floor(data.length/cols) + 1
  if (rows === 1) cols = data.length

  const grid = pixels(gridifyBlocks(data), {
    root: el,
    size: size,
    padding: pad,
    columns: cols,
    rows: rows,
    background: [.91,.92,.93],
    formatted: true
  })

  grid._update = grid.update
  grid.update = (data) =>  {
    grid._update(gridifyBlocks(data))
  }

  function gridifyBlocks (blocks) {
    const gridData = []
    // const end = blocks.length > 1000 ? 1000 : blocks.length
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i]) gridData.push([.207,.705,.310])
      else gridData.push([.91,.92,.93])
    }
    return gridData
  }

  return grid
}