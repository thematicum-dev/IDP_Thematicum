/**
 *  Author: Taimoor Alam MSc. Informatics TUM
 *  Date of creation: May 7, 2017
 *  Purpose of this file: This file contains the model for keeping track of user login attempts.
 *  How does the user login attempt mechanism work:
 * 
 */

import mongoose from 'mongoose';
import constants from '../utilities/constants';

const Schema = mongoose.Schema;

const schema = new Schema({
    email: { 
	    type:[String],
	    unique: true
	 },
    status: {
        type: [Number],
        required: true,
        min: constants.MIN_USER_LOGIN_STATUS,
        max: constants.MAX_USER_LOGIN_STATUS
    },
    count: {
        type: [Number],
        required: true,
        min: constants.MIN_USER_LOGIN_COUNT,
        max: constants.MAX_USER_LOGIN_COUNT
    },
    time_since_first_unsuccessful_attempt: [{
        type: [Date],
        required: true,
        default: Date.now
    }]
});

schema.index({user: 1}, {unique: true});

export default mongoose.model('UserLoginInfo', schema);