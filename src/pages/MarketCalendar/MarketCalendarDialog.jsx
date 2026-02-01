import React, { useState, useEffect } from "react";
import { Dialog, Box, CircularProgress, Typography } from "@mui/material";
import CalendarHeader from "./CalendarHeader";
import CalendarNavigation from "./CalendarNavigation";
import CalendarGrid from "./CalendarGrid";
import EarningsTable from "./EarningsTable";
import { fetchEarningsCalendar } from "./earningsApi";
import {
  getPreviousMonth,
  getNextMonth,
  exportToCSV,
  downloadCSV,
  getMonthName,
} from "./calendarUtils";
import { getThemeStyles, commonStyles } from "./calendarStyles";

const MarketCalendarDialog = ({
  open,
  onClose,
  darkMode = true,
  onEventClick,
}) => {
  const themeStyles = getThemeStyles(darkMode);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    // Get the start of current week (Sunday)
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    return new Date(now.setDate(diff));
  });
  const [viewMode, setViewMode] = useState("week"); // "week" or "month"
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  // Helper function to check if a date falls within current week
  const isDateInCurrentWeek = (weekStart) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return today >= weekStart && today <= weekEnd;
  };

  // Fetch events when month/year changes or dialog opens
  useEffect(() => {
    if (open) {
      if (viewMode === "month") {
        loadEvents(currentYear, currentMonth);
      } else {
        // Week view: load events for the week's month(s)
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        // Load current month
        loadEvents(currentWeekStart.getFullYear(), currentWeekStart.getMonth() + 1);
        
        // If week spans two months, load next month too
        if (weekEnd.getMonth() !== currentWeekStart.getMonth()) {
          loadAdditionalEvents(weekEnd.getFullYear(), weekEnd.getMonth() + 1);
        }
      }
    }
  }, [currentYear, currentMonth, currentWeekStart, viewMode, open]);

  const loadAdditionalEvents = async (year, month) => {
    try {
      const apiEvents = await fetchEarningsCalendar(year, month);
      setEvents(prev => [...prev, ...apiEvents]);
    } catch (error) {
      console.error("Error loading additional events:", error);
    }
  };

  const loadEvents = async (year, month) => {
    setLoading(true);
    try {
      const apiEvents = await fetchEarningsCalendar(year, month);
      setEvents(apiEvents);
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    if (viewMode === "month") {
      const { year, month } = getPreviousMonth(currentYear, currentMonth);
      setCurrentYear(year);
      setCurrentMonth(month);
    } else {
      // Week view: go back 7 days
      const newWeekStart = new Date(currentWeekStart);
      newWeekStart.setDate(newWeekStart.getDate() - 7);
      newWeekStart.setHours(0, 0, 0, 0);
      setCurrentWeekStart(newWeekStart);
      setCurrentYear(newWeekStart.getFullYear());
      setCurrentMonth(newWeekStart.getMonth() + 1);
      
      // Check if this is the current week
      if (isDateInCurrentWeek(newWeekStart)) {
        // Select today if returning to current week
        const today = new Date();
        const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setSelectedDate(todayDate);
      } else {
        // Select Sunday for past/future weeks
        const sundayDate = `${newWeekStart.getFullYear()}-${String(newWeekStart.getMonth() + 1).padStart(2, '0')}-${String(newWeekStart.getDate()).padStart(2, '0')}`;
        setSelectedDate(sundayDate);
      }
    }
  };

  const handleNextMonth = () => {
    if (viewMode === "month") {
      const { year, month } = getNextMonth(currentYear, currentMonth);
      setCurrentYear(year);
      setCurrentMonth(month);
    } else {
      // Week view: go forward 7 days
      const newWeekStart = new Date(currentWeekStart);
      newWeekStart.setDate(newWeekStart.getDate() + 7);
      newWeekStart.setHours(0, 0, 0, 0);
      setCurrentWeekStart(newWeekStart);
      setCurrentYear(newWeekStart.getFullYear());
      setCurrentMonth(newWeekStart.getMonth() + 1);
      
      // Select first day (Sunday) of the new week for future weeks
      const sundayDate = `${newWeekStart.getFullYear()}-${String(newWeekStart.getMonth() + 1).padStart(2, '0')}-${String(newWeekStart.getDate()).padStart(2, '0')}`;
      setSelectedDate(sundayDate);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
    
    // Reset to current week start
    const day = today.getDay();
    const diff = today.getDate() - day;
    const weekStart = new Date(today);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    setCurrentWeekStart(weekStart);
    
    // Select today's date
    const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDate(todayDate);
  };

  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    
    if (newMode === "week") {
      // Switching from Month to Week
      // Check if the current week (based on currentWeekStart) is the actual current week
      if (isDateInCurrentWeek(currentWeekStart)) {
        // Select today if it's the current week
        const today = new Date();
        const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setSelectedDate(todayDate);
      } else {
        // Select Sunday for other weeks
        const sundayDate = `${currentWeekStart.getFullYear()}-${String(currentWeekStart.getMonth() + 1).padStart(2, '0')}-${String(currentWeekStart.getDate()).padStart(2, '0')}`;
        setSelectedDate(sundayDate);
      }
    } else {
      // Switching from Week to Month - always select today
      const today = new Date();
      const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      setSelectedDate(todayDate);
    }
  };

  const handleDateClick = (year, month, day) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const getSelectedDateEvents = () => {
    return events.filter(event => event.date === selectedDate);
  };

  const handleExport = () => {
    const csv = exportToCSV(events, currentYear, currentMonth);
    if (csv) {
      const monthName = getMonthName(currentMonth);
      const filename = `market-calendar-${monthName}-${currentYear}.csv`;
      downloadCSV(csv, filename);
    } else {
      alert("No events to export for this month.");
    }
  };

  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: themeStyles.background,
          borderRadius: { xs: "0", sm: commonStyles.borderRadiusLg },
          border: `1px solid ${themeStyles.borderColor}`,
          boxShadow: darkMode
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: { xs: "100%", sm: "98vw", md: "96vw" },
          height: { xs: "100vh", sm: "95vh" },
          maxWidth: "none",
          maxHeight: { xs: "100vh", sm: "95vh" },
          margin: { xs: 0, sm: "auto" },
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: themeStyles.overlayBackground,
          backdropFilter: "blur(8px)",
        },
      }}
      fullScreen={false}
      sx={{
        "& .MuiDialog-container": {
          alignItems: { xs: "stretch", sm: "center" },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          fontFamily: commonStyles.fontFamily,
          height: "100%",
        }}
      >
        <CalendarHeader 
          darkMode={darkMode} 
          onClose={onClose}
          year={currentYear}
          month={currentMonth}
          events={events}
        />

        <Box
          sx={{
            p: { xs: 1.5, sm: 2, md: 3 },
            flex: 1,
            overflow: "auto",
          }}
        >
          <CalendarNavigation
            year={currentYear}
            month={currentMonth}
            darkMode={darkMode}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onToday={handleTodayClick}
            onExport={handleExport}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            weekStart={currentWeekStart}
          />

          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
              }}
            >
              <CircularProgress sx={{ color: themeStyles.textPrimary }} size={40} />
            </Box>
          ) : events.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: themeStyles.textSecondary,
                }}
              >
                No Events Available
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: themeStyles.textSecondary,
                  opacity: 0.7,
                }}
              >
                There are no earnings events for {viewMode === "week" ? "this week" : `${getMonthName(currentMonth)} ${currentYear}`}
              </Typography>
            </Box>
          ) : (
            <CalendarGrid
              year={currentYear}
              month={currentMonth}
              events={events}
              darkMode={darkMode}
              onEventClick={handleEventClick}
              viewMode={viewMode}
              weekStart={currentWeekStart}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
            />
          )}

          {/* Earnings Table - Show only in Week View */}
          {viewMode === "week" && !loading && events.length > 0 && (
            <EarningsTable 
              events={getSelectedDateEvents()}
              selectedDate={selectedDate}
              darkMode={darkMode}
            />
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default MarketCalendarDialog;