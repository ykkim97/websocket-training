const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
    {
        root: String,
        members: [
            {
                type: mongoose.Schema.ObjectId,
                unique: true,
                ref: "Users"
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);