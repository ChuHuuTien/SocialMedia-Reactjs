/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Friend from "../../Components/FriendList/Friend";
import WidgetWrapper from "../../Components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfileFriends, setFriends } from "../../state";
import { host } from "../../utils/APIRoutes";
import axios from "axios";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const primary = palette.primary.main;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.profilefriends);
  const userid = useSelector((state) => state.user.userid);
  const getFriends = async () => {
    const response = await axios.get(`${host}/user/${userid}/friends`, {
      headers: { Authorization: `${token}` },
    })
    const friends = await response.data.friends;
    dispatch(setFriends({friends: friends}));
  };

  const [myRequest, setMyRequest] = useState(null);
  const getProfileFriends = async () => {
    const response = await axios.get(`${host}/user/${userId}/friends`, {
      headers: { Authorization: `${token}` },
    })
    const friends = await response.data.friends;
    dispatch(setProfileFriends({friends: friends}));

    const res = await axios.get(`${host}/user/friend/myrequest`, {
      headers: { Authorization: `${token}` },
    })
    setMyRequest(res.data.myRequest);
  };
  
  useEffect(() => {
    getProfileFriends();
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
        Danh sách bạn
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
          {myRequest && friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              userPicturePath={friend.avatarURL}
              myRequest={myRequest}
            />
          ))}
        </Box>
      </Box>
    </WidgetWrapper>
    
  );
};

export default FriendListWidget;
