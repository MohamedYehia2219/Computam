import mongoose from "mongoose";

const Schema = mongoose.Schema;
const AlbumSchema = new Schema({
 name:{
    type:String,
    required:true,
  },
  relatedNames:[{
      type:String
    }],
  userId: {
    type: Number,
    required:true,
  },
  images:[{
      type:mongoose.Types.ObjectId,
      ref:"Image"
  }]
});
export default mongoose.model("ALbum", AlbumSchema);
