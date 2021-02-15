import { nodes, timerList } from "/modules/logic.js"
import { colours } from "/modules/styles.js"

const canvasBg = document.getElementById('background-layer')
const canvasNodes = document.getElementById('node-layer')
const canvasAni = document.getElementById('animation-layer')
const ctx = canvasNodes.getContext('2d');
const ctxa = canvasAni.getContext('2d');

fitToContainer(canvasNodes);
fitToContainer(canvasAni);

function fitToContainer(canvas){
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

const drawNodes = () => {
    ctx.clearRect(0, 0, 2000, 2000)
    nodes.forEach(node => {
        if (node.io || node.timer){
            node.colour = colours.active;
            ctx.shadowColor = 'rgba(0, 255, 255, 1)';
            ctx.shadowBlur = 30;
        } else if (node.hover) {
            node.colour = colours.active;
            drawText(node);
        } else {
            node.colour = colours.idle;
            ctx.shadowColor = 'rgba(0, 0, 0)';
            ctx.shadowBlur = 0;
        }
        drawCircle(node.x, node.y, 10, node.colour)
    })
}

const drawText = (node) => {
    ctx.font = "30px Monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "aqua"
    ctx.fillText(node.name, node.x, (node.y + 10 + 30));
}

const drawCircle = (x, y, radius, colour) => {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
}


const animateTime = (n) => {
    if (n.glow > 25){
        n.up = false;
    } else if (n.glow < 1){
        n.up = true
    }

    n.up ? animateGlow(1) : animateGlow(-1);
    function animateGlow(dir){
        n.glow += dir/((timerList.length + 1) * 2); //for some reason animation gets faster the more active?
        ctxa.beginPath();
        ctxa.shadowBlur = n.glow; 
        ctxa.fillStyle = "aqua";
        ctxa.arc(n.node.x, n.node.y, 10, 0, 2 * Math.PI, false);
        ctxa.fill();
    }
}

//Animations on separate canvas/list to increase performance
function animateNode(){
    ctxa.clearRect(0,0,2000,2000);
    ctxa.shadowColor = 'rgba(0, 255, 255, 1)';
    if (timerList.length === 0){
        return 0;
    }
    timerList.forEach(n => {
        animateTime(n)
    })
    window.requestAnimationFrame(animateNode)
}

export { drawNodes, animateNode }