/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { PersonAddOutlined, PersonRemoveOutlined, HourglassTop } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, Modal, useMediaQuery} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../../state";
import FlexBetween from "../FlexBetween";
import UserImage from "../UserImage";
import { host } from "../../utils/APIRoutes";
import axios from "axios";
import DeleteFriend from "../ConfirmDelete/DeleteFriend";
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
  const [isLoading, setIsLoading] = useState(myRequest.includes(userId));
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [openDelete, setOpenDelete] = useState(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    // border: '1px solid #ccc!important',
    borderRadius: '25px',
    boxShadow: 24,
  };
  const HandelDelete = async () => {
    setOpenDelete(true)
  };
  const handleCloseDelete = async ()=>{
    setOpenDelete(false);
  };
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
        isNotMyself && isFriend && !isLoading&& (
          <>
          <IconButton
            onClick={() => patchFriend()}
            // onClick={() => HandelDelete()}
            disabled={!isFriend && isLoading}
            sx={{ 
              backgroundColor: primaryLight, 
              p: "0.5rem",
              size: 10
            }}
            >
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          </IconButton>
          <Modal
            open={openDelete}
            onClose={handleCloseDelete}
            >
            <Box 
              sx={{ 
                ...style, 
              }}
              width={isNonMobileScreens? 1/3: 1}
              height="auto"
              maxHeight={isNonMobileScreens? 7/8: 3/4}
              >
                <DeleteFriend handleCloseDelete={handleCloseDelete} name={name} patchFriend={patchFriend}/>
              </Box>
          </Modal>
          </>
        )
      }
      {
        isNotMyself&&!isFriend && !isLoading && (
          <IconButton
            onClick={() => patchFriend()}
            sx={{ 
              backgroundColor: primaryLight, 
              p: "0.5rem",
              size: 10
            }}
          >
            <PersonAddOutlined sx={{ color: primaryDark }} />
          </IconButton>
        )
      }
      {
        isNotMyself&&!isFriend && isLoading && (
          <IconButton
            onClick={() => patchFriend()}
            disabled={!isFriend && isLoading}
            sx={{ 
              backgroundColor: primaryLight, 
              p: "0.5rem",
              size: 10
            }}
          >
            <HourglassTop sx={{ color: primaryDark}} />
          </IconButton>
        )
      }
      
    </FlexBetween>
  );
};

export default UserSearch;
