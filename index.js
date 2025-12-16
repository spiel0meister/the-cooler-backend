import { createServer } from "node:http";
import process from "node:process";
import express from "express";
import session from "express-session";
import mongoose, { Schema, model, connect } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const port = 6969;

const app = express();
const server = createServer(app);

const mongo_uri = process.env.MONGO_URI;

if (mongo_uri == undefined) throw "No mongo URI";
connect(mongo_uri);

app.use(cors());
app.use(session({
    secret: "very-secret-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

const UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
});

const User = model("User", UserSchema);

app.get("/api/test", (req, res) => {
    console.log(req.session);
    res.sendStatus(200);
})

app.get("/api/logout", (req, res) => {
    if (req.session.userId == null) {
        res.status(400).send("Not logged in");
        return;
    }

    req.session.userId = null;
    res.sendStatus(200);
});

app.get("/api/login", async (req, res) => {
    const email = req.query.email;
    if (email == null) {
        res.status(400).send("No email");
        return;
    }

    const password = req.query.password;
    if (password == null) {
        res.status(400).send("No password");
        return;
    }

    const user = await User.findOne({ email, password }).exec();
    if (!user) {
        res.status(400).send("No user");
        return;
    }

    req.session.userId = user._id;
    res.sendStatus(200);
});

app.get("/api/signup", async (req, res) => {
    const name = req.query.name;
    if (name == null) {
        res.status(400).send("No name");
        return;
    }

    const surname = req.query.surname;
    if (surname == null) {
        res.status(400).send("No surname");
        return;
    }

    const email = req.query.email;
    if (email == null) {
        res.status(400).send("No email");
        return;
    }

    const password = req.query.password;
    if (password == null) {
        res.status(400).send("No password");
        return;
    }

    const user = new User({ name, surname, email, password });

    const userAlreadyExits = await User.findOne({ email }).exec();
    if (userAlreadyExits) {
        res.status(400).send("User already exists");
        return;
    }

    await user.save();
});

server.listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});
