import express from "express";
import fs from "fs";
import path from "path";
const app = express();
const port = 3000;

app.use("/", (req, res) => {
  const name = req.url;
  const method = req.method;
  console.log(`${method} ${name}`);
  if (method !== "GET") {
    res.status(400).send("Only GET requests are allowed for frontend");
  }
  const pathToFile = path.join("src", name);
  const fileContent = fs.readFileSync(pathToFile, "utf8");
  if (!fs.existsSync(pathToFile)) {
    res.status(404).send("File not found");
    return;
  }
  if (name.endsWith(".css")) {
    res.type("text/css");
  } else if (name.endsWith(".js")) {
    res.type("text/javascript");
  } else if (name.endsWith(".ts")) {
    res.type("text/javascript");
  }
  res.send(fileContent);
});

app.listen(3000, () => {
  console.log(`Development server listening at port ${port}`);
});
