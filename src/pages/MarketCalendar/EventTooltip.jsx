import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Tooltip } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import {
  eventTypeColors,
  getThemeStyles,
  impactColors,
} from "./calendarStyles";

const EventTooltip = ({ events, darkMode, children }) => {
  const navigate = useNavigate();
  const themeStyles = getThemeStyles(darkMode);

  const handleViewDetails = () => {
    navigate("/news-events");
  };

  if (!events || events.length === 0) {
    return children;
  }

  const tooltipContent = (
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
          {events[0].date}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.625rem",
            color: themeStyles.textSecondary,
          }}
        >
          {events.length} Event{events.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {events.map((event, index) => (
          <Box key={index}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: eventTypeColors[event.eventType].primary,
                }}
              >
                {event.ticker}
              </Typography>
              <Box
                sx={{
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: "4px",
                  backgroundColor:
                    eventTypeColors[event.eventType].background,
                  color: eventTypeColors[event.eventType].primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {event.eventType}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  color: themeStyles.textSecondary,
                }}
              >
                {event.time}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  color: impactColors[event.impact],
                  fontWeight: 600,
                }}
              >
                Impact: {event.impact}
              </Typography>
            </Box>
          </Box>
        ))}
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
          disableSelection
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

  return (
    <Tooltip
      title={tooltipContent}
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
      {children}
    </Tooltip>
  );
};

export default EventTooltip;