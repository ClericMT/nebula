let user = localStorage.getItem("user");
let jsonUser = JSON.parse(user);
const userName = jsonUser.name;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

const readUser = () => {
    
    fetch('/users', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })  
        .then(res => {
            if (res.ok) return res.json();

        })
        .then(data => {
            for (let i = 0; i < data.users.length; i++){
                if (data.users[i].user_details.username === jsonUser.name) {
                        localStorage.setItem("user", JSON.stringify(data.users[i]));
                        user = localStorage.getItem("user");
                        jsonUser = JSON.parse(user);
                        break; 
                }
            }
        })  
}

const loginUser = (userName, userPass) => {
    fetch('/users', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })  
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(data => {
            for (let i = 0; i < data.users.length; i++){
                if (data.users[i].user_details.username === userName &&
                    data.users[i].user_details.userpass === userPass){
                        localStorage.setItem("user", JSON.stringify(data.users[i]));
                        user = localStorage.getItem("user");
                        window.location.replace("/"); 
                        break; 
                } else if (i === data.users.length - 1){
                    {alert("User not found or incorrect password.");}
                }
            }
        })  
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

const createUser = (userName, userPass) => {
    fetch('/users', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            { 
                name: userName,
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

const createNode = (node) => {
    fetch('/nodes', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(
            {
                username: userName,
                id: node.id,
                x: node.x,
                y: node.y,
                time: node.time,
                name: node.name,
                info: node.info,
                text: node.text
            })
    })
    .then(next => {
        window.location.replace("/")
    })
}

const updateData = (node) => {
    fetch('/users', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' }, //tells server this is a json file
        body: JSON.stringify({
            id: node.id,
            x: node.x,
            y: node.y,
            time: node.time,
            name: node.name,
            text: node.text
        })
        .then(res => {
        if (res.ok) return res.json()
    })
    })
}

export { loginUser, jsonUser as user, createUser, ifUserExists, createNode, readUser }