// HELPERS

let colorDeterminer = (genes) => {
    let red = (genes.red === 'RR')
    let blue = (genes.blue === 'BB')
    let yellow = (genes.yellow === 'YY')

    if (red && !blue && !yellow) {
        return 'red'
    } else if (!red && blue && !yellow) {
        return 'blue'
    } else if (red && !blue && yellow) {
        return 'yellow'
    } else if (red && blue && !yellow) {
        return 'purple'
    } else if (red && !blue && yellow) {
        return 'pink'
    } else if (!red && blue && yellow) {
        return 'green'
    } else {
        return 'brown'
    }
}

// FACTORIES

let EntityAlot = (scene, x, y, spd, genes) => {
    let ent = Entity()

    ComponentPosition(ent, x, y, 0, 32, 32)
    ComponentAnimation(ent, 'idle', 500)
    ComponentTarget(ent)
    ComponentTimer(ent)
    ComponentHorny(ent)
    ComponentSpeed(ent, spd)
    ComponentSelected(ent)
    ComponentGenetics(ent, genes)
    ComponentSprite(ent, colorDeterminer(genes) + 'Alot')

    scene.world.push(ent)
}

let EntityBabyAlot = (scene, x, y, spd, genes) => {
    let ent = Entity()

    ComponentPosition(ent, x, y, 0, 32, 32)
    ComponentAnimation(ent, 'idle', 500)
    ComponentTimer(ent, { growup: 60000 })
    ComponentSpeed(ent, spd)
    ComponentGenetics(ent, genes)
    ComponentSprite(ent, colorDeterminer(genes) + 'BabyAlot')

    scene.world.push(ent)
}

let EntityEggplant = (scene, x, y) => {
    let ent = Entity()

    ComponentPosition(ent, x, y, 1, 8, 8)
    ComponentSprite(ent, 'foodEggplant')
    ComponentHeld(ent)

    scene.world.push(ent)
}

let EntityItemSpawner = (scene) => {
    let ent = Entity()

    ComponentTimer(ent, { itemSpawn: 15000 })

    scene.world.push(ent)
}

let EntityHeartStatus = (scene, target) => {
    let ent = Entity()

    ComponentPosition(ent, target.x, target.y, 0, 8, 8)
    ComponentTarget(ent, { aboveHead: target })
    ComponentSprite(ent, 'statusHorny')

    scene.world.push(ent)
}

let EntityCursor = (scene) => {
    let ent = Entity()

    ComponentPosition(ent, 0, 0, 900, 8, 8)
    ComponentIsPlayer(ent)
    ComponentSprite(ent, 'cursor')

    scene.world.push(ent)
}