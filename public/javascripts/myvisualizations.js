cpp = document.querySelector(".workspace.cpp");
flowchartButtons = cpp.querySelectorAll(".options.flowchart");
pseudoButtons=cpp.querySelectorAll(".options.pseudo");
deleteButtons=cpp.querySelectorAll(".options.delete");
openButtons=cpp.querySelectorAll(".options.open");
console.log(flowchartButtons)
fetch('/sendcodecpp', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => {
    response.json().then(data => {
        console.log(data.codecpp)
        flowchartButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                id = button.parentElement.parentElement.querySelector('.id.value').value
                sessionStorage.setItem('codecpp', data.codecpp[id - 1].code)
                fetch('/flowchartproccpp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code: data.codecpp[id - 1].code })
                }).then(response => {
                    window.location.replace('/flowchartcpp')
                })
            });
        })
        pseudoButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                id = button.parentElement.parentElement.querySelector('.id.value').value
                sessionStorage.setItem('codecpp', data.codecpp[id - 1].code)
                fetch('/pseudoproccpp', {
                    method: 'POST',
                    headers: {  
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code: data.codecpp[id - 1].code })
                }).then(response => {
                    window.location.replace('/pseudocodecpp')
                })
            });
        })
        console.log(deleteButtons)
        deleteButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                id = button.parentElement.parentElement.querySelector('.id.value').value
                fetch('/deletecodecpp', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data.codecpp[id-1])
                }).then(()=>{
                    window.location.replace('/myvisualizations')
                })
            });
        })
        openButtons.forEach((button,index)=>{
            button.addEventListener('click',()=>{
                id = button.parentElement.parentElement.querySelector('.id.value').value
                sessionStorage.setItem('codecpp', data.codecpp[id - 1].code)
                window.location.replace('/visualizercpp')
            })
        })
    })
})