// Constants
const HEIGHT = 144
const WIDTH = 256

// Main function
let main = (timestamp) => {
    window.requestAnimationFrame(main)

    activeScene.runSystems()
}

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

// Components
let Position = new Component()
let Sprite = new Component()

let position = (entity, x, y) => {
    Position.set(entity, { x: x, y: y })
}

let image = (entity, image) => {
    Sprite.set(entity, { image: images[image] })
}

// Entity factories
let alotFactory = (scene) => {
    let ent = Entity()
    let randomXY = () => [Math.floor(Math.random() * (WIDTH * 2)), Math.floor(Math.random() * (HEIGHT * 2))]
    position(ent, ...randomXY())
    image(ent, 'alot')
    scene.world.add(ent)
}

// Systems
let RenderSystem = (scene) => {
    scene.context.clearRect(0, 0, scene.canvas.width, scene.canvas.height)

    let drawQueue = []
    scene.world.forEach(entity => {
        let position = Position.get(entity)
        let sprite = Sprite.get(entity)
        if (!position || !sprite) return
        drawQueue.push({ sprite: sprite, position: position })
    });
    drawQueue.sort((a, b) => a.position.y - b.position.y)
    drawQueue.forEach(entity => {
        scene.context.drawImage(entity.sprite.image, entity.position.x - scene.x, entity.position.y - scene.y)
    });
}

class RanchScene {
    constructor() {
        this.world = new Registry();
        this.x = 0
        this.y = 0
        this.w = 512
        this.h = 288
        this.mousedown = false
        this.clicked = {
            x: 0,
            y: 0
        }
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'main-viewport'
        this.canvas.height = HEIGHT
        this.canvas.width = WIDTH
        document.body.appendChild(this.canvas)
        this.context = this.canvas.getContext('2d')
        this.context.imageSmoothingEnabled = 'false'

        alotFactory(this)
        alotFactory(this)
        alotFactory(this)
        alotFactory(this)
        alotFactory(this)
        this.setupControls()
    }

    runSystems() {
        RenderSystem(this)
    }

    setupControls() {
        document.getElementById('main-viewport').addEventListener('mousedown', (ev) => {
            this.mousedown = true
            this.clicked = {
                x: ev.x,
                y: ev.y
            }
        })

        document.addEventListener('mouseup', (ev) => {
            console.log(ev.type, ev.offsetX, ev.offsetY)
            this.mousedown = false
        })

        document.addEventListener('mousemove', (ev) => {
            if (this.mousedown) {
                this.x += this.clicked.x - ev.x
                if (this.x < 0) {
                    this.x = 0
                } else if (this.x >= this.w - WIDTH) {
                    this.x = this.w - WIDTH
                }
                this.y += this.clicked.y - ev.y
                if (this.y < 0) {
                    this.y = 0
                } else if (this.y >= this.h - HEIGHT) {
                    this.y = this.h - HEIGHT
                }
                this.clicked = {
                    x: ev.x,
                    y: ev.y
                }
            }
        })
    }
}

let activeScene = {}
activeScene = new RanchScene()
window.onload = () => main(0)