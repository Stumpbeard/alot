const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.!?'

let fontBlack = {}
let fontBlackImage = new Image()
fontBlackImage.src = 'images/font-black.png'

let fontWhite = {}
let fontWhiteImage = new Image()
fontWhiteImage.src = 'images/font-white.png'

function initializeFonts() {
    let offsetX = 0
    let offsetY = 0
    let width = fontBlackImage.width
    let height = fontBlackImage.height
    for (let i = 0; i < alphabet.length; ++i) {
        let canvas = document.createElement('canvas')
        canvas.height = 8
        canvas.width = 8
        let ctx = canvas.getContext('2d')
        ctx.drawImage(fontBlackImage, offsetX, offsetY, 8, 8, 0, 0, 8, 8)
        offsetX += 8
        if (offsetX === width) {
            offsetX = 0
            offsetY += 8
        }

        fontBlack[alphabet[i]] = canvas
    }

    offsetX = 0
    offsetY = 0
    width = fontWhiteImage.width
    height = fontWhiteImage.height
    for (let i = 0; i < alphabet.length; ++i) {
        let canvas = document.createElement('canvas')
        canvas.height = 8
        canvas.width = 8
        let ctx = canvas.getContext('2d')
        ctx.drawImage(fontWhiteImage, offsetX, offsetY, 8, 8, 0, 0, 8, 8)
        offsetX += 8
        if (offsetX === width) {
            offsetX = 0
            offsetY += 8
        }

        fontWhite[alphabet[i]] = canvas
    }
}

function drawWhiteText(context, text, x, y) {
    for (let i = 0; i < text.length; ++i) {
        let char = text[i]
        if (char === ' ') {
            x += 4
            continue
        }
        context.drawImage(fontWhite[char], x, y)
        x += 8
    }
}

function drawBlackText(context, text, x, y) {
    for (let i = 0; i < text.length; ++i) {
        let char = text[i]
        if (char === ' ') {
            x += 4
            continue
        }
        context.drawImage(fontBlack[char], x, y)
        x += 8
    }
}