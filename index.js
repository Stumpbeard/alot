// Globals
const HEIGHT = 240
const WIDTH = 256
const SCALE = 4
let EVENT_QUEUE = []


// Audio
let ranchMusic = document.createElement('audio')
ranchMusic.src = "sounds/ranch-music.mp3"
ranchMusic.loop = true

let clickSound = document.createElement('audio')
clickSound.src = "sounds/click.mp3"


// Main function
let main = (timestamp) => {
    window.requestAnimationFrame(main)

    activeScene[0].runSystems()
}


// ECS stuff
let uid = 0;

let Entity = () => uid++;
let Registry = Array;


// Entity factories
let bgDigFactory = (scene) => {
    let ent = Entity()

    position(ent, 0, 0)
    image(ent, 'bgDig')
    scene.world.push(ent)

    return ent
}

let fruitSpawnerFactory = (scene) => {
    let ent = Entity()

    let spawnerAI = () => {
        let entTimer = Timer.get(ent)
        entTimer.timer -= 1000 / 60
        if (entTimer.timer <= 0) {
            let existingItems = 0
            scene.world.forEach(ent => {
                if (Bonus.get(ent)) existingItems += 1
            });
            if (existingItems < 10) {
                let x = Math.floor(Math.random() * (scene.w - 64 - 8))
                let y = Math.floor(Math.random() * (scene.h - 8))
                eggplantFactory(scene, x, y)
            }
            timer(ent, 15000)
        }
    }

    ai(ent, spawnerAI)
    timer(ent, 15000)
    scene.world.push(ent)

    return ent
}

let geneticSimulator = (ent1, ent2) => {
    let genes1 = Genetics.get(ent1)
    let genes2 = Genetics.get(ent2)

    let childGenes = {
        brown: (genes1.brown + genes2.brown) / 2,
        red: (genes1.red + genes2.red) / 2,
        blue: (genes1.blue + genes2.blue) / 2,
        green: (genes1.green + genes2.green) / 2,
        yellow: (genes1.yellow + genes2.yellow) / 2,
        purple: (genes1.purple + genes2.purple) / 2,
        pink: (genes1.pink + genes2.pink) / 2,
    }

    let topColor = 'brown'
    let topColorValue = 0
    for (const colorKey in childGenes) {
        if (childGenes.hasOwnProperty(colorKey)) {
            const colorValue = childGenes[colorKey];
            if (colorValue > topColorValue) {
                topColor = colorKey
                topColorValue = colorValue
            }
        }
    }

    let geneArray = [
        childGenes.brown,
        childGenes.brown + childGenes.red,
        childGenes.brown + childGenes.red + childGenes.blue,
        childGenes.brown + childGenes.red + childGenes.blue + childGenes.green,
        childGenes.brown + childGenes.red + childGenes.blue + childGenes.green + childGenes.yellow,
        childGenes.brown + childGenes.red + childGenes.blue + childGenes.green + childGenes.yellow + childGenes.purple,
        childGenes.brown + childGenes.red + childGenes.blue + childGenes.green + childGenes.yellow + childGenes.purple + childGenes.pink,
    ]

    let geneRoll = Math.floor(Math.random() * 100)
    let rolledGene = 6
    for (let i = 0; i < 7; ++i) {
        if (geneRoll < geneArray[i]) {
            rolledGene = i
            break
        }
    }
    switch (rolledGene) {
        case 0:
            rolledColor = 'brown'
            break
        case 1:
            rolledColor = 'red'
            break
        case 2:
            rolledColor = 'blue'
            break
        case 3:
            rolledColor = 'green'
            break
        case 4:
            rolledColor = 'yellow'
            break
        case 5:
            rolledColor = 'purple'
            break
        case 6:
            rolledColor = 'pink'
            break
    }
    let temp = childGenes[topColor]
    childGenes[topColor] = childGenes[rolledColor]
    childGenes[rolledColor] = temp

    return childGenes
}

let getTopGeneticColor = (geneticsProfile) => {
    let color = 'brown'
    let topColorValue = 0
    for (const colorKey in geneticsProfile) {
        if (geneticsProfile.hasOwnProperty(colorKey)) {
            const colorValue = geneticsProfile[colorKey];
            if (colorValue > topColorValue) {
                color = colorKey
                topColorValue = colorValue
            }
        }
    }
    return color
}

let randomXY = (scene) => [
    Math.floor(Math.random() * (scene.w - 96)),
    Math.floor(Math.random() * scene.h)
]

let randomAtr = () => [
    NAMES[Math.floor(Math.random() * NAMES.length)],
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    ((Math.floor(Math.random() * 2)) ? 'male' : 'female')
]


let alotFactory = (scene, attr, x, y, geneticsProfile) => {
    let ent = Entity()
    if (!geneticsProfile) {
        geneticsProfile = {
            brown: 30,
            red: 70 / 6,
            blue: 70 / 6,
            green: 70 / 6,
            yellow: 70 / 6,
            purple: 70 / 6,
            pink: 70 / 6,
        }
    }
    let color = getTopGeneticColor(geneticsProfile)

    // let alotAI = () => {
    //     let position = Position.get(ent)
    //     let attributes = Attributes.get(ent)
    //     let state = State.get(ent)
    //     let status = Status.get(ent)
    //     let entAnimation = Animation.get(ent)
    //     let velocity = (attributes.speed.natural + attributes.speed.bonus) * 0.1

    //     if (state.mating) {
    //         if (entAnimation.animation === 'found') {
    //             let timer = Timer.get(ent)
    //             let target = Target.get(ent)
    //             timer.timer -= 1000 / 60
    //             if (timer.timer <= 0) {
    //                 state.mating = false
    //                 Timer.delete(ent)
    //                 if (status.status[0] === 'horny') {
    //                     let babyX = (position.x + target.x) / 2 + Math.floor(Math.random() * 32) - 16
    //                     let babyY = (position.y + target.y) / 2 + Math.floor(Math.random() * 32) - 16
    //                     let babyGene = geneticSimulator(ent, target.ent)
    //                     babyAlotFactory(scene, babyX, babyY, babyGene)
    //                     status.status = []
    //                     scene.world.forEach(otherEnt => {
    //                         let entTarget = Target.get(otherEnt)
    //                         let entAttr = Attributes.get(otherEnt)
    //                         if (!entTarget) return
    //                         if (entTarget.ent === ent && !entAttr) {
    //                             removeEntity(otherEnt)
    //                         }
    //                     });
    //                 }
    //                 Target.delete(ent)
    //             }
    //             return
    //         }
    //         if (entAnimation.animation !== 'walk') {
    //             animation(ent, 'walk', 500 - 50 * (attributes.speed.natural + attributes.speed.bonus))
    //         }
    //         let target = Target.get(ent)
    //         let targetPos = Position.get(target.ent)
    //         let averageX = Math.abs(position.x - targetPos.x) / 2
    //         let averageY = Math.abs(position.y - targetPos.y) / 2
    //         if (averageX >= averageY) {
    //             if (position.x < targetPos.x) {
    //                 position.x += velocity
    //             } else {
    //                 position.x -= velocity
    //             }
    //         } else if (averageX < averageY) {
    //             if (position.y < targetPos.y) {
    //                 position.y += velocity
    //             } else {
    //                 position.y -= velocity
    //             }
    //         }
    //         target.x = targetPos.x
    //         target.y = targetPos.y

    //         if (position.x < targetPos.x + 16 &&
    //             position.x + 16 > targetPos.x &&
    //             position.y < targetPos.y + 16 &&
    //             position.y + 16 > targetPos.y) {
    //             animation(ent, 'found', 250)
    //             timer(ent, 3000)
    //         }

    //         return
    //     }

    //     let entTimer = Timer.get(ent)

    //     if (entTimer) {
    //         entTimer.timer -= 1000 / 60
    //         if (entTimer.timer <= 0) {
    //             Timer.delete(ent)
    //             Target.delete(ent)
    //         }
    //     }

    //     if (state.clicked) {
    //         animation(ent, 'selected', 500)
    //         return
    //     }

    //     let entTarget = Target.get(ent)

    //     if (entTarget) {
    //         if (entAnimation.animation !== 'walk') {
    //             animation(ent, 'walk', 500 - 50 * (attributes.speed.natural + attributes.speed.bonus))
    //         }
    //         let averageX = Math.abs(position.x - entTarget.x) / 2
    //         let averageY = Math.abs(position.y - entTarget.y) / 2
    //         if (averageX >= averageY) {
    //             if (position.x < entTarget.x) {
    //                 position.x += velocity
    //             } else {
    //                 position.x -= velocity
    //             }
    //         } else if (averageX < averageY) {
    //             if (position.y < entTarget.y) {
    //                 position.y += velocity
    //             } else {
    //                 position.y -= velocity
    //             }
    //         }

    //         if (position.x < 0) position.x = 0
    //         if (position.x > WIDTH - 64 - 32) position.x = WIDTH - 64 - 32
    //         if (position.y < 0) position.y = 0
    //         if (position.y > HEIGHT - 32) position.y = HEIGHT - 32

    //         return
    //     }

    //     if (entAnimation.animation !== 'idle') animation(ent, 'idle', 500)
    //     if (state.hovered || state.clicked) return
    //     let decision = Math.floor(Math.random() * 20)
    //     if (decision < 19) return
    //     let dir = Math.floor(Math.random() * 5)
    //     switch (dir) {
    //         case 0:
    //             position.x -= velocity
    //             break
    //         case 1:
    //             position.x += velocity
    //             break
    //         case 2:
    //             position.y -= velocity
    //             break
    //         case 3:
    //             position.y += velocity
    //             break
    //         case 4:
    //             timer(ent, (Math.floor(Math.random() * 3) + 1) * 1000)
    //             target(ent, Math.floor(Math.random() * (WIDTH - 96)), Math.floor(Math.random() * (HEIGHT - 32)))
    //             animation(ent, 'walk', 500 - 50 * (attributes.speed.natural + attributes.speed.bonus))
    //             break
    //     }
    // }

    // let handler = (queue) => {
    //     let position = Position.get(ent)
    //     let state = State.get(ent)
    //     let attributes = Attributes.get(ent)
    //     let handler = InputHandler.get(ent)

    //     queue.forEach(ev => {
    //         let mousePos = {
    //             x: Math.floor(ev.localX),
    //             y: Math.floor(ev.localY)
    //         }
    //         switch (ev.type) {
    //             case 'click':
    //                 if (mousePos.x >= position.x && mousePos.x < position.x + 32 && mousePos.y >= position.y && mousePos.y < position.y + 32) {
    //                     if (scene.menuState === 'default') {
    //                         state.clicked = !state.clicked
    //                         if (state.clicked) {
    //                             scene.selectedAlots[0] = ent
    //                             scene.world.forEach(otherEnt => {
    //                                 if (otherEnt === ent) return
    //                                 let state = State.get(otherEnt)
    //                                 if (state) state.clicked = false
    //                             });
    //                         } else {
    //                             scene.selectedAlots[0] = undefined
    //                         }

    //                     } else if (scene.menuState === 'mate') {
    //                         if (state.clicked) {
    //                             if (scene.selectedAlots[0] === ent) {
    //                                 scene.selectedAlots[0] = scene.selectedAlots[1]
    //                                 scene.selectedAlots[1] = undefined
    //                                 state.clicked = false
    //                             } else if (scene.selectedAlots[1] === ent) {
    //                                 scene.selectedAlots[1] = undefined
    //                                 state.clicked = false
    //                             }
    //                         } else if (!state.clicked) {
    //                             if (scene.selectedAlots[0] === undefined) {
    //                                 scene.selectedAlots[0] = ent
    //                             } else if (scene.selectedAlots[1] === undefined) {
    //                                 scene.selectedAlots[1] = ent
    //                             } else {
    //                                 break
    //                             }
    //                             state.clicked = true
    //                         }
    //                     }
    //                 }
    //                 break
    //             case 'mousemove':
    //                 handler.mousePos = mousePos
    //                 if (mousePos.x >= position.x && mousePos.x < position.x + 32 && mousePos.y >= position.y && mousePos.y < position.y + 32) {
    //                     state.hovered = true
    //                     scene.currentAlot = attributes
    //                 } else {
    //                     state.hovered = false
    //                 }
    //                 break

    //         }
    //     });
    // }

    if (!x || !y) {
        position(ent, ...randomXY(scene), 1)
    } else {
        position(ent, x, y, 1)
    }
    if (!attr) {
        attributes(ent, ...randomAtr())
    } else {
        attributes(ent, attr.name, attr.speed.natural, attr.endurance.natural, attr.focus.natural, attr.spunk.natural, attr.sex)
    }
    status(ent)
    image(ent, color + 'Alot')
    animation(ent, 'idle', 500)
    state(ent, {})
    entityType(ent, 'Alot')
    timer(ent, 1000 * Math.floor(Math.random() * 5 + 1))
    genetics(ent, geneticsProfile)
    scene.world.push(ent)

    return ent
}

let babyAlotFactory = (scene, x, y, geneticsProfile) => {
    let ent = Entity()
    if (!geneticsProfile) {
        geneticsProfile = {
            brown: 30,
            red: 70 / 6,
            blue: 70 / 6,
            green: 70 / 6,
            yellow: 70 / 6,
            purple: 70 / 6,
            pink: 70 / 6,
        }
    }
    let color = 'brown'
    let topColorValue = 0
    for (const colorKey in geneticsProfile) {
        if (geneticsProfile.hasOwnProperty(colorKey)) {
            const colorValue = geneticsProfile[colorKey];
            if (colorValue > topColorValue) {
                color = colorKey
                topColorValue = colorValue
            }
        }
    }

    let randomXY = () => [Math.floor(Math.random() * (scene.w - 96)), Math.floor(Math.random() * (scene.h - 32))]
    let randomAtr = () => [
        NAMES[Math.floor(Math.random() * NAMES.length)],
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
    ]

    let babyAI = () => {
        let timer = Timer.get(ent)
        let position = Position.get(ent)
        let attributes = Attributes.get(ent)
        let velocity = (attributes.speed.natural + attributes.speed.bonus) * 0.1
        let genes = Genetics.get(ent)

        timer.timer -= 1000 / 60
        if (timer.timer < 0) {
            alotFactory(scene, attributes, position.x, position.y, genes)
            removeEntity(ent)
            return
        }

        let decision = Math.floor(Math.random() * 20)
        if (decision < 19) return
        let dir = Math.floor(Math.random() * 4)
        switch (dir) {
            case 0:
                position.x -= velocity
                break
            case 1:
                position.x += velocity
                break
            case 2:
                position.y -= velocity
                break
            case 3:
                position.y += velocity
                break
        }
        if (position.x < 0) position.x = 0
        if (position.x > WIDTH - 64 - 32) position.x = WIDTH - 64 - 32
        if (position.y < 0) position.y = 0
        if (position.y > HEIGHT - 32) position.y = HEIGHT - 32

    }

    ai(ent, babyAI)
    if (!x || !y) {
        position(ent, ...randomXY())
    } else {
        position(ent, x, y)
    }
    image(ent, color + 'BabyAlot')
    attributes(ent, ...randomAtr())
    animation(ent, 'idle', 500)
    genetics(ent, geneticsProfile)
    timer(ent, 60000)
    scene.world.push(ent)

    return ent
}

let playableAlotFactory = (scene, x, y) => {
    let ent = alotFactory(scene)

    let position = Position.get(ent)
    AI.delete(ent)
    position.x = x
    position.y = y

    let handler = (queue) => {
        let position = Position.get(ent)
        let inputHandler = InputHandler.get(ent)
        let attributes = Attributes.get(ent)
        let entAnimation = Animation.get(ent)
        queue.forEach(ev => {
            if (ev.type === 'keydown') {
                inputHandler.keydown[ev.key] = true
            }
            if (ev.type === 'keyup') {
                inputHandler.keydown[ev.key] = false
            }
        });

        let velocity = (attributes.speed.natural + attributes.speed.bonus) * 0.1
        if (inputHandler.keydown['ArrowUp']) position.y -= velocity
        if (inputHandler.keydown['ArrowDown']) position.y += velocity
        if (inputHandler.keydown['ArrowLeft']) position.x -= velocity
        if (inputHandler.keydown['ArrowRight']) position.x += velocity

        if (!inputHandler.keydown['ArrowUp'] && !inputHandler.keydown['ArrowDown'] && !inputHandler.keydown['ArrowLeft'] && !inputHandler.keydown['ArrowRight']) {
            if (entAnimation.animation !== 'idle') {
                animation(ent, 'idle', 500)
            }
        } else {
            if (entAnimation.animation !== 'walk') {
                animation(ent, 'walk', 500 - 50 * (attributes.speed.natural + attributes.speed.bonus))
            }
        }

        if (position.x < 0) position.x = 0
        if (position.x >= scene.w - 32) position.x = scene.w - 32
        if (position.y < 0) position.y = 0
        if (position.y >= scene.h - 32) position.y = scene.h - 32

        scene.x = position.x - scene.canvas.width / 2 - 16
        scene.y = position.y - scene.canvas.height / 2 - 16
    }

    inputHandler(ent, handler)

    return ent
}

let itemFactory = (scene, graphic, x, y, bonuses) => {
    let ent = Entity()

    let handler = (queue) => {
        let position = Position.get(ent)
        let anchor = Anchor.get(ent)
        let handler = InputHandler.get(ent)
        let state = State.get(ent)
        let bonus = Bonus.get(ent)

        if (state.hidden) return

        queue.forEach(ev => {
            let mousePos = {
                x: Math.floor(ev.localX),
                y: Math.floor(ev.localY)
            }

            switch (ev.type) {
                case 'mousedown':
                    if (mousePos.x >= position.x && mousePos.x < position.x + 8 && mousePos.y >= position.y && mousePos.y < position.y + 8) {
                        state.clicked = true
                        handler.mousePos = mousePos
                    }
                    break
                case 'mouseup':
                    if (state.clicked) {
                        targetToBonus = undefined
                        targetY = -1
                        scene.world.forEach(targetEnt => {
                            let entPosition = Position.get(targetEnt)
                            let entAttributes = Attributes.get(targetEnt)
                            let entStatus = Status.get(targetEnt)
                            if (!entPosition || !entAttributes || !entStatus) return
                            if (mousePos.x >= entPosition.x && mousePos.x < entPosition.x + 32 && mousePos.y >= entPosition.y && mousePos.y < entPosition.y + 32) {
                                if (entPosition.y > targetY) {
                                    targetY = entPosition.y
                                    targetToBonus = { attributes: entAttributes, status: entStatus, ent: targetEnt }
                                }
                            }
                        });
                        if (targetToBonus) {
                            if (bonus.attributes) {
                                for (const key in bonus.attributes) {
                                    if (bonus.attributes.hasOwnProperty(key)) {
                                        const bonusAttribute = bonus.attributes[key];
                                        targetToBonus.attributes[key].bonus += bonusAttribute
                                    }
                                }
                            }
                            if (bonus.status) {
                                let targetStatus = Status.get(targetToBonus.ent)
                                targetToBonus.status.status = bonus.status
                                statusHornyFactory(scene, targetToBonus.ent)
                            }
                            removeEntity(ent)
                            return
                        }
                    }
                    state.clicked = false
                    for (let i = 0; i < ITEM_BOXES.length; ++i) {
                        let box = ITEM_BOXES[i]
                        if (position.x >= box.x && position.x < box.x + 16 && position.y >= box.y && position.y < box.y + 16) {
                            anchor = box
                        }
                    }
                    position.x = anchor.x + 4
                    position.y = anchor.y + 4
                    break
                case 'mousemove':
                    if (!state.clicked) break
                    position.x += Math.floor(mousePos.x - handler.mousePos.x)
                    position.y += Math.floor(mousePos.y - handler.mousePos.y)
                    handler.mousePos = mousePos
                    break
            }
        });
    }

    position(ent, x + 4, y + 4)
    inputHandler(ent, handler)
    state(ent)
    image(ent, graphic)
    anchor(ent, x, y)
    bonus(ent, bonuses.status, bonuses.attributes)
    scene.world.push(ent)

    return ent
}

let pineappleFactory = (scene, x, y) => {
    const bonus = {
        attributes: {
            spunk: 2
        }
    }

    return itemFactory(scene, 'foodPineapple', x, y, bonus)
}

// let eggplantFactory = (scene, x, y) => {
//     const bonus = {
//         status: ['horny']
//     }

//     return itemFactory(scene, 'foodEggplant', x, y, bonus)
// }

let playerFactory = (scene) => {
    let ent = Entity()

    let handler = (queue) => {
        let handler = InputHandler.get(ent)

        queue.forEach(ev => {
            let mousePos = {
                x: Math.floor(ev.localX),
                y: Math.floor(ev.localY)
            }
            switch (ev.type) {
                case 'click':
                    if (scene.menuState === 'title') {
                        scene.menuState = 'default'
                        ranchMusic.play()
                        return
                    }
                    for (const key in scene.buttons) {
                        if (scene.buttons.hasOwnProperty(key)) {
                            const button = scene.buttons[key];
                            if (mousePos.x >= button.x && mousePos.x < button.x + button.w && mousePos.y >= button.y && mousePos.y < button.y + button.h) {
                                scene.menuState = button.state
                                scene.world.forEach(ent => {
                                    let entPos = Position.get(ent)
                                    let state = State.get(ent)
                                    let bonus = Bonus.get(ent)
                                    if (state && bonus && entPos && entPos.x > scene.w - 64) {
                                        state.hidden = !button.showItems
                                    }
                                });
                                if (key === 'x') {
                                    scene.selectedAlots = [undefined, undefined]
                                    scene.world.forEach(ent => {
                                        let entState = State.get(ent)
                                        let entAttr = Attributes.get(ent)
                                        if (entState && entAttr) entState.clicked = false
                                    });
                                } else if (key === 'heart' && scene.selectedAlots[0] && scene.selectedAlots[1]) {
                                    let state1 = State.get(scene.selectedAlots[0])
                                    let pos1 = Position.get(scene.selectedAlots[0])
                                    let state2 = State.get(scene.selectedAlots[1])
                                    let pos2 = Position.get(scene.selectedAlots[1])

                                    state1.mating = true
                                    state1.clicked = false
                                    state2.mating = true
                                    state2.clicked = false
                                    target(scene.selectedAlots[0], pos2.x, pos2.y, scene.selectedAlots[1])
                                    target(scene.selectedAlots[1], pos1.x, pos1.y, scene.selectedAlots[0])

                                    scene.menuState = 'default'
                                    scene.selectedAlots = [undefined, undefined]
                                }
                            }

                        }
                    }
                    break
                case 'mousedown':
                    handler.keydown.mouse1 = true
                    break
                case 'mouseup':
                    handler.keydown.mouse1 = false
                    break
                case 'mousemove':
                    let clearAlot = true
                    scene.world.forEach(ent => {
                        let entPos = Position.get(ent)
                        let entAttr = Attributes.get(ent)
                        if (!entPos || !entAttr) return
                        if (mousePos.x >= entPos.x && mousePos.x < entPos.x + 32 && mousePos.y >= entPos.y && mousePos.y < entPos.y + 32) {
                            clearAlot = false
                        }
                    });
                    if (clearAlot) scene.currentAlot = undefined
            }
        });
    }

    parentScene(ent, scene)
    inputHandler(ent, handler)
    scene.world.push(ent)

    return ent
}

// Systems
let AISystem = (scene) => {
    scene.world.forEach(entity => {
        let ai = AI.get(entity)
        let state = State.get(entity)
        if (!ai || (state && state.hidden)) return
        ai.ai()
    });
}

let InputHandlerSystem = (scene) => {
    scene.world.forEach(entity => {
        let inputHandler = InputHandler.get(entity)
        if (!inputHandler) return
        inputHandler.handler(scene.eventQueue)
    });
    scene.eventQueue = []
}


// Scenes
class RanchScene {
    constructor() {
        this.world = new Registry();
        this.x = 0
        this.y = 0
        this.w = WIDTH
        this.h = HEIGHT

        this.canvas = document.createElement('canvas', { alpha: false })
        this.canvas.id = 'main-viewport'
        this.canvas.height = HEIGHT
        this.canvas.width = WIDTH

        let currentCanvas = document.getElementById('main-viewport')
        if (currentCanvas) {
            document.body.removeChild(currentCanvas)
        }
        document.body.appendChild(this.canvas)
        document.body.appendChild(ranchMusic)

        this.context = this.canvas.getContext('2d')
        this.context.imageSmoothingEnabled = 'false'

        this.initializeEnts()
        this.setupControls()
    }

    runSystems() {
        TimerSystem(this)
        AnchorSystem(this)
        CursorInputSystem(this)
        AlotInputSystem(this)
        ItemInputSystem(this)
        AlotAISystem(this)
        ItemSpawnerAISystem(this)
        MenuAlotSelectionSystem(this)
        MenuMateModeSystem(this)
        AlotItemFeedingSyste(this)
        EntitySortingSystem(this)
        ComposeMenuSystem(this)
        RenderSystem(this)
        AnimationSystem(this)
        EVENT_QUEUE = []
    }

    initializeEnts() {
        itemSpawnerFactory(this)
        bgRanchFactory(this)
        sideMenuFactory(this)
        cursorFactory(this)
        alotFactory(this)
        alotFactory(this)
        alotFactory(this)
    }

    setupControls() {
        document.getElementById('main-viewport').addEventListener('mousedown',
            (ev) => {
                if (ev.which !== 1) return
                ev.localX = ev.offsetX / (this.canvas.offsetWidth / WIDTH)
                ev.localY = ev.offsetY / (this.canvas.offsetHeight / HEIGHT)
                EVENT_QUEUE.push(ev)
            })

        document.getElementById('main-viewport').addEventListener('click',
            (ev) => {
                if (ev.which !== 1) return
                ev.localX = ev.offsetX / (this.canvas.offsetWidth / WIDTH)
                ev.localY = ev.offsetY / (this.canvas.offsetHeight / HEIGHT)
                EVENT_QUEUE.push(ev)
            })

        document.addEventListener('mouseup', (ev) => {
            if (ev.which !== 1) return
            ev.localX = ev.offsetX / (this.canvas.offsetWidth / WIDTH)
            ev.localY = ev.offsetY / (this.canvas.offsetHeight / HEIGHT)
            EVENT_QUEUE.push(ev)
        })

        document.getElementById('main-viewport').addEventListener('mousemove',
            (ev) => {
                ev.localX = ev.offsetX / (this.canvas.offsetWidth / WIDTH)
                ev.localY = ev.offsetY / (this.canvas.offsetHeight / HEIGHT)
                EVENT_QUEUE.push(ev)
            })
    }
}

class DigScene {
    constructor() {
        this.world = new Registry();
        this.x = 0
        this.y = 0
        this.canvas = document.createElement('canvas', { alpha: false })
        this.eventQueue = []
        this.canvas.id = 'main-viewport'
        this.canvas.height = HEIGHT
        this.canvas.width = WIDTH
        this.w = WIDTH * 2
        this.h = HEIGHT * 2
        this.context = this.canvas.getContext('2d')
        this.context.imageSmoothingEnabled = 'false'

        try {
            let canvas = document.getElementById('main-viewport')
            document.body.removeChild(canvas)
        } catch {}
        document.body.appendChild(this.canvas)

        bgDigFactory(this)
        playableAlotFactory(this, 0, this.h / 4)
        this.setupControls()
    }

    runSystems() {
        InputHandlerSystem(this)
        RenderSystem(this)
        AnimationSystem(this)
    }

    setupControls() {
        document.addEventListener('keydown', (ev) => {
            this.eventQueue.push(ev)
        })

        document.addEventListener('keyup', (ev) => {
            this.eventQueue.push(ev)
        })
    }
}

let activeScene = []
activeScene.push(new RanchScene())
    // activeScene.unshift(new DigScene())
window.onload = () => {
    initializeFonts()
    loadAnimations()
    main(0)
}