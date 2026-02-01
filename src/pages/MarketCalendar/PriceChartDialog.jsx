import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Close, ShowChart } from "@mui/icons-material";
import { formatShortDate, formatVolume } from "./previousEarningsApi";
import { getThemeStyles, commonStyles } from "./calendarStyles";

/**
 * Single Quarter Chart Component
 */
const QuarterChart = ({ quarter, ticker, darkMode, size = "small", showTitle = true }) => {
  const themeStyles = getThemeStyles(darkMode);
  const [hoveredCandle, setHoveredCandle] = useState(null);
  
  if (!quarter.priceData || !quarter.priceData.earningsDay) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography sx={{ fontSize: "0.75rem", color: themeStyles.textSecondary }}>
          No price data available
        </Typography>
      </Box>
    );
  }

  const priceData = quarter.priceData;

  // SORT the before array in ASCENDING order (chronological)
  const sortedBefore = priceData.before 
    ? [...priceData.before].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  // Combine all 7 days
  const allDays = [
    ...sortedBefore,
    priceData.earningsDay,
    ...(priceData.after || []),
  ];

  const validDays = allDays.filter(day => day && day.close !== undefined);

  if (validDays.length === 0) {
    return null;
  }

  const earningsIndex = sortedBefore.length;

  // Chart dimensions based on size
  const isLarge = size === "large";
  const chartWidth = isLarge ? 700 : 420;
  const chartHeight = isLarge ? 220 : 160;
  const lineChartHeight = isLarge ? 145 : 105;
  const volumeHeight = isLarge ? 50 : 38;
  // INCREASED top padding to prevent price cutoff
  const padding = { top: isLarge ? 30 : 22, right: isLarge ? 20 : 15, bottom: isLarge ? 20 : 15, left: isLarge ? 20 : 15 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = lineChartHeight - padding.top - padding.bottom;

  // Get ranges
  const closes = validDays.map(d => d.close);
  const volumes = validDays.map(d => d.volume);
  const minPrice = Math.min(...closes);
  const maxPrice = Math.max(...closes);
  const maxVolume = Math.max(...volumes);
  const priceRange = maxPrice - minPrice || 1;

  // Scale functions
  const xScale = (index) => padding.left + (index * plotWidth) / (validDays.length - 1);
  const yScale = (price) => padding.top + plotHeight - ((price - minPrice) / priceRange) * plotHeight;
  const volumeScale = (volume) => (volume / maxVolume) * volumeHeight;

  // Line path
  const linePath = validDays
    .map((day, i) => {
      const x = xScale(i);
      const y = yScale(day.close);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  // Format release date (for grid view titles)
  const releaseDate = new Date(quarter.date);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDate = `${months[releaseDate.getMonth()]} ${releaseDate.getDate()}, ${releaseDate.getFullYear()}`;

  // Earnings reaction (for grid view titles)
  const earningsReaction = priceData.earningsReaction;
  let reactionText = "";
  let reactionColor = themeStyles.textSecondary;

  if (earningsReaction) {
    if (earningsReaction.amc && earningsReaction.amc.price_change_pct !== null) {
      const change = earningsReaction.amc.price_change;
      const pct = earningsReaction.amc.price_change_pct;
      reactionColor = pct >= 0 ? "#10b981" : "#ef4444";
      reactionText = `${change >= 0 ? '+' : ''}$${Math.abs(change).toFixed(2)} (${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%)`;
    } else if (earningsReaction.bmo && earningsReaction.bmo.price_change_pct !== null) {
      const change = earningsReaction.bmo.price_change;
      const pct = earningsReaction.bmo.price_change_pct;
      reactionColor = pct >= 0 ? "#10b981" : "#ef4444";
      reactionText = `${change >= 0 ? '+' : ''}$${Math.abs(change).toFixed(2)} (${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%)`;
    }
  }

  const fontSize = isLarge ? { price: 12, volume: 11, date: 10 } : { price: 9, volume: 8, date: 8 };
  const strokeWidth = isLarge ? 3 : 2.5;
  const circleRadius = isLarge ? { earnings: 8, normal: 5 } : { earnings: 6, normal: 3.5 };

  return (
    <Box>
      {/* Title with inline reaction - ONLY for grid view */}
      {showTitle && (
        <Box sx={{ mb: 1.5, px: 1 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: themeStyles.textPrimary,
              fontFamily: commonStyles.fontFamily,
              mb: 0.5,
            }}
          >
            {ticker} ({formattedDate})
          </Typography>
          {reactionText && (
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: reactionColor,
                fontFamily: commonStyles.fontFamily,
              }}
            >
              {reactionText}
            </Typography>
          )}
        </Box>
      )}

      {/* Chart */}
      <svg width={chartWidth} height={chartHeight}>
        {/* Candlestick chart - MORE PROMINENT, drawn first */}
        {validDays.map((day, i) => {
          if (!day.open || !day.high || !day.low || !day.close) return null;
          
          const x = xScale(i);
          const candleWidth = (plotWidth / validDays.length) * 0.55;
          const isBullish = day.close >= day.open;
          const candleColor = isBullish ? "#10b981" : "#ef4444";
          
          // STRICT boundaries - candlesticks MUST stay within plotHeight
          const highY = Math.max(yScale(day.high), padding.top);
          const lowY = Math.min(yScale(day.low), padding.top + plotHeight);
          const openY = Math.max(Math.min(yScale(day.open), padding.top + plotHeight), padding.top);
          const closeY = Math.max(Math.min(yScale(day.close), padding.top + plotHeight), padding.top);
          
          // Body rectangle
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.abs(closeY - openY) || 1;
          
          const isHovered = hoveredCandle === i;
          
          return (
            <g key={`candle-${i}`}>
              {/* Invisible wider rectangle for easier hover detection */}
              <rect
                x={x - candleWidth}
                y={padding.top}
                width={candleWidth * 2}
                height={plotHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredCandle(i)}
                onMouseLeave={() => setHoveredCandle(null)}
              />
              
              {/* Wick (high-low line) - MORE PROMINENT */}
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                stroke={candleColor}
                strokeWidth={isLarge ? 2.5 : 2}
                opacity={isHovered ? 1 : 0.75}
                style={{ pointerEvents: 'none' }}
              />
              
              {/* Body (open-close rectangle) - MORE OPAQUE */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={candleColor}
                opacity={isHovered ? 0.75 : 0.55}
                rx={isLarge ? 2 : 1}
                style={{ pointerEvents: 'none' }}
              />
              
              {/* OHLC Tooltip on hover */}
              {isHovered && (
                <g>
                  {/* Tooltip background */}
                  <rect
                    x={x > chartWidth / 2 ? x - 110 : x + 10}
                    y={padding.top + 5}
                    width={100}
                    height={70}
                    fill={darkMode ? "#1a252f" : "#ffffff"}
                    stroke={themeStyles.borderColor}
                    strokeWidth={1}
                    rx={4}
                    style={{ pointerEvents: 'none' }}
                  />
                  {/* OHLC Text */}
                  <text
                    x={x > chartWidth / 2 ? x - 105 : x + 15}
                    y={padding.top + 20}
                    fontSize={isLarge ? 10 : 9}
                    fill={themeStyles.textPrimary}
                    fontWeight={700}
                    style={{ pointerEvents: 'none' }}
                  >
                    O: ${day.open.toFixed(2)}
                  </text>
                  <text
                    x={x > chartWidth / 2 ? x - 105 : x + 15}
                    y={padding.top + 35}
                    fontSize={isLarge ? 10 : 9}
                    fill="#10b981"
                    fontWeight={700}
                    style={{ pointerEvents: 'none' }}
                  >
                    H: ${day.high.toFixed(2)}
                  </text>
                  <text
                    x={x > chartWidth / 2 ? x - 105 : x + 15}
                    y={padding.top + 50}
                    fontSize={isLarge ? 10 : 9}
                    fill="#ef4444"
                    fontWeight={700}
                    style={{ pointerEvents: 'none' }}
                  >
                    L: ${day.low.toFixed(2)}
                  </text>
                  <text
                    x={x > chartWidth / 2 ? x - 105 : x + 15}
                    y={padding.top + 65}
                    fontSize={isLarge ? 10 : 9}
                    fill={themeStyles.textPrimary}
                    fontWeight={700}
                    style={{ pointerEvents: 'none' }}
                  >
                    C: ${day.close.toFixed(2)}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Price line - SUBTLE, SUPPORTING ELEMENT */}
        <path
          d={linePath}
          fill="none"
          stroke={darkMode ? "rgba(148, 163, 184, 0.4)" : "rgba(100, 116, 139, 0.5)"}
          strokeWidth={isLarge ? 1.5 : 1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Price points - MINIMAL CIRCLES, NO LABELS */}
        {validDays.map((day, i) => {
          const x = xScale(i);
          const y = yScale(day.close);
          const isEarningsDay = i === earningsIndex;

          return (
            <g key={`point-${i}`}>
              <circle
                cx={x}
                cy={y}
                r={isEarningsDay ? (isLarge ? 5 : 4) : (isLarge ? 3 : 2.5)}
                fill={isEarningsDay ? "#137fec" : (darkMode ? "rgba(148, 163, 184, 0.6)" : "rgba(100, 116, 139, 0.7)")}
                stroke={isEarningsDay ? "#ffffff" : "none"}
                strokeWidth={isEarningsDay ? 2 : 0}
              />
              {/* NO PRICE LABELS - removed completely */}
            </g>
          );
        })}

        {/* Volume bars */}
        <g transform={`translate(0, ${lineChartHeight})`}>
          {validDays.map((day, i) => {
            const x = xScale(i);
            const barWidth = plotWidth / validDays.length * 0.65;
            const barHeight = volumeScale(day.volume);
            const y = volumeHeight - barHeight;
            const isEarningsDay = i === earningsIndex;

            return (
              <g key={`vol-${i}`}>
                <rect
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={isEarningsDay ? "#137fec" : darkMode ? "#324d67" : "#cbd5e1"}
                  opacity={0.8}
                  rx={isLarge ? 3 : 2}
                />
                {barHeight > (isLarge ? 18 : 12) && (
                  <text
                    x={x}
                    y={y + barHeight / 2 + (isLarge ? 5 : 3)}
                    fontSize={fontSize.volume}
                    fill={darkMode ? "#ffffff" : "#1e293b"}
                    fontWeight={600}
                    textAnchor="middle"
                  >
                    {formatVolume(day.volume)}
                  </text>
                )}
                <text
                  x={x}
                  y={volumeHeight + (isLarge ? 16 : 12)}
                  fontSize={fontSize.date}
                  fill={isEarningsDay ? "#137fec" : themeStyles.textSecondary}
                  fontWeight={isEarningsDay ? 700 : 500}
                  textAnchor="middle"
                >
                  {formatShortDate(day.date)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </Box>
  );
};

/**
 * Price Chart Dialog - Toggle between Current and All Quarters
 */
const PriceChartDialog = ({ open, onClose, quartersData, selectedQuarter, ticker, darkMode }) => {
  const themeStyles = getThemeStyles(darkMode);
  const [viewMode, setViewMode] = useState("all");

  if (!quartersData || !quartersData.quarters || quartersData.quarters.length === 0) {
    return null;
  }

  // Sort quarters by date in DESCENDING order (most recent first)
  const sortedQuarters = [...quartersData.quarters]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const quarters = sortedQuarters;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={viewMode === "current" ? "md" : "lg"}
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: themeStyles.background,
          borderRadius: "12px",
          border: `1px solid ${themeStyles.borderColor}`,
          // Reduce max width for All Quarters to eliminate white space
          maxWidth: viewMode === "current" ? "900px" : "1000px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${themeStyles.borderColor}`,
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ShowChart sx={{ color: commonStyles.primaryColor, fontSize: 28 }} />
          <Box>
            <Typography
              sx={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: themeStyles.textPrimary,
                fontFamily: commonStyles.fontFamily,
              }}
            >
              7-Day Price Trend - {ticker}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: commonStyles.primaryColor,
                  fontFamily: commonStyles.fontFamily,
                  fontWeight: viewMode === "current" ? 600 : 400,
                }}
              >
                {viewMode === "current" && selectedQuarter ? (() => {
                  const releaseDate = new Date(selectedQuarter.date);
                  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  return `${months[releaseDate.getMonth()]} ${releaseDate.getDate()}, ${releaseDate.getFullYear()}`;
                })() : "Previous 4 quarters"}
              </Typography>
              
              {viewMode === "current" && selectedQuarter && (() => {
                const earningsReaction = selectedQuarter.priceData?.earningsReaction;
                if (earningsReaction) {
                  let reactionText = "";
                  let reactionColor = themeStyles.textSecondary;
                  
                  if (earningsReaction.amc && earningsReaction.amc.price_change_pct !== null) {
                    const change = earningsReaction.amc.price_change;
                    const pct = earningsReaction.amc.price_change_pct;
                    reactionColor = pct >= 0 ? "#10b981" : "#ef4444";
                    reactionText = `${change >= 0 ? '+' : ''}$${Math.abs(change).toFixed(2)} (${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%)`;
                  } else if (earningsReaction.bmo && earningsReaction.bmo.price_change_pct !== null) {
                    const change = earningsReaction.bmo.price_change;
                    const pct = earningsReaction.bmo.price_change_pct;
                    reactionColor = pct >= 0 ? "#10b981" : "#ef4444";
                    reactionText = `${change >= 0 ? '+' : ''}$${Math.abs(change).toFixed(2)} (${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%)`;
                  }
                  
                  if (reactionText) {
                    return (
                      <>
                        <Typography sx={{ fontSize: "0.8rem", color: themeStyles.textSecondary, fontWeight: 400 }}>
                          |
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            color: reactionColor,
                            fontFamily: commonStyles.fontFamily,
                            fontWeight: 700,
                          }}
                        >
                          {reactionText}
                        </Typography>
                      </>
                    );
                  }
                }
                return null;
              })()}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
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
            <ToggleButton value="current">Current</ToggleButton>
            <ToggleButton value="all">All Quarters</ToggleButton>
          </ToggleButtonGroup>

          <IconButton onClick={onClose} sx={{ color: themeStyles.textSecondary }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        {viewMode === "current" ? (
          <Box sx={{ display: "flex", justifyContent: "center",mt:4 }}>
            <QuarterChart quarter={selectedQuarter} ticker={ticker} darkMode={darkMode} size="large" showTitle={false} />
          </Box>
        ) : (
          <Grid container spacing={2.5} sx={{ mt: 3 }}>
            {quarters.map((quarter, index) => {
              const isLatest = index === 0; // First quarter is the latest
              
              return (
                <Grid item xs={12} md={6} key={quarter.date}>
                  <Box
                    sx={{
                      border: `2px solid ${isLatest ? 'rgba(19, 127, 236, 0.5)' : themeStyles.borderColor}`,
                      borderRadius: "8px",
                      p: 2,
                      backgroundColor: isLatest 
                        ? (darkMode ? "rgba(19, 127, 236, 0.08)" : "rgba(19, 127, 236, 0.05)")
                        : (darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)"),
                      position: "relative",
                    }}
                  >
                    {isLatest && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          px: 1,
                          py: 0.25,
                          borderRadius: "4px",
                          backgroundColor: "rgba(19, 127, 236, 0.15)",
                          border: "1px solid rgba(19, 127, 236, 0.3)",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            color: commonStyles.primaryColor,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Latest
                        </Typography>
                      </Box>
                    )}
                    <QuarterChart quarter={quarter} ticker={ticker} darkMode={darkMode} size="small" showTitle={true} />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PriceChartDialog;