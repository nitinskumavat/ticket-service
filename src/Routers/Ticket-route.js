const express= require('express');
const auth = require('../Middleware/Auth')
const Ticket = require('../Models/Ticket')
const Passenger= require('../Models/Passenger')
const validator = require('validator');
const router= new express.Router();

const valid_user=(user)=>{
    if(Object.keys(user).length==5 && validator.isAlpha(user.name) && validator.isAlpha(user.sex) && validator.isAlpha(user.destination) &&  validator.isNumeric(user.age.toString()) && validator.isEmail(user.email))
        return true;
    return false;
}

const valid_seat=(seat)=>{
return (seat>=1 && seat<=40)
}

router.get('',(req,resp)=>{
    resp.send({msg:'welcome'})
})

//Book ticket (open to close)
router.post('/ticket/', auth,async (request,response)=>{
seat=request.body.seat;
user_data=request.body.user;
if(!valid_user(user_data))
    return response.status(400).send({"error":'Invalid user data'}).json;
if(seat<1 ||seat>40)
    return response.status(400).send({'error':'Invalid seat number'}).json;
const ticket=new Ticket({seat});
const user=new Passenger(user_data);
try{
    await ticket.save();
} catch(e){
    response.status(400).send({'error':'Seat Already taken'}).json;
}
try{
   await user.save();
   const ticket=await Ticket.findOneAndUpdate({seat:seat},{$set:{user:user._id}},{new:true});
    response.send({ticket,user});
}catch(e){
    response.status(500).send(e);
}
});

//cancel Ticket (close to open)
router.delete('/ticket/:seat', auth,async(request,respone)=>{
const seat=request.params.seat;
try{
    if(!valid_seat(seat))
    return respone.status(404).send({error:"Invalid seat number"})
    var deleted_ticket=await Ticket.findOneAndDelete({seat}).lean();
    if(deleted_ticket){
        const deleted_user= await Passenger.findByIdAndDelete(deleted_ticket.user);
        deleted_ticket.booked=false;
        deleted_ticket.user=deleted_user;
        respone.send(deleted_ticket);
    }
    else
        respone.status(400).send({'error':'Ticket already open!'});
}catch(e){
    respone.status(400).send(e);
}
})

//Get all closed tickets
router.get('/tickets/close/',async (request,respone)=>{
try{
    const tickets= await Ticket.find({}).sort({seat : 1});
    var seats=[]
    tickets.forEach((ticket)=>{
        seats.push({"seat":ticket.seat});
    })
    respone.send(seats);
}
catch(error){
    respone.status(500).send(error);
}
});

//Get all open seats
router.get('/tickets/open/',async(request,respone)=>{
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
    respone.status(404).send(e);
}
})


//Get ticket status by seat number
router.get('/ticket/:id',auth, async(request,response)=>{
const seat=request.params.id;
if(seat>40 || seat<1)
    return response.status(400).send();
try{
    const ticket= await Ticket.findOne({seat});
    if(!ticket)
        return response.send({"seat": seat,"booked": false}).json;
    await ticket.populate('user').execPopulate();
    response.send(ticket);
}  catch(e){
    response.status(400).send(e);
}
})

//update user by seat number
router.patch('/ticket/update/:seat',auth,async(request,response)=>{
const updates=Object.keys(request.body);
const allowedUpdates=new Set(['name','age','email','sex',"destination"]);
const isvalid=updates.every((update)=>{
    return allowedUpdates.has(update);
})
if(!isvalid){       
    return response.status(400).send({'error':'invalid updates!'}).json;
}
try{
    const ticket=await Ticket.findOne({seat:request.params.seat});
    const user_id=ticket.user;
    if(!user_id)
        return response.status(400).send({'error':'Seat is not booked by anyuser'}).json;
    const user=await Passenger.findByIdAndUpdate(user_id,request.body,{new:true});
    if(!user)
        return response.status(404).send();
    response.send({seat:request.params.seat,user});
}catch(e){
    response.status(400).send({error:'Bad request'});
}
})

//Reset all tickets
router.delete  ('/ticket/reset/all/',auth,async (request,respone)=>{
try{
    console.log(request.username);
    if(request.username.localeCompare("admin"))
        return respone.status(401).send({error:"You need an admin access"})
    var deleted_tickets=await Ticket.find({booked:true});
    deleted_tickets.forEach(async function(ticket){
        const pass=await Passenger.findByIdAndDelete(ticket.user);
    })
    deleted_tickets=await Ticket.deleteMany({booked:true}).lean();
    delete deleted_tickets.opTime;
    delete deleted_tickets.$clusterTime;
    delete deleted_tickets.operationTime;
    delete deleted_tickets.electionId;
    respone.send(deleted_tickets);
}catch(e){
    respone.status(400).send(e);
}
})

//See all users
router.get('/users/',auth,async (request,respone)=>{
try{
    const u= await Passenger.find({});
    respone.send(u);
}
catch(error){
    respone.status(500).send();
}
});

module.exports=router;