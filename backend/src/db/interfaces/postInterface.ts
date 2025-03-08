import mongoose, { Document } from "mongoose";

interface IPost extends Document {
    postId: mongoose.Types.ObjectId;
    postedBy: mongoose.Types.ObjectId;
    text: string;
    img?: string;
    video?: string;
    mediaType: string;
    likes: mongoose.Types.ObjectId[];
    replies: {
        _id: mongoose.Types.ObjectId;
        userId: mongoose.Types.ObjectId;
        text: string;
        userProfilePic: string;
        username: string;
        createdAt: Date;
    }[];
}

export default IPost;