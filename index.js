const canvas = document.createElement('canvas')
canvas.id = 'main-viewport'
canvas.height = 144
canvas.width = 256
document.body.appendChild(canvas)
const context = canvas.getContext('2d')
context.imageSmoothingEnabled = 'false'

// Main function
let main = (timestamp) => {
    window.requestAnimationFrame(main)

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(alot, 0, 0)
}

// ECS stuff
let uid = 0;

let Entity = () => uid++;
let Component = Map;
let Registry = Set;

// Asset loading
const alot = new Image();
alot.src = 'images/alot.png'

window.onload = () => main(0)