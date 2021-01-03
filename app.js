
//create canvas
const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

//constants
const initRadius = 20
const inactiveColour = 'blue'
const activeColour = 'aqua'
const logHoursColour = 'green'

//nodes
let n = []

//map mouse coordinates on click
canvas.onclick = function(e) {
    const x = e.pageX;
    const y = e.pageY;
    evaluate(x,y);
    console.log(n)
    draw();
}

//turns node on
function nodeOn(index){
    n[index].io = true;
    n[index].colour = activeColour;
}

function nodeOff(index){
    n[index].io = false;
    n[index].colour = inactiveColour;
}

function nodeCreate(x, y){
    n.push({id: n.length, io: false, x: x, y: y, radius: initRadius, colour: inactiveColour, logger: false});
}

function evaluate(x, y){
    //do any nodes exist? create one : check clicked node's status
    typeof n[0] !== 'undefined' ? check(x, y) : n.push({id: n.length, io: false, x: x, y: y, radius: initRadius, colour: inactiveColour, logger: false})

    //clicks on node
    function check(x, y) {
        let i = 0
        for (i = 0; i < n.length; i++){
            //range
            function clickedNode() {
                let minX = (n[i].x - n[i].radius);
                let maxX = (n[i].x + n[i].radius);
                let minY = (n[i].y - n[i].radius);
                let maxY = (n[i].y + n[i].radius);
                if (minX < x && maxX > x && minY < y && maxY > y){
                    return true;
                } else {return false}
            }
            //checks if node is on, off or doesn't exist at click coordinates
            if (clickedNode() && n[i].io == false){
                nodeOn(i);
                break;
            } else if (clickedNode() && n[i].io == true) {
                nodeOff(i);
                break;
            } else if (clickedNode()) {
                break;
            } else if (i == n.length - 1){
                nodeCreate(x, y);
                break;
            }
        }
    }
}

function draw() {
    const ctx = canvas.getContext('2d');
    let i = 0

    for (i = 0; i < n.length; i++){
        ctx.beginPath();
        ctx.arc(n[i].x, n[i].y, n[i].radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = n[i].colour;
        ctx.fill()
    }
    

}