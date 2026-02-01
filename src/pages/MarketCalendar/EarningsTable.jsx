import React, { useState, useMemo, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  InputAdornment, 
  IconButton,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { 
  WbSunny, 
  NightsStay, 
  Search, 
  ArrowUpward, 
  ArrowDownward, 
  ExpandMore,
  ExpandLess,
  FilterList,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { getThemeStyles, commonStyles } from "./calendarStyles";
import PreviousQuartersTable from "./PreviousQuartersTable";

const EarningsTable = ({ events, selectedDate, darkMode }) => {
  const themeStyles = getThemeStyles(darkMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [expandedRows, setExpandedRows] = useState({});
  const [reportingTimeFilter, setReportingTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const formatMarketCap = (marketCap) => {
    if (!marketCap) return "—";
    const billions = marketCap / 1000000000;
    if (billions >= 1000) {
      return `$${(billions / 1000).toFixed(2)}T`;
    }
    return `$${billions.toFixed(2)}B`;
  };

  const formatRevenue = (revenue) => {
    if (!revenue) return "—";
    const billions = revenue / 1000000000;
    if (billions >= 1) {
      return `$${billions.toFixed(2)}B`;
    }
    const millions = revenue / 1000000;
    return `$${millions.toFixed(2)}M`;
  };

  const formatEPS = (eps) => {
    if (eps === null || eps === undefined) return "—";
    return eps.toFixed(2);
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

  const formatSelectedDate = () => {
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const parseMarketCapValue = (marketCap) => {
    if (!marketCap) return 0;
    return marketCap;
  };

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.ticker.toLowerCase().includes(query) ||
          event.company_name.toLowerCase().includes(query)
      );
    }

    // Reporting time filter
    if (reportingTimeFilter !== "all") {
      filtered = filtered.filter(event => {
        if (!event.reporting_time) return false;
        const lowerTime = event.reporting_time.toLowerCase();
        if (reportingTimeFilter === "pre") {
          return lowerTime.includes("before") || lowerTime.includes("pre");
        } else if (reportingTimeFilter === "post") {
          return lowerTime.includes("after") || lowerTime.includes("post");
        }
        return true;
      });
    }

    // Sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case "market_cap":
            aValue = parseMarketCapValue(a.market_cap);
            bValue = parseMarketCapValue(b.market_cap);
            break;
          case "eps_forecast":
            aValue = a.eps_forecast ?? -Infinity;
            bValue = b.eps_forecast ?? -Infinity;
            break;
          case "revenue_forecast":
            aValue = a.revenue_forecast ?? -Infinity;
            bValue = b.revenue_forecast ?? -Infinity;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [events, searchQuery, sortConfig, reportingTimeFilter]);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, reportingTimeFilter, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = filteredAndSortedEvents.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ArrowUpward sx={{ fontSize: "0.75rem", ml: 0.5 }} />
      ) : (
        <ArrowDownward sx={{ fontSize: "0.75rem", ml: 0.5 }} />
      );
    }
    return (
      <Box sx={{ display: "flex", flexDirection: "column", ml: 0.5, opacity: 0.3 }}>
        <ArrowUpward sx={{ fontSize: "0.5rem", mb: -0.5 }} />
        <ArrowDownward sx={{ fontSize: "0.5rem" }} />
      </Box>
    );
  };

  const toggleRowExpansion = (ticker) => {
    setExpandedRows(prev => ({
      ...prev,
      [ticker]: !prev[ticker]
    }));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Smooth scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  if (events.length === 0) {
    return (
      <Box sx={{ mt: 3, p: 3, textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: themeStyles.textSecondary,
            fontStyle: "italic",
          }}
        >
          No earnings reports for {formatSelectedDate()}
        </Typography>
      </Box>
    );
  }

  const noResultsFound = searchQuery && filteredAndSortedEvents.length === 0;

  return (
    <Box sx={{ mt: 3, mb: 4 }}>
      {/* Table Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", sm: "0.85rem", md: "0.9rem" },
              fontWeight: 700,
              color: themeStyles.textPrimary,
              fontFamily: commonStyles.fontFamily,
            }}
          >
            {formatSelectedDate()}
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.5,
              py: 0.5,
              borderRadius: "16px",
              backgroundColor: "rgba(19, 127, 236, 0.12)",
              border: `1px solid rgba(19, 127, 236, 0.3)`,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "0.40rem", sm: "0.5rem", md: "0.65rem" },
                fontWeight: 700,
                color: commonStyles.primaryColor,
                fontFamily: commonStyles.fontFamily,
              }}
            >
              {filteredAndSortedEvents.length} {filteredAndSortedEvents.length === 1 ? "Company" : "Companies"}
            </Typography>
          </Box>
        </Box>

        {/* Search Box and Filters */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          {/* Reporting Time Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={reportingTimeFilter}
              onChange={(e) => setReportingTimeFilter(e.target.value)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  <FilterList sx={{ fontSize: "1rem", color: themeStyles.textSecondary, ml: 0.5 }} />
                </InputAdornment>
              }
              sx={{
                fontSize: "0.75rem",
                backgroundColor: themeStyles.cellBackground,
                borderRadius: "8px",
                color: themeStyles.textPrimary,
                fontFamily: commonStyles.fontFamily,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: themeStyles.borderColor,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: themeStyles.textSecondary,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: commonStyles.primaryColor,
                },
                "& .MuiSelect-select": {
                  py: "8px",
                  pl: "8px",
                },
              }}
            >
              <MenuItem value="all" sx={{ fontSize: "0.75rem", fontFamily: commonStyles.fontFamily }}>
                All Reporting Times
              </MenuItem>
              <MenuItem value="pre" sx={{ fontSize: "0.75rem", fontFamily: commonStyles.fontFamily }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <WbSunny sx={{ fontSize: "0.9rem", color: "#f59e0b" }} />
                  Pre-Market Only
                </Box>
              </MenuItem>
              <MenuItem value="post" sx={{ fontSize: "0.75rem", fontFamily: commonStyles.fontFamily }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <NightsStay sx={{ fontSize: "0.9rem", color: "#8b5cf6" }} />
                  Post-Market Only
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Search Box */}
          <TextField
            size="small"
            placeholder="Search by Symbol or Company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: "1rem", color: themeStyles.textSecondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: "300px" },
              "& .MuiOutlinedInput-root": {
                fontSize: "0.75rem",
                backgroundColor: themeStyles.cellBackground,
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: themeStyles.borderColor,
                },
                "&:hover fieldset": {
                  borderColor: themeStyles.textSecondary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: commonStyles.primaryColor,
                },
              },
              "& .MuiOutlinedInput-input": {
                color: themeStyles.textPrimary,
                padding: "8px 12px",
                "&::placeholder": {
                  color: themeStyles.textSecondary,
                  opacity: 0.7,
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Table */}
      {noResultsFound ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            border: `1px solid ${themeStyles.borderColor}`,
            borderRadius: commonStyles.borderRadius,
            backgroundColor: themeStyles.cellBackground,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: themeStyles.textSecondary,
              fontStyle: "italic",
            }}
          >
            No results found for "{searchQuery}"
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer
            sx={{
              border: `1px solid ${themeStyles.borderColor}`,
              borderRadius: commonStyles.borderRadius,
              overflow: "auto",
              maxWidth: "100%",
            }}
          >
            <Table sx={{ tableLayout: "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: darkMode ? "#161B22" : "rgba(248, 250, 252, 1)",
                      color: themeStyles.textSecondary,
                      fontWeight: 700,
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      textTransform: "capitalize",
                      borderBottom: `2px solid ${themeStyles.borderColor}`,
                      borderRight: `1px solid ${themeStyles.borderColor}`,
                      py: 1.5,
                      width: "70px",
                      minWidth: "70px",
                      maxWidth: "70px",
                    }}
                  >
                    Ticker
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: darkMode ? "#161B22" : "rgba(248, 250, 252, 1)",
                      color: themeStyles.textSecondary,
                      fontWeight: 700,
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      textTransform: "capitalize",
                      borderBottom: `2px solid ${themeStyles.borderColor}`,
                      borderRight: `1px solid ${themeStyles.borderColor}`,
                      py: 1.5,
                      width: "120px",
                      minWidth: "120px",
                      maxWidth: "120px",
                    }}
                  >
                    Company
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: darkMode ? "#161B22" : "rgba(248, 250, 252, 1)",
                      color: themeStyles.textSecondary,
                      fontWeight: 700,
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      textTransform: "capitalize",
                      borderBottom: `2px solid ${themeStyles.borderColor}`,
                      borderRight: `1px solid ${themeStyles.borderColor}`,
                      py: 1.5,
                      width: "120px",
                      minWidth: "120px",
                      maxWidth: "120px",
                    }}
                  >
                    Reporting Time
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => handleSort("market_cap")}
                    sx={{
                      backgroundColor: darkMode ? "#161B22" : "rgba(248, 250, 252, 1)",
                      color: themeStyles.textSecondary,
                      fontWeight: 700,
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      textTransform: "capitalize",
                      borderBottom: `2px solid ${themeStyles.borderColor}`,
                      borderRight: `1px solid ${themeStyles.borderColor}`,
                      py: 1.5,
                      cursor: "pointer",
                      userSelect: "none",
                      width: "120px",
                      minWidth: "120px",
                      maxWidth: "120px",
                      "&:hover": {
                        backgroundColor: darkMode ? "#1c2128" : "rgba(240, 244, 248, 1)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      Market Cap
                      {getSortIcon("market_cap")}
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: darkMode ? "#161B22" : "rgba(248, 250, 252, 1)",
                      color: themeStyles.textSecondary,
                      fontWeight: 700,
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      textTransform: "capitalize",
                      borderBottom: `2px solid ${themeStyles.borderColor}`,
                      borderRight: `1px solid ${themeStyles.borderColor}`,
                      py: 1.5,
                      width: "140px",
                      minWidth: "140px",
                      maxWidth: "140px",
                    }}
                  >
                    EPS / Forecast
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: darkMode ? "#161B22" : "rgba(248, 250, 252, 1)",
                      color: themeStyles.textSecondary,
                      fontWeight: 700,
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      textTransform: "capitalize",
                      borderBottom: `2px solid ${themeStyles.borderColor}`,
                      borderRight: `1px solid ${themeStyles.borderColor}`,
                      py: 1.5,
                      width: "160px",
                      minWidth: "160px",
                      maxWidth: "160px",
                    }}
                  >
                    Revenue / Forecast
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: darkMode ? "#161B22" : "rgba(248, 250, 252, 1)",
                      color: themeStyles.textSecondary,
                      fontWeight: 700,
                      fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      textTransform: "capitalize",
                      borderBottom: `2px solid ${themeStyles.borderColor}`,
                      py: 1.5,
                      width: "80px",
                      minWidth: "80px",
                      maxWidth: "80px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Price Reaction
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEvents.map((event, index) => {
                  const reportDisplay = getReportingTimeDisplay(event.reporting_time);
                  const isExpanded = expandedRows[event.ticker];
                  
                  return (
                    <React.Fragment key={`${event.ticker}-${index}`}>
                      {/* Main Row */}
                      <TableRow
                        sx={{
                          "&:hover": {
                            backgroundColor: themeStyles.cellHoverBackground,
                          },
                          cursor: "pointer",
                        }}
                        onClick={() => toggleRowExpansion(event.ticker)}
                      >
                        <TableCell
                          sx={{
                            color: commonStyles.primaryColor,
                            fontWeight: 700,
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                            borderBottom: isExpanded ? 0 : `1px solid ${themeStyles.borderColor}`,
                            borderRight: `1px solid ${themeStyles.borderColor}`,
                            py: 0.5,
                            verticalAlign: "middle",
                          }}
                        >
                          {event.ticker}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: themeStyles.textPrimary,
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                            borderBottom: isExpanded ? 0 : `1px solid ${themeStyles.borderColor}`,
                            borderRight: `1px solid ${themeStyles.borderColor}`,
                            py: 0.5,
                            maxWidth: "120px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            verticalAlign: "middle",
                          }}
                        >
                          {event.company_name}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: isExpanded ? 0 : `1px solid ${themeStyles.borderColor}`,
                            borderRight: `1px solid ${themeStyles.borderColor}`,
                            py: 0.5,
                            verticalAlign: "middle",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.5,
                            }}
                          >
                            {reportDisplay.icon}
                            <Typography
                              sx={{
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                color: themeStyles.textSecondary,
                                fontWeight: 600,
                              }}
                            >
                              {reportDisplay.text}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: themeStyles.textPrimary,
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                            fontWeight: 600,
                            borderBottom: isExpanded ? 0 : `1px solid ${themeStyles.borderColor}`,
                            borderRight: `1px solid ${themeStyles.borderColor}`,
                            py: 0.5,
                            verticalAlign: "middle",
                          }}
                        >
                          {formatMarketCap(event.market_cap)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: themeStyles.textPrimary,
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                            borderBottom: isExpanded ? 0 : `1px solid ${themeStyles.borderColor}`,
                            borderRight: `1px solid ${themeStyles.borderColor}`,
                            py: 0.5,
                            verticalAlign: "middle",
                          }}
                        >
                          <Typography
                            component="span"
                            sx={{
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              fontWeight: 600,
                              color: themeStyles.textPrimary,
                            }}
                          >
                            {formatEPS(event.eps_actual)}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              color: themeStyles.textSecondary,
                              mx: 0.5,
                            }}
                          >
                            /
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              color: themeStyles.textSecondary,
                            }}
                          >
                            {formatEPS(event.eps_forecast)}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: themeStyles.textPrimary,
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                            borderBottom: isExpanded ? 0 : `1px solid ${themeStyles.borderColor}`,
                            borderRight: `1px solid ${themeStyles.borderColor}`,
                            py: 0.5,
                            verticalAlign: "middle",
                          }}
                        >
                          <Typography
                            component="span"
                            sx={{
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              fontWeight: 600,
                              color: themeStyles.textPrimary,
                            }}
                          >
                            {formatRevenue(event.revenue_actual)}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              color: themeStyles.textSecondary,
                              mx: 0.5,
                            }}
                          >
                            /
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              color: themeStyles.textSecondary,
                            }}
                          >
                            {formatRevenue(event.revenue_forecast)}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: isExpanded ? 0 : `1px solid ${themeStyles.borderColor}`,
                            py: 0.5,
                            verticalAlign: "middle",
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{
                              color: themeStyles.textSecondary,
                              transition: "transform 0.2s",
                              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                          >
                            <ExpandMore sx={{ fontSize: "1.2rem" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      {/* Expandable Row - Previous Quarters */}
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          sx={{
                            p: 0,
                            borderBottom: `1px solid ${themeStyles.borderColor}`,
                          }}
                        >
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <PreviousQuartersTable 
                              ticker={event.ticker} 
                              darkMode={darkMode} 
                            />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Items per page selector */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: themeStyles.textSecondary,
                  fontFamily: commonStyles.fontFamily,
                }}
              >
                Rows per page:
              </Typography>
              <FormControl size="small">
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  sx={{
                    fontSize: "0.75rem",
                    backgroundColor: themeStyles.cellBackground,
                    borderRadius: "8px",
                    color: themeStyles.textPrimary,
                    fontFamily: commonStyles.fontFamily,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: themeStyles.borderColor,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: themeStyles.textSecondary,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: commonStyles.primaryColor,
                    },
                    "& .MuiSelect-select": {
                      py: "6px",
                      px: "12px",
                    },
                  }}
                >
                  <MenuItem value={6} sx={{ fontSize: "0.75rem", fontFamily: commonStyles.fontFamily }}>6</MenuItem>
                  <MenuItem value={25} sx={{ fontSize: "0.75rem", fontFamily: commonStyles.fontFamily }}>25</MenuItem>
                  <MenuItem value={50} sx={{ fontSize: "0.75rem", fontFamily: commonStyles.fontFamily }}>50</MenuItem>
                  <MenuItem value={100} sx={{ fontSize: "0.75rem", fontFamily: commonStyles.fontFamily }}>100</MenuItem>
                </Select>
              </FormControl>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: themeStyles.textSecondary,
                  fontFamily: commonStyles.fontFamily,
                }}
              >
                {startIndex + 1}-{Math.min(endIndex, filteredAndSortedEvents.length)} of {filteredAndSortedEvents.length}
              </Typography>
            </Box>

            {/* Pagination */}
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBack, next: ArrowForward }}
                  {...item}
                  sx={{
                    fontSize: "0.75rem",
                    fontFamily: commonStyles.fontFamily,
                    color: themeStyles.textPrimary,
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
                  }}
                />
              )}
              sx={{
                "& .MuiPagination-ul": {
                  flexWrap: "nowrap",
                },
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default EarningsTable;