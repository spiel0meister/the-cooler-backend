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

const UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
});

const User = model("User", UserSchema);

app.use(session({
    secret: "very-secret-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.use(cors());

app.get("/api/logout", (req, res) => {
    if (req.session.email == null) {
        res.sendStatus(400);
        return;
    }

    res.session.email = null;
    res.sendStatus(200);
});

app.get("/api/login", async (req, res) => {
    const email = req.query.email;
    if (email == null) {
        console.error("No email");
        res.sendStatus(400);
        return;
    }

    const password = req.query.password;
    if (password == null) {
        console.error("No password");
        res.sendStatus(400);
        return;
    }

    const user = await User.findOne({email, password});
    if (!user) {
        res.sendStatus(400);
        return;
    }

    res.session.email = user.email;
    res.sendStatus(200);
});

app.get("/api/signup", async (req, res) => {
    const name = req.query.name;
    if (name == null) {
        console.error("No name");
        res.sendStatus(400);
        return;
    }

    const surname = req.query.surname;
    if (surname == null) {
        console.error("No surname");
        res.sendStatus(400);
        return;
    }

    const email = req.query.email;
    if (email == null) {
        console.error("No email");
        res.sendStatus(400);
        return;
    }

    const password = req.query.password;
    if (password == null) {
        console.error("No password");
        res.sendStatus(400);
        return;
    }

    const user = new User({ name, surname, email, password });

    const userAlreadyExits = await User.findOne({ email }).exec();
    if (userAlreadyExits) {
        console.error("Already exists");
        res.sendStatus(400);
        return;
    }

    await user.save();
});

server.listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});
