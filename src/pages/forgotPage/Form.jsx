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


const emailSchema = yup.object().shape({
  email: yup.string().email("Yêu cầu email").required("Trống"),
});
const otpSchema = yup.object().shape({
  otp: yup.string().min(6, "Tối thiểu 6 kí tự").required("Trống"),
});
const passwordSchema = yup.object().shape({
  password: yup.string().min(6, "Tối thiểu 6 kí tự").required("Trống"),
});

const initialValuesEmail = {
  email:""
};

const initialValuesOtp = {
  otp:"",
};
const initialValuesPassword = {
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("email");
  const [showPassword, setShowPassword] = useState(false);

  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isEmail = pageType === "email";
  const isOtp = pageType ==="otp";
  const isPassword = pageType === "password";
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
  
  const email = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    try{
      const response = await axios.post(`${host}/auth/email`, values );
      const email = await response.data.email;
      toast.success(`Một Email đã gửi đến ${email}, Vui lòng kiểm tra email của bạn `, toastOptions);
      if (email) {
        setPageType("otp");
      }
    }catch(error){
      toast.error(error.response.data.message, toastOptions);
    }

  };
  const otp = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    try{
      const response = await axios.post(`${host}/auth/verifyotp`, values );
      const success = await response.data.success;
      if(success){
        toast.success(`${response.data.message}`, toastOptions);
        setPageType("password");
      }else{
        toast.error(response.data.message, toastOptions);
      }
    }catch(error){
      toast.error(error.response.data.message, toastOptions);
    }

  };
  const password = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    try{
      const response = await axios.post(`${host}/auth/forgot`, values );
      const success = await response.data.success;
      if(success){
        onSubmitProps.resetForm();
        toast.success(`${response.data.message}`, toastOptions);
        navigate("/");
      }else{
        toast.error(response.data.message, toastOptions);
      }
    }catch(error){
      toast.error(error.response.data.message, toastOptions);
    }

  };
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isEmail) await email(values, onSubmitProps);
    if (isOtp) await otp(values, onSubmitProps);
    if (isPassword) await password(values, onSubmitProps);

    // if (isRegister) await register(values, onSubmitProps);
    // if (isLogin) await login(values, onSubmitProps);

  };

  return (
    <>
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isEmail ? initialValuesEmail : initialValuesOtp}
      validationSchema={isEmail ? emailSchema : otpSchema}
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
            {isOtp && (
                <TextField
                  label="Otp"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.otp ||''}
                  name="otp"
                  error={
                    Boolean(touched.otp) && Boolean(errors.otp)
                  }
                  helperText={touched.otp && errors.otp}
                  sx={{ gridColumn: "span 4" }}
                />
            )}
            
            {isEmail && (
                <TextField
                label="Email đã đăng ký"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email ||''}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
            )}
            {isPassword && (
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
            )}
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
              {isEmail && "GỬi"}
              {isOtp && "XÁC THỰC"}
              {isPassword && "ĐỔI MẬT KHẨU"}
            </Button>

          </Box>
        </form>
      )}
      
    </Formik>
    <ToastContainer />
    </> 
  );
};

export default Form;
