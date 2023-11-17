/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
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
    const response = await axios.get(`${host}/post/news/?page=${0}&limit=${20}`,
      {
        headers: { Authorization: `${token}` },
      }
    )
    const posts = await response.data.news;
    dispatch(setPosts({posts: posts}));
    
  };
  const [myRequest, setMyRequest] = useState([]);
  const getUserPosts = async () => {
    const response = await axios.get(`${host}/post/all/${userId}/?page=${0}&limit=${20}`,
      {
        headers: { Authorization: `${token}` },
      }
    )
    const posts = await response.data.posts;
    dispatch(setPosts({posts: posts}));

    const res = await axios.get(`${host}/user/friend/myrequest`, {
      headers: { Authorization: `${token}` },
    })
    setMyRequest(res.data.myRequest);
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
          imageSrcs,
          createdAt,
          postedByUser,
          likesByUsers,
          commentLength,
        }) => (
          <Box m="2rem 0" sx={{boxShadow: 5, borderRadius: "10px"}} key={_id} >
            <PostWidget
              postId={_id}
              postUserId={creatorId}
              name={`${postedByUser.firstName} ${postedByUser.lastName}`}
              content={content}
              imageSrcs={imageSrcs}
              createdAt={createdAt}
              userPicturePath={postedByUser.avatarURL}
              likesByUsers={likesByUsers}
              commentLength={commentLength}
              isProfile={isProfile}
              myRequest={myRequest}
            />
          </Box>
        )
      )}
    </>
  );
};

export default PostsWidget;
