// HELPERS

let fetchEnts = (scene, ...args) => {
    let applicableEnts = []
    scene.world.forEach(uid => {
        let ent = {
            ent: uid
        }
        for (let i = 0; i < args.length; ++i) {
            let component = window[args[i]]
            let name = args[i]
            let value = component.get(uid)
            if (value) {
                ent[name] = value
            } else {
                return
            }
        }
        applicableEnts.push(ent)
    })
    return applicableEnts
}

let geneticSimulator = (parent1, parent2) => {
    const genes1 = Genetics.get(parent1)
    const genes2 = Genetics.get(parent2)
    let newGenes = {}
    const colors = ['red', 'blue', 'yellow']

    colors.forEach(color => {
        const color1 = genes1[color]
        const color2 = genes2[color]
        let newColor = ""
        let roll = Math.floor(Math.random() * 4)
        switch (roll) {
            case 0:
                newColor = color1[0] + color2[0]
                newColor = [...newColor].sort().join('')
                break
            case 1:
                newColor = color1[0] + color2[1]
                newColor = [...newColor].sort().join('')
                break
            case 2:
                newColor = color1[1] + color2[0]
                newColor = [...newColor].sort().join('')
                break
            case 3:
                newColor = color1[1] + color2[1]
                newColor = [...newColor].sort().join('')
                break
        }
        newGenes[color] = newColor
    })

    return newGenes
}

let approachTarget = (a, b, speed) => {
    let averageX = Math.abs(a.x - b.x) / 2
    let averageY = Math.abs(a.y - b.y) / 2
    if (averageX >= averageY) {
        if (a.x < b.x) {
            a.x += speed
        } else {
            a.x -= speed
        }
    } else if (averageX < averageY) {
        if (a.y < b.y) {
            a.y += speed
        } else {
            a.y -= speed
        }
    }
}

let isInsideBox = (coords, box) => {
    if (coords.x >= box.x &&
        coords.x < box.x + box.w &&
        coords.y >= box.y &&
        coords.y < box.y + box.h) {
        return true
    }
    return false
}

let findOnTop = (a, b) =>
    (a.Position.z < b.Position.z) ? false :
    ((a.Position.z > b.Position.z) ? true :
        (a.Position.y - b.Position.y))

let isColliding = (a, b) => {
    if (a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y) {
        return true
    }
    return false
}

// SYSTEMS

let SystemTimer = (scene) => {
    let ents = fetchEnts(scene, 'Timer')
    ents.forEach(entity => {
        let timers = entity.Timer
        for (const timer in timers) {
            if (timers.hasOwnProperty(timer)) {
                timers[timer] -= 1000 / 60;
            }
        }
    })
}

let SystemItemSpawnerAI = (scene) => {
    let ents = fetchEnts(scene, 'Timer')
    ents.forEach(entity => {
        const timer = entity.Timer
        if (timer.itemSpawn <= 0) {
            let eggplants = fetchEnts(scene, 'Held')
            if (eggplants.length < 5) {
                EntityEggplant(scene, Math.floor(Math.random() * scene.w), Math.floor(Math.random() * scene.h))
            }
            timer.itemSpawn = 15000
        }
    })
}

let SystemAlotAI = (scene) => {
    let ents = fetchEnts(scene, 'Position', 'Target', 'Timer', 'Speed', 'Animation', 'Horny', 'Speed', 'Selected')
    ents.forEach(entity => {
        let ent = entity.ent
        let target = entity.Target
        let timer = entity.Timer
        let horny = entity.Horny.value
        let position = entity.Position
        let selected = entity.Selected.value
        let speed = entity.Speed.value
        let x = position.x
        let y = position.y
        if (target.mate) {
            let mateTargetX = target.mate.x
            let mateTargetY = target.mate.y
            if (Math.abs(x - mateTargetX) < 8 && Math.abs(y - mateTargetY) < 8) {
                setAnimation(ent, 'found', 250)
                addTimer(ent, 'foundMate', 3000, false)
                if (timer.foundMate <= 0) {
                    if (horny) {
                        let mates = fetchEnts(scene, 'Position', 'Speed')
                        let mateEnt = undefined
                        for (let i = 0; i < mates.length; ++i) {
                            if (target.mate === mates[i].Position) {
                                mateEnt = mates[i]
                                break
                            }
                        }
                        if (mateEnt) {
                            babyX = x + Math.floor(Math.random() * 32) - 16
                            babyY = y + Math.floor(Math.random() * 32) - 16
                            babyGenes = geneticSimulator(ent, mateEnt.ent)
                            babySpeed = Math.ceil((speed + mateEnt.Speed.value) / 2)
                            EntityBabyAlot(scene, babyX, babyY, babySpeed, babyGenes)
                        }
                        let hearts = fetchEnts(scene, 'Target', )
                        hearts.forEach(heart => {
                            if (heart.Target.aboveHead === position) {
                                removeEntity(heart.ent)
                            }
                        });
                        entity.Horny.value = false
                    }
                    deleteTimer(ent, 'foundMate')
                    deleteTarget(ent, 'mate')
                }
            } else {
                setAnimation(ent, 'walk', 500 - 50 * speed)
                approachTarget(position, target.mate, speed * 0.1)
            }
        } else if (selected) {
            setAnimation(ent, 'selected')
        } else if (target.wander) {
            let wanderX = target.wander.x
            let wanderY = target.wander.y
            setAnimation(ent, 'walk', 500 - 50 * speed)
            approachTarget(position, target.wander, speed * 0.1)
            if ((Math.abs(x - wanderX) < 8) && (Math.abs(y - wanderY) < 8)) {
                deleteTarget(ent, 'wander')
            }
        } else if (timer.idle) {
            setAnimation(ent, 'idle', 500)
            let roll = Math.floor(Math.random() * 15)
            if (roll === 14) {
                roll = Math.floor(Math.random() * 4)
                switch (roll) {
                    case 0:
                        entity.Position.x += 1
                        break
                    case 1:
                        entity.Position.x -= 1
                        break
                    case 2:
                        entity.Position.y += 1
                        break
                    case 3:
                        entity.Position.y -= 1
                        break
                }
            }
            if (timer.idle <= 0) {
                deleteTimer(ent, 'idle')
            }
        } else {
            let roll = Math.floor(Math.random() * 3)
            if (roll === 2) {
                let randomX = Math.floor(Math.random() * scene.w)
                let randomY = Math.floor(Math.random() * scene.h)
                let loc = { x: randomX, y: randomY }
                addTarget(ent, 'wander', loc)
            } else {
                addTimer(ent, 'idle', 5000, true)
            }

        }
    })
}

SystemAlotBabyAI = (scene) => {
    let ents = fetchEnts(scene, 'Genetics', 'Timer', 'Position', 'Speed')
    ents.forEach(entity => {
        let timer = entity.Timer
        let position = entity.Position
        let speed = entity.Speed.value
        let genes = entity.Genetics
        if (timer.growup <= 0) {
            EntityAlot(scene, position.x, position.y, speed, genes)
            removeEntity(entity.ent)
        }
    });
}

SystemIcons = (scene) => {
    let ents = fetchEnts(scene, 'Position', 'Target')
    ents.forEach(entity => {
        let target = entity.Target
        let position = entity.Position
        if (target.aboveHead) {
            position.x = target.aboveHead.x + 3
            position.y = target.aboveHead.y
        }
    });
}

let SystemInput = (scene) => {
    EVENT_QUEUE.forEach(ev => {
        const mousePos = {
            x: ev.localX,
            y: ev.localY
        }
        let ents = []
        switch (ev.type) {
            case 'mousedown':
                clickSound.currentTime = 0
                clickSound.play()
                ents = fetchEnts(scene, 'Position', 'Sprite')
                ents.sort(findOnTop).reverse()
                let clickedEnt = undefined
                for (let i = 0; i < ents.length; ++i) {
                    let isPlayer = IsPlayer.get(ents[i].ent)
                    if (isInsideBox(mousePos, ents[i].Position) && !isPlayer) {
                        clickedEnt = ents[i]
                        break
                    }
                }
                if (clickedEnt) {
                    const selected = Selected.get(clickedEnt.ent)
                    const held = Held.get(clickedEnt.ent)
                    if (selected) {
                        selected.value = !selected.value
                    } else if (held) {
                        held.value = true
                        clickedEnt.Position.x = mousePos.x - clickedEnt.Position.w / 2
                        clickedEnt.Position.y = mousePos.y - clickedEnt.Position.h / 2
                    }
                }
                break
            case 'mouseup':
                ents = fetchEnts(scene, 'Held')
                ents.forEach(entity => {
                    let held = entity.Held.value
                    if (held) {
                        let alots = fetchEnts(scene, 'Horny', 'Position')
                        alots.sort(findOnTop).reverse()
                        for (let i = 0; i < alots.length; ++i) {
                            if (isInsideBox(mousePos, alots[i].Position)) {
                                alots[i].Horny.value = true
                                EntityHeartStatus(scene, alots[i].Position)
                                removeEntity(entity.ent)
                                return
                            }
                        }
                        entity.Held.value = false
                    }
                })
                break
            case 'mousemove':
                let cursor = fetchEnts(scene, 'IsPlayer', 'Position')
                cursor[0].Position.x = mousePos.x
                cursor[0].Position.y = mousePos.y

                ents = fetchEnts(scene, 'Position', 'Held')
                ents.forEach(entity => {
                    let held = entity.Held.value
                    let position = entity.Position
                    if (held) {
                        position.x = mousePos.x - position.w / 2
                        position.y = mousePos.y - position.h / 2
                    }
                })
                break
        }
    })
    EVENT_QUEUE = []
}

let SystemRender = (scene) => {
    if (document.body.clientHeight >= document.body.clientWidth) {
        scene.canvas.style = `width: ${WIDTH * SCALE}px; max-width: 100%;`
    } else {
        scene.canvas.style = `height: ${HEIGHT * SCALE}px; max-height: 100%;`
    }

    scene.context.clearRect(0, 0, scene.canvas.w, scene.canvas.h)
    if (scene.background) {
        scene.context.drawImage(images[scene.background], 0, 0)
    }

    let ents = fetchEnts(scene, 'Position', 'Sprite')
    ents.sort(findOnTop)
    ents.forEach(entity => {
        const sprite = entity.Sprite.value
        const animation = Animation.get(entity.ent)
        const position = entity.Position
        let imageToDraw = images[entity.Sprite.value]
        if (animation) {
            imageToDraw = sheets[sprite].frames[sheets[sprite].animations[animation.animation][animation.currentFrame]]
        }
        scene.context.drawImage(imageToDraw, Math.round(position.x), Math.round(position.y))
    })
}

let SystemAnimation = (scene) => {
    let ents = fetchEnts(scene, 'Animation', 'Sprite')
    ents.forEach(entity => {
        const sprite = entity.Sprite.value
        const animation = entity.Animation
        animation.timer += 1000 / 60
        if (animation.timer >= animation.rate) {
            animation.currentFrame += 1
            animation.timer = 0
        }

        if (animation.currentFrame >= sheets[sprite].animations[animation.animation].length) {
            animation.currentFrame = 0
        }
    })
}