import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axios";
import toast from "react-hot-toast";

const initialState = {
    loading: false,
    status: false,
    userData: null,
};

// Async thunks for API interactions
export const createAccount = createAsyncThunk("register", async (data, { rejectWithValue }) => {
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

export const userLogin = createAsyncThunk("login", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/login", data);
        toast.success("Logged in successfully!!!");
        return response.data.data.user;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const userLogout = createAsyncThunk("logout", async (_, { rejectWithValue }) => {
    try {
        localStorage.removeItem('accessToken');
        // Dispatch an action to update the authentication status in the Redux store
        dispatch(updateAuthStatus(false));
        return { success: true };
    } catch (error) {
        // Handle any errors that occur during logout
        return rejectWithValue(error.response.data);
    }
});


export const refreshAccessToken = createAsyncThunk("refreshAccessToken", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/refresh-token", data);
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const changePassword = createAsyncThunk("changePassword", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/change-password", data);
        toast.success(response.data?.message);
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const getCurrentUser = createAsyncThunk("getCurrentUser", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/users/current-user");
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateAvatar = createAsyncThunk("updateAvatar", async (avatar, { rejectWithValue }) => {
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

export const updateCoverImg = createAsyncThunk("updateCoverImg", async (coverImage, { rejectWithValue }) => {
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

export const updateUserDetails = createAsyncThunk("updateUserDetails", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.patch("/users/update-user", data);
        toast.success("Updated details successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const verifyOtp = createAsyncThunk("verifyOtp", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/verify-otp", data);
        toast.success("OTP verified successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const requestPasswordReset = createAsyncThunk("requestPasswordReset", async (email, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/request-password-reset", { email });
        toast.success("OTP sent to email!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error.response.data);
    }
});

export const resetPassword = createAsyncThunk("resetPassword", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/users/reset-password", data);
        toast.success("Password reset successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
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
            // Change Password
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state) => {
                state.loading = false;
            })
            // Refresh Access Token
            .addCase(refreshAccessToken.pending, (state) => {
                state.loading = true;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload.data.user;
            })
            .addCase(refreshAccessToken.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default authSlice.reducer;
