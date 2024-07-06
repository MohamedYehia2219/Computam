import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    userId:{
        type: Number
    },
    fullURL:{
        type:String,
    }
});
export default mongoose.model("userURLs",urlSchema);