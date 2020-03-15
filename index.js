// Constants
const HEIGHT = 240
const WIDTH = 256
const SCALE = 4

// Main function
let main = (timestamp) => {
    window.requestAnimationFrame(main)

    activeScene.runSystems()
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

let alotImage = new Image()
alotImage.src = 'images/alot.png'
images['alot'] = alotImage

let bgRanchImage = new Image()
bgRanchImage.src = 'images/ranch-bg-cropped.png'
images['bgRanch'] = bgRanchImage


// Components
let Position = new Component()
let Sprite = new Component()
let AI = new Component()
let Attributes = new Component()
let Status = new Component()
let ParentScene = new Component()
let InputHandler = new Component()
let State = new Component()

let position = (entity, x, y) => {
    Position.set(entity, { x: x, y: y })
}

let image = (entity, image) => {
    Sprite.set(entity, { image: images[image] })
}

let ai = (entity, ai) => {
    AI.set(entity, { ai: ai })
}

let attributes = (entity, name, spd, end, fcs, spk) => {
    Attributes.set(entity, { name: name, speed: spd, endurance: end, focus: fcs, spunk: spk })
}

let status = (entity) => {
    Status.set(entity, { status: [] })
}

let parentScene = (entity, scene) => {
    ParentScene.set(entity, { scene: scene })
}

let inputHandler = (entity, handler) => {
    InputHandler.set(entity, { handler: handler })
}

let state = (entity, hovered) => {
    State.set(entity, { hovered: hovered })
}

// Entity factories
let bgRanchFacotry = (scene) => {
    let ent = Entity()

    position(ent, 0, 0)
    image(ent, 'bgRanch')
    scene.world.add(ent)
}
let alotFactory = (scene) => {
    let ent = Entity()

    let randomXY = () => [Math.floor(Math.random() * (scene.w)), Math.floor(Math.random() * (scene.h))]
    let randomAtr = () => [
        NAMES[Math.floor(Math.random() * NAMES.length)],
        Math.floor(Math.random() * 10) + 1,
        Math.floor(Math.random() * 10) + 1,
        Math.floor(Math.random() * 10) + 1,
        Math.floor(Math.random() * 10) + 1
    ]

    let alotAI = (entity) => {
        let position = Position.get(entity)
        let attributes = Attributes.get(entity)
        let state = State.get(entity)

        if (state.hovered) return
        let decision = Math.floor(Math.random() * 20)
        if (decision < 19) return
        let velocity = attributes.speed * 0.1
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
    position(ent, ...randomXY())
    ai(ent, alotAI)
    attributes(ent, ...randomAtr())
    status(ent)
    image(ent, 'alot')
    parentScene(ent, scene)
    state(ent, false)
    scene.world.add(ent)
}

let playerFactory = (scene) => {
    let ent = Entity()

    let handler = (queue) => {
        queue.forEach(ev => {
            switch (ev.type) {
                case 'mousedown':
                    scene.mousedown = true
                    scene.clicked = {
                        x: ev.x,
                        y: ev.y
                    }
                    break
                case 'mousemove':
                    let mousePos = {
                        x: Math.floor(ev.localX / SCALE),
                        y: Math.floor(ev.localY / SCALE)
                    }
                    scene.mousePos = mousePos
                    scene.currentAlot = {
                        name: ''
                    }
                    let topY = -1
                    scene.world.forEach(ent => {
                        let position = Position.get(ent)
                        let attributes = Attributes.get(ent)
                        let state = State.get(ent)
                        if (!position || !attributes || !state) return
                        state.hovered = false
                        if (mousePos.x >= position.x && mousePos.x < position.x + 32 && mousePos.y >= position.y && mousePos.y < position.y + 32) {
                            if (position.y > topY) {
                                state.hovered = true
                                scene.currentAlot = attributes
                                topY = position.y
                            }
                        }
                    });
                    break
            }
        });
    }

    parentScene(ent, scene)
    inputHandler(ent, handler)
    scene.world.add(ent)
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
        let sprite = Sprite.get(entity)
        if (!position || !sprite) return
        drawQueue.push({ sprite: sprite, position: position })
    });
    drawQueue.sort((a, b) => a.position.y - b.position.y)
    drawQueue.forEach(entity => {
        scene.context.drawImage(entity.sprite.image, Math.floor(entity.position.x - scene.x), Math.floor(entity.position.y - scene.y))
    });
    rectangles.forEach(rectangle => {
        scene.context.strokeStyle = 'red'
        scene.context.strokeRect(Math.floor(rectangle.x), Math.floor(rectangle.y), 32, 32)
    });
    rectangles = []
}

let AISystem = (scene) => {
    scene.world.forEach(entity => {
        let ai = AI.get(entity)
        if (!ai) return
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


class RanchScene {
    constructor() {
        this.world = new Registry();
        this.x = 0
        this.y = 0
        this.mousedown = false
        this.clicked = {
            x: 0,
            y: 0
        }
        this.mousePos = {
            x: 0,
            y: 0
        }
        this.currentAlot = {
            name: '',
            speed: 0,
            endurance: 0,
            focus: 0,
            spunk: 0
        }
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

        bgRanchFacotry(this)
        alotFactory(this)
        alotFactory(this)
        alotFactory(this)
        playerFactory(this)
        this.setupControls()
    }

    runSystems() {
        InputHandlerSystem(this)
        AISystem(this)

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fillStyle = 'black'
        this.context.fillRect(WIDTH - 64, 0, 64, HEIGHT)
        drawWhiteText(this.context, this.currentAlot.name, WIDTH - 56, 4)
        this.context.fillStyle = 'green'
        this.context.fillRect(WIDTH - 60, 16, 4 * this.currentAlot.speed, 4)
        this.context.fillStyle = 'red'
        this.context.fillRect(WIDTH - 60, 24, 4 * this.currentAlot.endurance, 4)
        this.context.fillStyle = 'blue'
        this.context.fillRect(WIDTH - 60, 32, 4 * this.currentAlot.focus, 4)
        this.context.fillStyle = 'purple'
        this.context.fillRect(WIDTH - 60, 40, 4 * this.currentAlot.spunk, 4)
        RenderSystem(this)
    }

    setupControls() {
        document.getElementById('main-viewport').addEventListener('mousedown', (ev) => {
            this.eventQueue.push(ev)
        })

        // document.addEventListener('mouseup', (ev) => {
        //     this.mousedown = false
        // })

        // document.addEventListener('mousemove', (ev) => {
        //     if (this.mousedown) {
        //         this.x += (this.clicked.x - ev.x) / SCALE
        //         if (this.x < 0) {
        //             this.x = 0
        //         } else if (this.x >= this.w - WIDTH) {
        //             this.x = this.w - WIDTH
        //         }
        //         this.y += (this.clicked.y - ev.y) / SCALE
        //         if (this.y < 0) {
        //             this.y = 0
        //         } else if (this.y >= this.h - HEIGHT) {
        //             this.y = this.h - HEIGHT
        //         }
        //         this.clicked = {
        //             x: ev.x,
        //             y: ev.y
        //         }
        //     }
        // })

        document.getElementById('main-viewport').addEventListener('mousemove', (ev) => {
            ev.localX = ev.offsetX
            ev.localY = ev.offsetY
            this.eventQueue.push(ev)
        })
    }
}

let activeScene = undefined
activeScene = new RanchScene()
window.onload = () => {
    initializeFonts()
    main(0)
}