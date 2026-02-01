import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import {
  RocketLaunch,
  VerifiedUser,
  Key,
  Description,
  Schedule,
} from "@mui/icons-material";

const HeroSection = ({ darkMode }) => {
  const navigate = useNavigate();
  const [terminalLines, setTerminalLines] = useState([]);
  const [sentiment, setSentiment] = useState(84);

  const commands = [
    { type: "BUY", symbol: "AAPL", price: "$182.52", qty: "100", status: "EXECUTED" },
    { type: "EVENT", symbol: "TSLA", message: "Earnings Report Released", status: "LIVE" },
    { type: "SELL", symbol: "MSFT", price: "$378.91", qty: "200", status: "EXECUTED" },
    { type: "NEWS", symbol: "NVDA", message: "Positive Sentiment Surge +15%", status: "ALERT" },
    { type: "BUY", symbol: "GOOGL", price: "$141.80", qty: "150", status: "EXECUTED" },
    { type: "EVENT", symbol: "META", message: "Q4 Earnings Beat Expectations", status: "LIVE" },
    { type: "SELL", symbol: "AMZN", price: "$178.25", qty: "100", status: "EXECUTED" },
    { type: "NEWS", symbol: "AAPL", message: "iPhone Sales Data Released", status: "ALERT" },
    { type: "BUY", symbol: "NVDA", price: "$495.22", qty: "75", status: "EXECUTED" },
    { type: "EVENT", symbol: "GOOGL", message: "Fed Interest Rate Decision", status: "LIVE" },
    { type: "SELL", symbol: "NFLX", price: "$632.54", qty: "30", status: "EXECUTED" },
    { type: "NEWS", symbol: "TSLA", message: "Negative Sentiment Drop -8%", status: "ALERT" },
    { type: "BUY", symbol: "META", price: "$474.99", qty: "80", status: "EXECUTED" },
    { type: "EVENT", symbol: "AMZN", message: "AWS Revenue Report Out", status: "LIVE" },
  ];

  // Terminal lines animation
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setTerminalLines((prev) => {
        const newLines = [...prev, commands[currentIndex % commands.length]];
        if (newLines.length > 8) newLines.shift();
        return newLines;
      });
      currentIndex++;
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Live sentiment animation
  useEffect(() => {
    const sentimentInterval = setInterval(() => {
      // Generate random sentiment between 20 and 90
      const newSentiment = Math.floor(Math.random() * 71) + 20; // 20 to 90
      setSentiment(newSentiment);
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(sentimentInterval);
  }, []);

  // Get sentiment label and color based on value
  const getSentimentData = (value) => {
    if (value >= 60) {
      return { label: "Bullish", color: "#22c55e" }; // Green
    } else if (value >= 40) {
      return { label: "Neutral", color: "#f59e0b" }; // Amber
    } else {
      return { label: "Bearish", color: "#ef4444" }; // Red
    }
  };

  const sentimentData = getSentimentData(sentiment);

  const trustItems = [
    {
      icon: <VerifiedUser sx={{ fontSize: 28, color: "#137fec" }} />,
      title: "Read-only mode",
      description: "Zero-risk data observation",
    },
    {
      icon: <Key sx={{ fontSize: 28, color: "#137fec" }} />,
      title: "Secure sessions",
      description: "AES-256 bank-level encryption",
    },
    {
      icon: <Description sx={{ fontSize: 28, color: "#137fec" }} />,
      title: "Audit-friendly",
      description: "Full trade history logging",
    },
    {
      icon: <Schedule sx={{ fontSize: 28, color: "#137fec" }} />,
      title: "Market-aligned",
      description: "Low-latency synchronization",
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: darkMode 
            ? "radial-gradient(circle, #233648 1px, transparent 1px)"
            : "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          opacity: 0.1,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 3, sm: 6 },
          pt: { xs: 8, md: 12 },
          pb: { xs: 12, md: 16 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 8, lg: 16 },
            alignItems: "center",
          }}
        >
          {/* Text Content */}
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", lg: "600px" },
              textAlign: { xs: "center", lg: "left" },
            }}
          >
            {/* Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: "9999px",
                bgcolor: "rgba(19, 127, 236, 0.1)",
                border: "1px solid rgba(19, 127, 236, 0.2)",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#137fec",
                  animation: "pulse 2s infinite",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#137fec",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Now Integrated with Intelligence Terminal
              </Typography>
            </Box>

            {/* Heading */}
            <Typography
              sx={{
                fontSize: { xs: "2.5rem", md: "3.75rem" },
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                mb: 3,
                color: darkMode ? "#ffffff" : "#0a0a0c",
              }}
            >
              Trade with{" "}
              <Box component="span" sx={{ color: "#137fec" }}>
                signals
              </Box>
              , not noise.
            </Typography>

            {/* Subheading */}
            <Typography
              sx={{
                fontSize: { xs: "1.125rem", md: "1.25rem" },
                color: darkMode ? "#94a3b8" : "#64748b",
                lineHeight: 1.6,
                mb: 5,
                maxWidth: { xs: "100%", lg: "540px" },
                mx: { xs: "auto", lg: 0 },
              }}
            >
              Calendar-driven intelligence and institutional P&L simulation for
              serious traders who demand precision execution.
            </Typography>

            {/* CTA Button */}
            <Button
              onClick={() => navigate("/login")}
              startIcon={<RocketLaunch />}
              sx={{
                height: 56,
                px: 4,
                bgcolor: "#137fec",
                color: "#ffffff",
                fontSize: "1.125rem",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "12px",
                boxShadow: "0 20px 40px rgba(19, 127, 236, 0.3)",
                "&:hover": {
                  bgcolor: "#0d6ecd",
                  transform: "scale(1.02)",
                  boxShadow: "0 24px 48px rgba(19, 127, 236, 0.4)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Start Trading
            </Button>
          </Box>

          {/* Dashboard Terminal Preview */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
              maxWidth: { xs: "100%", lg: "640px" },
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: "12px",
                border: darkMode ? "1px solid #233648" : "1px solid #cbd5e1",
                bgcolor: darkMode ? "#161618" : "#ffffff",
                p: 1,
                overflow: "hidden",
                boxShadow: darkMode 
                  ? "0 0 50px -12px rgba(19, 127, 236, 0.3)"
                  : "0 10px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Dashboard Header Mockup */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  borderBottom: darkMode ? "1px solid #233648" : "1px solid #e2e8f0",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "rgba(239, 68, 68, 0.2)",
                    }}
                  />
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "rgba(251, 191, 36, 0.2)",
                    }}
                  />
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "rgba(34, 197, 94, 0.2)",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    color: "#64748b",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  ALGO_TERMINAL_V4.2
                </Typography>
              </Box>

              {/* Terminal Content - Scrolling Commands */}
              <Box
                sx={{
                  width: "100%",
                  height: 360,
                  borderRadius: "8px",
                  bgcolor: darkMode ? "#0a0e14" : "#f8fafc",
                  p: 2,
                  fontFamily: "'Courier New', monospace",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {terminalLines.map((line, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      fontSize: "0.875rem",
                      opacity: 1 - (terminalLines.length - index - 1) * 0.15,
                      animation: "slideIn 0.3s ease-out",
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: darkMode ? "#64748b" : "#94a3b8",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                      }}
                    >
                      $
                    </Typography>
                    
                    {/* BUY/SELL Orders */}
                    {(line.type === "BUY" || line.type === "SELL") && (
                      <>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: line.type === "BUY" ? "#22c55e" : "#ef4444",
                            fontWeight: 700,
                          }}
                        >
                          {line.type}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#60a5fa",
                            fontWeight: 700,
                          }}
                        >
                          {line.symbol}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#94a3b8",
                          }}
                        >
                          @{line.price}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#94a3b8",
                          }}
                        >
                          QTY:{line.qty}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#22c55e",
                            ml: "auto",
                            mr: 2,
                          }}
                        >
                          [{line.status}]
                        </Typography>
                      </>
                    )}
                    
                    {/* EVENT Messages */}
                    {line.type === "EVENT" && (
                      <>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#f59e0b",
                            fontWeight: 700,
                          }}
                        >
                          EVENT
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#60a5fa",
                            fontWeight: 700,
                          }}
                        >
                          {line.symbol}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#94a3b8",
                          }}
                        >
                          {line.message}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#f59e0b",
                            ml: "auto",
                            mr: 2,
                          }}
                        >
                          [{line.status}]
                        </Typography>
                      </>
                    )}
                    
                    {/* NEWS Messages */}
                    {line.type === "NEWS" && (
                      <>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#8b5cf6",
                            fontWeight: 700,
                          }}
                        >
                          NEWS
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#60a5fa",
                            fontWeight: 700,
                          }}
                        >
                          {line.symbol}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#94a3b8",
                          }}
                        >
                          {line.message}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            color: "#8b5cf6",
                            ml: "auto",
                            mr: 2,
                          }}
                        >
                          [{line.status}]
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
                {/* Blinking Cursor */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    color: darkMode ? "#64748b" : "#94a3b8",
                    fontSize: "0.875rem",
                  }}
                >
                  <Typography component="span" sx={{ fontFamily: "inherit" }}>
                    $
                  </Typography>
                  <Box
                    sx={{
                      width: 8,
                      height: 14,
                      bgcolor: "#22c55e",
                      animation: "blink 1s infinite",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Floating Sentiment Card - Live Updates */}
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: -24, sm: -32 },
                left: { xs: -12, md: -48 },
                display: { xs: "none", sm: "block" },
                p: 2,
                borderRadius: "12px",
                bgcolor: darkMode ? "#1e293b" : "#ffffff",
                border: darkMode ? "1px solid #233648" : "1px solid #cbd5e1",
                boxShadow: darkMode 
                  ? "0 20px 40px rgba(0, 0, 0, 0.5)"
                  : "0 10px 30px rgba(0, 0, 0, 0.15)",
                maxWidth: "200px",
                transition: "all 0.3s ease",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Sentiment
                </Typography>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: sentimentData.color,
                    animation: "pulse 2s infinite",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  mb: 1,
                  color: sentimentData.color,
                  transition: "color 0.3s ease",
                }}
              >
                {sentiment}% {sentimentData.label}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 6,
                  borderRadius: "9999px",
                  bgcolor: darkMode ? "#334155" : "#e2e8f0",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${sentiment}%`,
                    height: "100%",
                    bgcolor: sentimentData.color,
                    borderRadius: "9999px",
                    transition: "all 0.5s ease",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </Box>
  );
};

export default HeroSection;