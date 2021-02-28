import { nodes } from "./main.js"

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function Draw() {
    ctx.clearRect(0, 0, 2000, 2000);
    this.circle = function(){
        let radius = p.x * p.y;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    nodes.forEach(node => {
        node.display();
    })

    window.requestAnimationFrame(Draw)

}

export { Draw }