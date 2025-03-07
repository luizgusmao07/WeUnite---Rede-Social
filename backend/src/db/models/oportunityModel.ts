import mongoose, { Model, Schema } from "mongoose";
import IOportunity from "../interfaces/oportunityInterface.ts";

const oportunitySchema: Schema<IOportunity> = new Schema(
	{
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			maxLength: 50,
			required: true,
		},
		text: {
			type: String,
			maxLength: 500,
			required: true,
		},
		img: {
			type: String,
		},
		location: {
			type: String,
			required: true,
		},
		applicationDeadline: {
			type: Date,
			required: true,
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
		applications: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
		maxApplications: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Oportunity: Model<IOportunity> = mongoose.model<IOportunity>("Oportunity", oportunitySchema);

export default Oportunity;