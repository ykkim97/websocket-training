const Chat = require("../Models/chat");

const chatController = {};

chatController.saveChat = async (message, user) => {
    // 메세지 저장
    const newMessage = new Chat({ 
        chat : message,
        user : {
            id : user._id,
            name : user.name,
        },
    })

    await newMessage.save();
    return newMessage;
}

module.exports = chatController;