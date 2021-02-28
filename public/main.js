const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let nodes = []

let mouse = {
    x: 0,
    y: 0,
    returnLocation: function(n) {
        if (this.x > (n.x - n.radius) && this.x < (n.x + n.radius) && this.y > n.y - n.radius && this.y < n.y + n.radius){
            return true;
        } else return false;  
    },
};

let screen = {
    clicked: function() {
        return
    },
    drag: function() {
        return
    },
    dblclicked: function() {
        nodes.push(new Node(mouse.x, mouse.y))
    }
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = parseInt(Math.random()*1000000);
        this.style = styles[1];
        this.color = this.style.fillStyle;
        this.shadowBlur = 0
        this.selected = false;
        this.timer = false;
        this.time = 0;
        this.radius = 10;
        this.dir = 1;
        this.parentNodes = [];
    }

    update() {
        if (this.timer) {
            this.animate();
        }
        this.radius = this.time/1000 + 10
    }

    display() {
        //lines between nodes
        if (typeof this.parentNodes !== "undefined"){
            this.parentNodes.forEach(node => {
                ctx.strokeStyle = this.style.lineStyle;
                ctx.lineWidth = this.style.lineWidth;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(node.x, node.y);
                ctx.stroke();
            })
        }

        ctx.lineWidth = this.style.outlineWidth;
        ctx.strokeStyle = this.style.strokeStyle;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.shadowColor = this.style.shadowColor;
        ctx.shadowBlur = this.shadowBlur;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
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
        this.x = mouse.x;
        this.y = mouse.y;
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

    delete(i) {
        //remove connections also
        nodes.forEach(node => {
            if (node.parentNodes.includes(nodes[i])){
                let index = node.parentNodes.indexOf(nodes[i]);
                console.log(index)
                node.parentNodes.splice(index, index);
            }
        })
        nodes.splice(i, i);
    }
}

const styles = {
    1: {
        fillStyle: "blue",
        strokeStyle: "black",
        outlineWidth: 1,
        lineWidth: 1.5,
        lineStyle: "purple",
        highlightStyle: "aqua",
        selectStyle: "aqua",
        shadowColor: "aqua",
        shadowBlur: 0
    }
}

//-------------------------------------------------------------------------------------------

function fitToContainer(canvas){
    canvas.style.width ='100%';
    canvas.style.height='100%';

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function setup() {
    fitToContainer(canvas);

    for (let i = 0; i < 20; i++){
        nodes.push(new Node(Math.random()*700, Math.random()*700))
    }

    nodes.forEach(node => {
        const i = parseInt(Math.random() * nodes.length);
        node.parentNodes.push(nodes[i]);
    }) 
}

function draw() {
    ctx.clearRect(0, 0, 2000, 2000);

    nodes.forEach(node => {
        node.update();
        node.display();
    })

    window.requestAnimationFrame(draw)
}

//-------------------------------------------------------------------------------------------

canvas.onmousedown = (e) => {
    let n = false;

    nodes.forEach(node => {
        if (mouse.returnLocation(node)){
            node.select();
            node.clicked = true;
            n = node;
        } else { screen.clicked() }
    });

    canvas.onmouseup = (e) => {
        if (n.clicked) {n.clicked = false;}
    }
}

canvas.onmousemove = (e) => {
    let rect = canvas.getBoundingClientRect();
    mouse.x = e.pageX - rect.left;
    mouse.y = e.pageY - rect.top;

    nodes.forEach(node => {
        node.clicked ? node.drag() : screen.drag();
        (mouse.returnLocation(node) && !node.selected) ? node.highlight(true) : node.highlight(false)
    });
    
}

canvas.ondblclick = (e) => {
    for (let i=0; i < nodes.length; i++){
        if (mouse.returnLocation(nodes[i])){
            nodes[i].timer ? nodes[i].timerIO(false) : nodes[i].timerIO(true);
            break;
        } else if (i === nodes.length - 1) { 
            screen.dblclicked()
            nodes[nodes.length].timerIO(false); //causes console error;
        }
    }
}

window.onkeydown = (e) => {
    switch (e.key){
        case ("Delete"):
            for (let i=0; i < nodes.length; i++){
                if (nodes[i].selected){
                    nodes[i].delete(i);
            }
        }
    }
}

setup();
draw();