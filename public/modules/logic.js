import { drawNodes } from "/modules/canvas.js";
import { updateDBNodes, user, read, deleteDBNode, updateDBNodeTime } from "/modules/crud.js"
import { colours } from "/modules/styles.js"
import { infoBox } from "/modules/dynamic-content.js"
import { animateNode } from "/modules/canvas.js"

let nodes = [];
let timerList = [];

const addNode = (id, name, info, x, y, io, conns, colour, time, timer, startTimer) => {
    nodes.push(
        {
            id: id,
            name: name,
            info: info,
            x: x,
            y: y,
            io: io,
            conns: conns,
            colour: colour,
            time: time,
            timer: timer,
            startTimer: startTimer
        }
    )
}

const loadNodes = (nodesDB) => {
    if (typeof nodesDB !== "undefined"){
        for (let i = 0; i < nodesDB.length; i++){
            const node = nodesDB[i];
            addNode(
                node.id, node.name, node.info, node.x, node.y, false, [], colours.idle, node.time, false, 0
            )
        }
    }
    drawNodes();
}

const generateID = () => {
    return parseInt(Math.random() * 10000000000000);
}

const newNode = (x, y) => {
    if (!isNodeClicked(x, y)){
        const node = {
            id: generateID(), 
            name: "Name project: ", 
            text: "Write description here...", 
            x: x, 
            y: y, 
            io: false, 
            conns: [], 
            colour: colours.idle, 
            time: 0, 
            timer: false, 
            startTime: 0  
        }
        updateDBNodes(node);
        addNode(node.id, "Name project: ", "Write description here...", x, y, false, [], colours.idle, 0, false, 0);
        drawNodes();
    }
}

const selectNode = (x, y) => {
    const node = (isNodeClicked(x, y));
    if (node){
        console.log("id: ", node.id);
        console.log("length: ", nodes.length);
        node.io = ioSwitch(node);
        console.log(node.io)
        node.io ? infoBox(node, true) : infoBox(node, false)
        drawNodes();
    }
}

const ioSwitch = (node) => {
    return node.io ? false : true;
}

const timerSwitch = (node) => {
    return node.timer ? false : true;
}

const isNodeClicked = (x, y) => {
    for (let i = 0; i < nodes.length; i++){
        let rad = 10;
        if (typeof nodes[i] !== "undefined"){
            if (x > (nodes[i].x - rad) && x < (nodes[i].x + rad) && y > nodes[i].y - rad && y < nodes[i].y + rad){
                return (nodes[i])
            }
        }
    }
}

const deleteNodes = () => {
    for (let i = 0; i < nodes.length; i++){
        if (typeof nodes[i] !== "undefined"){
            if (nodes[i].io){
                deleteDBNode(nodes[i]);
                delete nodes[i];
                drawNodes();
            }
        }
    }
}

const logTime = (node) => {
    node.timer = timerSwitch(node);
    if (node.timer === true){
        node.startTime = Date.now();
        drawNodes();
        timerList.push({node: node, glow: 0, up: true});
        animateNode();
    } else {
        node.time += Date.now() - node.startTime;
        console.log(node.time);
        timerList = [];
        nodes.forEach(node => {
            if (node.timer){
                timerList.push({node: node, glow: 0, up: true})
            }
        })
        drawNodes();
        updateDBNodeTime(node);
    }
}

const hover = (x, y) => {
    if (isNodeClicked(x, y)){
        const node = isNodeClicked(x, y);
        node.hover = true;
        drawNodes();
    } else nodes.forEach(node => {
        node.hover = false;
        drawNodes();
    })
}

export { newNode, nodes, loadNodes, selectNode, deleteNodes, isNodeClicked, logTime, timerList, hover }