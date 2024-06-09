const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require('cors');
const app = express();

const Room = require("./Models/room");

app.use(cors());

// 임의 채팅방을 만들어주기
app.get("/", async (req, res) => {
    await Room.insertMany([
        {
            room:"js 스터디 단톡방",
            members: [],
        },
        // {
        //     root:"학과 단톡방",
        //     members: [],
        // },
        // {
        //     room: "친구들 단톡방",
        //     members: [],
        // },
    ])
        .then(() => res.send("ok"))
        .catch((error) => res.send(error));
})

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("connected to database"));

module.exports = app;

