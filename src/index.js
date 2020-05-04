const express=require('express')
require('./Db/Mongoose')
const ticketRouter=require('./Routers/Ticket-route');
const ownerRouter = require('./Routers/Owner')
const app=express()
const port =process.env.PORT || 3000

app.use(express.json());
app.use(ticketRouter);
app.use(ownerRouter);
app.listen(port,()=>{
    console.log('Server is listening on port '+port);
});

