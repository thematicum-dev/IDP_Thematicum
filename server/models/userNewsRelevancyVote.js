import mongoose from "mongoose";

const Schema = mongoose.Schema;
const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    news: { type: Schema.Types.ObjectId, ref: 'news' },
    upvoted: {
        type: Boolean,
        required: true,
        default: false
    },
    downvoted: {
        type: Boolean,
        required: true,
        default: false
    }
});

export default mongoose.model('UserNewsRelevancyVote', schema);