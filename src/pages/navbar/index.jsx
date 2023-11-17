/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Avatar,
  Modal
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setFriendrequest } from "../../state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../Components/FlexBetween";
import SearchBar from "../../Components/Search/SearchBar";
import FriendRequest from "../../Components/FriendList/FriendRequest";
import { googleLogout } from '@react-oauth/google';
import axios from "axios";
import { host } from "../../utils/APIRoutes";
import { set } from "date-fns";


const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const token = useSelector((state) => state.token);
  const friendrequest = useSelector((state) => state.friendrequest);

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;
  const Logout = async ()=>{
    dispatch(setLogout());
    googleLogout();
  }
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: "75%",
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '1px solid #ccc!important',
    borderRadius: '25px',
    boxShadow: 24,
    pt: 2,
    px: 2,
    pb: 2,
  };
  const handleNotification = ()=>{
    setOpen(true);
  }
  const handleCloseRequest = () => {
    setOpen(false);
    window.location.reload();
  };
  const [myRequest, setMyRequest] = useState([]);
  const getFriendRequests = async () => {
    const response = await axios.get(`${host}/user/friend/request`, {
      headers: { Authorization: `${token}` },
    })
    dispatch(setFriendrequest({ friendrequest: response.data.friendrequest }));

    const res = await axios.get(`${host}/user/friend/myrequest`, {
      headers: { Authorization: `${token}` },
    })
    setMyRequest(res.data.myRequest);
  };
  useEffect(() => {
    getFriendRequests();
  }, []);

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="0rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/")}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
          padding={isNonMobileScreens? "0rem 1.5rem" : "0rem 0.5rem 0rem 0rem"}
          
        >
          {/* {isNonMobileScreens? "InstaShare" : "I"} */}
          {isNonMobileScreens? "InstaShare" : <Avatar alt="InstaShare" src="https://res.cloudinary.com/dckxgux3k/image/upload/v1698927041/InstaSharePic_id022d.ico" />}

        </Typography>
        <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding={isNonMobileScreens? "0.1rem 1.5rem" : "0.1rem 1rem"}
            margin={isNonMobileScreens? "" : "0 0.5rem 0 0"}
            sx={{
              width: 1
            }}
          >
            
            <SearchBar myRequest={myRequest}/>
          </FlexBetween>
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton onClick={() => navigate("/message")}>
            <Message sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton onClick={handleNotification}>
            <Notifications sx={{ fontSize: "25px" }} /> {friendrequest.length}
          </IconButton>
          <Modal
                  open={open}
                  onClose={handleCloseRequest}
                >
                  <Box sx={{ ...style, width: 1/3 }}>
                      <FriendRequest handleCloseRequest={handleCloseRequest}
                      friendrequest={friendrequest} />
                    </Box>
                </Modal>
          <FormControl  variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigate("/reset")}>
                Đổi mật khẩu
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Đăng xuất</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton onClick={() => navigate("/message")}>
              <Message sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton onClick={handleNotification}>
              <Notifications sx={{ fontSize: "25px" }} />{friendrequest.length}
            </IconButton>
            <Modal
                  open={open}
                  onClose={handleCloseRequest}
                >
                  <Box sx={{...style, width: 1, height: 3/4, overflow: 'auto' }}>
                      <FriendRequest handleCloseRequest={handleCloseRequest} 
                      friendrequest={friendrequest} />
                    </Box>
                </Modal>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate("/reset")}>
                  Đổi mật khẩu
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Đăng xuất
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
