// Constants
const HEIGHT = 144
const WIDTH = 256

const canvas = document.createElement('canvas')
canvas.id = 'main-viewport'
canvas.height = HEIGHT
canvas.width = WIDTH
document.body.appendChild(canvas)
const context = canvas.getContext('2d')
context.imageSmoothingEnabled = 'false'

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
    context.clearRect(0, 0, canvas.width, canvas.height)

    let drawQueue = []
    scene.world.forEach(entity => {
        let position = Position.get(entity)
        let sprite = Sprite.get(entity)
        if (!position || !sprite) return
        drawQueue.push({ sprite: sprite, position: position })
    });
    drawQueue.sort((a, b) => a.position.y - b.position.y)
    drawQueue.forEach(entity => {
        context.drawImage(entity.sprite.image, entity.position.x, entity.position.y)
    });
}

class RanchScene {
    constructor() {
        this.world = new Registry();
        this.x = 0
        this.y = 0
        alotFactory(this)
        alotFactory(this)
        alotFactory(this)
        alotFactory(this)
        alotFactory(this)
    }

    runSystems() {
        RenderSystem(this)
    }
}

let activeScene = {}
activeScene = new RanchScene()
window.onload = () => main(0)