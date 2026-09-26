import jwt from "jsonwebtoken";

const jwtAuthMiddleware = (req ,res ,next)=>{
    
    const authorization = req.headers.authorization

    if(!authorization) return res.status(401).json ({error:'token not found'});

    const token = req.headers.authorization.split(' ')[1];

    if(!token) return res.status(401).json({error:'unauthorized'});
    
    try{
        const decoded = jwt .verify(token ,process.env.JWT_SECRET);
        req.user = decoded;
        next ();
    }catch(error){
        console.log(error);
        res.status(401).json({error: 'invalid token'})
    }

}
// function to generate token
    const generateToken = (userData)=>{
       // generate a new jwt token using user data

       return jwt.sign(userData, process.env.JWT_SECRET);
    } 


    export { jwtAuthMiddleware, generateToken };