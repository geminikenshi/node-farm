import fs from "fs";
import http from "http";
import url from "url";
import path from "path";
import replaceTemplate from "./modules/replaceTemplate.js";
import slugify from "slugify";
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

const data = fs.readFileSync(
  `${__dirname.slice(1)}/dev-data/data.json`,
  "utf-8"
);
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(
  `${__dirname.slice(1)}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname.slice(1)}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname.slice(1)}/templates/template-card.html`,
  "utf-8"
);
// const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, "", { "content-type": "text/html" });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.writeHead(200, "", { "content-type": "text/html" });
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, "", { "content-type": "application/json" });
    res.end(data);

    // Not found
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
