import express from"express"
import newsRouter from "./routes/news.js";

const port = 3000;
const app = express();
app.use(express.json());
app.use('/news',newsRouter);
app.listen(port, async (req, res) => {
  console.log("server started on port: " + port);
});
