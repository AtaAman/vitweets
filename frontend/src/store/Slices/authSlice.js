import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axios";
import toast from "react-hot-toast";

const initialState = {
    loading: false,
    status: false,
    userData: null,
};

// Async thunks for API interactions
export const createAccount = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("fullName", data.fullName);
    if (data.coverImage) {
        formData.append("coverImage", data.coverImage[0]);
    }
    if (data.avatar) {
        formData.append("avatar", data.avatar[0]);
    }

    try {
        const response = await axiosInstance.post("/users/register", formData);
        toast.success("Registered successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const userLogin = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/login", data);
        toast.success("Logged in successfully!!!");
        return response.data.data.user;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const userLogout = createAsyncThunk("auth/logout", async (_, { rejectWithValue, dispatch }) => {
    try {
        localStorage.removeItem('accessToken');
        dispatch(updateAuthStatus(false));
        return { success: true };
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const refreshAccessToken = createAsyncThunk("auth/refreshAccessToken", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/refresh-token", data);
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const changePassword = createAsyncThunk("auth/changePassword", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/change-password", data);
        toast.success(response.data?.message);
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/users/current-user");
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateAvatar = createAsyncThunk("auth/updateAvatar", async (avatar, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("avatar", avatar[0]);
        const response = await axiosInstance.patch("/users/update-avatar", formData);
        toast.success("Updated avatar successfully!!!");
        return response.data.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const updateCoverImg = createAsyncThunk("auth/updateCoverImg", async (coverImage, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("coverImage", coverImage[0]);
        const response = await axiosInstance.patch("/users/update-coverImg", formData);
        toast.success("Updated cover image successfully!!!");
        return response.data.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const updateUserDetails = createAsyncThunk("auth/updateUserDetails", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch("/users/update-user", data);
        toast.success("Updated details successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/verify-otp", data);
        toast.success("OTP verified successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const requestPasswordReset = createAsyncThunk("auth/requestPasswordReset", async (email, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/request-reset-password", { email });
        toast.success("OTP sent to email!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/reset-password", data);
        toast.success("Password reset successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

export const savePost = createAsyncThunk("auth/savePost", async (postId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/posts/${postId}/save`);
        toast.success("Post saved successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

export const unsavePost = createAsyncThunk("auth/unsavePost", async (postId, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/posts/${postId}/unsave`);
        toast.success("Post unsaved successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
        return rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create Account
            .addCase(createAccount.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAccount.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createAccount.rejected, (state) => {
                state.loading = false;
            })
            // User Login
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                state.userData = action.payload;
            })
            .addCase(userLogin.rejected, (state) => {
                state.loading = false;
            })
            // User Logout
            .addCase(userLogout.pending, (state) => {
                state.loading = true;
            })
            .addCase(userLogout.fulfilled, (state) => {
                state.loading = false;
                state.status = false;
                state.userData = null;
            })
            .addCase(userLogout.rejected, (state) => {
                state.loading = false;
            })
            // Get Current User
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                state.userData = action.payload;
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.loading = false;
                state.status = false;
                state.userData = null;
            })
            // Update Avatar
            .addCase(updateAvatar.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload;
            })
            .addCase(updateAvatar.rejected, (state) => {
                state.loading = false;
            })
            // Update Cover Image
            .addCase(updateCoverImg.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCoverImg.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload;
            })
            .addCase(updateCoverImg.rejected, (state) => {
                state.loading = false;
            })
            // Update User Details
            .addCase(updateUserDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload.data;
            })
            .addCase(updateUserDetails.rejected, (state) => {
                state.loading = false;
            })
            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verifyOtp.rejected, (state) => {
                state.loading = false;
            })
             // Request Password Reset
             .addCase(requestPasswordReset.pending, (state) => {
                state.loading = true;
            })
            .addCase(requestPasswordReset.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(requestPasswordReset.rejected, (state) => {
                state.loading = false;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state) => {
                state.loading = false;
            })
            .addCase(savePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(savePost.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(savePost.rejected, (state) => {
                state.loading = false;
            })
            .addCase(unsavePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(unsavePost.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(unsavePost.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { updateAuthStatus } = authSlice.actions;
export default authSlice.reducer;
