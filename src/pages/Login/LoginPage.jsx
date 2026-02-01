import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import {
  Lock,
  AlternateEmail,
  Key,
  Visibility,
  VisibilityOff,
  ArrowForward,
  VerifiedUser,
  Security,
} from "@mui/icons-material";
import LandingHeader from "../LandingPage/LandingHeader";

// Subtle Market Chart Lines Animation Component
const MarketChartBackground = ({ darkMode }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const chartsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Chart Line class
    class ChartLine {
      constructor() {
        this.points = [];
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 0.5 + 0.3;
        this.amplitude = Math.random() * 30 + 20;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.offset = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.color = darkMode 
          ? `rgba(19, 127, 236, ${this.opacity})` 
          : `rgba(19, 127, 236, ${this.opacity * 0.6})`;
        this.lineWidth = Math.random() * 1 + 0.5;
        
        // Initialize points
        for (let x = 0; x < canvas.width + 50; x += 10) {
          const y = this.y + Math.sin(x * this.frequency + this.offset) * this.amplitude;
          this.points.push({ x, y });
        }
      }

      update() {
        // Shift all points left
        this.points.forEach(point => {
          point.x -= this.speed;
        });

        // Remove points that went off screen
        this.points = this.points.filter(point => point.x > -50);

        // Add new points on the right
        while (this.points.length < (canvas.width + 50) / 10) {
          const lastPoint = this.points[this.points.length - 1];
          const newX = lastPoint ? lastPoint.x + 10 : canvas.width;
          const newY = this.y + Math.sin(newX * this.frequency + this.offset) * this.amplitude;
          this.points.push({ x: newX, y: newY });
        }
      }

      draw() {
        if (this.points.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();

        // Optional: Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Candlestick class for variety
    class Candlestick {
      constructor() {
        this.x = canvas.width + Math.random() * 200;
        this.y = Math.random() * canvas.height;
        this.width = Math.random() * 3 + 2;
        this.height = Math.random() * 40 + 20;
        this.speed = Math.random() * 0.3 + 0.2;
        this.isGreen = Math.random() > 0.5;
        this.opacity = Math.random() * 0.1 + 0.03;
        this.color = this.isGreen 
          ? (darkMode ? `rgba(34, 197, 94, ${this.opacity})` : `rgba(34, 197, 94, ${this.opacity * 0.6})`)
          : (darkMode ? `rgba(239, 68, 68, ${this.opacity})` : `rgba(239, 68, 68, ${this.opacity * 0.6})`);
      }

      update() {
        this.x -= this.speed;
        if (this.x < -50) {
          this.x = canvas.width + 50;
          this.y = Math.random() * canvas.height;
        }
      }

      draw() {
        // Wick
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y - 10);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height + 10);
        ctx.stroke();

        // Body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }

    // Initialize charts
    const chartCount = 5;
    const candlestickCount = 15;
    
    chartsRef.current = [
      ...Array.from({ length: chartCount }, () => new ChartLine()),
      ...Array.from({ length: candlestickCount }, () => new Candlestick())
    ];

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      chartsRef.current.forEach((chart) => {
        chart.update();
        chart.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

const LoginPage = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@portal.ai");
  const [password, setPassword] = useState("admin123");

  const handleLogin = () => {
    // Add your login logic here
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: darkMode ? "#0a0a0c" : "#f6f7f8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Market Chart Lines Background */}
      <MarketChartBackground darkMode={darkMode} />

      {/* Header */}
      <LandingHeader darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          position: "relative",
          zIndex: 1,
          pt:1
        }}
      >
        {/* Login Card */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 460,
            p: 4,
            borderRadius: "12px",
            bgcolor: darkMode
              ? "rgba(25, 38, 51, 0.7)"
              : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            border: darkMode
              ? "1px solid rgba(50, 77, 103, 0.5)"
              : "1px solid rgba(203, 213, 225, 0.5)",
            boxShadow: darkMode
              ? "0 20px 40px rgba(0, 0, 0, 0.5)"
              : "0 10px 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Lock Icon & Title */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1.5,
                mb: 2,
                borderRadius: "50%",
                bgcolor: "rgba(19, 127, 236, 0.1)",
              }}
            >
              <Lock sx={{ fontSize: 32, color: "#137fec" }} />
            </Box>
            <Typography
              sx={{
                fontSize: "1.875rem",
                fontWeight: 700,
                color: darkMode ? "#ffffff" : "#0a0a0c",
                mb: 1,
              }}
            >
              Secure Login
            </Typography>
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#92adc9",
              }}
            >
              Trading Intelligence Dashboard
            </Typography>
          </Box>

          {/* Form Fields */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Email Field */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  mb: 1,
                }}
              >
                <AlternateEmail sx={{ fontSize: 14, color: "#137fec" }} />
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: darkMode ? "#ffffff" : "#0a0a0c",
                  }}
                >
                  Professional Email
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="email"
                placeholder="e.g. name@firm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 48,
                    bgcolor: darkMode ? "#101922" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#0a0a0c",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#324d67",
                    },
                    "&:hover fieldset": {
                      borderColor: "#137fec",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#137fec",
                      borderWidth: 1,
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    "&::placeholder": {
                      color: "#4a6b8a",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Key sx={{ fontSize: 14, color: "#137fec" }} />
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: darkMode ? "#ffffff" : "#0a0a0c",
                    }}
                  >
                    Password
                  </Typography>
                </Box>
                <Link
                  href="#"
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#137fec",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot?
                </Link>
              </Box>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          color: "#4a6b8a",
                          "&:hover": {
                            color: darkMode ? "#ffffff" : "#0a0a0c",
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 48,
                    bgcolor: darkMode ? "#101922" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#0a0a0c",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#324d67",
                    },
                    "&:hover fieldset": {
                      borderColor: "#137fec",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#137fec",
                      borderWidth: 1,
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    "&::placeholder": {
                      color: "#4a6b8a",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            {/* Sign In Button */}
            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleLogin}
              sx={{
                height: 56,
                bgcolor: "#137fec",
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "8px",
                boxShadow: "0 8px 24px rgba(19, 127, 236, 0.2)",
                "&:hover": {
                  bgcolor: "#0d6ecd",
                  boxShadow: "0 12px 32px rgba(19, 127, 236, 0.3)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Dashboard
            </Button>
          </Box>

          {/* Footer Info */}
          <Box
            sx={{
              mt: 5,
              pt: 3,
              borderTop: "1px solid rgba(50, 77, 103, 0.5)",
              textAlign: "center",
            }}
          >
            {/* Security Badges */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <VerifiedUser sx={{ fontSize: 14, color: "#22c55e" }} />
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "#92adc9",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  SSL Secure
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "1px",
                  height: "16px",
                  bgcolor: "#324d67",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <Security sx={{ fontSize: 14, color: "#92adc9" }} />
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "#92adc9",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  AES-256
                </Typography>
              </Box>
            </Box>

            {/* Terms & Privacy */}
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#4a6b8a",
                lineHeight: 1.5,
              }}
            >
              By logging in, you agree to AlgoPivot's{" "}
              <Link
                href="#"
                sx={{
                  color: "#92adc9",
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                  "&:hover": {
                    color: darkMode ? "#ffffff" : "#0a0a0c",
                  },
                }}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                sx={{
                  color: "#92adc9",
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                  "&:hover": {
                    color: darkMode ? "#ffffff" : "#0a0a0c",
                  },
                }}
              >
                Privacy Policy
              </Link>
              .
            </Typography>
          </Box>
        </Box>

        {/* Decorative Background Text - Hidden on Mobile */}
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            position: "absolute",
            bottom: 48,
            right: 48,
            textAlign: "right",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 900,
              color: "#233648",
              opacity: 0.4,
              letterSpacing: "-0.02em",
            }}
          >
            ALGOPIVOT
          </Typography>
          <Typography
            sx={{
              fontSize: "0.575rem",
              fontWeight: 500,
              color: "rgba(19, 127, 236, 0.4)",
              letterSpacing: "0.2em",
              mt: 1,
              textTransform: "uppercase",
            }}
          >
            Precision in Execution
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;