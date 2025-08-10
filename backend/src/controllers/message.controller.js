import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";

export const getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
          "-password"
        );
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getMessages = async (req, res) => {
    try{
        const { userId } = req.params;
        const loggedInUserId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: userId },
                { senderId: userId, receiverId: loggedInUserId }
            ]})
        // }).populate("sender", "fullName profilePic").populate("receiver", "fullName profilePic");
        res.status(200).json(messages);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const sendMessage = async (req, res) => {
    try {
        const {text,image} = req.body;
        const { userId } = req.params;
        const loggedInUserId = req.user._id;
        let ImageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            ImageUrl = uploadResponse.secure_url;
            console.log(uploadResponse);
        }
        // console.log("UserId"+userId);
        const newMessage = await Message.create({
            senderId: loggedInUserId,
            receiverId: userId,
            text,
            media: ImageUrl
        });
        await newMessage.save();
        const receiverSocketId=getReceiverSocketId(userId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        return res.status(200).json(newMessage);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Interna server error" });
    }
}