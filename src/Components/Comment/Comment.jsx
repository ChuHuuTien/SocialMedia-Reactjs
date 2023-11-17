/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import {

  MoreVert,
  Delete
} from "@mui/icons-material";
import { Box, Divider, IconButton,Grid, Popper, ClickAwayListener, useTheme } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { host } from "../../utils/APIRoutes";
import axios from "axios";


const Comment = ({ postId, comment, comments, setComments })=>{
  const [popperAnc, setPopperAnc] = useState(null);
  const { palette } = useTheme();
  const loggedInUserId = useSelector((state) => state.user.userid);
  const token = useSelector((state) => state.token);
  const open = Boolean(popperAnc);
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;

  function Format(date) {
    const now = new Date(Date.now());
    date = new Date(date)
    const time = new Date(now - date);
    const second = date.getSeconds();
    const minute = date.getMinutes();
    const hour = date.getHours();
    if(time.getMonth() <= 1){
      if(time.getDate() <=1){
        if(hour == now.getHours()){
          if(minute == now.getMinutes()){
            if(now.getSeconds() - second <= 0) return 'bây giờ'
            else return `${now.getSeconds() - second} giây trước`
          } return `${now.getMinutes() - minute} phút trước`
        } return `${now.getHours() - hour} giờ trước`
      }else return `${time.getDate()} ngày trước`
    }else return `${time.getMonth()} tháng trước`
  }
  

  const handelSetting = async (e) => {
    setPopperAnc(e.currentTarget);
  };
  const handelDeleteComment = async (commentid)=>{
    try{
      await axios.delete(`${host}/post/${commentid}/comment`,
      {
        postId: postId
      },
      {
        headers: { Authorization: `${token}` },
      })
    }catch(error){
      console.log(error);
    }
    const newComments = comments.filter((comment)=> comment._id != commentid)
    setComments(newComments);
  }
  return (
    <Box key={comment._id} sx={{margin: "0px 10px"}}>
      <Divider variant="fullWidth" style={{ margin: "0px 0px" }} />
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <Box sx={{ display: "inline"}}>
                <img
                  style={{ objectFit: "cover", borderRadius: "50%"}}
                  width="30px"
                  height="30px"
                  alt="user"
                  src={comment.commentByUser.avatarURL}
                  display="inline"
                />
            </Box>
        </Grid>
        <Grid justifyContent="left" item xs zeroMinWidth>
          <label style={{ margin: 0, textAlign: "left" }}>
            <label ><b>{comment.commentByUser.firstName+" "+ comment.commentByUser.lastName +" "} </b> · </label>
            <label style={{ margin: 0, color: "gray" }}> {" "+Format(comment.createdAt)}</label>
            {comment.creatorId == loggedInUserId && (
              <>
              <IconButton
                onClick={(e) => handelSetting(e)}
                sx={{padding: 0}}
                // sx={{ backgroundColor: primaryLight }}
              >
                <MoreVert sx={{ color: primaryDark }} />
              </IconButton>
              <Popper
                open={open} 
                anchorEl={popperAnc} 
                placement={'bottom-end'}
                sx={{
                  border: "1px solid #333",
                  zIndex: 1301,
                  backgroundColor: primaryLight,
                }}>
                <ClickAwayListener
                  onClickAway={() => {
                    setPopperAnc(false);
                  }}
                >
                  <IconButton onClick={()=>handelDeleteComment(comment._id)} >
                    <Delete />
                  </IconButton>
                </ClickAwayListener>
              </Popper>
              </>
            )}
            
            
        
          </label>
          <p style={{ textAlign: "left" }}>
            {comment.content}
          </p>
        </Grid>
      </Grid>
      </Box>
  )
}

export default Comment;
