import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { FilterAlt, FileDownload, KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import AppBarComponent from "../../common/AppBarComponent";
import EarningsSection from "./EarningsSection";
import MarketNewsSection from "./MarketNewsSection";
import FiltersDialog from "./FiltersDialog";
import {
  fetchNewsEventsData,
  transformToEarningsFormat,
  transformToMarketNewsFormat,
  tabs,
  exportEventsToCSV,
} from "./newsEventsData";

const NewsEvents = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth()); // 0-11
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [earningsEvents, setEarningsEvents] = useState([]);
  const [marketNews, setMarketNews] = useState([]);
  const [allMonthEvents, setAllMonthEvents] = useState([]); // For export
  const [isViewingCurrentMonth, setIsViewingCurrentMonth] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    marketCapMin: null,
    marketCapMax: null,
    impactLevel: "all",
    tickers: [],
  });

  // Determine selected tab for AppBar based on current route
  const appBarSelectedTab = location.pathname === "/news-events" ? 1 : 0;

  // Fetch data on component mount or when month/year changes
  useEffect(() => {
    loadData();
  }, [displayMonth, displayYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { 
        earningsInfoEvents, 
        monthlyOverviewEvents, 
        allEvents, 
        isCurrentMonth: isCurrent 
      } = await fetchNewsEventsData(displayYear, displayMonth + 1);

      setIsViewingCurrentMonth(isCurrent);
      setAllMonthEvents(allEvents);

      // Apply filters
      const filteredEarningsInfo = applyFilters(earningsInfoEvents);
      const filteredMonthlyOverview = applyFilters(monthlyOverviewEvents);

      // Transform data based on selected tab
      if (selectedTab === 0) {
        // All Briefing Tab
        const transformedEarnings = filteredEarningsInfo.map(transformToEarningsFormat);
        const transformedOverview = filteredMonthlyOverview.map(transformToMarketNewsFormat);
        setEarningsEvents(transformedEarnings);
        setMarketNews(transformedOverview);
      } else if (selectedTab === 1) {
        // Featured Tab - show only earnings info events
        const transformedEarnings = filteredEarningsInfo.map(transformToEarningsFormat);
        setEarningsEvents(transformedEarnings);
        setMarketNews([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reload data when tab or filters change
  useEffect(() => {
    loadData();
  }, [selectedTab, filters]);

  // Apply filters to events
  const applyFilters = (events) => {
    return events.filter((event) => {
      if (filters.marketCapMin && event.market_cap < filters.marketCapMin * 1000000000) {
        return false;
      }
      if (filters.marketCapMax && event.market_cap > filters.marketCapMax * 1000000000) {
        return false;
      }
      if (filters.impactLevel !== "all" && event.impact.toLowerCase() !== filters.impactLevel) {
        return false;
      }
      if (filters.tickers.length > 0 && !filters.tickers.includes(event.ticker)) {
        return false;
      }
      return true;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getFormattedDate = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${months[displayMonth]} ${displayYear}`;
  };

  const handlePreviousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handleExport = () => {
    const monthName = getFormattedDate().replace(" ", "-");
    exportEventsToCSV(allMonthEvents, `Events-${monthName}.csv`);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setFiltersOpen(false);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#137fec" },
      background: {
        default: darkMode ? "#101922" : "#ffffff",
        paper: darkMode ? "#111a22" : "#ffffff",
      },
      divider: darkMode ? "#324d67" : "#e2e8f0",
      text: {
        primary: darkMode ? "#ffffff" : "#1e293b",
        secondary: darkMode ? "#94a3b8" : "#64748b",
      },
    },
    typography: { fontFamily: "'Manrope', sans-serif" },
    shape: { borderRadius: 8 },
  });

  const themeColors = {
    bg: darkMode ? "#101922" : "#f6f7f8",
    text: darkMode ? "#ffffff" : "#111827",
    textSecondary: darkMode ? "#92adc9" : "#6b7280",
    border: darkMode ? "#324d67" : "#e5e7eb",
    buttonBg: darkMode ? "#324d67" : "#e5e7eb",
    buttonHover: darkMode ? "#475569" : "#cbd5e1",
  };

  const handleTabChange = (e, newValue) => {
    if (newValue === 0 || newValue === 1) {
      setSelectedTab(newValue);
    }
  };

  // Update tab labels based on month
  const updatedTabs = tabs.map((tab, index) => {
    if (index === 1) {
      const label = isViewingCurrentMonth ? "Today" : "Featured";
      return { ...tab, label, count: earningsEvents.length };
    }
    return tab;
  });

  const hasActiveFilters =
    filters.marketCapMin ||
    filters.marketCapMax ||
    filters.impactLevel !== "all" ||
    filters.tickers.length > 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", width: "100%" }}>
        <AppBarComponent
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          selectedTab={appBarSelectedTab}
        />

        <Box sx={{ width: "100%", px: { xs: 2, sm: 3, lg: 10 }, py: 4 }}>
          <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "1.6rem", md: "2rem" },
                      fontWeight: 900,
                      color: themeColors.text,
                      letterSpacing: "-0.02em",
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  >
                    Events — {getFormattedDate()}
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
                    <IconButton
                      size="small"
                      onClick={handleNextMonth}
                      sx={{
                        padding: "2px",
                        color: themeColors.textSecondary,
                        "&:hover": {
                          color: themeColors.text,
                          backgroundColor: themeColors.buttonHover,
                        },
                      }}
                    >
                      <KeyboardArrowUp sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handlePreviousMonth}
                      sx={{
                        padding: "2px",
                        color: themeColors.textSecondary,
                        "&:hover": {
                          color: themeColors.text,
                          backgroundColor: themeColors.buttonHover,
                        },
                      }}
                    >
                      <KeyboardArrowDown sx={{ fontSize: "1.2rem" }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Button
                  startIcon={<FilterAlt />}
                  onClick={() => setFiltersOpen(true)}
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: hasActiveFilters ? "#137fec" : themeColors.buttonBg,
                    color: hasActiveFilters ? "#ffffff" : themeColors.textSecondary,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: hasActiveFilters ? "#0d6ecd" : themeColors.buttonHover,
                    },
                  }}
                >
                  Filters
                  {hasActiveFilters && (
                    <Chip
                      label="●"
                      sx={{
                        ml: 0.5,
                        height: "16px",
                        minWidth: "16px",
                        backgroundColor: "#ffffff",
                        color: "#137fec",
                        "& .MuiChip-label": { px: 0.5, fontSize: "0.6rem" },
                      }}
                    />
                  )}
                </Button>

                <Button
                  startIcon={<FileDownload />}
                  onClick={handleExport}
                  disabled={allMonthEvents.length === 0}
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor: themeColors.buttonBg,
                    color: themeColors.textSecondary,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": { backgroundColor: themeColors.buttonHover },
                    "&:disabled": { opacity: 0.5 },
                  }}
                >
                  Export
                </Button>
              </Box>
            </Box>

            <Box sx={{ mb: 4, borderBottom: `1px solid ${themeColors.border}` }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: themeColors.textSecondary,
                    minWidth: "auto",
                    px: 0,
                    mr: 5,
                    "&.Mui-selected": { color: "#137fec" },
                    "&.Mui-disabled": { color: themeColors.textSecondary, opacity: 0.6 },
                  },
                  "& .MuiTabs-indicator": { backgroundColor: "#137fec", height: "3px" },
                }}
              >
                {updatedTabs.map((tab, index) => (
                  <Tab
                    key={index}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <span>
                          {tab.count !== null ? `${tab.label} (${tab.count})` : tab.label}
                        </span>
                        {(index === 2 || index === 3) && (
                          <Chip
                            label="PRO"
                            sx={{
                              bgcolor: "#137fec",
                              color: "#ffffff",
                              fontWeight: 700,
                              mt: -4,
                              fontSize: "0.55rem",
                              height: "18px",
                              "& .MuiChip-label": { px: 0.75 },
                            }}
                          />
                        )}
                      </Box>
                    }
                    disabled={index === 2 || index === 3}
                  />
                ))}
              </Tabs>
            </Box>

            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                }}
              >
                <CircularProgress sx={{ color: "#137fec" }} />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
                  gap: 4,
                }}
              >
                <EarningsSection events={earningsEvents} darkMode={darkMode} />
                <MarketNewsSection news={marketNews} darkMode={darkMode} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <FiltersDialog
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={handleApplyFilters}
        darkMode={darkMode}
        availableTickers={[...new Set(allMonthEvents.map((e) => e.ticker))].sort()}
      />
    </ThemeProvider>
  );
};

export default NewsEvents;