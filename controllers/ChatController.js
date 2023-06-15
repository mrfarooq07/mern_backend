const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const createChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("ID is required");
        return res.sendStatus(401);
    }

    //Lets get data from chat table along with latest message
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage");

    //now we need sender ID of latest message as well, lets do it
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    //lets check if found any data from DB & return. Else create the chat
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }

        //Lets query to db to create the new chat
        try {
            const createdChat = await Chat.creat(chatData);
            const fullChat = await Chat.findOne({ _id: createChat._id }).populate("users", "-password");
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }

});

module.exports = { createChat };