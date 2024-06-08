const userController = require("../Controllers/user.controller");

module.exports = function(io) {
    // io ~~~~

    // on() => 듣기, emit() => 말하기
    io.on("connection", async (socket) => {
        console.log("client is connected...", socket.id);

        socket.on("login", async (userName, callback) => {
            // saveUser()로 userName과 socketId를 매개변수로 전달하여 유저정보 저장
            try { 
                const user = await userController.saveUser(userName, socket.id);
                callback({ ok: true, data:user });
            } catch(error) {
                callback({ ok: false, error: error.message });
            }
        })

        // 브라우저를 닫아서 연결이 끊기면 아래 내용 실행됨
        socket.on("disconnect", () => {
            console.log("user is disconnected...");
        })
    })
}