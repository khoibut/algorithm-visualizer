const { GoogleGenerativeAI } = require("@google/generative-ai");
const promises=require("promise")
const genAI = new GoogleGenerativeAI("AIzaSyC-SIad65iBZoLwHiMjP9KbQt7Exr4Nxfc");
const model = genAI.getGenerativeModel({ model: "gemini-pro"});
async function generatePseudo(prompt){
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text)
    return text;
}
async function pseudofy(code){
    return new promises((resolve,reject)=>{
        generatePseudo('generate pseudocode of this code '+code).then((res)=>{
            resolve(res)
        })
    })
}
module.exports={pseudofy}