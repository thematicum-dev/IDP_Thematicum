import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
const schema = new Schema({
    seqNr: {
        type: Number,
        required: true,
        unique: true
    },
    fundName: {
        type: String,
        required: true,
        unique: true
    },
    fundParent: {
        type: String,
        required: true,
    },
    fundIsin: {
        type: String,
        required: true,
        unique: true
    },
    addedBy: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
});

schema.plugin(mongooseUniqueValidator);
export default mongoose.model('Fund', schema);