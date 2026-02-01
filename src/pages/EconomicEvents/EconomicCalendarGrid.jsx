import React from "react";
import { Box, Typography } from "@mui/material";
import EconomicCalendarCell from "./EconomicCalendarCell";
import { generateCalendarGrid, getEventsForDate } from "../MarketCalendar/calendarUtils";
import { getThemeStyles, commonStyles } from "../MarketCalendar/calendarStyles";

const EconomicCalendarGrid = ({ year, month, events, darkMode }) => {
  const themeStyles = getThemeStyles(darkMode);
  
  // Generate calendar grid
  let calendarGrid = [];
  try {
    calendarGrid = generateCalendarGrid(year, month);
  } catch (error) {
    console.error("Error generating calendar grid:", error);
    return null;
  }

  // Safety check
  if (!calendarGrid || !Array.isArray(calendarGrid) || calendarGrid.length === 0) {
    return null;
  }

  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayHeadersMobile = ["S", "M", "T", "W", "T", "F", "S"];
  
  // Ensure events is an array
  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "1px",
        backgroundColor: themeStyles.borderColor,
        borderRadius: commonStyles.borderRadius,
        border: `1px solid ${themeStyles.borderColor}`,
        overflow: "hidden",
      }}
    >
      {/* Day Headers - Desktop */}
      {dayHeaders.map((day) => (
        <Box
          key={day}
          sx={{
            display: { xs: "none", sm: "block" },
            backgroundColor: darkMode ? "#161B22" : "rgba(248, 250, 252, 1)",
            padding: "8px",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.6rem",
              fontWeight: 700,
              color: themeStyles.textSecondary,
              textTransform: "uppercase",
              letterSpacing: "1.2px",
            }}
          >
            {day}
          </Typography>
        </Box>
      ))}

      {/* Day Headers - Mobile */}
      {dayHeadersMobile.map((day, index) => (
        <Box
          key={`mobile-${day}-${index}`}
          sx={{
            display: { xs: "block", sm: "none" },
            backgroundColor: darkMode ? "#161B22" : "rgba(248, 250, 252, 1)",
            padding: "6px 4px",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: themeStyles.textSecondary,
              textTransform: "uppercase",
            }}
          >
            {day}
          </Typography>
        </Box>
      ))}

      {/* Calendar Cells */}
      {calendarGrid.map((week, weekIndex) => {
        if (!week || !Array.isArray(week)) return null;
        
        return week.map((dayData, dayIndex) => {
          if (!dayData) {
            return (
              <Box
                key={`${weekIndex}-${dayIndex}`}
                sx={{
                  minHeight: { xs: "180px", sm: "200px", md: "220px" },
                  backgroundColor: themeStyles.cellBackground,
                }}
              />
            );
          }

          let dayEvents = [];
          try {
            dayEvents = getEventsForDate(
              safeEvents,
              dayData.year,
              dayData.month,
              dayData.day
            );
          } catch (error) {
            console.error("Error getting events for date:", error);
            dayEvents = [];
          }

          return (
            <EconomicCalendarCell
              key={`${weekIndex}-${dayIndex}`}
              dayData={dayData}
              events={dayEvents}
              darkMode={darkMode}
            />
          );
        });
      })}
    </Box>
  );
};

export default EconomicCalendarGrid;