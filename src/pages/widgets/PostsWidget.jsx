/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import PostWidget from "./PostWidget";
import { host } from "../../utils/APIRoutes";
import axios from "axios";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await axios.get(`${host}/post/news/?page=${0}&limit=${10}`,
      {
        headers: { Authorization: `${token}` },
      }
    )
    const posts = await response.data.news;
    dispatch(setPosts({posts: posts}));
  };

  const getUserPosts = async () => {
    const response = await axios.get(`${host}/post/all/${userId}/?page=${0}&limit=${10}`,
      {
        headers: { Authorization: `${token}` },
      }
    )
    const posts = await response.data.posts;
    dispatch(setPosts({posts: posts}));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(
        ({
          _id,
          creatorId,
          content,
          picturePath,
          createdAt,
          postedByUser,
          likesByUsers,
          // comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={creatorId}
            name={`${postedByUser.firstName} ${postedByUser.lastName}`}
            content={content}
            picturePath={picturePath}
            createdAt={createdAt}
            userPicturePath={postedByUser.avatarURL}
            likesByUsers={likesByUsers}
            // comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
