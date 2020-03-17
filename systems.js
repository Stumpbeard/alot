let CursorInputSystem = (scene) => {
    scene.world.forEach(ent => {
        let entImage = Sprite.get(ent)
        if (!entImage || entImage.image !== 'cursor') return

        let entPosition = Position.get(ent)
        eventQueue.forEach(ev => {
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

let timerSystem = (scene) => {
    scene.world.forEach(ent => {
        let entTimer = Timer.get(ent)
        if (!entTimer) return
        timer.timer -= 1000 / 60
    })
}

let alotAISystem = (scene) => {
    scene.world.forEach(ent => {
        let entImage = Sprite.get(ent)
        if (!entImage || !entImage.image.includes('Alot')) return

        let entState = State.get(ent)

        // Slightly move
        if (entState.wandering) {
            let entPosition = Position.get(ent)

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

        // Update decision
        let entTimer = Timer.get(ent)
        if (entTimer && entTimer.timer <= 0) {
            timer(ent, 1000 * Math.floor(Math.random() * 5 + 1))
        }

        // Reenter the world bounds
        if (position.x < 0) position.x = 0
        if (position.x > scene.w - 32) position.x = scene.w - 32
        if (position.y < 0) position.y = 0
        if (position.y > scene.h - 32) position.y = scene.h - 32
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
    drawQueue.sort(
        (a, b) =>
        (a.position.z < b.position.z) ? false :
        ((a.position.z > b.position.z) ? true :
            (a.position.y - b.position.y)))
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