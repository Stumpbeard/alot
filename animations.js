let loadAnimations = () => {
    // brown alot
    let brownAlotAnimations = {
        idle: [0, 1],
        selected: [2],
        walk: [3, 4, 5, 6],
        dig: [9, 10, 11, 12],
        found: [13, 14]
    }
    let brownAlotFrames = []
    for (let i = 0; i < brownAlotSheet.naturalWidth; i += 32) {
        let canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        let ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, 32, 32)
        ctx.drawImage(brownAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
        brownAlotFrames.push(canvas)
    }
    sheets['brownAlot'] = {
        animations: brownAlotAnimations,
        frames: brownAlotFrames
    }

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

    // baby brown alot
    let brownBabyAlotAnimations = {
        idle: [0, 1],
        selected: [2],
        walk: [3, 4, 5, 6],
    }
    let brownBabyAlotFrames = []
    for (let i = 0; i < brownBabyAlotSheet.naturalWidth; i += 32) {
        let canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        let ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, 32, 32)
        ctx.drawImage(brownBabyAlotSheet, i, 0, 32, 32, 0, 0, 32, 32)
        brownBabyAlotFrames.push(canvas)
    }
    sheets['brownBabyAlot'] = {
        animations: brownBabyAlotAnimations,
        frames: brownBabyAlotFrames
    }

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
}
