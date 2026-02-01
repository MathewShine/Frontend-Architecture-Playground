import React from "react";
import { Box, Typography } from "@mui/material";
import { formatShortDate, formatVolume } from "./previousEarningsApi";
import { getThemeStyles } from "./calendarStyles";

/**
 * Mini Price Chart Component
 * Shows 7-day price trend with prices on top of dots, dates below bars
 */
const MiniPriceChart = ({ priceData, darkMode }) => {
  const themeStyles = getThemeStyles(darkMode);

  if (!priceData || !priceData.earningsDay) {
    return (
      <Box
        sx={{
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.65rem",
            color: themeStyles.textSecondary,
            fontStyle: "italic",
          }}
        >
          No price data available
        </Typography>
      </Box>
    );
  }

  // Combine all 7 days: 3 before + earnings day + 3 after
  const allDays = [
    ...(priceData.before || []),
    priceData.earningsDay,
    ...(priceData.after || []),
  ];

  // Filter out any null/undefined days
  const validDays = allDays.filter(day => day && day.close !== undefined);

  if (validDays.length === 0) {
    return null;
  }

  // Find earnings day index
  const earningsIndex = priceData.before ? priceData.before.length : 0;

  // Calculate chart dimensions - BIGGER CHART
  const chartWidth = 400;
  const chartHeight = 110;
  const lineChartHeight = 65;
  const volumeHeight = 30;
  const padding = { top: 15, right: 10, bottom: 15, left: 10 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = lineChartHeight - padding.top - padding.bottom;

  // Get price and volume ranges
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

  // Create line path
  const linePath = validDays
    .map((day, i) => {
      const x = xScale(i);
      const y = yScale(day.close);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  // Determine earnings reaction
  const earningsReaction = priceData.earningsReaction;
  let reactionText = null;
  let reactionColor = themeStyles.textSecondary;

  if (earningsReaction) {
    if (earningsReaction.amc && earningsReaction.amc.price_change_pct !== null) {
      const change = earningsReaction.amc.price_change;
      const pct = earningsReaction.amc.price_change_pct;
      reactionText = `AMC ${change >= 0 ? '+' : ''}$${Math.abs(change).toFixed(2)} (${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%)`;
      reactionColor = pct >= 0 ? "#10b981" : "#ef4444";
    } else if (earningsReaction.bmo && earningsReaction.bmo.price_change_pct !== null) {
      const change = earningsReaction.bmo.price_change;
      const pct = earningsReaction.bmo.price_change_pct;
      reactionText = `BMO ${change >= 0 ? '+' : ''}$${Math.abs(change).toFixed(2)} (${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%)`;
      reactionColor = pct >= 0 ? "#10b981" : "#ef4444";
    }
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {/* Chart SVG */}
      <Box sx={{ position: "relative" }}>
        <svg width={chartWidth} height={chartHeight}>
          {/* Price line */}
          <path
            d={linePath}
            fill="none"
            stroke={darkMode ? "#4ade80" : "#137fec"}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Price points with VALUES ON TOP */}
          {validDays.map((day, i) => {
            const x = xScale(i);
            const y = yScale(day.close);
            const isEarningsDay = i === earningsIndex;
            
            return (
              <g key={`point-${i}`}>
                {/* Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isEarningsDay ? 5 : 3}
                  fill={isEarningsDay ? "#137fec" : (darkMode ? "#4ade80" : "#137fec")}
                  stroke={isEarningsDay ? "#ffffff" : "none"}
                  strokeWidth={isEarningsDay ? 2 : 0}
                />
                
                {/* Price value ON TOP of dot */}
                <text
                  x={x}
                  y={y - 8}
                  fontSize="9"
                  fill={themeStyles.textPrimary}
                  fontWeight={isEarningsDay ? 700 : 600}
                  textAnchor="middle"
                >
                  ${day.close.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Volume bars with ONLY VOLUME inside */}
          <g transform={`translate(0, ${lineChartHeight})`}>
            {validDays.map((day, i) => {
              const x = xScale(i);
              const barWidth = plotWidth / validDays.length * 0.75;
              const barHeight = volumeScale(day.volume);
              const y = volumeHeight - barHeight;
              const isEarningsDay = i === earningsIndex;
              
              return (
                <g key={`vol-${i}`}>
                  {/* Volume bar */}
                  <rect
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={isEarningsDay ? "#137fec" : darkMode ? "#324d67" : "#cbd5e1"}
                    opacity={0.8}
                    rx={2}
                  />
                  
                  {/* VOLUME text INSIDE bar */}
                  {barHeight > 12 && (
                    <text
                      x={x}
                      y={y + barHeight / 2 + 3}
                      fontSize="8"
                      fill={darkMode ? "#ffffff" : "#1e293b"}
                      fontWeight={600}
                      textAnchor="middle"
                    >
                      {formatVolume(day.volume)}
                    </text>
                  )}
                  
                  {/* Date BELOW the bar */}
                  <text
                    x={x}
                    y={volumeHeight + 12}
                    fontSize="8.5"
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

      {/* Earnings Reaction - RIGHT SIDE */}
      {reactionText && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 1.5,
            py: 0.75,
            borderRadius: "6px",
            bgcolor: darkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.95)",
            border: `1.5px solid ${reactionColor}`,
            minWidth: "140px",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: reactionColor,
              whiteSpace: "nowrap",
            }}
          >
            {reactionText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MiniPriceChart;