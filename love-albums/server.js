import express from "express";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("public"));

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

app.post("/log", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const ua = req.headers["user-agent"] || "";
  await db.collection("analytics").add({
    ...req.body,
    ip,
    ua,
    ts: admin.firestore.FieldValue.serverTimestamp()
  });
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on", PORT));
