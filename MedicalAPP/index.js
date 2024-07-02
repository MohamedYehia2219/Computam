import express from"express"
import mongoose from "mongoose";
import medecineRoute from "./routes/medicineRoute.js";
import medicalLogRoute from "./routes/medicalLogRoute.js";

const port = 3000;
const app = express();
app.use(express.json());

app.use("/medicines",medecineRoute);
app.use("/medicalLog",medicalLogRoute);

app.listen(port, async (req, res) => {
  await mongoose.connect(
    "mongodb+srv://newdevs715:49vSFaBoLBeaCHdE@computam.bgrvkpf.mongodb.net/MedicalApp"
  );
  console.log("server started on port: " + port);
});
