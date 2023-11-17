/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Box,
  useMediaQuery,
  Typography,
  useTheme,
  IconButton,
  TextField
} from "@mui/material";

import axios from "axios";
import { Close, Search} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setProfileFriends } from "../../state";
import {host} from '../../utils/APIRoutes';
import FriendCheck from "./FriendCheck";
import WidgetWrapper from "../WidgetWrapper";
import { XoaDau } from "../../utils/helpers";

const FriendRequest = ({handleCloseRequest, friendrequest}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const primary = palette.primary.main;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const friends = useSelector((state) => state.profilefriends);
  const [searchItem, setSearchItem] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  

  const handleInputChange = (e) => { 
    const searchTerm = e.target.value;
    setSearchItem(searchTerm)
    
    // filter the items using the apiUsers state
    const filteredItems = friends.filter((friend) =>
      XoaDau(friend.firstName.toLowerCase() +" "+ friend.lastName.toLowerCase()).includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filteredItems);
  }

  useEffect(() => {
    setFilteredUsers(friendrequest);
  }, []);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Yêu cầu kết bạn
        <IconButton
            onClick={handleCloseRequest}
            sx={{ 
              padding: 0,
              float: "right" 
            }}
          >
            <Close />
          </IconButton>
      </Typography>
      <TextField
          InputProps={{
            endAdornment: <IconButton><Search /></IconButton>,
            disableUnderline: true,
          }}
          placeholder="Tìm kiếm..."
          value={searchItem}
          onChange={handleInputChange}
          sx={{
            width: "100%",
            
          }}
          variant="standard"
        />  
      <hr style={{margin : "0 0 10px 0"}}/>  

      <Box 
        sx={{
          height: isNonMobileScreens? "400px":"auto",
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
          {filteredUsers.map((friend) => (
            <FriendCheck
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

export default FriendRequest;
