let Component = Map;

let Position = new Component()
let Target = new Component()
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
let Timer = new Component()
let Genetics = new Component()

let components = [Position, Target, Sprite, Animation, AI, Attributes, Status, ParentScene, InputHandler, State, Anchor, Bonus, Timer, Genetics]
let removeEntity = (ent) => {
    components.forEach(component => {
        component.delete(ent)
    });
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

let timer = (entity, timer) => {
    Timer.set(entity, { timer: timer })
}