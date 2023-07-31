const express = require("express");
const app = express();
require("dotenv").config();

const db = require("./database/mongoConnection");
db.connect();

const cluster = require("cluster");
const os = require("os");


const router = require("./routes");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());


// Number of CPU cores
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.use("/", router);

  app.use((req, res) => {
    res.status(404).json({
      message: "Page not Found",
    });
  });

  app.listen(4000, () => {
    console.log("Server Connected");
  });
}
