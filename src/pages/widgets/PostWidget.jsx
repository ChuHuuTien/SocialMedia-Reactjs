/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "../../Components/FlexBetween";
import UserPost from "../../Components/UserPost";
import WidgetWrapper from "../../Components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";
import { host } from "../../utils/APIRoutes";
import axios from "axios";

const PostWidget = ({
  postId,
  postUserId,
  name,
  content,
  picturePath,
  createdAt,
  userPicturePath,
  likesByUsers,
  // comments,
  isProfile
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user.userid);
  const isLiked = likesByUsers.some(user => user._id === loggedInUserId);
  const likeCount = likesByUsers.length;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await axios.post(`${host}/post/like`,
      {
        postid: postId
      },
      {
        headers: { Authorization: `${token}` },
      }
    )
    const updatedPost = await response.data.post;
    dispatch(setPost({ post: updatedPost }));
  };
  return (
    <WidgetWrapper m="2rem 0">
      <UserPost
        friendId={postUserId}
        name={name}
        createdAt={createdAt}
        userPicturePath={userPicturePath}
        postId={postId}
        isProfile={isProfile}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {content}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={picturePath}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            {/* <Typography>{comments.length}</Typography> */}
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {/* {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )} */}
    </WidgetWrapper>
  );
};

export default PostWidget;
