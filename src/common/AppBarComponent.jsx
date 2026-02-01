import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  useMediaQuery,
  Switch,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Notifications,
  CalendarToday,
  Menu as MenuIcon,
  Logout,
  Dashboard as DashboardIcon,
  EventNote,
  Public,
} from "@mui/icons-material";
import MobileDrawer from "../pages/Dashboard/MobileDrawer";
import  portalLogo from "../assets/portal-logo.png";
import  userAvatar from "../assets/shine-mathew-avatar.png";
import MarketCalendarDialog from "../pages/MarketCalendar/MarketCalendarDialog";

const AppBarComponent = ({ darkMode, setDarkMode, selectedTab, onNavigate }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const isMobile = useMediaQuery("(max-width:900px)");

  const userMenuOpen = Boolean(userMenuAnchor);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isNYSEOpen = () => {
    const now = new Date();
    const nyTime = new Date(
      now.toLocaleString("en-US", { timeZone: "America/New_York" })
    );
    const day = nyTime.getDay();
    const hours = nyTime.getHours();
    const minutes = nyTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (day === 0 || day === 6) {
      return false;
    }

    const marketOpen = 9 * 60 + 30;
    const marketClose = 16 * 60;

    return totalMinutes >= marketOpen && totalMinutes < marketClose;
  };

  const getFormattedTime = () => {
    const estTime = new Date(
      currentTime.toLocaleString("en-US", { timeZone: "America/New_York" })
    );
    const hours = String(estTime.getHours()).padStart(2, "0");
    const minutes = String(estTime.getMinutes()).padStart(2, "0");
    const seconds = String(estTime.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds} EST`;
  };

  const getFormattedDate = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[currentTime.getMonth()];
    const day = currentTime.getDate();
    return `${month} ${day}`;
  };

  const marketOpen = isNYSEOpen();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon sx={{ fontSize: 18 }} /> },
    { label: "Earnings Calendar", path: "/earnings", icon: <EventNote sx={{ fontSize: 18 }} /> },
    { label: "Economic Events", path: "/economic-events", icon: <Public sx={{ fontSize: 18 }} /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) onNavigate(path);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    navigate("/login");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: darkMode
            ? "rgba(16, 25, 34, 0.5)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar
          sx={{ width: "100%", maxWidth: "100%", px: { xs: 2, sm: 3 } }}
        >
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileMenuOpen(true)}
              sx={{
                mr: 2,
                color: darkMode ? "white" : "#1e293b",
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mr: { xs: "auto", md: 5 },
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard")}
          >
            <Box
              component="img"
              src={portalLogo}
              alt="Portal Logo"
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                borderRadius: 1.5,
                objectFit: "contain",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.25rem" },
                color: "text.primary",
              }}
            >
              AlgoPivot
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 3, mr: "auto" }}>
              {menuItems.map((item, index) => (
                <Button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color:
                      index === selectedTab
                        ? "primary.main"
                        : "text.secondary",
                    fontWeight: index === selectedTab ? 600 : 500,
                    textTransform: "none",
                    fontSize: "0.875rem",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2, md: 3 },
            }}
          >
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderLeft: 1,
                  borderRight: 1,
                  borderColor: "divider",
                  px: { sm: 2, md: 3 },
                }}
              >
                <Box sx={{ textAlign: "right" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: marketOpen ? "#0bda5b" : "#ef4444",
                        borderRadius: "50%",
                        animation: marketOpen ? "pulse 2s infinite" : "none",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { sm: "0.625rem", md: "0.688rem" },
                        fontWeight: 700,
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      NYSE: {marketOpen ? "OPEN" : "CLOSED"}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                      fontSize: { sm: "0.813rem", md: "0.875rem" },
                      color: "text.primary",
                    }}
                  >
                    {getFormattedTime()}
                  </Typography>
                </Box>
                <Box
                  onClick={() => setCalendarOpen(true)}
                  sx={{
                    bgcolor: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: darkMode
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.08)",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CalendarToday
                    sx={{ fontSize: 14, color: "text.secondary" }}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      {getFormattedDate()}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, ml: 0.8 }}>
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          bgcolor: "#f59e0b",
                          borderRadius: "50%",
                        }}
                      />
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          bgcolor: "#137fec",
                          borderRadius: "50%",
                        }}
                      />
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          bgcolor: "#94a3b8",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {isMobile && (
              <Box
                onClick={() => setCalendarOpen(true)}
                sx={{
                  bgcolor: darkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: darkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CalendarToday
                  sx={{ fontSize: 12, color: "text.secondary" }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    color: "text.primary",
                  }}
                >
                  {getFormattedTime().split(" ")[0]}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                size="small"
                sx={{
                  width: 56,
                  height: 28,
                  padding: 0,
                  "& .MuiSwitch-switchBase": {
                    padding: 0,
                    margin: "4px",
                    transitionDuration: "300ms",
                    "&.Mui-checked": {
                      transform: "translateX(28px)",
                      "& + .MuiSwitch-track": {
                        backgroundColor: "#2c3e50",
                        opacity: 1,
                        border: 0,
                      },
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                          "#f0f0f0"
                        )}" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>')`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      },
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                        "#fbbf24"
                      )}" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>')`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    },
                  },
                  "& .MuiSwitch-thumb": {
                    boxSizing: "border-box",
                    width: 20,
                    height: 20,
                    backgroundColor: darkMode ? "#34495e" : "#ffffff",
                  },
                  "& .MuiSwitch-track": {
                    borderRadius: 14,
                    backgroundColor: darkMode ? "#1a252f" : "#E9E9EA",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {!isMobile && (
              <IconButton
                sx={{ color: "text.secondary", p: { xs: 0.5, sm: 1 } }}
              >
                <Notifications sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
            )}

            <IconButton
              onClick={handleUserMenuOpen}
              sx={{
                p: 0,
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  border: 2,
                  borderColor: "divider",
                  bgcolor: darkMode ? "#1a252f" : "#ffffff",
                }}
                src={userAvatar}
                alt="Shine Mathew"
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={userMenuAnchor}
        open={userMenuOpen}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            mt: 1.5,
            minWidth: 200,
            bgcolor: darkMode ? "#111a22" : "#ffffff",
            border: `1px solid ${darkMode ? "#324d67" : "#e5e7eb"}`,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: darkMode ? "#111a22" : "#ffffff",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              borderTop: `1px solid ${darkMode ? "#324d67" : "#e5e7eb"}`,
              borderLeft: `1px solid ${darkMode ? "#324d67" : "#e5e7eb"}`,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              src={userAvatar}
              alt="Shine Mathew"
              sx={{
                width: 40,
                height: 40,
                border: 2,
                borderColor: "divider",
                bgcolor: darkMode ? "#1a252f" : "#ffffff",
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: darkMode ? "#ffffff" : "#1e293b",
                }}
              >
                Shine Mathew
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: darkMode ? "#94a3b8" : "#64748b",
                }}
              >
                Institutional Access
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            color: "#ef4444",
            "&:hover": {
              bgcolor: "rgba(239, 68, 68, 0.1)",
            },
          }}
        >
          <Logout sx={{ mr: 1.5, fontSize: 20 }} />
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>

      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menuItems={menuItems}
        darkMode={darkMode}
        selectedTab={selectedTab}
        onNavigate={handleNavigation}
      />

      <MarketCalendarDialog
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        darkMode={darkMode}
      />

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </>
  );
};

export default AppBarComponent;