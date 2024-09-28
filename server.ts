import express from "express";
import fs from "fs";
import path from "path";
import { compileTs } from "./dev_server/ts_compile";
import { exit } from "process";
import nocache from "nocache";

const app = express();
app.use(nocache());
const port = 3000;

const mimeTypeMap: any = {
  css: "text/css",
  html: "text/html",
  js: "text/javascript",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  svg: "image/svg+xml",
};

console.log("Заводим сервак...");

const devServer = (req: express.Request, res: express.Response) => {
  let name = req.url;
  if (name == "" || name == "/") name = "index.html";
  if (name.endsWith(".ts") || name.endsWith(".tsx")) {
    res.status(400);
    res.send();
    return;
  }
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
  let fileContent: Buffer;
  try {
    fileContent = fs.readFileSync(pathToFile);
  } catch {
    res.status(500);
    return;
  }

  const nameSplitted = name.split(".");
  const nameExtension = nameSplitted[nameSplitted.length - 1];
  if (mimeTypeMap[nameExtension] !== undefined) {
    res.type(mimeTypeMap[nameExtension]);
  }
  res.send(fileContent);
  return;
};

const result = compileTs();
if (result === false) {
  app.use("/", (req, res) => {
    res.type("text/html");
    res.send(fs.readFileSync("dev_server/error_message.html", "utf8"));
  });
} else {
  app.use("/", devServer);
}

app.listen(3000, () => {
  console.log(`Сервак принимает запросы на http://localhost:${port}`);
});
