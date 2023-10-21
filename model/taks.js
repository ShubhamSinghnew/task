import {mongoose , model , Schema} from "mongoose"

const  taks = new mongoose.Schema({
    userId : {
        type:String,
        default:"", 
    },
    title:{
        type:String,
        default:"",
       
    },
    description :{
        type:String,
        default:"",
       
    },
    status :{
        type:String,
        default:"",  
    },
})

const taskModel = new mongoose.model("taskModel", taks)

export default taskModel