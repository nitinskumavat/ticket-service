const mongoose=require('mongoose')
const CONNECTION_URI='mongodb+srv://ticket-app:nitin123@cluster0-zrrpf.mongodb.net/test?retryWrites=true&w=majority' || 'mongodb://localhost:27017/ticket-service-api'
mongoose.connect(CONNECTION_URI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true ,
    useFindAndModify: false
})


