// Files finder App

"use-strict";

if (typeof process.argv[2] !== "string") {
  console.log(
    "\nFile Directory is required. Usage: node <server.js> <DIR> [PORT]"
  );
  process.exit(1);
}

const filepath = String.raw`${process.argv[2]}`;
const port = process.argv[3] || 3000;
const express = require("express");
const fs = require("fs/promises");
const fsSync = require("fs");

const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/static"));

async function walkDir(dirPath) {
  if (!fsSync.existsSync(dirPath)) {
    console.log(
      "\nProvided file directory doesn't exist. Please check the path and try again."
    );
    process.exit(1);
  }
  const entries = await fs.readdir(dirPath, {
    recursive: true,
    withFileTypes: true,
  });
  const entriesClean = entries.map((entry) => {
    const { name, path } = entry;
    return { name, path };
  });
  return entriesClean;
}

const AllFiles = walkDir(filepath);

app.get("/", (req, res) => {
  res.redirect("/app.html");
});

app.post("/search", (req, res) => {
  const { search } = req.body;
  AllFiles.then((filesArray) => {
    const searchFiles = filesArray.reduce((accum, file) => {
      if (file.name.toLowerCase().includes(search.toLowerCase())) {
        accum.push(file);
      }
      return accum;
    }, []);
    res.json(searchFiles);
  });
});

app.listen(port, () => {
  console.log(`File Finder app server is listening on port - ${port}`);
});
