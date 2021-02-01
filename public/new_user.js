import { ifUserExists } from "./modules/crud.js"

const userForm = document.getElementById('userform')
const passForm = document.getElementById('passform')
const createUsrBtn = document.getElementById('create')

createUsrBtn.onmouseup = (e) => {
    const userName = userForm.value;
    const userPass = passForm.value;
    ifUserExists(userName, userPass)
}