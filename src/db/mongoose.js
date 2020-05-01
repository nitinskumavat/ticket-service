const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/ticket-service-api',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true 
})


