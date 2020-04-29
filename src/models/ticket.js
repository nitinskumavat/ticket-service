const mongoose=require('mongoose')
const validator = require('validator');

const Schema=mongoose.Schema;
//pending ticket validation
const ticket_schema= new Schema({
    seat:{
    type:Number,
    min:[1,'Seat number ({VALUE}) is less than 1'],
    max:[40,'Seat number ({VALUE}) is greater than 40'],
    require:true,
    unique:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    booked:{
        type: Boolean,
        default :true
    },
    user:{
        type: Schema.ObjectId,
        ref:"Passenger"
    }
});
// ticket_schema.post('save',function(error,doc,next){
//     if(error)
//         throw new Error('Seat Already taken');
// });

const Ticket = mongoose.model('ticket',ticket_schema);

module.exports=Ticket;
