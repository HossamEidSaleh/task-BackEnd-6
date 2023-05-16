const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        console.log(token)
        const codedToken= jwt.verify(token , "secret-key");
        console.log(codedToken)
        const user = await User.findOne({_id: codedToken._id, tokens:token})
        if(!user){
            throw new Error()  
    }
         req.user = user;
         req.token = token;
         next()
}catch(e){
    res.status(401).send({error:"please authenticate"})
}
}
module.exports = auth