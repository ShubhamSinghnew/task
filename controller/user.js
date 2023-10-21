import userModel from "../model/user.js"
import Randomstring from "randomstring"
import task from "../model/taks.js"
import {jwtsign} from "../helper.js"
import { io } from "../server.js";

// In this api i am registering the user and creating the taks as well  we can make different collection also and pass the userId in that task collection and add the task details in that collection and CURD will perform using their userId
const addUser = async(req,res)=>{

    try{
       
        const {email,password ,name, phone} = req.body

        if(!email || !password || !name || !phone){
            return res.status(400).json({message :"some fileds are empty"})
        }

        const emailId  = await userModel.find({email:email})

        if(emailId.length === 0){
            const authTokenPayload = {
                email: email,
                password: password
            }

            const encryptedCode = await jwtsign(authTokenPayload)
            const add = new userModel({
              
                userId : Randomstring.generate(8),
        
                email : email,
        
                password : password,
        
                name : name,
        
                phone : phone,
        
                authCode : encryptedCode
        
            })
        
            await add.save()
            return res.status(200).json({message : "user Added Successfully"})
        }else{
            return res.status(400).json({message :"email already exist"})
        }


       
    }catch(error){
       
        return res.status(500).json({message : error})
    }
   
}

//login api
const login = async(req,res)=>{
    const{email,password} = req.body
    const user = await userModel.findOne({email:email})

    if(!user){
        return res.status(400).json({message : "user not found"})
    }

    if(password !== user.password){
        return res.status(400).json({message : "Incorrect password"})
    }

    return res.status(200).json({message:"user login successfully"})
}


// create tsk api
const createTaks = async(req,res)=>{
    const {title,description, status} = req.body

    const user = await userModel.findOne({userId:req.body.userId})

    if(!user){
        return res.status(400).json({message : "user not found"})
    }

    const add = task({
        userId:user.userId,
        title,
        description,
        status
    })
    await add.save()
    const taskbar = await task.find({userId:req.body.userId})
    io.emit("task",taskbar);
    return res.status(200).json({ message: "task added successfully" });
}



//readTask

const readTask = async(req,res)=>{

    const taskModel = await task.find({userId : req.params.userId})

    if(!taskModel){
        return res.status(400).json({message : "task not found"})
    }

    return res.status(200).json({ message: taskModel});
    
}



// // update task api 
const UpdateTask = async(req,res)=>{

    const taskModel = await task.findOne({userId : req.body.userId})

    if(!taskModel){
        return res.status(400).json({message : "task not found"})
    }
    
    await task.updateOne({ userId: taskModel.userId }, { $set: {status :req.body.status} });

    const data = await task.findOne({ userId: req.body.userId });

    return res.status(200).json({ message: `status changed as ${data.status}` });
    
}


//deletask api
const deleteTask = async(req,res)=>{
    const taskModel = await task.findOne({userId : req.body.userId})

    if(!taskModel){
        return res.status(400).json({message : "task not found"})
    }

    await taskModel.deleteOne({userId : taskModel.userId})

    return res.status(200).json({ message: `task deleted of this ${taskModel.userId} userId`});

}




export {addUser,login ,createTaks, Update ,deleteTask , readTask}
