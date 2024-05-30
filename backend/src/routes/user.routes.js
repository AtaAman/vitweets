import { Router } from 'express';
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    verifyOtp,
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser,
    updateUserAvatar, 
    updateUserCoverImage, 
    updateAccountDetails,
    requestPasswordReset,
    resetPassword,
    followUnfollowUser,
    getNotifications,
    savePost,
    unsavePost,
} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        }, 
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
);

router.route('/verify-otp').post(verifyOtp); // Add this line
router.route('/login').post(loginUser);
router.route('/request-reset-password').post(requestPasswordReset);
router.route('/reset-password').post(resetPassword);

// Secured routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/followUnfollowUser').post(verifyJWT, followUnfollowUser);

router.route('/save/:id').put(verifyJWT, savePost);
router.route('/unsave/:id').put(verifyJWT, unsavePost);
router.route('/getNotifications').get(verifyJWT, getNotifications);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/update-account').patch(verifyJWT, updateAccountDetails);
router.route('/avatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar);
router.route('/cover-image').patch(verifyJWT, upload.single('coverImage'), updateUserCoverImage);

export default router;
