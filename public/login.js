console.log('hi')

document.getElementById('create').onclick = (e) =>{
    const userName = 'ClericMT';
    const userPass = 'St4rw4rs';
    console.log(userName, userPass)
    loginCheck(userName, userPass)
}

const loginCheck = (userName, userPass) => {
    fetch('/users', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })  
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(data => {
            for (let i = 0; i < data.results; i++){
                if (data.results[i].userName == userName && data.results[i].userPass == userPass){
                    console.log('success')
                }
            }
        })  
}