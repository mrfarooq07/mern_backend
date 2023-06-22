const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const createChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(req.body);

  if (!userId) {
    console.log("ID is required");
    return res.sendStatus(401);
  }

  //Lets get data from chat table along with latest message
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

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
      users: [req.user._id, userId],
    };

    //Lets query to db to create the new chat
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChat = expressAsyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {}
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.members) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  var members = JSON.parse(req.body.members);
  if (members.length < 2) {
    return res
      .status(400)
      .send({ message: "Members should be 2 or greater than two" });
  }

  /**
   * The user that is currently login is also be the member of this group, so push the current login user into group as well
   */
  members.push(req.user);

  const groupChat = await Chat.create({
    chatName: req.body.name,
    users: members,
    isGroupChat: true,
    groupAdmin: req.user,
  });

  try {
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroupName = expressAsyncHandler(async (req, res) => {
  const { chatID, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatID,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
  const { chatID, userID } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatID,
    {
      $push: { users: userID },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (added) {
    res.json(added);
  } else {
    res.status(404);
    throw new Error("Chat not found");
  }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatID, userID } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatID,
    {
      $pull: { users: userID },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (removed) {
    res.json(removed);
  } else {
    res.status(404);
    throw new Error("Chat not found");
  }
});

module.exports = {
  createChat,
  fetchChat,
  createGroupChat,
  renameGroupName,
  addToGroup,
  removeFromGroup,
};
