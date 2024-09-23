import express from "express";
import fs from "fs";
import path from "path";
import { compileTs } from "./ts_compile";
const app = express();
const port = 3000;

app.use("/", (req, res) => {
  let name = req.url;
  if (name == "" || name == "/") name = "index.html";
  const method = req.method;
  console.log(`${method} ${name}`);
  if (method !== "GET") {
    res.status(400).send("Only GET requests are allowed for frontend");
  }
  const pathToFile = path.join("src", name);
  console.log(`Read file: ${pathToFile}`);
  let fileContent: string;
  try {
    fileContent = fs.readFileSync(pathToFile, "utf8");
  } catch {
    res.status(404) //TODO чекать, не директория ли - запрашиваемый ресурс
  }
  if (!fs.existsSync(pathToFile)) {
    res.status(404)
    return;
  }
  if (name.endsWith(".css")) {
    res.type("text/css");
  } else if (name.endsWith(".js")) {
    res.type("text/javascript");
  } else if (name.endsWith(".ts")) {
    const result = compileTs(pathToFile);
    if (result.status === "ok") {
      console.log("here")
      res.type("text/javascript");
      res.send(result.result);
      return;
    } else {
      console.log("##### TS COMPILATION ERRORS");
      console.log(result.errors.join("\n"));
      res.status(500).send(result.errors.join("\n"));
      return;
    }
  }
  res.send(fileContent);
});

app.listen(3000, () => {
  console.log(`Development server listening at port ${port}`);
});
