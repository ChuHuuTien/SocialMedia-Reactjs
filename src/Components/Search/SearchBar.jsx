/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

// import * as React from 'react';
import useAutocomplete from '@mui/base/useAutocomplete';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Box, IconButton, InputBase, TextField, useMediaQuery, useTheme} from "@mui/material";
import { Search } from "@mui/icons-material";
import UserSearch from "./UserSearch";
import { host } from "../../utils/APIRoutes";
import axios from "axios";


const SearchBar = ({ myRequest }) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  // const friends = useSelector((state) => state.profilefriends);
  const token = useSelector((state) => state.token);
  const [users, setUsers] = useState();
  const getAllUser = async () => {
    const response = await axios.get(`${host}/user/all`,
      {
        headers: { Authorization: `${token}` },
      }
    )
    const users = await response.data.users;
    setUsers(users);
  };

  useEffect(()=>{
    getAllUser();

  },[])
  

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    options: users,
    getOptionLabel: (option) => `${option.firstName} ${option.lastName}`
  });

  return (
    <Box>
      <Box {...getRootProps()}>
        <TextField
          inputProps={{ 
            ...getInputProps()
          }}
          InputProps={{
            endAdornment: <IconButton><Search /></IconButton>,
            disableUnderline: true,
          }}
          // {...getInputProps()} 
          placeholder="Tìm kiếm..."
          sx={{
            width: isNonMobileScreens ? "300px" : "auto",
            
          }}
          variant="standard"
        />
      </Box>
      {groupedOptions.length > 0 ? (
        <Box 
          sx={{
            width: isNonMobileScreens ? "300px" : "auto",
            height: "600px",
            backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#000',
            overflow: "auto",
            maxHeight: "250px",
            position: "fixed",
            zIndex: "5",
            border: '1px solid #ccc!important',
            borderRadius: '0px 0px 10px 10px',
            '::-webkit-scrollbar': {
              width: '0.4em'
            },
            '::-webkit-scrollbar-thumb':{
              borderRadius:'10px',
              bgcolor: theme.palette.mode === 'light' ? '#fff' : '#000',
            }
          }}
        {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <UserSearch
              key={option._id}
              myRequest={myRequest}
              userId={option._id}
              name={`${option.firstName} ${option.lastName}`}
              userPicturePath={option.avatarURL}
              {...getOptionProps({ option, index })}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
};


export default SearchBar;
