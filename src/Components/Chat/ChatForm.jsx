/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import useChatActions from '../../hooks/useChatActions';
import { useChat } from '../../context/ChatProvider';
import { host } from "../../utils/APIRoutes";
import axios from "axios";
import { useSelector } from "react-redux";
import { Box, useTheme, InputBase, Button, TextField} from "@mui/material"

const ChatForm = () => {
    const inputRef = useRef(null);
    const { sendMessage } = useChatActions();
    const { currentRoom, setNewMessage } = useChat();
    const token = useSelector((state) => state.token);
    const { palette } = useTheme();
    const [comment, setComment] = useState("");
    const dark = palette.neutral.dark;
    
    const handelChat = async()=>{
      if(comment == "") return;
        try{
          const newmsg = await axios.post(`${host}/room/${currentRoom._id}/message`, 
          {
            messageText: comment,
          },
          {
            headers: {
              Authorization: token
            },
          }
          );
          sendMessage(newmsg.data.message);
          setNewMessage(newmsg.data.message);
          setComment("")
          inputRef.current.focus();
        }catch(error){
          console.log(error);
        }
    }
    return (
      <Box 
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          verticalAlign: "middle",
        }}
        padding="15px"
      >
          <InputBase
            onKeyDown={(event) => {
              if (event.key=="Enter" && event.keyCode == '13'){
                return handelChat()
              }
            }}
            autoFocus = {true}
            ref={ inputRef }
            placeholder="Nhắn tin..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            multiline={true}
            maxRows={2}
            sx={{
                maxHeight:"100px",
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "10px",
                padding: "5px 10px",
                fontWeight: 200,
                color: dark 
            }}
            
          />
          <Button 
            disabled={!comment}
            size="medium" 
            onClick={handelChat}
            sx={{
              padding:"0px 0px"
            }}
          >
            Gửi
          </Button>
      </Box>
    );
};

export default ChatForm;