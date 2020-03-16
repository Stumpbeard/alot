// Constants
const HEIGHT = 240
const WIDTH = 256
const SCALE = 4

const ITEM_BOXES = []

let itemBoxX = 208
let itemBoxY = 144
for (let i = 0; i < 10; ++i) {
    ITEM_BOXES[i] = {
        x: itemBoxX,
        y: itemBoxY
    }
    itemBoxX += 16
    if (itemBoxX >= 240) {
        itemBoxX = 208
        itemBoxY += 16
    }
}

// Main function
let main = (timestamp) => {
    window.requestAnimationFrame(main)

    activeScene[0].runSystems()
}

// Debug stuff
let rectangles = []

// ECS stuff
let uid = 0;

let Entity = () => uid++;
let Component = Map;
let Registry = Set;

// Asset loading
let images = {}
let sheets = {}

let alotImage = new Image()
alotImage.src = 'images/alot.png'
images['alot'] = alotImage

let alotSheet = new Image()
alotSheet.src = 'images/alot-sheet.png'
images['alotSheet'] = alotSheet

let foodEggplantImage = new Image()
foodEggplantImage.src = 'images/food-eggplant.png'
images['foodEggplant'] = foodEggplantImage

let foodPineappleImage = new Image()
foodPineappleImage.src = 'images/food-pineapple.png'
images['foodPineapple'] = foodPineappleImage

let bgRanchImage = new Image()
bgRanchImage.src = 'images/ranch-bg-cropped.png'
images['bgRanch'] = bgRanchImage

let bgDigImage = new Image()
bgDigImage.src = 'images/dig-bg.png'
images['bgDig'] = bgDigImage

let buttonGoImage = new Image()
buttonGoImage.src = 'images/button-go.png'
images['buttonGo'] = buttonGoImage

let buttonXImage = new Image()
buttonXImage.src = 'images/button-x.png'
images['buttonX'] = buttonXImage

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
    for (let i = 0; i < alotSheet.naturalWidth; i += 32) {
        let canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        let ctx = canvas.getContext('2d')

        ctx.clearRect(0, 0, 32, 32)
        ctx.drawImage(alotSheet, i, 0, 32, 32, 0, 0, 32, 32)
        brownAlotFrames.push(canvas)
    }
    sheets['alot'] = {
        animations: brownAlotAnimations,
        frames: brownAlotFrames
    }
}


// Components
let Position = new Component()
let Sprite = new Component()
let Animation = new Component()
let AI = new Component()
let Attributes = new Component()
let Status = new Component()
let ParentScene = new Component()
let InputHandler = new Component()
let State = new Component()
let Anchor = new Component()
let Bonus = new Component()

let components = [Position, Sprite, AI, Attributes, Status, ParentScene, InputHandler, State, Anchor, Bonus]
let removeEntity = (ent) => {
    components.forEach(component => {
        component.delete(ent)
    });
}

let position = (entity, x, y) => {
    Position.set(entity, { x: x, y: y })
}

let image = (entity, image) => {
    Sprite.set(entity, { image: image })
}

let animation = (entity, animation, rate) => {
    Animation.set(entity, { animation: animation, rate: rate, timer: 0, currentFrame: 0 })
}

let ai = (entity, ai) => {
    AI.set(entity, { ai: ai })
}

let attributes = (entity, name, spd, end, fcs, spk) => {
    Attributes.set(entity, {
        name: name,
        speed: { natural: spd, bonus: 0 },
        endurance: { natural: end, bonus: 0 },
        focus: { natural: fcs, bonus: 0 },
        spunk: { natural: spk, bonus: 0 }
    })
}

let status = (entity) => {
    Status.set(entity, { status: [] })
}

let parentScene = (entity, scene) => {
    ParentScene.set(entity, { scene: scene })
}

let inputHandler = (entity, handler) => {
    InputHandler.set(entity, { handler: handler, keydown: { mouse1: false }, clickPos: { x: 0, y: 0 }, mousePos: { x: 0, y: 0 } })
}

let state = (entity) => {
    State.set(entity, { hovered: false, clicked: false, hidden: false })
}

let anchor = (entity, x, y) => {
    Anchor.set(entity, { x: x, y: y })
}

let bonus = (entity, status, attributes) => {
    Bonus.set(entity, { status: status, attributes: attributes })
}

// Entity factories
let bgRanchFacotry = (scene) => {
    let ent = Entity()

    position(ent, 0, 0)
    image(ent, 'bgRanch')
    scene.world.add(ent)

    return ent
}

let bgDigFactory = (scene) => {
    let ent = Entity()

    position(ent, 0, 0)
    image(ent, 'bgDig')
    scene.world.add(ent)

    return ent
}


let alotFactory = (scene) => {
    let ent = Entity()

    let randomXY = () => [Math.floor(Math.random() * (scene.w - 96)), Math.floor(Math.random() * (scene.h - 32))]
    let randomAtr = () => [
        NAMES[Math.floor(Math.random() * NAMES.length)],
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
    ]

    let alotAI = (ent) => {
        let position = Position.get(ent)
        let attributes = Attributes.get(ent)
        let state = State.get(ent)
        let entAnimation = Animation.get(ent)

        if (state.clicked) {
            animation(ent, 'selected', 500)
        } else {
            if (entAnimation.animation !== 'idle') animation(ent, 'idle', 500)
        }

        if (state.hovered || state.clicked) return
        let decision = Math.floor(Math.random() * 20)
        if (decision < 19) return
        let velocity = (attributes.speed.natural + attributes.speed.bonus) * 0.1
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

    let handler = (queue) => {
        let position = Position.get(ent)
        let state = State.get(ent)
        let attributes = Attributes.get(ent)
        let handler = InputHandler.get(ent)

        queue.forEach(ev => {
            let mousePos = {
                x: Math.floor(ev.localX),
                y: Math.floor(ev.localY)
            }
            switch (ev.type) {
                case 'click':
                    if (mousePos.x >= position.x && mousePos.x < position.x + 32 && mousePos.y >= position.y && mousePos.y < position.y + 32) {
                        if (scene.menuState === 'default') {
                            state.clicked = !state.clicked
                            if (state.clicked) {
                                scene.selectedAlots[0] = ent
                                scene.world.forEach(otherEnt => {
                                    if (otherEnt === ent) return
                                    let state = State.get(otherEnt)
                                    if (state) state.clicked = false
                                });
                            } else {
                                scene.selectedAlots[0] = undefined
                            }

                        } else if (scene.menuState === 'mate') {
                            if (state.clicked) {
                                if (scene.selectedAlots[0] === ent) {
                                    scene.selectedAlots[0] = scene.selectedAlots[1]
                                    scene.selectedAlots[1] = undefined
                                    state.clicked = false
                                } else if (scene.selectedAlots[1] === ent) {
                                    scene.selectedAlots[1] = undefined
                                    state.clicked = false
                                }
                            } else if (!state.clicked) {
                                if (scene.selectedAlots[0] === undefined) {
                                    scene.selectedAlots[0] = ent
                                } else if (scene.selectedAlots[1] === undefined) {
                                    scene.selectedAlots[1] = ent
                                } else {
                                    break
                                }
                                state.clicked = true
                            }
                        }
                    }
                    break
                case 'mousemove':
                    handler.mousePos = mousePos
                    if (mousePos.x >= position.x && mousePos.x < position.x + 32 && mousePos.y >= position.y && mousePos.y < position.y + 32) {
                        state.hovered = true
                        scene.currentAlot = attributes
                    } else {
                        state.hovered = false
                    }
                    break

            }
        });
    }
    position(ent, ...randomXY())
    ai(ent, alotAI)
    inputHandler(ent, handler)
    attributes(ent, ...randomAtr())
    status(ent)
    image(ent, 'alot')
    animation(ent, 'idle', 500)
    parentScene(ent, scene)
    state(ent)
    scene.world.add(ent)

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
                        scene.world.forEach(ent => {
                            let entPosition = Position.get(ent)
                            let entAttributes = Attributes.get(ent)
                            let entStatus = Status.get(ent)
                            if (!entPosition || !entAttributes || !entStatus) return
                            if (mousePos.x >= entPosition.x && mousePos.x < entPosition.x + 32 && mousePos.y >= entPosition.y && mousePos.y < entPosition.y + 32) {
                                if (entPosition.y > targetY) {
                                    targetY = entPosition.y
                                    targetToBonus = { attributes: entAttributes, status: entStatus }
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
                                targetToBonus.status.status.concat(bonus.status)
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
    scene.world.add(ent)

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

let eggplantFactory = (scene, x, y) => {
    const bonus = {
        status: ['horny']
    }

    return itemFactory(scene, 'foodEggplant', x, y, bonus)
}

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
                    for (const key in scene.buttons) {
                        if (scene.buttons.hasOwnProperty(key)) {
                            const button = scene.buttons[key];
                            if (mousePos.x >= button.x && mousePos.x < button.x + button.w && mousePos.y >= button.y && mousePos.y < button.y + button.h) {
                                scene.menuState = button.state
                                scene.world.forEach(ent => {
                                    let state = State.get(ent)
                                    let bonus = Bonus.get(ent)
                                    if (state && bonus) {
                                        state.hidden = !button.showItems
                                    }
                                });
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
    scene.world.add(ent)

    return ent
}

// Systems
let RenderSystem = (scene) => {
    if (document.body.clientHeight >= document.body.clientWidth) {
        scene.canvas.style = `width: ${WIDTH * SCALE}px; max-width: 100%;`
    } else {
        scene.canvas.style = `height: ${HEIGHT * SCALE}px; max-height: 100%;`
    }

    let drawQueue = []
    scene.world.forEach(entity => {
        let position = Position.get(entity)
        let animation = Animation.get(entity)
        let sprite = Sprite.get(entity)
        if (!position || !sprite) return
        let state = State.get(entity)
        if (state && state.hidden) return
        let drawable = { sprite: sprite, position: position }
        if (animation) drawable.animation = animation
        drawQueue.push(drawable)
    });
    drawQueue.sort((a, b) => a.position.y - b.position.y)
    let offsetX = scene.x
    let offsetY = scene.y
    if (offsetX < 0) offsetX = 0
    if (offsetX >= scene.w - scene.canvas.width) offsetX = scene.w - scene.canvas.width
    if (offsetY < 0) offsetY = 0
    if (offsetY >= scene.h - scene.canvas.height) offsetY = scene.h - scene.canvas.height
    drawQueue.forEach(entity => {
        let imageToDraw = images[entity.sprite.image]
        if (entity.animation) {
            imageToDraw = sheets[entity.sprite.image].frames[sheets[entity.sprite.image].animations[entity.animation.animation][entity.animation.currentFrame]]
        }
        scene.context.drawImage(imageToDraw, Math.floor(entity.position.x - offsetX), Math.floor(entity.position.y - offsetY))
    });
    rectangles.forEach(rectangle => {
        scene.context.strokeStyle = 'red'
        scene.context.strokeRect(Math.floor(rectangle.x), Math.floor(rectangle.y), 32, 32)
    });
    rectangles = []
}

let AnimationSystem = (scene) => {
    scene.world.forEach(ent => {
        let sprite = Sprite.get(ent)
        let animation = Animation.get(ent)
        if (!sprite || !animation) return

        animation.timer += 1000 / 60
        if (animation.timer >= animation.rate) {
            animation.currentFrame += 1
            animation.timer = 0
        }

        if (animation.currentFrame >= sheets[sprite.image].animations[animation.animation].length) {
            animation.currentFrame = 0
        }
    });
}

let AISystem = (scene) => {
    scene.world.forEach(entity => {
        let ai = AI.get(entity)
        let state = State.get(entity)
        if (!ai || (state && state.hidden)) return
        ai.ai(entity)
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
        this.currentAlot = undefined
        this.selectedAlots = [undefined, undefined]
        this.menuState = 'default'
        this.canvas = document.createElement('canvas', { alpha: false })
        this.eventQueue = []
        this.canvas.id = 'main-viewport'
        this.canvas.height = HEIGHT
        this.canvas.width = WIDTH
        this.w = WIDTH
        this.h = HEIGHT
        document.body.appendChild(this.canvas)
        this.context = this.canvas.getContext('2d')
        this.context.imageSmoothingEnabled = 'false'
        this.buttons = {
            mate: {
                x: 196,
                y: 120,
                w: 56,
                h: 8,
                state: 'mate',
                showItems: false
            },
            rest: {
                x: 196,
                y: 130,
                w: 56,
                h: 8,
                state: 'rest',
                showItems: false
            },
            x: {
                x: 215,
                y: 182,
                w: 8,
                h: 8,
                state: 'default',
                showItems: true
            },
            go: {
                x: 225,
                y: 182,
                w: 8,
                h: 8,
                state: 'default',
                showItems: true
            },
        }

        bgRanchFacotry(this)
        for (let i = 0; i < 3; ++i) {
            alotFactory(this)
        }
        eggplantFactory(this, ITEM_BOXES[0].x, ITEM_BOXES[0].y)
        eggplantFactory(this, ITEM_BOXES[2].x, ITEM_BOXES[2].y)
        pineappleFactory(this, ITEM_BOXES[1].x, ITEM_BOXES[1].y)
        pineappleFactory(this, ITEM_BOXES[3].x, ITEM_BOXES[3].y)
        pineappleFactory(this, ITEM_BOXES[4].x, ITEM_BOXES[4].y)
        playerFactory(this)
        this.setupControls()
    }

    runSystems() {
        InputHandlerSystem(this)
        AISystem(this)

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fillStyle = 'black'
        this.context.fillRect(WIDTH - 64, 0, 64, HEIGHT)

        if (this.selectedAlots[0]) {
            this.currentAlot = Attributes.get(this.selectedAlots[0])
        }
        if (this.currentAlot) {
            drawWhiteText(this.context, this.currentAlot.name, WIDTH - 56, 4)
            this.context.fillStyle = 'green'
            this.context.fillRect(WIDTH - 60, 16, 4 * this.currentAlot.speed.natural, 4)
            this.context.fillStyle = 'red'
            this.context.fillRect(WIDTH - 60, 24, 4 * this.currentAlot.endurance.natural, 4)
            this.context.fillStyle = 'blue'
            this.context.fillRect(WIDTH - 60, 32, 4 * this.currentAlot.focus.natural, 4)
            this.context.fillStyle = 'pink'
            this.context.fillRect(WIDTH - 60, 40, 4 * this.currentAlot.spunk.natural + this.currentAlot.spunk.bonus, 4)
            this.context.fillStyle = 'purple'
            this.context.fillRect(WIDTH - 60, 40, 4 * this.currentAlot.spunk.natural, 4)
        }

        this.context.fillStyle = 'white'
        this.context.fillRect(196, 112, 56, 2)

        this.context.fillRect(196, 120, 2, 8)
        this.context.fillRect(250, 120, 2, 8)
        this.context.fillRect(196, 130, 2, 8)
        this.context.fillRect(250, 130, 2, 8)
        if (this.menuState === 'default') {
            this.context.fillStyle = 'black'
            this.context.fillRect(197, 121, 54, 6)
            this.context.fillRect(197, 131, 54, 6)
        } else if (this.menuState === 'mate') {
            this.context.fillStyle = 'white'
            this.context.fillRect(196, 120, 12, 8)
            this.context.fillRect(240, 120, 12, 8)
            this.context.fillStyle = 'black'
            this.context.fillRect(197, 131, 54, 6)
            this.context.drawImage(images['buttonX'], this.buttons.x.x, this.buttons.x.y)
            this.context.drawImage(images['buttonGo'], this.buttons.go.x, this.buttons.go.y)
        } else if (this.menuState === 'mate') {
            this.context.fillStyle = 'white'
            this.context.fillRect(196, 120, 12, 8)
            this.context.fillRect(240, 120, 12, 8)
            this.context.fillStyle = 'black'
            this.context.fillRect(197, 131, 54, 6)
            this.context.drawImage(images['buttonX'], this.buttons.x.x, this.buttons.x.y)
            this.context.drawImage(images['buttonGo'], this.buttons.go.x, this.buttons.go.y)
        }
        drawWhiteText(this.context, 'MATE', 208, 120)
        drawWhiteText(this.context, 'REST', 208, 130)


        let x = 208
        let y = 144
        let numBoxes = 10
        if (this.menuState === 'mate') numBoxes = 2
        for (let i = 0; i < numBoxes; ++i) {
            this.context.fillStyle = 'white'
            this.context.fillRect(x, y, 16, 16)
            this.context.fillStyle = 'black'
            this.context.fillRect(x + 1, y + 1, 14, 14)
            x += 16
            if (x >= 240) {
                x = 208
                y += 16
            }
        }
        RenderSystem(this)
        AnimationSystem(this)
            // drawWhiteText(this.context, 'STATUS', 200, 49)
    }

    setupControls() {
        let viewport = document.getElementById('main-viewport')

        document.getElementById('main-viewport').addEventListener('mousedown', (ev) => {
            if (ev.which !== 1) return
            ev.localX = ev.offsetX / (viewport.offsetWidth / WIDTH)
            ev.localY = ev.offsetY / (viewport.offsetHeight / HEIGHT)
            this.eventQueue.push(ev)
        })

        document.getElementById('main-viewport').addEventListener('click', (ev) => {
            if (ev.which !== 1) return
            ev.localX = ev.offsetX / (viewport.offsetWidth / WIDTH)
            ev.localY = ev.offsetY / (viewport.offsetHeight / HEIGHT)
            this.eventQueue.push(ev)
        })

        document.addEventListener('mouseup', (ev) => {
            if (ev.which !== 1) return
            ev.localX = ev.offsetX / (viewport.offsetWidth / WIDTH)
            ev.localY = ev.offsetY / (viewport.offsetHeight / HEIGHT)
            this.eventQueue.push(ev)
        })

        document.getElementById('main-viewport').addEventListener('mousemove', (ev) => {
            ev.localX = ev.offsetX / (viewport.offsetWidth / WIDTH)
            ev.localY = ev.offsetY / (viewport.offsetHeight / HEIGHT)
            this.eventQueue.push(ev)
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