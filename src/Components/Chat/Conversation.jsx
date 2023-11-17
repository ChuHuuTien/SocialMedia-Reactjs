/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import useMessages from '../../hooks/useMessages';
import { useChat } from '../../context/ChatProvider';
import { useSelector } from "react-redux";
import { Avatar, Box, useTheme } from "@mui/material"

const Conversation = () => {
    const { socket } = useChat();
    const { palette } = useTheme();
    const messages = useMessages();
    const userid = useSelector((state) => state.user.userid);
    const primary = palette.primary.main;
    const scrollRef = useRef(null);

    useEffect(()=>{
      if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behaviour: "smooth" });
          }
    }, [messages])

    return (
      <Box 
        display = "flex"
        flexDirection ="column"
        gap = "1vh"
        padding ="20px 10px"
      >
        {
          messages.map((m) => {
            const { message, postedByUser, _id } = m;
            const isNotMe = ( postedByUser._id !== userid );
              return (
                <Box 
                  display= "flex"
                  // gap=" 20px"
                  color= "#fff"
                  fontSize= "1rem"
                  flexDirection={isNotMe? 'row' : 'row-reverse'}
                  key={ _id } 
                  margin={isNotMe ? "0 100px 0 0":"0  0 0 100px"}
                  >
                  <Avatar
                    src= {postedByUser.avatarURL}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Box 
                    display= "flex"
                    fontSize= "0.8em"
                    fontWeight= {300}
                    padding= "0.8em 1em"
                    bgcolor= { isNotMe ? "#ccc" : primary}
                    border= { isNotMe? "none" : "1px solid rgba(0, 0, 0, 0.1)"}
                    color= {isNotMe? 'black' : '#000'}
                    boxShadow= {isNotMe? 'rgba(32, 112, 198, 0.4) 2px 3px 15px' : 'rgba(0, 0, 0, 0.15) 2px 3px 15px'} 
                    borderRadius= {isNotMe? '0 8px 8px 8px' : '8px 0 8px 8px'}
                    margin={isNotMe? '0 0px 0px 20px' : '0px 20px 0px 0px'}
                  >
                    { message.messageText }
                  </Box>
                </Box>
                )
                
            })
            }
        <Box  ref={scrollRef} style={{ visibility: "none"}} />

        </Box>
    );
};

export default Conversation;