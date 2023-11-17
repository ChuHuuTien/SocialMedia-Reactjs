/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

// import * as React from 'react';
import useAutocomplete from '@mui/base/useAutocomplete';
import { useDispatch, useSelector } from "react-redux";
import { Box, IconButton, InputBase, TextField, useMediaQuery, useTheme} from "@mui/material";
import { Search } from "@mui/icons-material";
import UserSearch from "./UserSearch";


const SearchBar = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 820px)");
  const theme = useTheme();
  const alt = theme.palette.background.alt;
  const primary = theme.palette.primary.main;
  const neutralLight = theme.palette.neutral.light;
  const friends = useSelector((state) => state.user.friends);
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    options: friends,
    getOptionLabel: (option) => `${option.firstName} ${option.lastName}`
  });

  return (
    <Box 
      bgcolor= {neutralLight}
      padding="10px 20px"
      borderRadius="9px"
      margin="10px"
    >
      <Box 
        {...getRootProps()}
        
      >
        <TextField
          inputProps={{ 
            ...getInputProps()
          }}
          InputProps={{
            endAdornment: <IconButton><Search /></IconButton>,
            disableUnderline: true,
          }}
          // {...getInputProps()} 
          placeholder="Tìm kiếm phòng..."
          sx={{
            // width: isNonMobileScreens ? "100%" : "250px",
            width: isNonMobileScreens ? "100%" : "100%",
            
          }}
          variant="standard"
        />
      </Box>
      {groupedOptions.length > 0 ? (
        <Box 
          sx={{
            width: isNonMobileScreens ? "300px" : "250px",
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
              bgcolor: primary
              // bgcolor: theme.palette.mode === 'light' ? '#fff' : '#000',
            }
          }}
        {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <UserSearch
              key={option._id}
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
