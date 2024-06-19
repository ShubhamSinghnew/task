import {mongoose , model , Schema} from "mongoose"

const  userModel = new mongoose.Schema({
    user_id : {
        type:String,
        default:"", 
    },
    email:{
        type:String,
        default:"",
        unique :true
    },
    name:{
        type:String,
        default : ""
    },
    type:{
        type:String,
        default : null
    },
    password:{
        type:String,
        default:""
    },
    phone:{
         type:String,
            default:""
    }
})

const user = new mongoose.model("users",userModel)
export default user