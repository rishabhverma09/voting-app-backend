import express from 'express';
import Candidate from  '../model/candidate.js'
import User from '../model/user.js';
import { jwtAuthMiddleware} from "../jwt.js";

const Router =express.Router();

const checkAdminRole = async(userid)=>{
    try{
        const user =await User.findById(userid);
    if ( user.role === 'admin'){
        return true;
    };
}catch(error){
    return false;
}
}

Router.post('/', jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!  await checkAdminRole(req.user.id))
            return res.status(403).json({message:'user is not admin'});


            const data = req.body;
            const newcandidate = new Candidate(data);
            const response = await newcandidate.save();
            console.log('data save');
            res.status(200).json({response:response});

    }catch(error){
        console.log(error);
        res.status(500).json({error:'internal server error'});
    }
});


Router.put('/:candidateid', jwtAuthMiddleware,async(req,res)=>{
    try{
        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({meaasge:'user is not admin'});
        const candidateid = req.params.candidateid;
        const updatecandidateData =req.body;
        const response =await Candidate.findByIdAndUpdate(candidateid,updatecandidateData,{runValidators:true,})
        if(!response){
            return res.status(404).json({error:'candidate not found'});

        }
        console.log("candidate data updated");
        res.status(200).json(response);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:'internal server error'});
    }
});

// for delete a candidate 

Router.delete('/:candidateid', jwtAuthMiddleware, async(req,res)=>{
    try{
         if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message:'user is not admin'});
         }
         const candidateid = req.params.candidateid;
         const response = await Candidate.findByIdAndDelete(candidateid);
         if(!response){
            return res.status(404).json({error:'candidate not found'});
         }
         console.log('candidate delete');
         res.status(200).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({error:'internal server error' });
    }
});


// voting start

Router.post('/vote/:candidateid',jwtAuthMiddleware,async(req,res)=>{
    //no admin can vote 
    //only one user can vote one time
    const  candidateid=req.params.candidateid;
      const userid= req.user.id;
    try{
       const candidate = await Candidate.findById(candidateid);
       if(!candidate){
      return  res.status(404).json({error:'candidate not found'});
       }
      
       const user =await User.findById(userid);
       if(!user){
        return res.status(404).json({message:'user not found'});
       }
       if (user.isvoted){
        return res.status(400).json({message:'you allready voted'});
       }
            if(user.role=== 'admin'){
             return res.status(403).json({message:'admin can not vote'});
            }
//   update the candidate record 

        candidate.votes.push({user:userid});
        candidate.votecount++;
        await candidate.save();

       // update the user document 

       user.isvoted= true;
       await user.save();

       res.status(200).json({message:'vote recorded successfully'});
        
    }catch(error){
         console.log(error);
         res.status(500).json({error:'internal server error'});
    }
});

// vote count

Router.get("/vote/count", async(req,res)=>{
    try{
        const candidate = await Candidate.find().sort({votecount :'desc'});

        const voterecord =candidate.map((data)=>{
            return{
                party :data.party,
                count : data.votecount

            }
        });
        res.status(200).json(voterecord);

    }catch(error){
          console.log(error);
         res.status(500).json({error:'internal server error'});
    }
});

// for candidate list 

Router.get('/',async(req,res)=>{
    try{
         const candidate = await Candidate.find().select('name');
         res.status(200).json(candidate);
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"internal server error"});
    }
});

export default Router;