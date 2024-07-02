import mongoose from "mongoose";

const Schema = mongoose.Schema;
const medicalLogSchema = new Schema({
  userId: {
    type: Number,
    required:true,
  },
  date:{
    type: String,
    required:true
  },
  medicines:[{
      type:mongoose.Types.ObjectId,
      ref:"Medicine"
  }]
});
export default mongoose.model("MedicalLog", medicalLogSchema);
