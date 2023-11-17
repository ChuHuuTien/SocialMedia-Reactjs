/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  Email
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton, Modal, useMediaQuery } from "@mui/material";
import UserImage from "../../Components/UserImage";
import FlexBetween from "../../Components/FlexBetween";
import WidgetWrapper from "../../Components/WidgetWrapper";
import ManageAccount from "../../Components/ManageAccount";
import ManageFriends from "../../Components/FriendList/ManageFriends";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { host } from "../../utils/APIRoutes";
import axios from "axios";

const UserWidget = ({ userId, picturePath, isMyself }) => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
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
  const getUser = async () => {
    const response = await axios.get(`${host}/user/${userId}`,
      {
        headers: { Authorization: `${token}` },
      }
    )
    const user = await response.data.user;
    setUser(user);
  };
  const HandlerManagerClick = async ()=>{
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [openFriends, setOpenFriends] = useState(false);

  const HandleFriends = ()=>{
    setOpenFriends(true);
  }
  const handleCloseFriends = () => {
    setOpenFriends(false);
  };
  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    _id,
    firstName,
    lastName,
    address,
    avatarURL,
    email,
    friends,
  } = user;

  return (
    <WidgetWrapper
      // sx={{ border: 1 }}
    >
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>

            <Typography 
              color={medium} 
              sx={{
                '&:hover': { cursor: 'pointer'}
              }} 
              onClick={HandleFriends}
            >
              {friends.length} bạn bè
              </Typography>
                <Modal
                  open={openFriends}
                  onClose={handleCloseFriends}
                >
                  {isNonMobileScreens ? 
                    (
                    <Box sx={{ ...style, width: 1/3 }}>
                      <ManageFriends handleClose={handleCloseFriends} userId={userId}/>
                    </Box>
                    ):(
                    <Box sx={{ ...style, width: 1, height: 3/4, overflow: 'auto'}}>
                      <ManageFriends handleClose={handleCloseFriends} userId={userId}/>
                    </Box>
                    )
                  }
                </Modal>

            
          </Box>
        </FlexBetween>
        {isMyself &&
          <>
            <IconButton onClick={()=>HandlerManagerClick()}>
              <ManageAccountsOutlined />
            </IconButton>
            <Modal
              open={open}
              onClose={handleClose}
            >
              {isNonMobileScreens ? 
                (
                <Box sx={{ ...style, width: 1/2 }}>
                  <ManageAccount handleClose={handleClose} user={user}/>
                </Box>
                ):(
                <Box sx={{ ...style, width: 1, height: 3/4, overflow: 'auto'}}>
                  <ManageAccount handleClose={handleClose} user={user}/>
                </Box>
                )
              }
            </Modal>
          </>
        }
        
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{address}</Typography>
        </Box>
        {/* <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box> */}
      </Box>

      <Divider />

      

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Thông tin
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <Email fontSize="large" sx={{ color: main }} />
            <Box>
              <Typography color={main} fontWeight="500">
                Email
              </Typography>
              <Typography color={medium}>{email}</Typography>
            </Box>
          </FlexBetween>
          {/* <EditOutlined sx={{ color: main }} /> */}
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
