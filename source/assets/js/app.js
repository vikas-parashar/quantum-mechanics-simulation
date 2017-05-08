
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
var currentWidth = 100
var currentHeight = NaN
var energyLevels = []
var energyIndex = 1
var k = 1

const wellWidth = document.querySelector('.well-width')
const kValue = document.querySelector('.k-value')
const wellHeight = document.querySelector('.well-height')
const selectSimulation = document.querySelector('#select-simulation')
// const box = document.querySelector('.box')
// const lineC = document.querySelector('.lineC');

function factorial (n) {
  if (n === 0) {
    return 1
  } else {
    return n * factorial(n - 1)
  }
}

function drawCanvas (canvas) {
  // let canvasWidth = container.getBoundingClientRect().height / 2 - 20
  // let canvasHeight = canvasWidth
  let canvasWidth = canvas4.getBoundingClientRect().height
  let canvasHeight = canvasWidth

  // if (canvasWidth > 320) {
    canvas.width = canvasWidth
    canvas.height = canvasHeight
  // } else {
  //   canvas.width = 320
  //   canvas.height = 320
  // }

  return { x: canvas.width, y: canvas.height }
}

const C1 = drawCanvas(canvas1)
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
  ctx.fillStyle = '#828282'
  ctx.font = 'bold 10px Arial'
  ctx.fillText('X', x2 - 15, y + 10)
  ctx.save()
}

function drawAxisY (ctx, x, y1, y2) {
  ctx.beginPath()
  ctx.moveTo(x, y1)
  ctx.lineTo(x, y2 - 60)
  ctx.strokeStyle = '#828282'

  ctx.moveTo(x - 5, y1 + 5)
  ctx.lineTo(x, y1)
  ctx.lineTo(x + 5, y1 + 5)

  ctx.moveTo(x - 5, y2 - 65)
  ctx.lineTo(x, y2 - 60)
  ctx.lineTo(x + 5, y2 - 65)
  ctx.stroke()
  ctx.fillStyle = '#828282'
  ctx.font = 'bold 10px Arial'
  ctx1.fillText('V', x + 15, y1 + 10)
  ctx2.fillText('E', 15, y1 + 10)
  ctx3.fillText('Ψ', x + 15, y1 + 10)
  ctx4.fillText('|Ψ|^2', x + 15, y1 + 10)
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

function equationEnergy (n, a) {
  // return 13.6 * (n * n) / (a * a)
  const aa = a / 100
  let energy = 13.6 * (n * n) / (aa * aa)
  return energy
}

function equationHOEnergy (n, k, m) {
  return (n + 0.5) * Math.sqrt(k / m)
}

function drawEnergyLevel (ctx, a, color) {
  // drawAxisX(-100, X + 100, energy(1, a))
  energyLevels = []
  for (let i = 1; i < 20; i++) {
    let posY = parseInt(originY - equationEnergy(i, a))
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

function drawHOEnergyLevel (ctx, k, m, color) {
  energyLevels = []
  for (let i = 1; i < 10; i++) {
    let posY = parseInt(originY - equationHOEnergy(i, k, m))
    if (!isNaN(currentHeight) && posY > originY - currentHeight) {
      drawLine(ctx, 10, posY, X - 10, posY, color)
    } else if (isNaN(currentHeight)) {
      drawLine(ctx, 10, posY, X - 10, posY, color)
    }
    // drawAxisX(ctx, -100, X + 100, posY)
    // console.log(parseInt(originY - energy(i, a)), originY - currentHeight)
    energyLevels.push(posY)
  }
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

function equationSHM (x, k) {
  var y = 0.5 * k * 0.01 * x * x
  return { x: x + originX, y: (originY - y) }
}

function equationHOWaveform (x, k, n) {
  var e = 2.718281828459045
  var eq = 'e^(-x^2)'
  let tempConst = (k ** 0.25) * ((-1) ** n)
  for (var i = 1; i <= n; i++) {
    var ans = nerdamer.diff(eq, 'x').toString()
    eq = ans
    // console.log(ans)
  }
  let total = nerdamer(tempConst.toString() + ' * (e ^ ((x ^ 2) / 2)) *' + eq).evaluate({x: x / 10, e: e}).text() * 50
  // console.log(total, originY - total)
  // let y = e ** ((-(x ** 2)) * 0.01 / 2) * (x * 0.1) * 100
  // console.log(x,y)
  return { x: x + originX, y: (originY - total) }
}

function equationHOProbabilityDensity (x, k, n) {
  var e = 2.718281828459045
  var eq = 'e^(-x*x)'
  let tempConst = (k ** 0.25) * (-1) ** n
  for (var i = 1; i <= n; i++) {
    var ans = nerdamer.diff(eq, 'x').toString()
    eq = ans
  }
  let total = (nerdamer(tempConst.toString() + ' * (e ^ (-(x ^ 2) / 2)) *' + eq).evaluate({x: x / 10, e: e}).text() ** 2) * 50
  console.log(originY - total)
  return { x: x + originX, y: (originY - total) }
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
  ctx.beginPath()
  ctx.moveTo(originX + 0, originY - 0)
  ctx.lineTo(0, originY - 0)
  ctx.moveTo(originX + a, originY - 0)
  ctx.lineTo(X, originY - 0)
  ctx.lineWidth = 2
  ctx.strokeStyle = 'blue'
  ctx.stroke()
  ctx.closePath()
}

function drawHOWaveform (ctx, k, n) {
  var lines = []

  for (let i = -X; i <= X; i += 50) {
    let y = equationHOWaveform(i, k, n)
    // console.log('i', i, 'y', y.y)
    lines.push(y)
  }
  // console.log('k', k)
  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'blue'
  bzCurve(ctx, lines, 0.3, 1)
}

function drawCurveforSHM (ctx, k) {
  var lines = []

  for (let i = -X; i <= X; i += 1) {
    let y = equationSHM(i, k)
    lines.push(y)
  }

  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = '#ff0000'
  bzCurve(ctx, lines, 0.3, 1)
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

function drawHOProbabilityDensity (ctx, k, n) {
  var lines = []

  for (let i = -X; i <= X; i += 50) {
    let y = equationHOProbabilityDensity(i, k, n)
    // console.log('i', i, 'y', y.y)
    lines.push(y)
  }
  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'darkblue'
  bzCurve(ctx, lines, 0.3, 1)
  ctx.fillStyle = 'darkblue'
  ctx.fill()
}

function clearCanvas () {
  ctx1.clearRect(0, 0, X, Y - 58)
  ctx2.clearRect(0, 0, X, Y - 58)
  ctx3.clearRect(0, 0, X, Y - 58)
  ctx4.clearRect(0, 0, X, Y - 58)
}

function handleWidth () {
  // let ctx = ctx1
  var w = parseInt(wellWidth.value)
  clearCanvas()
  drawWell(ctx1, w, currentHeight)
  drawAxis(ctx1, originY)
  drawAxis(ctx2, originY)
  drawAxis(ctx3, originY, originX)
  drawAxis(ctx4, originY, originX)
  drawEnergyLevel(ctx2, w, '#ff00ff')
  drawWaveform(ctx3, w, energyIndex)
  drawProbabilityDensity(ctx4, w, energyIndex)
  // drawOutsideWell(ctx3, w, energyIndex)
  currentWidth = w
  originX = X / 2 - currentWidth / 2
  if (!wellHeight.disabled) {
    drawOutsideWell(ctx3, w, energyIndex)
  }
  // drawTitles()
}

function handleHeight () {
  var h = parseInt(wellHeight.value)
  // ctx.clearRect(0, 0, X, Y)
  // drawEverything(currentWidth, h)
  handleWidth()
  currentHeight = h
}

function handleWaveForm (e) {
  let clickedY = e.pageY - this.offsetTop
  energyLevels.forEach(function (e) {
    if (e === clickedY) {
      // drawLine(ctx2, 10, e, X - 10, e, '#ffff00')
      energyIndex = energyLevels.indexOf(e) + 1
      ctx3.clearRect(0, 0, X, Y - 60)
      ctx4.clearRect(0, 0, X, Y - 60)
      drawAxis(ctx3, originY, originX)
      // drawHOWaveform(ctx3, currentWidth, energyIndex)
      drawAxis(ctx4, originY, originX)
      // ctx2.clearRect(10, e, X - 10, e)
      if (!wellWidth.disabled) {
        drawWaveform(ctx3, currentWidth, energyIndex)
        drawProbabilityDensity(ctx4, currentWidth, energyIndex)
      } else {
        drawHOWaveform(ctx3, kValue.value, energyIndex)
        drawHOProbabilityDensity(ctx4, kValue.value, energyIndex)
      }
      if (!wellHeight.disabled) {
        drawOutsideWell(ctx3, currentWidth, energyIndex)
      }

      // drawTitles()
      energyIndex = 1
    }
  })
}

function handleKvalue (e) {
  k = parseInt(kValue.value)
  clearCanvas()
  drawCurveforSHM(ctx1, k)
  drawAxis(ctx1, originY)
  drawAxis(ctx2, originY)
  drawAxis(ctx3, originY, originX)
  drawAxis(ctx4, originY, originX)
  drawHOEnergyLevel(ctx2, k, 0.001, '#ff00ff')
  drawHOWaveform(ctx3, k, energyIndex)
  drawHOProbabilityDensity(ctx4, k, energyIndex)
  // drawTitles()
  // drawProbabilityDensity(ctx4, w, energyIndex)
}

canvas2.addEventListener('mousemove', handleWaveForm, true)
// wellHeight.addEventListener('mousemove', handleHeight, true)
// kValue.addEventListener('mousemove', handleKvalue, true)

function onRangeChange (r, f) {
  var n, c, m
  r.addEventListener('input', function (e) { n = 1; c = e.target.value; if (c !== m)f(e); m = c })
  r.addEventListener('change', function (e) { if (!n)f(e) })
}
onRangeChange(wellWidth, handleWidth)
onRangeChange(wellHeight, handleHeight)
// onRangeChange(canvas2, handleWaveForm)
onRangeChange(kValue, handleKvalue)

selectSimulation.addEventListener('click', function (e) {
  let selectedID = e.target.id
  // console.log(selectedID)
  if (selectedID === 'finite') {
    wellHeight.removeAttribute('disabled')
    wellWidth.removeAttribute('disabled')
    kValue.disabled = 'true'
    clearCanvas()
    drawFiniteWell()
  } else if (selectedID === 'ho') {
    wellHeight.disabled = 'true'
    wellWidth.disabled = 'true'
    kValue.removeAttribute('disabled')
    // kValue.value = 1
    clearCanvas()
    drawHO(k, 1 / 10000)
  } else {
    // disable height controller and set height to infinite(NaN)
    // and draw the well again.

    wellHeight.disabled = 'true'
    kValue.disabled = 'true'
    wellWidth.removeAttribute('disabled')
    currentHeight = NaN
    clearCanvas()
    drawInfiniteWell()
  }
}, true)

function drawInfiniteWell () {
  originX = X / 2 - currentWidth / 2
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

  // drawTitles()
}

function drawFiniteWell () {
  originX = X / 2 - currentWidth / 2
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
  drawOutsideWell(ctx4, currentWidth, energyIndex)

  // Draw waveform in canvas4
  drawProbabilityDensity(ctx4, currentWidth, energyIndex)

  // drawTitles()
}

function drawHO (k, m) {
  // Draw X axis in canvas1
  originX = X / 2
  drawAxis(ctx1, originY)

  // Draw X axis in canvas2
  drawAxis(ctx2, originY)

  // Draw X axis in canvas3
  drawAxis(ctx3, originY, originX)

  // Draw X axis in canvas4
  drawAxis(ctx4, originY, originX)

  drawCurveforSHM(ctx1, k)

  // Draw energy levels in canvas2
  drawHOEnergyLevel(ctx2, k, m, '#ff00ff')

  // Draw wave function
  drawHOWaveform(ctx3, k, energyIndex)

  drawHOProbabilityDensity(ctx4, k, energyIndex)

  // drawTitles()
}

drawCanvas(canvas2)
drawCanvas(canvas3)
drawCanvas(canvas4)

drawInfiniteWell()
drawTitles()

// drawFiniteWell()
// drawHO(0.03, 1 / 10000)


function drawTitles () {
  ctx3.save()
  ctx1.fillStyle = 'green'
  ctx1.font = 'bold 16px Arial'
  ctx1.fillText("Particle's Position", (X / 2) - 70, Y - 20)

  ctx2.fillStyle = 'green'
  ctx2.font = 'bold 16px Arial'
  ctx2.fillText('Energy Levels', (X / 2) - 70, Y - 20)

  ctx3.fillStyle = 'green'
  ctx3.font = 'bold 16px Arial'
  ctx3.fillText('Wave function', (X / 2) - 70, Y - 20)

  ctx4.fillStyle = 'green'
  ctx4.font = 'bold 16px Arial'
  ctx4.fillText('Probability Density', (X / 2) - 70, Y - 20)
}
