import mongoose from "mongoose";

let Schema = mongoose.Schema;
let caloriesSchema = new Schema({
  calories: {
    type: Number,
    required: true,
  },
  day:{
    type:String
  },
  userId:{
    type:Number,
    required:true
  },
  foods:[{
      type:String
    }]
});
export default mongoose.model("calorie", caloriesSchema);