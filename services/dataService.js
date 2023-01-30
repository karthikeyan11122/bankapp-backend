//import db.js
const db = require('./db')

//import jsonwebtoken

const jwt = require('jsonwebtoken')

//register

const register = (uname,acno,pswn)=>{
    console.log('insided register function in data service');
    //check acno is in Mongo DB-db.users.findOne()
    return db.User.findOne({
        acno
    }).then((result)=>{
        console.log(result);
        if(result){
            //acno Alredy exist
            return{
                statusCode:401,
                message:'Account Already exist!!'
            }
        }
        else{
            //to add new user
            const newUser = new db.User({
                usename:uname,
                acno,
                password:pswn,
                balance:0,
                transaction:[]
            })
            //to save new user in mongodb using save()
            newUser.save()
            return{
                statusCode:200,
                message:'Registration successfull...'
            }
        }

    })

}

//login
const login = (acno,pswn)=>{
    console.log('inside login function body');
    //check acno ,psen in mongo db
    return db.User.findOne({
        acno,
        password:pswn
    }).then(
        (result)=>{
            if(result){
                //generate token 
                const token = jwt.sign({
                    currentAcno:acno
                },'kk7')
                return{
                    statusCode:200,
                    message:'login successfull...',
                    usename:result.usename,
                    currentAcno:acno,
                    token
                }
                
            }
            else{
                return{
                    statusCode:404,
                    message:'invalid account/password'
                }

            }
        }
    )

}

//getbalance

const getBalance =(acno)=>{
    //check accountnumber
   return db.User.findOne({
        acno
    }).then(
        (result)=>{
            if(result){
                return{
                    statusCode:200,
                    balance:result.balance
                }
            }
            else{
                return{
                    statusCode:404,
                    message:'Invalid Account'
                }
                
            }
        }
    )
}
    
//deposit
const deposit = (acno,amt)=>{
    let amount = Number(amt)
    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            //acno is present do 
            result.balance +=amount
            result.transaction.push({
                type:"Credit",
                fromAcno:acno,
                toAcno:acno,
                amount
            })
            result.save()
            return{
                statusCode:200,
                message:`${amount} successfully dposited....`
            }
        }
        else{
            return{
                statusCode:404,
                message:'Invalid account '
            }
        }
    })
}

//FUNDTRANSFER

const fundTransfer = (req,toAcno,pswd,amt)=>{
    let amount = Number(amt)
    let fromAcno = req.fromAcno
    return db.User.findOne({

        acno:fromAcno,
        password:pswd
    }).then((result)=>{
       // console.log(result);
       if(fromAcno==toAcno){
        return {
            statusCode:401,
            message:"Permisssion denied due own account transfer"
        }
       }
        if(result){
            //debit account details 
            let fromAcnoBalance = result.balance
            if(fromAcnoBalance>=amount){
                result.balance = fromAcnoBalance - amount
                //credit account details 
                return db.User.findOne({
                    acno:toAcno
                }).then(creditdata=>{
                    if(creditdata){
                        creditdata.balance += amount
                        creditdata.transaction.push({
                              type:"Credit",
                              fromAcno,
                              toAcno,
                              amount
                        })
                        creditdata.save();
                        result.transaction.push({
                            type:"Debit",
                            fromAcno,
                            toAcno,
                            amount
                        })
                        result.save();
                        return {
                            statusCode:200,
                            message:"fund transfer successfully"
                        }
                    }
                    else{
                        return{
                            statusCode:401,
                            message:"Invalid credit Account number"
                        }
                    }
                })
            }
            else{
                return{
                    statusCode:403,
                    message:"insufficient Balance"
                }
            }
        }
        else{
            return {
                statusCode:401,
                message:"Invalid debit account / password"
            }
        }
    })
}

//getAlltransaction 
const getAlltransaction = (req)=>{
let acno = req.fromAcno
return db.User.findOne({
    acno
}).then((result)=>{
    if(result){
        return{
            statusCode:200,
            transaction:result.transaction
        }
    }
    else{
        return{
            statusCode:401,
            message:"Invalid Account No"
        }
    }
})
}

const deleteMyAccount = (acno)=>{
    return db.User.deleteOne({
        acno
    }).then(
        (result)=>{
            if(result){
                return{
                    statusCode:200,
                    message:"Account delete successfully"
                }
            }
            else{
                return{
                    statusCode:401,
                    message:"Invalid Account"
                }
            }
        }
    )   
    }
//export 
module.exports={
    register,
    login,
    getBalance,
    deposit,
    fundTransfer,
    getAlltransaction,
    deleteMyAccount
}