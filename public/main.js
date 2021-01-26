//create canvas
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');
fitToContainer(canvas);

function fitToContainer(canvas){
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

const titleElement = document.querySelector("#title");
const timeElement = document.querySelector("#time");
const infoElement = document.querySelector("#info");
const titleButton = document.querySelector("#title-button")
const deleteButton = document.querySelector("#delete-button")

//constants
const initRadius = 5;
let tMax;
let nodeSizer = 1000000;
//colour codes
const inactiveColour = '#0000FF', activeColour = '#33FFFF', hoverColour = '#40E0D0', lineColourOff = '#0000FF', lineColourOn = '#33FFFF', logTimeColour = '#ea0b0b'

//nodes and lines
let n = []
let l = []
let node;
let x;
let y;
let click = false;
let lastClick;
let lastNode;
let dragNode;




//
// CRUD
//

let nodeBox;
let headBox;
let timeBox;
let aTime;
let btnTime;

//shows data box when node is active
function box(node, io){
    let radius = initRadius + (node.time/nodeSizer);
    if (io == true){
        //Header
        headBox = document.createElement('div');
        headBox.style.position = 'absolute'
        headBox.style.padding = '10px'
        headBox.style.left = (`${node.x + radius + 50}px`)
        headBox.style.top = (`${node.y + radius - 60}px`)
        headBox.style.backgroundColor = '#120d33'
        headBox.style.width = '130px';
        headBox.style.fontSize = '14px'
        headBox.style.textAlign = 'center';
        headBox.innerHTML = (`${node.name}`)
        headBox.contentEditable = true;
        headBox.setAttribute('spellcheck', 'false');
        headBox.style.border = '2px solid blue';
        document.getElementById('to-do').appendChild(headBox)
        //Timer
        timeBox = document.createElement('div');
        timeBox.style.position = 'absolute'
        timeBox.style.padding = '2px'
        timeBox.style.left = (`${node.x + radius + 50}px`)
        timeBox.style.top = (`${node.y + radius - 22}px`)
        timeBox.style.backgroundColor = '#120d33'
        timeBox.style.width = '146px';
        timeBox.style.fontSize = '14px'
        timeBox.style.textAlign = 'center';
        timeBox.innerHTML = (`${msToTime(node.time)}`)
        timeBox.style.border = '2px solid blue';
        document.getElementById('to-do').appendChild(timeBox)
        //Main Section
        nodeBox = document.createElement('div');
        nodeBox.style.position = 'absolute';
        nodeBox.style.padding = '5px';
        nodeBox.style.float = 'left';
        nodeBox.style.left = (`${node.x + radius + 50}px`);
        nodeBox.style.top = (`${node.y + radius}px`);
        nodeBox.style.backgroundColor = '#120d33';
        nodeBox.style.width = '140px';
        nodeBox.style.height = '180px';
        nodeBox.style.fontSize = '12px'
        nodeBox.style.textAlign = 'left';
        nodeBox.innerHTML = (`${node.text}`);
        nodeBox.style.border = '2px solid blue';
        nodeBox.contentEditable = true;
        nodeBox.setAttribute('spellcheck', 'false');
        document.getElementById('to-do').appendChild(nodeBox);
        //add time
        aTime = document.createElement('div');
        aTime.style.position = 'absolute'
        aTime.style.padding = '2px'
        aTime.style.left = (`${node.x + radius + 50}px`)
        aTime.style.top = (`${node.y + radius + 192}px`)
        aTime.style.backgroundColor = '#120d33'
        aTime.style.width = '100px';
        aTime.style.fontSize = '14px'
        aTime.style.textAlign = 'center';
        aTime.contentEditable = true;
        aTime.setAttribute('spellcheck', 'false');
        aTime.innerHTML = ('(hh:mm:ss)')
        aTime.style.border = '2px solid blue';
        document.getElementById('to-do').appendChild(aTime)

        aTime.onclick = function(e) {
            aTime.innerHTML = ""
        }
        //add time
        btnTime = document.createElement('div');
        btnTime.style.position = 'absolute'
        btnTime.style.padding = '2px'
        btnTime.style.left = (`${node.x + radius + 156}px`)
        btnTime.style.top = (`${node.y + radius + 192}px`)
        btnTime.style.backgroundColor = '#120d33'
        btnTime.style.width = '40px';
        btnTime.style.fontSize = '14px'
        btnTime.style.textAlign = 'center';
        btnTime.innerHTML = (`+`)
        btnTime.style.border = '2px solid blue';
        btnTime.style.cursor = 'pointer';
        document.getElementById('to-do').appendChild(btnTime)

        btnTime.onmousedown = function(e) {
            additionalTime(node)
        }

        function additionalTime(node){
            const timeSplitArray = aTime.innerHTML.split(':');
            let addTime = (timeSplitArray[0] * 3600000) + (timeSplitArray[1] * 60000) + (timeSplitArray[2] * 1000)
            node.time = node.time + addTime;
            updateData(node);
            recurseTime(node, addTime);
        }
     
        
    } else if (io == false){
        node.text = nodeBox.innerHTML;
        node.name = headBox.innerHTML;
        
        updateData(node)
        document.getElementById('to-do').removeChild(headBox);
        document.getElementById('to-do').removeChild(timeBox);
        document.getElementById('to-do').removeChild(nodeBox);
        document.getElementById('to-do').removeChild(aTime);
        document.getElementById('to-do').removeChild(btnTime);
    }
}

function recurseTime(node, addTime){
    addTime = addTime;
    if (node.conns[0]){
        const nextNode = n.find( ({ id }) => id === node.conns[0] );
        nextNode.time += addTime;
        updateData(nextNode);
        recurseTime(nextNode, addTime);
    } 
  
}

function createData(node){
    fetch('/nodes', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            x: node.x,
            y: node.y,
            conns: node.conns,
            time: node.time,
            name: node.name
        })
    })
    .then (data => {
        window.location.reload();
    })
}

function readData(node){
    fetch('/nodes', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
        if (res.ok) return res.json() //if response ok convert response into json
    })
    .then(data => { //data is just the returned res.json() which is an array of nodes
        let d = data.nodes
        for(let i = 0; i < d.length; i++){
            addNode(d[i]._id, d[i].x, d[i].y, d[i].conns, d[i].time, d[i].name, d[i].text)
        }
    }) 
}

function deleteDataAll(){
    fetch('/nodes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
        if (res.ok) window.location.reload();
    })
}


//// NEED TO REMOVE NODE CONNECTION DATA
function deleteData(node){
    console.log(node.id)
    fetch('/nodes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { id: node.id } )
    })
    .then(res => {
        if (res.ok) window.location.reload();
    })
}

function readDataLast(node){
    fetch('/nodes', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        let d = data.nodes
        addNode(d._id, d.x, d.y, d.conns, d.time, d.name, d.text)
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
            time: node.time,
            name: node.name,
            text: node.text
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        console.log(data)
    })

}

function addNode(id, x, y, conns, time, name, text){
    n.push({
        id: id,
        x: x,
        y: y,
        conns: conns,
        colour: inactiveColour, 
        hover: false, 
        time: time, 
        timer: false, 
        startTime: 0,
        name: name,
        text: text
    })
}





  /* 
Restructured code. Easier to read.
Added hover feature.
*/



/*
    event listeners
*/

canvas.onmousedown = function(e) {
    click = true;
    isMouseDrag();
    canvas.addEventListener('mousemove', drag);
    canvas.onmouseup = function(e) {
        clicked();
        canvas.removeEventListener('mousemove', drag);
        dragClick = false;
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

window.addEventListener('keydown', function(event) { 
    const key = event.key; 
    switch(key){
        case "Delete":
            delNode();
            break;
        case "1":
            nodeSizer /= 1.5;
            break;
        case "2":
            nodeSizer *= 1.5;
            break;
    }
})

/*
    control functions
*/
function clicked(){
    console.log(n)
    //create first node
    if (typeof n[0] == 'undefined'){
        n.push({
            id: n.length, 
            io: false, 
            x: x, 
            y: y, 
            conns: [], 
            colour: inactiveColour, 
            hover: false, 
            time: 1000, 
            timer: false, 
            startTime: 0,
            name: 'Name Project: ',
            text: ""
        })
        createData(n[0])
        node = n[0]
    // add/remove node from selection
    } else if (node){
        for (let i = 0; i < n.length; i++){
            if (n[i].io == true && n[i] != node){
                n[i].io = false;
                box(n[i], false);
            }
        }
        console.log(node);
        lastClick = node;
        (node.io) ? node.io = false : node.io = true;
        node.io ? box(node, true) : box(node, false);
        node.hover = false;
    //creates new node
    } else if (!node){
        let conns = []
        for (let i = 0; i < n.length; i++){
            if (n[i].io){
                conns.push(n[i].id)
            }
        }
        
        n.push({id: n.length, io: false, x: x, y: y, conns: conns, colour: inactiveColour, hover: false, time: 1000, timer: false, startTime: 0, name: 'Name Project: '});
        createData(n[n.length - 1])
        node = n[n.length - 1]; //prevents dbl click errors
       
    }
}

function dblclicked(node){
        if (!node.timer){
            node.startTime = Date.now();
            node.timer = true;
            node.colour = logTimeColour;
            updateData(node)
        } else {
            const addTime = (Date.now() - node.startTime)
            node.time = node.time + addTime;
            node.timer = false;
            updateData(node);         
             //Updates all linked nodes with time logged       
            recurseTime(node, addTime);
            window.location.reload();

        }
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

function hover(){
    //is mouse over node
    for (let i = 0; i < n.length; i++){
        let rad = initRadius + (n[i].time/nodeSizer);
        if (x > (n[i].x - rad) && x < (n[i].x + rad) && y > n[i].y - rad && y < n[i].y + rad){
            node = n[i];
            node.hover = true

            break;
        } else if (node){
                node.hover = false;
                node = false;
        }
    }
}

function isMouseDrag(){
    //is mouse over node
    for (let i = 0; i < n.length; i++){
        let rad = initRadius + n[i].time/nodeSizer;
        if (x > (n[i].x - rad) && x < (n[i].x + rad) && y > n[i].y - rad && y < n[i].y + rad){
            dragClick = n[i];
        }
    }
}

function drag(){
    let radius = initRadius + (node.time/nodeSizer);
    if (dragClick){
        dragClick.x = x;
        dragClick.y = y;
        headBox.style.left = (`${node.x + node.radius + 50}px`);
        headBox.style.top = (`${node.y + node.radius - 50}px`);
        nodeBox.style.left = (`${node.x + node.radius + 50}px`);
        nodeBox.style.top = (`${node.y + node.radius}px`);
        document.getElementById('to-do').removeChild(headBox);
        document.getElementById('to-do').removeChild(timeBox);
        document.getElementById('to-do').removeChild(nodeBox);
        document.getElementById('to-do').removeChild(aTime);
        document.getElementById('to-do').removeChild(btnTime);
    }
}

function delNode(){
    for (let i = 0; i < n.length; i++){
        if (n[i].io){
            console.log(n[i])
            deleteData(n[i])
        }
    }
}

//
//  draw functions
//

function drawText(node){
    let radius = initRadius + (node.time/nodeSizer);
    if (node.hover || node.io){
        ctx.font = "30px Monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.name, node.x, (node.y + radius + 30));
    } 
}

function drawColours(node){
    node.timer ? node.colour = logTimeColour :
    node.hover ? node.colour = hoverColour :
    node.io ? node.colour = activeColour : node.colour = inactiveColour
    ctx.fillStyle = node.colour
}

function drawNodes(node){
    const radi = initRadius + (node.time/nodeSizer);
    if (node.x){
        ctx.beginPath();
        ctx.arc(node.x, node.y, radi, 0, 2 * Math.PI, false);
        ctx.fill()
    }
}

function drawLines(node){
    for (let j = 0; j < n.length; j++){
        for (let i = 0; i < n[j].conns.length; i++){
            if (node.id == n[j].conns[i]){
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(n[j].x, n[j].y);
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = 'purple';
                ctx.stroke();
            }
        }
    }
       
       
    

}

console.log(n)




//
// animate
//
function draw(){
    ctx.clearRect(0, 0, 2000, 2000);
    //nodes
    for (let i = 0; i < n.length; i++){
        let _node = n[i];
        drawLines(_node);
        drawColours(_node);
        drawNodes(_node);
        drawText(_node);
    };
    
    window.requestAnimationFrame(draw);
}

readData() //load current profile
draw()





