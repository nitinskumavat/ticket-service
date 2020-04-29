const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/ticket-service-api',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true 
})


// const t=new ticket({
//     seat:27
// })

// t.save().then((result)=>{
//     console.log( result);
// }).catch((error)=>{
//     console.log(error);
// })


// const t=new passenger({
//     name:"nitin",
//     age:20,
//     sex:"female",
//     email:"ndnd"
// })
// t.save().then((result)=>{
//     console.log("success\n"+ result);
// }).catch((error)=>{
//     console.log(error);
// })