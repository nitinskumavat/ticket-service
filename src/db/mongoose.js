const mongoose=require('mongoose')
const CONNECTION_URI=process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket-service-api'
mongoose.connect('mongodb+srv://ticket-app:nitin123@cluster0-zrrpf.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true ,
    useFindAndModify: false
})


