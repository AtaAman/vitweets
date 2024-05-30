import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: false  // Make the post field optional
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
