/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useChat } from '../../context/ChatProvider';
import useChatActions from '../../hooks/useChatActions';
import { Box, useMediaQuery, useTheme,Typography,Avatar } from "@mui/material";


const RoomList = () => {
    const theme = useTheme();
    const isMobileScreens = useMediaQuery("(max-width: 820px)");
    const alt = theme.palette.background.alt;
    const { palette } = useTheme();
    const dark = palette.neutral.dark;

    const { joinRoom, leaveRoom } = useChatActions();
    const { currentRoom, rooms, setCurrentRoom } = useChat();

    const filteredRooms = rooms.filter(room => {
        const includesCaseInsensitive  = {
            name: `${room.users[0].firstName} ${room.users[0].lastName}`.toLowerCase()
        };

        const { name } = includesCaseInsensitive;

        return name.includes("".toLowerCase())
    });

    const handleRoomClick = (roomID) => {
        if(currentRoom?.id === roomID) {
            return;
        }
        if(currentRoom?._id) leaveRoom(currentRoom._id)

        const selectedRoom = rooms.find(room => room._id === roomID);
        setCurrentRoom(selectedRoom);

        joinRoom(roomID);

        // setIsNavOpen(false);
    }
    

    return (
      <Box 
        width=" 100%"
        height= "100%"
        bgcolor={alt}
        color="#fff"
      >
        <Typography 
          color={dark} 
          padding="10px"
          fontSize="1.2rem"
          fontWeight="500"
        >
          Danh sách phòng
        </Typography>
        <Box 
          sx={{
            overflowY: "scroll",
            '::-webkit-scrollbar': {
              width: '0.4em'
            },
            '::-webkit-scrollbar-thumb':{
              borderRadius:'10px',
              bgcolor: "#cccccc"
              // bgcolor: theme.palette.mode === 'light' ? '#fff' : '#000',
            }
          }}
          height="470px"
          >
            
        {
          filteredRooms.map(room => {
            const { _id, users} = room;
            return (
              <Box 
                display="flex"
                gap= "1vw"
                width= "100%"
                padding="10px"
                bgcolor={currentRoom?._id === _id? "gray": {alt}}
                sx={{
                  '&:hover': { cursor: 'pointer'},
                  transition: "all .05s"
                }}
                key={ _id } 
                onClick={ () => handleRoomClick(_id) }
              >
                <Avatar 
                  alt='room-img' 
                  src={ users[0].avatarURL} 
                  sx={{
                    height: "3vw",
                    width: "3vw",
                    borderRadius: "20px",
                    objectFit: "cover"
                  }}
                />
                <Box
                  display= "flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography
                    fontWeight="500"
                    fontSize="0.8em"
                    color={dark} 
                  >
                  { `${users[0].firstName} ${users[0].lastName}` }
                  </Typography>
                </Box>
              </Box>
            );
                    
        })
        }
        </Box>
          
    </Box>
    );
};

export default RoomList;