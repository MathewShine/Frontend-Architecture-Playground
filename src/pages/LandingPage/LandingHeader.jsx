import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, Switch } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import alogoPivotLogo from "../../assets/algopivot-logo.png";
import "./LandingHeader.css";

const LandingHeader = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: darkMode ? "rgba(10, 10, 12, 0.8)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar
        className="landing-header-toolbar"
        sx={{
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
          py: 1,
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1.5 },
            cursor: "pointer",
            flexShrink: 0,
          }}
          onClick={() => navigate("/landing")}
        >
          <Box
            component="img"
            src={alogoPivotLogo}
            alt="AlgoPivot Logo"
            sx={{
              width: { xs: 20, sm: 28 },
              height: { xs: 20, sm: 28 },
              borderRadius: 1,
            }}
          />
          <Box
            sx={{
              fontSize: { xs: "0.813rem", sm: "1rem", md: "1.125rem" },
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: darkMode ? "#ffffff" : "#0a0a0c",
            }}
          >
            AlgoPivot
          </Box>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Dark/Light Mode Toggle */}
        <Box className="toggle-wrapper">
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            icon={<LightMode sx={{ fontSize: { xs: 12, sm: 16 }, color: "#fbbf24" }} />}
            checkedIcon={<DarkMode sx={{ fontSize: { xs: 12, sm: 16 }, color: "#f0f0f0" }} />}
            sx={{
              width: { xs: 44, sm: 56 },
              height: { xs: 22, sm: 28 },
              padding: 0,
              flexShrink: 0,
              "& .MuiSwitch-switchBase": {
                padding: 0,
                margin: { xs: "2px", sm: "4px" },
                transitionDuration: "300ms",
                "&.Mui-checked": {
                  transform: { xs: "translateX(22px)", sm: "translateX(28px)" },
                  "& + .MuiSwitch-track": {
                    backgroundColor: "#2c3e50",
                    opacity: 1,
                    border: 0,
                  },
                },
              },
              "& .MuiSwitch-thumb": {
                boxSizing: "border-box",
                width: { xs: 18, sm: 20 },
                height: { xs: 18, sm: 20 },
                backgroundColor: darkMode ? "#34495e" : "#ffffff",
              },
              "& .MuiSwitch-track": {
                borderRadius: { xs: 11, sm: 14 },
                backgroundColor: darkMode ? "#1a252f" : "#E9E9EA",
                opacity: 1,
              },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LandingHeader;