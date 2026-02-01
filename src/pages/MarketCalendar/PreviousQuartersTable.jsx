import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ShowChart } from "@mui/icons-material";
import { fetchPreviousEarnings, formatRevenue } from "./previousEarningsApi";
import { getThemeStyles, commonStyles } from "./calendarStyles";
import PriceChartDialog from "./PriceChartDialog";

const PreviousQuartersTable = ({ ticker, darkMode }) => {
  const themeStyles = getThemeStyles(darkMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quartersData, setQuartersData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  useEffect(() => {
    loadPreviousEarnings();
  }, [ticker]);

  const loadPreviousEarnings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPreviousEarnings(ticker);
      setQuartersData(data);
    } catch (err) {
      console.error("Error loading previous earnings:", err);
      setError("Failed to load historical data");
    } finally {
      setLoading(false);
    }
  };

  const formatReleaseDate = (dateStr) => {
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatPeriodEnd = (dateStr) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${month}/${date.getFullYear()}`;
  };

  const formatEPS = (eps) => {
    if (eps === null || eps === undefined) return "--";
    return eps.toFixed(2);
  };

  const calculateSurprise = (actual, estimated) => {
    if (!estimated || estimated === 0) return 0;
    return ((actual - estimated) / Math.abs(estimated)) * 100;
  };

  const formatSurprise = (surprise) => {
    if (surprise === 0) return { text: "0%", color: themeStyles.textSecondary };
    const color = surprise > 0 ? "#10b981" : "#ef4444";
    return {
      text: `${surprise > 0 ? "+" : ""}${surprise.toFixed(2)}%`,
      color: color
    };
  };

  const handleChartClick = (quarter) => {
    setSelectedQuarter(quarter);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 4, backgroundColor: darkMode ? "rgba(255, 255, 255, 0.01)" : "rgba(248, 250, 252, 0.5)" }}>
        <CircularProgress size={24} sx={{ color: commonStyles.primaryColor }} />
        <Typography sx={{ ml: 2, fontSize: "0.75rem", color: themeStyles.textSecondary, fontFamily: commonStyles.fontFamily }}>
          Loading historical data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 3, px: 2, textAlign: "center", backgroundColor: darkMode ? "rgba(255, 255, 255, 0.01)" : "rgba(248, 250, 252, 0.5)" }}>
        <Typography sx={{ fontSize: "0.75rem", color: "#ef4444", fontFamily: commonStyles.fontFamily }}>{error}</Typography>
      </Box>
    );
  }

  if (!quartersData || !quartersData.quarters || quartersData.quarters.length === 0) {
    return (
      <Box sx={{ py: 3, px: 2, textAlign: "center", backgroundColor: darkMode ? "rgba(255, 255, 255, 0.01)" : "rgba(248, 250, 252, 0.5)" }}>
        <Typography sx={{ fontSize: "0.75rem", color: themeStyles.textSecondary, fontFamily: commonStyles.fontFamily, fontStyle: "italic" }}>
          No historical data available
        </Typography>
      </Box>
    );
  }

              const sortedQuarters = [...quartersData.quarters].reverse();

  // Helper function to get earnings reaction text
  const getEarningsReactionText = (quarter) => {
    const earningsReaction = quarter.priceData?.earningsReaction;
    if (!earningsReaction) {
      return { text: "--", color: themeStyles.textSecondary };
    }

    if (earningsReaction.amc && earningsReaction.amc.price_change_pct !== null) {
      const change = earningsReaction.amc.price_change;
      const pct = earningsReaction.amc.price_change_pct;
      const color = pct >= 0 ? "#10b981" : "#ef4444";
      return {
        text: `${change >= 0 ? '+' : ''}$${Math.abs(change).toFixed(2)} (${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%)`,
        color: color,
      };
    } else if (earningsReaction.bmo && earningsReaction.bmo.price_change_pct !== null) {
      const change = earningsReaction.bmo.price_change;
      const pct = earningsReaction.bmo.price_change_pct;
      const color = pct >= 0 ? "#10b981" : "#ef4444";
      return {
        text: `${change >= 0 ? '+' : ''}$${Math.abs(change).toFixed(2)} (${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%)`,
        color: color,
      };
    }

    return { text: "--", color: themeStyles.textSecondary };
  };

  return (
    <>
      <Box sx={{ 
        py: 2, 
        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.03)",
        borderRadius: "4px",
      }}>
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: themeStyles.textSecondary, textTransform: "capitalize", letterSpacing: "0.5px", mb: 1.5, px: 2, fontFamily: commonStyles.fontFamily }}>
          previous four quarters
        </Typography>

        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(248, 250, 252, 1)", color: themeStyles.textSecondary, fontWeight: 700, fontSize: "0.65rem", textTransform: "capitalize", borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 1, fontFamily: commonStyles.fontFamily, width: "70px", minWidth: "70px", maxWidth: "70px" }}>
                Release Date
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(248, 250, 252, 1)", color: themeStyles.textSecondary, fontWeight: 700, fontSize: "0.65rem", textTransform: "capitalize", borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 1, fontFamily: commonStyles.fontFamily, width: "120px", minWidth: "120px", maxWidth: "120px" }}>
                Period End
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(248, 250, 252, 1)", color: themeStyles.textSecondary, fontWeight: 700, fontSize: "0.65rem", textTransform: "capitalize", borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 1, fontFamily: commonStyles.fontFamily, width: "120px", minWidth: "120px", maxWidth: "120px" }}>
                EPS / Forecast
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(248, 250, 252, 1)", color: themeStyles.textSecondary, fontWeight: 700, fontSize: "0.65rem", textTransform: "capitalize", borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 1, fontFamily: commonStyles.fontFamily, width: "120px", minWidth: "120px", maxWidth: "120px" }}>
                Revenue / Forecast
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(248, 250, 252, 1)", color: themeStyles.textSecondary, fontWeight: 700, fontSize: "0.65rem", textTransform: "capitalize", borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 1, fontFamily: commonStyles.fontFamily, width: "140px", minWidth: "140px", maxWidth: "140px" }}>
                EPS Surprise %
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(248, 250, 252, 1)", color: themeStyles.textSecondary, fontWeight: 700, fontSize: "0.65rem", textTransform: "capitalize", borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 1, fontFamily: commonStyles.fontFamily, width: "160px", minWidth: "160px", maxWidth: "160px" }}>
                Revenue Surprise %
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(248, 250, 252, 1)", color: themeStyles.textSecondary, fontWeight: 700, fontSize: "0.65rem", textTransform: "capitalize", borderBottom: `1px solid ${themeStyles.borderColor}`, py: 1, fontFamily: commonStyles.fontFamily, width: "220px", minWidth: "220px", maxWidth: "220px" }}>
                Price Reaction
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedQuarters.map((quarter) => {
              const epsSurprise = calculateSurprise(quarter.epsActual, quarter.epsEstimated);
              const revenueSurprise = calculateSurprise(quarter.revenueActual, quarter.revenueEstimated);
              const epsSurpriseFormatted = formatSurprise(epsSurprise);
              const revenueSurpriseFormatted = formatSurprise(revenueSurprise);
              const earningsReaction = getEarningsReactionText(quarter);

              return (
                <TableRow key={quarter.date} sx={{ "&:hover": { backgroundColor: themeStyles.cellHoverBackground }, "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell sx={{ color: themeStyles.textPrimary, fontSize: "0.7rem", fontWeight: 600, borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 0.6, fontFamily: commonStyles.fontFamily, verticalAlign: "middle", width: "70px" }}>
                    {formatReleaseDate(quarter.date)}
                  </TableCell>
                  <TableCell align="center" sx={{ color: themeStyles.textSecondary, fontSize: "0.7rem", borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 0.6, fontFamily: commonStyles.fontFamily, verticalAlign: "middle", width: "120px" }}>
                    {formatPeriodEnd(quarter.date)}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 0.6, verticalAlign: "middle", width: "120px" }}>
                    <Typography component="span" sx={{ fontSize: "0.7rem", fontWeight: 600, color: themeStyles.textPrimary, fontFamily: commonStyles.fontFamily }}>
                      {formatEPS(quarter.epsActual)}
                    </Typography>
                    <Typography component="span" sx={{ fontSize: "0.7rem", color: themeStyles.textSecondary, mx: 0.5 }}>/</Typography>
                    <Typography component="span" sx={{ fontSize: "0.7rem", color: themeStyles.textSecondary, fontFamily: commonStyles.fontFamily }}>
                      {formatEPS(quarter.epsEstimated)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 0.6, verticalAlign: "middle", width: "120px" }}>
                    <Typography component="span" sx={{ fontSize: "0.7rem", fontWeight: 600, color: themeStyles.textPrimary, fontFamily: commonStyles.fontFamily }}>
                      {formatRevenue(quarter.revenueActual)}
                    </Typography>
                    <Typography component="span" sx={{ fontSize: "0.7rem", color: themeStyles.textSecondary, mx: 0.5 }}>/</Typography>
                    <Typography component="span" sx={{ fontSize: "0.7rem", color: themeStyles.textSecondary, fontFamily: commonStyles.fontFamily }}>
                      {formatRevenue(quarter.revenueEstimated)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ color: epsSurpriseFormatted.color, fontSize: "0.7rem", fontWeight: 700, borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 0.6, fontFamily: commonStyles.fontFamily, verticalAlign: "middle", width: "140px" }}>
                    {epsSurpriseFormatted.text}
                  </TableCell>
                  <TableCell align="center" sx={{ color: revenueSurpriseFormatted.color, fontSize: "0.7rem", fontWeight: 700, borderBottom: `1px solid ${themeStyles.borderColor}`, borderRight: `1px solid ${themeStyles.borderColor}`, py: 0.6, fontFamily: commonStyles.fontFamily, verticalAlign: "middle", width: "160px" }}>
                    {revenueSurpriseFormatted.text}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: `1px solid ${themeStyles.borderColor}`, py: 0.6, verticalAlign: "middle", width: "220px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75 }}>
                      <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: earningsReaction.color, fontFamily: commonStyles.fontFamily, whiteSpace: "nowrap" }}>
                        {earningsReaction.text}
                      </Typography>
                      {earningsReaction.text !== "--" && (
                        <IconButton onClick={() => handleChartClick(quarter)} size="small" sx={{ color: commonStyles.primaryColor, p: 0.5, "&:hover": { backgroundColor: "rgba(19, 127, 236, 0.1)" } }}>
                          <ShowChart sx={{ fontSize: 16 }} />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      {selectedQuarter && (
        <PriceChartDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          quartersData={quartersData}
          selectedQuarter={selectedQuarter}
          ticker={ticker}
          darkMode={darkMode}
        />
      )}
    </>
  );
};

export default PreviousQuartersTable;