import { deleteDBNode } from "/modules/crud.js";
import { updateDBNodes } from "/modules/crud.js";
import { msToTime } from "/modules/time.js"

let infoHeader;

//A node's descriptive box 
const infoBox = (node, io) => {
    let boxTop, boxTitle, thisID;
    for (let i = 0; i < 3; i++){
        if (i === 0){
            boxTop = (`${node.y + 10 - 60}px`);
            boxTitle = (`${node.name}`);
            thisID = 'header'
        } else if (i === 1){
            boxTop = (`${node.y - 11}px`);
            boxTitle = (`${node.text}`);
            thisID = 'main'
        } else if (i === 2){
            boxTop = (`${node.y + 10 + 42}px`);
            boxTitle = (`${msToTime(node.time)}`);
            thisID = 'footer'
        }
        if (io){
            infoHeader = document.createElement('div');
            infoHeader.id = thisID
            infoHeader.classList.add('infobox');
            infoHeader.style.left = (`${node.x + 10 + 50}px`);
            infoHeader.style.top = boxTop;
            infoHeader.innerHTML = boxTitle
            infoHeader.contentEditable = true;
            infoHeader.setAttribute('spellcheck', 'false');
            document.getElementById('main-display').appendChild(infoHeader);
        } else {
            switch (i){
                case 0:
                    node.name = document.getElementById('header').innerHTML;
                    node.text = document.getElementById('main').innerHTML;
                    document.getElementById('header').parentNode.removeChild(document.getElementById('header'));
                    document.getElementById('main').parentNode.removeChild(document.getElementById('main'));
                    document.getElementById('footer').parentNode.removeChild(document.getElementById('footer'));
                    break;
            }
        }
    }
}

export { infoBox }