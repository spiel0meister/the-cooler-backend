import { createServer } from "http";
import { loadEnvFile } from "process";
import express from "express";
import session from "express-session";
import { MongoClient } from "mongodb";

loadEnvFile(".env");

const port = 6969;

const app = express();
const server = createServer(app);

const mongo_uri = process.env.MONGO_URI;

if (mongo_uri == undefined) throw "No mongo URI";

const client = new MongoClient(mongo_uri);

let conn;
try {
    conn = await client.connect();
} catch (e) {
    throw e;
}

app.use(session({
    secret: "very-secret-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
}));

app.get("/api/login", (req, res) => {
    res.send("TODO");
});

app.get("/api/signup", (req, res) => {
    res.send("TODO");
});

server.listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});
