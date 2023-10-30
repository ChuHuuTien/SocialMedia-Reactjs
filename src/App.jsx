/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { React } from 'react'
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import ProfilePage from "./pages/profilePage";
import ResetPage from "./pages/resetPage";
import HelpPage from "./pages/helpPage";
import MessagePage from "./pages/messagePage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CookiesProvider } from 'react-cookie';
import '@fontsource-variable/inter';
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import IsTokenExpired from './utils/IsTokenExpired';
import { themeSettings } from "./theme";

export default function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const token = useSelector((state) => state.token);
  
  IsTokenExpired(token);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <CookiesProvider>
            <Routes>

              <Route path="/" element={isAuth ? <HomePage /> : <Navigate to="/login" />} />
              <Route path="/login" element={!isAuth? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/reset" element={<ResetPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/message" element={<MessagePage />} />
              <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />

            </Routes>
          </CookiesProvider>

        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}
