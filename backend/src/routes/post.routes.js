// routes/post.js

import { Router } from 'express';
import { upload } from "../middlewares/multer.middleware.js";
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    removeComment,
    resharePost
} from '../controllers/post.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.route('/')
    .get(getPosts) // Get all posts

router.route('/:id')
    .get(getPostById) // Get a single post by ID

// Secured routes
router.route('/')
    .post(verifyJWT,
        upload.fields([
            {
                name: "video",
                maxCount: 1
            },
            {
                name: "image",
                maxCount: 1
            }
        ]),
        createPost); // Create a new post

router.route('/:id')
    .patch(verifyJWT, updatePost) // Update a post
    .delete(verifyJWT, deletePost); // Delete a post

router.route('/:id/like')
    .post(verifyJWT, likePost); // Like a post

router.route('/:id/unlike')
    .post(verifyJWT, unlikePost); // Unlike a post

router.route('/:id/comment')
    .post(verifyJWT, addComment); // Add a comment to a post

router.route('/:id/comment/:commentId')
    .delete(verifyJWT, removeComment); // Remove a comment from a post

    router.route('/reshare/:id').post(verifyJWT, resharePost);
export default router;
