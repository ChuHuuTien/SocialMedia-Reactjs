/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { PersonAddOutlined, PersonRemoveOutlined, Settings, Delete, DriveFileRenameOutline } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, Popper, ClickAwayListener, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, useMediaQuery} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setFriends, setPosts } from "../../state";
import FlexBetween from "../FlexBetween";
import UserImage from "../UserImage";
import { host } from "../../utils/APIRoutes";
import axios from "axios";

const UserPost = ({ friendId, name, createdAt, userPicturePath, postId, isProfile  }) => {
  if(createdAt){
    // eslint-disable-next-line no-inner-declarations
    function dateFormat(date) {
      const month = date.getMonth();
      const day = date.getDate();
      const monthString = month >= 9 ? month+1 : `0${month+1}`;
      const dayString = day >= 10 ? day : `0${day}`;
      return `${date.getHours()}h:${date.getMinutes()}m ${dayString}-${monthString}-${date.getFullYear()}`;
    }
    createdAt = new Date(createdAt); 
    createdAt = dateFormat(createdAt);
  }

  const [popperAnc, setPopperAnc] = useState(null);
  const open = Boolean(popperAnc);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openPost, setOpenPost] = useState(false);

  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const { userid } = useSelector((state) => state.user);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const isFriend = friends.find((friend) => friend._id === friendId);
  const isNotMyself = friendId !== userid;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #ccc!important',
    borderRadius: '25px',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const patchFriend = async () => {
    const response = await axios.post(`${host}/user/updatefriend`,
      {
        friendid: friendId
      },
      {
        headers: { Authorization: `${token}` },
      }
    )
    const friends = await response.data.friends;
    dispatch(setFriends({friends: friends}));
  };
  const handelSetting = async (e) => {
    setPopperAnc(e.currentTarget);
  };
  const HandlerManagerClick = async ()=>{
    setOpenPost(true);
  };
  const handleClose = () => {
    setOpenPost(false);
  };
  const handelDelete = async ()=>{
    await axios.delete(`${host}/post/${postId}`,
      {
        headers: { Authorization: `${token}` },
      }
    )
    if(isProfile){
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
  }
  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
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
            {createdAt}
          </Typography>
        </Box>
      </FlexBetween>
      {
        isNotMyself ? (
          <IconButton
            onClick={() => patchFriend()}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            {isFriend ? (
              <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
          </IconButton>
        ) :( 
          <>
            <IconButton
              onClick={(e) => handelSetting(e)}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              <Settings sx={{ color: primaryDark }} />
            </IconButton>
            <Popper 
              open={open} 
              anchorEl={popperAnc} 
              sx={{
                border: "1px solid #333",
                zIndex: 1301,
                backgroundColor: primaryLight,
              }}>
              <ClickAwayListener
                onClickAway={() => {
                  setPopperAnc(null);
                }}
              >
                <List >
                  <ListItem disablePadding>
                    <ListItemButton onClick={()=>HandlerManagerClick()}>
                      <ListItemIcon>
                        <DriveFileRenameOutline />
                      </ListItemIcon>
                      <ListItemText primary="Sửa" />
                    </ListItemButton>
                    {/* <Modal
                      open={openPost}
                      onClose={handleClose}
                    >
                      {isNonMobileScreens ? 
                        (
                        <Box sx={{ ...style, width: 1/2 }}>
                          <ManagePost handleClose={handleClose} content={content} picturePath={picturePath}/>
                        </Box>
                        ):(
                        <Box sx={{ ...style, width: 3/4, height: 3/4, overflow: 'auto'}}>
                          <ManagePost handleClose={handleClose} content={content} picturePath={picturePath}/>
                        </Box>
                        )
                      }
                    </Modal> */}
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton onClick={()=>handelDelete()}>
                      <ListItemIcon>
                        <Delete />
                      </ListItemIcon>
                      <ListItemText primary="Xoá" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </ClickAwayListener>
            </Popper>
          </>
          
        )
      }
      
    </FlexBetween>
  );
};

export default UserPost;
