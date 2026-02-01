import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { OpenInNew, AttachMoney, WbSunny, NightsStay } from "@mui/icons-material";
import {
  getThemeStyles,
  getEventColors,
  commonStyles,
} from "./calendarStyles";

const CalendarCell = ({
  dayData,
  events,
  darkMode,
  onEventClick,
  isSelected,
  onDateClick,
  viewMode,
}) => {
  const navigate = useNavigate();
  const themeStyles = getThemeStyles(darkMode);
  const { day, isCurrentMonth, isToday } = dayData;

  const getCellStyles = () => {
    const baseStyles = {
      minHeight: viewMode === "week" ? { xs: "80px", sm: "90px", md: "100px" } : { xs: "180px", sm: "200px", md: "220px" },
      maxHeight: viewMode === "week" ? { xs: "80px", sm: "90px", md: "100px" } : { xs: "180px", sm: "200px", md: "220px" },
      backgroundColor: themeStyles.cellBackground,
      padding: { xs: "4px", sm: "5px", md: "6px" },
      position: "relative",
      cursor: viewMode === "week" ? "pointer" : (events.length > 0 ? "pointer" : "default"),
      transition: `all ${commonStyles.transitionDuration} ease`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      "&:hover": {
        backgroundColor:
          viewMode === "week" || events.length > 0
            ? themeStyles.cellHoverBackground
            : themeStyles.cellBackground,
      },
    };

    if (!isCurrentMonth) {
      return {
        ...baseStyles,
        opacity: 0.3,
      };
    }

    // Selected cell in week view - prominent blue background
    if (isSelected && viewMode === "week") {
      return {
        ...baseStyles,
        backgroundColor: darkMode ? "rgba(19, 127, 236, 0.15)" : "rgba(19, 127, 236, 0.08)",
      };
    }

    // Today cell - subtle border indicator (not selected)
    if (isToday && (!isSelected || viewMode !== "week")) {
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

  const handleEventItemClick = (event, e) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  const handleViewDetails = () => {
    navigate("/news-events");
  };

  const getReportingTimeDisplay = (reportingTime) => {
    if (!reportingTime) {
      return { icon: null, text: "—" };
    }
    
    const lowerTime = reportingTime.toLowerCase();
    if (lowerTime.includes("before") || lowerTime.includes("pre")) {
      return { 
        icon: <WbSunny sx={{ fontSize: "0.9rem", color: "#f59e0b" }} />, 
        text: "Pre" 
      };
    } else if (lowerTime.includes("after") || lowerTime.includes("post")) {
      return { 
        icon: <NightsStay sx={{ fontSize: "0.9rem", color: "#8b5cf6" }} />, 
        text: "Post" 
      };
    }
    return { icon: null, text: reportingTime };
  };

  const renderEventTooltip = (event) => {
    const eventColors = getEventColors(event.eventType, darkMode);
    const reportDisplay = getReportingTimeDisplay(event.reporting_time);
    
    return (
      <Box
        sx={{
          minWidth: "240px",
          maxWidth: "280px",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
            pb: 1,
            borderBottom: `1px solid ${themeStyles.borderColor}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: themeStyles.textPrimary,
            }}
          >
            {event.date}
          </Typography>
          <Box
            sx={{
              fontSize: "0.625rem",
              fontWeight: 700,
              px: 0.75,
              py: 0.25,
              borderRadius: "4px",
              backgroundColor: eventColors.background,
              color: eventColors.primary,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {event.eventType}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: eventColors.primary,
                mb: 0.5,
              }}
            >
              {event.ticker}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.625rem",
                color: themeStyles.textSecondary,
              }}
            >
              {event.company_name}
            </Typography>
          </Box>

          {/* Reporting Time */}
          <Box>
            <Typography
              sx={{
                fontSize: "0.55rem",
                fontWeight: 700,
                color: themeStyles.textSecondary,
                textTransform: "uppercase",
                mb: 0.25,
              }}
            >
              Report Time
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {reportDisplay.icon}
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  color: themeStyles.textPrimary,
                  fontWeight: 600,
                }}
              >
                {reportDisplay.text}
              </Typography>
            </Box>
          </Box>

          {event.market_cap && (
            <Box>
              <Typography
                sx={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  color: themeStyles.textSecondary,
                  textTransform: "uppercase",
                  mb: 0.25,
                }}
              >
                Market Cap
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  color: themeStyles.textPrimary,
                }}
              >
                ${(event.market_cap / 1000000000).toFixed(2)}B
              </Typography>
            </Box>
          )}

          {(event.eps_forecast || event.eps_actual) && (
            <Box>
              <Typography
                sx={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  color: themeStyles.textSecondary,
                  textTransform: "uppercase",
                  mb: 0.25,
                }}
              >
                EPS
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  color: themeStyles.textPrimary,
                }}
              >
                Forecast: {event.eps_forecast || "N/A"} | Actual: {event.eps_actual || "N/A"}
              </Typography>
            </Box>
          )}

          {(event.revenue_forecast || event.revenue_actual) && (
            <Box>
              <Typography
                sx={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  color: themeStyles.textSecondary,
                  textTransform: "uppercase",
                  mb: 0.25,
                }}
              >
                Revenue
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  color: themeStyles.textPrimary,
                }}
              >
                Forecast: {event.revenue_forecast ? `$${(event.revenue_forecast / 1000000).toFixed(2)}M` : "N/A"} | Actual: {event.revenue_actual ? `$${(event.revenue_actual / 1000000).toFixed(2)}M` : "N/A"}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          onClick={handleViewDetails}
          sx={{
            mt: 2,
            pt: 1.5,
            borderTop: `1px solid ${themeStyles.borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              opacity: 0.8,
              transform: "scale(1.02)",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "0.625rem",
              fontWeight: 700,
              color: "#137fec",
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            View Detail
            <OpenInNew sx={{ fontSize: "0.75rem" }} />
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={getCellStyles()} onClick={viewMode === "week" ? onDateClick : undefined}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.3,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "0.65rem", sm: "0.68rem", md: "0.7rem" },
            fontWeight: isToday ? 700 : 500,
            color: isToday
              ? commonStyles.primaryColor
              : themeStyles.textPrimary,
          }}
        >
          {day}
        </Typography>

        {isToday && (
          <Box
            sx={{
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
            }}
          >
            Today
          </Box>
        )}
      </Box>

      {/* Show company count in week view */}
      {viewMode === "week" && events.length > 0 && (
        <Box sx={{ mb: 0.5, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.85rem" },
              fontWeight: 700,
              color: themeStyles.textPrimary,
              mb: 0.3,
              textAlign: "center",
            }}
          >
            {events.length} {events.length === 1 ? "Company" : "Companies"}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.55rem", sm: "0.58rem", md: "0.6rem" },
              color: themeStyles.textSecondary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "center",
            }}
          >
            {events.slice(0, 4).map(e => e.ticker).join(", ")}
            {events.length > 4 && "..."}
          </Typography>
        </Box>
      )}

      {/* Show scrollable list only in month view */}
      {viewMode === "month" && events.length > 0 && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: { xs: 0.3, sm: 0.35, md: 0.4 },
            overflowY: "auto",
            overflowX: "hidden",
            pr: { xs: 0.2, sm: 0.25, md: 0.3 },
            "&::-webkit-scrollbar": {
              width: "2px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: themeStyles.borderColor,
              borderRadius: "10px",
            },
          }}
        >
          {events.slice(0, 10).map((event, index) => {
            const eventColors = getEventColors(event.eventType, darkMode);
            
            return (
              <Tooltip
                key={index}
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
                      "&::before": {
                        border: `1px solid ${themeStyles.borderColor}`,
                      },
                    },
                  },
                }}
              >
                <Box
                  onClick={(e) => handleEventItemClick(event, e)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: { xs: 0.3, sm: 0.35, md: 0.4 },
                    px: { xs: 0.4, sm: 0.45, md: 0.5 },
                    py: { xs: 0.25, sm: 0.28, md: 0.3 },
                    borderRadius: "3px",
                    backgroundColor: eventColors.background,
                    border: `1px solid ${eventColors.border}`,
                    cursor: "pointer",
                    transition: `all ${commonStyles.transitionDuration} ease`,
                    "&:hover": {
                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                      transform: "translateX(1px)",
                    },
                  }}
                >
                  {/* Left: Dollar icon + Ticker */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.3, sm: 0.35, md: 0.4 } }}>
                    <Box
                      sx={{
                        width: { xs: "14px", sm: "15px", md: "16px" },
                        height: { xs: "14px", sm: "15px", md: "16px" },
                        borderRadius: "3px",
                        backgroundColor: eventColors.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <AttachMoney
                        sx={{
                          fontSize: { xs: "10px", sm: "11px", md: "12px" },
                          color: "#ffffff",
                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: { xs: "0.5rem", sm: "0.53rem", md: "0.55rem" },
                        fontWeight: 600,
                        color: eventColors.primary,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {event.ticker}
                    </Typography>
                  </Box>

                  {/* Right: Market Cap */}
                  {event.market_cap && (
                    <Typography
                      sx={{
                        fontSize: { xs: "0.48rem", sm: "0.5rem", md: "0.52rem" },
                        fontWeight: 600,
                        color: themeStyles.textSecondary,
                        whiteSpace: "nowrap",
                        opacity: 0.85,
                      }}
                    >
                      ${(event.market_cap / 1000000000).toFixed(1)}B
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            );
          })}
          
          {/* Show indicator if more than 10 events */}
          {events.length > 10 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 0.4, sm: 0.45, md: 0.5 },
                py: { xs: 0.3, sm: 0.35, md: 0.4 },
                mt: 0.3,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "0.45rem", sm: "0.48rem", md: "0.5rem" },
                  fontWeight: 600,
                  color: themeStyles.textSecondary,
                  fontStyle: "italic",
                  opacity: 0.7,
                }}
              >
                +{events.length - 10} more (showing top 10 by market cap)
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CalendarCell;