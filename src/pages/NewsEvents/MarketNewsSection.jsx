import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Bookmark, PriorityHigh, ExpandMore, ExpandLess } from "@mui/icons-material";

const MarketNewsSection = ({ news, darkMode }) => {
  const themeColors = {
    cardBg: darkMode ? "rgba(17, 26, 34, 0.5)" : "#ffffff",
    border: darkMode ? "#324d67" : "#e5e7eb",
    text: darkMode ? "#ffffff" : "#111827",
    textSecondary: darkMode ? "#92adc9" : "#6b7280",
    hoverBg: darkMode ? "rgba(50, 77, 103, 0.5)" : "rgba(241, 245, 249, 1)",
  };

  // Track expanded state for each date - first date expanded by default
  const [expandedDates, setExpandedDates] = useState({});

  // Group events by date
  const groupedByDate = {};
  if (news && news.length > 0) {
    news.forEach((item) => {
      if (!groupedByDate[item.date]) {
        groupedByDate[item.date] = [];
      }
      groupedByDate[item.date].push(item);
    });
  }

  // Sort dates
  const sortedDates = Object.keys(groupedByDate).sort();

  // Initialize first date as expanded if not already set
  useEffect(() => {
    if (sortedDates.length > 0 && Object.keys(expandedDates).length === 0) {
      setExpandedDates({ [sortedDates[0]]: true });
    }
  }, [sortedDates.length]); // Use sortedDates.length instead of sortedDates to avoid infinite loop

  const toggleDate = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  if (!news || news.length === 0) {
    return (
      <Box>
        <Typography
          sx={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: themeColors.text,
            mb: 3,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
         Earnings — Monthly Overview
        </Typography>
        <Box
          sx={{
            backgroundColor: themeColors.cardBg,
            borderRadius: "12px",
            border: `1px solid ${themeColors.border}`,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: themeColors.textSecondary,
            }}
          >
            No upcoming events for the rest of the month
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "1.375rem",
          fontWeight: 700,
          color: themeColors.text,
          mb: 3,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        Earnings — Monthly Overview
      </Typography>

      <Box
        sx={{
          backgroundColor: themeColors.cardBg,
          borderRadius: "12px",
          border: `1px solid ${themeColors.border}`,
          overflow: "hidden",
        }}
      >
        {sortedDates.map((date, dateIndex) => {
          const events = groupedByDate[date];
          const isExpanded = expandedDates[date];

          return (
            <Box key={date}>
              {/* Date Header with Expand/Collapse */}
              <Box
                onClick={() => toggleDate(date)}
                sx={{
                  px: 2,
                  py: 1.25,
                  backgroundColor: darkMode ? "#161B22" : "#f8fafc",
                  borderBottom: `1px solid ${themeColors.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: darkMode ? "#1c2530" : "#f1f5f9",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: themeColors.text,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {events[0].displayDate}
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      fontSize: "0.65rem",
                      color: themeColors.textSecondary,
                      fontWeight: 500,
                    }}
                  >
                    ({events.length} event{events.length !== 1 ? "s" : ""})
                  </Box>
                </Typography>

                <IconButton
                  size="small"
                  sx={{
                    color: themeColors.textSecondary,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: themeColors.text,
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {isExpanded ? (
                    <ExpandLess sx={{ fontSize: "1.2rem" }} />
                  ) : (
                    <ExpandMore sx={{ fontSize: "1.2rem" }} />
                  )}
                </IconButton>
              </Box>

              {/* Events for this date - Show ALL when expanded */}
              {isExpanded &&
                events.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: 2,
                      borderBottom:
                        index !== events.length - 1 ||
                        dateIndex !== sortedDates.length - 1
                          ? `1px solid ${themeColors.border}`
                          : "none",
                      backgroundColor: item.priority
                        ? "rgba(19, 127, 236, 0.05)"
                        : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: themeColors.hoverBg,
                      },
                      position: "relative",
                      "&:hover .bookmark-icon": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: "0.625rem",
                          fontWeight: 700,
                          color: "#137fec",
                          backgroundColor: "rgba(19, 127, 236, 0.1)",
                          px: 1,
                          py: 0.4,
                          borderRadius: "4px",
                        }}
                      >
                        {item.ticker}
                      </Box>

                      <IconButton
                        className="bookmark-icon"
                        size="small"
                        sx={{
                          opacity: item.priority ? 1 : 0,
                          transition: "opacity 0.2s ease",
                          color: themeColors.textSecondary,
                          p: 0.5,
                        }}
                      >
                        {item.priority ? (
                          <PriorityHigh sx={{ fontSize: "1rem" }} />
                        ) : (
                          <Bookmark sx={{ fontSize: "1rem" }} />
                        )}
                      </IconButton>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: themeColors.text,
                        lineHeight: 1.4,
                        mb: 1,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.625rem",
                          color: themeColors.textSecondary,
                          fontStyle: "italic",
                          fontWeight: 500,
                        }}
                      >
                        {item.source}
                      </Typography>
                      <Box
                        sx={{
                          width: "4px",
                          height: "4px",
                          borderRadius: "50%",
                          backgroundColor: darkMode ? "#475569" : "#64748b",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.625rem",
                          fontWeight: 700,
                          color: item.categoryColor,
                        }}
                      >
                        {item.category}
                      </Typography>
                      {item.market_cap && (
                        <>
                          <Box
                            sx={{
                              width: "4px",
                              height: "4px",
                              borderRadius: "50%",
                              backgroundColor: darkMode ? "#475569" : "#64748b",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.625rem",
                              color: themeColors.textSecondary,
                              fontWeight: 600,
                            }}
                          >
                            Cap: ${(item.market_cap / 1000000000).toFixed(2)}B
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default MarketNewsSection;