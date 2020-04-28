const mongoose=require('mongoose')
const validator = require('validator');

const Schema=mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/ticket-service-api',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true 
})

//pending ticket validation
const ticket_schema= new Schema({
    seat:{
    type:Number,
    min:[1,'Seat number ({VALUE}) is less than 1'],
    max:[40,'Seat number ({VALUE}) is greater than 40'],
    unique: true
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

ticket_schema.post('save',function(error,doc,next){
    if(error)
        throw new Error('Seat Already taken');
});
const ticket = mongoose.model('ticket',ticket_schema);

const t=new ticket({
    seat:27
})

t.save().then((result)=>{
    console.log( result);
}).catch((error)=>{
    console.log(error);
})

const passenger_schema=new Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    sex:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowercase:true,
        trim:true,
        validate(value){
           if(!validator.isEmail(value)) {
               throw new Error('Email is invalid')
           }
        }
    }
});
const passenger=mongoose.model('passenger',passenger_schema)
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