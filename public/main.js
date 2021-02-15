import { newNode, selectNode, deleteNodes, isNodeClicked, logTime, hover } from "./modules/logic.js"
import { read } from "/modules/crud.js"

const canvas = document.getElementById('node-layer')

// Event Listeners

//Create node
canvas.ondblclick = (e) => {
    let rect = canvas.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    const node = isNodeClicked(x, y);
    (node) ? logTime(node) : newNode(x, y);
}

canvas.onmouseup = (e) => {
    let rect = canvas.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    selectNode(x, y);
}

canvas.onmousemove = function(e) {
    let rect = canvas.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    hover(x, y);
}

window.onkeydown = (e) => {
    switch (e.key){
        case ("Delete"):
            deleteNodes();
    }
}

// Call
read();

