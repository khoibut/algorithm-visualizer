const fs = require('fs');
const promises=require('promise')
function reformat(){
    return new promises((resolve,reject)=>{
        fs.readFile('controller/code.dot','utf-8',(err,text)=>{
            text=text.split('\n')
            res=''
            for(i=0;i<text.length;i++){
                if(text[i].includes('cout<<')||text[i].includes('printf(')){
                    text[i]=text[i].replace('box','note')
                }else if(text[i].includes('cin>>')||text[i].includes('scanf')){
                    text[i]=text[i].replace('box','parallelogram')
                }
                res=res+text[i]+'\n'
                if(i==text.length-1){
                    fs.writeFile('controller/code.dot',res,(err)=>{
                        if(err){
                            reject()
                        }else{
                            resolve()
                        }
                    })
                }
            }
        })
    })
}
module.exports={reformat}