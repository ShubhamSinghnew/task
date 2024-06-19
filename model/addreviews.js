import { mongoose, model, Schema } from "mongoose"

const reviewsModel = new mongoose.Schema({
    reviews_id : {
        type: String,
        default: "",
    },
    post_id: {
        type: String,
        default: ""
    },
    reviews_array: [
        {
            review: { type: String, default: "" },
            user_id : { type: String, default: "" }
        }
    ]
})

const reviews = new mongoose.model("reviews", reviewsModel)
export default reviews