/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  IconButton
} from "@mui/material";
import axios from "axios";
import {EditOutlined , Close} from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import FlexBetween from "../FlexBetween";
import {host} from '../../utils/APIRoutes';


const accountSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  avatarURL: yup.string().required("required"),
  address: yup.string().required("required"),
});

const ManageAccount = ({handleClose, user}) => {
  const initialAccount = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatarURL: user.avatarURL,
    address: user.address
  };
  
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [image, setImage] = useState(null);

  const handleFormSubmit = async (values) => {
    if(image){
      values.image = image.base64;
    }
    // console.log(values);
    const loggedInResponse = await axios.post(`${host}/user/updateuser`, values,
    {
      headers: { Authorization: `${token}` },
    });
    if(loggedInResponse){
      navigate(`/profile/${user._id}`);
      navigate(0);
    }
  };

  const onFileToBase64 = file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      image.base64 = reader.result
    };
  };

  useEffect(()=>{
    if(image){
      onFileToBase64(image);
    }
  },[image])
  return (
    <Formik
      initialValues={initialAccount}
      validationSchema={accountSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
      <>
        <Box
          sx={{
            width: 1,
            height: 50,
            fontSize: 20,
          }}   
        >
          Chỉnh sửa hồ sơ
          <IconButton
            onClick={handleClose}
            sx={{ 
              padding: 0,
              float: "right" 
            }}
          >
            <Close />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit}>

          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <Box
              gridColumn="span 4"
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="5px"
              p="1rem"
              sx={{
                height: 1,
                width: isNonMobile? 1/3 : 1,
              }}
              onChange={handleChange}
              value={values.image}
              name="image"
            >
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) => setImage(
                  (acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                  })))[0]
                )}
              >
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    sx={{ 
                      "&:hover": { cursor: "pointer" },
                    }}
                  >
                    <input {...getInputProps()} />
                    <FlexBetween>
                      <Box
                        component="img"
                        sx={{
                          height: 1,
                          width: 1,
                        }}
                        
                        src={image?.preview ? image.preview : user.avatarURL}
                      />
                      </FlexBetween>
                  </Box>
                )}
              </Dropzone>
            </Box>    

            <TextField
              label="First Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.firstName}
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
              value={values.lastName}
              name="lastName"
              error={Boolean(touched.lastName) && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email ||''}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
              disabled
            />
            <TextField
              label="Address"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.address ||''}
              name="address"
              error={Boolean(touched.address) && Boolean(errors.address)}
              helperText={touched.address && errors.address}
              sx={{ gridColumn: "span 4" }}
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
              Cập nhật
            </Button>
          </Box>
        </form>

      </>
      )}
    </Formik>
  );
};

export default ManageAccount;
