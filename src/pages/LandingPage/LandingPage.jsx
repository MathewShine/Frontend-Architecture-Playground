import React from "react";
import { Box } from "@mui/material";
import LandingHeader from "./LandingHeader";
import HeroSection from "./HeroSection";
const LandingPage = ({ darkMode, setDarkMode }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: darkMode ? "#0a0a0c" : "#ffffff",
        color: darkMode ? "#ffffff" : "#0a0a0c",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <LandingHeader darkMode={darkMode} setDarkMode={setDarkMode} />
      <HeroSection darkMode={darkMode} />
    </Box>
  );
};

export default LandingPage;