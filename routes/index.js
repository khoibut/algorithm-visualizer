var express = require('express');
var router = express.Router();
const { exec } = require('child_process');
const {compile}= require('../controller/compile.js')
const {reformat}=require('../controller/reformatgraph.js')
const path=require('path');
const {pseudofy}=require('../controller/pseudo.js')
/* GET home page. */
errorMessageCPP=''
codeCPP=''
pseudoCPP=''
errorMessagePY=''
codePY=''
pseudoPY=''
router.get('/', function(req, res, next) {
  res.redirect("/home")
});
router.get('/home',function(req,res){
  res.render('home.ejs')
})
router.get('/visualizercpp',(req,res)=>{
  res.render('visualizercpp.ejs',{error:errorMessageCPP,code:codeCPP})
})
router.get('/flowchartcpp',(req,res)=>{
  res.render('flowchartcpp.ejs')
})
router.get('/pseudocodecpp',(req,res)=>{
  res.render('pseudocpp.ejs',{pseudo:pseudoCPP})
})
router.post('/pseudoproccpp',(req,res)=>{
  compile(req.body.code,'cpp').then((message)=>{
    pseudofy(req.body.code).then(message=>{
      pseudoCPP=message
      res.redirect('/pseudocodecpp')
    })
  }).catch((message)=>{
    errorMessageCPP=message
    code=req.body.code
    res.redirect('/visualizercpp')
  })
})
router.post('/flowchartproccpp',(req,res)=>{
  compile(req.body.code,'cpp').then((message)=>{
    exec('controller\\cxx2flow-windows-amd64.exe controller\\code.cpp -o controller\\code.dot',(err,stdout,stderr)=>{
      reformat().then((result)=>{
        exec('controller\\Graphviz\\bin\\dot controller\\code.dot -Tpng -o public\\images\\code.png',(err,stdout,stderr)=>{
        res.redirect('/flowchartcpp')
        })
      })
    })
  }).catch((message)=>{
    errorMessageCPP=message
    codeCPP=req.body.code
    res.redirect('/visualizercpp')
  })
})
router.get('/visualizerpy',(req,res)=>{
  res.render('visualizerpy.ejs',{error:errorMessagePY,code:codePY})
})
router.post('/flowchartprocpy',(req,res)=>{
  compile(req.body.code,'py').then((message)=>{
    res.send('no error')
  }).catch(err=>{
    errorMessagePY=err
    res.redirect('/visualizerpy')
  })
})
router.get('/pseudopy',(req,res)=>{
  res.render('pseudopy.ejs',{pseudo:pseudoPY})
})
router.post('/pseudoprocpy',(req,res)=>{
  compile(req.body.code,'py').then((message)=>{
    pseudofy(req.body.code).then((message)=>{
      pseudoPY=message
      res.redirect('/pseudopy')
    })
  }).catch(err=>{
    errorMessagePY=err
    res.redirect('/visualizerpy')
  })
})
module.exports = router;