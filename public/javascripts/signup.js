signinForm = document.querySelector('.signup-form')
signinForm.onsubmit = function (e) {
    e.preventDefault()
    username = signinForm.querySelector('[data-name]').value
    email = signinForm.querySelector('[data-email').value
    password = signinForm.querySelector('[data-password').value
    fetch("/signup", {
        method: "POST",
        body: JSON.stringify({
            name:username,
            email:email,
            password:password
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res=>{
        if(res.status==400){
            signinForm.querySelector('span').innerHTML="Email already exists."
        }else{
            window.location.replace('/home')
        }
    })
}