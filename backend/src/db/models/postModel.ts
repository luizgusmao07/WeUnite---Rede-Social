import mongoose, { Model, Schema } from "mongoose";
import IPost from "../interfaces/postInterface.ts";

const postSchema: Schema<IPost> = new Schema(
    {
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            maxLength: 500,
        },
        img: {
            type: String,
        },
        video: {
            type: String,
        },
        mediaType: {
            type: String,
            enum: ['image', 'video', 'none'],
            default: 'none'
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        replies: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                },
                userProfilePic: {
                    type: String,
                },
                username: {
                    type: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);

export default Post;
