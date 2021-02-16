import { updateDBNodeBox } from "/modules/crud.js";
import { msToTime } from "/modules/time.js";

const initRadius = 5;
let tMax;
let nodeSizer = 1000000;

let nodeBox;
let headBox;
let timeBox;
let aTime;
let btnTime;

//shows data box when node is active
function infoBox(node, io){
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
        headBox.style.zIndex = "3";
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
        timeBox.style.zIndex = "3";
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
        nodeBox.innerHTML = (`${node.info}`);
        nodeBox.style.border = '2px solid blue';
        nodeBox.style.zIndex = "3";
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
        aTime.style.zIndex = "3";
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
        nodeBox.style.zIndex = "3";
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
        node.info = nodeBox.innerHTML;
        node.name = headBox.innerHTML;
        
        updateDBNodeBox(node)
        document.getElementById('to-do').removeChild(headBox);
        document.getElementById('to-do').removeChild(timeBox);
        document.getElementById('to-do').removeChild(nodeBox);
        document.getElementById('to-do').removeChild(aTime);
        document.getElementById('to-do').removeChild(btnTime);
    }
}

export { infoBox }