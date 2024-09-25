import express from "express";
import fs from "fs";
import path from "path";
import { compileTs } from "./ts_compile";
import { exit } from "process";
import nocache from "nocache";

const app = express();
app.use(nocache());
const port = 3000;

console.log("Заводим сервак...");

const devServer = (req: express.Request, res: express.Response) => {
  let name = req.url;
  if (name == "" || name == "/") name = "index.html";
  const method = req.method;
  console.log(`${method} ${name}`);
  if (method !== "GET") {
    res.status(400).send("Only GET requests are allowed for frontend");
    return;
  }

  let pathToFile: string;
  const pathToBuild = path.join("build", name);
  if (name.endsWith(".js")) pathToFile = pathToBuild;
  else pathToFile = path.join("src", name);

  console.log(`Read file: ${pathToFile}`);
  if (!fs.existsSync(pathToFile)) {
    res.status(404).send();
    return;
  }
  if (fs.statSync(pathToFile).isDirectory()) {
    if (fs.existsSync(path.join(pathToBuild, "/index.js"))) {
      res.redirect(req.url + "/index.js");
      return;
    }
    res.status(400).send();
    return;
  }
  let fileContent: string;
  try {
    fileContent = fs.readFileSync(pathToFile, "utf8");
  } catch {
    res.status(500);
    return;
  }

  if (name.endsWith(".css")) {
    res.type("text/css");
  } else if (name.endsWith(".html")) {
    res.type("text/html");
  } else if (name.endsWith(".js")) {
    res.type("text/javascript");
  } else if (name.endsWith(".ts") || name.endsWith(".tsx")) {
    res.status(500);
    return;
  }
  res.send(fileContent);
  return;
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const result = compileTs();
if (result === false) {
  app.use("/", (req, res) => {
    res.type("text/html");
    res.send(fs.readFileSync("error_message.html", "utf8"));
  });
} else {
  app.use("/", devServer);
}

app.listen(3000, () => {
  console.log(`Сервак принимает запросы на порту ${port}`);
});
