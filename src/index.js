const express=require('express')
const validator = require('validator');
require('./db/mongoose')
const Ticket = require('./models/Ticket')
const Passenger= require('./models/Passenger')

const app=express()
const port =3000

app.use(express.json());

app.listen(port,()=>{
    console.log('Server is listening on port '+port);
});


const check_user=(user)=>{
    if(!validator.isAlpha(user.name)||
        !validator.isAlpha(user.sex)||
        !validator.isNumeric(user.age.toString())||
        !validator.isEmail(user.email))
        throw Error('invalid');
    return false;
}

//Book ticket
app.post('/', async (request,response)=>{
    seat=request.body.seat;
    user_data=request.body.user;
    const ticket=new Ticket({seat});
    const user=new Passenger(user_data);
    try{
        check_user(user_data);
    }catch(e){
        response.status(201).send({'error':'Invalid user data'}).json;
    }
    try{
         await ticket.save();
    } catch(e){
        if(seat<1 ||seat>40)
           response.status(400).send({'error':'Invalid seat number'}).json;
        response.status(400).send({'error':'Seat Already taken'}).json;
    }
    try{
       await user.save();
       const ticket=await Ticket.findOneAndUpdate({seat:seat},{$set:{user:user._id}},{new:true});
        response.send(ticket);
    }catch(e){
        response.status(500);
    }

});

//Get all closed tickets
app.get('/tickets/',(request,respone)=>{
    Ticket.find({}).sort({seat : 1}).then((tickets)=>{
        respone.send(tickets);
    }).catch((error)=>{
        respone.status(500).send();
    })
})

//Get ticket status by seat number
app.get('/ticket/:seat',(request,response)=>{
    const seat=request.params.seat;
    Ticket.findOne({seat:seat}).then((ticket)=>{
        if(seat>40 || seat<1)
            return response.status(400).send();
        if(!ticket)
            response.send({"seat": seat,"booked": false}).json;
        response.send(ticket.date);
    }).catch((error)=>{
        response.status(500).send();
    })
})

app.post('/user/',(request,response)=>{
    const passenger=new Passenger(request.body);
    passenger.save().then((result)=>{
        response.status(201).send(passenger);
    }).catch((error)=>{
        response.status(400).send(error);
    })
})