var express = require('express');
var router = express.Router();
const { exec } = require('child_process');
const { compile } = require('../controller/compile.js')
const { reformat } = require('../controller/reformatgraph.js')
const path = require('path');
const { pseudofy } = require('../controller/pseudo.js')
const sessions = require('express-session')
const oneDay = 1000 * 60 * 60 * 24;
const { ifCorrect, ifExist,addCode } = require('../controller/user.js')
router.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false,
  errorMessageCPP: '',
  errorMessagePy: '',
  pseudoCPP: '',
  pseudoPY: ''
}))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect("/home")
});
router.get('/home', function (req, res) {
  console.log(req.session.user)
  if (req.session.user) {
    res.render('home.ejs', { loggedin: req.session.user })
  } else {
    res.render('home.ejs', { loggedin: '<li><a href="createaccount" class="account">Login</a></li><li><a href="createaccount" class="account">Register</a></li>' })
  }
})
router.get('/visualizercpp', (req, res) => {
  if (req.session.user) {
    res.render('visualizercpp.ejs', { loggedin:req.session.user+'<input data-user hidden value='+req.session.user+'>', error: req.session.errorMessageCPP })
  } else {
    res.render('visualizercpp.ejs', {
      loggedin:
        `
    <div class="Login">
    <a href="createaccount"> Login </a>
</div>

<div class="Register">
    <a href=""createaccount> Register </a>
</div>`, error: req.session.errorMessageCPP
    })
  }
})
router.get('/flowchartcpp', (req, res) => {
  console.log(req.session.user)
  if (req.session.user) {
    res.render('flowchartcpp.ejs', { loggedin:req.session.user+'<input data-user hidden value='+req.session.user+'>' })
  } else {
    res.render('flowchartcpp.ejs', {
      loggedin:
        `
      <div class="Login">
      <a href="createaccount"> Login </a>
  </div>
  
  <div class="Register">
      <a href="createaccount"> Register </a>
  </div>`})
  }
})
router.get('/pseudocodecpp', (req, res) => {
  if (req.session.user) {
    res.render('pseudocpp.ejs', { loggedin:req.session.user+'<input data-user hidden value='+req.session.user+'>', pseudo: req.session.pseudoCPP })
  } else {
    res.render('pseudocpp.ejs', {
      loggedin: `
    <div class="Login">
    <a href="createaccount"> Login </a>
</div>

<div class="Register">
    <a href="createaccount"> Register </a>
</div>`, pseudo: req.session.pseudoCPP
    })
  }
})
router.post('/pseudoproccpp', (req, res) => {
  compile(req.body.code, 'cpp').then((message) => {
    pseudofy(req.body.code).then(message => {
      req.session.pseudoCPP = message
      res.redirect('/pseudocodecpp')
    })
  }).catch((message) => {
    req.session.errorMessageCPP = message
    code = req.body.code
    res.redirect('/visualizercpp')
  })
})
router.post('/flowchartproccpp', (req, res) => {
  compile(req.body.code, 'cpp').then((message) => {
    exec('controller\\cxx2flow-windows-amd64.exe controller\\code.cpp -o controller\\code.dot', (err, stdout, stderr) => {
      reformat().then((result) => {
        exec('controller\\Graphviz\\bin\\dot controller\\code.dot -Tpng -o public\\images\\code.png', (err, stdout, stderr) => {
          res.redirect('/flowchartcpp')
        })
      })
    })
  }).catch((message) => {
    req.session.errorMessageCPP = message
    res.redirect('/visualizercpp')
  })
})
router.get('/visualizerpy', (req, res) => {
  if (req.session.user) {
    res.render('visualizerpy.ejs', { loggedin: req.session.user+'<input data-user hidden value='+req.session.user+'>', error: req.session.errorMessagePY })
  } else {
    res.render('visualizerpy.ejs', {
      loggedin:
        `
    <div class="Login">
    <a href="createaccount"> Login </a>
</div>

<div class="Register">
    <a href="createaccount"> Register </a>
</div>`, error: req.session.errorMessagePY
    })
  }
})
router.post('/flowchartprocpy', (req, res) => {
  compile(req.body.code, 'py').then((message) => {
    res.send('no error')
  }).catch(err => {
    req.session.errorMessagePY = err
    res.redirect('/visualizerpy')
  })
})
router.get('/pseudopy', (req, res) => {
  if (req.session.user) {
    res.render('pseudopy.ejs', { loggedin: '<div data-user>'+req.session.user+'</div>', pseudo: req.session.pseudoPY })
  } else {
    res.render('pseudopy.ejs', {
      loggedin:
        `
    <div class="Login">
    <a href="createaccount"> Login </a>
</div>

<div class="Register">
    <a href="createaccount"> Register </a>
</div>`, pseudo: req.session.pseudoPY
    })
  }
})
router.post('/pseudoprocpy', (req, res) => {
  compile(req.body.code, 'py').then((message) => {
    pseudofy(req.body.code).then((message) => {
      req.session.pseudoPY = message
      res.redirect('/pseudopy')
    })
  }).catch(err => {
    req.session.errorMessagePY = err
    res.redirect('/visualizerpy')
  })
})
router.get('/createaccount', (req, res) => {
  res.render('login.ejs')
})
router.post('/signup', (req, res) => {
  ifExist(req.body.name, req.body.email, req.body.password).then(message => {
    if (message == 200) {
      req.session.user = req.body.name
    }
    res.send(message)
  })
})
router.post('/login', (req, res) => {
  ifCorrect(req.body.email, req.body.password).then(message => {
    if (message.status == 200) {
      req.session.user = message.name
    }
    res.send(message.status)
  })
})
router.post('/savecode',(req,res)=>{
  addCode(req.body.code,req.body.user,req.body.name,req.body.lang).then(message=>{
    res.send(message)
  })
})
module.exports = router;
