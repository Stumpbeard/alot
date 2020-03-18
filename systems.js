// HELPERS

let isInsideBox = (coords, box, dims) => {
    if (coords.x >= box.x &&
        coords.x < box.x + dims &&
        coords.y >= box.y &&
        coords.y < box.y + dims) {
        return true
    }
    return false
}

let findOnTop = (a, b) =>
    (a.position.z < b.position.z) ? false :
    ((a.position.z > b.position.z) ? true :
        (a.position.y - b.position.y))

// SYSTEMS

let CursorInputSystem = (scene) => {
    scene.world.forEach(ent => {
        let entImage = Sprite.get(ent)
        if (!entImage || entImage.image !== 'cursor') return

        let entPosition = Position.get(ent)
        EVENT_QUEUE.forEach(ev => {
            switch (ev.type) {
                case 'mousemove':
                    entPosition.x = ev.localX
                    entPosition.y = ev.localY
                    break
                case 'mouseup':
                    clickSound.play()
                    break
            }
        })
    })
}

let TimerSystem = (scene) => {
    scene.world.forEach(ent => {
        let entTimer = Timer.get(ent)
        if (!entTimer) return
        entTimer.timer -= 1000 / 60
    })
}

let AlotAISystem = (scene) => {
    scene.world.forEach(ent => {
        let entImage = Sprite.get(ent)
        if (!entImage || !entImage.image.includes('Alot')) return

        // Update decision
        let entTimer = Timer.get(ent)
        if (entTimer && entTimer.timer <= 0) {
            timer(ent, 1000 * Math.floor(Math.random() * 5 + 1))
            let roll = Math.floor(Math.random() * 5)
            switch (roll) {
                case 4:
                    let x = Math.floor(Math.random() * (scene.w - 32))
                    let y = Math.floor(Math.random() * (scene.h - 32))
                    target(ent, x, y)
                    break
            }
        }

        let entAnimation = Animation.get(ent)
        let entState = State.get(ent)
        let entPosition = Position.get(ent)
        let entTarget = Target.get(ent)

        // Pause if selected
        if (entState.selected) {
            animation(ent, 'selected', 500)
        } else {
            // Walk towards target
            if (entTarget) {
                let entAttributes = Attributes.get(ent)
                let entTarget = Target.get(ent)

                if (entAnimation.animation !== 'walk') {
                    animation(ent, 'walk', 500 - 50 * (entAttributes.speed.natural + entAttributes.speed.bonus))
                }

                let velocity = (entAttributes.speed.natural + entAttributes.speed.bonus) * 0.1
                let averageX = Math.abs(entPosition.x - entTarget.x) / 2
                let averageY = Math.abs(entPosition.y - entTarget.y) / 2
                if (averageX >= averageY) {
                    if (entPosition.x < entTarget.x) {
                        entPosition.x += velocity
                    } else {
                        entPosition.x -= velocity
                    }
                } else if (averageX < averageY) {
                    if (entPosition.y < entTarget.y) {
                        entPosition.y += velocity
                    } else {
                        entPosition.y -= velocity
                    }
                }
                if (Math.abs(entPosition.x - entTarget.x) < 5 &&
                    Math.abs(entPosition.y - entTarget.y) < 5) {
                    Target.delete(ent)
                }
            }

            // Slightly move
            else {
                if (entAnimation.animation !== 'idle') {
                    animation(ent, 'idle', 500)
                }

                // Decide whether to wiggle
                let roll = Math.floor(Math.random() * 60) + 1
                if (roll === 60) {
                    // Choose wander direction
                    roll = Math.floor(Math.random() * 4)
                    switch (roll) {
                        case 0:
                            entPosition.x += 1
                            break
                        case 1:
                            entPosition.x -= 1
                            break
                        case 2:
                            entPosition.y += 1
                            break
                        case 3:
                            entPosition.y -= 1
                            break
                    }
                }
            }
        }

        // Reenter the world bounds
        if (entPosition.x < 0) entPosition.x = 0
        if (entPosition.x > scene.w - 32) entPosition.x = scene.w - 32
        if (entPosition.y < 0) entPosition.y = 0
        if (entPosition.y > scene.h - 32) entPosition.y = scene.h - 32
    })
}

let ClickInputSystem = (scene) => {
    EVENT_QUEUE.forEach(ev => {
        let mousePos = { x: ev.localX, y: ev.localY }

        switch (ev.type) {
            case 'mouseup':
                // Find clickable ents and order them to find top
                let clickableEnts = []
                scene.world.forEach(ent => {
                    let entPosition = Position.get(ent)
                    let entImage = Sprite.get(ent)
                    if (!entPosition ||
                        !entImage ||
                        entImage.image === 'cursor') return

                    let y = images[entImage.image].height
                    if (isInsideBox(mousePos, entPosition, y)) {
                        clickableEnts.push({ position: entPosition })
                    }
                })
                clickableEnts.sort(findOnTop).reverse()
                console.log(clickableEnts)

                // If we have stuff to click, reset click one everything else,
                // and click the top boy
                if (clickableEnts.length > 0) {
                    scene.world.forEach(ent => {
                        let entPosition = Position.get(ent)
                        let entState = State.get(ent)
                        if (!entPosition || !entState) return

                        if (clickableEnts[0].position === entPosition) {
                            entState.selected = !entState.selected
                        } else {
                            entState.selected = false
                        }
                    })
                }
                break
        }
    })
}

let RenderSystem = (scene) => {
    if (document.body.clientHeight >= document.body.clientWidth) {
        scene.canvas.style = `width: ${WIDTH * SCALE}px; max-width: 100%;`
    } else {
        scene.canvas.style = `height: ${HEIGHT * SCALE}px; max-height: 100%;`
    }
    scene.context.clearRect(0, 0, scene.canvas.w, scene.canvas.h)

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
    drawQueue.sort(findOnTop)
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
    })
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
    })
}