import { init, newNode } from "./modules/logic.js"

const canvas = document.getElementById('node-layer')

// Event Listeners

//Create node
canvas.ondblclick = (e) => {
    let rect = canvas.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    newNode(x, y);
}

setCookie("j","hiii",5);
console.log(getCookie("j"))

// Call
init();


