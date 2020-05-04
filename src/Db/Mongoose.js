const mongoose=require('mongoose')
const CONNECTION_URI=process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket-service-api'
mongoose.connect(CONNECTION_URI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true ,
    useFindAndModify: false
})


