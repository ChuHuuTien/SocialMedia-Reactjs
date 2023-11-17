/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  IconButton,
  Divider,
  Grid
} from "@mui/material";
import { Visibility, VisibilityOff, Google } from "@mui/icons-material";
import axios from "axios";
import { Formik } from "formik";
import { ToastContainer,toast } from "react-toastify";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setFriends, setProfileFriends } from "../../state";
import {host, loginRoute, registerRoute} from '../../utils/APIRoutes';
import 'react-toastify/dist/ReactToastify.css';
import { useGoogleLogin } from '@react-oauth/google'


const registerSchema = yup.object().shape({
  firstName: yup.string().required("Trống"),
  lastName: yup.string().required("Trống"),
  email: yup.string().email("invalid email").required("Trống"),
  password: yup.string().min(6, "Tối thiểu 6 kí tự").required("Trống"),
  // picture: yup.string().required("Trống"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Yêu cầu email").required("Trống"),
  password: yup.string().min(6, "Tối thiểu 6 kí tự").required("Trống"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  // picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  
  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    // formData.append("picturePath", values.picture.name);

    try{
      const savedUserResponse = await axios.post(registerRoute, values);
      const savedUser = await savedUserResponse.data;
      onSubmitProps.resetForm();
      toast.success("Đăng kí thành công", toastOptions);
      if (savedUser) {
        setPageType("login");
      }
    }catch(error){
      toast.error(error.response.data.message, toastOptions);
    }

  };
  
// email: "chuhuutien0@gmail.com"
// email_verified: true
// family_name: "chu"
// given_name: "tien"
// locale: "vi"
// name: "tien chu"
// picture: "https://lh3.googleusercontent.com/a/ACg8ocIIYxDW5G1B6g81TeVMPVCxQH8GQPfUiGgbMZgjpm8j=s96-c"
// sub: "113852049961266024610"
  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      // console.log(tokenResponse);
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => res.data)
        .catch((error)=>{console.log(error)})

      // console.log(userInfo);
      try{
        const response  = await axios.post(`${host}/auth/google`,{
          usergoogle: userInfo
        });
        const data = response.data;
        if (data) {
          dispatch(
            setLogin({
              user: data.user,
              token: data.accessToken,
            })
          );
          const response = await axios.get(`${host}/user/${data.user.userid}/friends`, {
            headers: { Authorization: data.accessToken },
          })
          const friends = await response.data.friends;
          dispatch(setProfileFriends({friends: friends}));
          dispatch(setFriends({friends: friends}));
          navigate("/");
        }
      }catch(error){
        console.log(error);
        toast.error(error.response.data.error, toastOptions);
      }
    },
    onError: errorResponse => console.log(errorResponse),

  });


  const login = async (values, onSubmitProps) => {
    try{
      const loggedInResponse = await axios.post(loginRoute, values);
      const loggedIn = await loggedInResponse.data;
      onSubmitProps.resetForm();
      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.accessToken,
          })
        );
        const response = await axios.get(`${host}/user/${loggedIn.user.userid}/friends`, {
          headers: { Authorization: loggedIn.accessToken },
        })
        const friends = await response.data.friends;
        dispatch(setProfileFriends({friends: friends}));
        dispatch(setFriends({friends: friends}));
        navigate("/");
      }
    }catch(error){
      toast.error(error.response.data.error, toastOptions);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <>
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName ||''}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName ||''}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email ||''}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password ||''}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <IconButton 
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}

            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÍ"}
            </Button>

              {
                isLogin && (
                <>
                    <Divider>
                    HOẶC
                  </Divider>
                  
                  <Button
                    fullWidth
                    onClick={googleLogin}
                    sx={{
                      m: "2rem 0",
                      p: "1rem",
                      gap: "1rem",
                      backgroundColor: palette.primary.main,
                      color: palette.background.alt,
                      "&:hover": { color: palette.primary.main },
                    }}
                    >
                    <Google/>
                    { "ĐĂNG NHẬP VỚI GOOGLE" }
                  </Button>
                  
                </>
                )
              }
            <Box 
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
            >  
              
              <Typography
                align="left"
                display={"inline"}
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
                
              >
                {isLogin
                  ? "Chưa có tài khoản? Đăng kí ở đây."
                  : "Đã có tài khoản? Đăng nhập."}
              </Typography>
                  
              <Typography
                margin="0 0 0 auto"

                align="right"
                display={"inline"}
                onClick={() => navigate("/forgot")}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                Quên mật khẩu
              </Typography>
            </Box>
          </Box>
        </form>
      )}
      
    </Formik>
    <ToastContainer />
    </> 
  );
};

export default Form;
