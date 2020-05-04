const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema=mongoose.Schema;

const owner_schema=new Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

owner_schema.methods.toJSON = function () {
    const owner = this
    const ownerObject = owner.toObject()

    delete ownerObject.password
    delete ownerObject.tokens

    return ownerObject
}


owner_schema.methods.generateAuthToken = async function () {
    const owner = this
    const token = jwt.sign({ _id: owner._id.toString(),username:owner.username }, 'thisismynewcourse')
    console.log('token '+token);
    owner.tokens = owner.tokens.concat({ token })
    await owner.save()

    return token
}

owner_schema.statics.findByCredentials = async (username, password) => {
    const owner = await Owner.findOne({ username })
    //console.log(owner);
    if (!owner) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, owner.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return owner
}

owner_schema.pre('save', async function (next) {
    const owner = this

    if (owner.isModified('password')) {
        owner.password = await bcrypt.hash(owner.password, 8)
    }

    next()
})
const Owner=mongoose.model('Owner',owner_schema);
module.exports=Owner;