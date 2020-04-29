const mongoose=require('mongoose')
const validator = require('validator');

const Schema=mongoose.Schema;
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

const Passenger=mongoose.model('passenger',passenger_schema);

module.exports=Passenger;