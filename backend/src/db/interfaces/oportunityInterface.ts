import mongoose, { Document } from "mongoose";

interface IOportunity extends Document {
    postedBy: mongoose.Types.ObjectId;
    title: string;
    text: string;
    img?: string;
    location: string;
    applicationDeadline: Date;
    likes: mongoose.Types.ObjectId[];
    replies: {
        userId: mongoose.Types.ObjectId;
        text: string;
        userProfilePic: string;
        username: string;
    }[];
    applications: mongoose.Types.ObjectId[];
    maxApplications: number;
}

export default IOportunity;