const mongoose=require('mongoose')

mongoose.connect('mongodb+srv://ticket-app:nitin123@cluster0-zrrpf.mongodb.net/ticket-service-app?retryWrites=true&w=majorityretryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true ,
    useFindAndModify: false
})


