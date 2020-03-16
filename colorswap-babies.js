//red baby
let redBabyAlotSheet = new Image()
redBabyAlotSheet.src = 'images/baby-alot-red-sheet.png'
images['redBabyAlot'] = redBabyAlotSheet

//blue baby
let blueBabyAlotSheet = new Image()
blueBabyAlotSheet.src = 'images/baby-alot-blue-sheet.png'
images['blueBabyAlot'] = blueBabyAlotSheet

//green baby
let greenBabyAlotSheet = new Image()
greenBabyAlotSheet.src = 'images/baby-alot-green-sheet.png'
images['greenBabyAlot'] = greenBabyAlotSheet

//yellow baby
let yellowBabyAlotSheet = new Image()
yellowBabyAlotSheet.src = 'images/baby-alot-yellow-sheet.png'
images['yellowBabyAlot'] = yellowBabyAlotSheet

//purple baby
let purpleBabyAlotSheet = new Image()
purpleBabyAlotSheet.src = 'images/baby-alot-purple-sheet.png'
images['purpleBabyAlot'] = purpleBabyAlotSheet

//pink baby
let pinkBabyAlotSheet = new Image()
pinkBabyAlotSheet.src = 'images/baby-alot-pink-sheet.png'
images['pinkBabyAlot'] = pinkBabyAlotSheet

// baby red alot
let redBabyAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
}
let redBabyAlotFrames = []
for (let i = 0; i < redBabyAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(redBabyAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    redBabyAlotFrames.push(canvas)
}
sheets['redBabyAlot'] = {
    animations: redBabyAlotAnimations,
    frames: redBabyAlotFrames
}

// baby blue alot
let blueBabyAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
}
let blueBabyAlotFrames = []
for (let i = 0; i < blueBabyAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(blueBabyAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    blueBabyAlotFrames.push(canvas)
}
sheets['blueBabyAlot'] = {
    animations: blueBabyAlotAnimations,
    frames: blueBabyAlotFrames
}

// baby green alot
let greenBabyAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
}
let greenBabyAlotFrames = []
for (let i = 0; i < greenBabyAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(greenBabyAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    greenBabyAlotFrames.push(canvas)
}
sheets['greenBabyAlot'] = {
    animations: greenBabyAlotAnimations,
    frames: greenBabyAlotFrames
}

// baby yellow alot
let yellowBabyAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
}
let yellowBabyAlotFrames = []
for (let i = 0; i < yellowBabyAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(yellowBabyAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    yellowBabyAlotFrames.push(canvas)
}
sheets['yellowBabyAlot'] = {
    animations: yellowBabyAlotAnimations,
    frames: yellowBabyAlotFrames
}

// baby purple alot
let purpleBabyAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
}
let purpleBabyAlotFrames = []
for (let i = 0; i < purpleBabyAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(purpleBabyAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    purpleBabyAlotFrames.push(canvas)
}
sheets['purpleBabyAlot'] = {
    animations: purpleBabyAlotAnimations,
    frames: purpleBabyAlotFrames
}

// baby pink alot
let pinkBabyAlotAnimations = {
    idle: [0, 1],
    selected: [2],
    walk: [3, 4, 5, 6],
}
let pinkBabyAlotFrames = []
for (let i = 0; i < pinkBabyAlotSheet.naturalWidth; i += 32) {
    let canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, 32, 32)
    ctx.drawImage(pinkBabyAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
    pinkBabyAlotFrames.push(canvas)
}
sheets['pinkBabyAlot'] = {
    animations: pinkBabyAlotAnimations,
    frames: pinkBabyAlotFrames
}