import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    userId:{
        type: Number
    },
    fullURL:{
        type:String,
    },
    shortURL:{
        type:String,
        unique:true
    }
});
export default mongoose.model("url",urlSchema);