import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/authSlice.js";
import postsSliceReducer from "./Slices/PostSlice.js";

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        posts: postsSliceReducer, // Rename to 'posts'
    },
});

export default store;
