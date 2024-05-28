import { Post } from '../models/post.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js'; // Make sure you have a utility function to upload files to Cloudinary
import {ApiError} from '../utils/ApiError.js';


export const createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    // Ensure title and content are provided and not empty
    if (!title || !content || title.trim() === "" || content.trim() === "") {
        throw new ApiError(400, "Title and content are required");
    }

    const videoLocalPath = req.files?.video?.[0]?.path;
    const imageLocalPath = req.files?.image?.[0]?.path;

    let videoUploadResult, imageUploadResult;

    // Upload video if provided
    if (videoLocalPath) {
        videoUploadResult = await uploadOnCloudinary(videoLocalPath);
        if (!videoUploadResult) {
            throw new ApiError(400, "Video file upload failed");
        }
    }

    // Upload image if provided
    if (imageLocalPath) {
        imageUploadResult = await uploadOnCloudinary(imageLocalPath);
        if (!imageUploadResult) {
            throw new ApiError(400, "Image file upload failed");
        }
    }

    // Create a new post with the provided data
    const post = new Post({
        title: title.trim(),
        content: content.trim(),
        video: videoUploadResult ? videoUploadResult.url : undefined,
        image: imageUploadResult ? imageUploadResult.url : undefined,
        author: req.user._id, // Assuming the user is authenticated and their ID is available in req.user
    });

    await post.save();
    res.status(201).json(post);
});

// Get all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username fullName avatar');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username fullName avatar');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a post
export const updatePost = async (req, res) => {
    try {
        const { title, content, image, video } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        post.title = title || post.title;
        post.content = content || post.content;
        post.image = image || post.image;
        post.video = video || post.video;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await post.remove();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like a post
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.likes.includes(req.user._id)) {
            return res.status(400).json({ message: 'Post already liked' });
        }
        post.likes.push(req.user._id);
        await post.save();
        console.log("liked");
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Unlike a post
export const unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
        await post.save();
        console.log("unliked");
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a comment to a post
export const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const comment = {
            user: req.user._id,
            content
        };
        post.comments.push(comment);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove a comment from a post
export const removeComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.commentId);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resharePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Create a new post object for resharing
   const resharedPost = new Post({
        title: post.title,
        content: post.content,
        image: post.image,
        video: post.video,
        author: userId,
    });

    await resharedPost.save();
    res.status(201).json(resharedPost);
});
