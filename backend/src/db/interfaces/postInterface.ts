import mongoose, { Document } from "mongoose";

interface IPost extends Document {
    postedBy: mongoose.Types.ObjectId;
    text: string;
    img?: string;
    video?: string;
    mediaType: string;
    likes: mongoose.Types.ObjectId[];
    replies: {
        userId: mongoose.Types.ObjectId;
        text: string;
        userProfilePic: string;
        username: string;
    }[];
}

export default IPost;