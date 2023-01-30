// import mongoose
const mongoose = require('mongoose')

//using mongoose define connection string

mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('mongodb connected success fully');
})

//create model for project
// collection - users

const User = mongoose.model('User',{
    usename:String,
    acno:Number,
    password:String,
    balance:Number,
    transaction:[]
})

//export model

module.exports={
    User
}
