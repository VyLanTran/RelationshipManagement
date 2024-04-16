import ChatModel from "../models/ChatModel.js";
import UserModel from "../models/UserModel.js";

export const getAllChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({});
    res.status(200).json(chats);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * Get all chats in which I'm a member
 */
export const getAllMyChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({
      members: { $in: [req.user._id] },
    })
      .populate("members") // add the whole data of each member (instead of just their id)
      .populate("admin")
      .sort({ updatedAt: -1 }); // sort from latest to oldest
    res.status(201).json(chats);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * route: /chats/search/?search={keyword}
 * given a keyword, return all chats such that:
 * we are a member
 * either chat name match
 * or some members has firstname, lastname, email, username match the keyword
 */
export const searchChats = async (req, res) => {
  try {
    const keyword = req.query.search;
    const chats = await ChatModel.find({
      members: { $in: [req.user._id] },
    })
      .populate("members")
      .populate("admin")
      .sort({ updatedAt: -1 });

    const filteredChats = chats.filter((chat) =>
      chat.members.some(
        (member) =>
          member.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          member.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          member.email.toLowerCase().includes(keyword.toLowerCase()) ||
          member.username.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    res.status(201).json(filteredChats);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * Access a chat that you are a member of
 */
export const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    const chat = await ChatModel.findOne({
      _id: chatId,
      members: { $elemMatch: { $eq: userId } },
    })
      .populate("members") // add the whole data of each member (instead of just their id)
      .populate("admin");
    if (!chat) {
      throw Error("You are not a member of this chat");
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 This is for private chat between 2 users
 If a chat already exists, get it
 Otherwise, create a new one
 */
// TODO: do we need messages, and do we need to sort them
export const getOrCreatePrivateChat = async (req, res) => {
  try {
    const { friendId } = req.body;
    const myself = req.user;
    const friend = await UserModel.findById(friendId);

    const chat = await ChatModel.find({
      isGroupChat: false,
      // two members of the chat must match
      $and: [{ members: { $all: [req.user._id, friendId] } }],
    })
      .populate("members")
      .populate("admin");

    // If the chat already exists, return it
    if (chat.length > 0) {
      res.status(201).json(chat[0]);
    }
    // If no such chat, create one
    else {
      try {
        const newChat = await ChatModel.create({
          chatName: friend.firstName + " " + friend.lastName,
          isGroupChat: false,
          members: [myself._id, friendId],
        });
        const chat = await ChatModel.findById(newChat._id)
          .populate("members")
          .populate("admin");
        res.status(201).json(chat);
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// TODO: In frontend, make sure that the dropdown doesnt allow adding ourself or duplicated users
export const createGroupChat = async (req, res) => {
  try {
    const { chatName, memberIds } = req.body;
    if (!chatName || !memberIds) {
      throw Error("All fields must be filled");
    }
    let parsedMembers = JSON.parse(memberIds);
    if (parsedMembers.length < 1) {
      throw Error(
        "A group chat must contain at least 2 people (including yourself)"
      );
    }
    // Add ourself as a member of this group
    parsedMembers.push(req.user._id);

    // From frontend, we will design logic to avoid adding duplicated users, but I will just make it a unique array here as well
    let uniqueMembersSet = new Set(parsedMembers);
    parsedMembers = Array.from(uniqueMembersSet);

    // Create a new GroupModel instance
    try {
      const newChat = await ChatModel.create({
        chatName,
        isGroupChat: true,
        admin: req.user._id,
        members: parsedMembers,
      });
      const chat = await ChatModel.findById(newChat._id)
        .populate("members")
        .populate("admin");
      res.status(201).json(chat);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// any member can rename the group
export const renameChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    const chat = await ChatModel.findOne({
      _id: chatId,
      members: { $elemMatch: { $eq: userId } },
    });
    if (!chat) {
      throw Error("You are not a member of this chat");
    }
    const { chatName } = req.body;
    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      { new: true }
    )
      .populate("members")
      .populate("admin");
    res.status(201).json(updatedChat);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * Any member of the group chat can add new members to the chat, MUST be group chat
 */
export const addMembers = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    const chat = await ChatModel.findOne({
      _id: chatId,
      members: { $elemMatch: { $eq: userId } },
    });
    if (!chat) {
      throw Error("You are not a member of this chat");
    }
    if (!chat.isGroupChat) {
      throw Error("You cannot add members to a private chat");
    }

    let { memberIds } = req.body;
    memberIds = JSON.parse(memberIds);

    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $addToSet: { members: { $each: memberIds } },
      },
      { new: true }
    )
      .populate("members")
      .populate("admin");
    res.status(201).json(updatedChat);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * Only admin can remove members from group chat
 */
// TODO: what if after deleting, there are <= 2 people
export const removeMembers = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    const chat = await ChatModel.findOne({
      _id: chatId,
      members: { $elemMatch: { $eq: userId } },
    });
    if (
      !chat ||
      (chat.admin && userId.toString() !== chat.admin._id.toString())
    ) {
      throw Error("Only admin can remove members from this group chat");
    }
    if (!chat.isGroupChat) {
      throw Error("You cannot remove members from a private chat");
    }

    let { memberIds } = req.body;
    memberIds = JSON.parse(memberIds);

    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $pull: { members: { $in: memberIds } },
      },
      { new: true }
    )
      .populate("members")
      .populate("admin");
    res.status(201).json(updatedChat);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
