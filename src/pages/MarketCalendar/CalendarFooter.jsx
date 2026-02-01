import React from "react";
import { Box, Typography } from "@mui/material";
import { Verified } from "@mui/icons-material";
import { getEventStatistics, findEarningsWave } from "./calendarUtils";
import { getThemeStyles, commonStyles, getEventColors } from "./calendarStyles";

const CalendarFooter = ({ year, month, events, darkMode }) => {
  const themeStyles = getThemeStyles(darkMode);
  const stats = getEventStatistics(events, year, month);
  const earningsWave = findEarningsWave(events, year, month);
  const earningsColors = getEventColors("EARNINGS", darkMode);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 2 },
        backgroundColor: themeStyles.headerBackground,
        borderTop: `1px solid ${themeStyles.borderColor}`,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: { xs: 2, md: 0 },
      }}
    >
      {/* Statistics */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1.5, sm: 3 }, width: { xs: "100%", md: "auto" } }}>
        {/* Total High Impact Events */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.625rem" },
              fontWeight: 700,
              color: themeStyles.textSecondary,
              textTransform: "uppercase",
              letterSpacing: "1.2px",
              mb: 0.3,
            }}
          >
            Total High Impact
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.125rem" },
              fontWeight: 700,
              color: themeStyles.textPrimary,
              fontFamily: commonStyles.fontFamily,
            }}
          >
            {stats.highImpact} Event{stats.highImpact !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {/* Divider - Hidden on mobile */}
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            width: "1px",
            height: "32px",
            backgroundColor: themeStyles.borderColor,
          }}
        />

        {/* Earnings Wave Period */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.625rem" },
              fontWeight: 700,
              color: themeStyles.textSecondary,
              textTransform: "uppercase",
              letterSpacing: "1.2px",
              mb: 0.3,
            }}
          >
            Earnings Wave
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.125rem" },
              fontWeight: 700,
              color: earningsWave
                ? earningsColors.primary
                : themeStyles.textSecondary,
              fontFamily: commonStyles.fontFamily,
            }}
          >
            {earningsWave
              ? `${earningsWave.start} - ${earningsWave.end}`
              : "No Activity"}
          </Typography>
        </Box>

        {/* Earnings Count */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1.5, sm: 2 },
            pl: { xs: 0, sm: 2 },
            borderLeft: { xs: "none", sm: `1px solid ${themeStyles.borderColor}` },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: { xs: "5px", sm: "6px" },
                height: { xs: "5px", sm: "6px" },
                borderRadius: "50%",
                backgroundColor: earningsColors.primary,
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                fontWeight: 600,
                color: themeStyles.textSecondary,
              }}
            >
              {stats.earnings} Earnings
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Data Source Badge */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography
          sx={{
            fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
            color: themeStyles.textSecondary,
            fontStyle: "italic",
            display: { xs: "none", sm: "block" },
          }}
        >
          Institutional Grade Data Feed
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.625rem" },
            fontWeight: 700,
            color: commonStyles.primaryColor,
            backgroundColor: "rgba(19, 127, 236, 0.1)",
            px: { xs: 0.75, sm: 1 },
            py: { xs: 0.4, sm: 0.5 },
            borderRadius: "4px",
          }}
        >
          <Verified sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" } }} />
          VERIFIED
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarFooter;