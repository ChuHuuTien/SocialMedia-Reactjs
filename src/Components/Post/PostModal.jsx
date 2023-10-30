/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
  Close,
  
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  Backdrop,
  CircularProgress
} from "@mui/material";
import FlexBetween from "../../Components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../Components/UserImage";
import WidgetWrapper from "../../Components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import { host } from "../../utils/APIRoutes";
import axios from "axios";
import { useEffect } from "react";
import Carousel from 'react-material-ui-carousel';

const PostModal = ({ handleClose, picturePath, isMyself}) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [images, setImages] = useState(null);
  const [content, setContent] = useState("");
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const { userid } = useSelector((state) => state.user);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const [openScreen, setOpenScreen] = useState(false);
  const handleCloseScreen = () => {
    setOpenScreen(false);
  };
  const handleOpenScreen = () => {
    setOpenScreen(true);
  };
  
  const onFileToBase64 = file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      file.base64 = reader.result;
    };
  };
  const handlePost = async () => {
    handleOpenScreen();
    const imgToBase64 = new Array();
    if (images) {
      images.map((image)=>{
        return imgToBase64.push(image.base64);
      })
    }
    await axios.post(`${host}/post/create`, {
        content: content,
        images: imgToBase64,
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
    handleCloseScreen();
    handleClose();
    setImages(null);
    setContent("");
  };
  useEffect(()=>{
    if(images){
      images.map((image)=>{
        onFileToBase64(image);
      })
    }
  },[images])

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
    <WidgetWrapper>
      <Backdrop
        sx={{ color: '#fff', zIndex: 1000 }}
        open={openScreen}
        // onClick={handleCloseScreen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
          sx={{
            width: 1,
            height: 40,
            fontSize: 20,
          }}   
        >
          Tạo bài đăng
          <IconButton
            onClick={handleClose}
            sx={{ 
              padding: 0,
              float: "right" 
            }}
          >
            <Close />
          </IconButton>
      </Box>
      <hr style={{ marginTop: "0rem", marginBottom: "1rem"}}/>
      <FlexBetween gap="1rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="Bạn đang nghĩ gì..."
          onChange={(e) => setContent(e.target.value)}
          value={content}
          multiline={true}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 1rem",
          }}
        />
      </FlexBetween>
      
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="0.5rem"
          p="0.5rem"
          
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={true}
            maxFiles={4}
            onDrop={(acceptedFiles) => setImages(
              (acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
              })))
            )}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  // p="1rem"
                  width="100%"
                  // height="200px"
                  sx={{ 
                    "&:hover": { cursor: "pointer" },
                  }}
                >
                  <input {...getInputProps()} />
                  {!images ? (
                    <p>Add Image Here</p>
                  ) : (
                      <Carousel
                            {...settings}
                        >
                            {
                                images.map((image) => {
                                    return <img
                                      key={image}
                                      width="100%"
                                      height="300px"
                                      alt="post"
                                      style={{ borderRadius: "0.75rem", marginTop: "0.75rem", objectFit: "contain", backgroundColor: "black" }}
                                      src={image.preview}
                                    />
                                })
                            }
                      </Carousel>
                      
                  )}
                </Box>
                {images && (
                  <IconButton
                    onClick={() => {
                      URL.revokeObjectURL(images.preview);
                      setImages(null)}
                    }
                    sx={{ width: "5%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween 
          gap="0.25rem" 
          // onClick={() => HandlePost()} 
          sx={{ "&:hover": { cursor: "pointer", color: medium } }}
        >
          <GifBoxOutlined sx={{ color: mediumMain }}/>
          <Typography color={mediumMain} >
            Clip
          </Typography>
        </FlexBetween>

        <Button
          disabled={!content}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          Đăng
        </Button>
      </FlexBetween>
      
    </WidgetWrapper>
  );
};

export default PostModal;
