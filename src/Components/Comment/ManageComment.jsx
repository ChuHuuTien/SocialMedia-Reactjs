/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Close,
  Send,
  MoreVert,
  Delete
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, Grid, InputBase, Popper, ClickAwayListener } from "@mui/material";
import FlexBetween from "../FlexBetween";
import UserPost from "../PostWidget/UserPost";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";
import { host } from "../../utils/APIRoutes";
import axios from "axios";
import Carousel from 'react-material-ui-carousel';
import Comment from './Comment';

const ManageComment = ({
  handleClose,
  postId,
  postUserId,
  name,
  content,
  imageSrcs,
  createdAt,
  userPicturePath,
  likesByUsers,
  // comments,
  isProfile
}) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user.userid);
  const loggedImg = useSelector((state) => state.user.avatarURL);
  const isLiked = likesByUsers.some(user => user._id === loggedInUserId);
  const likeCount = likesByUsers.length;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const scrollRef = useRef(null);
  
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
  const handleComment = async () => {
    try{
      
      const response = await axios.post(`${host}/post/${postId}/comment`,
        {
          comment: comment,
        },
        {
          headers: { Authorization: `${token}` },
        }
      )
      setComments([...comments, response.data.comment]);
      setComment("");
    }catch(error){
      console.log(error)
    }
    
    
  };
  const getComments = async () => {
    const response = await axios.get(`${host}/post/${postId}/comments`,
      {
        headers: { Authorization: `${token}` },
      }
    )
    setComments(response.data.comments);
  };

  const useDidMountEffect = (func, deps) => {
    const didMount = useRef(0);
    useEffect(() => {
        if (didMount.current == 4) func();
        else didMount.current = didMount.current+1;
    }, deps);
  }
  useDidMountEffect(()=>{
    if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behaviour: "smooth" });
        }
  }, [comments])
  
  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollIntoView({ behaviour: "smooth" });
  //   }
  // }, [comments]);

  
  
  useEffect(()=>{
    getComments();
  },[])

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
    <Box>
      <Box
          sx={{
            width: 1,
            fontSize: 20,
            position: "sticky",
            top: "0px",
            bgcolor: palette.background.alt,
            zIndex: 100,
            marginBottom: "15px",
            boxShadow: "5"
          }}   
        >
          <Box
            sx={{textAlign: "center", lineHeight : "40px"}}
          >
            Bài đăng của {name}
          <IconButton
            onClick={handleClose}
            sx={{ 
              padding: 0,
              float: "right" ,
              margin: "9px 0px"
            }}
          >
            <Close />
          </IconButton>
          </Box>
          
        <hr style={{ marginTop: "0rem", marginBottom: "0rem"}}/>

      </Box >
      <Box sx={{padding: "0 10px 0 10px"}}>
        <UserPost
          friendId={postUserId}
          name={name}
          createdAt={createdAt}
          userPicturePath={userPicturePath}
          postId={postId}
          isProfile={isProfile}
        />
      </Box>      
      
      <Typography color={main} sx={{ mt: "1rem", padding: "0 10px 0 10px" }}>
        {content}
      </Typography>

        {(imageSrcs  && imageSrcs.length >1 && <Carousel
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
            <IconButton >
              <ChatBubbleOutlineOutlined />
            </IconButton>
            
            {/* <Typography>{comments.length}</Typography> */}
            <Typography>{comments.length}</Typography>

          </FlexBetween>
        </FlexBetween>

        {/* <IconButton>
          <ShareOutlined />
        </IconButton> */}
      </FlexBetween>
      {comments && (
        <Box mt="0.5rem">
          {comments.map((comment) => (
            <Comment key={comment._id} postId={postId} comment={comment} comments={comments} setComments={setComments}/>
          ))}
          
        </Box>
      )}
       
      <Box
        sx={{
          width: 1,
          fontSize: 20,
          position: "sticky",
          bottom: "0px",
          bgcolor: palette.background.alt,
          zIndex: 100,
          marginTop: "15px",
          boxShadow: "5",
        }}   
      >
      <hr  style={{ margin: "0"}} />
       
      <Box 
        gap="0.5rem"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 10px"
        }}
      >

          <Box sx={{width:"40px", height:"40px"}}>
            <img
              style={{ objectFit: "cover", borderRadius: "50%" }}
              width="40px"
              height="40px"
              alt="user"
              src={loggedImg}
            />
          </Box>
        <InputBase
          placeholder="Viết bình luận..."
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          multiline={true}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "1rem",
            padding: "0.5rem 1rem",
            margin: "5px"
          }}
        />
        <IconButton
            onClick={handleComment}
            sx={{ 
              padding: 0,
              float: "right" ,
              margin: "10px 0px",
              color: primary
            }}
            disabled={!comment}
          >
            <Send />
          </IconButton>
      </Box>
      </Box >    
      <Box  ref={scrollRef} style={{ visibility: "none"}} />
    </Box>
  );
};

export default ManageComment;
