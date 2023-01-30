//                                5.import express inside index.js
const express = require('express')


//import cors

const cors = require('cors')

// import dataservice.js

const dataservice = require('./services/dataService')

//import jsonwebtoken

const jwt = require('jsonwebtoken')


//   6.creat server using express

const server = express()


//use cores 
server.use(cors({
    origin:'http://localhost:4200'}))

//to parse json data 
server.use(express.json())


//                                7.set up poet number in server application 

server.listen(3000,()=>{
    console.log('server started at 3000');
})

//application specific middilware

const appMiddleware = (req,res,next)=>{
    console.log('inside application apecific midleware');
    next()
}

server.use(appMiddleware)


//bank app frond end request resolving

//token verify middleware
const jwtMiddleware = (req,res,next)=>{
    console.log('inside in router middleware');
    //get token from req headers 
    const token = req.header('access-token')
    console.log(token);
    try{
        const data=jwt.verify(token,'kk7')
        console.log(data);
        req.fromAcno = data.currentAcno
        console.log('valid token');
        next()

    }
    catch{
        console.log('invalid token');
        res.status(401).json({
            message:"please Login.."
        })
    }

    //verify
    
}

//register api call

server.post('/register',(req,res)=>{
console.log("inside register Api");
console.log(req.body);
//asynchronus
dataservice.register(req.body.uname,req.body.acno,req.body.pswn)
.then((result)=>{
    res.status(result.statusCode).json(result)
})
})
server.post('/login',(req,res)=>{
    console.log("inside login Api");
    console.log(req.body);
    //asynchronus
    dataservice.login(req.body.acno,req.body.pswn)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    })
    
    //getbalance
    server.get('/getBalance/:acno',jwtMiddleware,(req,res)=>{
        console.log("inside getBalance Api");
        console.log(req.params.acno);
        //asynchronus
        dataservice.getBalance(req.params.acno)
        .then((result)=>{
            res.status(result.statusCode).json(result)
        })
        })

        //deposit 

        server.post('/deposit',jwtMiddleware,(req,res)=>{
            console.log("inside depost Api");
            console.log(req.body);
            //asynchronus
            dataservice.deposit(req.body.acno,req.body.amount)
            .then((result)=>{
                res.status(result.statusCode).json(result)
            })
            })

     //fundTransfer 

     server.post('/fundTransfer',jwtMiddleware,(req,res)=>{
        console.log("inside fundTransfer Api");
        console.log(req.body);
        //asynchronus
        dataservice.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
        .then((result)=>{
            res.status(result.statusCode).json(result)
        })
        })

        //getAlltransaction
        server.get('/all-transaction',jwtMiddleware,(req,res)=>{
            console.log('inside getAlltransaction');
            dataservice.getAlltransaction(req)
            .then((result)=>{
                res.status(result.statusCode).json(result)
            })
        })

        //delete account api

        server.delete('/delete-account/:acno',jwtMiddleware,(req,res)=>{
            console.log("inside delete-account Api");
            console.log(req.params.acno);
            //asynchronus
            dataservice.deleteMyAccount(req.params.acno)
            .then((result)=>{
                res.status(result.statusCode).json(result)
            })
            })
    

    




