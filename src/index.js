const express=require('express')
const validator = require('validator');
const Ticket = require('./models/Ticket')
const Passenger= require('./models/Passenger')
require('./db/mongoose')


const app=express()
const port =3000

app.use(express.json());

app.listen(port,()=>{
    console.log('Server is listening on port '+port);
});


const valid_user=(user)=>{
        if(validator.isAlpha(user.name) && validator.isAlpha(user.sex) && validator.isNumeric(user.age.toString()) && validator.isEmail(user.email))
            return true;
        return false;
}

//Book ticket
app.post('/', async (request,response)=>{
    seat=request.body.seat;
    user_data=request.body.user;
    const ticket=new Ticket({seat});
    const user=new Passenger(user_data);
    try{
        if(!valid_user(user))
            return response.status(400).send({"error":'Invalid user data'}).json;
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
        response.status(500).send();
    }

});

//cancle Ticket(close to open)
app.delete('/ticket/:seat', async(request,respone)=>{
    const seat=request.params.seat;
    try{
        const deleted_ticket=await Ticket.findOneAndDelete({seat});
        if(deleted_ticket){
            deleted_user= await Passenger.findByIdAndDelete(deleted_ticket.user);
            deleted_ticket["user_data"]=deleted_user;
            console.log(deleted_ticket);
        }
            //console.log(deleted_ticket);
        else
            console.log('not found');
        respone.send();
    }catch(e){
        respone.status(400).send();
    }
})

//Get all closed tickets
app.get('/tickets/',async (request,respone)=>{
    try{
        const tickets= await Ticket.find({}).sort({seat : 1});
        //respone.send(tickets);
        var seats=[]
        tickets.forEach((ticket)=>{
            seats.push({"seat":ticket.seat});
        })
        respone.send(seats);
    }
    catch(error){
        respone.status(500).send();
    }
});

//Get all open seats
app.get('/tickets/open/',async(request,respone)=>{
    var seats=new Set();
    for( var i =1;i<=40;i++)
        seats.add(i);
    try{
        const tickets=  await Ticket.find({});
        tickets.forEach((ticket)=>{
            seats.delete(ticket.seat);
        })
        var open_seats=[];
        seats.forEach((seat)=>{
            open_seats.push({"seat":seat});
        })
        respone.send(open_seats);
    }catch(e){
        console.log(e);
    }
})


//Get ticket status by seat number
app.get('/ticket/:id', async(request,response)=>{
    const seat=request.params.id;
    console.log(seat);
    if(seat>40 || seat<1)
        return response.status(400).send();
    try{
        const ticket= await Ticket.findOne({seat});
        if(!ticket)
            return response.send({"seat": seat,"booked": false}).json;
        await ticket.populate('user').execPopulate();
        console.log(ticket.user);
        response.send(ticket);
    }  catch(e){
        response.status(400).send(e);
    }
})

//update user by seat number
app.patch('/ticket/update/:seat',async(request,response)=>{
    const updates=Object.keys(request.body);
    const allowedUpdates=new Set(['name','age','email','sex']);
    const isvalid=updates.every((update)=>{
        return allowedUpdates.has(update);
    })
    if(!isvalid){
        return response.status(400).send({'error':'invalid updates!'}).json;
    }
    try{
        const ticket=await Ticket.findOne({seat:request.params.seat});
        const user_id=ticket.user;
        console.log(user_id);
        if(!user_id)
            return response.status(400).send({'error':'Seat is not booked by anyuser'}).json;
        const user=await Passenger.findByIdAndUpdate(user_id,request.body,{new:true});
        if(!user)
            return response.status(404).send();
        response.send(user);
    }catch(e){
        response.status(400).send(e);
    }
})


app.post('/user/',(request,response)=>{
    const passenger=new Passenger(request.body);
    passenger.save().then((result)=>{
        response.status(201).send(passenger);
    }).catch((error)=>{
        response.status(400).send(error);
    })
})

app.get('/users/',async (request,respone)=>{
    try{
        const u= await Passenger.find({});
        respone.send(u);
    }
    catch(error){
        respone.status(500).send();
    }
});