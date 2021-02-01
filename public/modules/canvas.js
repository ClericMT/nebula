import { nodes } from "/modules/logic.js"

const canvasBg = document.getElementById('background-layer')
const canvasNodes = document.getElementById('node-layer')
const canvasAni = document.getElementById('animation-layer')
const ctx = canvasNodes.getContext('2d');

function fitToContainer(canvas){
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

const drawNodes = () => {
    nodes.forEach(node => {
        drawCircle(node.x, node.y, 10, node.colour)
    })
}

const drawCircle = (x, y, radius, colour) => {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
}

fitToContainer(canvasNodes);

export { drawNodes }