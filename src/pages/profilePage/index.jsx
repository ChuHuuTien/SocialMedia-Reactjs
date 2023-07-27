import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";
import { host } from "../../utils/APIRoutes";
import axios from "axios";

const ProfilePage = () => {
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
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.avatarURL} isMyself={isMyself}/>
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {isMyself && 
            <MyPostWidget picturePath={user.avatarURL} isMyself={isMyself}/>
          }
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
