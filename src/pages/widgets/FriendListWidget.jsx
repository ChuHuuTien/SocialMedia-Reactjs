/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../Components/Friend";
import WidgetWrapper from "../../Components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state";
import { host } from "../../utils/APIRoutes";
import axios from "axios";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    const response = await axios.get(`${host}/user/friends`, {
      headers: { Authorization: `${token}` },
    })
    const friends = await response.data.friends;
    dispatch(setFriends({friends:friends}));
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
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            // subtitle={friend.occupation}
            userPicturePath={friend.avatarURL}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
