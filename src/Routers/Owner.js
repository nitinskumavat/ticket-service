const express = require('express')
const Owner = require('../Models/Owner')
const auth = require('../Middleware/Auth')
const router = new express.Router()

router.post('/owner', async (req, res) => {
    const owner = new Owner(req.body)
    try {
        await owner.save()
        const token = await owner.generateAuthToken()
        //console.log(token);
        res.status(201).send({ owner, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/owners/login', async (req, res) => {
    try {
        const owner = await Owner.findByCredentials(req.body.username, req.body.password)
        const token = await owner.generateAuthToken()
        res.send({ owner, token })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.get('/ownertest', auth ,async(req,res,next)=>{
    try {
        //console.log(req);
        const owner = await Owner.find({username:"admin"});
        res.send(req)
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports=router;
