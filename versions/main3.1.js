const createButton = document.querySelector('#create-node')
const updateButton = document.querySelector('#update-node')
const deleteButton = document.querySelector('#delete-node')
const readButton = document.querySelector('#read-nodes')
const submitBox = document.querySelector('#submit-node')

submitBox.width = window.innerWidth;



//constants
const initRadius = 5

//colour codes
const inactiveColour = '#0000FF', activeColour = '#33FFFF', hoverColour = '#40E0D0', lineColourOff = '#0000FF', lineColourOn = '#33FFFF', logTimeColour = '#ea0b0b'

//nodes and lines
let n = []
let l = []
let node;
let x;
let y;
let click = false;

createButton.addEventListener('click', _ => {
    fetch('/nodes', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            node: 'hullo' //What to create
        })
    })
})

readButton.addEventListener('click', _ => {
    fetch('/nodes', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        let d = data.nodes
        for(let i = 0; i < d.length; i++){
            console.log(d[i])
        }
    })   
})

updateButton.addEventListener('click', _ => {
    updateData(n[0])
})

deleteButton.addEventListener('click', _ => {
    fetch('/nodes', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        window.location.reload()
    })
  })

//
// CRUD
//

function createData(node){
    fetch('/nodes', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            x: node.x,
            y: node.y,
            radius: node.radius,
            conns: node.conns,
            time: node.time,
            name: node.name
        })
    })
}

function readData(node){
    fetch('/nodes', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        let d = data.nodes
        for(let i = 0; i < d.length; i++){
            addNode(d[i]._id, d[i].x, d[i].y, d[i].radius, d[i].conns, d[i].time, d[i].name)
        }
    })   
}

function updateData(node){
    fetch('/nodes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' }, //tells server this is a json file
        body: JSON.stringify({
            id: node.id,
            x: node.x,
            y: node.y,
            radius: node.radius,
            time: node.time,
            name: node.name
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        console.log(data)
    })

}

function addNode(id, x, y, radius, conns, time, name){
    n.push({
        id: id,
        x: x,
        y: y,
        radius: radius,
        conns: conns,
        colour: inactiveColour, 
        hover: false, 
        time: time, 
        timer: false, 
        startTime: 0,
        name: name
    })
}



  /* 
Restructured code. Easier to read.
Added hover feature.
*/

//create canvas
const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');



/*
    event listeners
*/
canvas.onmousedown = function(e) {
    click = true;
    clicked();
    canvas.addEventListener('mousemove', drag);
    canvas.onmouseup = function(e) {
        updateData(node);
        canvas.removeEventListener('mousemove', drag);

    }
}

canvas.onmousemove = function(e) {
    let rect = canvas.getBoundingClientRect();
    x = e.pageX - rect.left;
    y = e.pageY - rect.top;
    hover();
}

canvas.ondblclick = function(e) {
    dblclicked(node);
}

/*
    control functions
*/
function clicked(){
    //create first node
    if (typeof n[0] == 'undefined'){
        n.push({
            id: n.length, 
            io: false, 
            x: x, 
            y: y, 
            radius: initRadius, 
            conns: [], 
            colour: inactiveColour, 
            hover: false, 
            time: 0, 
            timer: false, 
            startTime: 0});
            name: 'Name Project: '
        createData(n[0])
        node = n[0]
    // add/remove node from selection
    } else if (node){
        (node.io) ? node.io = false : node.io = true;
        node.hover = false;
    //creates new node
    } else if (!node){
        let conns = []
        for (let i = 0; i < n.length; i++){
            if (n[i].io){
                conns.push(n[i].id)
            }
        }
        
        n.push({id: n.length, io: false, x: x, y: y, radius: initRadius, conns: conns, colour: inactiveColour, hover: false, time: 0, timer: false, startTime: 0, name: 'Name Project: '});
        createData(n[n.length - 1])
        node = n[n.length - 1]; //prevents dbl click errors
        window.location.reload(); 
    }
}

function dblclicked(node){
        if (!node.timer){
            node.startTime = Date.now();
            node.timer = true;
            node.colour = logTimeColour;
            updateData(node)
        } else {
            node.time = node.time + (Date.now() - node.startTime);
            node.startTime = 0;
            node.timer = false;
            node.radius += node.time/1000; //Need to add global mediation formula
            updateData(node);
        }
}

function hover(){
    //is mouse over node
    for (let i = 0; i < n.length; i++){
        if (x > (n[i].x - n[i].radius) && x < (n[i].x + n[i].radius) && y > n[i].y - n[i].radius && y < n[i].y + n[i].radius){
            node = n[i];
            node.hover = true
            submitBox.style.visibility = "visible"
            break;
        } else if (node){
                node.hover = false;
                node = false;
                submitBox.style.visibility = "hidden"
        }
    }
}

function drag(){
    if (node){
        node.x = x;
        node.y = y;
    }
}

//
//  draw functions
//
function drawText(node){
    if (node.hover || node.io){
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(node.name, node.x, (node.y + node.radius + 30));
    }
}

function drawColours(node){
    node.timer ? ctx.fillStyle = logTimeColour :
    node.hover ? ctx.fillStyle = hoverColour :
    node.io ? ctx.fillStyle = activeColour : ctx.fillStyle = inactiveColour
}

function drawNodes(node){
    if (node.timer){
        
    }
    if (node.x){
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI, false);
        ctx.fill()
    }
}

//
// animate
//
function draw(){
    ctx.clearRect(0, 0, 2000, 2000);
    //nodes
    for (let i = 0; i < n.length; i++){
        let _node = n[i];
        drawColours(_node);
        drawNodes(_node);
        drawText(_node);
    };
    
    window.requestAnimationFrame(draw);
}

readData() //load current profile
draw()




