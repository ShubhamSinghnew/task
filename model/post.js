import { mongoose, model, Schema } from "mongoose"

const postmodel = new mongoose.Schema({
    post_id: {
        type: String,
        default: "",
    },
    user_id: {
        type: String,
        default: "",
    },
    post_title: {
        type: String,
        default: "",
    },
    auther: {
        type: String,
        default: ""
    },
    post_time: {
        type: String,
        default: null
    },
    fees: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    subject: {
        type: String,
        default: ""
    },
    board: {
        type: String,
        default: ""
    },
    gender : {
        type: String,
        default: ""
    },
    phone : {
        type: String,
        default: ""
    }

})
const post = new mongoose.model("post", postmodel)
export default post