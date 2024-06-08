const User = require("../Models/user");

const userController = {};

userController.saveUser = async (userName, socketId) => {
    // --이미 존재하는 유저인지 확인 처리--
    let user = await User.findOne({ name : userName });

    // 존재하지 않다면 새로 생성
    if (!user) {
        user = new User({ 
            name : userName,
            token : socketId,
            online : true,
        })
    }
    // 이미 있는 유저라면 연결정보 token값만 바꾸기 (token이 socketId가 되기 때문)
    user.token = socketId;
    user.online = true;

    await user.save();
    return user;
}

userController.checkUser = async (socketId) => {
    const user = await User.findOne({ token : socketId });
    if (!user) throw new Error("user not found...");
    return user;
}

module.exports = userController;