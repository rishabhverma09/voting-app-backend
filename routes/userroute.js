import express from "express";
import User from "../model/user.js";
import { generateToken ,jwtAuthMiddleware} from "../jwt.js";

const Router =express.Router();


// router for signup user
Router.post("/signup" , async(req ,res)=>{

    try{
        const data =req.body;
        const newuser = new User (data);
        const response = await newuser.save();
          console.log('data saved');

          const payload ={
            id: response.id
          }
          console.log(JSON.stringify(payload));

         const token = generateToken(payload);
         console.log("Token is :" ,token);
         res.status(200).json({response : response,token:token})
    }
    
    catch(error){
         console.log(error);
        res.status(500).json({error: 'internal server error'});
    }
});

 // login router for user

 Router.post('/login',async(req ,res)=>{

    try{
        const { addharnumber, password}= req.body;
         
        const user =await User.findOne({addharnumber:addharnumber});
        if(!user|| !(await user.comparePassword(password))){
            return res.status(401).json ({ error:'incorrect username or password' });
        }

        const payload ={
            id:user.id
        }

        const token = generateToken(payload);
        res.json({token})

    }catch(error){
        console.log(error);
        res.status(500).json({error: 'internal server error'});
    }
 });

 // router for profile 

 Router.get('/profile',jwtAuthMiddleware, async(req ,res)=>{
    try{
        const userData = req.user;
        const userid =userData.id;
        const user = await User.findById (userid);
        res.status(200).json({user});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: 'internal server error'});
    }
 });

 // router for password change 

 Router.put('/profile/password', jwtAuthMiddleware, async(req ,res)=>{
    try{
        const userid =req.body;
        const {currentPassword ,newPassword}=req.body;

        const user = await User.findById(userid);
        if(!await user.comparePassword(currentPassword)){
            return res.status(401).json({error :'invalid user or password'});
        }
        // update the user password 
        user.password= newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({message:'password updated'});

    }catch(error){
        console.log(error);
        res.status(500).json({error:'internal server error'});
    }
 });

 export default Router;

 
