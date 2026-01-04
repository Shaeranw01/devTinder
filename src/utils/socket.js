const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const { timeStamp } = require("console");
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    //handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          if (!userId || !targetUserId || !text) {
            return socket.emit("errorMessage", {
              message: "Missing required fields",
            });
          }
          const roomId = getSecretRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });
          //save msg to database

          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            text,
            senderId: userId,
          });
        } catch (err) {
          console.error("sendMessage error:", err);
          socket.emit("errorMessage", { message: "Failed to send message" });
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = { initializeSocket };
