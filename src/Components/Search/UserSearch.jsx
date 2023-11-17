/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { PersonAddOutlined, PersonRemoveOutlined, HourglassTop } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, Popper, ClickAwayListener} from "@mui/material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../../state";
import FlexBetween from "../FlexBetween";
import UserImage from "../UserImage";
import { host } from "../../utils/APIRoutes";
import axios from "axios";

const UserSearch = ({ userId, name, userPicturePath, myRequest }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const { userid } = useSelector((state) => state.user);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const isFriend = friends.find((friend) => friend._id === userId);
  const isNotMyself = userId !== userid;
  const [isLoading, setIsLoading] = useState(myRequest.includes(userId))

  const patchFriend = async () => {
    const response = await axios.post(`${host}/user/updatefriend`,
      {
        friendid: userId,
      },
      {
        headers: { Authorization: `${token}` },
      }
    )
    const friends = await response.data.friends;
    if(response.data.message=="Add request success"){
      setIsLoading(true)
    }else{
      dispatch(setFriends({friends: friends}));
    }
  };
  return (
    <FlexBetween padding="5px 0px">
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="35px" />
        <Box
          onClick={() => {
            navigate(`/profile/${userId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h6"
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
        </Box>
      </FlexBetween>
      {
        
        isNotMyself ? (
          <IconButton
            onClick={() => patchFriend()}
            disabled={!isFriend && isLoading}
            sx={{ 
              backgroundColor: primaryLight, 
              p: "0.5rem",
              size: 10
            }}
          >
            {isFriend && !isLoading && (
              <PersonRemoveOutlined sx={{ color: primaryDark }} />
            )}
            {!isFriend && !isLoading && (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
            {!isFriend && isLoading && (
              <HourglassTop sx={{ color: primaryDark}} />
            )}
            {/* {isFriend ? (
              <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )} */}
          </IconButton>
        ) :( 
          <>
            
          </>
        )
      }
      
    </FlexBetween>
  );
};

export default UserSearch;
