//red alot
let redAlotSheet = new Image()
redAlotSheet.src = 'images/alotofred-sheet.png'
images['redAlot'] = redAlotSheet

// red alot
let redAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
    dig: [9, 10, 11, 12],
    found: [13, 14]
}
let redAlotFrames = []
for (let i = 0; i < redAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(redAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    redAlotFrames.push(canvas)
}
sheets['redAlot'] = {
    animations: redAlotAnimations,
    frames: redAlotFrames
}

//blue alot
let blueAlotSheet = new Image()
blueAlotSheet.src = 'images/alotofblue-sheet.png'
images['blueAlot'] = blueAlotSheet

// blue alot
let blueAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
    dig: [9, 10, 11, 12],
    found: [13, 14]
}
let blueAlotFrames = []
for (let i = 0; i < blueAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(blueAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    blueAlotFrames.push(canvas)
}
sheets['blueAlot'] = {
    animations: blueAlotAnimations,
    frames: blueAlotFrames
}

//green alot
let greenAlotSheet = new Image()
greenAlotSheet.src = 'images/alotofgreen-sheet.png'
images['greenAlot'] = greenAlotSheet

// green alot
let greenAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
    dig: [9, 10, 11, 12],
    found: [13, 14]
}
let greenAlotFrames = []
for (let i = 0; i < greenAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(greenAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    greenAlotFrames.push(canvas)
}
sheets['greenAlot'] = {
    animations: greenAlotAnimations,
    frames: greenAlotFrames
}

//yellow alot
let yellowAlotSheet = new Image()
yellowAlotSheet.src = 'images/alotofyellow-sheet.png'
images['yellowAlot'] = yellowAlotSheet

// yellow alot
let yellowAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
    dig: [9, 10, 11, 12],
    found: [13, 14]
}
let yellowAlotFrames = []
for (let i = 0; i < yellowAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(yellowAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    yellowAlotFrames.push(canvas)
}
sheets['yellowAlot'] = {
    animations: yellowAlotAnimations,
    frames: yellowAlotFrames
}

//purple alot
let purpleAlotSheet = new Image()
purpleAlotSheet.src = 'images/alotofpurple-sheet.png'
images['purpleAlot'] = purpleAlotSheet

// purple alot
let purpleAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
    dig: [9, 10, 11, 12],
    found: [13, 14]
}
let purpleAlotFrames = []
for (let i = 0; i < purpleAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(purpleAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    purpleAlotFrames.push(canvas)
}
sheets['purpleAlot'] = {
    animations: purpleAlotAnimations,
    frames: purpleAlotFrames
}

//pink alot
let pinkAlotSheet = new Image()
pinkAlotSheet.src = 'images/alotofpink-sheet.png'
images['pinkAlot'] = pinkAlotSheet

// pink alot
let pinkAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
    dig: [9, 10, 11, 12],
    found: [13, 14]
}
let pinkAlotFrames = []
for (let i = 0; i < pinkAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(pinkAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    pinkAlotFrames.push(canvas)
}
sheets['pinkAlot'] = {
    animations: pinkAlotAnimations,
    frames: pinkAlotFrames
}