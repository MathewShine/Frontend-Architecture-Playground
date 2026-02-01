import React from "react";
import { Box, Typography, IconButton, Button, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { getMonthName } from "./calendarUtils";
import { getThemeStyles, commonStyles, getEventColors } from "./calendarStyles";

const CalendarNavigation = ({
  year,
  month,
  darkMode,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onExport,
  viewMode,
  onViewModeChange,
  weekStart,
}) => {
  const themeStyles = getThemeStyles(darkMode);
  const earningsColors = getEventColors("EARNINGS", darkMode);

  const getWeekRange = () => {
    if (!weekStart) return "";
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${weekStart.getFullYear()}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${weekStart.getFullYear()}`;
    }
  };

  return (
    <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
      {/* Mobile: Stack vertically */}
      <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 1.5 }}>
        {/* Month/Week Navigation - Mobile */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5 }}>
          <IconButton
            onClick={onPreviousMonth}
            sx={{
              width: "28px",
              height: "28px",
              border: `1px solid ${themeStyles.borderColor}`,
              borderRadius: commonStyles.borderRadius,
              color: themeStyles.textPrimary,
              transition: `all ${commonStyles.transitionDuration} ease`,
              "&:hover": {
                backgroundColor: themeStyles.cellHoverBackground,
              },
            }}
          >
            <ChevronLeft sx={{ fontSize: "16px" }} />
          </IconButton>

          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 700,
              color: themeStyles.textPrimary,
              minWidth: "140px",
              textAlign: "center",
              fontFamily: commonStyles.fontFamily,
            }}
          >
            {viewMode === "month" ? `${getMonthName(month)} ${year}` : getWeekRange()}
          </Typography>

          <IconButton
            onClick={onNextMonth}
            sx={{
              width: "28px",
              height: "28px",
              border: `1px solid ${themeStyles.borderColor}`,
              borderRadius: commonStyles.borderRadius,
              color: themeStyles.textPrimary,
              transition: `all ${commonStyles.transitionDuration} ease`,
              "&:hover": {
                backgroundColor: themeStyles.cellHoverBackground,
              },
            }}
          >
            <ChevronRight sx={{ fontSize: "16px" }} />
          </IconButton>
        </Box>

        {/* Earnings Badge - Mobile */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.4,
              px: 0.6,
              py: 0.3,
              borderRadius: "3px",
              backgroundColor: earningsColors.background,
              border: `1px solid ${earningsColors.border}`,
            }}
          >
            <Box
              sx={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: earningsColors.primary,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.5rem",
                fontWeight: 700,
                color: earningsColors.primary,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              Earnings
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons - Mobile */}
        <Box sx={{ display: "flex", gap: 0.75, justifyContent: "center", flexWrap: "wrap" }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && onViewModeChange(newMode)}
            sx={{
              height: "28px",
              "& .MuiToggleButton-root": {
                px: 1,
                py: 0.4,
                fontSize: "0.65rem",
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
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>

          <Button
            onClick={onToday}
            variant="outlined"
            sx={{
              px: 1.5,
              py: 0.4,
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: commonStyles.borderRadius,
              color: themeStyles.textPrimary,
              borderColor: themeStyles.borderColor,
              backgroundColor: themeStyles.cellBackground,
              fontFamily: commonStyles.fontFamily,
              transition: `all ${commonStyles.transitionDuration} ease`,
              "&:hover": {
                backgroundColor: themeStyles.cellHoverBackground,
              },
            }}
          >
            Today
          </Button>

          <Button
            onClick={onExport}
            variant="contained"
            sx={{
              px: 1.5,
              py: 0.4,
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: commonStyles.borderRadius,
              backgroundColor: commonStyles.primaryColor,
              color: "#ffffff",
              fontFamily: commonStyles.fontFamily,
              boxShadow: "0 3px 10px 0 rgba(19, 127, 236, 0.2)",
              transition: `all ${commonStyles.transitionDuration} ease`,
              "&:hover": {
                backgroundColor: "#0d6ecd",
              },
            }}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* Desktop: Horizontal layout */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Earnings Badge - Fixed width to match right section */}
        <Box sx={{ display: "flex", gap: 0.5, flex: 1, justifyContent: "flex-start" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
              px: 0.8,
              py: 0.35,
              borderRadius: "5px",
              backgroundColor: earningsColors.background,
              border: `1px solid ${earningsColors.border}`,
            }}
          >
            <Box
              sx={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: earningsColors.primary,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.575rem",
                fontWeight: 700,
                color: earningsColors.primary,
                textTransform: "uppercase",
                letterSpacing: "0.7px",
              }}
            >
              Earnings
            </Typography>
          </Box>
        </Box>

        {/* Center: Month/Week Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}>
          <IconButton
            onClick={onPreviousMonth}
            sx={{
              width: "28px",
              height: "28px",
              border: `1px solid ${themeStyles.borderColor}`,
              borderRadius: commonStyles.borderRadius,
              color: themeStyles.textPrimary,
              transition: `all ${commonStyles.transitionDuration} ease`,
              "&:hover": {
                backgroundColor: themeStyles.cellHoverBackground,
                borderColor: themeStyles.textSecondary,
              },
            }}
          >
            <ChevronLeft sx={{ fontSize: "16px" }} />
          </IconButton>

          <Typography
            sx={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: themeStyles.textPrimary,
              minWidth: "220px",
              textAlign: "center",
              fontFamily: commonStyles.fontFamily,
            }}
          >
            {viewMode === "month" ? `${getMonthName(month)} ${year}` : getWeekRange()}
          </Typography>

          <IconButton
            onClick={onNextMonth}
            sx={{
              width: "28px",
              height: "28px",
              border: `1px solid ${themeStyles.borderColor}`,
              borderRadius: commonStyles.borderRadius,
              color: themeStyles.textPrimary,
              transition: `all ${commonStyles.transitionDuration} ease`,
              "&:hover": {
                backgroundColor: themeStyles.cellHoverBackground,
                borderColor: themeStyles.textSecondary,
              },
            }}
          >
            <ChevronRight sx={{ fontSize: "16px" }} />
          </IconButton>
        </Box>

        {/* Right: Action Buttons - Match left section width */}
        <Box sx={{ display: "flex", gap: 0.75, flex: 1, justifyContent: "flex-end" }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && onViewModeChange(newMode)}
            sx={{
              height: "32px",
              "& .MuiToggleButton-root": {
                px: 1.5,
                py: 0.5,
                fontSize: "0.7rem",
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
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>

          <Button
            onClick={onToday}
            variant="outlined"
            sx={{
              px: 1.5,
              py: 0.5,
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: commonStyles.borderRadius,
              color: themeStyles.textPrimary,
              borderColor: themeStyles.borderColor,
              backgroundColor: themeStyles.cellBackground,
              fontFamily: commonStyles.fontFamily,
              transition: `all ${commonStyles.transitionDuration} ease`,
              "&:hover": {
                backgroundColor: themeStyles.cellHoverBackground,
                borderColor: themeStyles.textSecondary,
              },
            }}
          >
            Today
          </Button>

          <Button
            onClick={onExport}
            variant="contained"
            sx={{
              px: 1.5,
              py: 0.5,
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: commonStyles.borderRadius,
              backgroundColor: commonStyles.primaryColor,
              color: "#ffffff",
              fontFamily: commonStyles.fontFamily,
              boxShadow: "0 3px 10px 0 rgba(19, 127, 236, 0.2)",
              transition: `all ${commonStyles.transitionDuration} ease`,
              "&:hover": {
                backgroundColor: "#0d6ecd",
                boxShadow: "0 5px 15px 0 rgba(19, 127, 236, 0.3)",
              },
            }}
          >
            Export CSV
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarNavigation;