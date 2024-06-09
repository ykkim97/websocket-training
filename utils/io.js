const chatController = require("../Controllers/chat.controller");
const roomController = require("../Controllers/room.controller");
const userController = require("../Controllers/user.controller");

module.exports = function(io) {
    // io ~~~~

    // on() => 듣기, emit() => 말하기
    io.on("connection", async (socket) => {
        console.log("client is connected...", socket.id);
        // 채팅방 리스트 가져와서 클라이언트에 전달
        socket.emit("rooms", await roomController.getAllRooms()); 

        socket.on("login", async (userName, callback) => {
            // saveUser()로 userName과 socketId를 매개변수로 전달하여 유저정보 저장
            try { 
                const user = await userController.saveUser(userName, socket.id);

                // system message도 저장(방 입장/퇴장 메세지)
                // const welcomeMessage = {
                //     chat: `${user.name}님이 입장하였습니다.`,
                //     user: { 
                //         id: null,
                //         name: "system",
                //     }
                // }
                // io.emit("message", welcomeMessage);
                callback({ ok: true, data:user });
            } catch(error) {
                callback({ ok: false, error: error.message });
            }
        })

        socket.on("sendMessage", async (message, callback) => {
            try { 
                // socket.id로 유저를 먼저 찾는다.
                const user = await userController.checkUser(socket.id);
                // 가져온 유저정보를 바탕으로 받은 메세지를 저장
                const newMessage = await chatController.saveChat(message, user);

                io.to(user.room.toString()).emit("message", newMessage);
    
                callback({ ok: true });
            } catch(error) {
                callback({ ok: false, error: error.message });
            }
        })

        socket.on("joinRoom", async (roomId, callback) => {
            try {
                const user = await userController.checkUser(socket.id);
                await roomController.joinRoom(roomId, user);

                socket.join(user.room.toString());
                const welcomeMessage = {
                    chat: `${user.name} is joined to this room`,
                    user: { id: null, name: "system" },
                };
                io.to(user.room.toString()).emit("message", welcomeMessage);
                io.emit("rooms", await roomController.getAllRooms());
                callback({ ok: true });
            } catch(error) {
                callback({ ok: false, error: error.message });
            }
        })

        socket.on("leaveRoom", async (_, callback) => {
            try {
                const user = await userController.checkUser(socket.id);
                await roomController.leaveRoom(user);
                const leaveMessage = {
                    chat: `${user.name} left this room`,
                    user: { id: null, name: "system" },
                };
                socket.broadcast.to(user.room.toString()).emit("message", leaveMessage); // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다 
                io.emit("rooms", await roomController.getAllRooms());
                socket.leave(user.room.toString()); // join했던 방을 떠남 
                callback({ ok: true });
            } catch (error) {
                callback({ ok: false, message: error.message });
            }
        });

        // 브라우저를 닫아서 연결이 끊기면 아래 내용 실행됨
        socket.on("disconnect", () => {
            console.log("user is disconnected...");
        })
    })
}