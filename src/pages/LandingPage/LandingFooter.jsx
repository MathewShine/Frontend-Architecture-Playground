import React from "react";
import { Box, Typography } from "@mui/material";
import alogoPivotLogo from "../../assets/algoPivot-logo.png";

const LandingFooter = () => {
  return (
    <Box
      sx={{
        borderTop: "1px solid #233648",
        bgcolor: "#0a0a0c",
        py: 6,
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "flex-start" },
            gap: 4,
          }}
        >
          {/* Left - Logo and Description */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: { xs: "center", md: "flex-start" },
              maxWidth: "320px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={alogoPivotLogo}
                alt="AlgoPivot Logo"
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1,
                }}
              />
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                AlgoPivot
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "#64748b",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Built for professional traders who value speed, precision, and
              institutional-grade data.
            </Typography>
          </Box>

          {/* Center - Links */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 6, md: 12 },
            }}
          >
            {/* Company Column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  mb: 0.5,
                }}
              >
                Company
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#137fec",
                  },
                  transition: "color 0.2s ease",
                }}
              >
                About
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#137fec",
                  },
                  transition: "color 0.2s ease",
                }}
              >
                Contact
              </Typography>
            </Box>
          </Box>

          {/* Right - Status */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-end" },
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: "9999px",
                bgcolor: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  color: "#22c55e",
                  textTransform: "uppercase",
                }}
              >
                System Status: Operational
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#64748b",
              }}
            >
              © 2024 AlgoPivot. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingFooter;