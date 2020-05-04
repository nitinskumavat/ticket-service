const jwt=require('jsonwebtoken')
const Owner=require('../Models/Owner')

const auth=async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        //console.log(token);
        if(!token)
            return res.status(403).send({ auth: false, message: 'No token provided.' });
        const decoded =jwt.verify(token,process.env.JWT_KEY||'thisismynewcourse');
        //console.log(decoded);
        const owner=await Owner.findOne({_id:decoded._id, 'tokens.token': token})

        if(!owner){
            return res.status(401).send('Access Denied: No Token Provided!');
        }
        req.ownerid=owner._id;
        req.username=owner.username;
        next();
    }
    catch(e){
        res.status(401).send({error:'Please authenticate'});
    }

}
module.exports=auth;