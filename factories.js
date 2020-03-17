let cursorFactory = (scene) => {
    let ent = Entity()

    image(ent, 'cursor')
    position(ent, 0, 0, 2)
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