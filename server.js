const express = require('express')
const fs = require('fs')
const https = require('https')
const mongoose = require('mongoose')
const shajs  = require('sha.js')

const logger = require('morgan'),
    favicon = require('serve-favicon')
const { ObjectId } = require('bson')

var app = express()
let loginModel, residentModel, passModel

//put these at the external level so that you can use the key values for validations when creating
let login = {
    username: String,
    password: String,
    role: String,
    residentID:mongoose.ObjectId
},
resident = {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    apartment: String,
    building: String,
},
pass = {
    plateNum: String,
    passType: String,
    expiration: Date,
    vehicleMake: String,
    vehicleModel: String,
    vehicleColor: String,
    vehicleYear: String,
    residentID: mongoose.ObjectId
}

// https
//     .createServer({key: fs.readFileSync('server.key'),cert: fs.readFileSync('server.cert')},app)
//     .listen(3000, async () =>{
//         console.log('Server listening on port 3000')
//         //connect to the database, set up the schemas, and create the models
//         try{
//             let db = await mongoose.connect('mongodb+srv://DBUser:rsOe3zE37DzffIY5@cluster0.bepto.mongodb.net/Parking?retryWrites=true&w=majority')
//             let loginSchema = new db.Schema(login)
//             let residentSchema = new db.Schema(resident)
//             let passSchema = new db.Schema(pass)
//             loginModel = db.model('logins', loginSchema)
//             residentModel = db.model('residents', residentSchema)
//             passModel = db.model('passes', passSchema)
//             console.log('Successfully connected to the database')
//         }
//         catch(err){
//             console.error(`Failed to connect to database: `, err)
//         }
//     })
const server = app.listen(3000, async () => {
    console.log('Server listening on port 3000')
    //connect to the database, set up the schemas, and create the models
    try{
        let db = await mongoose.connect('mongodb+srv://DBUser:rsOe3zE37DzffIY5@cluster0.bepto.mongodb.net/Parking?retryWrites=true&w=majority')
        let loginSchema = new db.Schema(login)
        let residentSchema = new db.Schema(resident)
        let passSchema = new db.Schema(pass)
        loginModel = db.model('logins', loginSchema)
        residentModel = db.model('residents', residentSchema)
        passModel = db.model('passes', passSchema)
        console.log('Successfully connected to the database')
    }
    catch(err){
        console.error(`Failed to connect to database: `, err)
    }
})


app.use(logger('dev'))
app.use(express.static('public'))
//app.use(favicon())
app.use(express.json())
app.use(express.urlencoded())

app.post('/logins', async (req, res) => {
    let pwHash = hash(req.body.password)
    try{
        let login = await loginModel.findOne({username: req.body.username, password: pwHash})
        if (login){
            let user = await residentModel.findOne({_id: ObjectId(login.residentID)})
            if (user){
                res.status(200).send({role:login.role, user})
            }
            else{
                if (login.role === 'admin'){
                    res.status(200).send({role:login.role})
                }
                else{
                    res.status(500).send('resident info not found')
                }
            }
        }
        else{
            res.status(404).send('Login not found')
        }
    }

    catch(err){
        console.log('Error in getting logins: ')
        console.error(err)
    }
})

app.get('/passes', async (req, res) =>{
    try{
        let pass = await passModel.findOne({plateNum: req.query.plate})
        if (pass){
            res.status(200).send(pass)
        }
        else{
            res.status(404).send('Pass not found')
        }
    }
    catch(err){
        console.log('Error in getting passes: ')
        console.error(err)
    }
})

app.get('/resident/:id', async(req, res) =>{
    try{
        let resident = await residentModel.findOne({_id: ObjectId(req.params.id)})
        if (resident){
            res.status(200).send(resident)
        }
        else{
            res.status(404).send('Resident not found')
        }
    }
    catch(err){
        console.log('Error in getting resident: ')
        console.error(err)
    }
})

app.get('/passes/:type/:id', async(req, res) => {
    try{
        let pass = await passModel.findOne({residentID: ObjectId(req.params.id), passType: req.params.type})
        if (pass){
            res.status(200).send(pass)
        }
        else{
            res.status(404).send('Pass not found')
        }
    }
    catch(err){
        console.log('Error in getting pass: ')
        console.error(err)
    }
})

app.post('/passes', async (req, res) => {
    if (!validatePass(req.body)){
        res.status(400).send('Missing fields')
        return
    }
    try{
        let pass = await passModel.create(cleanPass(req.body))
        res.status(200).send(pass)
    }
    catch(err){
        console.log('Error in creating pass: ')
        console.error(err)
    }
})

app.put('/passes/resident/:id',async (req, res) => {
    try{
        let pass = await passModel.findOne({residentID: ObjectId(req.params.id), passType: 'resident'})
        if (pass){
            let updatedPass = await passModel.findOneAndUpdate({residentID: ObjectId(req.params.id), passType: 'resident'}, req.body)
            res.status(200).send(updatedPass)
        }
        else{
            res.status(404).send('Pass not found')
        }
    }
    catch(err){
        console.log('Error in updating pass: ')
        console.error(err)
    }
})

app.delete('/passes/:type/:id', async(req, res) => {
    try{
        let pass = await passModel.findOneAndDelete({residentID: ObjectId(req.params.id), passType: req.params.type})
        if (pass){
            res.status(200).send(pass)
        }
        else{
            res.status(404).send('Pass not found')
        }
    }
    catch(err){
        console.log('Error in deleting pass: ')
        console.error(err)
    }
})

function hash(password){
    return shajs('sha256').update(password).digest('hex')
}

function validatePass(pass){
    let requiredFields = Object.keys(pass)
    let missingFields = []
    for (let field of requiredFields){
        if (!pass[field]){
            missingFields.push(field)
        }
    }

    return !missingFields.length
}

function cleanPass(pass){
    pass.date = new Date(pass.date)
    pass.residentID = new ObjectId(pass.residentID)
    return pass
}
