import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Search,
  Add,
} from "@mui/icons-material";
import AppBarComponent from "../../common/AppBarComponent";
import PortfolioTable from "./PortfolioTable";
import BottomCards from "./BottomCards";
import AddPositionDialog from "../Position/AddPositionDialog";
import APIHealthCheckDialog from "./APIHealthCheckDialog";
import {
  startHealthCheck,
  healthCheckSuccess,
  healthCheckFailure,
} from "../../store/healthCheckSlice";

const Dashboard = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [positionDialogOpen, setPositionDialogOpen] = useState(false);
  
  // Get health check state from Redux
  const { isVerified, isChecking } = useSelector((state) => state.healthCheck);
  
  // Only show dialog if not verified and not already checking
  const [showHealthDialog, setShowHealthDialog] = useState(false);

  // Determine selected tab based on current route
  const selectedTab = location.pathname === "/news-events" ? 1 : 0;

  useEffect(() => {
    // Only trigger health check if not already verified
    if (!isVerified && !isChecking) {
      setShowHealthDialog(true);
      performHealthCheck();
    }
  }, []); // Run only on mount

  const performHealthCheck = async () => {
    dispatch(startHealthCheck());

    try {
      const { checkHealthAPI, checkReadyAPI } = await import("./api");
      
      // Check health
      const healthResult = await checkHealthAPI();
      if (!healthResult.success) {
        dispatch(healthCheckFailure("Service health check failed"));
        return;
      }

      // Check ready
      const readyResult = await checkReadyAPI();
      if (!readyResult.success) {
        dispatch(healthCheckFailure("Database connectivity failed"));
        return;
      }

      // Both checks passed
      dispatch(healthCheckSuccess());
    } catch (error) {
      dispatch(healthCheckFailure("Connection error"));
    }
  };

  const handleHealthCheckComplete = (success) => {
    if (success) {
      setShowHealthDialog(false);
    }
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#137fec" },
      background: {
        default: darkMode ? "#101922" : "#ffffff",
        paper: darkMode ? "#111a22" : "#ffffff",
      },
      divider: darkMode ? "#324d67" : "#e2e8f0",
      text: {
        primary: darkMode ? "#ffffff" : "#1e293b",
        secondary: darkMode ? "#94a3b8" : "#64748b",
      },
    },
    typography: { fontFamily: "'Manrope', sans-serif" },
    shape: { borderRadius: 8 },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          width: "100%",
        }}
      >
        {/* API Health Check Dialog - Only shows if not verified */}
        {showHealthDialog && (
          <APIHealthCheckDialog
            open={showHealthDialog}
            onHealthCheckComplete={handleHealthCheckComplete}
            darkMode={darkMode}
          />
        )}

        {/* Shared AppBar */}
        <AppBarComponent
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          selectedTab={selectedTab}
        />

        {/* Main Content */}
        <Box
          sx={{
            width: "100%",
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          {/* Page Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: { xs: 3, md: 4 },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                  color: "text.primary",
                }}
              >
                Dashboard
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.6rem", md: "0.8rem" },
                }}
              >
                Real-time portfolio positioning and risk analytics.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                width: { xs: "100%", sm: "auto" },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                placeholder="Search symbols, sectors..."
                size="small"
                sx={{
                  width: { xs: "100%", sm: 256 },
                  "& .MuiOutlinedInput-root": {
                    height: 44,
                    borderRadius: "10px",
                    bgcolor: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setPositionDialogOpen(true)}
                sx={{
                  height: 44,
                  px: 3,
                  fontWeight: 700,
                  borderRadius: "10px",
                  textTransform: "none",
                  boxShadow: "none",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Positions
              </Button>
            </Box>
          </Box>

          <PortfolioTable darkMode={darkMode} />
          <BottomCards darkMode={darkMode} />
        </Box>

        <AddPositionDialog
          open={positionDialogOpen}
          onClose={() => setPositionDialogOpen(false)}
          darkMode={darkMode}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;