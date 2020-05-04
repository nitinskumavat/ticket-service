const express = require('express')
const Owner = require('../Models/Owner')
const auth = require('../Middleware/Auth')
const router = new express.Router()

router.post('/owner',auth, async (req, res) => {
    const owner =new Owner(req.body);
    try {
        if(req.username.localeCompare("admin"))
            return res.status(401).send({error:"You need an admin access"})
        console.log(owner)
        await owner.save()
        const token = await owner.generateAuthToken()
        res.status(201).send({ owner, token })
    } catch (e) {
        res.status(400).send({error:"Cannot register"})
    }
})

router.post('/owners/login', async (req, res) => {
    try {
        const owner = await Owner.findByCredentials(req.body.username, req.body.password)
        if(!owner)
            return res.status(404).send({error:"Invalid username or password"})
        const token = await owner.generateAuthToken()
        res.send({ owner, token })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/owner/:username',auth, async (req, res) => {
    console.log(req.params);
    const username = req.params.username;
    try {
        if(req.username.localeCompare("admin"))
            return res.status(401).send({error:"You need an admin access"})
        const deleted = await Owner.findOneAndDelete({username});
        res.status(201).send({deleted})
    } catch (e) {
        res.status(400).send({error:"Cannot Delete"})
    }
})

module.exports=router;
