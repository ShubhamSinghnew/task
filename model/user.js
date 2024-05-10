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
    officeName : {
        type : String,
        default:""
    },
    mahareraNo:{
        type : String,
        default:""
    },
    locations:{
        type : String,
        default:""
    },
    profilePicture:{
        type : String,
        default : null
    },
    agreeToPolicy:{
        type : String,
        default : false
    },
})

const user = new mongoose.model("users",userModel)
export default user