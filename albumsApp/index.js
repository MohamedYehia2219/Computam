import express from"express"
import cors from "cors";
import albumRouter from "./routes/AlbumRoutes.js";
import imageRouter from "./routes/ImageRoutes.js";
import mongoose from "mongoose";

const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/images",imageRouter);
app.use("/albums",albumRouter);

app.listen(port, async (req, res) => {
  await mongoose.connect(
    "mongodb+srv://newdevs715:49vSFaBoLBeaCHdE@computam.bgrvkpf.mongodb.net/PhotoManagement"
  );
  console.log("server started on port: " + port);
});
