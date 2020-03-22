let Component = Map;

var Position = new Component()
var Target = new Component()
var Sprite = new Component()
var Animation = new Component()
var AI = new Component()
var Attributes = new Component()
var Status = new Component()
var InputHandler = new Component()
var State = new Component()
var Anchor = new Component()
var Bonus = new Component()
var Timer = new Component()
var Genetics = new Component()
var SelectedAlots = new Component()
var ButtonText = new Component()
var EntityType = new Component()

let removeEntity = (ent) => {
    let components = []
    for (let key in window) {
        if (window[key] instanceof Component) {
            components.push(window[key])
        }
    }
    components.forEach(component => {
        component.delete(ent)
    });
}

let buttonText = (ent, text) => {
    ButtonText.set(ent, { text: text.toUpperCase() })
}

let selectedAlots = (ent) => {
    SelectedAlots.set(ent, [])
}

let position = (entity, x, y, z) => {
    Position.set(entity, { x: x, y: y, z: z })
}

let target = (entity, x, y, ent) => {
    Target.set(entity, { x: x, y: y, ent: ent })
}

let image = (entity, image) => {
    Sprite.set(entity, { image: image })
}

let animation = (entity, animation, rate) => {
    let randomTimerStart = Math.floor(Math.random() * rate / 2)
    Animation.set(entity, { animation: animation, rate: rate, timer: randomTimerStart, currentFrame: 0 })
}

let ai = (entity, ai) => {
    AI.set(entity, { ai: ai })
}

let attributes = (entity, name, spd, end, fcs, spk, sex) => {
    Attributes.set(entity, {
        name: name,
        speed: { natural: spd, bonus: 0 },
        endurance: { natural: end, bonus: 0 },
        focus: { natural: fcs, bonus: 0 },
        spunk: { natural: spk, bonus: 0 },
        sex: sex
    })
}

let genetics = (entity, genetics) => {
    Genetics.set(entity, genetics)
}

let status = (entity) => {
    Status.set(entity, { status: [] })
}

let inputHandler = (entity, handler) => {
    InputHandler.set(entity, { handler: handler, keydown: { mouse1: false }, clickPos: { x: 0, y: 0 }, mousePos: { x: 0, y: 0 } })
}

let state = (entity, state) => {
    State.set(entity, state)
}

let anchor = (entity, ent, offsetX, offsetY) => {
    Anchor.set(entity, { ent: ent, x: offsetX, y: offsetY })
}

let bonus = (entity, status, attributes) => {
    Bonus.set(entity, { status: status, attributes: attributes })
}

let timer = (entity, timer) => {
    Timer.set(entity, { timer: timer })
}

let entityType = (entity, type) => {
    EntityType.set(entity, { type: type })
}