import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema(
    {
        creator: {
            type: Object,
        },
        type: {
            type: String,
        },
        title: {
            type: String,
        },
        postId: {
            type: String,
        },
        userId: {
            type: String,
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
