import { mongoose, model, Schema } from "mongoose"

const postmodel = new mongoose.Schema({
    user_id : {
        type: String,
        default: "",
    },
    id: {
        type: String,
        default: "",
    },
    amount: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: "",
    },
    order_id: {
        type: String,
        default: ""
    },
    vpa: {
        type: String,
        default: null
    },
    contact: {
        type: String,
        default: ""
    },
    plan: {
        type: String,
        default: ""
    }

})

const post = new mongoose.model("post", postmodel)
export default post