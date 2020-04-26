const express=require('express')

const app=express()
const port =3000

app.get('/',(req,res)=>{
    res.send('Hello');
})

app.get('ticket/status/id',(req,res)=>{
    res.send();
})

app.get('ticket/open',(req,res)=>{
    res.send();
})

app.get('ticket/closed',(req,res)=>{
    res.send();
})

app.get('ticket/details/id',(req,res)=>{
    res.send();
})
//TODO 
// Update ticket status(open or close+add user details)
// view ticket status
// view all closed ticket
// view all open ticket
// view details of closed tickets
// admin api to reset all tickets
app.listen(port,()=>console.log(`Example app listening at http://localhost:${port}`))