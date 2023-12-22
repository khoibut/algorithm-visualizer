form = document.querySelector('.login-form')
form.onsubmit = function (e) {
    console.log("hello")
    e.preventDefault()
    email = form.querySelector('[data-email').value
    password = form.querySelector('[data-password').value
    fetch("/login", {
        method: "POST",
        body: JSON.stringify({
            email:email,
            password:password
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(res=>{
        if(res.status==400){
            console.log('nahdog')
            form.querySelector('span').innerHTML="Wrong Email or Password."
        }else{
            window.location.replace('/home')
        }
    })
}