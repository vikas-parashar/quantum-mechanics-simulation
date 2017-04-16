
'use strict'

const container = document.querySelector('main')
const canvas1 = document.getElementById('box1')
const canvas2 = document.getElementById('box2')
const canvas3 = document.getElementById('box3')
const canvas4 = document.getElementById('box4')
const ctx1 = canvas1.getContext('2d')
const ctx2 = canvas2.getContext('2d')
const ctx3 = canvas3.getContext('2d')
const ctx4 = canvas4.getContext('2d')

// const pi = Math.PI
// const mass = 1.6727
// console.log(pi)
var currentWidth = 200
var currentHeight = NaN
var energyLevels = []
var energyIndex = 1

const wellWidth = document.querySelector('.well-width')
// const energyCanvas = document.querySelector('.well-width')
const wellHeight = document.querySelector('.well-height')
const selectSimulation = document.querySelector('#select-simulation')
// const lineC = document.querySelector('.lineC');

function drawCanvas (canvas) {
  let canvasWidth = container.getBoundingClientRect().height / 2 - 20
  let canvasHeight = canvasWidth

  if (canvasWidth > 400) {
    canvas.width = canvasWidth
    canvas.height = canvasHeight
  } else {
    canvas.width = 400
    canvas.height = 400
  }

  return { x: canvas.width, y: canvas.height }
}

const C1 = drawCanvas(canvas1)
const C2 = drawCanvas(canvas2)
const C3 = drawCanvas(canvas3)
const C4 = drawCanvas(canvas4)
const X = C1.x
const Y = C1.y
var originX = X / 2 - currentWidth / 2
var originY = Y / 2

function drawAxisX (ctx, x1, x2, y) {
  ctx.beginPath()
  ctx.moveTo(x1, y)
  ctx.lineTo(x2, y)
  ctx.strokeStyle = '#828282'

  ctx.moveTo(x1 + 5, y - 5)
  ctx.lineTo(x1, y)
  ctx.lineTo(x1 + 5, y + 5)

  ctx.moveTo(x2 - 5, y - 5)
  ctx.lineTo(x2, y)
  ctx.lineTo(x2 - 5, y + 5)
  ctx.stroke()
  ctx.save()
}

function drawAxisY (ctx, x, y1, y2) {
  ctx.beginPath()
  ctx.moveTo(x, y1)
  ctx.lineTo(x, y2)
  ctx.strokeStyle = '#828282'

  ctx.moveTo(x - 5, y1 + 5)
  ctx.lineTo(x, y1)
  ctx.lineTo(x + 5, y1 + 5)

  ctx.moveTo(x - 5, y2 - 5)
  ctx.lineTo(x, y2)
  ctx.lineTo(x + 5, y2 - 5)

  ctx.stroke()
  ctx.save()
}

function drawAxis (ctx, y, x) {
  let x1 = 0
  let x2 = X

  if (x === 'undefined') {
    let y1 = -10
    let y2 = 0
    drawAxisX(ctx, x1, x2, y)
    drawAxisY(ctx, x, y1, y2)
  } else {
    let y1 = 0
    let y2 = Y
    drawAxisX(ctx, x1, x2, y)
    drawAxisY(ctx, x, y1, y2)
  }
}

function drawDot (ctx, x, y) {
  x = x + originX
  y = -y + originY
  ctx.beginPath()
  ctx.fillStyle = '#ff0000'
  ctx.arc(x, y, 1, Math.PI * 2, true)
  // ctx.fillRect(x - 1, y - 1, 1, 1)
  ctx.fill()
  // ctx.save();
  ctx.closePath()
  console.log(originX, originY)
}

function drawWell (ctx, a, v) {
  if (isNaN(v) || typeof v === 'undefined') {
    a = 1 * a
    ctx.beginPath()
    ctx.strokeStyle = '#ff0000'
    ctx.moveTo(originX, originY - Y)
    ctx.lineTo(originX, originY)
    ctx.lineTo(a + originX, originY)
    ctx.lineTo(a + originX, originY - Y)
    ctx.stroke()
    ctx.closePath()
    // crx.save()
    // console.log('drew infintie box');
  } else {
    // wellHeight.addEventListener('mousemove', handleHeight, true);
    a = 1 * a
    ctx.beginPath()
    ctx.strokeStyle = '#ff0000'
    ctx.moveTo(originX, originY - v)
    ctx.lineTo(originX, originY)
    ctx.lineTo(a + originX, originY)
    ctx.lineTo(a + originX, originY - v)
    ctx.stroke()
    ctx.closePath()
    // ctx.save()
    // console.log('drew finite box');
  }
}

function drawLine (ctx, x1, y1, x2, y2, color) {
  // x = x + X/2
  // y = y + Y/2

  // for (var i = -X; i <= X;) {
  //   ctx.beginPath()
  //   // i = i+ X/2;
  //   let y = (m * i) + c
  //   drawDot(i, y)
  //   ctx.closePath()
  //   i += 0.05
  // };
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.lineWidth = 1
  ctx.strokeStyle = color
  ctx.stroke()
  ctx.closePath()
}

function drawEverything (ctx, width, height) {
  drawAxis(ctx, originX, originY)
  drawWell(ctx, width, height)
  drawEnergyLevel(ctx2, width)
  // drawDot(100 , Y/2);
}

function energy (n, a) {
  // return 13.6 * (n * n) / (a * a)
  const aa = a / 100
  let energy = 13.6 * (n * n) / (aa * aa)
  return energy
}

function drawEnergyLevel (ctx, a, color) {
  // drawAxisX(-100, X + 100, energy(1, a))
  energyLevels = []
  for (let i = 1; i < 20; i++) {
    let posY = parseInt(originY - energy(i, a))
    if (!isNaN(currentHeight) && posY > originY - currentHeight) {
      drawLine(ctx, 10, posY, X - 10, posY, color)
    } else if (isNaN(currentHeight)) {
      drawLine(ctx, 10, posY, X - 10, posY, color)
    }
    // drawAxisX(ctx, -100, X + 100, posY)
    // console.log(parseInt(originY - energy(i, a)), originY - currentHeight)
    energyLevels.push(posY)
  }
  // console.log(energyLevels)
}

function equationWaveform (x, n, a) {
  // Draw waveform on energy level on graph
  // var y = Math.sqrt(2 / a) * Math.sin(n * Math.PI * x / a) * 1000 + energy(n, currentWidth)

  var y = Math.sqrt(2 / a) * Math.sin(n * Math.PI * x / a) * 500
  return { x: x + originX, y: (originY - y) }
}

function equationProbabilityDensity (x, n, a) {
  // Draw waveform on energy level on graph
  // var y = Math.sqrt(2 / a) * Math.sin(n * Math.PI * x / a) * 1000 + energy(n, currentWidth)

  var y = (Math.sqrt(2 / a) * Math.sin(n * Math.PI * x / a) ** 2) * 500
  return { x: x + originX, y: (originY - y) }
}

function equationLog (x) {
  let y = (2.78 ** (6 - x * 0.01))
  console.log(x, y)
  return { x: x, y: (originY - y) }
}

function gradient (a, b) {
  return (b.y - a.y) / (b.x - a.x)
}

function bzCurve (ctx, points, f, t) {
  // f = 0, will be straight line
  // t suppose to be 1, but changing the value can control the smoothness too
  if (typeof (f) === 'undefined') f = 0.3
  if (typeof (t) === 'undefined') t = 1

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)

  var m = 0
  var dx1 = 0
  var dy1 = 0

  var preP = points[0]
  for (var i = 1; i < points.length; i++) {
    var curP = points[i]
    var nexP = points[i + 1]
    if (nexP) {
      m = gradient(preP, nexP)
      var dx2 = (nexP.x - curP.x) * -f
      var dy2 = dx2 * m * t
    } else {
      dx2 = 0
      dy2 = 0
    }
    ctx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y)
    dx1 = dx2
    dy1 = dy2
    preP = curP
  }
  ctx.stroke()
}

function drawWaveform (ctx, a, n) {
  var lines = []

  for (let i = 0; i <= a; i += 1) {
    let y = equationWaveform(i, n, a)
    lines.push(y)
  }

  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'blue'
  bzCurve(ctx, lines, 0.3, 1)
}

function drawOutsideWell (ctx, a, n) {
  var liness = []

  for (let i = a; i <= X; i += 1) {
    let y = equationLog(i)
    console.log('x:', i, 'y:', y)
    liness.push(y)
  }

  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'green'
  bzCurve(ctx, liness, 0.3, 1)
}

function drawProbabilityDensity (ctx, a, n) {
  var lines = []

  for (let i = 0; i <= a; i += 1) {
    let y = equationProbabilityDensity(i, n, a)
    lines.push(y)
  }

  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'darkblue'
  bzCurve(ctx, lines, 0.3, 1)
  ctx.fillStyle = 'darkblue'
  ctx.fill()
}

// function whichEnergyLevel(element, mousePositionY) {
//   return element === mousePositionY
// }
function clearCanvas () {
  ctx1.clearRect(0, 0, X, Y)
  ctx2.clearRect(0, 0, X, Y)
  ctx3.clearRect(0, 0, X, Y)
  ctx4.clearRect(0, 0, X, Y)
}

function handleWidth () {
  // let ctx = ctx1
  var w = wellWidth.value
  clearCanvas()
  drawWell(ctx1, w, currentHeight)
  drawAxis(ctx1, originY)
  drawAxis(ctx2, originY)
  drawAxis(ctx3, originY, originX)
  drawAxis(ctx4, originY, originX)
  drawEnergyLevel(ctx2, w, '#ff00ff')
  drawWaveform(ctx3, w, energyIndex)
  drawProbabilityDensity(ctx4, w, energyIndex)
  drawOutsideWell(ctx3, w, energyIndex)
  // console.log(this.value === w)
  currentWidth = w
  originX = X / 2 - currentWidth / 2
}

function handleHeight () {
  var h = wellHeight.value
  // ctx.clearRect(0, 0, X, Y)
  // drawEverything(currentWidth, h)
  handleWidth()
  currentHeight = h
}

function handleWaveForm (e) {
  let clickedY = e.pageY - this.offsetTop
  energyLevels.forEach(function (e) {
    if (e === clickedY) {
      drawLine(ctx2, 10, e, X - 10, e, '#ffff00')
      energyIndex = energyLevels.indexOf(e) + 1
      ctx3.clearRect(0, 0, X, Y)
      ctx4.clearRect(0, 0, X, Y)
      drawAxis(ctx3, originY, originX)
      drawWaveform(ctx3, currentWidth, energyIndex)
      drawAxis(ctx4, originY, originX)
      drawProbabilityDensity(ctx4, currentWidth, energyIndex)
      // ctx2.clearRect(10, e, X - 10, e)
    }
  })
}

wellWidth.addEventListener('mousemove', handleWidth, true)
canvas2.addEventListener('mousemove', handleWaveForm, true)
wellHeight.addEventListener('mousemove', handleHeight, true)
selectSimulation.addEventListener('click', function (e) {
  let selectedID = e.target.id
  if (selectedID === 'finite') {
    wellHeight.removeAttribute('disabled')
    clearCanvas()
    drawFiniteWell()
  } else {
    // disable height controller and set height to infinite(NaN)
    // and draw the well again.

    wellHeight.disabled = 'true'
    currentHeight = NaN
    clearCanvas()
    drawInfiniteWell()
  }
}, true)

function drawInfiniteWell () {
  // Draw X axis in canvas1
  drawAxis(ctx1, originY)

  // Draw X axis in canvas2
  drawAxis(ctx2, originY)

  // Draw X axis in canvas3
  drawAxis(ctx3, originY, originX)

  // Draw X axis in canvas4
  drawAxis(ctx4, originY, originX)

  // Draw well in canvas1
  drawWell(ctx1, currentWidth, NaN)

  // Draw energy levels in canvas2
  drawEnergyLevel(ctx2, currentWidth, '#ff00ff')

  // Draw waveform in canvas3
  drawWaveform(ctx3, currentWidth, energyIndex)

  // Draw waveform in canvas4
  drawProbabilityDensity(ctx4, currentWidth, energyIndex)
}

function drawFiniteWell () {
  // Draw X axis in canvas1
  drawAxis(ctx1, originY)

  // Draw X axis in canvas2
  drawAxis(ctx2, originY)

  // Draw X axis in canvas3
  drawAxis(ctx3, originY, originX)

  // Draw X axis in canvas4
  drawAxis(ctx4, originY, originX)

  // Draw well in canvas1
  drawWell(ctx1, currentWidth, currentHeight)

  // Draw energy levels in canvas2
  drawEnergyLevel(ctx2, currentWidth, '#ff00ff')

  // Draw waveform in canvas3
  drawWaveform(ctx3, currentWidth, energyIndex)
  drawOutsideWell(ctx3, currentWidth, energyIndex)

  // Draw waveform in canvas4
  drawProbabilityDensity(ctx4, currentWidth, energyIndex)
}

drawInfiniteWell()
// drawFiniteWell()
