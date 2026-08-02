import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import download from "image-downloader";
import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
import multer from "multer";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";

import User from "./models/User.js";
import Place from "./models/Place.js";
import Booking from "./models/Booking.js";
import { connectDb } from "./config/db.js";

dotenv.config();

const app = express();
const ENV = app.get("env");
const BUCKET = "hashbnb";
const {
  PORT = 3000,
  JWT_SECRET,
  S3_ACCESS_KEY,
  S3_SECRET_KEY,
  FRONTEND_URL = "http://localhost:5173",
} = process.env;
const bcryptSalt = bcrypt.genSaltSync(10);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectDB = connectDb;

const JWTVerify = async (req) => {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, JWT_SECRET, {}, async (error, userInfo) => {
      if (error) throw error;

      resolve(userInfo);
    });
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const [newPhotoName, photoPath] = photoNamePath(file.originalname);
    cb(null, photoPath.replace(newPhotoName, ""));
  },

  filename: function (req, file, cb) {
    const [newPhotoName, photoPath] = photoNamePath(file.originalname);
    cb(null, newPhotoName);
  },
});

const upload = multer({ storage });

const photoNamePath = (link) => {
  let photoExtension = path.extname(link);

  photoExtension = photoExtension.includes("?")
    ? photoExtension.substring(0, photoExtension.indexOf("?"))
    : photoExtension;

  const newPhotoName = Date.now() + photoExtension;
  const photoPath = __dirname + "/tmp/" + newPhotoName;

  return [newPhotoName, photoPath];
};

const uploadToS3 = async (path, filename, mimetype) => {
  const client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
  });

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Body: fs.readFileSync(path),
        Key: filename,
        ContentType: mimetype,
        ACL: "public-read",
      })
    );

    return `https://${BUCKET}.s3.amazonaws.com/${filename}`;
  } catch (error) {
    throw error;
  }
};

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
const allowedOrigins = new Set([
  FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Origem não permitida pelo CORS."));
    },
  })
);

app.get("/api/profile", async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    const userInfo = await JWTVerify(req);

    res.status(200).json(userInfo);
  } else {
    res.status(200).json(null);
  }
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await connectDB();
    const newUser = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    const { _id } = newUser;
    const newObjUser = { name, email, _id };

    res.json(newObjUser);
  } catch (error) {
    const isDuplicateEmail = error?.code === 11000;
    const isDatabaseUnavailable = error?.code === "DATABASE_UNAVAILABLE";
    res.status(isDuplicateEmail ? 409 : isDatabaseUnavailable ? 503 : 500).json({
      message: isDuplicateEmail
        ? "Este e-mail já está cadastrado."
        : isDatabaseUnavailable
          ? "O banco de dados está indisponível. Verifique a variável MONGO_URI do backend."
        : "Não foi possível concluir o cadastro. Tente novamente.",
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    await connectDB();
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      const correctPassword = bcrypt.compareSync(password, foundUser.password);

      if (correctPassword) {
        const { name, _id: id } = foundUser;
        const newObjUser = { name, email, id };

        jwt.sign(newObjUser, JWT_SECRET, {}, (error, token) => {
          if (error) res.status(500).json(error);

          res.cookie("token", token).json(newObjUser);
        });
      } else {
        res.status(400).json("Senha errada");
      }
    } else {
      res.status(400).json("Usuário não encontrado");
    }
  } catch (error) {
    const isDatabaseUnavailable = error?.code === "DATABASE_UNAVAILABLE";
    res.status(isDatabaseUnavailable ? 503 : 500).json({
      message: isDatabaseUnavailable
        ? "O banco de dados está indisponível. Verifique a variável MONGO_URI do backend."
        : "Não foi possível efetuar o login.",
    });
  }
});

app.post("/api/logout", (req, res) => {
  res.cookie("token", "").json("Cookie excluído!");
});

app.post("/api/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const [newPhotoName, photoPath] = photoNamePath(link);
  const mimetype = mime.lookup(photoPath);

  const options = {
    url: link,
    dest: photoPath,
  };

  try {
    await download.image(options);

    const newURL = await uploadToS3(photoPath, newPhotoName, mimetype);

    res.json(newURL);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/api/upload", upload.array("files", 100), async (req, res) => {
  const forEachPromise = new Promise((resolve, reject) => {
    const filenameList = [];

    req.files.forEach(async (file, index) => {
      const { path, filename, mimetype } = file;

      const newURL = await uploadToS3(path, filename, mimetype);

      filenameList.push(newURL);

      if (index === req.files.length - 1) resolve(filenameList);
    });
  });

  const resolvedList = await forEachPromise;

  res.json(resolvedList);
});

app.post("/api/places", async (req, res) => {
  connectDB();

  const userInfo = await JWTVerify(req);
  const {
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    guests: maxGuests,
    price,
  } = req.body;

  try {
    const newPlace = await Place.create({
      owner: userInfo.id,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });

    res.json(newPlace);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/api/places-user", async (req, res) => {
  connectDB();

  const userInfo = await JWTVerify(req);

  try {
    const placesList = await Place.find({ owner: userInfo.id });

    res.json(placesList);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

app.get("/api/places", async (req, res) => {
  connectDB();

  try {
    const placesList = await Place.find();

    res.json(placesList);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

app.get("/api/places/:id", async (req, res) => {
  connectDB();

  const { id } = req.params;

  try {
    const placeDoc = await Place.findById(id);

    res.json(placeDoc);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

app.put("/api/places/:id", async (req, res) => {
  connectDB();

  const { id } = req.params;
  const {
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    guests: maxGuests,
    price,
  } = req.body;

  const userInfo = await JWTVerify(req);

  try {
    const placeDoc = await Place.findById(id);

    if (userInfo.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });

      await placeDoc.save();

      res.json(placeDoc);
    } else {
      res.json(
        "Não foi alterado, ID do usuário diferente do proprietário do Documento"
      );
    }
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

app.post("/api/booking", async (req, res) => {
  connectDB();

  const { checkIn, checkOut, price, guests, user, place } = req.body;

  try {
    const bookingDoc = await Booking.create({
      checkIn,
      checkOut,
      price,
      guests,
      user,
      place,
    });

    res.json(bookingDoc);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

app.get("/api/bookings", async (req, res) => {
  connectDB();

  try {
    const userInfo = await JWTVerify(req);
    const bookingsDocs = await Booking.find({ user: userInfo.id }).populate(
      "place"
    );

    res.json(bookingsDocs);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

app.get("/api/bookings/:id", async (req, res) => {
  connectDB();

  const { id } = req.params;

  try {
    const bookingDoc = await Booking.findById(id);

    res.json(bookingDoc);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

app.use(express.static(path.join(__dirname, "../front-end/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/dist/index.html"));
});

app.listen(PORT, () => console.log("Servidor está rodando na porta " + PORT));
