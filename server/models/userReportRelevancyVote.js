import mongoose from "mongoose";

const Schema = mongoose.Schema;
const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    report: { type: Schema.Types.ObjectId, ref: 'pdfReport' },
    relevant: {
        type: Boolean,
        required: true,
        default: false
    }
});

export default mongoose.model('UserReportRelevancyVote', schema);