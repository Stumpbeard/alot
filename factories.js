let cursorFactory = (scene) => {
    let ent = Entity()

    image(ent, 'cursor')
    position(ent, 0, 0, 5)
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