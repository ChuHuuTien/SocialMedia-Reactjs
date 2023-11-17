/* eslint-disable no-inner-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Close } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme,Button, InputBase, useMediaQuery } from "@mui/material";
import FlexBetween from "../FlexBetween";
import UserPost from "../PostWidget/UserPost";
import UserImage from "../UserImage"
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPosts } from "../../state";
import { host } from "../../utils/APIRoutes";
import axios from "axios";
import Carousel from 'react-material-ui-carousel';
import { useNavigate } from "react-router-dom";

const UpdatePost = ({
  handleCloseUpdate,
  postId,
  postUserId,
  name,
  content,
  imageSrcs,
  createdAt,
  userPicturePath,
  isMyself
}) => {
  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const navigate = useNavigate();
  const medium = palette.neutral.medium;
  const [newContent, setNewContent] = useState(content);
  const { userid } = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  function Format(date) {
    date = new Date(date); 
    const now = new Date(Date.now());
    const second = date.getSeconds();
    const minute = date.getMinutes();
    const hour = date.getHours();
    const day = date.getDate();
    const month = date.getMonth();
    if(month == now.getMonth()){
      if(day == now.getDate()){
        if(hour == now.getHours()){
          if(minute == now.getMinutes()){
            if(now.getSeconds() - second == 0) return 'bây giờ'
            else return `${now.getSeconds() - second} giây trước`
          }
          return `${now.getMinutes() - minute} phút trước`
        }
        return `${now.getHours() - hour} giờ trước`
      }
      return `${now.getDate() - day} ngày trước`
    }
    return `${now.getMonth() - month} tháng trước`
  }
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
  const handleUpdate = async ()=>{
    await axios.post(`${host}/post/update`,
      {
        postid: postId,
        content: newContent,
      },
      {
        headers: { Authorization: `${token}` },
      }
    )
    if(isMyself){
      const response = await axios.get(`${host}/post/all/${userid}/?page=${0}&limit=${20}`,
          {
            headers: { Authorization: `${token}` },
          }
        )
      const posts = await response.data.posts;
      dispatch(setPosts({posts: posts}));
    }else{
      const response = await axios.get(`${host}/post/news/?page=${0}&limit=${20}`,
        {
          headers: { Authorization: `${token}` },
        }
      )
      const posts = await response.data.news;
      dispatch(setPosts({posts: posts}));
    }
    handleCloseUpdate();
    
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
            {/* Bài đăng của {name} */}
            Cập nhật bài đăng
          <IconButton
            onClick={handleCloseUpdate}
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
        <FlexBetween>
        <FlexBetween gap="1rem">
          <UserImage image={userPicturePath} size="55px" />
          <Box
            onClick={() => {
              navigate(`/profile/${postUserId}`);
              navigate(0);
            }}
          >
            <Typography
              color={main}
              variant="h5"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {name}
            </Typography>
            <Typography color={medium} fontSize="0.75rem">
              {Format(createdAt)}
            </Typography>
          </Box>
        </FlexBetween>
        </FlexBetween>
      </Box> 
      <Box 
        sx={{
          margin: "10px 10px 0px 10px"
        }}
      >
        <InputBase
            placeholder="Bạn đang nghĩ gì..."
            onChange={(e) => setNewContent(e.target.value)}
            value={newContent}
            multiline={true}
            // autoFocus={true}
            inputRef={(input) => input && input.focus()}
            onFocus={(e) =>
                e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
            )}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "0.5rem",
              padding: "0.5rem 0.5rem",
            }}
          />
      </Box>    
      

        {(imageSrcs  && imageSrcs.length >1 && 
        <Box sx={{
          // height: "300px"
        }}>
          <Carousel
            {...settings}
            >
              { 
                imageSrcs.map((image) => {
                    return <img
                      key={image}
                      width="100%"
                      height= {isNonMobileScreens ? "400px" : "300px"}
                      alt="post"
                      style={{ borderRadius: "0.75rem", marginTop: "0.75rem", objectFit: "contain", backgroundColor: "black" }}
                      src={image}
                    />
                  })
            }
          </Carousel>
        </Box>
        
        )}

        {(imageSrcs  && imageSrcs.length == 1 &&
          <img
            width="100%"
            height= {isNonMobileScreens ? "400px" : "300px"}
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem", objectFit: "contain", backgroundColor: "black" }}
            src={imageSrcs[0]}
          />
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
        <Button
          disabled={content==newContent}
          onClick={handleUpdate}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            marginLeft: "auto",
          }}
        >
          Cập nhật
        </Button>
      </Box>
      </Box > 
    </Box>
  );
};

export default UpdatePost;
