module.exports = function(io) {
    // io ~~~~

    // on() => 듣기, emit() => 말하기
    io.on("connection", async (socket) => {
        console.log("client is connected...", socket.id)

        // 브라우저를 닫아서 연결이 끊기면 아래 내용 실행됨
        socket.on("disconnect", () => {
            console.log("user is disconnected...");
        })
    })
}