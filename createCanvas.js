
const {
  createCanvas,
  loadImage,
} = require('canvas')

const canvas = createCanvas(512, 512)
const context = canvas.getContext('2d')

module.exports = {
    clearCanvas: function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height)
      },
    canvas,
    context,
    loadImage,
}