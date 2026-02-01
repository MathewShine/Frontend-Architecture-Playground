import React, { useState } from "react";
import { Box, Typography, IconButton, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { CalendarMonth, Close, Verified } from "@mui/icons-material";
import { getEventStatistics, findEarningsWave } from "./calendarUtils";
import {
  getThemeStyles,
  commonStyles,
  getEventColors,
} from "./calendarStyles";

const CalendarHeader = ({
  darkMode,
  onClose,
  year,
  month,
  events,
}) => {
  const themeStyles = getThemeStyles(darkMode);
  const [calendarType, setCalendarType] = useState("earnings");
  
  const stats = getEventStatistics(events, year, month);
  const earningsWave = findEarningsWave(events, year, month);
  const earningsColors = getEventColors("EARNINGS", darkMode);

  const handleCalendarTypeChange = (event, newType) => {
    if (newType !== null) {
      setCalendarType(newType);
      // TODO: Implement calendar type switching logic when Economic Calendar is ready
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 1.25, sm: 1.5 },
        borderBottom: `1px solid ${themeStyles.borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: themeStyles.headerBackground,
        flexWrap: "wrap",
        gap: { xs: 1, sm: 0 },
      }}
    >
      {/* Left Section: Title + Toggle + Stats */}
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, flexWrap: "wrap", flex: 1 }}>
        {/* Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
          <CalendarMonth
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, color: commonStyles.primaryColor }}
          />
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", sm: "1.125rem" },
              fontWeight: 700,
              color: themeStyles.textPrimary,
              fontFamily: commonStyles.fontFamily,
              display: { xs: "none", sm: "block" },
            }}
          >
            Earnings Calendar
          </Typography>
        </Box>

        {/* Toggle Between Calendars */}
        <ToggleButtonGroup
          value={calendarType}
          exclusive
          onChange={handleCalendarTypeChange}
          sx={{
            height: { xs: "28px", sm: "32px" },
            "& .MuiToggleButton-root": {
              px: { xs: 1, sm: 1.5 },
              py: { xs: 0.4, sm: 0.5 },
              fontSize: { xs: "0.65rem", sm: "0.7rem" },
              fontWeight: 600,
              textTransform: "none",
              border: `1px solid ${themeStyles.borderColor}`,
              color: themeStyles.textSecondary,
              fontFamily: commonStyles.fontFamily,
              "&.Mui-selected": {
                backgroundColor: commonStyles.primaryColor,
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#0d6ecd",
                },
              },
              "&:hover": {
                backgroundColor: themeStyles.cellHoverBackground,
              },
            },
          }}
        >
          <ToggleButton value="earnings">
            Earnings
          </ToggleButton>
          <ToggleButton value="economic" disabled>
            Economic
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Statistics Section - Desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
          {/* Wave Period */}
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: themeStyles.textSecondary,
              fontFamily: commonStyles.fontFamily,
            }}
          >
            <Box component="span" sx={{ textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.5px" }}>
              WAVE PERIOD:
            </Box>{" "}
            <Box component="span" sx={{ color: earningsWave ? earningsColors.primary : themeStyles.textSecondary, fontWeight: 700 }}>
              {earningsWave ? `${earningsWave.start} - ${earningsWave.end}` : "N/A"}
            </Box>
          </Typography>

          {/* Vertical Divider 1 */}
          <Box
            sx={{
              width: "2px",
              height: "24px",
              backgroundColor: themeStyles.borderColor,
              opacity: 0.8,
            }}
          />

          {/* Earnings Count */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: earningsColors.primary,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: themeStyles.textPrimary,
                fontFamily: commonStyles.fontFamily,
              }}
            >
              {stats.earnings} Earnings
            </Typography>
          </Box>

          {/* Vertical Divider 2 */}
          <Box
            sx={{
              width: "2px",
              height: "24px",
              backgroundColor: themeStyles.borderColor,
              opacity: 0.8,
            }}
          />

          {/* Verified Badge */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.4,
              fontSize: "0.6rem",
              fontWeight: 700,
              color: commonStyles.primaryColor,
              backgroundColor: "rgba(19, 127, 236, 0.1)",
              px: 0.75,
              py: 0.4,
              borderRadius: "4px",
            }}
          >
            <Verified sx={{ fontSize: "0.7rem" }} />
            VERIFIED
          </Box>
        </Box>
      </Box>

      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          color: themeStyles.textSecondary,
          padding: { xs: "6px", sm: "8px" },
          transition: `all ${commonStyles.transitionDuration} ease`,
          "&:hover": {
            color: themeStyles.textPrimary,
          },
        }}
      >
        <Close sx={{ fontSize: { xs: "20px", sm: "24px" } }} />
      </IconButton>
    </Box>
  );
};

export default CalendarHeader;