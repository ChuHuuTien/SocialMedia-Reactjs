/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { CheckCircle, RemoveCircle, PlaylistAddCheck, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../../state";
import FlexBetween from "../FlexBetween";
import UserImage from "../UserImage";
import { host } from "../../utils/APIRoutes";
import axios from "axios";

const FriendCheck = ({ friendId, name, userPicturePath,  }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const { userid } = useSelector((state) => state.user);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const [isSelect, setisSelect] = useState(false);

  const acceptFriend = async () => {
    setisSelect(true);
    // setFriendrequest((prev)=>{
    //   return prev.filter((item)=>{return item !== friend});
    // })
    const response = await axios.post(`${host}/user/updatefriend`,
      {
        friendid: friendId,
        isAccept: true
      },
      {
        headers: { Authorization: `${token}` },
      }
    )
    const friends = await response.data.friends;
    dispatch(setFriends({friends: friends}));
  };
  const denyFriend = async () => {
    setisSelect(true);
    const response = await axios.post(`${host}/user/updatefriend`,
      {
        friendid: friendId,
        isAccept: false
      },
      {
        headers: { Authorization: `${token}` },
      }
    )
    const friends = await response.data.friends;
    dispatch(setFriends({friends: friends}));
  };
  return (
    <Box sx={{
      display: "flex",
      // justifyContent: "space-between",
      alignItems: "center",
    }}
    >
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
        </Box>
      </FlexBetween>
        {
          !isSelect ? (
            <>
            <IconButton 
              onClick={() => acceptFriend()}
              sx={{ backgroundColor: primaryLight, p: "0.6rem", marginLeft: "auto"}}
            >
              <CheckCircle sx={{ color: primaryDark }} />

            </IconButton>
              
            <IconButton
              onClick={() => denyFriend()}
              sx={{ backgroundColor: primaryLight, marginLeft: "0.6rem", p: "0.6rem" }}
            >
              <RemoveCircle sx={{ color: primaryDark }} />

            </IconButton>
            </>
            
          ) : (
            <IconButton
              // onClick={() => patchFriend()}
              sx={{ backgroundColor: primaryLight, p: "0.6rem", marginLeft: "auto"}}
            >
              <PlaylistAddCheck sx={{ color: primaryDark }} />
            
            </IconButton>
          )
        }    
        

        
    </Box>
  );
};

export default FriendCheck;
