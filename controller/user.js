const mongoose =require('mongoose')
mongoose.connect("mongodb+srv://khoibut:0934134837khoi@cluster0.nfgiuy5.mongodb.net/?retryWrites=true&w=majority")
const userSchema = new mongoose.Schema({
    email:String,
    name:String,
    password:String
})
const userModel = mongoose.model("users",userSchema)
async function ifExist(name,email,password){
    if(await userModel.findOne({email:email})){
        return 400
    }else{
        await userModel.create({name:name,email:email,password:password})
        return 200
    }
}
async function ifCorrect(email,password){
    user=await userModel.findOne({email:email})
    console.log(user)
    if(user){
        if(user.password==password){
            return {status:200,name:user.name}
        }else{
            return {status:400}
        }
    }else{
        return {status:400}
    }
}
module.exports={ifExist,ifCorrect}