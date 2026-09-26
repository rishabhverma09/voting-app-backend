import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userschema =new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   age:{
    type:Number,
    required:true
   },
   mobile:{
    type:String
   },
   address:{
    type : String,
    required : true
   },
   addharnumber:{
    type: Number,
    required : true,
    unique :true
   },
   password:{
    type :String,
    required:true
   },
   role:{
    type:String,
    enum:['voter' ,'admin'],
    default:'voter'
   },
   isvoted:{
     type:Boolean,
     default:false
   }
});

userschema.pre('save',async function(){
  try{
    if(!this.isModified("password")){
      return;
    }
    const salt =await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      this.password,
      salt
    );
    this.password = hashedPassword;

  }
  catch(error){
    console.log("Password hashing error:", error);
    throw error;
  }
});
userschema.methods.comparePassword =async function (candidatePassword){
  try{
    const isMatch = await bcrypt.compare(
      candidatePassword,
      this.password
    );
    return isMatch;

  }
  catch(error){
    console.log('password compare error :', error);
    throw error;
  }
};

const User = mongoose.model('User', userschema);
export default User ;