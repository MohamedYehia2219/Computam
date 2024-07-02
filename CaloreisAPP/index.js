import express from"express";
import mongoose from "mongoose";
import cors from"cors"
import caloriesRouter from "./routes/CaloriesRoutes.js";

const port=3000;
const app=express();

app.use(express.json());
app.use(cors())
app.use("/calories",caloriesRouter);

app.listen(port,async (req,res)=>{
 await mongoose.connect(
   "mongodb+srv://newdevs715:49vSFaBoLBeaCHdE@computam.bgrvkpf.mongodb.net/caloriesApp");
  console.log("server started on port: " + port);
})

