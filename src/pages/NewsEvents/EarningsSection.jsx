import React from "react";
import { Box, Typography, Chip } from "@mui/material";

const EarningsSection = ({ events, darkMode }) => {
  const themeColors = {
    bg: darkMode ? "#111a22" : "#ffffff",
    cardBg: darkMode ? "#192633" : "#ffffff",
    border: darkMode ? "#324d67" : "#e5e7eb",
    text: darkMode ? "#ffffff" : "#111827",
    textSecondary: darkMode ? "#92adc9" : "#6b7280",
    featuredBg: darkMode ? "rgba(35, 54, 72, 0.4)" : "rgba(19, 127, 236, 0.05)",
  };

  if (!events || events.length === 0) {
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
          Earnings Info
        </Typography>
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "12px",
            border: `1px solid ${themeColors.border}`,
            backgroundColor: themeColors.cardBg,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: themeColors.textSecondary,
            }}
          >
            No earnings events available for today
          </Typography>
        </Box>
      </Box>
    );
  }

  // Take first event as featured (highest market cap)
  const featuredEvent = events[0];
  const regularEvents = events.slice(1); // Show ALL remaining events

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
        Earnings Info
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Featured Event Card - Same content as regular, just styled differently */}
        <Box
          sx={{
            borderRadius: "12px",
            border: "1px solid rgba(19, 127, 236, 0.2)",
            borderLeft: "4px solid #137fec",
            background: darkMode
              ? "linear-gradient(90deg, rgba(19, 127, 236, 0.1) 0%, rgba(19, 127, 236, 0) 100%)"
              : "linear-gradient(90deg, rgba(19, 127, 236, 0.05) 0%, rgba(19, 127, 236, 0) 100%)",
            backgroundColor: themeColors.featuredBg,
            backdropFilter: "blur(8px)",
            p: 3,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: darkMode ? "#324d67" : "#e5e7eb",
                px: 1,
                py: 0.5,
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: themeColors.text,
              }}
            >
              {featuredEvent.ticker}
            </Box>
            <Chip
              label={featuredEvent.type}
              size="small"
              sx={{
                backgroundColor: darkMode ? "#324d67" : "#e5e7eb",
                color: themeColors.text,
                fontSize: "0.75rem",
                fontWeight: 600,
                height: "24px",
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: themeColors.text,
              mb: 2,
            }}
          >
            {featuredEvent.company}
          </Typography>

          {/* Financial Data */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.8rem",
              }}
            >
              <Typography sx={{ color: themeColors.textSecondary }}>
                Market Cap:
              </Typography>
              <Typography sx={{ fontWeight: 700, color: themeColors.text }}>
                ${(featuredEvent.market_cap / 1000000000).toFixed(2)}B
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.8rem",
              }}
            >
              <Typography sx={{ color: themeColors.textSecondary }}>
                EPS Forecast:
              </Typography>
              <Typography sx={{ fontWeight: 700, color: themeColors.text }}>
                {featuredEvent.eps_forecast
                  ? `$${featuredEvent.eps_forecast.toFixed(2)}`
                  : "N/A"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.8rem",
              }}
            >
              <Typography sx={{ color: themeColors.textSecondary }}>
                Revenue Forecast:
              </Typography>
              <Typography sx={{ fontWeight: 700, color: themeColors.text }}>
                {featuredEvent.revenue_forecast
                  ? `$${(featuredEvent.revenue_forecast / 1000000000).toFixed(
                      2
                    )}B`
                  : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Grid for ALL remaining cards */}
        {regularEvents.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {regularEvents.map((event) => (
              <Box
                key={event.id}
                sx={{
                  borderRadius: "12px",
                  border: `1px solid ${themeColors.border}`,
                  backgroundColor: themeColors.cardBg,
                  p: 2.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: darkMode ? "#324d67" : "#e5e7eb",
                      px: 1,
                      py: 0.5,
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: themeColors.text,
                    }}
                  >
                    {event.ticker}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: themeColors.textSecondary,
                    }}
                  >
                    {event.type}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: themeColors.text,
                    mb: 1.5,
                  }}
                >
                  {event.company}
                </Typography>

                {/* Financial Data */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.7rem",
                    }}
                  >
                    <Typography sx={{ color: themeColors.textSecondary }}>
                      Market Cap:
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: themeColors.text }}>
                      ${(event.market_cap / 1000000000).toFixed(2)}B
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.7rem",
                    }}
                  >
                    <Typography sx={{ color: themeColors.textSecondary }}>
                      EPS Forecast:
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: themeColors.text }}>
                      {event.eps_forecast
                        ? `$${event.eps_forecast.toFixed(2)}`
                        : "N/A"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.7rem",
                    }}
                  >
                    <Typography sx={{ color: themeColors.textSecondary }}>
                      Revenue Forecast:
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: themeColors.text }}>
                      {event.revenue_forecast
                        ? `$${(event.revenue_forecast / 1000000000).toFixed(2)}B`
                        : "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EarningsSection;