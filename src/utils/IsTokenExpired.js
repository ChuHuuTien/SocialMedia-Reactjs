
import { useDispatch } from "react-redux";
import { Buffer } from 'buffer';
import { setLogout } from "../state";

export default function IsTokenExpired(token){
  const dispatch = useDispatch();
  
  const isTokenExpired = (token) => {
    if(token){
      return Date.now() >= JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp * 1000
    }else return true;
  };
  
  if(isTokenExpired(token)){
    dispatch(setLogout())
  }
} 