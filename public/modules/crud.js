import { loadNodes } from "/modules/logic.js"

let user;  

const updateUser = (newUser) => {
    user = newUser;
}

updateUser(JSON.parse(localStorage.getItem("user")))

const createUser = (userName, userPass) => {
    fetch('/users', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            { 
                name: user.name,
                user_details : {
                    username: userName,
                    userpass: userPass
                },  
                user_data: {
                    nodes: [],
                    style: {},
                    timestamps: []
                
                }
            })
    })
    .then(next => {
        window.location.replace("/login")
    })  
}

const read = () => { 
    fetch('/users', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })  
        .then(res => {
            if (res.ok) return res.json();

        })
        .then(data => {
            findUserData(data)
        }) 
        .then(exc => {
            loadNodes(user.nodes)
        })
        .catch(error => console.log(error))
}

const findUserData = (data) => {
    for (let i = 0; i < data.users.length; i++){
        if (data.users[i].user_details.username === user.name) {
                localStorage.setItem("user", JSON.stringify(data.users[i]));
                user = JSON.parse(localStorage.getItem("user"));
                updateUser(user);
                break; 
        }
    }
}


const ifUserExists = (userName, userPass) => {
    fetch('/users', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })  
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(data => {
            if (data.users.length === 0){
                createUser(userName, userPass)
            }
            for (let i = 0; i < data.users.length; i++){
                if (userName.length === 0){
                    alert("Enter User Name");
                    break;
                }
                else if (userPass.length < 8){
                    alert("Password must be at least 8 characters.");
                    break;
                }
                else if (data.users[i].user_details.username === userName){
                    alert("This username is already taken.");
                    break;
                } else if (i === data.users.length - 1){
                    createUser(userName, userPass)
                }
            }
        })  
}

function updateDBNodes(node) {
    console.log(arguments[0].name)
    fetch('/nodes', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(
            {
                username: user.name,
                id: node.id,
                name: node.name,
                info: node.info,
                x: node.x,
                y: node.y,
                io: node.io,
                conns: node.conns,
                colour: node.colour,
                time: node.time,
                timer: node.timer,
                startTimer: node.startTimer
            })
    })
}

function updateDBNodeTime(node){
    console.log(node.id)
    fetch('/time', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(
            {
                username: user.name,
                id: node.id,
                time: node.time
            })
    })
}

function deleteDBNode(node) {
    fetch('/nodes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(
            {
                username: user.name,
                id: node.id
            })
    })
}

export { user, createUser, ifUserExists, updateDBNodes, read, deleteDBNode, updateDBNodeTime }