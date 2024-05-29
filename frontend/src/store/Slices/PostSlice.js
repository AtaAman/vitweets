import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axios";
import toast from "react-hot-toast";

const initialState = {
    loading: false,
    posts: [],
    post: null,
    error: null,
};

export const createPost = createAsyncThunk("posts/createPost", async (formData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/post/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success("Post created successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

export const getPosts = createAsyncThunk("posts/getPosts", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/post/");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getPostById = createAsyncThunk("posts/getPostById", async (postId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/post/${postId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updatePost = createAsyncThunk("posts/updatePost", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch(`/post/${data.id}`, data);
        toast.success("Post updated successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (postId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`/post/${postId}`);
        toast.success("Post deleted successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

export const likePost = createAsyncThunk("posts/likePost", async (postId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/post/${postId}/like`);
        toast.success("Post liked!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

export const unlikePost = createAsyncThunk("posts/unlikePost", async (postId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/post/${postId}/unlike`);
        toast.success("Post unliked!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

export const addComment = createAsyncThunk("posts/addComment", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/post/${data.postId}/comments`, { content: data.content });
        toast.success("Comment added!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

export const removeComment = createAsyncThunk("posts/removeComment", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`/post/${data.postId}/comments/${data.commentId}`);
        toast.success("Comment removed!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

export const resharePost = createAsyncThunk("posts/resharePost", async (postId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/post/${postId}/reshare`);
        toast.success("Post reshared successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createPost.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createPost.fulfilled, (state, action) => {
            state.loading = false;
            state.posts.push(action.payload);
        })
        .addCase(createPost.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            .addCase(getPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getPostById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPostById.fulfilled, (state, action) => {
                state.loading = false;
                state.post = action.payload;
            })
            .addCase(getPostById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.posts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = state.posts.filter(post => post._id !== action.meta.arg);
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(likePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(likePost.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.posts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(likePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(unlikePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unlikePost.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.posts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(unlikePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.posts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(addComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeComment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.posts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
            })
            .addCase(removeComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resharePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resharePost.fulfilled, (state, action) => {
                state.loading = false;
                // Add the reshared post to the posts array
                state.posts.push(action.payload);
            })
            .addCase(resharePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default postsSlice.reducer;
