import mongoose from "mongoose";

const Schema = mongoose.Schema;
const medicineSchema = new Schema({
 name:{
    type:String,
    required:true,
  },
  times:[{
      type:String
    }],
  userId: {
    type: Number,
    required:true,
  },
  note:{
    type:String,
  },
  history:[{
    type:String
  }],
  info:[{
    type:String
  }]
});
export default mongoose.model("Medicine", medicineSchema);
