import { newNode, selectNode } from "./modules/logic.js"
import { read } from "/modules/crud.js"

const canvas = document.getElementById('node-layer')

// Event Listeners

//Create node
canvas.ondblclick = (e) => {
    let rect = canvas.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    newNode(x, y);
}

canvas.onmouseup = (e) => {
    let rect = canvas.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    selectNode(x, y);
}

// Call
read();


