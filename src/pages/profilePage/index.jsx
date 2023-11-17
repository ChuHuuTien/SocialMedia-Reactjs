/* eslint-disable no-unused-vars */
import { Box, useMediaQuery, Toolbar, AppBar,useScrollTrigger, Fade, Fab } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";
import AdvertWidget from "../widgets/AdvertWidget";
import { host } from "../../utils/APIRoutes";
import axios from "axios";
import PropTypes from 'prop-types';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 10}}
      >
        {children}
      </Box>
    </Fade>
  );
}
ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const ProfilePage = (props) => {
  const [user, setUser] = useState(null);
  const [isMyself, setIsMyself] = useState(true);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const userLoginId = useSelector((state) => state.user.userid);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    const response = await axios.get(`${host}/user/${userId}`,
      {
        headers: { Authorization: `${token}` },
      }
    )
    const user = await response.data.user;
    setUser(user);
    if(user._id == userLoginId){
      setIsMyself(true);
    }else{
      setIsMyself(false);
    }
  };

  useEffect(() => {
    getUser();    
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <AppBar>
          <Navbar />
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <Box sx={{boxShadow: 5, borderRadius: "10px"}} >
            <UserWidget userId={userId} picturePath={user.avatarURL} isMyself={isMyself}/>
          </Box>
          <Box m="2rem 0" />
          <Box sx={{boxShadow: 5, borderRadius: "10px"}} >
            <FriendListWidget userId={userId} />

          </Box>
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <Box sx={{boxShadow: 5, borderRadius: "10px"}} >
            {isMyself && 
              <MyPostWidget picturePath={user.avatarURL} isMyself={isMyself}/>
            }
          </Box>
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            {/* <AdvertWidget /> */}
          </Box>
        )}
      </Box>
      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Box>
  );
};

export default ProfilePage;
