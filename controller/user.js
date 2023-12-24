const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://khoibut:0934134837khoi@cluster0.nfgiuy5.mongodb.net/?retryWrites=true&w=majority")
const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String
})
const codeSchema = new mongoose.Schema({
    code: String,
    name: String,
    lang:String,
    belong: String
})
const codeModel = mongoose.model("code", codeSchema)
const userModel = mongoose.model("users", userSchema)
async function ifExist(name, email, password) {
    if (await userModel.findOne({ email: email })) {
        return 400
    } else {
        await userModel.create({ name: name, email: email, password: password })
        return 200
    }
}
async function ifCorrect(email, password) {
    user = await userModel.findOne({ email: email })
    console.log(user)
    if (user) {
        if (user.password == password) {
            return { status: 200, name: user.name }
        } else {
            return { status: 400 }
        }
    } else {
        return { status: 400 }
    }
}
async function addCode(code, user, name,lang) {
    await codeModel.create({
        code: code,
        name: name,
        lang:lang,
        belong: user
    })
    return 200
}
module.exports = { ifExist, ifCorrect, addCode }