/* eslint-disable no-const-assign */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { PersonAddOutlined, PersonRemoveOutlined, Settings, Delete, DriveFileRenameOutline, HourglassTop, Close } from "@mui/icons-material";
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
import DeleteFriend from "../ConfirmDelete/DeleteFriend";

const UserPost = ({ friendId, name, createdAt, userPicturePath, postId, isProfile, handleUpdate, isLoading  }) => {
  

  const [popperAnc, setPopperAnc] = useState(null);
  const open = Boolean(popperAnc);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const [openDelete, setOpenDelete] = useState(false);

  function Format(date) {
    const now = new Date(Date.now());
    date = new Date(date)
    const time = new Date(now - date);
    const second = date.getSeconds();
    const minute = date.getMinutes();
    const hour = date.getHours();
    if(time.getMonth() <= 1){
      if(time.getDate() <=1){
        if(hour == now.getHours()){
          if(minute == now.getMinutes()){
            if(now.getSeconds() - second <= 0) return 'bây giờ'
            else return `${now.getSeconds() - second} giây trước`
          } return `${now.getMinutes() - minute} phút trước`
        } return `${now.getHours() - hour} giờ trước`
      }else return `${time.getDate()} ngày trước`
    }else return `${time.getMonth()} tháng trước`
  }
  
  const [load, setLoad] = useState(false);
  const addFriend = async () => {
    const response = await axios.post(`${host}/user/updatefriend`,
      {
        friendid: friendId
      },
      {
        headers: { Authorization: `${token}` },
      }
    )
    setLoad(true);
  };
  const removeFriend = async () => {
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

  const HandleUpdate = async ()=>{
    handleUpdate();
    setPopperAnc(null)
  };
  const HandelOpenDelete = async ()=>{
    setOpenDelete(true)
    setPopperAnc(null);
  };
  const handleCloseDelete = async ()=>{
    setOpenDelete(false);
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
            {Format(createdAt)}
          </Typography>
        </Box>
      </FlexBetween>
      {
        isNotMyself ? (
            <div>
              {isFriend && !isLoading && (
              <IconButton
                onClick={() => removeFriend()}
                sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
              >
                <PersonRemoveOutlined sx={{ color: primaryDark }} />
              </IconButton>
              )}
              {!isFriend && !isLoading && !load && (
                <IconButton
                  onClick={() => addFriend()}
                  sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
                >
                <PersonAddOutlined sx={{ color: primaryDark }} />
              </IconButton>
              )}
              {!isFriend && isLoading && !load && (
                <IconButton
                  disabled={true}
                  sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
                  >
                  <HourglassTop sx={{ color: primaryDark}} />
                </IconButton>
              )}
              {!isFriend && !isLoading && load && (
                <IconButton
                  disabled={true}
                  sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
                  >
                  <HourglassTop sx={{ color: primaryDark}} />
                </IconButton>
              )}
            </div>

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
              placement={'bottom-end'}
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

                <List sx={{padding: 0}}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={(e)=>HandleUpdate(e)}>
                      <ListItemIcon>
                        <DriveFileRenameOutline />
                      </ListItemIcon>
                      <ListItemText primary="Sửa" />
                    </ListItemButton>
                  </ListItem>
                  <hr style={{margin: "0"}}/>
                  <ListItem disablePadding>
                    <ListItemButton onClick={()=>handelDelete()}>
                    {/* <ListItemButton onClick={()=>HandelOpenDelete()}> */}
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
