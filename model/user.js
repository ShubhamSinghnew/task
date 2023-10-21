import {mongoose , model , Schema} from "mongoose"

const  userModel = new mongoose.Schema({
    userId : {
        type:String,
        default:"", 
    },
    email:{
        type:String,
        default:"",
        unique :true
    },
    password:{
        type:String,
        default:""
    },
    authCode:{
        type:String,
        default:""
    }
})

const user = new mongoose.model("users",userModel)
export default user