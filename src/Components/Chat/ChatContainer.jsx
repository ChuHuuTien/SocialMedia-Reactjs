/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RoomList from './RoomList';
import ChatForm from './ChatForm';
import Conversation from './Conversation';
import SearchBar from './SearchBar';
import FlexBetween from '../FlexBetween';
import { useChat } from '../../context/ChatProvider';
import { host } from "../../utils/APIRoutes";
import axios from "axios";
import { useSelector } from "react-redux";
import {AppBar, Box, useMediaQuery, useTheme, Typography, Avatar } from "@mui/material";


const ChatContainer = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 820px)");
  const alt = theme.palette.background.alt;
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const { currentRoom, rooms, setRooms } = useChat();
  const token = useSelector((state) => state.token);

  useEffect( () => {
    const loadData = async ()=>{
      const response = await axios.get(`${host}/room`,{
          headers: {
            Authorization: token
          },
        });
      setRooms(response.data.conversation);
    };
    loadData();
  },[]);
  return (
    <Box 
      width="100%"
      height="100%"
      padding="5.5rem 1rem 0rem 1rem"
      display={isNonMobileScreens ? "flex" : "block"}
      justifyContent="space-between"
      // sx={{boxShadow: 5}}
      
    >          
      <Box flexBasis={isNonMobileScreens ? "25%" : "0%"} border= '1px solid #ccc' >
        <Box 
          bgcolor={alt}
          padding="10px"
          borderBottom='1px solid #ccc'
        > 
          <SearchBar />
        </Box>
        <Box>
          {rooms && isNonMobileScreens&& 
            <RoomList/>
          } 
        </Box>
      </Box>
      <Box flexBasis={isNonMobileScreens ? "75%" : "100%"} border= '1px solid #ccc'>          
        <Box
          // padding= "3vh 3vh 1vh 3vh"
          padding= "0"
          display= "flex"
          flexDirection="column"
          height= "100%"
          bgcolor={alt}
        >
          {
            !currentRoom ? 
            <Box
              alignItems="center"
            >
              <Typography 
                margin="2rem 0"
                fontSize="1em"
                textAlign="center"
                color={dark} 
                padding="10px"
                fontWeight="500"
                // position= 'absolute'
                top= '50%'
                left= '50%'
              >
                Tin nhắn của bạn <br/> 
                Gửi tin nhắn riêng tư cho bạn bè 
                <br/> Tìm kiếm và kết bạn để bắt đầu! 🙋🏽‍♂️
              </Typography>
            </Box>
            :
            <Box >
              <Box
                display= "flex"
                alignItems= "center"
                gap="1em"
                padding="1vh 1vh 1vh 1vh"
                height="3.2em"
                borderBottom='1px solid #ccc'
              > 
                <Avatar 
                  alt="room-img" 
                  src={ currentRoom.users[0].avatarURL } 
                  sx={{
                    height:"100%",
                    borderRadius: "0.7em"
                  }}
                />
                <Typography
                  fontSize="0.85em"
                  fontWeight={600}
                >
                  { `${currentRoom.users[0].firstName} ${currentRoom.users[0].lastName}` }
                </Typography>      
              </Box>
                
              <Box 
                sx={{
                  overflowY: "scroll", 
                  height: "500px" ,
                  '::-webkit-scrollbar': {
                    width: '0.4em'
                  },
                  '::-webkit-scrollbar-thumb':{
                    borderRadius:'10px',
                    bgcolor: "#cccccc"
                  }
                }}
                borderBottom='1px solid #ccc'
              >
                <Conversation />
              </Box>

              <Box 
                // sx={{
                //   position: "sticky",
                //   bottom: "0px",
                // }}
              >

                <ChatForm />
              </Box>   
            </Box>

          }
          </Box>



            </Box>

            
        </Box>
    );
};

export default ChatContainer;