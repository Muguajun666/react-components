import express from "express";
import multer from "multer";
import cors from "cors";
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fs.mkdirSync(path.join(process.cwd(), 'uploads'))
    } catch(e) {}
    cb(null, path.join(process.cwd(), 'uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
})

const upload = multer({
  dest: "uploads/",
  storage
});

app.post("/upload", upload.single("file"), (req, res, next) => {
  console.log("req.file", req.file);
  console.log("req.body", req.body);

  res.end(
    JSON.stringify({
      message: "success",
    })
  );
});

app.listen(3333, () => {
  console.log("server is running on http://localhost:3333");
});
