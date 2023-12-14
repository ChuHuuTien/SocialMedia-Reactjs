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
  TextField,
  Button
} from "@mui/material";

import axios from "axios";
import { Close, Search} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setProfileFriends } from "../../state";
import {host} from '../../utils/APIRoutes';
import WidgetWrapper from "../WidgetWrapper";

const DeleteFriend = ({handleCloseDelete, name, patchFriend}) => {
  const { palette } = useTheme();
  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1rem" }}
        textAlign="center"
      >
        Hủy kết bạn với {name}
        <IconButton
            onClick={handleCloseDelete}
            sx={{ 
              padding: 0,
              float: "right" 
            }}
          >
            <Close />
          </IconButton>
      </Typography>
      <hr style={{margin : "0 0 10px 0"}}/>  
      Bạn có chắc chắn muốn hủy kết bạn với {name} không?
      <Box display="flex" justifyContent="flex-end" marginTop="1rem">
        <Button variant="text" onClick={handleCloseDelete}>Hủy</Button>
          <Button variant="contained" onClick={patchFriend}>
            Xác nhận
          </Button>     
      </Box>     
    </WidgetWrapper>

  );
};

export default DeleteFriend;
