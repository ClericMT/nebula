import { drawNodes } from "/modules/canvas.js";
import { updateDBNodes, user, read } from "/modules/crud.js"
import { colours } from "/modules/styles.js"

let nodes = [];

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
    if (typeof nodesDB != undefined){
        for (let i = 0; i < nodesDB.length; i++){
            const node = nodesDB[i];
            addNode(
                node.id, node.name, node.info, node.x, node.y, false, [], colours.idle, node.time, false, 0
            )
        }
    }
    drawNodes();
}

const newNode = (x, y) => {
    updateDBNodes(nodes.length, "Name project: ", "Write description here...", x, y, false, [], colours.idle, 0, false, 0);
    addNode(nodes.length, "Name project: ", "Write description here...", x, y, false, [], colours.idle, 0, false, 0);
    drawNodes();
}

const selectNode = (x, y) => {
    const node = (isNodeClicked(x, y))
    if (typeof node !== "undefined"){
        node.io = ioSwitch(node);
        drawNodes();
    }
}

const ioSwitch = (node) => {
    return node.io ? false : true;
}

const isNodeClicked = (x, y) => {
    for (let i = 0; i < nodes.length; i++){
        let rad = 10;
        if (x > (nodes[i].x - rad) && x < (nodes[i].x + rad) && y > nodes[i].y - rad && y < nodes[i].y + rad){
            return (nodes[i])
        }
    }
}

export { newNode, nodes, loadNodes, selectNode }