// To Do
// change for loop for returnLocation into returnLocation
// 

import { Vector } from "./vector.js"
import { styles } from "./styles.js"

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let currentNode;
let nodes = []

let screen = {
    clicked: false,
    magnify: 1,
    drag: function() {
        let magnitude = mouse.position.subNew(mouse.savePos);
        magnitude.div(10);
        nodes.forEach(node => {
            node.position.add(magnitude);
        })
    },
    zoom: function(io) {
        //zoom in
        if (io === 1) {
            console.log(this.magnify)
            this.magnify *= 2;
            console.log(this.magnify)
        }
        //zoom out
        else if (io === 0) {
            this.magnify /= 2;
        }
    }
}

let mouse = {
    savePos: new Vector(0, 0, 0),
    position: new Vector(0, 0, 0),
    returnLocation: function(n) {
        if (this.position.x > (n.position.x - n.radius) && this.position.x < (n.position.x + n.radius) && this.position.y > n.position.y - n.radius && this.position.y < n.position.y + n.radius){
            return true;
        } else return false;
    },
};



//---------------------------------------------------------------------------------------------------------------------------

class Node {
    constructor(x, y) {
        this.position = new Vector(x, y, 0)
        this.id = parseInt(Math.random()*1000000);
        this.style = styles[1];
        this.color = this.style.fillStyle;
        this.shadowBlur = 0
        this.selected = false;
        this.timer = false;
        this.time = 0;
        this.radius = 10;
        this.dir = 1;
        this.nodeIns = {};
        this.parentNode = currentNode;
        this.clicked = false;
    }

    update() {
        if (this.timer) {
            this.animate();
        }
        this.radius = (this.time/1000 + 10) * screen.magnify;
    }

    display() {
        //brings nodes to foreground
        ctx.globalCompositeOperation='source-over';

        //lines between nodes
        ctx.lineWidth = this.style.outlineWidth;
        ctx.strokeStyle = this.style.strokeStyle;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.shadowColor = this.style.shadowColor;
        ctx.shadowBlur = this.shadowBlur;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        //text
        ctx.font = "30px Arial";
        ctx.fillText(this.name, 10, 50);

        //brings lines to background
        ctx.globalCompositeOperation='destination-over';

        if (typeof this.nodeIns !== "undefined"){
            for (const property in this.nodeIns) {
                const n = this.nodeIns[property]
                ctx.strokeStyle = this.style.lineStyle;
                ctx.lineWidth = this.style.lineWidth;
                ctx.beginPath();
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(n.position.x, n.position.y);
                ctx.stroke();
            }
        }
    }

    select() {
        if (this.selected) {
            this.selected = false;
            this.color = this.style.fillStyle;
            this.shadowBlur = 0;
            
        } else {
            this.selected = true;
            this.color = this.style.selectStyle;
            this.shadowBlur = 20;
        }
    }

    highlight(io) {
        if (!this.selected) {
            io ? this.color = this.style.highlightStyle : this.color = this.style.fillStyle;
        }
    }

    drag() {
        this.position.x = mouse.position.x;
        this.position.y = mouse.position.y;
    }

    timerIO(io) {
        if (io) {
            this.timer = Date.now();
        } else {
            this.time += Date.now() - this.timer;
            this.timer = false;
        }
    }

    msToTime(duration) {
        let milliseconds = parseInt((duration % 1000) / 100),
          seconds = Math.floor((duration / 1000) % 60),
          minutes = Math.floor((duration / (1000 * 60)) % 60),
          hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
      
        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

    animate() {
        this.shadowBlur += this.dir;
        this.color = this.style.selectStyle;
        if (this.shadowBlur >= 30) {
            this.dir = -0.4;
        } else if (this.shadowBlur <= 1) {
            this.dir = +0.4;
        }
    }
}


//-------------------------------------------------------------------------------------------



//-------------------------------------------------------------------------------------------

function fitToContainer(canvas){
    canvas.style.width ='100%';
    canvas.style.height='100%';

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function setup() {
    currentNode = new Node(0, 0, 0);
    fitToContainer(canvas);
    for (let i = 0; i < 20; i++){
        nodes.push(new Node(Math.random()*700, Math.random()*700));
    }

    nodes.forEach(node => {
        const i = parseInt(Math.random() * nodes.length);
        const key = nodes[i].id;
        node.nodeIns[key] = nodes[i];
    })
    console.log(nodes)
}


function draw() {
    ctx.clearRect(0, 0, 2000, 2000)
    for (let i = 0; i < nodes.length; i++){
        nodes[i].update();
        nodes[i].display();
    }
    requestAnimationFrame(draw)
}

//-------------------------------------------------------------------------------------------

canvas.onmousedown = (e) => {
    let rect = canvas.getBoundingClientRect();
    mouse.savePos.x = e.pageX - rect.left;
    mouse.savePos.y = e.pageY - rect.top

    let n = false;

    for (let i = 0; i < nodes.length; i++) {
        if (mouse.returnLocation(nodes[i])){
            nodes[i].select();
            nodes[i].clicked = true;
            n = nodes[i];
            break;
        } else if (i === nodes.length - 1) { 
            screen.clicked = true;
        }
    }

    canvas.onmouseup = (e) => {
        if (n.clicked) { n.clicked = false }
        if (screen.clicked) { screen.clicked = false }
    }
}

canvas.onmousemove = (e) => {
    let rect = canvas.getBoundingClientRect();
    mouse.position.x = e.pageX - rect.left;
    mouse.position.y = e.pageY - rect.top;
    console.log(mouse.position.y)

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].clicked){
            nodes[i].drag();
        } else if (i === nodes.length - 1 && screen.clicked) { 
            screen.drag();
        }

        (mouse.returnLocation(nodes[i]) && !nodes[i].selected) ? nodes[i].highlight(true) : nodes[i].highlight(false)

    }
    
}

canvas.ondblclick = (e) => {
    //create first node
    if (nodes.length === 0) {
        screen.dblclicked();
    }

    for (let i=0; i < nodes.length; i++){
        if (mouse.returnLocation(nodes[i])){
            nodes[i].enterNode();
            break;
        } else if (i === nodes.length - 1) { 
            nodes.push(new Node(mouse.position.x, mouse.position.y));
            console.log(nodes.length)
            break;
        }
    }
}

window.onkeydown = (e) => {
    switch (e.key){
        case ("Delete"):
            for (let i=0; i < nodes.length; i++) {
                if (nodes[i].selected){
                    nodes[i].delete(i);
                }
            }
            break;
        case ("z"):
            screen.zoom(1);
            break;
        case ("x"):
            screen.zoom(0);
            break;
    }
}

setup();
draw();