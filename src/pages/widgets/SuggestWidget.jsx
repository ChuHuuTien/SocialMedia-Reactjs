/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import FriendSuggest from "../../Components/FriendList/FriendSuggest";
import WidgetWrapper from "../../Components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfileFriends, setFriends } from "../../state";
import { host } from "../../utils/APIRoutes";
import axios from "axios";

const SuggestWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const primary = palette.primary.main;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const token = useSelector((state) => state.token);
  const userid = useSelector((state) => state.user.userid);
  const [myRequest, setMyRequest] = useState(null);
  const [suggestFriend, setSuggestFriend] = useState([]);
  
  const getSuggestFriends = async () => {
    const response = await axios.get(`${host}/user/suggest`, {
      headers: { Authorization: `${token}` },
    })
    const suggestFriend = await response.data.suggestFriend;
    setSuggestFriend(suggestFriend);

    const res = await axios.get(`${host}/user/friend/myrequest`, {
      headers: { Authorization: `${token}` },
    })
    const myRequest = await res.data.myRequest;
    setMyRequest(myRequest);
  };
  useEffect(() => {
    getSuggestFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Gợi ý
      </Typography>
      <Box 
        sx={{
          height: "250px",
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
          {myRequest && suggestFriend.map((friend) => (
            <FriendSuggest
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

export default SuggestWidget;
