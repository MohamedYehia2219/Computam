import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    fullURL:{
        type:String,
        unique:true
    },
    shortURL:{
        type:String,
        unique:true
    },
    clickCounter:{
        type:Number
    }
});
export default mongoose.model("url",urlSchema);