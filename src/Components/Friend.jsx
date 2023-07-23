/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { PersonAddOutlined, PersonRemoveOutlined, Settings, Delete, DriveFileRenameOutline } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, Popper, ClickAwayListener} from "@mui/material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { host } from "../utils/APIRoutes";
import axios from "axios";

const Friend = ({ friendId, name, createdAt, userPicturePath, postId }) => {
  if(createdAt){
    // eslint-disable-next-line no-inner-declarations
    function dateFormat(date) {
      const month = date.getMonth();
      const day = date.getDate();
      const monthString = month >= 10 ? month : `0${month}`;
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
  const handelDelete = async ()=>{
    
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
            <Popper open={open} anchorEl={popperAnc}>
              <ClickAwayListener
                onClickAway={() => {
                  setPopperAnc(null);
                }}
              >
                <List >
                  <ListItem disablePadding>
                    <ListItemButton >
                      <ListItemIcon>
                        <DriveFileRenameOutline />
                      </ListItemIcon>
                      <ListItemText primary="Sửa" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton onClick={handelDelete()}>
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

export default Friend;
