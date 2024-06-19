import { mongoose, model, Schema } from "mongoose"

const savepostmodel = new mongoose.Schema({
    user_id : {
        type : String,
        default : ""
    },
    post_id: [{type : String, default : ""}]
})

const savepost = new mongoose.model("savepost", savepostmodel)
export default savepost