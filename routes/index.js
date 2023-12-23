var express = require('express');
var router = express.Router();
const { exec } = require('child_process');
const { compile } = require('../controller/compile.js')
const { reformat } = require('../controller/reformatgraph.js')
const path = require('path');
const { pseudofy } = require('../controller/pseudo.js')
const sessions = require('express-session')
const oneDay = 1000 * 60 * 60 * 24;
const { ifCorrect, ifExist } = require('../controller/user.js')
router.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}))

/* GET home page. */
errorMessageCPP = ''
codeCPP = ''
pseudoCPP = ''
errorMessagePY = ''
codePY = ''
pseudoPY = ''
router.get('/', function (req, res, next) {
  res.redirect("/home")
});
router.get('/home', function (req, res) {
  console.log(req.session.user)
  if (req.session.user) {
    res.render('home.ejs', { loggedin: req.session.user })
  } else {
    res.render('home.ejs', { loggedin: '<li><a href="#Login" class="account">Login</a></li><li><a href="#Register" class="account">Register</a></li>' })
  }
})
router.get('/visualizercpp', (req, res) => {
  if (req.session.user) {
    res.render('visualizercpp.ejs', { loggedin: req.session.user, error: errorMessageCPP })
  } else {
    res.render('visualizercpp.ejs', {
      loggedin:
        `
    <div class="Login">
    <a> Login </a>
</div>

<div class="Register">
    <a> Register </a>
</div>`, error: errorMessageCPP
    })
  }
})
router.get('/flowchartcpp', (req, res) => {
  console.log(req.session.user)
  if (req.session.user) {
    res.render('flowchartcpp.ejs', { loggedin: req.session.user })
  } else {
    res.render('flowchartcpp.ejs', {
      loggedin:
        `
      <div class="Login">
      <a> Login </a>
  </div>
  
  <div class="Register">
      <a> Register </a>
  </div>`})
  }
})
router.get('/pseudocodecpp', (req, res) => {
  if (req.session.user) {
    res.render('pseudocpp.ejs', { loggedin: req.session.user, pseudo: pseudoCPP })
  } else {
    res.render('pseudocpp.ejs', {
      loggedin: `
    <div class="Login">
    <a> Login </a>
</div>

<div class="Register">
    <a> Register </a>
</div>`, pseudo: pseudoCPP
    })
  }
})
router.post('/pseudoproccpp', (req, res) => {
  compile(req.body.code, 'cpp').then((message) => {
    pseudofy(req.body.code).then(message => {
      pseudoCPP = message
      res.redirect('/pseudocodecpp')
    })
  }).catch((message) => {
    errorMessageCPP = message
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
    errorMessageCPP = message
    codeCPP = req.body.code
    res.redirect('/visualizercpp')
  })
})
router.get('/visualizerpy', (req, res) => {
  if (req.session.user) {
    res.render('visualizerpy.ejs', { loggedin: req.session.user, error: errorMessageCPP })
  } else {
    res.render('visualizerpy.ejs', {
      loggedin:
        `
    <div class="Login">
    <a> Login </a>
</div>

<div class="Register">
    <a> Register </a>
</div>`, error: errorMessagePY
    })
  }
})
router.post('/flowchartprocpy', (req, res) => {
  compile(req.body.code, 'py').then((message) => {
    res.send('no error')
  }).catch(err => {
    errorMessagePY = err
    res.redirect('/visualizerpy')
  })
})
router.get('/pseudopy', (req, res) => {
  if (req.session.user) {
    res.render('pseudopy.ejs', { loggedin: req.session.user,pseudo:pseudoPY })
  } else {
    res.render('pseudopy.ejs', { loggedin: 
      `
    <div class="Login">
    <a> Login </a>
</div>

<div class="Register">
    <a> Register </a>
</div>`,pseudo:pseudoPY
})
  }
})
router.post('/pseudoprocpy', (req, res) => {
  compile(req.body.code, 'py').then((message) => {
    pseudofy(req.body.code).then((message) => {
      pseudoPY = message
      res.redirect('/pseudopy')
    })
  }).catch(err => {
    errorMessagePY = err
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
module.exports = router;
