import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../store/Slices/PostSlice"; // Adjust the path as necessary
import { getCurrentUser } from "../../store/Slices/authSlice"; // Adjust the path as necessary
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo, faTimes } from "@fortawesome/free-solid-svg-icons";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: postLoading, error } = useSelector((state) => state.posts);
  const { userData: user, loading: userLoading } = useSelector(
    (state) => state.auth
  );

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
    if (video) {
      formData.append("video", video);
    }

    const resultAction = await dispatch(createPost(formData));
    if (createPost.fulfilled.match(resultAction)) {
      toast.success("Post created successfully!");
      navigate("/");
    } else {
      toast.error("Failed to create post");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleImageCancel = () => {
    setImage(null);
    setImagePreview(null);
    imageInputRef.current.value = null;
  };

  const handleVideoCancel = () => {
    setVideo(null);
    setVideoPreview(null);
    videoInputRef.current.value = null;
  };

  return (
    <div className="w-full">
      <h2 className="text-lg text-white text-center md:text-xl lg:text-2xl font-semibold">
        New Post
      </h2>
      <div className="text-white p-5 md:p-10 flex w-full">
        {userLoading ? (
          <p className="text-white">Loading user data...</p>
        ) : (
          user && (
            <div className="h-12 w-12 md:h-16 md:w-16 rounded-full">
              <img
                src={user.avatar || " "} // Ensure the user object has an avatar property
                alt="User Avatar"
                className="h-12 w-12 md:h-16 md:w-16 rounded-full"
              />
            </div>
          )
        )}
        <form
          className="px-2 flex w-full md:w-[60%] flex-col"
          onSubmit={handleSubmit}
        >
          <div>
            <p className="p-2">{user?.username}</p>
            <input
              className="bg-transparent outline-none text-lg font-semibold w-full p-2"
              placeholder="Title?..."
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="relative w-full">
            <textarea
              id="content"
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="bg-transparent h-full outline-none w-full p-2 resize-none overflow-hidden"
              placeholder="What is happening?..."
            />
            <div className="absolute -bottom-5 left-2 flex space-x-5">
              <FontAwesomeIcon
                icon={faImage}
                className="cursor-pointer text-2xl"
                onClick={() => imageInputRef.current.click()}
              />

              <FontAwesomeIcon
                icon={faVideo}
                className="cursor-pointer text-2xl"
                onClick={() => videoInputRef.current.click()}
              />
            </div>
            <input
              type="file"
              id="image"
              accept="image/*"
              style={{ display: "none" }}
              ref={imageInputRef}
              onChange={handleImageChange}
            />
            <input
              type="file"
              id="video"
              accept="video/*"
              style={{ display: "none" }}
              ref={videoInputRef}
              onChange={handleVideoChange}
            />
          </div>
          <div className="mt-10">
            {imagePreview && (
              <FontAwesomeIcon
                icon={faTimes}
                className="cursor-pointer text-2xl"
                onClick={handleImageCancel}
              />
            )}
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-[50%] h-auto"
                />
              </div>
            )}
            {videoPreview && (
              <FontAwesomeIcon
                icon={faTimes}
                className="cursor-pointer text-2xl"
                onClick={handleVideoCancel}
              />
            )}
            {videoPreview && (
              <div className="mb-4">
                <video controls className="w-[50%] h-auto">
                  <source src={videoPreview} type="video/mp4" />
                </video>
              </div>
            )}
          </div>
          <button
            className="bg-red-700 mt-4 hover:bg-red-600 rounded-lg w-[30%] px-3 lg:py-3 py-2"
            type="submit"
            disabled={postLoading}
          >
            {postLoading ? "Creating..." : "Post"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
