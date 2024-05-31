import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendOtpEmail } from "../utils/mailer.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Notification from "../models/notification.models.js";
import cron from 'node-cron';

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const generateOtp = () => {
  return crypto.randomBytes(3).toString("hex"); // Generates a 6-character OTP
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const otp = generateOtp();
  const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  const user = await User.create({
    fullName,
    avatar: avatar?.url || "",
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
    otp,
    otpExpiration,
    isVerified: false,
  });

  await sendOtpEmail(email, otp);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdUser,
        "User registered successfully. Please check your email for the OTP."
      )
    );
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email, otp });

  if (!user) {
    throw new ApiError(400, "Invalid OTP or email");
  }

  if (user.otpExpiration < Date.now()) {
    throw new ApiError(400, "OTP has expired");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiration = undefined;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }

  const otp = generateOtp();
  const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  user.otp = otp;
  user.otpExpiration = otpExpiration;
  await user.save({ validateBeforeSave: false });

  await sendOtpEmail(email, otp);

  return res.status(200).json(new ApiResponse(200, {}, "OTP sent to email"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email, otp });

  if (!user) {
    throw new ApiError(400, "Invalid OTP or email");
  }

  if (user.otpExpiration < Date.now()) {
    throw new ApiError(400, "OTP has expired");
  }

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpiration = undefined;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const getAllUsersBySearch = asyncHandler(async (req, res) => {
  const { searchTerm } = req.query;

  if (!searchTerm) {
    throw new ApiError(400, "Search term is required");
  }

  const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive search

  const users = await User.find({
    $or: [
      { username: searchRegex },
      { fullName: searchRegex },
      { email: searchRegex }
    ]
  }).select("-password -refreshToken");

  if (users.length === 0) {
    throw new ApiError(404, "No users found matching the search criteria");
  }

  res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName } = req.body;

  if (!fullName) {
    throw new ApiError(400, "Full Name is required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { fullName },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    user: updatedUser,
    message: "Account details updated successfully",
  });
});


const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // TODO: delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res.status(200).json({
    success: true,
    user,
    message: "Avatar image updated successfully",
  });
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  //TODO: delete old image - assignment

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const followUnfollowUser = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;
  const { followUserId } = req.body;

  if (!followUserId) {
    throw new ApiError(400, "User ID to follow/unfollow is required");
  }

  const loggedInUser = await User.findById(loggedInUserId);
  const userToFollow = await User.findById(followUserId);

  if (!userToFollow) {
    throw new ApiError(404, "User to follow/unfollow not found");
  }

  const isFollowedBefore = loggedInUser.following.some(
    (follow) => follow.userId.toString() === followUserId
  );

  if (isFollowedBefore) {
    await User.updateOne(
      { _id: followUserId },
      { $pull: { followers: { userId: loggedInUserId } } }
    );

    await User.updateOne(
      { _id: loggedInUserId },
      { $pull: { following: { userId: followUserId } } }
    );

    await Notification.deleteOne({
      "creator._id": loggedInUserId,
      userId: followUserId,
      type: "Follow",
    });

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  } else {
    await User.updateOne(
      { _id: followUserId },
      { $push: { followers: { userId: loggedInUserId } } }
    );

    await User.updateOne(
      { _id: loggedInUserId },
      { $push: { following: { userId: followUserId } } }
    );

    const newNotification = new Notification({
      userId: followUserId,
      creator: req.user._id,
      type: "Follow",
      title:  `${req.user.username} Followed you`,
    });
    await newNotification.save();

    res.status(200).json({
      success: true,
      message: "User followed successfully",
    });
  }
});

const savePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  // Check if the post is already saved by the user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.savedPosts.includes(postId)) {
    user.savedPosts.push(postId);
    await user.save();
  }

  res.status(200).json({ message: "Post saved successfully" });
});

// Unsave a post for a user
const unsavePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.savedPosts = user.savedPosts.filter(
    (savedPostId) => savedPostId.toString() !== postId
  );
  await user.save();

  res.status(200).json({ message: "Post unsaved successfully" });
});

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  const notifications = await Notification.find({ 
    userId: userId,
    createdAt: { $gte: oneWeekAgo } // Filter notifications created within the last week
  })
  .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
  .populate("creator");

  res.json({ notifications });
});



cron.schedule('0 0 * * *', async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
  
  try {
    // Delete notifications older than 7 days
    await Notification.deleteMany({ createdAt: { $lt: sevenDaysAgo } });
    console.log('Old notifications deleted');
  } catch (error) {
    console.error('Error deleting old notifications:', error);
  }
});


export {
  registerUser,
  verifyOtp,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getNotifications,
  followUnfollowUser,
  savePost,
  unsavePost,
  getAllUsersBySearch
};
