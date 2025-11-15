import mongoose, { Schema } from "mongoose";

const communitySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    admins: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
}, {
    timestamps: true,
});

const Community = mongoose.model("Community", communitySchema);

export default Community;