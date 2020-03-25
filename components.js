let Component = Map

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

var Position = new Component()

let ComponentPosition = (entity, x = 0, y = 0, z = 0, h = 0, w = 0) => {
    Position.set(entity, { x: x, y: y, z: z, w: w, h: h })
}

var Target = new Component()

let ComponentTarget = (entity, targets = {}) => {
    Target.set(entity, targets)
}

let addTarget = (ent1, type, ent2) => {
    let target = Target.get(ent1)
    if (target) {
        target[type] = ent2
    }
}

let deleteTarget = (ent, type) => {
    let target = Target.get(ent)
    if (target) {
        target[type] = null
    }
}

var Timer = new Component()

let ComponentTimer = (ent, types = {}) => {
    Timer.set(ent, types)
}

let addTimer = (ent1, type, countdown, reset) => {
    let timers = Timer.get(ent1)
    if (timers) {
        if (!timers[type] || reset) {
            timers[type] = countdown
        }
    }
}

let deleteTimer = (ent, type) => {
    let timers = Timer.get(ent)
    if (timers) {
        timers[type] = undefined
    }
}

var Sprite = new Component()

let ComponentSprite = (entity, sprite) => {
    Sprite.set(entity, { value: sprite })
}

var Animation = new Component()

let ComponentAnimation = (entity, animation, rate = 0) => {
    Animation.set(entity, { animation: animation, rate: rate, timer: 0, currentFrame: 0 })
}

let setAnimation = (entity, animation, rate = 0, reset = false) => {
    let currentAnimation = Animation.get(entity)
    if (currentAnimation.animation === animation && !reset) {
        currentAnimation.rate = rate
    } else {
        Animation.set(entity, { animation: animation, rate: rate, timer: 0, currentFrame: 0 })
    }
}

var Horny = new Component()

let ComponentHorny = (ent, current = false) => {
    Horny.set(ent, { value: current })
}

var Selected = new Component()

let ComponentSelected = (ent, current = false) => {
    Selected.set(ent, { value: current })
}

var Held = new Component()

let ComponentHeld = (ent, current = false) => {
    Held.set(ent, { value: current })
}

var IsPlayer = new Component()

let ComponentIsPlayer = (ent, current = true) => {
    IsPlayer.set(ent, { value: current })
}

var Speed = new Component()

let ComponentSpeed = (ent, speed) => {
    Speed.set(ent, { value: speed })
}

var Genetics = new Component()

let ComponentGenetics = (ent, genes) => {
    Genetics.set(ent, genes)
}