// models/post.model.js

import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String, // URL to the image
            trim: true
        },
        video: {
            type: String, // URL to the video
            trim: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                content: {
                    type: String,
                    required: true,
                    trim: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

export const Post = mongoose.model('Post', postSchema);
