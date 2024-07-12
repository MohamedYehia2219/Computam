import express from"express"

const port = 3000;
const app = express();
app.use(express.json());
app.listen(port, async (req, res) => {
  console.log("server started on port: " + port);
});
