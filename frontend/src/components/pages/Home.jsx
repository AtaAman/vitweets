import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../store/Slices/PostSlice";
import Container from "../Cards/Container";
import PostList from "../Cards/PostList";
import HomeSkeleton from "../HomeSkeleton";

function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts?.posts);
  const loading = useSelector((state) => state.posts?.loading);

  useEffect(() => {
    dispatch(getPosts({}));
  }, [dispatch]);

  return (
    <div className="w-full absolute flex justify-center items-center">
          <Container>
      <div className="text-white mb-20 sm:m-0 w-full grid xl:grid-cols-1 sm:grid-cols-1 grid-cols-1 ">
        {posts?.map((post) => (
          <PostList
            key={post._id}
            avatar={post.author?.avatar}
            title={post.title}
            content={post.content}
            video={post.video}
            image={post.image}
            createdAt={post.createdAt}
            accountName={post.author?.username}
            postId={post._id}
          />
        ))}
      </div>
      {loading && <HomeSkeleton />}
    </Container>
    </div>

  );
}

export default Home;
