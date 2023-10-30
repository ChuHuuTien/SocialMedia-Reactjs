/* eslint-disable no-unused-vars */
import { Box, useMediaQuery, Toolbar, AppBar, Fade, useScrollTrigger,Fab } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/AdvertWidget";
import SuggestWidget from "../widgets/SuggestWidget";
import FriendListWidget from "../widgets/FriendListWidget";
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
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
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

const HomePage = (props) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { userid, avatarURL } = useSelector((state) => state.user);
  const friends = useSelector((state) => state.profilefriends);
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
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined} >
          <Box sx={{boxShadow: 5, borderRadius: "10px"}} >
            <UserWidget userId={userid} picturePath={avatarURL} isMyself />

          </Box>
          <Box m="2rem 0" sx={{boxShadow: 5, borderRadius: "10px"}} >
            {isNonMobileScreens && friends && ( <FriendListWidget userId={userid}/> )}
          </Box>
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <Box m="2rem 0" sx={{boxShadow: 5, borderRadius: "10px", marginTop :"0"}} >
            <MyPostWidget picturePath={avatarURL}/>
          </Box>
          <PostsWidget userId={userid} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%" >
            <Box sx={{boxShadow: 5, borderRadius: "10px", marginTop :"0"}} > 
             <SuggestWidget />
            </Box>
              
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

export default HomePage;
