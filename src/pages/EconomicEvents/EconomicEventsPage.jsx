import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, IconButton, Button, Chip } from "@mui/material";
import { ChevronLeft, ChevronRight, FileDownload } from "@mui/icons-material";
import AppBarComponent from "../../common/AppBarComponent";
import EconomicCalendarGrid from "./EconomicCalendarGrid";
import { fetchEconomicCalendar, countEventsByType, getHighImpactEvents } from "./economicEventsApi";
import {
  getPreviousMonth,
  getNextMonth,
  getMonthName,
} from "../MarketCalendar/calendarUtils";
import { getThemeStyles, commonStyles } from "../MarketCalendar/calendarStyles";

const EconomicEventsPage = ({ darkMode, setDarkMode }) => {
  const themeStyles = getThemeStyles(darkMode);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear() || 2026);
  const [currentMonth, setCurrentMonth] = useState((today.getMonth() + 1) || 1);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEvents(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const loadEvents = async (year, month) => {
    setLoading(true);
    try {
      const apiEvents = await fetchEconomicCalendar(year, month);
      setEvents(apiEvents);
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    const { year, month } = getPreviousMonth(currentYear, currentMonth);
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const handleNextMonth = () => {
    const { year, month } = getNextMonth(currentYear, currentMonth);
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  };

  const handleExport = () => {
    const monthStr = String(currentMonth).padStart(2, '0');
    const filteredEvents = events.filter((event) =>
      event.date.startsWith(`${currentYear}-${monthStr}`)
    );

    const csvRows = [
      ["Date", "Type", "Event", "Country", "Currency", "Impact", "Time", "Previous", "Estimate", "Actual"].join(",")
    ];

    filteredEvents.forEach((event) => {
      if (event.type === "economic") {
        csvRows.push([
          event.date,
          "Economic",
          `"${event.event}"`,
          event.country,
          event.currency,
          event.impact,
          event.time,
          event.values?.previous || "",
          event.values?.estimate || "",
          event.values?.actual || "",
        ].join(","));
      } else if (event.type === "holiday") {
        csvRows.push([
          event.date,
          "Holiday",
          `"${event.name}"`,
          event.exchange,
          "",
          "",
          "",
          "",
          "",
          "",
        ].join(","));
      }
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `economic-calendar-${getMonthName(currentMonth)}-${currentYear}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = countEventsByType(events || []);
  const highImpactEvents = getHighImpactEvents(events || []);

  return (
    <>
      <style>
        {`
          body {
            overflow-x: hidden !important;
          }
        `}
      </style>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          maxWidth: "100vw",
          bgcolor: themeStyles.background,
          overflow: "hidden",
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

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, sm: 3, md: 4 },
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5 }}>
                <IconButton
                  onClick={handlePreviousMonth}
                  sx={{
                    width: "28px",
                    height: "28px",
                    border: `1px solid ${themeStyles.borderColor}`,
                    borderRadius: commonStyles.borderRadius,
                    color: themeStyles.textPrimary,
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
                  {getMonthName(currentMonth)} {currentYear}
                </Typography>

                <IconButton
                  onClick={handleNextMonth}
                  sx={{
                    width: "28px",
                    height: "28px",
                    border: `1px solid ${themeStyles.borderColor}`,
                    borderRadius: commonStyles.borderRadius,
                    color: themeStyles.textPrimary,
                  }}
                >
                  <ChevronRight sx={{ fontSize: "16px" }} />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", gap: 0.75, justifyContent: "center" }}>
                <Button
                  onClick={handleTodayClick}
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
                  }}
                >
                  Today
                </Button>

                <Button
                  onClick={handleExport}
                  variant="contained"
                  startIcon={<FileDownload />}
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
                  }}
                >
                  Export CSV
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                <Chip
                  label={`${(stats?.economic || 0)} Events`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(19, 127, 236, 0.1)",
                    border: "1px solid rgba(19, 127, 236, 0.3)",
                    color: commonStyles.primaryColor,
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    height: "24px",
                    "& .MuiChip-label": { px: 1.5 },
                  }}
                />
                <Chip
                  label={`${(stats?.holidays || 0)} Holidays`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(139, 92, 246, 0.1)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    color: "#8b5cf6",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    height: "24px",
                    "& .MuiChip-label": { px: 1.5 },
                  }}
                />
                <Chip
                  label={`${(highImpactEvents?.length || 0)} High Impact`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    height: "24px",
                    "& .MuiChip-label": { px: 1.5 },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}>
                <IconButton
                  onClick={handlePreviousMonth}
                  sx={{
                    width: "28px",
                    height: "28px",
                    border: `1px solid ${themeStyles.borderColor}`,
                    borderRadius: commonStyles.borderRadius,
                    color: themeStyles.textPrimary,
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
                  {getMonthName(currentMonth)} {currentYear}
                </Typography>

                <IconButton
                  onClick={handleNextMonth}
                  sx={{
                    width: "28px",
                    height: "28px",
                    border: `1px solid ${themeStyles.borderColor}`,
                    borderRadius: commonStyles.borderRadius,
                    color: themeStyles.textPrimary,
                  }}
                >
                  <ChevronRight sx={{ fontSize: "16px" }} />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", gap: 0.75, flex: 1, justifyContent: "flex-end" }}>
                <Button
                  onClick={handleTodayClick}
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
                  }}
                >
                  Today
                </Button>

                <Button
                  onClick={handleExport}
                  variant="contained"
                  startIcon={<FileDownload />}
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
                  }}
                >
                  Export CSV
                </Button>
              </Box>
            </Box>
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
                There are no economic events for {getMonthName(currentMonth)} {currentYear}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mb: 3, overflow: "hidden", width: "100%" }}>
              {currentYear && currentMonth ? (
                <EconomicCalendarGrid
                  year={currentYear}
                  month={currentMonth}
                  events={events}
                  darkMode={darkMode}
                />
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                  <Typography sx={{ color: themeStyles.textSecondary }}>Initializing calendar...</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default EconomicEventsPage;