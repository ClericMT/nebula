import { drawNodes } from "/modules/canvas.js";
import { createNode, user, readUser } from "/modules/crud.js"
import { colours } from "/modules/styles.js"

let nodes = [];

const init = () => {
    if (user.name === ""){
        window.location.replace("/login")
    }
    readUser();
    if (typeof user.nodes != undefined){
        for (let i = 0; i < user.nodes.length; i++){
            loadNode(user.nodes[i])
        }
    }
}

const loadNode = (node) => {
    const readNode = {
        id: node.id,
        name: node.name,
        info: node.info,
        x: node.x,
        y: node.y,
        io: false,
        conns: [],
        colour: colours.idle,
        time: node.time,
        timer: false,
        startTimer: 0
    }
    nodes.push(readNode);
    drawNodes();
}

const newNode = (x, y) => {
    const node = {
        id: nodes.length,
        name: "Name project: ",
        info: "Write description here...",
        x: x,
        y: y,
        io: false,
        conns: [],
        colour: colours.idle,
        time: 0,
        timer: false,
        startTimer: 0
    }
    nodes.push(node);
    drawNodes();
    createNode(node);
}

export { newNode, init, nodes }