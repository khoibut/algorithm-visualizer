express = require('express')
fs = require('fs')
const { exec } = require('child_process')
app = express()
path = require('path')
bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.listen("3692")
app.use(express.json())
app.get('/', (req, res) => {
    res.redirect("/Home")
})
app.get('/Home', (req, res) => {
    res.send("Home")
})
app.get('/Visualizer', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})
app.get('/My%20Visualization', (req, res) => {
    res.send("My Visualization")
})
app.get('/Register', (req, res) => {
    res.send("Register")
})
app.get('/Login', (req, res) => {
    res.send("Login")
})
app.post('/Visualizer', (req, res) => {
    fs.unlink('code.cpp', (err) => {
        if (err) return;
    })
    exec(path.join(__dirname, 'cpp', 'formatter', 'clang-format.exe') + ' --style=Chromium -i ' + 'code.cpp', (err, stdout, stderr) => {
        if (err) return;
    })
    fs.appendFile('code.cpp', req.body.code, (err) => {
        if (err) return;
        exec('g++ code.cpp', (err, stdout, stderr) => {
            if (err) {
                res.send(err.message)
                return
            } else if (stderr) {
                console.log("sack")
                return
            } else {
                exec('a.exe', (err, stdout, stderr) => {
                    if (err) { console.log(err) }
                    if (stderr) { return }
                    console.log(stdout)
                    res.send(stdout)
                })
                exec(path.join(__dirname, 'visualizer', 'cxx2flow.exe') + ' code.cpp -o code.dot', (err, stderr, stdout) => {
                    if (err) console.log(err)
                    if (stderr) console.log(stderr)
                    exec(path.join(__dirname, 'visualizer', 'Graphviz', 'bin', 'dot.exe') + ' -Tpng -o code.png code.dot', (err, stderr, stdout) => {
                        if(err) console.log(err)
                        if(stderr) console.log(stderr)
                    })
                })
            }
        })
    })
})
app.get('/*', (req, res) => {
    res.send(__dirname)
})