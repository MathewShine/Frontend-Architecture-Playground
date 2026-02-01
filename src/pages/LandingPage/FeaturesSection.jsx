import React from "react";
import { Box, Typography } from "@mui/material";
import {
  Search,
  Bolt,
  Verified,
  Analytics,
} from "@mui/icons-material";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Search sx={{ fontSize: 24 }} />,
      title: "Discover",
      description:
        "Seamless market intelligence integration with global economic calendars. Automatically flag high-impact events that trigger your specific trading models before the market moves.",
      active: true,
    },
    {
      icon: <Bolt sx={{ fontSize: 24 }} />,
      title: "Act",
      description:
        "Execute with high-fidelity workflows. Our terminal provides a unified interface for multiple asset classes, allowing for complex order types and algorithmic execution without leaving the platform.",
      active: false,
    },
    {
      icon: <Verified sx={{ fontSize: 24 }} />,
      title: "Validate",
      description:
        "Run your strategies through institutional-grade P&L simulation. Backtest against tick-by-tick historical data to ensure your risk parameters hold up in volatile environments.",
      active: false,
    },
    {
      icon: <Analytics sx={{ fontSize: 24 }} />,
      title: "Drill-down",
      description:
        "Perform deep-dive post-trade analytics. Understand the 'why' behind every win and loss with detailed attribution reports and behavioral performance metrics.",
      active: false,
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 12, md: 24 },
        bgcolor: "#0c0c0e",
      }}
    >
      <Box
        sx={{
          maxWidth: "960px",
          mx: "auto",
          px: { xs: 3, sm: 6 },
        }}
      >
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 10, md: 20 } }}>
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 900,
              mb: 2,
            }}
          >
            Precision at every step
          </Typography>
          <Typography
            sx={{
              fontSize: "1.125rem",
              color: "#64748b",
            }}
          >
            A narrative workflow designed for professional execution.
          </Typography>
        </Box>

        {/* Timeline - Vertical Line with Icons */}
        <Box sx={{ position: "relative" }}>
          {/* Continuous Vertical Line */}
          <Box
            sx={{
              position: "absolute",
              left: 24,
              top: 48,
              bottom: 48,
              width: 2,
              bgcolor: "#233648",
            }}
          />

          {/* Features */}
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 4,
                mb: index < features.length - 1 ? 8 : 0,
                position: "relative",
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: feature.active ? "#137fec" : "transparent",
                    border: feature.active ? "none" : "2px solid #233648",
                    color: feature.active ? "#ffffff" : "#64748b",
                    boxShadow: feature.active
                      ? "0 8px 20px rgba(19, 127, 236, 0.2)"
                      : "none",
                  }}
                >
                  {feature.icon}
                </Box>
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, pt: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "#94a3b8",
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturesSection;