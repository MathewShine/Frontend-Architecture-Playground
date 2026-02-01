import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { Public, EventBusy, TrendingUp, TrendingDown } from "@mui/icons-material";
import { getThemeStyles, commonStyles } from "../MarketCalendar/calendarStyles";

// Utility functions
const formatEventTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const formatValue = (value, unit) => {
  if (value === null || value === undefined) return "N/A";
  if (unit === "%") return `${value}%`;
  if (unit === "M") return `${value}M`;
  if (unit === "B") return `${value}B`;
  return value.toString();
};

const EconomicCalendarCell = ({ dayData, events, darkMode }) => {
  // CRITICAL: Safety checks first
  if (!dayData || typeof dayData !== 'object') {
    return <Box sx={{ minHeight: "180px", backgroundColor: "transparent" }} />;
  }

  const themeStyles = getThemeStyles(darkMode);
  const { day, isCurrentMonth, isToday } = dayData;
  
  // Ensure events is an array
  const safeEvents = Array.isArray(events) ? events : [];
  const economicEvents = safeEvents.filter(e => e && e.type === "economic");
  const holidays = safeEvents.filter(e => e && e.type === "holiday");

  const getCellStyles = () => {
    const baseStyles = {
      minHeight: { xs: "180px", sm: "200px", md: "220px" },
      maxHeight: { xs: "180px", sm: "200px", md: "220px" },
      backgroundColor: themeStyles.cellBackground,
      padding: { xs: "4px", sm: "5px", md: "6px" },
      position: "relative",
      cursor: safeEvents.length > 0 ? "pointer" : "default",
      transition: `all ${commonStyles.transitionDuration} ease`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      "&:hover": {
        backgroundColor: safeEvents.length > 0 ? themeStyles.cellHoverBackground : themeStyles.cellBackground,
      },
    };

    if (!isCurrentMonth) {
      return { ...baseStyles, opacity: 0.3 };
    }

    if (isToday) {
      return {
        ...baseStyles,
        border: `2px solid ${themeStyles.todayBorder}`,
        boxShadow: darkMode
          ? "0 0 0 1px rgba(19, 127, 236, 0.1) inset"
          : "0 0 0 1px rgba(19, 127, 236, 0.05) inset",
      };
    }

    return baseStyles;
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#10b981";
      default:
        return themeStyles.textSecondary;
    }
  };

  const renderEventTooltip = (event) => {
    if (!event) return null;
    
    if (event.type === "holiday") {
      return (
        <Box sx={{ minWidth: "240px", maxWidth: "280px", p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, pb: 1, borderBottom: `1px solid ${themeStyles.borderColor}` }}>
            <EventBusy sx={{ fontSize: "1rem", color: "#8b5cf6" }} />
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: themeStyles.textPrimary }}>
              Market Holiday
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: themeStyles.textPrimary, mb: 1 }}>
            {event.name || "Market Closed"}
          </Typography>
          <Typography sx={{ fontSize: "0.65rem", color: themeStyles.textSecondary }}>
            {event.exchange || "NYSE"} - {event.is_closed ? "Market Closed" : "Adjusted Hours"}
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ minWidth: "280px", maxWidth: "320px", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, pb: 1, borderBottom: `1px solid ${themeStyles.borderColor}` }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Public sx={{ fontSize: "0.9rem", color: commonStyles.primaryColor }} />
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: themeStyles.textSecondary }}>
              {event.country || "US"} • {event.currency || "USD"}
            </Typography>
          </Box>
          <Box sx={{
            fontSize: "0.6rem",
            fontWeight: 700,
            px: 0.75,
            py: 0.25,
            borderRadius: "4px",
            backgroundColor: getImpactColor(event.impact) + "20",
            color: getImpactColor(event.impact),
            textTransform: "uppercase",
          }}>
            {event.impact || "Medium"}
          </Box>
        </Box>

        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: themeStyles.textPrimary, mb: 1 }}>
          {event.event || "Economic Event"}
        </Typography>

        <Typography sx={{ fontSize: "0.65rem", color: themeStyles.textSecondary, mb: 2 }}>
          {formatEventTime(event.time)} EST
        </Typography>

        {event.values && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.65rem", color: themeStyles.textSecondary }}>Previous:</Typography>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: themeStyles.textPrimary }}>
                {formatValue(event.values.previous, event.values.unit)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.65rem", color: themeStyles.textSecondary }}>Estimate:</Typography>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: themeStyles.textPrimary }}>
                {formatValue(event.values.estimate, event.values.unit)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: "0.65rem", color: themeStyles.textSecondary }}>Actual:</Typography>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: event.values.actual !== null ? commonStyles.primaryColor : themeStyles.textSecondary }}>
                {formatValue(event.values.actual, event.values.unit)}
              </Typography>
            </Box>
            {event.values.change_percentage !== null && event.values.change_percentage !== undefined && (
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5, pt: 1, borderTop: `1px solid ${themeStyles.borderColor}` }}>
                <Typography sx={{ fontSize: "0.65rem", color: themeStyles.textSecondary }}>Change:</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {event.values.change_percentage > 0 ? (
                    <TrendingUp sx={{ fontSize: "0.8rem", color: "#10b981" }} />
                  ) : event.values.change_percentage < 0 ? (
                    <TrendingDown sx={{ fontSize: "0.8rem", color: "#ef4444" }} />
                  ) : null}
                  <Typography sx={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: event.values.change_percentage > 0 ? "#10b981" : event.values.change_percentage < 0 ? "#ef4444" : themeStyles.textSecondary
                  }}>
                    {event.values.change_percentage > 0 ? "+" : ""}{event.values.change_percentage.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={getCellStyles()}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.3 }}>
        <Typography sx={{
          fontSize: { xs: "0.65rem", sm: "0.68rem", md: "0.7rem" },
          fontWeight: isToday ? 700 : 500,
          color: isToday ? commonStyles.primaryColor : themeStyles.textPrimary,
        }}>
          {day}
        </Typography>

        {isToday && (
          <Box sx={{
            fontSize: { xs: "0.4rem", sm: "0.43rem", md: "0.45rem" },
            fontWeight: 900,
            px: { xs: 0.3, sm: 0.35, md: 0.4 },
            py: { xs: 0.15, sm: 0.18, md: 0.2 },
            borderRadius: "3px",
            backgroundColor: commonStyles.primaryColor,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "0.3px",
            display: { xs: "none", sm: "block" },
          }}>
            Today
          </Box>
        )}
      </Box>

      <Box sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: { xs: 0.3, sm: 0.35, md: 0.4 },
        overflowY: "auto",
        overflowX: "hidden",
        pr: { xs: 0.2, sm: 0.25, md: 0.3 },
        "&::-webkit-scrollbar": { width: "2px" },
        "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: themeStyles.borderColor,
          borderRadius: "10px",
        },
      }}>
        {/* Holidays */}
        {holidays.map((holiday, index) => (
          <Tooltip
            key={`holiday-${index}`}
            title={renderEventTooltip(holiday)}
            placement="right"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: darkMode ? "#161B22" : "#ffffff",
                  border: `1px solid ${themeStyles.borderColor}`,
                  boxShadow: darkMode
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  maxWidth: "none",
                  p: 0,
                },
              },
              arrow: {
                sx: {
                  color: darkMode ? "#161B22" : "#ffffff",
                  "&::before": { border: `1px solid ${themeStyles.borderColor}` },
                },
              },
            }}
          >
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.3, sm: 0.4 },
              px: { xs: 0.4, sm: 0.5 },
              py: { xs: 0.25, sm: 0.3 },
              borderRadius: "3px",
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              cursor: "pointer",
              transition: `all ${commonStyles.transitionDuration} ease`,
              "&:hover": {
                backgroundColor: "rgba(139, 92, 246, 0.15)",
              },
            }}>
              <EventBusy sx={{ fontSize: { xs: "10px", sm: "11px", md: "12px" }, color: "#8b5cf6" }} />
              <Typography sx={{
                fontSize: { xs: "0.5rem", sm: "0.53rem", md: "0.55rem" },
                fontWeight: 600,
                color: "#8b5cf6",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                Holiday
              </Typography>
            </Box>
          </Tooltip>
        ))}

        {/* Economic Events */}
        {economicEvents.map((event, index) => {
          const impactColor = getImpactColor(event.impact);
          
          return (
            <Tooltip
              key={`event-${index}`}
              title={renderEventTooltip(event)}
              placement="right"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: darkMode ? "#161B22" : "#ffffff",
                    border: `1px solid ${themeStyles.borderColor}`,
                    boxShadow: darkMode
                      ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    maxWidth: "none",
                    p: 0,
                  },
                },
                arrow: {
                  sx: {
                    color: darkMode ? "#161B22" : "#ffffff",
                    "&::before": { border: `1px solid ${themeStyles.borderColor}` },
                  },
                },
              }}
            >
              <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: { xs: 0.3, sm: 0.4 },
                px: { xs: 0.4, sm: 0.5 },
                py: { xs: 0.25, sm: 0.3 },
                borderRadius: "3px",
                backgroundColor: impactColor + "15",
                border: `1px solid ${impactColor}30`,
                cursor: "pointer",
                transition: `all ${commonStyles.transitionDuration} ease`,
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                  transform: "translateX(1px)",
                },
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.3, sm: 0.4 }, flex: 1, minWidth: 0 }}>
                  <Box sx={{
                    width: { xs: "3px", sm: "3px", md: "4px" },
                    height: { xs: "14px", sm: "15px", md: "16px" },
                    borderRadius: "2px",
                    backgroundColor: impactColor,
                    flexShrink: 0,
                  }} />
                  <Typography sx={{
                    fontSize: { xs: "0.48rem", sm: "0.5rem", md: "0.52rem" },
                    fontWeight: 600,
                    color: themeStyles.textPrimary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {event.event && event.event.length > 25 ? event.event.substring(0, 25) + "..." : event.event || "Event"}
                  </Typography>
                </Box>
                <Typography sx={{
                  fontSize: { xs: "0.45rem", sm: "0.48rem", md: "0.5rem" },
                  fontWeight: 700,
                  color: impactColor,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {event.country || "US"}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};

export default EconomicCalendarCell;