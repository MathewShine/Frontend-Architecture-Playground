import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import AppBarComponent from "../../common/AppBarComponent";
import CalendarNavigation from "../MarketCalendar/CalendarNavigation";
import CalendarGrid from "../MarketCalendar/CalendarGrid";
import CalendarFooter from "../MarketCalendar/CalendarFooter";
import EarningsTable from "../MarketCalendar/EarningsTable";
import { fetchEarningsCalendar } from "../MarketCalendar/earningsApi";
import {
  getPreviousMonth,
  getNextMonth,
  exportToCSV,
  downloadCSV,
  getMonthName,
} from "../MarketCalendar/calendarUtils";
import { getThemeStyles, commonStyles } from "../MarketCalendar/calendarStyles";

const EarningsPage = ({ darkMode, setDarkMode }) => {
  const themeStyles = getThemeStyles(darkMode);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    return new Date(now.setDate(diff));
  });
  const [viewMode, setViewMode] = useState("week");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  const isDateInCurrentWeek = (weekStart) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return today >= weekStart && today <= weekEnd;
  };

  useEffect(() => {
    if (viewMode === "month") {
      loadEvents(currentYear, currentMonth);
    } else {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      loadEvents(currentWeekStart.getFullYear(), currentWeekStart.getMonth() + 1);
      if (weekEnd.getMonth() !== currentWeekStart.getMonth()) {
        loadAdditionalEvents(weekEnd.getFullYear(), weekEnd.getMonth() + 1);
      }
    }
  }, [currentYear, currentMonth, currentWeekStart, viewMode]);

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
      const newWeekStart = new Date(currentWeekStart);
      newWeekStart.setDate(newWeekStart.getDate() - 7);
      newWeekStart.setHours(0, 0, 0, 0);
      setCurrentWeekStart(newWeekStart);
      setCurrentYear(newWeekStart.getFullYear());
      setCurrentMonth(newWeekStart.getMonth() + 1);
      
      if (isDateInCurrentWeek(newWeekStart)) {
        const today = new Date();
        const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setSelectedDate(todayDate);
      } else {
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
      const newWeekStart = new Date(currentWeekStart);
      newWeekStart.setDate(newWeekStart.getDate() + 7);
      newWeekStart.setHours(0, 0, 0, 0);
      setCurrentWeekStart(newWeekStart);
      setCurrentYear(newWeekStart.getFullYear());
      setCurrentMonth(newWeekStart.getMonth() + 1);
      
      const sundayDate = `${newWeekStart.getFullYear()}-${String(newWeekStart.getMonth() + 1).padStart(2, '0')}-${String(newWeekStart.getDate()).padStart(2, '0')}`;
      setSelectedDate(sundayDate);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
    
    const day = today.getDay();
    const diff = today.getDate() - day;
    const weekStart = new Date(today);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    setCurrentWeekStart(weekStart);
    
    const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDate(todayDate);
  };

  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    
    if (newMode === "week") {
      if (isDateInCurrentWeek(currentWeekStart)) {
        const today = new Date();
        const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setSelectedDate(todayDate);
      } else {
        const sundayDate = `${currentWeekStart.getFullYear()}-${String(currentWeekStart.getMonth() + 1).padStart(2, '0')}-${String(currentWeekStart.getDate()).padStart(2, '0')}`;
        setSelectedDate(sundayDate);
      }
    } else {
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

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        bgcolor: themeStyles.background,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed AppBar */}
      <Box sx={{ flexShrink: 0, width: "97vw", }}>
        <AppBarComponent
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          selectedTab={1}
        />
      </Box>

      {/* Scrollable Content Area */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
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
        </Box>

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
          <>
            <Box sx={{ mb: 3 }}>
              <CalendarGrid
                year={currentYear}
                month={currentMonth}
                events={events}
                darkMode={darkMode}
                viewMode={viewMode}
                weekStart={currentWeekStart}
                selectedDate={selectedDate}
                onDateClick={handleDateClick}
              />
            </Box>

            {viewMode === "week" && (
              <Box>
                <EarningsTable 
                  events={getSelectedDateEvents()}
                  selectedDate={selectedDate}
                  darkMode={darkMode}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default EarningsPage;