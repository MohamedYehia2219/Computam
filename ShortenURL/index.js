import express from"express"
import mongoose from "mongoose";
import urlRoute from "./routes/urlRoute.js";

const port = 3000 || process.env.PORT;
const app = express();
app.use(express.json());

app.use("/urls",urlRoute);

app.listen(port, async (req, res) => {
  await mongoose.connect(
    "mongodb+srv://newdevs715:49vSFaBoLBeaCHdE@computam.bgrvkpf.mongodb.net/URLs"
  );
  console.log("server started on port: " + port);
});
