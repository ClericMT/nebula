import { loginUser } from "./modules/crud.js"

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
