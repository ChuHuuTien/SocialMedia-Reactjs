/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Friend from "../../Components/FriendListWidget/Friend";
import WidgetWrapper from "../../Components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfileFriends } from "../../state";
import { host } from "../../utils/APIRoutes";
import axios from "axios";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const primary = palette.primary.main;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.profilefriends);
  const getFriends = async () => {
    const response = await axios.get(`${host}/user/${userId}/friends`, {
      headers: { Authorization: `${token}` },
    })
    const friends = await response.data.friends;
    dispatch(setProfileFriends({friends: friends}));
  };
  
  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box 
        sx={{
          height: isNonMobileScreens? "385px":"250px",
          overflow: "auto",
          '::-webkit-scrollbar': {
            width: '0.4em'
          },
          '::-webkit-scrollbar-thumb':{
            borderRadius:'10px',
            bgcolor: primary,
          }
        }}
      >
        <Box display="flex" flexDirection="column" gap="1.5rem">
          {friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              userPicturePath={friend.avatarURL}
            />
          ))}
        </Box>
      </Box>
    </WidgetWrapper>
    
  );
};

export default FriendListWidget;
