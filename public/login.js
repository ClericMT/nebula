//import { loginUser } from "./modules/crud.js"

let user;

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

const userForm = document.getElementById('userform')
const passForm = document.getElementById('passform')
const loginBtn = document.getElementById('create')
const newUserBtn = document.getElementById('newuser')

localStorage.setItem("userDetails", false);
localStorage.setItem("userData", false);

loginBtn.onmouseup = (e) => {
    const userName = userForm.value;
    const userPass = passForm.value;
    loginUser(userName, userPass)
}

newUserBtn.onmouseup = (e) => {
    window.location.replace("/create")
}
