let cursorFactory = (scene) => {
    let ent = Entity()

    image(ent, 'cursor')
    position(ent, 0, 0, 99)
    scene.world.add(ent)

    return ent
}

let bgRanchFactory = (scene) => {
    let ent = Entity()

    position(ent, 0, 0, 0)
    image(ent, 'bgRanch')
    scene.world.add(ent)

    return ent
}

let sideMenuFactory = (scene) => {
    let ent = Entity()

    position(ent, WIDTH - 64, 0, 3)
    image(ent, 'sideMenu')
    selectedAlots(ent)
    scene.world.add(ent)

    return ent
}

let buttonFactory = (scene, x, y, text) => {
    console.log('this happened')
    let ent = Entity()

    if (!images['menuButton' + text]) {
        let canvas = document.createElement('canvas')
        canvas.width = 56
        canvas.height = 8
        let context = canvas.getContext('2d')
        context.drawImage(images['menuButton'], 0, 0)
        drawWhiteText(context, text, 28 - (4 * (text.length)), 0)
        images['menuButton' + text] = canvas
    }

    position(ent, x, y, 4)
    image(ent, 'menuButton' + text)
    buttonText(ent, text)
    scene.world.add(ent)

    return ent
}