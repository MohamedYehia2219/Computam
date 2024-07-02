import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ImageSchema = new Schema({
  userId: {
    type: Number,
    required:true,
  },
  imageUrl: {
    type: String,
    required:true,
  },
  description: {
    type: String,
    required:true,
  },
  name: {
    type: String,
    required:true,
  },
});
export default mongoose.model("Image", ImageSchema);
