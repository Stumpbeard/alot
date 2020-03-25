// GLOBALS

const HEIGHT = 240
const WIDTH = 256
const SCALE = 4
let EVENT_QUEUE = []


// AUDIO

let ranchMusic = document.createElement('audio')
ranchMusic.src = "sounds/ranch-music.mp3"
ranchMusic.loop = true

let clickSound = document.createElement('audio')
clickSound.src = "sounds/click.mp3"


// MAIN FUNCTION

let main = (timestamp) => {
    window.requestAnimationFrame(main)

    activeScene[0].runSystems()
}


// ECS STUFF

let uid = 1;

let Entity = () => uid++;
let Registry = Array;


// SCENES

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
        this.background = 'bgRanch'

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
        SystemInput(this)
        SystemTimer(this)
        SystemAlotAI(this)
        SystemAlotBabyAI(this)
        SystemItemSpawnerAI(this)
        SystemIcons(this)
        SystemRender(this)
        SystemAnimation(this)
    }

    initializeEnts() {
        EntityAlot(this, Math.floor(Math.random() * this.w), Math.floor(Math.random() * this.h), Math.floor(Math.random() * 8) + 1, { red: 'Rr', blue: 'Bb', yellow: 'Yy' })
        EntityAlot(this, Math.floor(Math.random() * this.w), Math.floor(Math.random() * this.h), Math.floor(Math.random() * 8) + 1, { red: 'Rr', blue: 'Bb', yellow: 'Yy' })
        EntityAlot(this, Math.floor(Math.random() * this.w), Math.floor(Math.random() * this.h), Math.floor(Math.random() * 8) + 1, { red: 'Rr', blue: 'Bb', yellow: 'Yy' })
        EntityEggplant(this, Math.floor(Math.random() * this.w), Math.floor(Math.random() * this.h))
        EntityItemSpawner(this)
        EntityCursor(this)
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


// GAME START

let activeScene = []
activeScene.push(new RanchScene())
window.onload = () => {
    initializeFonts()
    loadAnimations()
    main(0)
}