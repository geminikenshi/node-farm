import fs from "fs";
import http from "http";
import url from "url";
import path from "path";
//////
// Files

// // Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("file written");

// // Non-blocking, asynchronous way

// fs.readFile("txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log(`Error reading file💣 ${err.message}`);
//   fs.readFile(`txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("File has been written 😊");
//       });
//     });
//   });
// });

//////
// Server

// dirname is not defined in ES module scope
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
console.log(__dirname);

const fileData = fs.readFileSync(
  `${__dirname.slice(1)}/dev-data/data.json`,
  "utf-8"
);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the OVERVIEW");
  } else if (pathName === "/product") {
    res.end("This is the PRODUCT");
  } else if (pathName === "/api") {
    res.writeHead(200, "", { "content-type": "application/json" });
    res.end(fileData);
  } else {
    res.writeHead(404, "", {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h2>Page not found!</h2>");
  }
});

server.listen(8080, "localhost", () => {
  console.log("Server listening on port 8080");
});
