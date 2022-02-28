const cors = require("cors");
const express = require("express");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use("/api", require("./api/user"));
app.use("/api", require("./api/people"));
app.use("/api", require("./api/groups"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})