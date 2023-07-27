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

const MyPostWidget = ({ picturePath, isMyself }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const { userid } = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  

  const onFileToBase64 = file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      image.base64 = reader.result
    };
  };
  const handlePost = async () => {
    const formData = new FormData();
    formData.append("content", post);
    if (image) {
      formData.append("picture", image.base64);
      // formData.append("picturePath", image.name);
    }

    var object = {};
    formData.forEach(function(value, key){
      object[key] = value;
    });
    await axios.post(`${host}/post/create`, object,
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
    
    setImage(null);
    setPost("");
  };
  useEffect(()=>{
    if(image){
      onFileToBase64(image)
    }
  },[image])
  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          multiline={true}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(
              (acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
              })))[0]
            )}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ 
                    "&:hover": { cursor: "pointer" },
                    height: 2/3,
                    width: 2/3,
                  }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Box
                        component="img"
                        sx={{
                          height: 1,
                          width: 1,
                          // maxHeight: { xs: 200, md: 233 },
                          // maxWidth: { xs: 200, md: 350 },
                        }}
                        alt={image.name}
                        src={image.preview}
                      />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => {
                      URL.revokeObjectURL(image.preview);
                      setImage(null)}
                    }
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

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

        {/* {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )} */}

        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
