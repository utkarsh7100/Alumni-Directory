const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const alumniRoutes = require("./routes/alumniRoutes");

app.use("/api/alumni", alumniRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});