/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Modal, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import FlexBetween from "../../Components/FlexBetween";
import UserPost from "../../Components/PostWidget/UserPost";
import WidgetWrapper from "../../Components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";
import { host } from "../../utils/APIRoutes";
import axios from "axios";
import ManageComment from "../../Components/ManageComment";
import Carousel from 'react-material-ui-carousel';

const PostWidget = ({
  postId,
  postUserId,
  name,
  content,
  imageSrcs,
  createdAt,
  userPicturePath,
  likesByUsers,
  commentLength,
  isProfile
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user.userid);
  const isLiked = likesByUsers.some(user => user._id === loggedInUserId);
  const likeCount = likesByUsers.length;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const [open, setOpen] = useState(false);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #ccc!important',
    borderRadius: '10px',
    boxShadow: 24,
    overflow: scroll,
    '::-webkit-scrollbar': {
      width: '0.4em'
    },
    '::-webkit-scrollbar-thumb':{
      borderRadius:'10px',
      bgcolor: primary,
    }
    // pt: 2,
    // px: 4,
    // pb: 3,
  };

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
  const HandleComment = ()=>{
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const settings = {
    autoPlay: false,
    animation: "fade",
    indicators: true,
    duration: 500,
    navButtonsAlwaysVisible: true,
    navButtonsAlwaysInvisible: false,
    cycleNavigation: false,
    fullHeightHover: true,
    swipe: true
  }
  return (
    <WidgetWrapper m="2rem 0">
      <UserPost
        friendId={postUserId}
        name={name}
        createdAt={createdAt}
        userPicturePath={userPicturePath}
        postId={postId}
        isProfile={isProfile}
        content={content}
        picturePath={imageSrcs}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {content}
      </Typography>

      {(imageSrcs  && imageSrcs.length>1 && <Carousel
                {...settings}
            >
                {
                    imageSrcs.map((image) => {
                        return <img
                          key={image}
                          width="100%"
                          height="400px"
                          alt="post"
                          style={{ borderRadius: "0.75rem", marginTop: "0.75rem", objectFit: "contain", backgroundColor: "black" }}
                          src={image}
                        />
                    })
                }
        </Carousel>)}

        {(imageSrcs  && imageSrcs.length == 1 &&
          <img
            width="100%"
            height="400px"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem", objectFit: "contain", backgroundColor: "black" }}
            src={imageSrcs[0]}
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
            <IconButton onClick={()=>HandleComment()}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Modal
              open={open}
              onClose={handleClose}
            >
              {isNonMobileScreens ? 
                (
                <Box sx={{ ...style, width: 1/2, maxHeight: 7/8, height: "auto", overflowY: 'scroll' }}>
                  <ManageComment handleClose={handleClose} key={postId}
                    postId={postId}
                    postUserId={postUserId}
                    name={name}
                    content={content}
                    imageSrcs={imageSrcs}
                    createdAt={createdAt}
                    userPicturePath={userPicturePath}
                    likesByUsers={likesByUsers}
                    // comments={comments}
                    isProfile={isProfile}
                  />
                </Box>
                ):(
                <Box sx={{ ...style, width: 1, height: 3/4, overflow: 'auto'}}>
                  <ManageComment handleClose={handleClose} key={postId}
                    postId={postId}
                    postUserId={postUserId}
                    name={name}
                    content={content}
                    imageSrcs={imageSrcs}
                    createdAt={createdAt}
                    userPicturePath={userPicturePath}
                    likesByUsers={likesByUsers}
                    // comments={comments}
                    isProfile={isProfile}
                  />
                </Box>
                )
              }
            </Modal>
            <Typography>{commentLength}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default PostWidget;
