import React from "react";
import { Box, Typography } from "@mui/material";
import CalendarCell from "./CalendarCell";
import { generateCalendarGrid, getEventsForDate } from "./calendarUtils";
import { getThemeStyles, commonStyles } from "./calendarStyles";

const CalendarGrid = ({ year, month, events, darkMode, onEventClick, viewMode, weekStart, selectedDate, onDateClick }) => {
  const themeStyles = getThemeStyles(darkMode);
  
  const getGridData = () => {
    if (viewMode === "week") {
      // Generate week data (7 days starting from weekStart)
      const weekData = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(currentDate.getDate() + i);
        weekData.push({
          day: currentDate.getDate(),
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          isCurrentMonth: true,
          isToday: isToday(currentDate),
        });
      }
      return [weekData]; // Single row
    } else {
      // Month view: full calendar grid
      return generateCalendarGrid(year, month);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const calendarGrid = getGridData();

  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayHeadersMobile = ["S", "M", "T", "W", "T", "F", "S"];

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
      {/* Day Headers - Desktop (hide in week view on small screens) */}
      {viewMode === "month" && dayHeaders.map((day, index) => (
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

      {/* Day Headers - Mobile (hide in week view) */}
      {viewMode === "month" && dayHeadersMobile.map((day, index) => (
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

      {/* Week View Headers */}
      {viewMode === "week" && dayHeaders.map((day, index) => (
        <Box
          key={`week-${day}`}
          sx={{
            backgroundColor: darkMode ? "#161B22" : "rgba(248, 250, 252, 1)",
            padding: { xs: "6px 4px", sm: "8px" },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "0.65rem", sm: "0.6rem" },
              fontWeight: 700,
              color: themeStyles.textSecondary,
              textTransform: "uppercase",
              letterSpacing: { xs: "0", sm: "1.2px" },
            }}
          >
            {window.innerWidth < 600 ? dayHeadersMobile[index] : day}
          </Typography>
        </Box>
      ))}

      {/* Calendar Cells */}
      {calendarGrid.map((week, weekIndex) =>
        week.map((dayData, dayIndex) => {
          const dayEvents = getEventsForDate(
            events,
            dayData.year,
            dayData.month,
            dayData.day
          );

          const dateStr = `${dayData.year}-${String(dayData.month).padStart(2, '0')}-${String(dayData.day).padStart(2, '0')}`;
          const isSelected = dateStr === selectedDate;

          return (
            <CalendarCell
              key={`${weekIndex}-${dayIndex}`}
              dayData={dayData}
              events={dayEvents}
              darkMode={darkMode}
              onEventClick={onEventClick}
              isSelected={isSelected}
              onDateClick={() => onDateClick(dayData.year, dayData.month, dayData.day)}
              viewMode={viewMode}
            />
          );
        })
      )}
    </Box>
  );
};

export default CalendarGrid;