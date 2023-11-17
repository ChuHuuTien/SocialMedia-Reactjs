/* eslint-disable no-unused-vars */
import { ChatProvider } from '../../context/ChatProvider';

import ChatContainer from '../../Components/Chat/ChatContainer';

import Navbar from '../navbar';
import {AppBar, Box } from "@mui/material";


const Message = ()=>{
  return (
    <Box
      margin= "0"
      padding= "0"
      outline= "transparent"
      boxSizing="border-box"
    >
      <ChatProvider>  
        <Box>
          <AppBar>
            <Navbar/>
          </AppBar>
          
          <ChatContainer/>
        </Box>
      </ChatProvider>
    </Box>
  )
} 
  

export default Message;
