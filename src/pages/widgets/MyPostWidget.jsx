/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  GifBoxOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  useMediaQuery,
  Modal
} from "@mui/material";
import FlexBetween from "../../Components/FlexBetween";
import UserImage from "../../Components/UserImage";
import WidgetWrapper from "../../Components/WidgetWrapper";
import PostModal from "../../Components/Post/PostModal";
import { useState } from "react";

const MyPostWidget = ({ picturePath, isMyself }) => {
  const [post, setPost] = useState("");
  const [open, setOpen] = useState(false);
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const primary = palette.primary.main;
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '1px solid #fff !important',
    borderRadius: '25px',
    boxShadow: 24,
    overflow: scroll,
    '::-webkit-scrollbar': {
      width: '0em',
    },
    '::-webkit-scrollbar-thumb':{
      borderRadius:'10px',
      bgcolor: primary,
    }
  };
  const HandlePost = ()=>{
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="Bạn đang nghĩ gì..."
          onChange={(e) => setPost(e.target.value)}
          onClick={()=>HandlePost()}
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
      <Modal
              open={open}
              onClose={handleClose}
            >
              {isNonMobileScreens ? 
                (
                <Box sx={{ ...style, width: 1/2, maxHeight:7/8, height: "auto", overflowY: 'scroll' }}>
                  <PostModal handleClose={handleClose} picturePath={picturePath} isMyself={isMyself}/>
                </Box>
                ):(
                <Box sx={{ ...style, width: 1, maxHeight: 3/4, height: "auto", overflow: 'auto'}}>
                  <PostModal handleClose={handleClose} picturePath={picturePath} isMyself={isMyself}/>
                </Box>
                )
              }
            </Modal>      
      
      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => HandlePost()} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography color={mediumMain}>
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => HandlePost()} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
          <GifBoxOutlined sx={{ color: mediumMain }}/>
          <Typography color={mediumMain} >
            Clip
          </Typography>
        </FlexBetween>
        

        <Button
          disabled={!post}
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

export default MyPostWidget;
