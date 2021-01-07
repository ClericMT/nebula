//create canvas
const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//constants
const initRadius = 15

//colour codes
const inactiveColour = '#0000FF', activeColour = '#33FFFF', logHoursColour = '#40E0D0', lineColourOff = '#0000FF', lineColourOn = '#33FFFF'

//nodes and lines
let n = []
let l = []

//map mouse coordinates on click
canvas.onmousedown = function(e) { //Surely i can compile this better???
    let ctrl = false, alt = false
    if (e.ctrlKey){
        ctrl = true;
    }
    if (e.altKey){
        alt = true;
    }
    let rect = canvas.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    nodeClicked(x, y, ctrl, alt);
    draw();
}

//turns node on, off
function nodeOn(index){
    let i = 0;
    n[index].io = true;
    n[index].colour = activeColour;
    if (typeof l[0] !== 'undefined'){
        for (i = 0; i < l.length; i++){
            if (n[index].x == l[i].x1){
                l[i].colour = lineColourOn
            }
        }
    }
}

function nodeOff(index){
    n[index].io = false;
    n[index].colour = inactiveColour;
}

//creates new node and appends connections/connections with other nodes
function nodeCreate(x, y){
    let i = 0
    let connections = []
    for (i = 0; i < n.length; i++){
        if (n[i].io){
            connections.push(n[i].id) //connections for new node
            n[i].connections.push(n.length) //connections for active nodes
            l.push({x1: n[i].x, y1: n[i].y, x2: x, y2: y, colour: lineColourOff})
        }
    }
    n.push({id: n.length, io: false, x: x, y: y, radius: initRadius, colour: inactiveColour, logger: false, connections: connections});

}

//connects active nodes to ctrl-clicked node
function nodeConnect(index){
    let i = 0;
    for (i = 0; i < n.length; i++){
        if (n[i].io == true){
            n[i].connections.push(n[index].id)
            n[index].connections.push(n[i].id)
        }
    }
}

//Need to fix line deletion and repeat of lines
function nodeDelete(index){
    n.splice(index,index)
    let i = 0;
    let j = 0;
    for (i = 0; i < n.length; i++){
        for (j = 0; j < l.length; j++){
            if (n[i].x == l[j].x1 || n[i].x == l[j].x2){
                l.splice(j,j)
            }
        }
    }
}

function nodeClicked(x, y, ctrl, alt){
    //do any nodes exist? create one : check clicked node's status
    typeof n[0] !== 'undefined' ? check(x, y) : n.push({id: n.length, io: false, x: x, y: y, radius: initRadius, colour: inactiveColour, logger: false, connections: []})

    //clicks on node
    function check(x, y) {
        let i = 0
        for (i = 0; i < n.length; i++){
            //determines if node has been clicked
            function isNodeClicked() {
                let minX = (n[i].x - n[i].radius);
                let maxX = (n[i].x + n[i].radius);
                let minY = (n[i].y - n[i].radius);
                let maxY = (n[i].y + n[i].radius);
                if (minX < x && maxX > x && minY < y && maxY > y){
                    return true;
                } else {return false}
            }
            //ACTIONS
            //Connect
            if (isNodeClicked() && n[i].io == false && ctrl == true){
                nodeConnect(i);
                nodeOn(i);
                break;
            }
            //Delete
            else if (isNodeClicked() && alt == true){
                nodeDelete(i);
                break;
            //Activate
            } else if (isNodeClicked() && n[i].io == false){
                nodeOn(i);
                break;
            //Deactivate
            } else if (isNodeClicked() && n[i].io == true) {
                nodeOff(i);
                break;
            //Continue iteration
            } else if (isNodeClicked()) {
                break;
            //Create node if none detected at click.coords
            } else if (i == n.length - 1){
                nodeCreate(x, y);
                break;
            }
        }
    }
}

//draws nodes and lines
function draw() {
    console.log(l)
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,2000,2000)
    let i = 0;
    let j = 0;
    //lines
    for (j = 0; j < l.length; j++){
        ctx.beginPath();
        ctx.moveTo(l[j].x1, l[j].y1);
        ctx.lineTo(l[j].x2, l[j].y2);
        ctx.strokeStyle = l[j].colour;
        ctx.stroke();
    }
    //nodes
    for (i = 0; i < n.length; i++){
        ctx.beginPath();
        ctx.arc(n[i].x, n[i].y, n[i].radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = n[i].colour;
        ctx.fill()
    }
}