import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../store/Slices/PostSlice';
import PostList from '../Cards/PostList';

function PostById() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { post, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
    }
  }, [dispatch, postId]);

  if (!postId) {
    return <p>No post ID provided</p>;
  }

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!post) {
    return <p>No post found</p>; // Return a message indicating that no post is available
  }

  return (
    <div>
       <PostList
            key={post._id}
            avatar={post.author?.avatar || " "}
            title={post.title}
            content={post.content}
            video={post.video}
            image={post.image}
            createdAt={post.createdAt}
            accountName={post.author?.username}
            postId={post._id}
          />
    </div>
  );
}

export default PostById;
