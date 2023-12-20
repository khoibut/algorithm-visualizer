const express = require('express');
const fs = require('fs');
const app = express;
const promise = require('promise')
const { exec } = require('child_process');
function compile(code, language) {
    if(language=='cpp'){
        return new promise((resolve,reject)=>{
            function compileCPP(){
                message = ''
                fs.writeFile('controller/code.cpp', code, (err) => {
                    if (err) console.log(err);
                })
                return new promise((resolve,reject)=>{
                    exec('controller\\mingw\\bin\\g++ controller\\code.cpp -o controller\\code.exe',(err,stdout,stderr)=>{
                        if(err){
                            reject(stderr)
                        }else{
                            resolve('yessir')
                        }
                    })
                })
            }
            compileCPP().then((res)=>{
                resolve(res)
            }).catch((err)=>{
                reject(err)
            })
        })
    }else{
        return new promise((resolve,reject)=>{
            function compilePY(){
                fs.writeFile('controller/code.py',code,(err)=>{
                  if (err) console.log(err);  
                })
                return new promise((resolve,reject)=>{
                    exec('controller\\python\\python -m py_compile controller\\code.py',(err,stdout,stderr)=>{
                        if(err){
                            reject(stderr)
                        }else{
                            resolve()
                        }
                    })
                })
            }
            compilePY().then((res)=>{
                resolve(res)
            }).catch((err)=>{
                reject(err)
            })
        })
    }
}
module.exports = { compile }